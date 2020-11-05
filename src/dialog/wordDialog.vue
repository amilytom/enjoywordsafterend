<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="isEdit ? '编辑单词' : '新增单词'"
    :visible.sync="dialogVisible"
    class="user-modal"
  >
    <el-form
      ref="addForm"
      :model="addForm"
      :rules="addFormRules"
      label-width="80px"
    >
      <el-form-item label="单词：" prop="word">
        <el-input
          v-model.trim="addForm.word"
          placeholder="请输入单词"
        ></el-input>
      </el-form-item>

      <el-form-item label="拼写：" prop="spell">
        <el-input
          v-model.trim="addForm.spell"
          placeholder="请输入拼写"
        ></el-input>
      </el-form-item>

      <el-form-item label="发音：" prop="voice">
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
          accept=".mp3,.wav,.wma"
          class="upload-demo"
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
            只能上传音频文件，且不超过1MB
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

      <el-form-item label="复数：" prop="plural">
        <el-input
          v-model.trim="addForm.plural"
          placeholder="请输入复数"
        ></el-input>
      </el-form-item>

      <el-form-item label="现在式：" prop="doing">
        <el-input
          v-model.trim="addForm.doing"
          placeholder="请输入现在式"
        ></el-input>
      </el-form-item>

      <el-form-item label="过去式：" prop="done">
        <el-input
          v-model.trim="addForm.done"
          placeholder="请输入过去式"
        ></el-input>
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
import wordApi from "../api/wordApi";
import axios from "axios";

export default {
  name: "bookDialog",
  data() {
    return {
      dialogVisible: false,
      isEdit: false,
      addForm: {
        word: "",
        spell: "",
        voice: "",
        plural: "",
        doing: "",
        done: "",
      },
      addFormRules: {
        word: [
          {
            required: true,
            message: "单词不能为空",
            trigger: "blur",
          },
        ],
        spell: [
          {
            required: true,
            message: "拼写不能为空",
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
      wid: 0,
    };
  },
  computed: {
    uploadUrl() {
      return this.Global.base_url + "/upload";
    },
  },
  mounted() {},
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
          let voiceArr = rowData.voice.split("/");
          //console.log(voiceArr);
          this.$set(this.editfile, "name", voiceArr[voiceArr.length - 1]);
          this.$set(this.editfile, "url", this.Global.base_url + rowData.cover);
          this.fileList.push(this.editfile);
          console.log(this.fileList);
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
        word: rowData.word,
        spell: rowData.spell,
        voice: rowData.voice,
        plural: rowData.plural,
        doing: rowData.doing,
        done: rowData.done,
      };
      this.wid = rowData.wid;
      // 保存编辑时修改前用户对象的值
      this.editUserval = Object.assign({}, this.addForm);
    },

    //上传前对文件大小进行校验
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        this.$message.error("上传文件大小大小不能超过 1MB!");
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
      this.$message.warning("只能上传一个文件。如需更改，请先删除当前文件！");
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
        this.addForm.voice = "/upload/" + res.data.data.fileName;
        this.$message.success("文件上传成功");
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
            this.$message.warning("尚未上传文件");
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
      wordApi
        .insertword(params)
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
      this.addForm.wid = this.wid;
      let params = this.addForm;
      wordApi
        .editword(params)
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
