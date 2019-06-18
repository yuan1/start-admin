<template>
    <a-modal
            :title="!id?'新增菜单':'修改菜单'"
            :visible="visible"
            :centered="true"
            :keyboard="false"
            :width="650"
            @ok="handleOk"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel">
        <a-form :form="form">
            <a-form-item label='菜单名称' v-bind="formItemLayout">
                <a-input
                        v-decorator="['menuName',
                   {rules: [
                    { required: true, message: '菜单名称不能为空'},
                    { max: 10, message: '长度不能超过10个字符'}
                  ]}]"/>
            </a-form-item>
            <a-form-item label='菜单URL'
                         v-bind="formItemLayout">
                <a-input
                        v-decorator="['path',
                 {rules: [
                  { required: true, message: '菜单URL不能为空'},
                  { max: 50, message: '长度不能超过50个字符'}
                ]}]"/>
            </a-form-item>
            <a-form-item label='组件地址'
                         v-bind="formItemLayout">
                <a-input
                        v-decorator="['component',
                 {rules: [
                  { required: true, message: '组件地址不能为空'},
                  { max: 100, message: '长度不能超过100个字符'}
                ]}]"/>
            </a-form-item>
            <a-form-item label='相关权限' v-bind="formItemLayout">
                <a-input
                        v-decorator="['perms',
                   {rules: [
                    { max: 50, message: '长度不能超过50个字符'}
                  ]}]"/>
            </a-form-item>
            <a-form-item label='菜单图标'
                         v-bind="formItemLayout">
                <a-input ref="icons" placeholder="点击右侧按钮选择图标" v-decorator="['icon']">
                    <!--                    <a-icon v-if="menu.icon" slot="suffix" type="close-circle"/>-->
                    <a-icon slot="addonAfter" type="setting" style="cursor: pointer"/>
                </a-input>
            </a-form-item>
            <a-form-item label='菜单排序' v-bind="formItemLayout">
                <a-input-number style="width: 100%" v-decorator="['orderNum']"/>
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
        name: "MenuEdit",
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
                let checkedArr = Object.is(this.checkedKeys.checked, undefined) ? this.checkedKeys : this.checkedKeys.checked
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.error("Received values of form21eee额非常的欣赏: ", values);
                        this.confirmLoading = true;
                        this.parentId = checkedArr[0];
                        // 0 表示菜单 1 表示按钮
                        this.type = '0';
                        if (!this.id) {
                            this.$api.userManager.createMenu({
                                menuName: values.menuName,
                                path: values.path,
                                component: values.component,
                                perms: values.permission,
                                icon: values.icon,
                                orderNum: values.orderNum,
                                parentId: this.parentId,
                                type: this.type,

                            }).then(() => {
                                this.ok();
                                this.$message.success("新增菜单成功");
                            })
                                .catch(() => {
                                    this.confirmLoading = false;
                                });
                        } else {
                            this.$api.userManager.updateMenu({
                                menuName: values.menuName,
                                path: values.path,
                                component: values.component,
                                perms: values.permission,
                                icon: values.icon,
                                orderNum: values.orderNum,
                                parentId: this.parentId,
                                id: this.id,
                                type: this.type,
                            }).then(() => {
                                this.ok();
                                this.$message.success("修改菜单成功");
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
            addMenu() {
                this.visible = true;
                const {form: {setFieldsValue}} = this;
                this.$nextTick(() => {
                    setFieldsValue({
                        menuName: '',
                        path: '',
                        component: '',
                        perms: '',
                        icon: '',
                        orderNum: '',
                        parentId: ''
                    })
                });
                this.reset();
            },
            updateMenu(data) {
                this.id = data.id;
                this.visible = true;
                this.checkedKeys=[];
                if (this.id) {
                    this.$api.userManager.getRoleMenu(this.id).then(res => {
                        this.checkedKeys = res.data;
                    });
                }
                const {form: {setFieldsValue}} = this;
                this.$nextTick(() => {
                    setFieldsValue({menuName: data.text, path: data.path,
                        component: data.component,perms: data.permission,icon: data.icon,orderNum: data.order,parentId:data.parentId})
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