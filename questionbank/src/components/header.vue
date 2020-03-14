<template>
    <div class="header_c ">
    	<div class="w1200">
	        <a>
	        	<img src="../common/img/logo.png" />
	        </a>
	        <span>{{ this.header_title}}</span>
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
    	background: #FFFFFF;
    	width: 100%;
    	color: #333;
	    height: 80px;
	    position: fixed;
	    top: 0;
	    z-index: 9;
    	a{
    		width:128px;
    		height:100%;
    		padding-top:13px;
    		display: inline-block;
    		img{
    			display: block;
    			max-width: 100%;
    			border: 0;
    			vertical-align: middle;
    		}
    	}
    	span{
    		border-left: 1px solid rgba(225, 225, 225, 0.5);
		    font-size: 20px;
		    height: 24px;
		    line-height: 24px;
		    margin: 26px 0 0 10px;
		    padding-left: 20px;
    	}
    }
</style>