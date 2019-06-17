<template>
  <a-modal
    :title="!userId?'新增用户':'修改用户'"
    :visible="visible"
    :centered="true"
    :keyboard="false"
    :width="650"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-form :form="form">
      <a-form-item label="用户名" v-bind="formItemLayout">
        <a-input v-decorator="['username',{rules: [{ required: true, message: '用户名不能为空'}]}]"/>
      </a-form-item>
      <a-form-item label="密码" v-bind="formItemLayout" v-if="!userId">
        <a-input
          v-decorator="['password',
          { rules: [{ required: true, message: '请输入密码!' }] }
        ]"
          type="password"
        ></a-input>
      </a-form-item>
      <a-form-item label="邮箱" v-bind="formItemLayout">
        <a-input
          v-decorator="['email',  {rules: [
            { type: 'email', message: '请输入正确的邮箱' },
            { max: 50, message: '长度不能超过50个字符'}
          ]}]"
        />
      </a-form-item>
      <a-form-item label="手机" v-bind="formItemLayout">
        <a-input
          v-decorator="['mobile', {rules: [
            { pattern: '^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$',required: true, message: '请输入正确的手机号'}
          ]}]"
        />
      </a-form-item>
      <a-form-item label="角色" v-bind="formItemLayout">
        <a-select
          mode="multiple"
          style="width: 100%"
          v-decorator="['roleId',{rules: [{ required: true, message: '请选择角色' }]}]"
        >
          <a-select-option
            v-for="(x,index) in roleData"
            :key="index"
            :value="`${x.roleId}`"
          >{{x.roleName}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="部门" v-bind="formItemLayout">
        <a-tree-select
          :dropdownStyle="{ maxHeight: '220px', overflow: 'auto' }"
          :treeData="deptData"
          v-decorator="['deptId']"
        ></a-tree-select>
      </a-form-item>
      <a-form-item label="状态" v-bind="formItemLayout">
        <a-radio-group v-decorator="['status',{rules: [{ required: true, message: '请选择状态'}]}]">
          <a-radio value="0">锁定</a-radio>
          <a-radio value="1">有效</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="性别" v-bind="formItemLayout">
        <a-radio-group v-decorator="['ssex',{rules: [{ required: true, message: '请选择性别' }]}]">
          <a-radio value="0">男</a-radio>
          <a-radio value="1">女</a-radio>
          <a-radio value="2">保密</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: "UserEdit",
  data() {
    return {
      visible: false,
      confirmLoading: false,
      userId: undefined,
      form: this.$form.createForm(this),
      roleData: [],
      deptData: [],
      formItemLayout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 18 }
      }
    };
  },
  created() {
    this.getRole();
    this.getDept();
  },
  methods: {
    ok() {
      this.confirmLoading = false;
      this.visible = false;
      this.$emit("ok");
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.error("Received values of form: ", values);
          this.confirmLoading = true;
          if (!this.userId) {
            this.$api.userManager
              .createUser({
                username: values.username,
                password: values.password,
                email: values.email,
                mobile: values.mobile,
                roleId: values.roleId.join(","),
                deptId: values.deptId,
                status: values.status,
                ssex: values.ssex
              })
              .then(() => {
                this.ok();
                this.$message.success("增加成功");
              })
              .catch(() => {
                this.confirmLoading = false;
              });
          } else {
            this.$api.userManager
              .updateUser({
                username: values.username,
                email: values.email,
                mobile: values.mobile,
                roleId: values.roleId.join(","),
                deptId: values.deptId,
                status: values.status,
                ssex: values.ssex,
                userId: this.userId
              })
              .then(() => {
                this.ok();
                this.$message.success("修改成功");
              })
              .catch(() => {
                this.confirmLoading = false;
              });
          }
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
    getRole() {
      this.$api.userManager.getRole().then(res => {
        this.roleData = res.data.rows;
        console.error("res", res.data.rows);
      });
    },
    getDept() {
      this.$api.userManager.getDept().then(res => {
        this.deptData = res.data.rows.children;
        console.error("res.data", res.data.rows.children);
      });
    },
    add() {
      this.update({
        username: "",
        password: "",
        email: "",
        mobile: "",
        roleId: undefined,
        deptId: undefined,
        status: "",
        ssex: ""
      });
    },
    update(data) {
      console.log(data);
      this.visible = true;
      this.userId = data.userId;
      const {
        form: { setFieldsValue }
      } = this;
      this.$nextTick(() => {
        setFieldsValue({
          username: data.username,
          password: data.password,
          email: data.email,
          mobile: data.mobile,
          roleId: data.roleId?data.roleId.toString().split(","):undefined,
          deptId: data.deptId?data.deptId.toString():undefined,
          status: data.status,
          ssex: data.ssex
        });
      });
    }
  }
};
</script>

<style scoped>
</style>
