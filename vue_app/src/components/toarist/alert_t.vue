<template>
    <transition name="alert">
        <div class="alert_c" v-show=" toarist_alert ">
            <div class="alert_section" >
                <p class="alert_txt" v-text="msg"></p>
            </div>
        </div>
    </transition>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        props: ["msg", 'suc'],
        data (){
            return {
                alert_timer: null
            }
        },
        computed: {
            ...mapState(['app']),
            toarist_alert (){
                if( this.app.toarist_alert ){
                    clearTimeout( this.alert_timer );
                    this.alert_timer = setTimeout ( () => {
                        this.my_set_alert({
                            status: false,
                            cb: ( this.suc || null )
                        })
                    }, 2000 );
                }
                return this.app.toarist_alert;
            }
        }

    };
</script>

<style  lang="less">
    .alert_c {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 500;
        left: 0;
        top: 0;
        .alert_section{
            text-align: center;
            position: absolute;
            left: 50%;
            top: 50%;
            z-index: 501;
            transform: translate(-50%, -50%);
            width: 50%;
            box-sizing: border-box;
            background: rgba(0,0,0,0.7);
            border-radius: 5px;
            transition: all 1s ease-in-out;

            .alert_txt{
                color: #fff;
                font-size: 0.32rem;
                line-height: .4rem;
                padding: .4rem;
            }
        }



    }

    // 动画
    .alert-enter, .alert-leave-to{
        opacity: 0;
    }
    .alert-enter-active, .alert-leave-active{
        transition: opacity .2s ease-in-out;
    }





</style>