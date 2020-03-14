<template>
	<div class='my-campus'>
	  <!-- 头部 -->
      <v-header :header_title='header_title'></v-header>
	  <div class='campus-content'>
	    <!-- 上海普陀校区       bindtap='myCampusDetails'data-distance="{{ distance_putuo }}"                -->
	    <div class='campus-content-wrap' @click='myCampusDetails'>
	        <div class='campus-box-image'>
	          <img class='campus-image' src="../common/imgs/myCampus/banner.png" />
	        </div>
	        <div class='campus-box-content'>
	          <p class='campus-box-title'>上海普陀校区</p>
	          <div class='campus-box-right'>
	            <img class='campus-box-i' src="../common/imgs/myCampus/distance_icon.png" />
	            <!--<p class='campus-box-km'>{{distance_putuo}}Km</p>-->
	          </div>
	        </div>
	    </div>
	
	    <!-- 上海黄埔校区   bindtap='myCampusDetails'data-distance="{{ distance_huangpu }}"     -->
	    <div class='campus-content-wrap' @click='myCampusDetails'>
	        <div class='campus-box-image'>
	          <img class='campus-image' src="../common/imgs/myCampus/banner.png" />
	        </div>
	        <div class='campus-box-content'>
	          <p class='campus-box-title'>上海黄埔校区</p>
	          <div class='campus-box-right'>
	            <img class='campus-box-i' src="../common/imgs/myCampus/distance_icon.png" />
	            <!--<p class='campus-box-km'>{{ distance_huangpu }}Km</p>-->
	          </div>
	        </div>
	    </div>
	
	    <!-- 上海浦东教学点           bindtap='myCampusDetails'data-distance="{{ distance_pudong_teaching }}"      -->
	    <div class='campus-content-wrap' @click='myCampusDetails'>
	        <div class='campus-box-image'>
	          <img class='campus-image' src="../common/imgs/myCampus/banner.png" />
	        </div>
	        <div class='campus-box-content'>
	          <p class='campus-box-title'>上海浦东教学点</p>
	          <div class='campus-box-right'>
	            <img class='campus-box-i' src="../common/imgs/myCampus/distance_icon.png" />
	            <!--<p class='campus-box-km'>{{ distance_pudong_teaching }}Km</p>-->
	          </div>
	        </div>
	    </div>
	
	
	    <!-- 上海徐汇校区教学点 bindtap='myCampusDetails'  data-distance="{{ distance_xuhui_teaching }}"-->
	    <div class='campus-content-wrap' @click='myCampusDetails'>
	        <div class='campus-box-image'>
	          <img class='campus-image' src="../common/imgs/myCampus/banner.png" />
	        </div>
	        <div class='campus-box-content'>
	          <p class='campus-box-title'>上海徐汇校区教学点</p>
	          <div class='campus-box-right'>
	            <img class='campus-box-i' src="../common/imgs/myCampus/distance_icon.png" />
	            <!--<p class='campus-box-km'>{{ distance_xuhui_teaching }}Km</p>-->
	          </div>
	        </div>
	    </div>
	
	    <!-- 上海黄浦区教学点 bindtap='myCampusDetails'   data-distance="{{ distance_huangpu_teaching }}"-->
	    <div class='campus-content-wrap' @click='myCampusDetails'>
	        <div class='campus-box-image'>
	          <img class='campus-image' src="../common/imgs/myCampus/banner.png" />
	        </div>
	        <div class='campus-box-content'>
	          <p class='campus-box-title'>上海黄浦区教学点</p>
	          <div class='campus-box-right'>
	            <img class='campus-box-i' src="../common/imgs/myCampus/distance_icon.png" />
	            <!--<p class='campus-box-km'>{{ distance_huangpu_teaching }}Km</p>-->
	          </div>
	        </div>
	    </div>
	
	    <!-- 北京朝阳校区  bindtap='myCampusDetails'  data-distance="{{ distance_chaoyang }}" -->
	    <div class='campus-content-wrap' @click='myCampusDetails'> 
	        <div class='campus-box-image'>
	          <img class='campus-image' src="../common/imgs/myCampus/banner.png" />
	        </div>
	        <div class='campus-box-content'>
	          <p class='campus-box-title'>北京朝阳校区</p>
	          <div class='campus-box-right'>
	            <img class='campus-box-i' src="../common/imgs/myCampus/distance_icon.png" />
	            <!--<p class='campus-box-km'>{{ distance_chaoyang }}Km</p>-->
	          </div>
	        </div>
	    </div>
	
	
	    <!-- 上海合肥校区  bindtap='myCampusDetails'data-distance="{{ distance_hefei }}"-->
	    <div class='campus-content-wrap' @click='myCampusDetails'>
	        <div class='campus-box-image'>
	          <img class='campus-image' src="../common/imgs/myCampus/banner.png" />
	        </div>
	        <div class='campus-box-content'>
	          <p class='campus-box-title'>上海合肥校区</p>
	          <div class='campus-box-right'>
	            <img class='campus-box-i' src="../common/imgs/myCampus/distance_icon.png" />
	            <!--<text class='campus-box-km'>{{ distance_hefei }}Km</text>-->
	          </div>
	        </div>
	    </div>
	
	  </div>
	</div>
