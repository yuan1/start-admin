<template>
    <a-card>
        <div>
            <!-- 搜索区域 -->
            <a-form layout="horizontal">
                <div style="width: calc(100% - 216px);display: inline-block;">
                    <a-row>
                        <a-col :md="12" :sm="24">
                            <a-form-item
                                    label="用户名"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}">
                                <a-input v-model="searchParams.username"/>
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
            <!-- 表格区域 -->
            <a-table :columns="columns"
                     :dataSource="data"
                     :pagination="pagination"
                     :loading="loading"
                     rowKey="id"
                     :scroll="{ x: 900 }"
                     @change="handleTableChange">
                <template slot="username" slot-scope="text, record">
                    <template v-if="record.id === user.id">
                        {{record.username}}&nbsp;&nbsp;<a-tag color="pink">current</a-tag>
                    </template>
                    <template v-else>
                        {{record.username}}
                    </template>
                </template>
                <template slot="operation" slot-scope="text, record">
                    <a-icon type="poweroff" style="color: #f95476"
                            @click="kickout(record)" title="踢出"></a-icon>
                </template>
            </a-table>
        </div>
    </a-card>
</template>

<script>

    import {mapState} from 'vuex'

    export default {
        name: "Online",
        data() {
            return {
                searchParams: {},
                advanced: false,
                data: [],
                pagination: {
                    defaultPageSize: 10000000,
                    hideOnSinglePage: true,
                    indentSize: 100
                },
                loading: false
            }
        },
        computed: {
            columns() {
                return [{
                    title: '用户名',
                    dataIndex: 'username',
                    scopedSlots: {customRender: 'username'}
                }, {
                    title: '登录时间',
                    dataIndex: 'loginTime'
                }, {
                    title: '登录IP',
                    dataIndex: 'ip'
                }, {
                    title: '登录地点',
                    dataIndex: 'loginAddress'
                }, {
                    title: '操作',
                    dataIndex: 'operation',
                    scopedSlots: {customRender: 'operation'},
                    fixed: 'right',
                    width: 120
                }]
            },
            ...mapState({
                user: state => state.user
            })
        },
        created() {
            this.onlineData(this.searchParams);
        },
        methods: {
            onlineData(searchParams = {}) {
                this.loading = true;
                this.$api.monitor.getOnline({
                    username: searchParams.username,

                }).then(res => {
                    this.data = res.data.data;
                    this.loading = false;
                })
            },
            handleTableChange() {

            },
            reset() {
                this.searchParams = {};
                this.onlineData();
            },
            search() {
                this.onlineData(this.searchParams);
            },
            kickout(record) {
                let that = this;
                this.$confirm({
                    title: '确定踢出该用户?',
                    content: '当您点击确定按钮后，该用户的登录将会马上失效',
                    centered: true,
                    onOk() {
                        that.$api.monitor.deleteOnline(record.id).then(() => {
                            that.$message.success('踢出用户成功');
                            if (that.user.id === record.id) {
                                that.onlineData(this.searchParams);
                                location.reload()
                            } else {
                                that.search()
                            }
                        }).catch((res) => {
                            console.error(res);
                            that.$message.error('踢出用户失败')
                        })
                    }
                })
            },

        },
    }
</script>

<style scoped>

</style>