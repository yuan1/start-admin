<template>
    <a-modal
            :title="!jobId?'新增定时任务':'修改定时任务'"
            :visible="visible"
            :centered="true"
            :keyboard="false"
            :width="650"
            @ok="handleOk"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel"
    >
        <a-form :form="form">
            <a-form-item label='Bean名称' v-bind="formItemLayout">
                <a-input style="width: 100%"
                         v-decorator="['beanName',
                   {rules: [
                    { required: true, message: 'Bean名称不能为空'},
                    { max: 50, message: '长度不能超过50个字符'}
                  ]}]"/>
            </a-form-item>
            <a-form-item label='方法名称' v-bind="formItemLayout">
                <a-input
                        v-decorator="['methodName',
                   {rules: [
                    { required: true, message: '方法名称不能为空'},
                    { max: 50, message: '长度不能超过50个字符'}
                  ]}]"/>
            </a-form-item>
            <a-form-item label='方法参数' v-bind="formItemLayout">
                <a-input
                        v-decorator="['params',
                   {rules: [
                    { max: 50, message: '长度不能超过50个字符'}
                  ]}]"/>
            </a-form-item>
            <a-form-item label='Cron表达式'
                         v-bind="formItemLayout">
                <a-input v-decorator="['cronExpression']">
                    <a-icon slot="addonAfter" type="read" style="cursor: pointer" @click="open"/>
                </a-input>
            </a-form-item>
            <a-form-item label='备注信息' v-bind="formItemLayout">
                <a-textarea
                        :rows="4"
                        v-decorator="[
          'remark',
          {rules: [
            { max: 100, message: '长度不能超过100个字符'}
          ]}]">
                </a-textarea>
            </a-form-item>
        </a-form>

    </a-modal>
</template>

<script>
    export default {
        name: "JobEdit",
        data() {
            return {
                loading: false,
                jobId: undefined,
                visible: false,
                confirmLoading: false,
                formItemLayout: {
                    labelCol: {span: 4},
                    wrapperCol: {span: 18}
                },
                form: this.$form.createForm(this)
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
                        console.error("Received values of form: ", values);
                        this.confirmLoading = true;
                        if (!this.jobId) {
                            this.$api.task
                                .createJob({
                                    beanName: values.beanName,
                                    methodName: values.methodName,
                                    params: values.params,
                                    cronExpression: values.cronExpression,
                                    remark: values.remark,

                                })
                                .then(() => {
                                    this.ok();
                                    this.$message.success("增加成功");
                                })
                                .catch(() => {
                                    this.confirmLoading = false;
                                });
                        } else {
                            this.$api.task
                                .updateJob({
                                    beanName: values.beanName,
                                    methodName: values.methodName,
                                    params: values.params,
                                    cronExpression: values.cronExpression,
                                    remark: values.remark,
                                    status: values.status,
                                    jobId: this.jobId
                                })
                                .then(() => {
                                    this.ok();
                                    this.$message.success("修改成功");
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
                this.update({})
            },
            update(data) {
                this.visible = true;
                this.jobId = data.jobId;
                const {
                    form: {setFieldsValue}
                } = this;
                this.$nextTick(() => {
                    setFieldsValue({
                        beanName: data.beanName,
                        methodName: data.methodName,
                        params: data.params,
                        cronExpression: data.cronExpression,
                        remark: data.remark,
                        status: data.status,
                    });
                });
            },
            open(){
                window.open('http://cron.qqe2.com/')
            }
        }
    }
</script>

<style scoped>

</style>