<template>
    <div class="header_c bc_base1">
    	<div class="header_padding">
	        <!-- 返回键 -->
	        <slot name="left_back"></slot>
	        <p v-if="!!header_title" v-text="header_title"></p>
	        <slot name="right_box"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['header_title']
    }
</script>

<style  lang="less">
    .header_c {
    	background: #fff!important;
        height: .4rem;
        width: 100%;
        position: fixed;
        z-index: 999;
        width: 100%;
        left: 0;
        top: 0;
        padding: 0.25rem 0;
        .header_padding{
        	padding: 0 0.38rem;
        	.display(flex);
	        justify-content: space-between;
	        line-height: .6rem;
	        p{
	        	font-size: 0.4rem;
	        	color: #000;
	        	line-height: 0.5rem;
	        	min-width: 30%;
	        	text-align: center;
	        }
	        .header_back{
	        	.header_back_span{
	        		display: block;
	        		width: 0.24rem;
		    		height:0.44rem ;
		    		background: url(../common/imgs/goBacks.png) no-repeat center;
	    			background-size: 100% auto;
	        	}
	    		width: 30%;
	    		height:0.44rem ;
    		}
    		.header_back_cancel{
    			margin-top: .04rem;
	        	.header_back_answercard{
	        		display: block;
	        		width: 0.46rem;
		    		height:0.46rem ;
		    		background: url(../common/imgs/closes.png) no-repeat center;
	    			background-size: 100% auto;
	        	}
	        	.header_back_answercard_close{
	        		display: block;
	        		width: 0.24rem;
		    		height:0.44rem ;
		    		background: url(../common/imgs/closes.png) no-repeat center;
	    			background-size: 100% auto;
	        	}
	    		width: 30%;
	    		height:0.44rem ;
    		}
		    .header_right{
		    	margin-right: -0.08rem;
		    	min-width: 30%;
		    	.display(flex);
		    	justify-content: flex-end;
		    	.header_timer_box{
		    		.display(flex);
		    		justify-content:space-around;
		    		flex-direction:column;
		    		width:0.6rem;
		    		.input_text{
		    			text-align: center;
			    		line-height: 0.3rem;
			    		color: #000!important;
			    		font-size: 0.18rem;
			    		background:transparent;
		    		    justify-content:  space-between
		    		}
		    	}
		    	.header_timer{
		    		display: block;
		    		width: auto;
		    		height: 0.22rem;
		    		background: url(../common/imgs/timer.png) no-repeat center;
		    		background-size:100% auto ;
		    		justify-content:  space-between
		    	}
		    	.header_answerd{
		    		width: 0.46rem;
		    		height: 0.46rem;
		    		background: url(../common/imgs/answer_cards_icon.png) no-repeat center;
		    		background-size: 100% auto;
		    		margin-left: 0.52rem;
		    	}
		    	.header_submit{
	    		    min-width: 0.46rem;
				    line-height: 0.5rem;
				    height: 0.46rem;
				    color: #FFF;
				    font-size: 0.24rem;
				    text-align: center;
				    margin-left: 0.54rem; 
				    padding: 0 0.16rem;
				    background: #2C8CFF;
				    border-radius: 0.02rem;
		    	}
		    	.new_exercise_collect{
                	width: .46rem;
                	height: 0.46rem;
                	display: inline-block;
                	background: url(../common/imgs/collection.png) no-repeat center;
                	background-size:100% auto ;
                	margin-left: 0.52rem;
                }
                .new_exercise_unCollect{
                	width: .46rem;
                	height: 0.46rem;
                	display: inline-block;
                	background: url(../common/imgs/collection_gray.png) no-repeat center;
                	background-size:100% auto ;
                	margin-left:0.52rem;
                }
                .new_exercise_del{
                	width: .46rem;
                	height: 0.46rem;
                	display: inline-block;
                	background: url(../common/imgs/del_icon.png) no-repeat center;
                	background-size:100% auto ;
                	margin-left: 0.52rem;
                }
		    }
		    .header_right_error{
		    	justify-content:flex-end
		    }
		    .header_rg{
		    		.display(flex);
		    	    justify-content: space-between;
			    	   .header_answerd{
			    		width: 0.54rem;
			    		height: 0.54rem;
			    		background: url(../common/imgs/answer_cards_icon.png) no-repeat center;
			    		background-size: 100% auto;
			    		display: block;
			    		margin-left: 0.16rem;
		    	    }
		    	    .header_timer_box{
		    	    	display: none;
		    	    }
		    	}
        }
    }
</style>