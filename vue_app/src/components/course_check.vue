<template>
    <div class="course_check_c bc_base2">
        <slot name="btn_left"></slot>
        <slot name="btn_right"></slot>
    </div>
</template>

<script>
    export default {
        props: ['check_num', 'check_i']   // 数目总数， 当前数目
    }
</script>

<style  lang="less">
    /*底部按钮*/
			.course_check_c {
		        height: .98rem;
		        position: fixed;
		        z-index: 99;
		        width: 100%;
		        left: 0;
		        bottom: 0;
				.display(flex);
				justify-content: space-between;
				line-height: .98rem;
				box-sizing: border-box;
				padding:0 0.3rem;
				border-top:0.01rem solid #bbb;
				span{
					display: inline-block;
				}
				p.btn_left{color: #DDDDDD;}
				span.btn_pre{
					background: url(../common/imgs/pre.png) no-repeat center;
					background-size: contain;
					margin-right: 0.2rem;
					display: inline-block;
					width:0.1rem ;
					height:0.18rem;
				}
				span.btn_pre_unChecked{
					background: url(../common/imgs/pre_unChecked.png) no-repeat center;
					background-size: contain;
					color: #ddd;
					margin-right: 0.2rem;
					display: inline-block;
					width:0.1rem ;
					height:0.18rem;
				}
				span.btn_next{
					background: url(../common/imgs/next.png) no-repeat center;
					background-size: contain;
					margin-left: 0.2rem;
					display: inline-block;
					width:0.1rem ;
					height:0.18rem;
				}
				span.btn_next_unChecked{
					background: url(../common/imgs/next_unChecked.png) no-repeat center;
					background-size: contain;
					margin-left: 0.2rem;
					display: inline-block;
					width:0.1rem ;
					height:0.18rem;
				}
	    }
	    /* 底部左右按钮  */
</style>