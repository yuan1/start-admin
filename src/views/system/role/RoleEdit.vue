<template>
    <a-modal
            title="新增角色"
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
                        ref="menuTree"
                        :checkable="true"
                        :checkStrictly="checkStrictly"
                        >
                </a-tree>
            </a-form-item>
        </a-form>
        <div class="drawer-bootom-button">
            <a-dropdown style="float: left" :trigger="['click']" placement="topCenter">
                <a-menu slot="overlay">
                    <a-menu-item key="1">展开所有</a-menu-item>
                    <a-menu-item key="2">合并所有</a-menu-item>
                    <a-menu-item key="3">父子关联</a-menu-item>
                    <a-menu-item key="4">取消关联</a-menu-item>
                </a-menu>
                <a-button>
                    树操作
                    <a-icon type="up"/>
                </a-button>
            </a-dropdown>
        </div>
    </a-modal>
</template>

<script>
    export default {
        name: "RoleEdit",
        data(){
            return{
                visible: false,
                confirmLoading: false,
                formItemLayout: {
                    labelCol: {span: 3},
                    wrapperCol: {span: 18}
                }
            }
        },
        methods:{
            add() {
                this.visible = true;
                const {form: {setFieldsValue}} = this;
                this.$nextTick(() => {
                    setFieldsValue({
                        roleName: '', remark: '',})
                });
            },
        }
    }
</script>

<style scoped>

</style>