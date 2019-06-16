<template>
  <a-card :bordered="false">
    <div>
      <a-form ayout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24">
              <a-form-item label="用户名" :labelCol="{span: 4}" :wrapperCol="{span: 18, offset: 2}">
                <a-input v-model="searchParams.username"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="部门" :labelCol="{span: 4}" :wrapperCol="{span: 18, offset: 2}">
                <a-tree-select
                  :dropdownStyle="{ maxHeight: '220px', overflow: 'auto' }"
                  :treeData="deptData"
                  v-model="searchParams.deptId"
                ></a-tree-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24">
                <a-form-item label="创建时间" :labelCol="{span: 4}" :wrapperCol="{span: 18, offset: 2}">
                  <a-range-picker v-model="searchParams.createTime"/>
                </a-form-item>
              </a-col>
            </template>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            <a style="margin-left: 8px" @click="toggleAdvanced">
              {{advanced ? '收起' : '展开'}}
              <a-icon :type="advanced ? 'up' : 'down'"/>
            </a>
          </span>
        </a-row>
      </a-form>
    </div>
    <div>
      <div style="margin-bottom: 18px;">
        <a-button type="primary" ghost @click="addClick">新增</a-button>
        <a-button style="margin-left: 8px" @click="deleteClick">删除</a-button>
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item key="1">
              <a-icon type="user"/>密码重置
            </a-menu-item>
            <a-menu-item key="2">
              <a-icon type="user"/>导出Excel
            </a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px" type="primary" ghost>
            更多操作
            <a-icon type="down"/>
          </a-button>
        </a-dropdown>
      </div>
      <a-table
        :columns="columns"
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
        <template slot="operation" slot-scope="text, record">
          <a-icon
            type="setting"
            theme="twoTone"
            twoToneColor="#4a9ff5"
            title="修改用户"
            @click="updateClick(record)"
          ></a-icon>
        </template>
      </a-table>
    </div>
    <UserEdit ref="modal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import UserEdit from "@/views/system/user/UserEdit";

export default {
  name: "User",
  components: { UserEdit },
  data() {
    return {
      data: [],
      selectedRowKeys: [], //选中
      form: this.$form.createForm(this),
      formLayout: "horizontal",
      advanced: false,
      loading: false,
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
      filters: {},
      deptData: [],
      searchParams: {}
    };
  },
  computed: {
    columns() {
      let { sorter, filters } = this;
      return [
        {
          title: "用户名",
          sorter: true,
          dataIndex: "username",
          sortOrder: sorter.columnKey === 'username' && sorter.order
        },
        {
          title: "性别",
          dataIndex: "ssex",
          customRender: text => {
            switch (text) {
              case "0":
                return "男";
              case "1":
                return "女";
              case "2":
                return "保密";
              default:
                return text;
            }
          },
          filters: [
            { text: "男", value: "0" },
            { text: "女", value: "1" },
            { text: "保密", value: "2" }
          ],
          filterMultiple: false, //是否多选
          filteredValue: filters.ssex || null,
        },
        {
          title: "邮箱",
          dataIndex: "email",
          // scopedSlots: {customRender: 'email'},
          width: 100
        },
        {
          title: "部门",
          dataIndex: "deptName"
        },
        {
          title: "电话",
          dataIndex: "mobile"
        },
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" },
          filters: [{ text: "有效", value: "1" }, { text: "锁定", value: "0" }],
          filterMultiple: false,
          filteredValue: filters.status || null,
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          sorter: true,
          sortOrder: sorter.columnKey === 'createTime' && sorter.order
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ];
    }
  },
  created() {
    this.getDept();
    this.userData({}, this.pagination);
  },
  methods: {
    getDept() {
      this.$api.userManager.getDept().then(res => {
        this.deptData = res.data.rows.children;
      });
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = pagination;
      this.sorter = sorter;
      this.filters = filters;
      this.userData(this.searchParams, pagination, sorter, filters);
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    userData(searchParams = {}, pagination = {}, sorter = {}, filters = {}) {
      if (searchParams.createTime && searchParams.createTime.length > 0) {
        const from = searchParams.createTime[0];
        const to = searchParams.createTime[1];
        searchParams.createTimeFrom = from.format("YYYY-MM-DD");
        searchParams.createTimeTo = to.format("YYYY-MM-DD");
      } else {
        searchParams.createTimeFrom = "";
        searchParams.createTimeTo = "";
      }

      this.$api.userManager
        .getUser({
          createTimeFrom: searchParams.createTimeFrom,
          createTimeTo: searchParams.createTimeTo,
          username: searchParams.username,
          deptId: searchParams.deptId,

          pageNum: pagination.current,
          pageSize: pagination.pageSize,
          sortField: sorter.field,
          sortOrder: sorter.order,
          ssex: filters.ssex ? filters.ssex[0] : null,
          status: filters.status ? filters.status[0] : null
        })
        .then(res => {
          this.data = res.data.rows;
          this.pagination.total = res.data.total;
          console.error("res.data", res.data);
        });
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
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    addClick() {
      this.$refs.modal.add();
    },
    updateClick(data) {
      this.$refs.modal.update(data);
    },
    resetPWD(){
      if (!this.selectedRowKeys.length) {
        this.$message.warning("请选择需要重置的记录");
        return;
      }

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
          that.$api.userManager.deleteUser(that.selectedRowKeys).then(() => {
            that.$message.success("删除成功");
            that.selectedRowKeys = [];
            this.userData({},this.pagination);
          });
        },
        onCancel() {
          that.selectedRowKeys = [];
        }
      });
    },
    handleOk() {
      this.userData({},this.pagination);
    }
  }
};
</script>

<style scoped>
</style>
