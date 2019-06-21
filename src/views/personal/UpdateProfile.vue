<template>
    <a-modal
            title="编辑资料"
            :maskClosable="false"
            :width="650"
            placement="right"
            :closable="false"
            @cancel="handleCancel"
            @ok="handleOk"
            :visible="visible">
        <a-form :form="form">
            <a-form-item label='邮箱' v-bind="formItemLayout">
                <a-input
                        v-decorator="[
          'email',
          {rules: [
            { type: 'email', message: '请输入正确的邮箱' },
            { max: 50, message: '长度不能超过50个字符'}
          ]}
        ]"/>
            </a-form-item>
            <a-form-item label="手机" v-bind="formItemLayout">
                <a-input
                        v-decorator="['mobile', {rules: [
            { pattern: '^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$', message: '请输入正确的手机号'}
          ]}]"/>
            </a-form-item>
            <a-form-item label='部门' v-bind="formItemLayout">
                <a-tree-select
                        :allowClear="true"
                        :dropdownStyle="{ maxHeight: '220px', overflow: 'auto' }"
                        :treeData="deptTreeData"
                        @change="onDeptChange"
                        :value="userDept">
                </a-tree-select>
            </a-form-item>
            <a-form-item label='性别' v-bind="formItemLayout">
                <a-radio-group
                        v-decorator="[
            'ssex',
            {rules: [{ required: true, message: '请选择性别' }]}
          ]">
                    <a-radio value="0">男</a-radio>
                    <a-radio value="1">女</a-radio>
                    <a-radio value="2">保密</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label='描述' v-bind="formItemLayout">
                <a-textarea
                        :rows="4"
                        v-decorator="[
          'description',
          {rules: [
            { max: 100, message: '长度不能超过100个字符'}
          ]}]">
                </a-textarea>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script>
    import {mapMutations} from 'vuex'

    export default {
        props: {
            user: {
                required: true
            }
        },
        data() {
            return {
                visible:false,
                formItemLayout: {
                    labelCol: {span: 3},
                    wrapperCol: {span: 18}
                },
                form: this.$form.createForm(this),
                deptTreeData: [],
                userDept: [],
                userId: '',
                roleId: '',
                status: '',
                username: '',
                loading: false
            }
        },
        methods: {
            ...mapMutations({
                setUser: state => state.setUser
            }),
            onDeptChange(value) {
                this.userDept = value
            },
            handleCancel() {
                this.visible = false;
            },
            handleOk() {
                this.form.validateFields((err,values) => {
                    if (!err) {
                        this.loading = true;
                        this.user.deptId = this.userDept[0];
                        this.user.email= values.email;
                        this.user.ssex= values.ssex;
                        this.user.description= values.description;
                        this.user.mobile= values.mobile;
                        this.$api.user.updateProfile(this.user).then(() => {
                            this.loading = false;
                            // 更新其state
                            this.$api.user.userProfile(this.user).then((r) => {
                                this.setUser(r.data);
                                this.$message.success('修改成功');
                                this.visible = false;
                            })
                        }).catch(() => {
                            this.loading = false
                        })
                    }
                })
            }
        },
        watch: {
            visible() {
                if (this.visible) {
                    this.$api.userManager.getDept().then((r) => {
                        this.deptTreeData = r.data.rows.children
                    });
                    if (this.user.deptId) {
                        this.userDept = [this.user.deptId]
                    }
                    console.log(this.user);
                    const {form: {setFieldsValue}} = this;
                    this.$nextTick(() => {
                        setFieldsValue({
                            email: this.user.email,
                            ssex: this.user.ssex,
                            description: this.user.description,
                            mobile: this.user.mobile,
                        })
                    });
                }
            }
        }
    }
</script>
