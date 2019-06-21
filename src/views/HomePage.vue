<template>
    <div>
        <a-row :gutter="8" class="head-info">
            <a-card class="head-info-card" :bordered="false">
                <a-col :span="12">
                    <div class="head-info-avatar">
                        <img alt="头像" :src="avatar">
                    </div>
                    <div class="head-info-count">
                        <div class="head-info-welcome">
                            {{welcomeMessage}}
                        </div>
                        <div class="head-info-desc">
                            <p>{{user.deptName ? user.deptName : '暂无部门'}} | {{user.roleName ? user.roleName :
                                '暂无角色'}}</p>
                        </div>
                        <div class="head-info-time">上次登录时间：{{user.lastLoginTime ? user.lastLoginTime : '第一次访问系统'}}</div>
                    </div>
                </a-col>
                <a-col :span="12">
                    <div>
                        <a-row class="more-info">
                            <a-col :span="4"></a-col>
                            <a-col :span="4"></a-col>
                            <a-col :span="4"></a-col>
                            <a-col :span="4">
                                <span>今日IP</span>
                                <p><a>11</a></p>
                            </a-col>
                            <a-col :span="4">
                                <span>今日访问</span>
                                <p><a>11</a></p>
                            </a-col>
                            <a-col :span="4">
                                <span>总访问量</span>
                                <p><a>111</a></p>
                            </a-col>
                        </a-row>
                    </div>
                </a-col>
            </a-card>
        </a-row>
        <div class="content">
            <a-row :gutter="24">
                <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
                    <a-card title="进行中的任务">
                        <a slot="extra">全部任务</a>
                        <a-card-grid style="width:25%;;height:160px;textAlign:'center'">
                            <a-card-meta
                                    title="某任务"
                                    description="那是一种内在的东西， 他们到达不了，也无法触及的，那是你的。">
                                <a-avatar slot="avatar"
                                          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                            </a-card-meta>
                            <div class="project-item">
                                <a href="/#/">科学搬砖组</a>
                                <span class="datetime">9小时前</span>
                            </div>
                        </a-card-grid>
                        <a-card-grid style="width:25%;;height:160px;textAlign:'center'">
                            <a-card-meta
                                    title="某任务"
                                    description="那是一种内在的东西， 他们到达不了，也无法触及的，那是你的。">
                                <a-avatar slot="avatar"
                                          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                            </a-card-meta>
                            <div class="project-item">
                                <a href="/#/">科学搬砖组</a>
                                <span class="datetime">9小时前</span>
                            </div>
                        </a-card-grid>
                        <a-card-grid style="width:25%;;height:160px;textAlign:'center'">
                            <a-card-meta
                                    title="某任务"
                                    description="那是一种内在的东西， 他们到达不了，也无法触及的，那是你的。">
                                <a-avatar slot="avatar"
                                          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                            </a-card-meta>
                            <div class="project-item">
                                <a href="/#/">科学搬砖组</a>
                                <span class="datetime">9小时前</span>
                            </div>
                        </a-card-grid>
                        <a-card-grid style="width:25%;;height:160px;textAlign:'center'">
                            <a-card-meta
                                    title="某任务"
                                    description="那是一种内在的东西， 他们到达不了，也无法触及的，那是你的。">
                                <a-avatar slot="avatar"
                                          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                            </a-card-meta>
                            <div class="project-item">
                                <a href="/#/">科学搬砖组</a>
                                <span class="datetime">9小时前</span>
                            </div>
                        </a-card-grid>
                        <a-card-grid style="width:25%;;height:160px;textAlign:'center'">
                            <a-card-meta
                                    title="某任务"
                                    description="那是一种内在的东西， 他们到达不了，也无法触及的，那是你的。">
                                <a-avatar slot="avatar"
                                          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                            </a-card-meta>
                            <div class="project-item">
                                <a href="/#/">科学搬砖组</a>
                                <span class="datetime">9小时前</span>
                            </div>
                        </a-card-grid>
                        <a-card-grid style="width:25%;;height:160px;textAlign:'center'">
                            <a-card-meta
                                    title="某任务"
                                    description="那是一种内在的东西， 他们到达不了，也无法触及的，那是你的。">
                                <a-avatar slot="avatar"
                                          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                            </a-card-meta>
                            <div class="project-item">
                                <a href="/#/">科学搬砖组</a>
                                <span class="datetime">9小时前</span>
                            </div>
                        </a-card-grid>
                        <a-card-grid style="width:25%;;height:160px;textAlign:'center'">
                            <a-card-meta
                                    title="某任务"
                                    description="那是一种内在的东西， 他们到达不了，也无法触及的，那是你的。">
                                <a-avatar slot="avatar"
                                          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                            </a-card-meta>
                            <div class="project-item">
                                <a href="/#/">科学搬砖组</a>
                                <span class="datetime">9小时前</span>
                            </div>
                        </a-card-grid>
                        <a-card-grid style="width:25%;;height:160px;textAlign:'center'">
                            <a-card-meta
                                    title="某任务"
                                    description="那是一种内在的东西， 他们到达不了，也无法触及的，那是你的。">
                                <a-avatar slot="avatar"
                                          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                            </a-card-meta>
                            <div class="project-item">
                                <a href="/#/">科学搬砖组</a>
                                <span class="datetime">9小时前</span>
                            </div>
                        </a-card-grid>
                    </a-card>
                    <a-card title="动态">
                        <a-list>
                            <a-list-item>
                                <a-list-item-meta>
                                    <a-avatar slot="avatar" icon="user"/>
                                    <div slot="title">
                                        林东东 在 <a href="#" style="color: #1890ff;">Ant Design ProAnt Design ProAnt Design
                                        ProAnt Design ProAnt Design ProAnt Design Pro</a>工作中完成了
                                        <a href="#" style="color: #1890ff;">留言任务</a>
                                    </div>
                                    <div slot="description">3天前</div>
                                </a-list-item-meta>
                            </a-list-item>
                            <a-list-item>
                                <a-list-item-meta>
                                    <a-avatar slot="avatar" icon="user"/>
                                    <div slot="title">
                                        林东东 在 <a href="#" style="color: #1890ff;"> Ant De</a>工作中完成了
                                        <a href="#" style="color: #1890ff;">留言任务留言任务留言任务留言任务留言任务</a>
                                    </div>
                                    <div slot="description">3天前</div>
                                </a-list-item-meta>
                            </a-list-item>
                            <a-list-item>
                                <a-list-item-meta>
                                    <a-avatar slot="avatar" icon="user"/>
                                    <div slot="title">
                                        林东东 在 <a href="#" style="color: #1890ff;">Ant Design Pro</a>工作中完成了
                                        <a href="#" style="color: #1890ff;">留言</a>
                                    </div>
                                    <div slot="description">3天前</div>
                                </a-list-item-meta>
                            </a-list-item>

                        </a-list>
                    </a-card>
                </a-col>
                <a-col
                        style="padding: 0 12px"
                        :xl="8"
                        :lg="24"
                        :md="24"
                        :sm="24"
                        :xs="24">
                    <a-card title="工作列表" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
                        <a slot="extra">全部工作</a>
                        <div class="item-group">
                            <p>
                                <a-avatar slot="avatar" size="small"
                                          src="https://axure-file.lanhuapp.com/6b1d2547-b791-4d62-adce-a4881352a46d__862eb7a7eeb6b7490153498e634cb182"/>
                                高逼格设计天团高逼格设计天团高逼
                            </p>
                            <p>
                                <a-avatar slot="avatar" size="small"
                                          src="https://axure-file.lanhuapp.com/6b1d2547-b791-4d62-adce-a4881352a46d__862eb7a7eeb6b7490153498e634cb182"/>
                                中二少女团中二少女团中二少女团中二少高逼格设计天团高逼格设计天团高逼
                            </p>
                            <p>
                                <a-avatar slot="avatar" size="small"
                                          src="https://axure-file.lanhuapp.com/6b1d2547-b791-4d62-adce-a4881352a46d__862eb7a7eeb6b7490153498e634cb182"/>
                                程序员日常程序员日常程序员日常程序员高逼格设计天团高逼格设计天团高逼
                            </p>
                            <p>
                                <a-avatar slot="avatar" size="small"
                                          src="https://axure-file.lanhuapp.com/6b1d2547-b791-4d62-adce-a4881352a46d__862eb7a7eeb6b7490153498e634cb182"/>
                                科学搬砖组科学搬砖组科学搬砖组科学学高逼格设计天团高逼格设计天团高逼
                            </p>
                        </div>
                    </a-card>
                    <a-card title="团队">
                        <div class="members">
                            <a-row>
                                <a-col :span="12">
                                    <a>
                                        <a-avatar size="small" icon="user"/>
                                        <span class="member">科学搬砖组</span>
                                    </a>
                                </a-col>
                                <a-col :span="12">
                                    <a>
                                        <a-avatar size="small" icon="user"/>
                                        <span class="member">科学搬砖组</span>
                                    </a>
                                </a-col>
                                <a-col :span="12">
                                    <a>
                                        <a-avatar size="small" icon="user"/>
                                        <span class="member">科学搬砖组</span>
                                    </a>
                                </a-col>
                            </a-row>
                        </div>
                    </a-card>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: 'home',
        computed: {
            ...mapState({
                user: state => state.user
            }),
            avatar() {
                return `static/avatar/${this.user.avatar}`
            },
        },
        data() {
            return {
                welcomeMessage: ''
            }
        },
        methods: {
            welcome() {
                const date = new Date();
                const hour = date.getHours();
                let time = hour < 6 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour <= 18 ? '下午好' : '晚上好')))
                let welcomeArr = [
                    '喝杯咖啡休息下吧☕',
                    '要不要和朋友打局LOL',
                    '要不要和朋友打局王者荣耀',
                    '几天没见又更好看了呢😍',
                    '今天又写了几个Bug🐞呢',
                    '今天在群里吹水了吗',
                    '今天吃了什么好吃的呢',
                    '今天您微笑了吗😊',
                    '今天帮助别人解决问题了吗',
                    '准备吃些什么呢',
                    '周末要不要去看电影？'
                ];
                let index = Math.floor((Math.random() * welcomeArr.length));
                return `${time}，${this.user.username}，${welcomeArr[index]}`
            }
        },
        mounted() {
            this.welcomeMessage = this.welcome();
        }
    }