</template>
<script>
	import { Indicator} from 'mint-ui';
	export default {
		data(){
			return{
				header_title:'我的校区',
			  //上海普陀校区 1
		      distance_putuo:'',
		      lat_puotuo: 31.23037, 
		      long_puotuo: 121.4737, 
		      //上海黄埔校区 2
		      distance_huangpu:'',
		      lat_huangpu: 31.222040,
		      long_huangpu: 121.473030,  
		      //北京朝阳校区 3
		      distance_chaoyang: '',
		      lat_chaoyang: 39.893715, 
		      long_chaoyang: 116.501907,
		      //上海合肥校区 4
		      distance_hefei: '',
		      lat_hefei: 31.802042,  
		      long_heifei: 117.241669,
		
		      //上海浦东校区教学点 5
		      distance_pudong_teaching: '',
		      lat_pudong_teaching: 31.229746,  
		      long_pudong_teaching: 121.517980,
		      //上海徐汇校区教学点 6
		      distance_xuhui_teaching: '',
		      lat_xuhui_teaching: 31.160200, 
		      long_xuhui_teaching: 121.413320,
		      //上海黄浦区教学点 7
		      distance_huangpu_teaching: '',
		      lat_huangpu_teaching: 31.238450, 
		      long_huangpu_teaching: 121.468630,
		   }
		},
		created(){
//			Indicator.open('加载中...');
			let that = this;
			//获取用户的经纬度
      		that.getLocation();
		},
		methods:{
			//获取两地之间的距离
			getLocation:function(){
				var that = this;
			},
			//点击获取相应的id传递给详情页
			myCampusDetails:function(){
				
			}
		}
	}
</script>
<style lang="less">
	.my-campus{
	  	display: block;
	  	padding-bottom: 0.4rem;
	  	.campus-content{
		  display: flex;
		  flex-direction: column;
		  padding: 0 .40rem;
		  margin-top: 1rem;
		  	.campus-content-wrap{
			  width:6.70rem;
			  height: 3.77rem;
			  border-radius:.13rem ;
			  overflow: hidden;
			  margin-top: .40rem;
			  background: #fff;
			  	.campus-box-image{
				  width: 100%;
				  height: 3.03rem;
					.campus-image{
					  width: 100%;
					  height: 3.03rem;
					}
				}
			}
			.campus-box-content{
			  display: flex;
			  justify-content: space-between;
			  	.campus-box-title{
				  color:#111111 ;
				  font-size: .27rem;
				  line-height:.75rem ;
				  font-weight:700;
				  margin-left: .27rem
				}
				.campus-box-right{
				  display: flex;
				  margin-right: .27rem;
				  	.campus-box-i{
					  width: .28rem;
					  height: .28rem;
					  margin-top: .24rem;
					  margin-right: .007rem;
					}
					.campus-box-km{
					  font-size:.20rem;
					  font-weight:400;
					  color:#555;
					  line-height:.75rem;
					}
				}
			}
		}
	}
</style>