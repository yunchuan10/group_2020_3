<template>
    <div class='audition-contain'>
        <!-- 头部 -->
        <v-header></v-header>

        <!-- 视频 -->
        <div class='video-c'>
            <div id="playercontainer" class="playercontainer"></div>
        </div>

        <!-- 课程列表 -->
        <div class='course-list'>

            <div class='list-head' :class="{slide:slide_type!=1}">
                <div class='list-hl'>
                    <img src='../common/imgs/course/course_chapter.png'/>
                    <span class='hl-title'>试听目录</span>
                    <span class='hl-count'>共{{list.length}}节</span>
                </div>
                <div class='list-hr' @click='slide_type=2' v-show="slide_type==1">
                    <span>收起</span>
                    <img src='../common/imgs/course/chapter_up.png'/>
                </div>
                <div class='list-hr' @click='slide_type=1' v-show="slide_type!=1">
                    <span>展开</span>
                    <img src='../common/imgs/course/chapter_open.png'/>
                </div>
            </div>

            <!-- 列表 -->
            <div class='list-c' :class="{'list-slide':slide_type!=1}">

                <div :class='{sec:index==currentIndex}' v-for="(item,index) in list" :key="index" @click="otherPlay(item)">
                    <div class='item-l' v-if="(index+1)<10">{{'0'+(index+1)}}</div>
                    <div class='item-l' v-else>{{index+1}}</div>
                    <div class='item-c'>
                        <span class='item-t'>{{item.content}}</span>
                    </div>
                    <div class='item-r'>
                        <img class='line-icon' src='../common/imgs/course/i9.png'/>
                        <span>试看中</span>
                        <img class='icon' src='../common/imgs/course/i10.png'/>
                    </div>
                </div>

            </div>

        </div>
    </div>

</template>

<script>
    // import "//g.alicdn.com/de/prismplayer/2.7.2/aliplayer-min.js";
    import { Toast,Indicator } from "mint-ui";
    import { mapActions ,mapGetters} from 'vuex';
    import { tryLesson } from "../api"
    export default {
        data() {
            return {
                id: '',
                list: [],
                currentIndex: -1,
                currentSrc: '',

                slide_type: 1,

                player: null

            };
        },

        created(){
            let { goods_id, id } = this.$route.query;
            this.id = id;
            this.goods_id = goods_id;
            console.log(goods_id, id);
            this.getList(goods_id);
        },
        methods: {
            // 请求数据
            getList: function (goods_id) {
                Indicator.open('加载中...');
                tryLesson(goods_id).then( (res)=>{

                    const list = res.result||[];
                    const currentOpt = list.find(item => (item.id == this.id))||{};
                    const currentIndex = list.findIndex(item => (item.id == this.id));
                    this.list = list;
                    this.currentOpt = currentOpt;
                    this.currentIndex = currentIndex;
                    const currentSrc = currentOpt.aliyun||'';

                    console.log(typeof Aliplayer);
                    this.initVideo(currentOpt);

                })

            },

            // 跳另个视频
            otherPlay(item){
                if(item.id == this.id){
                    return;
                }
                this.$router.replace('./audition?id=' + item.id + '&goods_id=' + this.$route.query.goods_id);
                setTimeout( ()=>{
                    this.$router.go(0);
                },10);
                // this.player && this.player.dispose();
                this.initVideo(item);
            },

            // 初始化播放器
            initVideo: function ( currentOpt={} ) {
                if(!currentOpt.aliyun){
                    Toast({
                        message: '此视频暂时无法播放',
                        duration: 2000
                    });
                }
                // var learning_time = def.data_list.watch.learningTime||0;
                let player_obj = {
                    width: '100%',
                    id: 'playercontainer',
                    autoplay: false,
                    isLive: false,
                    preload: false,
                    playsinline: true,
                    controlBarVisibility: 'always',
                    useH5Prism: true,
                    x5_video_position: 'top', //指定视频在上部显示
                    x5_type: 'h5', //声明启用同层H5播放器，支持的值：h5
                    source: currentOpt.aliyun||'',   //播放路径 暂时用真实路径替换
                    seek: 99,
                };

                this.player = new Aliplayer( player_obj, function (player) {});
                this.player.on('ready',(e) => {
                    this.player.play();
                    // if(learning_time){
                    //     player.seek(learning_time);
                    // }
                });

            },

            beforeDestroy() {
                this.player && this.player.dispose();
            }

        }
    };
