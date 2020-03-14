<template>
    <div class="address-c">
        <!-- 头部 -->
        <v-header></v-header>

        <form class="address-list">

            <div class="address-item">
                <input v-model.trim="name" type="text" maxlength="20" placeholder="收货人">
                <img class="address-item-img" v-if="name" @click="name=''" src="../common/imgs/common/del.png" alt="icon" >
            </div>

            <div class="address-item">
                <input v-model.trim="phone" maxlength="11" type="text" placeholder="手机号">
                <img class="address-item-img" v-if="phone" @click="phone=''" src="../common/imgs/common/del.png" alt="icon" >
            </div>

            <div class="address-item" @click="isShowAddress=true">
                <input type="text" :class="{'input-able':addressBfore}" :value="addressBfore"  placeholder="所在地区" disabled="disabled">
                <img class="address-itemimg" src="../common/imgs/course/arrow-right.png" alt="icon">
            </div>

            <div class="address-item">
                <!--<input v-model.trim="detailDress" maxlength="50" type="text" placeholder="请填写详细街道、门牌号等">-->
                <textarea name=""  rows="" cols="100" v-model.trim="detailDress" maxlength="50" placeholder="请填写详细街道、门牌号等" ></textarea>
                <img class="address-item-img" @click="detailDress=''" v-if="detailDress" src="../common/imgs/common/del.png" alt="icon" >
            </div>

        </form>

        <div class="address-btn" @click="addressSub">保存</div>

        <div class="dress-fix" v-show="isShowAddress && area.length>0">
            <div class="dress-bg"></div>
            <div class="dress-secs">
                <div class="dress-sure">
                    <div @click="addressCancle">取消</div>
                    <div @click="addressSure">确定</div>
                </div>
                <mt-picker ref="pickCom" :slots="myAddressSlots" @change="onMyAddressChange"></mt-picker>
                <!-- <p>地址3级联动：{{myAddressProvince}} {{myAddressCity}} {{myAddresscounty}}</p> -->
            </div>
        </div>


    </div>
</template>
<script>
    import { Toast,Indicator } from "mint-ui";
    import { mapActions ,mapGetters} from 'vuex';
    import { getLocalSto } from "../common/js/utils.js"
    export default {
        data() {
            return {
                area: [],
                isShowAddress: false,
                myAddressSlots: [
                    {
                        flex: 1,
                        defaultIndex: 1,
                        values: [], //省份数组
                        className: "slot1",
                        textAlign: "center"
                    },
                    // {
                    //     divider: true,
                    //     content: "-",
                    //     className: "slot2"
                    // },
                    {
                        flex: 1,
                        values: [],
                        className: "slot3",
                        textAlign: "center"
                    },
                    // {
                    //     divider: true,
                    //     content: "-",
                    //     className: "slot4"
                    // },
                    {
                        flex: 1,
                        values: [],
                        className: "slot5",
                        textAlign: "center"
                    }
                ],
                myAddressProvince: "",
                myAddressCity: "",
                myAddresscounty: "",

                oldAddressProvince: "",
                oldAddressCity: "",
                oldAddresscounty: "",

                detailDress: '',
                name: '',
                phone: '',

                uid: '',
                id: '' ,        // 收货地址id
            };
        },
        created() {
            const uid = this.$route.query.uid||getLocalSto('uid')||'';
            this.uid = uid;
            const {address} = this.$store.state;
            if(address.id||address.tel){
                const {consignee,tel,province,city,district,id} = address;
                this.phone = tel||'';
                this.name = consignee||'';
                this.oldAddressProvince = province||'';
                this.oldAddressCity = city||'';
                this.oldAddresscounty = district||'';
                this.detailDress = address.address||'';
                this.id = id||'';
            }else{  // 没有去请求
                Indicator.open('加载中...');
                this.getAddress({uid, cb: (res)=>{
                    const {consignee,tel,province,city,district,id} = res;
                    this.phone = tel||'';
                    this.name = consignee||'';
                    this.oldAddressProvince = province||'';
                    this.oldAddressCity = city||'';
                    this.oldAddresscounty = district||'';
                    this.detailDress = res.address||'';
                    this.id = id||'';
                }});
            }
            if (this.$store.state.area.length > 0) {
                this.area = this.$store.state.area;
                this.myAddressSlots[0].values = this.area.map(item => item.name);
            } else {
                Indicator.open('加载中...');
                this.getArea(d => {
                    this.area = d;
                    this.myAddressSlots[0].values = d.map(item => item.name);
                });
            }
        },
        mounted() {
            this.$nextTick(() => {
                //vue里面全部加载好了再执行的函数
                this.myAddressSlots[0].defaultIndex = 0;
            });
        },

        computed: {
            addressBfore(){
                const {oldAddressProvince,oldAddressCity,oldAddresscounty} = this;
                if(oldAddressProvince){
                    return oldAddressProvince+'-'+oldAddressCity+'-'+oldAddresscounty;
                }else{
                    return ''
                }
            },
            subErr(){
                let {oldAddressProvince,oldAddressCity,oldAddresscounty,detailDress,name,phone} = this;
                name = (name+'').trim();
                phone = (phone+'').trim();
                detailDress = (detailDress+'').trim();
                if( !name ){
                    return '请填写收货人姓名'
                }else if( !phone ){
                    return '请填写手机号'
                }else if( !(/^1\d{10}$/).test(phone) ){
                    return '手机号格式不对，请重新输入'
                }else if( !oldAddressProvince ){
                    return '请选择所在地区'
                }else if( !detailDress ){
                    return '请输入详细地址'
                }
                return '';
            }
        },
        methods: {
            ...mapActions(["getArea","getAddress","addAddress"]),
            
            // 三级联动
            onMyAddressChange(picker, values) {
                if (this.area.length > 0) {
                    const _p = this.area.find(item => item.name == values[0]); // 当前省对应的对象
                    const _c = _p.children.find(item => item.name == values[1]) || _p.children[0]; // 当前省对应的对象

                    picker.setSlotValues(1, _p.children.map(item => item.name)); // Object.keys()会返回一个数组，当前省的数组
                    picker.setSlotValues(2, _c.children.map(item => item)); // 区/县数据就是一个数组
                    this.myAddressProvince = values[0];
                    this.myAddressCity = values[1];
                    this.myAddresscounty = values[2];
                }
            },

            // 取消
            addressCancle(){
                // const {oldAddressProvince,oldAddressCity} = this;
                // if(oldAddressProvince){
                //     const _p = this.area.find(item => item.name == oldAddressProvince); // 当前省对应的对象
                //     const _c = _p.children.find(item => item.name == oldAddressCity) || _p.children[0]; // 当前省对应的对象
                //     const picker = this.$refs.pickCom;
                //     picker.setSlotValues(1, _p.children.map(item => item.name)); // Object.keys()会返回一个数组，当前省的数组
                //     picker.setSlotValues(2, _c.children.map(item => item)); // 区/县数据就是一个数组
                // }
                this.isShowAddress = false;
            },

            // 确定
            addressSure(){
                let { myAddressProvince,myAddressCity,myAddresscounty } = this;
                this.oldAddressProvince = myAddressProvince;
                this.oldAddressCity = myAddressCity;
                this.oldAddresscounty = myAddresscounty;
                this.isShowAddress = false;
            },

            // 保存
            addressSub(){
                const {oldAddressProvince,oldAddressCity,oldAddresscounty,detailDress,name,phone} = this;
                if(!this.uid){
                    Toast({
                        message: '请返回登录再编辑收货地址！',
                        duration: 2000
                    });
                    return;
                }
                if( this.subErr ){
                    Toast({
                        message: this.subErr,
                        duration: 2000
                    });
                    return;
                }

                let data = {
                    "uid": this.uid,
                    "id": this.id,
                    "consignee": this.name,
                    "tel": this.phone,
                    "provinces": this.addressBfore,
                    "address": this.detailDress
                }
                Indicator.open('保存中...');
                this.addAddress({data, cb: ()=>{
                	this.$router.back(-1);
                }});
            }


        }
    };
