<template>
  <div class="page-miner">
    <div class="topliquidity-content">
      <video muted loop class="linebg" autoplay playsinline>
        <source src="/videos/line-bg.mp4" type="video/webm">
        <source src="/videos/line-bg.mp4" type="video/mp4">
      </video>
      <div class="container">
        <div class="qui-box">
          <div class="qui-item">
            <auto-search size="small" @select="onSelectCoinbase"></auto-search>
            <h3 class="pair-h3">{{ $t('PageHome.text3') }}</h3>
            <div class="pair-content">
              <div class="unitem" 
                v-for="(item, index) in pairLists" :key="index"
                :class="{active: selectPairIndex === index}" 
                @click="onChangePairIndex(index)">
                <img :src="require(`~/static/images/${item}.png`)" alt="">
                <span>{{ item }}</span>
              </div>
            </div>
            <!-- 输入代币 -->
            <div class="write-amount">
              <el-input-number 
                v-model="amountNumber" controls-position="right" 
                :min="0" :step="0.1">
              </el-input-number>
              <div class="amount-unit">
                <img src="~/static/images/BNB.png" alt="" class="unitico">
              </div>
            </div>
            <div class="inbtn-box">
              <el-button type="primary" 
                :disabled="!amountNumber || !selectInfo || !addr2Token"
                @click="onSetStarMiner">{{ $t('PageMiner.startMiner') }}</el-button>
            </div>
            <div class="inpintext">
              <p>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 订单 -->
    <div class="orderinfo-box" v-if="myMinerLists.length">
      <div class="swiper-orderinfo" v-swiper:mySwiper="SwiperOptions">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in myMinerLists" :key="index">
            <div class="orderinfo-item ominer-item">
              <div class="o-top">
                <strong>{{ $t('PageMiner.text1') }}</strong>
                <div class="ot-logo">
                  <img src="~/static/images/TRDT-logo.png" alt="">
                </div>
              </div>
              <div class="o-info">
                <h6>{{ $t('PageHome.text15') }}</h6>
                <div class="o-addr" v-if="selectInfo">
                  <span>{{ selectInfo.addr.substr(0, 10) }}...{{ selectInfo.addr.substr(-10) }}</span>
                  <img src="~/static/images/copyico.png" alt="" class="copybtn"
                    @click="onCopyText(selectInfo.addr)">
                </div>
                <h5>-</h5>
                <div class="o-amount">
                  <p>
                    {{ $t('PageMiner.text2') }}： <b>{{ item[0] }}</b> BNB
                  </p>
                  <p>
                    {{ $t('PageMiner.text3') }}： {{ item[1] }} {{ $t('PageHome.text17') }}
                  </p>
                  <p>
                    {{ $t('PageMiner.text4') }}： {{ item[2] }}
                  </p>
                  <p>
                    {{ $t('PageMiner.text5') }}： {{ item[3] }} {{  selectInfo ? selectInfo.name : '' }}
                  </p>
                  <p>
                    {{ $t('PageMiner.text6') }}： {{ item[4] }} {{  selectInfo ? selectInfo.name : '' }}
                  </p>
                </div>
                <div class="cp-btnbox">
                  <el-button class="themebtn"
                    @click="onIncome">{{ $t('income') }}</el-button>
                  <el-button class="themebtn"
                    @click="onResupply">{{ $t('resupply') }}</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
    <div class="miner-rules">
      <div class="container">
        <div class="details-box">
          <!-- <h2>{{ $t('PageLiquidity.text4') }}</h2> -->
          <p>
            {{ $t('PageMiner.text7') }}<br>
            {{ $t('PageMiner.text8') }}：
          </p>
          <p>
            1、{{ $t('PageMiner.text9') }}<br>
            2、{{ $t('PageMiner.text10') }}<br>
            3、{{ $t('PageMiner.text11') }}<br>
            4、{{ $t('PageMiner.text12') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BNB_ADDRESS, USDT_ADDRESS } from '@/contract/ABI';
export default {
  name: 'MinerPage',
  data () {
    return {
      selectInfo: null,
      amountNumber: 0.1,
      commonAddrs: {
        'BNB': BNB_ADDRESS,
        'USDT': USDT_ADDRESS
      },
      pairLists: ['BNB', 'USDT'],
      selectPairIndex: -1,
      defaultAddress: '',
      timer: null,
      SwiperOptions: {
        slidesPerView: 3,
        spaceBetween: 30,
        slidesPerGroup: 1,
        loop: false,
        loopFillGroupWithBlank: false,
        autoplay: false,
        breakpoints: {
          1000: {
            slidesPerView: 3,
            spaceBetween: 30,
            slidesPerGroup: 1,
          },
          750: {
            slidesPerView: 1,
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
      myMinerLists: []
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
    this.defaultAddress = this.$route.query.addr1;
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    async onResupply () {
      const { methods } = await this.$store.dispatch('contract/event', 'Miner');
      methods.Resupply(this.selectInfo.addr).send((err, txHash) => {
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    async onIncome () {
      const { methods } = await this.$store.dispatch('contract/event', 'Miner');
      methods.sendMiner(this.selectInfo.addr).send((err, txHash) => {
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    onCopyText (text) {
      this.$copyText(text).then((e) => {
        console.log(e)
        this.$message.success(this.$t('copySuccess'))
      }, () => {
        this.$message.success(this.$t('copyFail'))
      })
    },
    async queryMinerOrder () {
      const { methods } = await this.$store.dispatch('contract/event', 'Miner');
      methods.getMiner(this.selectInfo.addr).call((err, res) => {
        if (!err && res[0]) {
          console.log(res)
          this.myMinerLists = res[0].map((text, index) => {
            return {
              0: (text/Math.pow(10,18)).toFixed(8),
              1: res[1][index],
              2: res[2][index] == 0 ? '0' : new Date(Number(res[2][index]+'000')).toLocaleString(),
              3: null,
              4: null,
            }
          })
        }
        methods.getMiner1s(this.selectInfo.addr).call((err, res) => {
          if (!err) {
            for (let i = 0; i < this.myMinerLists.length; i ++) {
              this.myMinerLists[i][3] = (res[i][0]/Math.pow(10, 18)).toFixed(4);
              this.myMinerLists[i][4] = (res[i][1]/Math.pow(10, 18)).toFixed(4);
            }
          }
        })
      })
    },
    async onSetStarMiner () {
      const { methods } = await this.$store.dispatch('contract/event', 'Miner');
      const payAmount = web3.utils.toWei(String(this.amountNumber), 'ether');
      methods.setBNB(this.selectInfo.addr, this.addr2Token).send({
        value: payAmount
      }, (err, txHash) => {
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    onChangePairIndex (index) {
      this.selectPairIndex = index;
    },
    onSelectCoinbase (item) {
      this.selectInfo = item;
      this.queryMinerOrder()
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.queryMinerOrder()
      }, 10*1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-miner {
  min-height: 600px;
}
.linebg {
  top: 0;
  left: 0;
  width: 100%;
  height: 600px;
  z-index: 0;
  position: absolute;
  object-fit: cover;
}
.topliquidity-content {
  position: relative;
  .qui-box {
    position: relative;
    z-index: 10;
    padding: 40px 20px;
    @include flexBox;
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
        cursor: pointer;
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
    .qui-item {
      width: 398px;
      height: 480px;
      padding: 30px 28px;
      box-sizing: border-box;
      background: linear-gradient(180deg,hsla(0,0%,100%,.4),hsla(0,0%,100%,.1) 87.46%);
      box-shadow: 0 20px 80px rgba(0,0,0,.05);
      border-radius: 24px;
      border: 1px solid hsla(0,0%,100%,.5);
      border-bottom: 1px solid hsla(0,0%,100%,.2);
      margin: 0 30px;
    }
    .tabs-list {
      padding: 0 2px;
      @include flexBox(space-between, center);
      .tabs-item {
        width: 102px;
        height: 40px;
        margin-top: 20px;
        background: #fff;
        border-radius: 10px;
        font-size: 16px;
        cursor: pointer;
        @include flexBox;
        flex-wrap: wrap;
        &.active {
          color: #fff;
          background-color: #0b48e6;
        }
      }
    }
    .write-amount {
      width: 100%;
      height: 80px;
      background: #fff;
      border-radius: 24px;
      padding: 12px 32px;
      padding-left: 20px;
      box-sizing: border-box;
      margin-top: 20px;
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
  }
  .inbtn-box {
    margin-top: 30px;
    @include flexBox(space-between, center);
    .el-button {
      flex: 1;
      height: 50px;
      border-radius: 15px;
      border: 0px;
      background-color: #0b48e6;
      color: #fff;
      font-size: 18px;
      position: relative;
      top: 0;
      &:active {
        top: 2px;
        background-color: #073eca;
      }
    }
  }
  .inpintext {
    padding: 20px 0;
    font-size: 14px;
    text-align: center;
    color: #333;
    b {
      color: red;
    }
  }
}
.cp-btnbox {
  .themebtn {
    padding: 8px 16px;
    font-size: 14px;
    min-width: 100px;
  }
}
.miner-rules {
  background: #F2F5FA;
  padding: 60px;
  h2 {
    font-size: 40px;
    text-align: center;
  }
  .details-box {
    padding: 40px 10% 60px;
    background-color: #fff;
    border-radius: 20px;
    h2 {
      padding-bottom: 20px;
    }
    p {
      font-size: 16px;
      border-bottom: 1px dotted #ccc;
      padding: 10px 0;
      line-height: 1.8em;
      color: #333;
      b {
        color: #00a2f2;
      }
    }
  }
}
.orderinfo-box .orderinfo-item {
  height: 370px;
}
.ominer-item {
  .o-top {
    .ot-logo {
      width: 20px !important;
      height: 20px !important;
      padding: 4px !important;
    }
    strong {
      font-size: 14px !important;
    }
  }
  .o-amount {
    p {
      font-size: 14px !important;
      line-height: 24px !important;
    }
  }
  .o-info h5 {
    font-size: 14px !important;
    margin-top: 10px !important;
  }
}
.s-fee {
  text-align: center;
  font-size: 14px;
  color: #333;
  margin-top: 20px;
}
@media screen and (max-width: 750px) {
  .topliquidity-content {
    background: #c0c2e9;
  }
  .qui-box {
    padding: 20px 0 !important;
    flex-direction: column;
    .qui-item {
      max-width: 100% !important;
      margin: 20px 0 0 !important;
      padding: 20px !important;
      height: auto !important;
    }
  }
  .miner-rules {
    padding: 50px 0 60px;
    h2 {
      font-size: 26px;
    }
    .details-box {
      padding: 30px 20px;
      margin-top: 20px;
      p {
        font-size: 16px;
      }
    }
  }
  .topliquidity-content .qui-box .tabs-list .tabs-item {
    width: 32%;
  }
}
</style>