<template>
    <a-card :bordered="false">
        <div>
            <!-- 搜索区域 -->
            <a-form layout="horizontal">
                <div :class="advanced ? null: 'fold'">
                    <a-row>
                        <a-col :md="12" :sm="24">
                            <a-form-item
                                    label="名称"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}">
                                <a-input v-model="searchParams.deptName"/>
                            </a-form-item>
                        </a-col>
                        <a-col :md="12" :sm="24">
                            <a-form-item
                                    label="创建时间"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}">
                                <a-range-picker v-model="searchParams.createTime"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </div>
                <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset">重置</a-button>
        </span>
            </a-form>
        </div>
        <div>
            <div style="margin-bottom: 18px;">
                <a-button type="primary" ghost @click="addClick">新增</a-button>
                <a-button style="margin-left: 8px" @click="deleteClick"> 删除</a-button>
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
                     rowKey="id"
                     :dataSource="data"
                     :pagination="pagination"
                     :loading="loading"
                     :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                     @change="handleTableChange" :scroll="{ x: 1500 }">
                <template slot="operation" slot-scope="text, record">
                    <a-icon type="setting" theme="twoTone" twoToneColor="#4a9ff5"
                            @click="updateClick(record)" title="修改"></a-icon>
                </template>
            </a-table>
        </div>
        <DeptEdit ref="modal" @ok="handleOk"/>
    </a-card>
</template>

<script>
    import DeptEdit from "@/views/system/dept/DeptEdit";
    export default {
        name: "Dept",
        components: {DeptEdit},
        data(){
            return{
                advanced: false,
                data: [],
                selectedRowKeys: [],
                pagination: {
                    defaultPageSize: 10000000,
                    hideOnSinglePage: true,
                    indentSize: 100
                },
                loading: false,
                searchParams: {},
                sorter:{},
            }
        },
        computed: {
            columns() {
                let {sorter} = this;
                sorter = sorter || {};
                return [{
                    title: '名称',
                    dataIndex: 'text'
                }, {
                    title: '排序',
                    dataIndex: 'order'
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
                    scopedSlots: {customRender: 'operation'},
                    fixed: 'right',
                    width: 120
                }]
            }
        },
        created() {
            this.deptData();
        },
        methods:{
            handleTableChange(pagination, filters, sorter) {
                this.sorter = sorter;

                this.deptData(sorter,this.searchParams );
            },
            deptData(sorter = {},searchParams = {}) {
                if (searchParams.createTime && searchParams.createTime.length > 0) {
                    const from = searchParams.createTime[0];
                    const to = searchParams.createTime[1];
                    searchParams.createTimeFrom = from.format("YYYY-MM-DD");
                    searchParams.createTimeTo = to.format("YYYY-MM-DD");
                } else {
                    searchParams.createTimeFrom = "";
                    searchParams.createTimeTo = "";
                }
                this.$api.userManager.getDept({
                    createTimeFrom: searchParams.createTimeFrom,
                    createTimeTo: searchParams.createTimeTo,
                    deptName: searchParams.deptName,

                    sortField: sorter.field,
                    sortOrder: sorter.order,
                }).then(res => {
                    this.data = res.data.rows.children;
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
                console.log('1111111',data)
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
                        that.$api.userManager.deleteDept(that.selectedRowKeys).then(() => {
                            that.$message.success("删除成功");
                            that.selectedRowKeys = [];
                            that.deptData();
                        });
                    },
                    onCancel() {
                        that.selectedRowKeys = [];
                    }
                });
            },
            reset() {
                this.sorter = {};
                this.searchParams = {};
                this.deptData();
            },
            search() {
                this.deptData(this.sorter, this.searchParams,);
            },
            handleOk() {
                this.deptData();
            },
        }
    }
</script>

<style scoped>

</style>