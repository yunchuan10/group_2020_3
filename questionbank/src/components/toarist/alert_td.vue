<template>
    <transition name="confirm" >
        <div class="confirm_c tip_fix" v-show="app.toarist_confirm_td" >
            <div class="confirm_sections_td">
            	<div class="confirm_tit">温馨提示</div>
            	<div class="modal-body">
	                <p class="confirm_txt">答题时间已到，已帮您上传附件！</p>
	            </div>
                <div class="confirm_btnT">
                    <div @click="confirmSure" class="confirm_btn1"> <span></span> 我知道了</div>
                     
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        methods: {
            confirmSure() {
                this.$store.commit('set_toarist_confirm_td', {
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
  .confirm_sections_td {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 99999;
    transform: translate(-50%, -50%);
    width: 30%;
    background: #fff;
    border-radius: 5px;
	overflow:hidden;
    .confirm_txt {
      font-size: 16px;
      color: #333333;
      line-height: 44px;
      padding: 6px 5px;
    }
	.confirm_tit{
		background: #28303e;
		position: relative;
	    padding: 0 10px;
	    color: #fff;
	    border-bottom: 0;
	    font-size: 16px;
	    height: 40px;
	    line-height: 40px;;
	}
	.modal-body{
		padding: 20px 30px;
	}
    .confirm_btnT {
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
      }
      .confirm_btn1 {
      	
      	display: inline-block;
	    width: 100%;
	    height: 40px;
	    line-height: 40px;
	    text-align: center;
	    font-size: 16px;
	    border-radius: 5px;
	    border: 1px solid #e4e7e8;
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