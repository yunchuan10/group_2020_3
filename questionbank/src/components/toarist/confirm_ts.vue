<template>
    <transition name="confirm" >
        <div class="confirm_c tip_fix" v-show="app.toarist_confirm_ts" >
            <div class="confirm_sections">
            	<div class="confirm_tit">考试须知</div>
            	<div class="modal-body">
	                <p class="confirm_txt">1、考生在每科开考前10—20分钟进入考场，并按规定位置就座，不得随意变动；</p>
	                <p class="confirm_txt">2、考生进入考场只准带规定允许的文具，其他物品一律集中放在指定位置；</p>
	                <p class="confirm_txt">3、特别强调：考生不得带通讯工具（手机、小灵通等）入考场；</p>
	                <p class="confirm_txt">4、不准夹带、偷看、抄袭或有意让他人抄袭，不准接传答案或者交换答卷；不准交 头接耳、左顾右盼；</p>
	                <p class="confirm_txt">5、考生在考场内必须保持安静，提前交卷者，应马上离开考场，不得在考场附近逗 留、喧哗。</p>
	            </div>
                <div class="confirm_btnT">
                    <div @click="confirmSure" class="confirm_btn1 green"> <span></span> 我知道了</div>
                     
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
                this.$store.commit('set_toarist_confirm_ts', {
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
  .confirm_sections {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 99999;
    transform: translate(-50%, -50%);
    width: 50%;
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
		background: #36c;
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
      /*border-top: 1px solid #e5e5e5;*/
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
      .green{
      	color: #fff;
	    background: #08b766;
	    border-color: #08b766;
	    margin: 0 auto;
      }
      .confirm_btn1 {
      	
      	display: inline-block;
	    width: 120px;
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