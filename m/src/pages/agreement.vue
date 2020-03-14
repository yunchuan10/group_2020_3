
<template>
	<div class='agree-c'>
        <!-- 头部 -->
        <v-header ></v-header>

        <div class='scroll-box'>
            <div class="div-item">
                <div class="privacy-box">

                    <h2>用户协议</h2>

                    <div class="privacy-t">本服务协议双方为本网站与本网站用户，本服务协议具有合同效力。 您确认本服务协议后，本服务协议即在您和本网站之间产生法律效力。请您务必在注册之前认真阅读全部服务协议内容，如有任何疑问，可向本网站咨询。 只要您按照本网站注册程序成功注册为用户，您的行为就表示您同意并签署了本服务协议:</div>
                    <div class="privacy-section">
                        <p class="privacy-l">一、用户负责保管东方尚学的账号及密码，并对以其用户帐号进行的所有活动和事件负法律责任。</p>
                        <p class="privacy-l">二、用户承诺不得以任何方式利用东方尚学直接或间接从事违反中国法律、以及社会公德的行为，东方尚学有权对违反上述承诺的内容予以删除。</p>
                        <p class="privacy-l">三、用户不得利用东方尚学服务制作、上载、复制、发布、传播或者转载如下内容：/p>
                        <p class="privacy-l">(1) 反对宪法所确定的基本原则的；</p>
                        <p class="privacy-l">(2) 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p>
                        <p class="privacy-l">(3) 损害国家荣誉和利益的；</p>
                        <p class="privacy-l">(4) 煽动民族仇恨、民族歧视，破坏民族团结的；</p>
                        <p class="privacy-l">(5) 破坏国家宗教政策，宣扬邪教和封建迷信的；</p>
                        <p class="privacy-l">(6) 散布谣言，扰乱社会秩序，破坏社会稳定的；</p>
                        <p class="privacy-l">(7) 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</p>
                        <p class="privacy-l">(8) 侮辱或者诽谤他人，侵害他人合法权益的；</p>
                        <p class="privacy-l">(9) 含有法律、行政法规禁止的其他内容的信息。</p>

                        <p class="privacy-l">四、用户不得做出破坏东方尚学运营安全或服务质量的行为和内容：</p>
                        <p class="privacy-l">(1) 群发广告；</p>
                        <p class="privacy-l">(2) 使用程序操作；</p>
                        <p class="privacy-l">(3) 发布垃圾内容，包括但不限于：评论、私信、教室名称、详细介绍；</p>
                        <p class="privacy-l">(4) 恶意发布重复内容；</p>
                        <p class="privacy-l">(5) 使用马甲等作弊手段操作内容和排序。</p>



                        <p class="privacy-l">五、东方尚学有权对用户使用东方尚学的情况进行审查和监督。如用户在使用东方尚学时违反任何上述规定，东方尚学有权要求用户改正或直接采取一切必要的措施（包括但不限于更改或删除用户张贴的内容、暂停或终止用户使用东方尚学的权利）以减轻用户不当行为造成的影响。</p>

                        <p class="privacy-l">六、本网站如因系统维护或升级而需暂停服务时，将事先公告。若因线路及非本网站控制范围外的硬件故障或其它不可抗力而导致暂停服务，于暂停服务期间造成的一切不便与损失，本网站不负任何责任。</p>

                        <p class="privacy-l">七、由于线上产品都是在线播放形式，所以该类型产品一经售出不予以退款。</p>
                        <p class="privacy-l">八、本网站使用者因为违反本声明的规定而触犯中华人民共和国法律的，一切后果自己负责，本网站不承担任何责任。</p>
                        <p class="privacy-l">九、本声明未涉及的问题参见国家有关法律法规，当本声明与国家法律法规冲突时，以国家法律法规为准。</p>
                        <p class="privacy-l">十、本网站之声明以及其修改权、更新权及最终解释权均属本网站所有。</p>

                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    import { Indicator } from 'mint-ui';
	export default {
		data(){
			return{

			}
		},
        created() {

            // Indicator.open('加载中...');

        },
	}
</script>
<style lang="less">
    .agree-c{

        position: relative;
        z-index: 2;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        .scroll-box{
            height: 100%;
            background:rgba(249,249,249,1);
            font-size:.27rem;
            line-height:.37rem;
            overflow-y: auto;
        }

        .div-item{
            padding: .52rem .3rem;
        }
        .text-item{padding: .20rem 0;display: block;}

        .privacy-box{line-height: 1.4;max-width: 1000px;margin: 0 auto;font-size: 14px;color: #333;}
        .privacy-box h2{text-align: center;font-size: 20px;padding-bottom: 10px;font-weight: bold;height: auto;}
        .privacy-l{padding-top: 10px;line-height: 1.4;}


    }


</style>