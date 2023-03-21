<template>
  <div class="page-index">
    <!-- 背景 -->
    <video muted loop class="video-bg" autoplay playsinline>
      <source src="/videos/IMG_6322228.MP4" type="video/mp4" />
    </video>
    <!-- 顶部 -->
    <div class="container">
      <!-- 标题 -->
      <div class="page-title">
        <h1>{{ $t('PageHome.text1') }}</h1>
        <h2><span v-html="$t('PageHome.text2')"></span></h2>
      </div>
      <!-- 操作池 -->
      <div class="operation-pool">
        <auto-search @select="onSelectCoinbase" @clear="onClearSelectInfo"></auto-search>
        <h3 class="pair-h3">{{ $t('PageHome.text3') }}</h3>
        <div class="pair-content">
          <div class="unitem" 
            v-for="(item, index) in pairLists" :key="index"
            :class="{active: selectPairIndex === index}" >
            <img :src="require(`~/static/images/${item}.png`)" alt="">
            <span>{{ item }}</span>
          </div>
        </div>
        <div class="no-pair">
          <span v-if="selectInfo && selectPairIndex<0">{{ $t('noPair') }}</span>
        </div>
        <!-- 输入BNB -->
        <div class="write-amount">
          <el-input-number 
            v-model="amountNumber" controls-position="right" 
            :min="0.0000001" :step="0.1">
          </el-input-number>
          <div class="amount-unit">
            <img src="~/static/images/BNB.png" alt="" class="unitico">
            <span>{{ $t('PageHome.text26') }}</span>
          </div>
        </div>
        <div class="max-short">
          <p>
            {{ $t('PageHome.text4') }}:
            <b>{{ maxAmountShort }}</b>
            <i v-if="queryMaxLoading" class="el-icon-loading"></i>
            BNB</p>
        </div>
        <div class="shortbtn-cell">
          <el-button 
            :disabled="!addr2Token||!selectInfo||selectInfo.pairs=='No pair'"
            @click="onOpenShort">
            {{ $t('PageHome.text5') }}
          </el-button>
          <el-button class="btncolor2" @click="toLiquidity"
            :disabled="!selectInfo">
            {{ $t('PageHome.text6') }}
          </el-button>
        </div>
      </div>
      <!-- 奖池 -->
      <div class="jackpot-box">
        <div class="jack-item">
          <div class="j-radius"></div>
          <div class="j-title">
            <h6>{{ $t('PageHome.text7') }}</h6>
          </div>
          <div class="j-amount">
            <p>
              <img src="~/static/images/BNB.png" alt="" class="j-unit">
              <b>{{ shortsInfos[1] || '0.00000000' }}</b>
            </p>
          </div>
          <div class="j-title">
            <h6>{{ $t('PageHome.text5') }}</h6>
          </div>
          <div class="j-amount">
            <p>
              <img src="~/static/images/BNB.png" alt="" class="j-unit">
              <b>{{ shortsInfos[0] || '0.00000000' }}</b>
            </p>
          </div>
          <img src="~/static/images/v1.png" alt="" class="j-ico">
        </div>
        <div class="jack-item">
          <div class="j-radius"></div>
          <div class="j-title">
            <h6>{{ $t('PageHome.text6') }}</h6>
          </div>
          <div class="j-amount">
            <!-- <p class="small">
              <img src="~/static/images/defaultico.png" alt="" class="j-unit" style="top:-2px;">
              <b>{{ shortsInfos[2] || '0.0000' }}</b>
            </p>
            <p>
              ≈
              <img src="~/static/images/BNB.png" alt="" class="j-unit">
              <b>{{ shortsInfos[3] || '0.00000000' }}</b>
            </p> -->
            <p class="size-text">
              {{ $t('PageHome.text8') }}：
              <img src="~/static/images/defaultico.png" alt="" class="j-unit">
              <b>{{ shortsInfos[2] || '0.0000' }}</b>
            </p>
            <p class="size-text">
              {{ $t('PageHome.text9') }}：
              <img src="~/static/images/defaultico.png" alt="" class="j-unit">
              <b>{{ shortsInfos[3] || '0.0000' }}</b>
            </p>
            <p class="size-text">
              {{ $t('PageHome.text10') }}：
              <b>{{ (((shortsInfos[3]/shortsInfos[2])*100)||0).toFixed(2) }}%</b>
            </p>
          </div>
          <img src="~/static/images/v2.png" alt="" class="j-ico">
        </div>
        <div class="jack-item">
          <div class="j-radius"></div>
          <div class="j-title">
            <h6>{{ $t('PageHome.text25') }}</h6>
          </div>
          <div class="j-amount">
            <p class="size-text">
              {{ $t('PageHome.text11') }}：
              <img src="~/static/images/defaultico.png" alt="" class="j-unit">
              <b>{{ miningUserInfos[0] || '-' }}</b>
            </p>
            <p class="size-text">
              {{ $t('PageHome.text12') }}：
              <b>{{ miningUserInfos[1] || '-' }}</b>
            </p>
            <p class="size-text">
              {{ $t('PageHome.text13') }}：
              <img src="~/static/images/defaultico.png" alt="" class="j-unit">
              <b>{{ miningUserInfos[3] || '-' }}</b>
            </p>
            <div class="j-btn">
              <el-button class="themebtn" 
                :disabled="!miningUserInfos[0]||miningUserInfos[0]==0"
                @click="onRedeemCoinbase">{{ $t('PageHome.text14') }}</el-button>
            </div>
          </div>
          <img src="~/static/images/v3.png" alt="" class="j-ico">
        </div>
      </div>
    </div>
    <!-- 订单 -->
    <div class="orderinfo-box" v-if="myOrderLists.length">
      <div class="swiper-orderinfo" v-swiper:mySwiper="SwiperOptions">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in myOrderLists" :key="index">
            <div class="orderinfo-item">
              <div class="o-top">
                <strong>SellToken</strong>
                <div class="ot-logo">
                  <img src="~/static/images/TRDT-logo.png" alt="">
                </div>
              </div>
              <div class="o-info">
                <h6>{{ $t('PageHome.text15') }}</h6>
                <div class="o-addr">
                  <span>{{ item[0].substr(0, 10) }}...{{ item[0].substr(-10) }}</span>
                  <img src="~/static/images/copyico.png" alt="" class="copybtn"
                    @click="onCopyText(item[0])">
                </div>
                <h5>${{ item[3] }}</h5>
                <div class="o-amount">
                  <p>
                    <img src="~/static/images/defaultico.png" alt="">
                    {{ item[2] }}
                  </p>
                  <p>
                    <img src="~/static/images/BNB.png" alt="">
                    {{ item[1] }}
                  </p>
                </div>
                <div class="cp-btnbox">
                  <el-button class="themebtn"
                    @click="onClosePostion(item[0])">{{ $t('PageHome.text7') }}</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
    <!-- IDO -->
    <div class="ido-content">
      <h2>SeIIToKen IDO</h2>
      <div class="container">
        <div class="disc-box">
          <div class="timecount-statistic">
            <!-- <el-statistic :value="deadline3" time-indices
              format="DD [day] HH [hour] mm [minute] ss [second]" :value-style="valueStyle">
              <span slot="prefix">Distance End</span>
            </el-statistic> -->
            <span>{{ $t('PageHome.text16') }}</span>
            <b>00</b>
            <span>{{ $t('PageHome.text17') }}</span>
            <b>00</b>
            <span>{{ $t('PageHome.text18') }}</span>
            <b>00</b>
            <span>{{ $t('PageHome.text19') }}</span>
            <b>00</b>
            <span>{{ $t('PageHome.text20') }}</span>
          </div>
          <div class="sline">
            <div class="slineitem"></div>
          </div>
          <div class="disc-join">
            <el-input-number :controls="false" placeholder="BNB Value"></el-input-number>
            <el-button type="primary" disabled>{{ $t('PageHome.text21') }}</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- mind map -->
    <div class="mindmap-video">
      <video muted loop width="100%" style="margin:auto;" autoplay playsinline>
        <source :src="`/lang/videos/${$i18n.locale}.mp4`" type="video/mp4">
      </video>
      <img :src="`/lang/images/${$i18n.locale}.png`" alt="" class="flow-img">
    </div>
    <!-- dife link -->
    <div class="dife-linkbox">
      <div class="container">
        <div class="dife-info">
          <h3 v-html="$t('PageHome.text22')"></h3>
          <p>{{ $t('PageHome.text23') }}</p>
        </div>
      </div>
      <div class="link-logo">
        <ul class="link-line-item">
          <li
            v-for="(item, index) in aLinkItem1" :key="index">
            <img :src="item.icon" alt="">
            <span>{{ item.name }}</span>
          </li>
        </ul>
        <ul class="link-line-item linitem2">
          <li
            v-for="(item, index) in aLinkItem2" :key="index">
            <img :src="item.icon" alt="">
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { BNB_ADDRESS, USDT_ADDRESS } from '@/contract/ABI';
export default {
  name: 'IndexPage',
  data () {
    return {
      aLinkItem1: [
        {
          icon: require('~/static/images/Arbitrum.svg'),
          name: 'Arbitrum'
        },
        {
          icon: require('~/static/images/Avalanche.svg'),
          name: 'Avalanche'
        },
        {
          icon: require('~/static/images/Binance.svg'),
          name: 'Binance'
        },
        {
          icon: require('~/static/images/Ethereum.svg'),
          name: 'Ethereum'
        },
        {
          icon: require('~/static/images/Solana.svg'),
          name: 'Solana'
        },
        {
          icon: require('~/static/images/Fandom.svg'),
          name: 'Fantom'
        }
      ],
      aLinkItem2: [
        {
          icon: require('~/static/images/Moonbeam.svg'),
          name: 'Moonbeam'
        },
        {
          icon: require('~/static/images/Near.svg'),
          name: 'Near'
        },
        {
          icon: require('~/static/images/Nervos.svg'),
          name: 'Nervos'
        },
        {
          icon: require('~/static/images/Optimism.svg'),
          name: 'Optimism'
        },
        {
          icon: require('~/static/images/Polygon.svg'),
          name: 'Polygon'
        },
        {
          icon: require('~/static/images/Harmony.svg'),
          name: 'Harmony'
        },
        {
          icon: require('~/static/images/Iotex.svg'),
          name: 'IoTeX'
        }
      ],
      pairLists: ['BNB', 'USDT'],
      deadline3: Date.now() + 1000 * 1000 * 60 * 30,
      SwiperOptions: {
        slidesPerView: 3,
        spaceBetween: 30,
        slidesPerGroup: 1,
        loop: false,
        loopFillGroupWithBlank: false,
        autoplay: false,
        breakpoints: {
          750: {
            slidesPerView: 3,
            spaceBetween: 30,
            slidesPerGroup: 1,
          },
          300: {
            slidesPerView: 1,
            spaceBetween: 10,
            slidesPerGroup: 1,
          }
        },
        navigation: {
          nextEl: '.orderinfo-box .swiper-button-next',
          prevEl: '.orderinfo-box .swiper-button-prev',
        }
      },
      selectValue: '',
      selectInfo: null,
      selectPairIndex: -1,
      amountNumber: 0.1,
      shortsInfos: {},
      miningUserInfos: {},
      commonAddrs: {
        'BNB': BNB_ADDRESS,
        'USDT': USDT_ADDRESS
      },
      maxAmountShort: '0.00000000',
      myOrderLists: [],
      queryMaxLoading: false,
      timers: {0:null, 1:null}, // 定时器
    }
  },
  computed: {
    addr2Token () {
      return this.commonAddrs[this.pairLists[this.selectPairIndex]];
    },
    coinbaseIcos () {
      return this.$store.state.coinbaseIcos;
    },
    walletAddress () {
      return this.$store.state.wallet.walletAddress;
    },
  },
  created () {
    this.queryMyOrderSell()
  },
  destroyed () {
    for (let k in this.timers) {
      clearTimeout(this.timers[k])
      clearInterval(this.timers[k])
    }
  },
  mounted () {
  },
  methods: {
    onCopyText (text) {
      this.$copyText(text).then((e) => {
        console.log(e)
        this.$message.success(this.$t('copySuccess'))
      }, () => {
        this.$message.success(this.$t('copyFail'))
      })
    },
    onClearSelectInfo () {
      this.selectInfo = null;
      this.selectPairIndex = -1;
      this.maxAmountShort = '0.00000000';
    },
    onSelectCoinbase (item) {
      this.selectInfo = item;
      this.selectValue = item.addr;
      this.selectPairIndex = this.pairLists.indexOf(item.pairs)
      this.queryShorts()
      this.queryMiningUser()
      this.queryMaxShorts()
      clearInterval(this.timers[1])
      this.timers[1] = setInterval(() => {
        this.queryMaxShorts()
      }, 10 * 1000)
    },
    async onClosePostion (addr) {
      const { methods } = await this.$store.dispatch('contract/event');
      methods.withdraw(addr).send((err, txHash) => {
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    async queryMyOrderSell () {
      const { methods } = await this.$store.dispatch('contract/event');
      methods.getMyPriceSell(this.walletAddress).call((err, res) => {
        if (!err) {
          this.myOrderLists = res[0].map((item, index) => {
            return {
              0: item,
              1: (res[1][index]/Math.pow(10,18)).toFixed(8),
              2: (res[2][index]/Math.pow(10,18)).toFixed(4),
              3: (res[3][index]/Math.pow(10,18)).toFixed(8),
            }
          })
          // 查询
          this.timers[0] = setTimeout(this.queryMyOrderSell, 10 * 1000);
        }
      })
    },
    async onOpenShort () {
      let confirmMaxShort = true;
      // 校验金额是否超过max
      if (this.amountNumber > this.maxAmountShort) {
        try {
          confirmMaxShort = await this.$confirm(
            this.$t('PageHome.text4') + ' ' + this.maxAmountShort + ' BNB', 
            this.$t('PageHome.text27'), 
          {
            confirmButtonText: this.$t('PageHome.text28'),
            cancelButtonText: this.$t('PageHome.text29'),
            type: 'warning'
          })
        } catch (error) {
          confirmMaxShort = false;
          console.log('取消操作', error)
          return false;
        }
      }
      if (!confirmMaxShort) return false;
      // 执行操作
      const { methods } = await this.$store.dispatch('contract/event');
      const amount = web3.utils.toWei(String(this.amountNumber), 'ether');
      methods.ShortStart(this.selectValue, this.walletAddress, 1).send({
        value: amount
      },(err, txHash) => {
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    toLiquidity () {
      const addr1 = this.selectValue;
      const addr2 = this.addr2Token;
      this.$router.push({
        path: this.localePath('/liquidity'),
        query: {
          addr1, addr2
        }
      })
    },
    // 赎回
    async onRedeemCoinbase () {
      const { methods } = await this.$store.dispatch('contract/event', 2);
      methods.minerWithdraw(this.selectValue).send((err, txHash) => {
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    async queryMiningUser () {
      const { methods } = await this.$store.dispatch('contract/event', 2);
      methods.getUser(this.walletAddress, this.selectValue).call((err, res) => {
        if (!err) {
          this.miningUserInfos = {
            0: (res[0]/Math.pow(10,18)).toFixed(4),
            1: res[1] == 0 ? '0' : new Date(Number(res[1]+'000')).toLocaleString(),
            2: (res[2]/Math.pow(10,18)).toFixed(4),
            3: (res[3]/Math.pow(10,18)).toFixed(4),
          }
        }
      })
    },
    async queryShorts () {
      const { methods } = await this.$store.dispatch('contract/event');
      methods.getShorts(this.selectValue).call((err, res) => {
        if (!err) {
          console.log(res)
          this.shortsInfos = {
            0: (res[0]/Math.pow(10,18)).toFixed(8),
            1: (res[1]/Math.pow(10,18)).toFixed(8),
            2: (res[2]/Math.pow(10,18)).toFixed(4),
            3: (res[3]/Math.pow(10,18)).toFixed(4),
          }
        }
      })
    },
    async queryMaxShorts () {
      const { methods } = await this.$store.dispatch('contract/event');
      // 查询最大做空
      console.log(this.addr2Token , this.selectValue)
      if (this.addr2Token && this.selectValue) {
        this.queryMaxLoading = true
        methods.getShortsMoV(this.selectValue, this.addr2Token).call((err, res) => {
          this.queryMaxLoading = false
          if (!err) {
            this.maxAmountShort = (res/Math.pow(10, 18)).toFixed(8);
            console.log('最大做空:', this.maxAmountShort)
          } else {
            this.maxAmountShort = '0.00000000';
          }
        })
      }
    },
    onChangePairIndex (index) {
      this.selectPairIndex = index;
    }
  }
}
</script>

<style lang="scss" scoped>
.page-index {
  position: relative;
  background: #F2F5FA;
  .video-bg {
    position: absolute;
    top: -80px;
    left: 0;
    width: 100%;
    height: 830px;
    z-index: 0;
    object-fit: cover;
  }
}
.page-title {
  padding: 100px 0;
  min-height: 400px;
  h1 {
    font-size: 40px;
    line-height: 1.2;
  }
  h2 {
    margin-top: 20px;
  }
  span {
    background: linear-gradient(270.06deg, #FF820E 10%, #7926FF 52.51%, #356DF3 91.97%),
			#1F2226;
    font-size: 30px;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-box-decoration-break: clone;
  }
}
.operation-pool {
  width: 395px;
  height: 468px;
  padding: 30px 28px;
  position: absolute;
  top: 70px;
  right: 20px;
  box-sizing: border-box;
  background: linear-gradient(180deg,hsla(0,0%,100%,.4),hsla(0,0%,100%,.1) 87.46%);
  box-shadow: 0 20px 80px rgba(0,0,0,.05);
  border-radius: 24px;
  border: 1px solid hsla(0,0%,100%,.5);
  border-bottom: 1px solid hsla(0,0%,100%,.2);
  display: flex;
  flex-direction: column;
  .pair-h3 {
    margin-top: 20px;
    text-align: center;
  }
  .no-pair {
    font-size: 12px;
    color: red;
    height: 20px;
    width: 100%;
    @include flexBox;
  }
  .pair-content {
    background-color: #fff;
    border-radius: 20px;
    overflow: hidden;
    // margin-bottom: 20px;
    margin-top: 10px;
    position: relative;
    @include flexBox;
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 1px;
      height: 20px;
      background: #eee;
      margin-top: -10px;
    }
    .unitem {
      cursor: no-drop;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      height: 40px;
      margin: 10px 16px;
      img {
        width: 24px;
        height: 24px;
        object-fit: contain;
        margin-right: 10px;
      }
      span {
        font-size: 16px;
        color: #666;
      }
      &.active {
        border-radius: 10px;
        background: linear-gradient(90deg,#56ffee 25.14%,#82ffca 67.46%,#a7ff62 116.99%,#fcff63 167.07%);
        span {
          font-weight: bold;
          color: #000;
        }
      }
    }
  }
  .write-amount {
    width: 336px;
    height: 80px;
    background: #fff;
    border-radius: 24px;
    padding: 12px 32px;
    padding-left: 20px;
    box-sizing: border-box;
    margin-bottom: 20px;
    @include flexBox(space-between, center);
    .amount-unit {
      padding-left: 10px;
      @include flexBox;
      .unitico {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        position: relative;
        top: -1px;
      }
      span {
        font-style: normal;
        font-size: 14.4px;
        line-height: 20px;
        color: #13151a;
        min-width: 44px;
        text-align: center;
      }
    }
  }
  .max-short {
    text-align: center;
    p {
      font-size: 14px;
      color: #333;
    }
  }
  .shortbtn-cell {
    margin-top: 20px;
    @include flexBox(space-between);
    .el-button {
      width: 156px;
      height: 64px;
      float: left;
      font-family: Bold;
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      line-height: 22px;
      color: #13151a;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      background: linear-gradient(90deg,#56ffee 25.14%,#82ffca 67.46%,#a7ff62 116.99%,#fcff63 167.07%);
      border-radius: 100px;
      transition: box-shadow .35s ease,background .35s ease;
      border: 0 !important;
      position: relative;
      &:active {
        border: 0;
        top: 2px;
      }
      &.is-disabled {
        color: #000 !important;
        background: #999 !important;
        top: 0;
      }
      &.btncolor2 {
        background: linear-gradient(90deg,#7d2dff 25.14%,#ac6ce6 67.46%,#df2dff 116.99%,#fcff63 167.07%);
      }
    }
  }
}
.jackpot-box {
  padding: 20px 0 60px;
  position: relative;
  @include flexBox(space-between);
  .jack-item {
    position: relative;
    padding: 24px 40px 40px;
    border-radius: 48px;
    min-height: 260px;
    background: #fff;
    display: flex;
    flex-direction: column;
    width: 30%;
    box-sizing: border-box;
    transition: all 0.3s;
    &:hover {
      box-shadow: 0px 5px 25px rgba(31, 34, 38, 0.1), 
        0px 10px 50px rgba(31, 34, 38, 0.1);
    }
    .j-radius {
      width: 48px;
      height: 48px;
      background: #F2F5FA;
      border-radius: 50%;
      margin-left: auto;
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 0;
    }
    .j-title {
      height: 58px;
      position: relative;
      z-index: 2;
      h6 {
        font-size: 20px;
        line-height: 58px;
        color: #1f2226;
      }
    }
    .j-amount {
      position: relative;
      z-index: 2;
      height: 40px;
      p {
        font-size: 16px;
        padding: 2px 0;
        color: #666;
        @include flexBox(flex-start, center);
      }
      .size-text {
        font-size: 14px;
        margin-top: 6px;
      }
      .small {
        font-size: 14px;
      }
    }
    .j-unit {
      width: 20px;
      height: 20px;
      margin-right: 6px;
      position: relative;
    }
    .j-ico {
      width: 120px;
      height: 120px;
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 0;
      opacity: 0.5;
    }
    .j-btn {
      margin-top: 16px;
    }
  }
}
.orderinfo-box {
  padding: 90px 30px;
  height: 550px;
  box-sizing: border-box;
  position: relative;
  background: linear-gradient(180deg, rgba(242, 245, 250, 0) 0%, #F2F5FA 100%), linear-gradient(-270deg, #F4E7DE 0%, #E3DCFA 50%, #D0DCF9 100%, #DBE5F9 100%);
  .swiper-orderinfo {
    position: relative;
  }
  .swiper-button-prev, 
  .swiper-button-next {
    top: auto;
    bottom: 50px;
    background-size: 13px 22px;
    right: 50%;
    margin-right: -60px;
  }
  .swiper-button-prev {
    left: 50%;
    margin-left: -60px;
  }
  .orderinfo-item {
    position: relative;
    z-index: 99;
    text-align: center;
    font-size: 18px;
    background: #fff;
    border: 1px solid #d8d8d8;
    transition-duration: 200ms;
    transition-property: box-shadow;
    transition-timing-function: linear;
    border-radius: 22px;
    height: 358px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 20px;
    .o-top {
      @include flexBox(space-between);
      strong {
        color: #1f2226;
        font-size: 18px;
      }
      .ot-logo {
        width: 32px;
        height: 32px;
        padding: 10px;
        border-radius: 50%;
        background: #F2F5FA;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
    }
    .o-info {
      width: 100%;
      border: 1px solid #00a2f2;
      background-color: #F2F5FA;
      border-radius: 30px;
      padding: 10px;
      margin: 10px auto 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      position: relative;
      text-align: left;
      h6 {
        color: red;
      }
      .o-addr {
        margin-top: 6px;
        @include flexBox(flex-start);
        span {
          font-size: 16px;
          color: #2E343C;
        }
        .copybtn {
          position: relative;
          width: 30px;
          height: 20px;
          vertical-align: middle;
          object-fit: contain;
          cursor: pointer;
        }
      }
      h5 {
        color: #00a2f2;
        font-size: 26px;
        margin-top: 16px;
      }
      .o-amount {
        p {
          font-size: 18px;
          line-height: 30px;
          color: #2E343C;
          @include flexBox(flex-start);
          img {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }
        }
      }
      .cp-btnbox {
        width: 100%;
        padding: 20px 0 10px;
        @include flexBox;
      }
    }
  }
}
.ido-content {
  padding: 30px 0 100px;
  position: relative;
  h2 {
    font-size: 52px;
    text-align: center;
    font-weight: 600;
    line-height: 58px;
    padding-bottom: 48px;
  }
  .timecount-statistic {
    padding: 30px;
    @include flexBox;
    span {
      font-size: 32px;
    }
    b {
      margin: 0px 10px;
      border: 1px solid #ccc;
      padding: 3px;
      font-size: 33px;
      background: linear-gradient(270.06deg, #FF820E 7.8%, #7926FF 52.51%, #356DF3 91.97%), #1F2226;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      -webkit-box-decoration-break: clone;
    }
  }
  .sline {
    height: 4px;
    width: 100%;
    background: #E1E9FD;
    position: relative;
    .slineitem {
      animation-duration: 6000ms;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      animation-name: speedline;
      background-color: #356DF3;
      animation-fill-mode: both;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }
    @keyframes speedline {
      0% {width:0%;}
      100% {width:100%;}
    }
  }
  .disc-box {
    position: relative;
    border-radius: 48px;
    background-color: #fff;
    .disc-join {
      @include flexBox;
      flex-direction: column;
      padding: 80px 100px;
      .el-button {
        padding: 0 80px;
        height: 48px;
        font-size: 16px;
        min-width: 320px;
        line-height: 24px;
        box-sizing: border-box;
        border-radius: 15px;
        margin-top: 80px;
      }
    }
  }
}
.mindmap-video {
  position: relative;
  display: flex;
  flex-direction: column;
  .video-item {
    width: 100%;
    height: 574px;
  }
  .flow-img {
    width: 100%;
    margin-top: 10px;
  }
}
.dife-linkbox {
  position: relative;
  background: #fff;
  .dife-info {
    padding: 96px 0 50px;
    text-align: center;
    h3 {
      font-size: 55px;
      line-height: 52px;
      margin-bottom: 32px;
      span {
        color: #0b48e6;
        margin-right: 5px;
      }
    }
    p {
      color: #2E343C;
      font-size: 24px;
      line-height: 36px;
      padding: 0 30px;
    }
  }
  .link-logo {
    overflow: hidden;
    width: 100%;
    .link-line-item {
      margin: 5px 0;
      display: flex;
      padding: 0;
      transform: translate3d(0px, 0px, 0px);
      list-style: none;
      transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1) 0s, opacity 0.8s cubic-bezier(0.77, 0, 0.175, 1) 0s;
      animation: 35s linear 0s infinite alternate none running speedgroup1;
      &.linitem2 {
        animation: 35s linear 0s infinite alternate none running speedgroup2;
        
      }
      @keyframes speedgroup1 {
        0% { transform: translateX(-50%) translateZ(0px); } 
        100% { transform: translateX(0) translateZ(0px); } 
      }
      @keyframes speedgroup2 {
        0% { transform: translateX(0) translateZ(0px); } 
        100% { transform: translateX(-50%) translateZ(0px); } 
      }
      li {
        position: relative;
        border-radius: 21px;
        background-color: #fff;
        transition-duration: 200ms;
        transition-property: box-shadow;
        transition-timing-function: linear;
        color: #1f2226;
        height: 100px;
        min-width: 240px;
        box-sizing: border-box;
        @include flexBox(flex-start);
        &:hover {
          z-index: 1;
          box-shadow: 0 0 10px rgba(31, 34, 38, 0.1), 0 5px 10px rgba(31, 34, 38, 0.15);
        }
        img {
          width: 88px;
          height: 40px;
          object-fit: contain;
        }
        span {
          color: #1f2226;
          font-size: 18px;
          font-family: "Inter-Bold", sans-serif;
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .operation-pool {
    position: relative;
    top: auto;
    left: auto;
    right: auto;
    padding: 10px;
    max-width: 100%;
    .write-amount {
      width: 100%;
    }
  }
  .page-title {
    min-height: auto;
    padding: 100px 0;
    h1 {
      font-size: 30px;
    }
    span {
      font-size: 25px;
    }
  }
  .jackpot-box {
    flex-direction: column;
    .jack-item {
      width: 100%;
      margin-top: 30px;
    }
  }
  .ido-content {
    padding: 0;
    h2 {
      font-size: 26px;
      padding-bottom: 20px;
    }
    .timecount-statistic {
      span {
        font-size: 0;
        &::after {
          content: '：';
          font-size: 14px;
        }
        &:first-child, 
        &:last-child {
          display: none;
        }
      }
      b {
        font-size: 20px;
        margin: 0 6px;
      }
    }
  }
  .disc-join {
    padding: 30px 20px !important;
    .el-button {
      min-width: 100px !important;
      max-width: 100% !important;
      margin-top: 30px !important;
      padding: 0;
    }
  }
  .dife-linkbox .dife-info h3 {
    font-size: 24px;
  }
  .dife-linkbox .dife-info p {
    font-size: 14px;
    padding: 0;
  }
}
</style>