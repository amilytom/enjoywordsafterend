<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="isEdit ? '编辑教材' : '新增教材'"
    :visible.sync="dialogVisible"
    class="user-modal"
  >
    <el-form
      ref="addForm"
      :model="addForm"
      :rules="addFormRules"
      label-width="100px"
    >
      <el-form-item label="教材名称：" prop="bname">
        <el-input
          v-model.trim="addForm.bname"
          placeholder="请输入教材名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="班级名称：" prop="classid">
        <el-select
          v-model.trim="addForm.classid"
          class="mr10"
          placeholder="请选择班级"
        >
          <el-option
            v-for="item in classOpt"
            :key="item.cid"
            :label="item.cname"
            :value="item.cid"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="教材图片：" prop="cover">
        <el-upload
          ref="upload"
          :action="uploadUrl"
          :auto-upload="false"
          :before-remove="beforeRemove"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :http-request="handleRequest"
          :limit="1"
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          class="upload-demo"
          list-type="picture"
        >
          <el-button slot="trigger" size="small" type="primary"
            >点击上传
          </el-button>
          <el-button
            size="small"
            style="margin-left: 10px"
            type="success"
            @click="submitUpload"
            >上传到服务器
          </el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过2MB
          </div>
        </el-upload>
        <!-- 自定义进度条 -->
        <el-progress
          v-if="isshow"
          :percentage="progressPercent"
          :stroke-width="16"
          class="progress"
        ></el-progress>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="addSubmit"
        >确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import bookApi from "../api/bookApi";
import classApi from "../api/classApi";
import axios from "axios";

export default {
  name: "bookDialog",
  data() {
    return {
      dialogVisible: false,
      isEdit: false,
      addForm: {
        bname: "",
        classid: "",
        cover: "",
      },
      addFormRules: {
        bname: [
          {
            required: true,
            message: "教材名称不能为空",
            trigger: "blur",
          },
        ],
        classid: [
          {
            required: true,
            message: "班级ID不能为空",
            trigger: "blur",
          },
        ],
        cover: [
          {
            required: true,
            message: "教材封面不能为空",
            trigger: "blur",
          },
        ],
      },
      btnLoading: false,
      editUserval: [],
      classOpt: [],
      fileList: [],
      editfile: {},
      isshow: false,
      progressPercent: 0,
      bid: 0,
    };
  },
  computed: {
    uploadUrl() {
      return this.Global.base_url + "/upload";
    },
  },
  mounted() {
    this.getClassList();
  },
  methods: {
    // 打开弹窗，第一个参数是否为编辑，第二参数传入的表单参数
    open(isEdit, rowData = {}) {
      this.isEdit = isEdit;
      this.dialogVisible = true;
      this.$nextTick(() => {
        // 每次打开弹窗执行重置表单方法，为避免首次报错，在弹窗dom加载后才执行
        // resetFields()方法需要每个el-form-item带prop才可以重置。
        this.$refs.addForm.resetFields();
        this.isshow = false;
        // 如果市编辑状态需要在重置表单后，将传入的数据进行表单赋值
        if (isEdit) {
          this.fileList = [];
          this.assignmentAddForm(rowData);
          let coverArr = rowData.cover.split("/");
          console.log(coverArr);
          this.$set(this.editfile, "name", coverArr[coverArr.length - 1]);
          this.$set(this.editfile, "url", this.Global.base_url + rowData.cover);
          this.fileList.push(this.editfile);
          //console.log(this.fileList);
          if (this.fileList.length > 0) {
            this.progressPercent = 100;
          }
        } else {
          this.fileList = [];
          this.progressPercent = 0;
        }
      });
    },

    // 编辑状态给表单赋值
    assignmentAddForm(rowData) {
      //console.log(rowData);
      this.addForm = {
        bname: rowData.bname,
        classid: rowData.bid,
        cover: rowData.cover,
      };
      this.bid = rowData.bid;
      // 保存编辑时修改前用户对象的值
      this.editUserval = Object.assign({}, this.addForm);
    },

    //获取class类别做下拉菜单
    getClassList() {
      let params = {
        dropList: true,
      };
      classApi
        .classList(params)
        .then((res) => {
          console.log(res);
          this.classOpt = res.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //上传前对文件大小进行校验
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传文件大小大小不能超过 2MB!");
        return isLt2M;
      }
    },

    beforeRemove(file, fileList) {
      if (file && this.status == "success") {
        this.$message.warning("正在上传中，不允许删除");
        return false;
      } else {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },

    handleExceed(files, fileList) {
      this.$message.warning(
        "只能上传一个文件。如需更改图片，请先删除当前图片！"
      );
    },

    handleRemove(file, fileList) {
      this.fileList = [];
      this.progressPercent = 0;
    },

    // 自定义上传方法。该方法的触发需要借助于按钮事件。
    handleRequest(data) {
      let formdata = new FormData();
      formdata.append("img", data.file);
      const config = {
        onUploadProgress: (progressEvent) => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          this.progressPercent = Number(
            ((progressEvent.loaded / progressEvent.total) * 100).toFixed(2)
          );
        },
      };
      axios.post(this.uploadUrl, formdata, config).then((res) => {
        console.log(res);
        // fileName 文件名 1604578465238l.mp3
        // path 文件路径 http://127.0.0.1:3030/upload/1604578465238l.mp3
        this.addForm.cover = "/upload/" + res.data.data.fileName;
        this.$message.success("图片上传成功");
      });
    },

    submitUpload() {
      this.isshow = true;
      this.$refs.upload.submit();
    },

    // 提交新增或修改
    addSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (this.progressPercent === 100) {
            if (!this.isEdit) {
              this.addProject();
            } else {
              this.editProject();
            }
          } else {
            this.$message.warning("尚未上传图片");
          }
        } else {
          this.$message.warning("请正确填写表单内容");
          return false;
        }
      });
    },

    // 新增
    addProject() {
      this.btnLoading = true;
      let params = this.addForm;
      console.log(this.addForm);
      bookApi
        .insertbook(params)
        .then((res) => {
          if (res.code === 10000) {
            this.$message.success("创建成功");
            this.dialogVisible = false;
            this.$emit("submit-success");
            this.btnLoading = false;
          } else {
            console.log(res);
            this.btnLoading = false;
          }
        })
        .catch((err) => {
          console.log(err);
          this.btnLoading = false;
        });
    },

    // 编辑
    editProject() {
      this.btnLoading = true;
      this.addForm.bid = this.bid;
      let params = this.addForm;
      bookApi
        .editbook(params)
        .then((res) => {
          if (res.code === 10000) {
            this.$message.success("修改成功");
            this.dialogVisible = false;
            this.$emit("submit-success");
            this.btnLoading = false;
          } else {
            console.log(res);
            this.btnLoading = false;
          }
        })
        .catch((err) => {
          console.log(err);
          this.btnLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.el-progress {
  margin-top: 20px;
}

.el-progress-bar {
  padding-right: 75px;
  margin-right: -75px;
}
</style>
