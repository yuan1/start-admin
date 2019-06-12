<template>
    <a-table :columns="columns"
             :dataSource="data"
             :pagination="pagination"
             :loading="loading"
             rowKey="userId" 
             :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
             @change="handleTableChange"
    >
        <template slot="status" slot-scope="text">
            <a-tag v-if="text==='1'" color="cyan">有效</a-tag>
            <a-tag v-else color="red">锁定</a-tag>
        </template>
    </a-table>
</template>

<script>
    const columns = [{
        title: '用户名',
        sorter: true,
        dataIndex: 'username',
    }, {
        title: '性别',
        dataIndex: 'ssex',
        customRender: (text) => {
            switch (text) {
                case '0':
                    return '男';
                case '1':
                    return '女';
                case '2':
                    return '保密';
                default:
                    return text
            }
        },
        filters: [
            {text: '男', value: '0'},
            {text: '女', value: '1'},
            {text: '保密', value: '2'}
        ],
        filterMultiple: false, //是否多选
    },{
        title: '邮箱',
        dataIndex: 'email',
        // scopedSlots: {customRender: 'email'},
        width: 100
    }, {
        title: '部门',
        dataIndex: 'deptName'
    }, {
        title: '电话',
        dataIndex: 'mobile'
    }, {
        title: '状态',
        dataIndex: 'status',
        scopedSlots: {customRender: 'status'},
        filters: [
            {text: '有效', value: '1'},
            {text: '锁定', value: '0'}
        ],
        filterMultiple: false,
    }, {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
    }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: {customRender: 'operation'}
    }];

    export default {
        name: "User",
        data() {
            return {
                data: [],
                columns,
                selectedRowKeys:[], //选中
                form: this.$form.createForm(this),
                loading: false,
                pagination: {
                    pageSizeOptions: ['10', '20', '30', '40', '100'],
                    defaultCurrent: 1,
                    total:0,
                    defaultPageSize: 10,
                    showSizeChanger: true, //是否可以改变 pageSize
                },
            }
        },
        created() {
            this.userData();
        },
        methods:{
            handleTableChange(pagination, filters, sorter){
                console.log(pagination);
                console.log(filters);  
                console.log(sorter);
                this.$api.userManager.getUser({
                    pageNum:pagination.current,
                    pageSize:pagination.pageSize,
                    sortField:sorter.field,
                    sortOrder:sorter.order,
                    ssex:filters.ssex?filters.ssex[0]:null,
                    status:filters.status?filters.status[0]:null,
            }).then(res => {
                    this.data = res.data.rows;
                    this.pagination.total = res.data.total
                })

                
            },
            onSelectChange (selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys
            },
            userData () {
                this.$api.userManager.getUser({
                    pageNum:this.pagination.defaultCurrent,
                    pageSize:this.pagination.defaultPageSize,
            }).then(res => {
                    this.data = res.data.rows;
                    this.pagination.total = res.data.total
                    console.error('res.data',res.data)
                })
            },



        },



    }
</script>

<style scoped>

</style>