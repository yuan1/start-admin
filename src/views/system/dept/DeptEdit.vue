<template>
    <a-modal
            :title="!deptId?'新增部门':'修改部门'"
            :visible="visible"
            :centered="true"
            :keyboard="false"
            :width="650"
            @ok="handleOk"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel"
    >
        <a-form :form="form">
            <a-form-item label='部门名称' v-bind="formItemLayout">
                <a-input
                         v-decorator="['deptName',
                   {rules: [
                    { required: true, message: '部门名称不能为空'},
                    { max: 20, message: '长度不能超过20个字符'}
                  ]}]"/>
            </a-form-item>
            <a-form-item label='部门排序' v-bind="formItemLayout">
                <a-input-number style="width: 100%" v-decorator="['orderNum']"/>
            </a-form-item>
            <a-form-item label='上级部门'
                         style="margin-bottom: 2rem"
                         v-bind="formItemLayout">
                <a-tree
                        :key="deptTreeKey"
                        :checkable="true"
                        :defaultExpandAll="true"
                        :checkStrictly="true"
                        v-model="checkedKeys"
                        :treeData="deptData">
                </a-tree>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
    export default {
        name: "DeptEdit",
        data(){
            return{
                visible: false,
                loading: false,
                confirmLoading: false,
                deptId:undefined,
                form: this.$form.createForm(this),
                formItemLayout: {
                    labelCol: {span: 3},
                    wrapperCol: {span: 18}
                },
                deptTreeKey: +new Date(),
                deptData: [],
                checkedKeys: [],
            }
        },
        created() {
            this.deptDate();
        },
        methods:{
            deptDate() {
                this.$api.userManager.getDept().then((res) => {
                    this.deptData = res.data.rows.children;
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
                        this.parentId = checkedArr[0];
                        if (!this.deptId) {
                            this.$api.userManager
                                .createDept({
                                    deptName: values.deptName,
                                    orderNum: values.orderNum,
                                    parentId: this.parentId,
                                })
                                .then(() => {
                                    this.ok();
                                    this.$message.success("新增部门成功");
                                })
                                .catch(() => {
                                    this.confirmLoading = false;
                                });
                        } else {
                            this.$api.userManager
                                .updateDept({
                                    deptName: values.deptName,
                                    orderNum: values.orderNum,
                                    parentId: this.parentId,
                                    deptId: this.deptId,
                                })
                                .then(() => {
                                    this.ok();
                                    this.$message.success("修改部门成功");
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
                    setFieldsValue({deptName: '', orderNum: '', parentId: ''})
                });
                this.reset();
            },
            update(data) {
                this.deptId = data.deptId;
                this.visible = true;
                this.checkedKeys=[];
                if (this.deptId) {
                    this.$api.userManager.getDeptMenu(this.deptId).then(res => {
                        this.checkedKeys = res.data;
                    });
                }
                const {form: {setFieldsValue}} = this;
                this.$nextTick(() => {
                    setFieldsValue({deptName: data.deptName, orderNum: data.orderNum,parentId: data.parentId})
                });
            },
            reset() {
                this.deptTreeKey = +new Date();
                this.loading = false;
                this.checkedKeys = [];
                this.form.resetFields();
            },
        }
    }
</script>

<style scoped>

</style>