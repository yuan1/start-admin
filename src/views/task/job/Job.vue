<template>
    <a-card>
        <div>
            <a-form layout="horizontal">
                <div style="width: calc(100% - 216px);display: inline-block;">
                    <a-row>
                        <a-col :md="12" :sm="24">
                            <a-form-item
                                    label="Bean名称"
                                    v-bind="formItemLayout">
                                <a-input v-model="searchParams.beanName"/>
                            </a-form-item>
                        </a-col>
                        <a-col :md="12" :sm="24">
                            <a-form-item
                                    label="方法名称"
                                    v-bind="formItemLayout">
                                <a-input v-model="searchParams.methodName"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row v-if="advanced">
                        <a-col :md="12" :sm="24">
                            <a-form-item
                                    label="方法参数"
                                    v-bind="formItemLayout">
                                <a-input v-model="searchParams.params"/>
                            </a-form-item>
                        </a-col>
                        <a-col :md="12" :sm="24">
                            <a-form-item
                                    label="执行时间"
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
        </div>
        <div>
            <div class="operator">
                <a-button ghost type="primary" @click="addClick">新增</a-button>
                <a-button  style="margin-left: 8px" @click="deleteClick">删除</a-button>
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
                     rowKey="jobId"
                     @change="handleTableChange"
                     :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            >
                <template slot="status" slot-scope="text">
                    <a-tag v-if="text==='0'" color="green">正常</a-tag>
                    <a-tag v-else color="orange">暂停</a-tag>
                </template>
                <template slot="operations" slot-scope="text, record">
                    <a-icon type="setting" theme="twoTone" twoToneColor="#4a9ff5"
                            @click="updateClick(record)" title="修改"></a-icon>
                    &nbsp;
                    <a-dropdown>
                        <a class="ant-dropdown-link">
                            <a-icon type="down-circle" style="font-size: 1.1rem"/>
                        </a>
                        <a-menu slot="overlay">
                            <a-menu-item>
                                <a href="javascript:void(0)" @click="runJob(record)">立即执行</a>
                            </a-menu-item>
                            <a-menu-item v-if="record.status === '0'">
                                <a href="javascript:void(0)" @click="pauseJob(record)">暂停任务</a>
                            </a-menu-item>
                            <a-menu-item v-if="record.status === '1'">
                                <a href="javascript:void(0)" @click="resumeJob(record)">恢复任务</a>
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </template>
            </a-table>
        </div>
        <JobEdit ref="modal" @ok="handleOk"/>
    </a-card>
</template>

<script>
    import JobEdit from "@/views/task/job/JobEdit";
    export default {
        name: "Job",
        components: {JobEdit},
        data() {
            return {
                advanced: false,
                data: [],
                selectedRowKeys: [],

                paginationInfo: null,
                pagination: {
                    pageSizeOptions: ["5", "10", "20", "30", "40", "100"],
                    defaultCurrent: 1,
                    current: 1,
                    total: 0,
                    defaultPageSize: 5,
                    pageSize: 5,
                    showSizeChanger: true //是否可以改变 pageSize
                },
                formItemLayout: {
                    labelCol: {span: 5},
                    wrapperCol:{span: 18, offset: 1},
                },

                sorter: {},
                filters: {},
                searchParams: {},
                loading: false,

            }
        },
        computed: {
            columns() {
                let {sorter, filters} = this;
                sorter = sorter || {};
                filters = filters || {};
                return [{
                    title: 'Bean名称',
                    dataIndex: 'beanName'
                }, {
                    title: '方法名称',
                    dataIndex: 'methodName'
                }, {
                    title: '方法参数',
                    dataIndex: 'params',
                    // scopedSlots: {customRender: 'params'},
                    width: 120
                }, {
                    title: 'Cron表达式',
                    dataIndex: 'cronExpression'
                }, {
                    title: '备注',
                    dataIndex: 'remark'
                }, {
                    title: '状态',
                    dataIndex: 'status',
                    scopedSlots: {customRender: 'status'},
                    filters: [
                        {text: '正常', value: '0'},
                        {text: '暂停', value: '1'}
                    ],
                    filterMultiple: false,
                    filteredValue: filters.status || null,
                }, {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    sorter: true,
                    sortOrder: sorter.columnKey === 'createTime' && sorter.order
                }, {
                    title: '操作',
                    dataIndex: 'operations',
                    scopedSlots: {customRender: 'operations'},
                    fixed: 'right',
                    width: 100
                }]
            }
        },
        created() {
            this.jobData({},this.pagination);
        },
        methods: {
            handleTableChange(pagination, filters, sorter) {
                this.pagination = pagination;
                this.sorter = sorter;
                this.filters = filters;
                this.jobData(this.searchParams, pagination, sorter, filters);
            },
            onSelectChange(selectedRowKeys) {
                this.selectedRowKeys = selectedRowKeys;
            },
            jobData(searchParams = {}, pagination = {}, sorter = {}, filters = {}) {
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
                this.$api.task.getJob({
                    createTimeFrom: searchParams.createTimeFrom,
                    createTimeTo: searchParams.createTimeTo,
                    roleName: searchParams.roleName,

                    pageNum: pagination.current,
                    pageSize: pagination.pageSize,
                    sortField: sorter.field,
                    sortOrder: sorter.order,
                    status: filters.status ? filters.status[0] : null,
                }).then(res => {
                    this.data = res.data.rows;
                    this.pagination.total = res.data.total;
                    this.loading = false;
                })
            },
            reset() {
                this.searchParams = {};
                this.sorter = {};
                this.filters = {};
                this.pagination.current = 1;
                this.jobData({}, this.pagination);
            },
            search() {
                this.pagination.current = 1;
                this.jobData(
                    this.searchParams,
                    this.pagination,
                    this.sorter,
                    this.filters
                );
            },
            toggleAdvanced() {
                this.advanced = !this.advanced;
            },
            addClick() {
                this.$refs.modal.add();
            },
            updateClick(data) {
                this.$refs.modal.update(data);
            },
            runJob(data) {
                this.jobId = data.jobId;
                this.$api.task.runJob(this.jobId).then(() => {
                    this.$message.success('执行定时任务成功');
                    this.search()
                }).catch(() => {
                    this.$message.error('执行定时任务失败')
                })
            },
            pauseJob(data) {
                this.jobId = data.jobId;
                this.$api.task.pauseJob(this.jobId).then(() => {
                    this.$message.success('暂停定时任务成功');
                    this.search()
                }).catch(() => {
                    this.$message.error('暂停定时任务失败')
                })
            },
            resumeJob(data) {
                this.jobId = data.jobId;
                this.$api.task.resumeJob(this.jobId).then(() => {
                    this.$message.success('恢复定时任务成功');
                    this.search()
                }).catch(() => {
                    this.$message.error('恢复定时任务失败')
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
                        that.$api.task.deleteJob(that.selectedRowKeys).then(() => {
                            that.$message.success("删除成功");
                            that.selectedRowKeys = [];
                            that.jobData({},that.pagination);
                        });
                    },
                    onCancel() {
                        that.selectedRowKeys = [];
                    }
                });
            },
            handleOk() {
                this.jobData({},this.pagination);
            }
        }

    }
</script>

<style scoped>

</style>