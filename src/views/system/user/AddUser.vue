<template>
    <a-modal
            title="新增用户"
            :visible="visible"
            :centered="true"
            :keyboard="false"
            :width="650"
            @ok="handleOk"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel"
           >
        <a-form :form="form">
            <a-form-item label='用户名'
                         v-bind="formItemLayout">
                <a-input
                         v-decorator="['username',{rules: [{ required: true, message: '用户名不能为空'}]}]"/>
            </a-form-item>
            <a-form-item label='密码' v-bind="formItemLayout">
                <a-input
                        v-decorator="['password',
          { rules: [{ required: true, message: '请输入密码!' }] }
        ]"
                        type="password">
                </a-input>
            </a-form-item>
            <a-form-item label='邮箱' v-bind="formItemLayout">
                <a-input v-decorator="['email',{ rules: [{
              type: 'email'}, {
              required: true, message: '请输入正确的邮箱!',
            }]}]"/>
            </a-form-item>
            <a-form-item label="手机" v-bind="formItemLayout">
                <a-input
                         v-decorator="['mobile', {rules: [
            { required: true, message: '请输入正确的手机号'}
          ]}]"/>
            </a-form-item>
            <a-form-item label='角色' v-bind="formItemLayout" >
                <a-select
                        mode="multiple"
                        style="width: 100%"
                        v-decorator="['Role.vue',{rules: [{ required: true, message: '请选择角色' }]}]">
<!--                    <a-select-option v-for="(x,index) in roleData" :key="index" :value="x.id">{{x.roleName}}</a-select-option>-->
                </a-select>
            </a-form-item>
            <a-form-item label='部门' v-bind="formItemLayout">
                <a-tree-select
                        :dropdownStyle="{ maxHeight: '220px', overflow: 'auto' }"
                        v-decorator="['deptId']">
                </a-tree-select>
            </a-form-item>
            <a-form-item label='状态' v-bind="formItemLayout">
                <a-radio-group
                        v-decorator="['status',{rules: [{ required: true, message: '请选择状态'}]}]">
                    <a-radio value="0">锁定</a-radio>
                    <a-radio value="1">有效</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label='性别' v-bind="formItemLayout">
                <a-radio-group
                        v-decorator="['ssex',{rules: [{ required: true, message: '请选择性别' }]}]">
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
        name: "AddUser",
        data() {
            return {
                visible: false,
                confirmLoading: false,
                id: undefined,
                form: this.$form.createForm(this),
                roleData:[],
                formItemLayout: {
                    labelCol: {span: 3},
                    wrapperCol: {span: 18}
                },
                validateStatus: '',
                help: '',
                user: {
                    username: ''
                },
            }
        },

        methods: {
            ok() {
                this.confirmLoading = false;
                this.visible = false;
                this.$emit('ok')
            },
            handleOk() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.error('Received values of form: ', values);
                        this.confirmLoading = true;
                            this.$api.userManager.createUser({
                                username: values.username, password: values.password, email: values.email,
                                mobile: values.mobile, role: values.Role, deptId: values.deptId,
                                status: values.status, ssex: values.ssex,
                            }).then(() => {
                                this.ok();
                                this.$message.success('创建成功');
                            }).catch(() => {
                                this.confirmLoading = false;
                            });
                    }
                });
            },
            handleCancel() {
                this.visible = false
            },
            // userRole () {
            //     this.$api.userManager.getRole().then(res => {
            //         this.roleData = res.data.rows;
            //         // console.error('11111111111',res.data.rows)
            //     })
            // },
            add() {
                this.visible = true;
                const {form:{setFieldsValue}} = this;
                this.$nextTick(() =>{
                    setFieldsValue({ username: '', password: '', email: '', mobile: '', role: '', deptId: '', status: '', ssex: ''})
                });
            },
        }
    }
</script>

<style scoped>

</style>