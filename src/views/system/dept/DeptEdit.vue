<template>
    <a-modal
            :title="!id?'新增部门':'修改部门'"
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
                <a-tree-select
                        style="width: 300px"
                        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                        :treeData="deptData"
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
        name: "DeptEdit",
        data() {
            return {
                visible: false,
                loading: false,
                confirmLoading: false,
                id: undefined,
                parentId: undefined,
                form: this.$form.createForm(this),
                formItemLayout: {
                    labelCol: {span: 3},
                    wrapperCol: {span: 18}
                },
                deptData: [],
            }
        },
        methods: {
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
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.log("Received values of form: ", values);
                        this.confirmLoading = true;
                        if (this.parentId === undefined || this.parentId === '') {
                            this.parentId = 0;
                        }
                        if (!this.id) {
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
                                    deptId: this.id,
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
                this.update({});
            },
            update(data) {
                this.deptDate();
                this.id = data.id;
                this.parentId = data.parentId === "0" ? undefined : data.parentId;
                this.visible = true;
                const {form: {setFieldsValue}} = this;
                this.$nextTick(() => {
                    setFieldsValue({deptName: data.text, orderNum: data.order})
                });
            },
        }
    }
</script>

<style scoped>

</style>