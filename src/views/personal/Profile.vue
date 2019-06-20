<template>
    <div>
        <a-card>
            <a href="javascript:void(0)" slot="extra" @click="updateProfile">编辑资料</a>
            <a-row :gutter="8">
                <a-col :span="6">
                    <a-row style="text-align: center">
                        <img style="width: 10rem;border-radius: 2px" alt="头像" :src="avatar">
                    </a-row>
                    <a-row style="text-align: center">
                        <a-button icon="edit" style="margin-top:1rem" @click="updateAvatar">修改头像</a-button>
                    </a-row>
                </a-col>
                <a-col :span="12" style="font-size: 1rem">
                    <p>账户：{{user.username}}</p>
                    <p :title="user.roleName">角色：{{user.roleName? user.roleName: '暂无角色'}}</p>
                    <p>性别：{{sex}}</p>
                    <p>电话：{{user.mobile ? user.mobile : '暂未绑定电话'}}</p>
                    <p>邮箱：{{user.email ? user.email : '暂未绑定邮箱'}}</p>
                    <p>部门：{{user.deptName? user.deptName: '暂无部门'}}</p>
                    <p>描述：{{user.description}}</p>
                </a-col>
            </a-row>
        </a-card>
        <update-avatar
                ref="updateAvatar"
                :user="user">
        </update-avatar>
        <update-profile
                ref="updateProfile"
                :user="user">
        </update-profile>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import UpdateAvatar from './UpdateAvatar'
    import UpdateProfile from './UpdateProfile'

    export default {
        name: 'Profile',
        components: {UpdateAvatar,UpdateProfile},
        computed: {
            ...mapState({
                user: state => state.user
            }),
            avatar() {
                return `static/avatar/${this.user.avatar}`
            },
            sex() {
                switch (this.user.ssex) {
                    case '0':
                        return '男';
                    case '1':
                        return '女';
                    case '2':
                        return '保密';
                    default:
                        return this.user.ssex
                }
            }
        },
        methods: {
            updateAvatar() {
                this.$refs.updateAvatar.visible=true;
            },
            updateProfile() {
                this.$refs.updateProfile.visible=true;
            },
        }
    }
</script>
<style>
    .user-profile .ant-card-body {
        padding: 1rem 0 !important;
    }
    .user-profile .ant-card-body p {
        font-size: .9rem !important;
        margin-bottom: .6rem !important;

    }
</style>
