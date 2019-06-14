<template>
    <a-card :bordered="false">
        <div>
            <a-form ayout="horizontal">
                <a-row>
                    <div>
                        <a-col :md="12" :sm="24">
                            <a-form-item
                                    label="角色"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}">
                                <a-input
                                        v-decorator="[
          'roleName',
          {rules: [{ required: true, message: 'Please input your roleName!' }]}
        ]"
                                />
                            </a-form-item>
                        </a-col>
                        <template>
                            <a-col :md="12" :sm="24">
                                <a-form-item
                                        label="创建时间"
                                        :labelCol="{span: 5}"
                                        :wrapperCol="{span: 18, offset: 1}">
                                    <a-range-picker v-decorator="['range-picker', rangeConfig]"/>

                                </a-form-item>
                            </a-col>
                        </template>
                    </div>
                    <span style="float: right; margin-top: 3px;">
                    <a-button type="primary">查询</a-button>
                    <a-button style="margin-left: 8px"> 重置</a-button>

          </span>

                </a-row>
            </a-form>
        </div>
        <div>
            <div style="margin-bottom: 18px;">
                <a-button type="primary" ghost @click="addClick">新增</a-button>
                <a-button style="margin-left: 8px"> 删除</a-button>
                <a-dropdown>
                    <a-menu slot="overlay">
                        <a-menu-item key="1">
                            <a-icon type="user"/>
                            密码重置
                        </a-menu-item>
                        <a-menu-item key="2">
                            <a-icon type="user"/>
                            导出Excel
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 8px" type="primary" ghost>
                        更多操作
                        <a-icon type="down"/>
                    </a-button>
                </a-dropdown>
            </div>
            <a-table :columns="columns"
                     :dataSource="data"
                     :pagination="pagination"
                     :loading="loading"
                     rowKey="roleId"
                     @change="handleTableChange"
                     :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            >
                <template slot="operation">
                    <a-icon type="setting" theme="twoTone" twoToneColor="#4a9ff5" title="修改用户"></a-icon>
                    <a-icon type="eye" theme="twoTone" twoToneColor="#42b983" title="查看"></a-icon>
                </template>
            </a-table>
        </div>
        <RoleEdit ref="modal" @ok="handleOk"/>

    </a-card>
</template>

<script>
    import RoleEdit from "@/views/system/role/RoleEdit";
    const columns = [
        {
            title: '角色',
            dataIndex: 'roleName'
        }, {
            title: '描述',
            dataIndex: 'remark',
            scopedSlots: {customRender: 'remark'},
            width: 350
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            sorter: true,
        }, {
            title: '修改时间',
            dataIndex: 'modifyTime',
            sorter: true,
        }, {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'}
        }
    ]

    export default {
        name: "role",
        components: {RoleEdit},
        data() {
            return {
                columns,
                data: [],
                loading: false,
                selectedRowKeys: [], //选中
                pagination: {
                    pageSizeOptions: ['10', '20', '30', '40', '100'],
                    defaultCurrent: 1,
                    total: 0,
                    defaultPageSize: 10,
                    showSizeChanger: true, //是否可以改变 pageSize
                },
                rangeConfig: {
                    rules: [{ type: 'array', required: true, message: 'Please select time!' }],
                },
            }
        },
        created() {
            this.roleData();
        },
        methods: {
            roleData() {
                this.$api.userManager.getRole({
                    pageNum: this.pagination.defaultCurrent,
                    pageSize: this.pagination.defaultPageSize,
                }).then(res => {
                    this.data = res.data.rows;
                    this.pagination.total = res.data.total;
                })
            },
            addClick() {
                this.$refs.modal.add();
            },
            onSelectChange(selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys
            },
            toggleAdvanced() {
                this.advanced = !this.advanced;
            },
            handleTableChange(pagination, filters, sorter) {
                console.log(pagination);
                console.log(filters);
                console.log(sorter);
                this.$api.userManager.getRole({
                    pageNum: pagination.current,
                    pageSize: pagination.pageSize,
                    sortField: sorter.field,
                    sortOrder: sorter.order,
                }).then(res => {
                    this.data = res.data.rows;
                    this.pagination.total = res.data.total
                })


            },
            handleOk() {
                this.roleData();
            },
        }
    }
</script>

<style scoped>

</style>