</script>
<style scoped>
    .head-info {
        /*margin-bottom: .5rem;*/
    }

    .head-info-card {
        border-color: #f1f1f1;
    }

    .head-info-avatar {
        display: inline-block;
        float: left;
        margin-right: 1rem;
    }

    .head-info-avatar img {
        width: 5rem;
        border-radius: 2px;
    }
    .head-info-count {
        display: inline-block;
        float: left;
    }
    .head-info .head-info-card .head-info-count .head-info-welcome {
        font-size: 1.05rem;
        margin-bottom: .1rem;
    }

    .head-info .head-info-card .head-info-count .head-info-desc,
    .head-info .head-info-card .head-info-count .head-info-time{
        color: rgba(0, 0, 0, 0.45);
        font-size: .8rem;
        padding: .2rem 0;
    }

    .head-info p {
        margin-bottom: 0;
    }

    .more-info span {
        color: rgba(0, 0, 0, .45);
        display: inline-block;
        font-size: .95rem;
        margin-bottom: 0.5rem;
    }

    .more-info p {
        line-height: 32px;
        margin-left: 10px;
    }

    .more-info p a {
        font-weight: 600;
        font-size: 1rem;
    }

    .content {
        margin: 0;
    }

    .project-item {
        display: flex;
        margin-top: 15px;
        overflow: hidden;
        font-size: 12px;
        height: 20px;
        padding-left: 45px;
        line-height: 20px;
    }

    .project-item a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;
    }

    .project-item:hover {
        color: #1890ff;
    }

    .project-item .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
    }

    .content {
        background: unset;
    }

    .item-group {
        padding: 30px 30px;
    }

    .item-group p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 5px;
    }

    .members a {
        display: block;
        margin: 12px 0;
    }

    .members a .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        max-width: 100px;
        margin-left: 12px;
    }

    .members a:hover span {
        color: #1890ff;
    }

</style>
