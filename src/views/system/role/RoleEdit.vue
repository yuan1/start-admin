<template>
    <a-modal
            :title="!roleId?'新增角色':'修改角色'"
            :visible="visible"
            :centered="true"
            :keyboard="false"
            :width="650"
            @ok="handleOk"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel"
    >
        <a-form :form="form">
            <a-form-item label='角色名称'
                         v-bind="formItemLayout">
                <a-input v-decorator="['roleName']"/>
            </a-form-item>
            <a-form-item label='角色描述' v-bind="formItemLayout">
                <a-textarea
                        :rows="4"
                        v-decorator="[
          'remark',
          {rules: [
            { max: 50, message: '长度不能超过50个字符'}
          ]}]">
                </a-textarea>
            </a-form-item>
            <a-form-item label='权限选择'
                         style="margin-bottom: 2rem"
                         v-bind="formItemLayout">
                <a-tree
                        :key="menuTreeKey"
                        :checkable="true"
                        :defaultExpandAll="!roleId?false:true"
                        :checkStrictly="true"
                        v-model="checkedKeys"
                        :treeData="menuData">
                </a-tree>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
    export default {
        name: "RoleEdit",
        data() {
            return {
                visible: false,
                loading: false,
                confirmLoading: false,
                roleId: undefined,
                menuId: '',
                form: this.$form.createForm(this),
                formItemLayout: {
                    labelCol: {span: 3},
                    wrapperCol: {span: 18}
                },
                menuTreeKey: +new Date(),
                menuData: [],
                checkedKeys: [],
            }
        },
        created() {
            this.menuDate();
        },
        methods: {
            menuDate() {
                this.$api.userManager.getMenu().then((res) => {
                    this.menuData = res.data.rows.children;
                })
            },
            ok() {
                this.confirmLoading = false;
                this.visible = false;
                this.$emit("ok");
            },
            handleOk() {
                let checkedArr = Object.is(this.checkedKeys.checked, undefined) ? this.checkedKeys : this.checkedKeys.checked;
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.log("Received values of form: ", values);
                        this.confirmLoading = true;
                        this.menuId = checkedArr.join(',');
                        if (!this.roleId) {
                            this.$api.userManager
                                .createRole({
                                    roleName: values.roleName,
                                    remark: values.remark,
                                    menuId: this.menuId,
                                })
                                .then(() => {
                                    this.ok();
                                    this.$message.success("新增角色成功");
                                })
                                .catch(() => {
                                    this.confirmLoading = false;
                                });
                        } else {
                            this.$api.userManager
                                .updateRole({
                                    roleName: values.roleName,
                                    remark: values.remark,
                                    roleId: this.roleId,
                                    menuId: this.menuId,
                                })
                                .then(() => {
                                    this.ok();
                                    this.$message.success("修改角色成功");
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
            add() {
                this.update({});
            },
            update(data) {
                this.roleId = data.roleId;
                this.visible = true;
                this.checkedKeys = [];
                if (this.roleId) {
                    this.$api.userManager.getRoleMenu(this.roleId).then(res => {
                        this.checkedKeys = res.data;
                    });
                }
                const {form: {setFieldsValue}} = this;
                this.$nextTick(() => {
                    setFieldsValue({roleName: data.roleName, remark: data.remark})
                });
            }
        }
    }
</script>

<style scoped>

</style>