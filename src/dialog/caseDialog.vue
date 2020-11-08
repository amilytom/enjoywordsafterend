<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="isEdit ? '编辑例句' : '新增例句'"
    :visible.sync="dialogVisible"
    class="user-modal"
  >
    <el-form
      ref="addForm"
      :model="addForm"
      :rules="addFormRules"
      label-width="100px"
    >
      <el-form-item label="英文单词：" prop="wordid">
        <el-select
          v-model="addForm.wordid"
          :loading="loading"
          :remote-method="remoteMethod"
          filterable
          placeholder="请输入英文单词"
          remote
          reserve-keyword
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.word"
            :value="item.wid"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="单词词性：" prop="posid">
        <el-select
          v-model.trim="addForm.posid"
          class="mr10"
          placeholder="请选择词性"
        >
          <el-option
            v-for="item in speechOpt"
            :key="item.cid"
            :label="item.posname"
            :value="item.pid"
          >
            <span style="float: left">{{ item.pos }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.posname
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="例句：" prop="example">
        <el-input
          v-model.trim="addForm.example"
          :rows="2"
          placeholder="请输入例句"
          type="textarea"
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

      <el-form-item label="翻译：" prop="translation">
        <el-input
          v-model.trim="addForm.translation"
          :rows="2"
          placeholder="请输入翻译"
          type="textarea"
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
import caseApi from "../api/caseApi";
import axios from "axios";
import speechApi from "../api/speechApi";
import userApi from "../api/userApi";

export default {
  name: "bookDialog",
  data() {
    return {
      dialogVisible: false,
      isEdit: false,
      addForm: {
        wordid: "",
        example: "",
        voice: "",
        translation: "",
        posid: "",
      },
      addFormRules: {
        wordid: [
          {
            required: true,
            message: "单词不能为空",
            trigger: "blur",
          },
        ],
        example: [
          {
            required: true,
            message: "例句不能为空",
            trigger: "blur",
          },
        ],
        translation: [
          {
            required: true,
            message: "翻译不能为空",
            trigger: "blur",
          },
        ],
      },
      btnLoading: false,
      editUserval: [],
      speechOpt: [],
      fileList: [],
      editfile: {},
      isshow: false,
      progressPercent: 0,
      id: 0,
      loading: false,
      options: [],
    };
  },
  computed: {
    uploadUrl() {
      return this.Global.base_url + "/upload";
    },
  },
  mounted() {
    this.getSpeechList();
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
          this.options = [];
          let params = rowData.wordid;
          wordApi
            .getwordById(params)
            .then((res) => {
              console.log(res);
              this.options.push(res.data);
            })
            .catch((err) => {
              console.log(err);
            });

          let voiceArr = rowData.voice.split("/");
          //console.log(voiceArr);
          this.$set(this.editfile, "name", voiceArr[voiceArr.length - 1]);
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
        wordid: rowData.wordid,
        example: rowData.example,
        voice: rowData.voice,
        translation: rowData.translation,
        posid: rowData.posid,
      };
      this.id = rowData.id;
      // 保存编辑时修改前用户对象的值
      this.editUserval = Object.assign({}, this.addForm);
    },

    //获取class类别做下拉菜单
    getSpeechList() {
      let params = {
        dropList: true,
      };
      speechApi
        .speechList(params)
        .then((res) => {
          //console.log(res);
          this.speechOpt = res.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let params = {
          page: 1,
          rows: 20,
          word: query,
        };
        wordApi
          .wordList(params)
          .then((res) => {
            //console.log(res);
            this.loading = false;
            if (res.data.count > 0) {
              this.options = res.data.list;
            }
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      } else {
        this.options = [];
      }
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
      caseApi
        .insertcase(params)
        .then((res) => {
          this.$message.success("创建成功");
          this.dialogVisible = false;
          this.$emit("submit-success");
          this.btnLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.btnLoading = false;
        });
    },

    // 编辑
    editProject() {
      this.btnLoading = true;
      this.addForm.id = this.id;
      let params = this.addForm;
      caseApi
        .editcase(params)
        .then((res) => {
          this.$message.success("修改成功");
          this.dialogVisible = false;
          this.$emit("submit-success");
          this.btnLoading = false;
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
