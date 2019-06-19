<template>
    <a-modal
            :title="!id?'新增按钮':'修改按钮'"
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
                <a-tree-select
                        style="width: 300px"
                        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                        :treeData="menuData"
                        placeholder='Please select'
                        treeDefaultExpandAll
                        allowClear
                        v-model="parentId"
                >
                </a-tree-select>
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
                id: undefined,
                parentId: '',
                form: this.$form.createForm(this),
                formItemLayout: {
                    labelCol: {span: 3},
                    wrapperCol: {span: 18}
                },
                menuData: [],
            }
        },
        methods: {
            menuDate() {
                this.$api.userManager.getMenu().then((res) => {
                    this.menuData = res.data.rows.children;
                })
            },
            handleOk() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.error("Received values of form:", values);
                        this.confirmLoading = true;
                        if (this.parentId === undefined || this.parentId === '') {
                            this.parentId = 0;
                        }
                        if (!this.id) {
                            this.$api.userManager.createMenu({
                                menuName: values.menuName,
                                parentId: this.parentId,
                                type: '1',

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
                                menuId: this.id,
                                type: '1',
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
                this.updateButton({});
            },
            updateButton(data) {
                this.menuDate();
                this.id = data.id;
                this.parentId = data.parentId === "0" ? undefined : data.parentId;
                this.visible = true;
                const {form: {setFieldsValue}} = this;
                this.$nextTick(() => {
                    setFieldsValue({menuName: data.text, perms: data.permission,})
                });
            }
        }
    }
</script>

<style scoped>

</style>