<template>
    <a-card :bordered="false">
        <a-form layout="horizontal">
            <div style="width: calc(100% - 216px);display: inline-block;">
                <a-row>
                    <a-col :md="12" :sm="24">
                        <a-form-item
                                label="操作人"
                                v-bind="formItemLayout">
                            <a-input v-model="searchParams.username"/>
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item
                                label="操作描述"
                                v-bind="formItemLayout">
                            <a-input v-model="searchParams.operation"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row v-if="advanced">
                    <a-col :md="12" :sm="24">
                        <a-form-item
                                label="操作地点"
                                v-bind="formItemLayout">
                            <a-input v-model="searchParams.location"/>
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item
                                label="操作时间"
                                v-bind="formItemLayout">
                            <a-range-picker v-model="searchParams.createTime"/>

                        </a-form-item>
                    </a-col>
                </a-row>
            </div>
            <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{advanced ? '收起' : '展开'}}
            <a-icon :type="advanced ? 'up' : 'down'"/>
          </a>
        </span>
        </a-form>
        <div>
            <div style="margin-bottom: 18px;">
                <a-button @click="deleteClick" type="primary" ghost>删除</a-button>
                <a-dropdown>
                    <a-menu slot="overlay">
                        <a-menu-item key="export-data">导出Excel</a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 8px" type="primary" ghost>
                        更多操作
                        <a-icon type="down"/>
                    </a-button>
                </a-dropdown>
            </div>
            <!-- 表格区域 -->
            <a-table :columns="columns"
                     :dataSource="data"
                     :pagination="pagination"
                     :loading="loading"
                     rowKey="id"
                     @change="handleTableChange"
                     :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            >
            </a-table>
        </div>
    </a-card>
</template>

<script>

    export default {
        name: "SystemLog",
        data() {
            return {
                advanced: false,
                data: [],
                selectedRowKeys: [],
                formItemLayout: {
                    labelCol: {span: 5},
                    wrapperCol:{span: 18, offset: 1},
                },
                pagination: {
                    pageSizeOptions: ["5", "10", "20", "30", "40", "100"],
                    defaultCurrent: 1,
                    current: 1,
                    total: 0,
                    defaultPageSize: 5,
                    pageSize: 5,
                    showSizeChanger: true //是否可以改变 pageSize
                },

                loading: false,
                searchParams: {},
                sorter: {},
            }
        },
        computed: {
            columns() {
                let {sorter} = this;
                sorter = sorter || {};
                return [{
                    title: '操作人',
                    dataIndex: 'username'
                }, {
                    title: '操作描述',
                    dataIndex: 'operation'
                }, {
                    title: '耗时',
                    dataIndex: 'time',
                    // scopedSlots: {customRender: 'time'},
                    sorter: true,
                    sortOrder: sorter.columnKey === 'time' && sorter.order
                }, {
                    title: '执行方法',
                    dataIndex: 'method',
                    // scopedSlots: {customRender: 'method'}
                }, {
                    title: '方法参数',
                    dataIndex: 'params',
                    // scopedSlots: {customRender: 'params'},
                    width: 100
                }, {
                    title: 'IP地址',
                    dataIndex: 'ip'
                }, {
                    title: '操作地点',
                    dataIndex: 'location'
                }, {
                    title: '操作时间',
                    dataIndex: 'createTime',
                    sorter: true,
                    sortOrder: sorter.columnKey === 'createTime' && sorter.order
                }]
            }
        },
        created() {
            this.logData(this.pagination);
        },
        methods:{
            handleTableChange(pagination, filters, sorter) {
                this.pagination = pagination;
                this.sorter = sorter;

                this.logData(pagination, sorter,this.searchParams);
            },
            logData(pagination = {}, sorter = {},searchParams = {}) {
                this.loading = true;
                if (searchParams.createTime && searchParams.createTime.length > 0) {
                    const from = searchParams.createTime[0];
                    const to = searchParams.createTime[1];
                    searchParams.createTimeFrom = from.format("YYYY-MM-DD");
                    searchParams.createTimeTo = to.format("YYYY-MM-DD");
                } else {
                    searchParams.createTimeFrom = "";
                    searchParams.createTimeTo = "";
                }
                this.$api.monitor.getSystemLog({
                    createTimeFrom: searchParams.createTimeFrom,
                    createTimeTo: searchParams.createTimeTo,
                    operation: searchParams.operation,
                    location: searchParams.location,

                    pageNum: pagination.current,
                    pageSize: pagination.pageSize,
                    sortField: sorter.field,
                    sortOrder: sorter.order,
                }).then(res => {
                    this.data = res.data.rows;
                    this.pagination.total = res.data.total;
                    this.loading = false;
                })
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
                        that.$api.monitor.deleteSystemLog(that.selectedRowKeys).then(() => {
                            that.$message.success("删除成功");
                            that.selectedRowKeys = [];
                            that.logData(that.pagination);
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
                this.logData(this.pagination);
            },
            search() {
                this.pagination.current = 1;
                this.logData(
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
                this.logData(this.pagination);
            },
        }
    }
</script>

<style scoped>

</style>