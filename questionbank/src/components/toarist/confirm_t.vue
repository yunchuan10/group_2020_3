<template>
    <transition name="confirm" >
        <div class="confirm_c tip_fix" v-show="app.toarist_confirm" >
            <div class="confirm_section">
                <p class="confirm_txt" v-text="msg"></p>
                <div class="confirm_btns">
                   <div @click="confirmDel" class="confirm_btn2">取消</div>
                    <div @click="confirmSure" class="confirm_btn1"> <span></span> 确定</div>
                     
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        props: ["msg"],
        methods: {
            confirmDel() {
                this.$store.commit('set_toarist_confirm', {
                    status: false
                })
                this.$emit('confirmCas')     // 确认按钮回调
            },

            confirmSure() {
                this.$store.commit('set_toarist_confirm', {
                    status: false
                })
                this.$emit('confirmSuc')     // 确认按钮回调
            }
        },
        computed: {
            ...mapState(['app']),
        }
    };
</script>

<style  lang="less">
.confirm_c {
  .confirm_section {
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 99999;
    transform: translate(-50%, -50%);
    width: 25%;
    background: #fff;
    border-radius: 5px;

    .confirm_txt {
      font-size: 16px;
      color: #333333;
      line-height: 44px;
      padding: 6px 5px;
    }

    .confirm_btns {
      border-top: 1px solid #e5e5e5;
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      text-align: center;
      color: #666666;
      cursor: pointer;
      /*.display(flex);*/

      div {
        width: 49%;
        height: 100%;
        position: relative;
        float: left;
      }
      .confirm_btn1 {color: #2C8CFF;;}
      .confirm_btn2 {
      	border-right: 1px solid #cccccc;
        color: #2C8CFF;
        span {
          position: absolute;
          z-index: 100;
          left: 0;
          top: 0;
          width: 1px;
          height: 100%;
          background: #e5e5e5;
        }
      }
    }
  }
}
// 动画
.confirm-enter, .confirm-leave-to{
    opacity: 0;
}
.confirm-enter-active, .confirm-leave-active{
    transition: opacity .2s ease-in-out;
}
</style>