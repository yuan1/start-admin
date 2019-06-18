<template>
    <a-modal
            :title="!menuId?'新增按钮':'修改按钮'"
            :visible="visible"
            :centered="true"
            :keyboard="false"
            :width="650"
            @ok="handleOk"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel">
        <a-form :form="form">
            <a-form-item label='按钮名称' v-bind="formItemLayout">
                <a-input v-decorator="['menuName',
                   {rules: [
                    { required: true, message: '按钮名称不能为空'},
                    { max: 10, message: '长度不能超过10个字符'}
                  ]}]"/>
            </a-form-item>
            <a-form-item label='相关权限' v-bind="formItemLayout">
                <a-input v-decorator="['perms',
                   {rules: [
                    { max: 50, message: '长度不能超过50个字符'}
                  ]}]"/>
            </a-form-item>
            <a-form-item label='上级菜单'
                         style="margin-bottom: 2rem"
                         v-bind="formItemLayout">
                <a-tree
                        :key="menuTreeKey"
                        :checkable="true"
                        :defaultExpandAll="true"
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
        name: "ButtonEdit",
        data() {
            return {
                visible: false,
                loading: false,
                confirmLoading: false,
                menuId: undefined,
                parentId: '',
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
            handleOk() {
                let checkedArr = Object.is(this.checkedKeys.checked, undefined) ? this.checkedKeys : this.checkedKeys.checked
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.error("Received values of form:", values);
                        this.confirmLoading = true;
                        this.parentId = checkedArr[0];
                        // 0 表示菜单 1 表示按钮
                        this.type = '1';
                        if (!this.menuId) {
                            this.$api.userManager.createMenu({
                                menuName: values.menuName,
                                parentId: this.parentId,
                                type: this.type,

                            })
                                .then(() => {
                                    this.ok();
                                    this.$message.success("新增按钮成功");
                                })
                                .catch(() => {
                                    this.confirmLoading = false;
                                });
                        } else {
                            this.$api.userManager.updateMenu({
                                menuName: values.menuName,
                                parentId: this.parentId,
                                menuId: this.menuId,
                                type: this.type,
                            })
                                .then(() => {
                                    this.ok();
                                    this.$message.success("新增按钮成功");
                                })
                                .catch(() => {
                                    this.confirmLoading = false;
                                });
                        }
                    }
                });
            },
            ok() {
                this.confirmLoading = false;
                this.visible = false;
                this.$emit("ok");
            },
            handleCancel() {
                this.visible = false;
            },
            addButton() {
                this.visible = true;
                const {form: {setFieldsValue}} = this;
                this.$nextTick(() => {
                    setFieldsValue({menuName: '', parentId: ''})
                });
                this.reset();
            },
            updateButton(data) {
                this.menuId = data.menuId;
                this.visible = true;
                this.checkedKeys=[];
                if (this.menuId) {
                    this.$api.userManager.getRoleMenu(this.menuId).then(res => {
                        this.checkedKeys = res.data;
                    });
                }
                const {form: {setFieldsValue}} = this;
                this.$nextTick(() => {
                    setFieldsValue({menuName: data.menuName, parentId: data.parentId})
                });
            },
            reset() {
                this.menuTreeKey = +new Date();
                this.loading = false;
                this.checkedKeys = [];
                this.form.resetFields();
            },

        }
    }
</script>

<style scoped>

</style>