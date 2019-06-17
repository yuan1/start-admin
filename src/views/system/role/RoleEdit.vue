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
                        ref="menuTree"
                        :checkable="true"
                        :checkStrictly="checkStrictly"
                        @check="handleCheck"
                        @expand="handleExpand"
                        :expandedKeys="expandedKeys"
                        :treeData="menuData">
                </a-tree>
            </a-form-item>
        </a-form>
<!--        <div class="drawer-bootom-button">-->
<!--            <a-dropdown style="float: left" :trigger="['click']" placement="topCenter">-->
<!--                <a-menu slot="overlay">-->
<!--                    <a-menu-item key="1">展开所有</a-menu-item>-->
<!--                    <a-menu-item key="2">合并所有</a-menu-item>-->
<!--                    <a-menu-item key="3">父子关联</a-menu-item>-->
<!--                    <a-menu-item key="4">取消关联</a-menu-item>-->
<!--                </a-menu>-->
<!--                <a-button>-->
<!--                    树操作-->
<!--                    <a-icon type="up"/>-->
<!--                </a-button>-->
<!--            </a-dropdown>-->
<!--        </div>-->
    </a-modal>
</template>

<script>
    export default {
        name: "RoleEdit",
        data(){
            return{
                visible: false,
                loading :false,
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
                allTreeKeys: [],
                checkStrictly: true, //checkable状态下节点选择完全受控
                checkedKeys: [],
                defaultCheckedKeys: [],
                expandedKeys: [], //（受控）展开指定的树节点

                menuSelectStatus: '',
                menuSelectHelp: '',


            }
        },
        created(){
            this.menuDate();
        },
        methods:{
            menuDate(){
                this.$api.userManager.getMenu().then((res) => {
                    this.menuData = res.data.rows.children;
                    this.allTreeKeys = res.data.ids;
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
                this.visible = true;
                const {form: {setFieldsValue}} = this;
                this.$nextTick(() => {
                    setFieldsValue({roleName: '', remark: '',menuId:''})
                });
                this.reset();
            },
            update(data) {
                this.visible = true;
                this.roleId = data.roleId;
                const {form: {setFieldsValue}} = this;
                this.$nextTick(() => {
                    setFieldsValue({roleName: data.roleName, remark: data.remark,menuId: data.menuId})
                });
            },
            //点击复选框触发
            handleCheck(checkedKeys){
                this.checkedKeys = checkedKeys;
                let checkedArr = Object.is(checkedKeys.checked, undefined) ? checkedKeys : checkedKeys.checked;
                if (checkedArr.length) {
                    this.menuSelectStatus = '';
                    this.menuSelectHelp = ''
                } else {
                    this.menuSelectStatus = 'error';
                    this.menuSelectHelp = '请选择相应的权限';
                }

            },
            //展开/收起节点时触发
            handleExpand(expandedKeys){
                this.expandedKeys = expandedKeys;
            },
            reset() {
                this.menuTreeKey = +new Date();
                this.expandedKeys = this.checkedKeys = [];
                this.loading = false;
                this.form.resetFields();
            },

        }
    }
</script>

<style scoped>

</style>