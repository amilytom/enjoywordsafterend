<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="isEdit ? '编辑训练' : '新增训练'"
    :visible.sync="dialogVisible"
    class="user-modal"
  >
    <el-form
      ref="addForm"
      :model="addForm"
      :rules="addFormRules"
      label-width="100px"
    >
      <el-form-item label="标签：" prop="label">
        <el-input
          v-model.trim="addForm.label"
          :disabled="isEdit"
          placeholder="请输入标签"
          style="width: 60%"
        ></el-input>
        <el-button v-if="!isEdit" type="primary" @click="labelRandom"
          >随机生成
        </el-button>
      </el-form-item>

      <el-form-item label="用户：" prop="uid">
        <el-select
          v-model="addForm.uid"
          :loading="loading"
          :remote-method="remoteMethod"
          filterable
          placeholder="请搜索用户"
          remote
          reserve-keyword
        >
          <el-option
            v-for="item in userOptions"
            :key="item.uid"
            :label="item.username"
            :value="item.uid"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="类别：" prop="forum">
        <el-select
          v-model.trim="addForm.forum"
          class="mr10"
          placeholder="请选择类别"
        >
          <el-option
            v-for="item in forumOpt"
            :key="item.did"
            :label="item.dname"
            :value="item.did"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="总题数：" prop="total">
        <el-select v-model="addForm.total" placeholder="请选择总题数">
          <el-option
            v-for="item in questionOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
import trainApi from "../api/trainApi";
import userApi from "../api/userApi";
import Cookies from "js-cookie";
import dictApi from "../api/dictApi";

export default {
  name: "bookDialog",
  data() {
    return {
      dialogVisible: false,
      isEdit: false,
      addForm: {
        label: "",
        uid: "",
        forum: "",
        total: "",
      },
      addFormRules: {
        forum: [
          {
            required: true,
            message: "类型不能为空",
            trigger: "blur",
          },
        ],
        label: [
          {
            required: true,
            message: "标签不能为空",
            trigger: "blur",
          },
        ],
      },
      btnLoading: false,
      editUserval: [],
      forumOpt: [],
      eid: 0,
      loading: false,
      userOptions: [],
      questionOpt: [
        {
          value: 50,
          label: "总量50题",
        },
        {
          value: 25,
          label: "总量25题",
        },
        {
          value: 20,
          label: "总量20题",
        },
        {
          value: 10,
          label: "总量10题",
        },
      ],
    };
  },
  computed: {
    uploadUrl() {
      return this.Global.base_url + "/upload";
    },
  },
  mounted() {
    this.getForumList();
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
        // 如果市编辑状态需要在重置表单后，将传入的数据进行表单赋值
        if (isEdit) {
          this.assignmentAddForm(rowData);
          this.userOptions = [];
          let params = rowData.uid;
          userApi
            .getUserById(params)
            .then((res) => {
              console.log(res);
              this.userOptions.push(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },

    // 编辑状态给表单赋值
    assignmentAddForm(rowData) {
      //console.log(rowData);
      this.addForm = {
        label: rowData.label,
        uid: rowData.uid,
        forum: rowData.forum,
        total: rowData.total,
      };
      this.eid = rowData.eid;
      // 保存编辑时修改前用户对象的值
      this.editUserval = Object.assign({}, this.addForm);
    },

    labelRandom() {
      let daytime = new Date();
      let year = daytime.getFullYear();
      let month =
        daytime.getMonth() + 1 > 9
          ? daytime.getMonth() + 1
          : "0" + (daytime.getMonth() + 1);
      let date =
        daytime.getDate() > 9 ? daytime.getDate() : "0" + daytime.getDate();
      let hour =
        daytime.getHours() > 9 ? daytime.getHours() : "0" + daytime.getHours();
      let minutes =
        daytime.getMinutes() > 9
          ? daytime.getMinutes()
          : "0" + daytime.getMinutes();
      let second =
        daytime.getSeconds() > 9
          ? daytime.getSeconds()
          : "0" + daytime.getSeconds();
      let user = Cookies.get("username");
      this.addForm.label =
        "exam_" + user + "_" + year + month + date + hour + minutes + second;
    },

    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let params = {
          page: 1,
          rows: 20,
          username: query,
        };
        userApi
          .getUserList(params)
          .then((res) => {
            //console.log(res);
            this.loading = false;
            if (res.data.count > 0) {
              this.userOptions = res.data.list;
            }
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      } else {
        this.userOptions = [];
      }
    },

    getForumList() {
      let params = {
        mark: "forum",
        dropList: true,
      };
      dictApi
        .dictList(params)
        .then((res) => {
          //console.log(res);
          this.forumOpt = res.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 提交新增或修改
    addSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (!this.isEdit) {
            this.addProject();
          } else {
            this.editProject();
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
      this.addForm.isover = 0;
      let params = this.addForm;
      console.log(this.addForm);
      trainApi
        .inserttrain(params)
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
      this.addForm.eid = this.eid;
      this.addForm.isover = 0;
      let params = this.addForm;
      trainApi
        .edittrain(params)
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
