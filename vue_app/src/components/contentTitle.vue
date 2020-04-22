<template>
    <div class="practice_h c_padding" v-show="showTitle">
        <slot name ="practice_top_left"></slot>
        <slot name ="practice_top_right"></slot>
	</div>
</template>
<script>
    export default{
        props: {
            showTitle:{
                type: Boolean,
                default: true
            },
        },
        data(){
            return{
                
            }
        }
    }
</script>
<style lang="less">
    .practice_h {
		height: .82rem;
		background: #fff;
		font-size: 14px;
		color: #333333;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		box-sizing: border-box;
		border-bottom: .01rem solid #ddd;
		border-top: .01rem solid #DDDDDD;
		.display(flex);
		justify-content: space-between;
		line-height: .82rem;
		.practice_top_left{
			font-size: 0.28rem;
			line-height: .83rem;
			
		}
		.practice_top_right{
			font-size: 0.28rem;
			line-height: .83rem;
			.current_num{
				color: #2C8CFF;
			}
			.con_top_right{
				color: #999;
			}
			
		}
	}

</style>