</script>
<style lang="less">
@import "//g.alicdn.com/de/prismplayer/2.7.2/skins/default/aliplayer-min.css";
    .audition-contain{
        background: #fff;
        height: 100%;
        position: relative;
        // z-index: 2;
        padding-top: 4.20rem;
        box-sizing: border-box;
        .prism-setting-btn{
        	display: none;
        }
        .video-c{
            position: fixed;
            z-index: 6;
            top: 1rem;
            left: 0;
            width: 100%;
            height: 4.20rem;
            background-color: #EFEFF4;
            .playercontainer{
                width: 100%;
                height: 100% !important;
                position: relative;
            }
        }

        .video-c video{
            width: 100%;
            height: 100%;
        }

        .course-list{
            height: 100%;
            box-sizing: border-box;
            position: relative;
            // z-index: 2;
            padding: 1.00rem 0 0;
        }

        .list-head{
            height: 1.00rem;
            width: 100%;
            padding: 0 .40rem;
            box-sizing: border-box;
            position: absolute;
            // z-index: 8;
            left: 0;
            top: 0;
            border-bottom: .01rem solid #ddd;
            overflow: hidden;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .list-hl{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .list-hl img{
            width: .24rem;
            height: .20rem;
            margin-right: .20rem;
        }
        .hl-title{
            font-size: .32rem;
            color: #111;
        }

        .hl-count{
            font-size: .20rem;
            color: #999;
            margin-left: .12rem;
            margin-top: .10rem;
        }

        .list-hr{
            display: flex;
            height: 100%;
            justify-content: space-between;
            color: #999;
            font-size: .24rem;
            align-items: center;
            padding-left: .20rem;
        }

        .list-hr img{
            height: .20rem;
            width: .20rem;
            margin-left: .13rem;
        }


        .list-c{
            padding: 0 .40rem;
            height: 100%;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            transition: height .4s;
        }

        .list-c.list-slide{
            overflow-y: hidden;
            height: 0;
        }

        .list-c>div{
            display: flex;
            width: 100%;
            border-bottom: .01rem solid #d8d8d8;
            height: 1.60rem;
            justify-content: space-between;
            align-items: center;
        }

        .item-l{
            margin-right: .20rem;
            flex-shrink: 0;
            font-size: .32rem;
            color: #777;
            font-style:italic;
        }

        .item-c{
            flex: 1;
            margin-right: .50rem;
            overflow: hidden;
        }

        .item-c .item-t{
            display: block;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow:ellipsis;
            height: .40rem;
            line-height: .40rem;
            font-size: .32rem;
            color: #111;
        }

        .item-c .item-time{
            font-size: .24rem;
            color: #999;
            margin-top: .18rem;
        }

        .item-r{
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            font-size: .20rem;
            color: #2C8CFF;
            align-items: center;
        }

        .item-r .line-icon{
            width: .47rem;
            height: .47rem;
            display: none;
        }

        .item-r span{
            display: none;
        }

        .item-r .icon{
            width: .53rem;
            height: .53rem;
        }

        .sec .item-l{
            color: #2C8CFF;
        }

        .sec .item-c .item-t{
            color: #2C8CFF;
        }

        .sec .item-r .icon{
            display: none;
        }

        .sec .item-r .line-icon, .sec .item-r span{
            display: block;
        }



        // .dialog_box{display: none !important;}
        .prism-player .prism-cc-btn{display: none !important;}
        .prism-setting-list .prism-setting-quality{display: none !important;}
        .volume-icon{display: none !important;}


    }



</style>