<template>
    <a-modal
            :title="!dictId?'新增字典':'修改字典'"
            :visible="visible"
            :centered="true"
            :keyboard="false"
            :width="650"
            @ok="handleOk"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel"
    >
        <a-form :form="form">
            <a-form-item label='键' v-bind="formItemLayout">
                <a-input-number style="width: 100%"
                                v-decorator="['keyy',
                   {rules: [
                    { required: true, message: '不能为空'}
                  ]}]"/>
            </a-form-item>
            <a-form-item label='值' v-bind="formItemLayout">
                <a-input
                         v-decorator="['valuee',
                   {rules: [
                    { required: true, message: '不能为空'},
                    { max: 20, message: '长度不能超过20个字符'}
                  ]}]"/>
            </a-form-item>
            <a-form-item label='表名' v-bind="formItemLayout">
                <a-input
                         v-decorator="['tableName',
                   {rules: [
                    { required: true, message: '不能为空'},
                    { max: 20, message: '长度不能超过20个字符'}
                  ]}]"/>
            </a-form-item>
            <a-form-item label='字段' v-bind="formItemLayout">
                <a-input
                         v-decorator="['fieldName',
                   {rules: [
                    { required: true, message: '不能为空'},
                    { max: 20, message: '长度不能超过20个字符'}
                  ]}]"/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
    export default {
        name: "DictEdit",
        data(){
            return{
                visible: false,
                loading: false,
                confirmLoading: false,
                dictId: undefined,
                form: this.$form.createForm(this),
                formItemLayout: {
                    labelCol: {span: 3},
                    wrapperCol: {span: 18}
                },
                dictData: [],
            }
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
                        console.log("Received values of form: ", values);
                        this.confirmLoading = true;
                        if (!this.dictId) {
                            this.$api.userManager
                                .createDict({
                                    fieldName: values.fieldName,
                                    keyy: values.keyy,
                                    tableName: values.tableName,
                                    valuee: values.valuee,
                                })
                                .then(() => {
                                    this.ok();
                                    this.$message.success("新增字典成功");
                                })
                                .catch(() => {
                                    this.confirmLoading = false;
                                });
                        } else {
                            this.$api.userManager
                                .updateDict({
                                    fieldName: values.fieldName,
                                    keyy: values.keyy,
                                    tableName: values.tableName,
                                    valuee: values.valuee,
                                    dictId:this.dictId,
                                })
                                .then(() => {
                                    this.ok();
                                    this.$message.success("修改字典成功");
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
                this.dictId = data.dictId;
                this.visible = true;
                const {form: {setFieldsValue}} = this;
                this.$nextTick(() => {
                    setFieldsValue({fieldName: data.fieldName, keyy: data.keyy, tableName: data.tableName, valuee: data.valuee})
                });
            },
        }
    }
</script>

<style scoped>

</style>