<template>
    <a-card :bordered="false" class="card-area">
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
                                <a-input v-model="searchParams.menuName"/>
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
            <div class="operator">
                <a-popconfirm
                        title="请选择创建类型"
                        okText="按钮"
                        cancelText="菜单">
                    <a-icon slot="icon" type="question-circle-o" style="color: orangered"/>
                    <a-button type="primary" ghost @click="addClick">新增</a-button>
                </a-popconfirm>
                <a-button @click="deleteClick">删除</a-button>
                <a-dropdown>
                    <a-menu slot="overlay">
                        <a-menu-item key="export-data">导出Excel</a-menu-item>
                    </a-menu>
                    <a-button>
                        更多操作
                        <a-icon type="down"/>
                    </a-button>
                </a-dropdown>
            </div>
            <!-- 表格区域 -->
            <a-table :columns="columns"
                     :key="key"
                     :dataSource="data"
                     :pagination="pagination"
                     :loading="loading"
                     :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                     @change="handleTableChange" :scroll="{ x: 1500 }">
                <template slot="icon" slot-scope="text">
                    <a-icon :type="text"/>
                </template>
                <template slot="type" slot-scope="text">
                    <a-tag v-if="text==='0'" color="cyan"> 菜单</a-tag>
                    <a-tag v-if="text==='1'" color="pink"> 按钮</a-tag>
                </template>
            </a-table>
        </div>
        <MenuEdit ref="modal" @ok="handleOk"/>
    </a-card>
</template>

<script>
    import MenuEdit from "@/views/system/menu/MenuAdd";
    export default {
        name: "Menu",
        components: {MenuEdit},
        data() {
            return {
                advanced: false,
                data: [],
                selectedRowKeys: [],
                pagination: {
                    defaultPageSize: 10000000,
                    hideOnSinglePage: true,
                    indentSize: 100
                },
                loading: false,
                filters: {},
                sorter: {},
                searchParams: {}
            }
        },
        computed: {
            columns() {
                let { filters } = this;
                filters = filters || {};
                return [{
                    title: '名称',
                    dataIndex: 'text',
                    width: 200,
                    fixed: 'left'
                }, {
                    title: '图标',
                    dataIndex: 'icon',
                    scopedSlots: {customRender: 'icon'}
                }, {
                    title: '类型',
                    dataIndex: 'type',
                    scopedSlots: {customRender: 'type'},
                    filters: [
                        {text: '按钮', value: '1'},
                        {text: '菜单', value: '0'}
                    ],
                    filterMultiple: false,
                    filteredValue: filters.type || null,
                    onFilter: (value, record) => record.type.includes(value)
                }, {
                    title: '地址',
                    dataIndex: 'path'
                }, {
                    title: 'Vue组件',
                    dataIndex: 'component'
                }, {
                    title: '权限',
                    dataIndex: 'permission'
                }, {
                    title: '排序',
                    dataIndex: 'order'
                }, {
                    title: '创建时间',
                    dataIndex: 'createTime'
                }, {
                    title: '修改时间',
                    dataIndex: 'modifyTime'
                }, {
                    title: '操作',
                    dataIndex: 'operation',
                    width: 120,
                    scopedSlots: {customRender: 'operation'},
                    fixed: 'right'
                }]
            }
        },
        created() {
            this.menuData({}, this.pagination);
        },
        methods: {
            handleTableChange(pagination, filters, sorter) {
                this.pagination = pagination;
                this.filters = filters;
                this.sorter = sorter;
                this.menuData(this.searchParams, pagination,filters );
            },
            menuData(searchParams = {}, pagination = {}, filters = {}) {
                if (searchParams.createTime && searchParams.createTime.length > 0) {
                    const from = searchParams.createTime[0];
                    const to = searchParams.createTime[1];
                    searchParams.createTimeFrom = from.format("YYYY-MM-DD");
                    searchParams.createTimeTo = to.format("YYYY-MM-DD");
                } else {
                    searchParams.createTimeFrom = "";
                    searchParams.createTimeTo = "";
                }
                this.$api.userManager.getMenu({
                    createTimeFrom: searchParams.createTimeFrom,
                    createTimeTo: searchParams.createTimeTo,
                    menuName: searchParams.menuName,

                    pageNum: pagination.current,
                    pageSize: pagination.pageSize,
                    type: filters.type ? filters.type[0] : null,
                }).then(res => {
                    this.data = res.data.rows;
                    this.pagination.total = res.data.total;
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
                    this.$message.warning('请选择需要删除的记录');
                    return
                }
                let that = this;
                this.$confirm({
                    title: '确定删除所选中的记录?',
                    content: '当您点击确定按钮后，这些记录将会被彻底删除，如果其包含子记录，也将一并删除！',
                    centered: true,
                    onOk() {
                        that.$api.userManager.deleteMenu().then(() => {
                            that.$message.success('删除成功');
                            that.selectedRowKeys = [];
                            that.menuData({}, that.pagination);
                        })
                    },
                    onCancel() {
                        that.selectedRowKeys = []
                    }
                })
            },
            reset() {
                this.searchParams = {};
                this.sorter = {};
                this.filters = {};
                this.pagination.current = 1;
                this.userData({}, this.pagination);
            },
            search() {
                this.pagination.current = 1;
                this.userData(
                    this.searchParams,
                    this.pagination,
                    this.sorter,
                    this.filters
                );
            },
        }
    }
</script>

<style scoped>

</style>