</script>
<style lang="less">
    .address-c{

        .address-list{
        	
            padding-top: .2rem;
            padding-bottom: 15%;
            .address-item{
            	overflow: hidden;
                padding: 0 .4rem;
                display: flex;
                justify-content: space-between;
                background: #fff;
                height: 1.2rem;
                align-items: center;
                font-size: .26rem;
                color: #111;
         /*       margin-bottom: 1px;*/
                border-bottom: .01rem solid #ddd;
                .address-itemimg{
                    width: .12rem;
                    margin-left: .2rem
                }
                .address-item-img{
                	width: .26rem;
                	height: .26rem;
                	margin-left: .1rem;
                }
                input{
                    flex: 1;
                    height: 100%;
                    text-align: left;
                    color: #494949;
                    background: #fff;
                   	background: transparent;
                    margin-left: 0px;
                    font-size: .28rem;
                }
                textarea{
                	font-size: .28rem;
                    color: #494949;
                    line-height: 1.4;
                    border: none;
                    margin-top: .32rem;
                }
                
                input:disabled{
				    color: #999;
				    opacity: 1;
				    -webkit-opacity: 1;
				    -webkit-text-fill-color: #999;
				}
				input::-webkit-input-placeholder { /* WebKit, Blink, Edge */
				    color: #999;
				}
				.input-able:disabled{
				    color: #444;
				    opacity: 1;
				    -webkit-opacity: 1;
				    -webkit-text-fill-color: #444;
				}
            }
        }

        .address-btn{
            /*position: relative;
            top: 60%;
            left: 5%;*/
            margin-left: 5%;
            width: 90%;
            z-index: 2;
            height: .9rem;
            line-height: .9rem;
            text-align: center;
            background: @base1;
            font-size: .36rem;
            color: #fff;
            border-radius: .08rem;
            background: #2C8CFF;
        }


        .dress-fix{
            position: fixed;
            width: 100%;
            height: 100%;
            z-index: 300;
            left: 0;
            bottom: 0;
            .dress-bg{
                background: rgba(0,0,0,.3);
                width: 100%;
                height: 100%;
            }
            .dress-secs{
                position: absolute;
                z-index: 2;
                left: 0;
                bottom: 0;
                width: 100%;
                background: #fff;
                padding-top: 36px;
                .dress-sure{
                    width: 100%;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 28px;
                    position: absolute;
                    z-index: 2;
                    left: 0;
                    top: 0;
                    align-items: center;
                    color: #494949;
                    font-size: .30rem;
                    height: .9rem;
                    line-height: .9rem;
                    border-bottom:1px solid #ddd;
                    background:#fff;
                    div{
                        padding: 0 5px;
                    }
                    div:last-child{
                    	color: #2C8CFF;
                    }
                }
                .picker-slot{
                    font-size: 16px;
                }
            }
        }



    }

</style>