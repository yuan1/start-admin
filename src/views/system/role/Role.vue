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
                                <a-input  v-model="searchParams.roleName"/>
                            </a-form-item>
                        </a-col>
                        <template>
                            <a-col :md="12" :sm="24">
                                <a-form-item
                                        label="创建时间"
                                        :labelCol="{span: 5}"
                                        :wrapperCol="{span: 18, offset: 1}">
                                    <a-range-picker v-model="searchParams.createTime"/>

                                </a-form-item>
                            </a-col>
                        </template>
                    </div>
                    <span style="float: right; margin-top: 3px;">
                    <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          </span>

                </a-row>
            </a-form>
        </div>
        <div>
            <div style="margin-bottom: 18px;">
                <a-button type="primary" ghost @click="addClick">新增</a-button>
                <a-button style="margin-left: 8px" @click="deleteClick"> 删除</a-button>
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
                <template slot="operation" slot-scope="text, record">
                    <a-icon type="setting" theme="twoTone" twoToneColor="#4a9ff5" title="修改用户"
                            @click="updateClick(record)"></a-icon>
                </template>
            </a-table>
        </div>
        <RoleEdit ref="modal" @ok="handleOk"/>

    </a-card>
</template>

<script>
    import RoleEdit from "@/views/system/role/RoleEdit";

    export default {
        name: "role",
        components: {RoleEdit},
        data() {
            return {
                data: [],
                loading: false,
                selectedRowKeys: [], //选中
                pagination: {
                    pageSizeOptions: ["5", "10", "20", "30", "40", "100"],
                    defaultCurrent: 1,
                    current: 1,
                    total: 0,
                    defaultPageSize: 5,
                    pageSize: 5,
                    showSizeChanger: true //是否可以改变 pageSize
                },

                sorter: {},
                searchParams: {},

            }
        },
        computed: {
            columns() {
                let { sorter } = this;
                sorter = sorter || {};
                return [
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
                        sortOrder: sorter.columnKey === 'createTime' && sorter.order
                    }, {
                        title: '修改时间',
                        dataIndex: 'modifyTime',
                        sorter: true,
                        sortOrder: sorter.columnKey === 'modifyTime' && sorter.order
                    }, {
                        title: '操作',
                        dataIndex: 'operation',
                        scopedSlots: {customRender: 'operation'}
                    }
                ];
            }
        },
        created() {
            this.roleData(this.pagination);
        },
        methods: {
            handleTableChange(pagination, filters, sorter) {
                this.pagination = pagination;
                this.sorter = sorter;
                this.roleData(pagination, sorter,this.searchParams);
            },
             roleData(pagination = {}, sorter = {},searchParams = {}) {
                if (searchParams.createTime && searchParams.createTime.length > 0) {
                    const from = searchParams.createTime[0];
                    const to = searchParams.createTime[1];
                    searchParams.createTimeFrom = from.format("YYYY-MM-DD");
                    searchParams.createTimeTo = to.format("YYYY-MM-DD");
                } else {
                    searchParams.createTimeFrom = "";
                    searchParams.createTimeTo = "";
                }
                this.$api.userManager.getRole({
                    createTimeFrom: searchParams.createTimeFrom,
                    createTimeTo: searchParams.createTimeTo,
                    roleName: searchParams.roleName,

                    pageNum: pagination.current,
                    pageSize: pagination.pageSize,
                    sortField: sorter.field,
                    sortOrder: sorter.order,
                }).then(res => {
                    this.data = res.data.rows;
                    this.pagination.total = res.data.total;
                })
            },
            addClick() {
                this.$refs.modal.add();
            },
            updateClick(data) {
                this.$refs.modal.update(data);
            },
            deleteClick() {
                if (!this.selectedRowKeys.length) {
                    this.$message.warning("请选择需要删除的记录");
                    return;
                }
                let that = this;
                this.$confirm({
                    title: "确定删除所选中的记录?",
                    content: "当您点击确定按钮后，这些记录将会被彻底删除",
                    centered: true,
                    onOk() {
                        that.$api.userManager.deleteRole(that.selectedRowKeys).then(() => {
                            that.$message.success("删除成功");
                            that.selectedRowKeys = [];
                            that.roleData(that.pagination);
                        });
                    },
                    onCancel() {
                        that.selectedRowKeys = [];
                    }
                });
            },
            reset() {
                this.searchParams = {};
                this.sorter = {};
                this.pagination.current = 1;
                this.roleData(this.pagination);
            },
            search() {
                this.pagination.current = 1;
                this.roleData(
                    this.pagination,
                    this.sorter,
                    this.searchParams,
                );
            },
            onSelectChange(selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys
            },
            toggleAdvanced() {
                this.advanced = !this.advanced;
            },
            handleOk() {
                this.roleData(this.pagination);
            },
        }
    }
</script>

<style scoped>

</style>