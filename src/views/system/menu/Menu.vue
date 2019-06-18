<template>
    <a-card :bordered="false">
        <div>
            <!-- 搜索区域 -->
            <a-form layout="horizontal">
                <div>
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
            <div style="margin-bottom: 18px;">
                <a-popconfirm
                        title="请选择创建类型"
                        okText="按钮"
                        cancelText="菜单"
                        @cancel="() => addMenuClick()"
                        @confirm="() => addButtonClick()">
                    <a-icon slot="icon" type="question-circle-o" style="color: orangered"/>
                    <a-button type="primary" ghost>新增</a-button>
                </a-popconfirm>
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
                <template slot="operation" slot-scope="text,record">
                    <a-icon  type="setting" theme="twoTone" twoToneColor="#4a9ff5" title="修改"  @click="edit(record)"></a-icon>
                </template>
            </a-table>
        </div>
        <MenuEdit ref="modal" @ok="handleOk"/>
        <ButtonEdit ref="model" @ok="handleOk"/>
    </a-card>
</template>

<script>
    import MenuEdit from "@/views/system/menu/MenuEdit";
    import ButtonEdit from "@/views/system/menu/ButtonEdit";
    export default {
        name: "Menu",
        components: {ButtonEdit, MenuEdit},
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
            this.menuData();
        },
        methods: {
            handleTableChange(pagination, filters) {
                this.filters = filters;
                this.menuData(filters,this.searchParams );
            },
            menuData(filters = {},searchParams = {}) {
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
                    type: filters.type ? filters.type[0] : null,
                }).then(res => {
                    this.data = res.data.rows.children;
                })
            },
            onSelectChange(selectedRowKeys) {
                this.selectedRowKeys = selectedRowKeys
            },
            edit(record) {
                if (record.type === '0') {
                   this.updateMenuClick(record);
                } else {
                    this.updateButton(record);
                }
            },
            addMenuClick() {
                this.$refs.modal.addMenu();
            },
            updateMenuClick(record) {
                this.$refs.modal.updateMenu(record);
            },
            addButtonClick() {
                this.$refs.model.addButton();
            },
            updateButton(record) {
                this.$refs.model.updateButton(record);
            },
            deleteClick(){
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
                        console.error('that.selectedRowKeys',that.selectedRowKeys);
                        that.$api.userManager.deleteMenu(that.selectedRowKeys).then(() => {
                            that.$message.success('删除成功');
                            that.selectedRowKeys = [];
                            that.menuData();
                        })
                    },
                    onCancel() {
                        that.selectedRowKeys = []
                    }
                })
            },
            reset() {
                this.searchParams = {};
                this.filters = {};
                this.menuData();
            },
            search() {
                this.menuData(this.filters, this.searchParams,);
            },
            handleOk() {
                this.menuData();
            },
        }
    }
</script>

<style scoped>

</style>