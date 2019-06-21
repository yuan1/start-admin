<template>
    <a-card :bordered="false">
        <div>
            <a-form layout="horizontal">
                <div style="width: calc(100% - 216px);display: inline-block;">
                    <a-row>
                        <a-col :md="8" :sm="24">
                            <a-form-item
                                    label="键"
                                    v-bind="formItemLayout">
                                <a-input v-model="searchParams.keyy"/>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item
                                    label="值"
                                    v-bind="formItemLayout">
                                <a-input v-model="searchParams.valuee"/>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item
                                    label="表名"
                                    v-bind="formItemLayout">
                                <a-input v-model="searchParams.tableName"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row v-if="advanced">
                        <a-col :md="8" :sm="24">
                            <a-form-item
                                    label="字段"
                                    v-bind="formItemLayout">
                                <a-input v-model="searchParams.fieldName"/>
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
            <div style="margin-bottom: 18px;">
                <a-button v-hasPermission="'dict:add'" type="primary" ghost @click="addClick">新增</a-button>
                <a-button v-hasPermission="'dict:delete'" style="margin-left: 8px" @click="deleteClick">删除</a-button>
                <a-dropdown v-hasPermission="'dict:export'">
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
                     rowKey="dictId"
                     :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                     @change="handleTableChange" :scroll="{ x: 1500 }">
                <template slot="remark" slot-scope="text">
                    <a-popover placement="topLeft">
                        <template slot="content">
                            <div style="max-width: 200px">{{text}}</div>
                        </template>
                        <p style="width: 200px;margin-bottom: 0">{{text}}</p>
                    </a-popover>
                </template>
                <template slot="operation" slot-scope="text,record">
                    <a-icon v-hasPermission="'dict:update'"  type="setting" theme="twoTone" twoToneColor="#4a9ff5"
                            @click="updateClick(record)" title="修改字典"></a-icon>
                    <a-badge v-hasNoPermission="'dict:update'" status="warning" text="无权限"></a-badge>
                </template>
            </a-table>
        </div>

       <DictEdit ref="modal" @ok="handleOk"/>
    </a-card>
</template>
<script>

    import DictEdit from "@/views/system/dict/DictEdit";
    export default {
        name: "Dict",
        components: {DictEdit},
        data() {
            return {
                advanced: false,
                loading: false,
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

                searchParams: {},
            }
        },
        computed: {
            columns() {
                return [{
                    title: '键',
                    dataIndex: 'keyy'
                }, {
                    title: '值',
                    dataIndex: 'valuee'
                }, {
                    title: '表名',
                    dataIndex: 'tableName'
                }, {
                    title: '字段',
                    dataIndex: 'fieldName'
                }, {
                    title: '操作',
                    dataIndex: 'operation',
                    scopedSlots: {customRender: 'operation'},
                    fixed: 'right',
                    width: 100
                }]
            }
        },
        created() {
            this.dictData({},this.pagination);
        },
        methods: {
            handleTableChange(pagination) {
                this.pagination = pagination;

                this.dictData(this.searchParams, pagination);
            },
            dictData(searchParams = {}, pagination = {}) {
                this.loading = true;
                this.$api.userManager.getDict({
                    keyy: searchParams.keyy,
                    valuee: searchParams.valuee,
                    tableName: searchParams.tableName,
                    fieldName: searchParams.fieldName,

                    pageNum: pagination.current,
                    pageSize: pagination.pageSize,
                }).then(res => {
                    this.data = res.data.rows;
                    this.pagination.total = res.data.total;
                    this.loading = false;
                })
            },
            onSelectChange(selectedRowKeys) {
                this.selectedRowKeys = selectedRowKeys
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
                        that.$api.userManager.deleteDict(that.selectedRowKeys).then(() => {
                            that.$message.success("删除成功");
                            that.selectedRowKeys = [];
                            that.dictData({},this.pagination);
                        });
                    },
                    onCancel() {
                        that.selectedRowKeys = [];
                    }
                });
            },
            reset() {
                this.searchParams = {};
                this.pagination.current = 1;
                this.dictData({},this.pagination);
            },
            search() {
                this.dictData(this.searchParams, this.pagination,);
            },
            toggleAdvanced() {
                this.advanced = !this.advanced;
            },
            handleOk() {
                this.dictData({},this.pagination);
            },
        }
    }
</script>

<style scoped>

</style>