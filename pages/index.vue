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
        <div class="slider-linebox">
          <el-slider v-model="sliderLineValue" :min="25" :step="25" show-stops :marks="sliderMarks"
            @change="onChangeSlider"></el-slider>
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
          <img src="~/static/images/v1.png" alt="" class="j-ico">
        </div>
        <div class="jack-item">
          <div class="j-radius"></div>
          <div class="j-title">
            <h6>{{ $t('PageHome.text5') }}</h6>
          </div>
          <div class="j-amount">
            <p>
              <img src="~/static/images/BNB.png" alt="" class="j-unit">
              <b>{{ shortsInfos[0] || '0.00000000' }}</b>
            </p>
          </div>
          <img src="~/static/images/v2.png" alt="" class="j-ico">
        </div>
        <div class="jack-item">
          <div class="j-radius"></div>
          <div class="j-title">
            <h6>{{ $t('PageHome.text6') }}</h6>
          </div>
          <div class="j-amount">
            <p class="size-text">
              {{ $t('PageHome.text8') }}：
              <img :src="coinbaseIcos[selectInfo?selectInfo.name:'']||require('~/static/images/defaultico.png')" alt="" class="j-unit">
              <b>{{ shortsInfos[2] || '0.0000' }}</b>
            </p>
            <p class="size-text">
              {{ $t('PageHome.text9') }}：
              <img :src="coinbaseIcos[selectInfo?selectInfo.name:'']||require('~/static/images/defaultico.png')" alt="" class="j-unit">
              <b>{{ shortsInfos[3] || '0.0000' }}</b>
            </p>
            <p class="size-text">
              {{ $t('PageHome.text10') }}：
              <b>{{ (((shortsInfos[3]/shortsInfos[2])*100)||0).toFixed(2) }}%</b>
            </p>
          </div>
          <img src="~/static/images/v3.png" alt="" class="j-ico">
        </div>
      </div>
    </div>
    <!-- 订单 -->
    <div class="orderinfo-box">
      <div class="swiper-orderinfo" v-swiper:mySwiper="SwiperOptions">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in myOrderLists" :key="index">
            <div class="orderinfo-item">
              <img src="~/static/images/vinitembg.png" alt="" class="vimg-bg">
              <div class="coin-colors"
                :style="{backgroundColor: item[2]-item[1]>=0 ? '#48c774' : 'red'}"></div>
              <div class="o-top">
                <div class="ot-logo">
                  <img :src="coinbaseIcos[item[3]]||require('~/static/images/defaultico.png')" alt="">
                </div>
                <strong>{{ $t('new01.text1') }}</strong>
                <div class="o-types">
                  <b>{{ $t('new01.text2') }}</b>
                  <span v-if="item[4] != 'No pair'">{{ item[4] }}/{{ item[3] }}</span>
                  <span v-else>{{ item[4] }}</span>
                </div>
              </div>
              <div class="o-info">
                <div class="o-addr">
                  <div class="o-tag">{{ $t('new01.text3') }}</div>
                  <span>{{ item[0].substr(0, 4) }}...{{ item[0].substr(-6) }}</span>
                  <img src="~/static/images/copyico.png" alt="" class="copybtn"
                    @click="onCopyText(item[0])">
                </div>
                <div class="oflex-cell">
                  <div class="o-price">
                    $
                    {{ item[5] }}
                  </div>
                  <div class="o-rate">
                    <span :style="{color: item[2]-item[1]>=0 ? '#48c774' : 'red'}"
                      v-if="item[2]!=0">
                      {{ item[2]-item[1]>=0 ? '+' : '' }}
                      {{ (item[2]/item[1]*100-100).toFixed(2) }}%
                    </span>
                    <span v-else>
                      0.00%
                    </span>
                  </div>
                </div>
                <div class="o-cellitem">
                  <span>{{ $t('new01.text4') }}</span>
                  <i class="oline"></i>
                  <strong>
                    <img src="~/static/images/BNB.png" class="sico" />
                    {{ item[1] }}
                  </strong>
                </div>
                <div class="o-cellitem">
                  <span>{{ $t('new01.text5') }}</span>
                  <i class="oline"></i>
                  <strong>
                    <img src="~/static/images/BNB.png" class="sico" />
                    {{ item[2] }}
                  </strong>
                </div>
                <div class="cp-btnbox">
                  <div class="inbtntext" :class="{disabled: item[0]==0}" @click="onClosePostion(item[0])">
                    <span>{{ $t('PageHome.text7') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
    <!-- mind map -->
    <div class="mindmap-video">
      <video muted loop width="100%" style="margin:auto;" autoplay playsinline>
        <source :src="`/lang/videos/${$i18n.locale}.mp4`" type="video/mp4">
      </video>
      <img :src="`/lang/images/${$i18n.locale}.png`" alt="" class="flow-img">
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
      sliderMarks: {
        0: '0%',
        25: '25%',
        50: '50%',
        75: '75%',
       100: '100%',
      },
      sliderLineValue: 0,
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
        slidesPerView: 5,
        spaceBetween: 30,
        slidesPerGroup: 1,
        loop: false,
        loopFillGroupWithBlank: false,
        autoplay: false,
        breakpoints: {
          1920: {
            slidesPerView: 4,
            spaceBetween: 30,
            slidesPerGroup: 1,
          },
          1440: {
            slidesPerView: 3,
            spaceBetween: 20,
            slidesPerGroup: 1,
          },
          1080: {
            slidesPerView: 2,
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
      myOrderLists: [
        {
          0: '0x0000000000000000000000000000000000000000',
          1: '0.00000000',
          2: '0.00000000',
          3: '',
          4: 'No pair'
        },
        {
          0: '0x0000000000000000000000000000000000000000',
          1: '0.00000000',
          2: '0.00000000',
          3: '',
          4: 'No pair'
        },
        {
          0: '0x0000000000000000000000000000000000000000',
          1: '0.00000000',
          2: '0.00000000',
          3: '',
          4: 'No pair'
        },
        {
          0: '0x0000000000000000000000000000000000000000',
          1: '0.00000000',
          2: '0.00000000',
          3: '',
          4: 'No pair'
        },
        {
          0: '0x0000000000000000000000000000000000000000',
          1: '0.00000000',
          2: '0.00000000',
          3: '',
          4: 'No pair'
        },
        {
          0: '0x0000000000000000000000000000000000000000',
          1: '0.00000000',
          2: '0.00000000',
          3: '',
          4: ''
        }
      ],
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
    onChangeSlider () {
      let num = Number(this.maxAmountShort)*this.sliderLineValue/100;
      if (num < 0.0000001) num = 0.1;
      this.amountNumber = num;
    },
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
      this.queryMaxShorts()
      clearInterval(this.timers[1])
      this.timers[1] = setInterval(() => {
        this.queryMaxShorts()
      }, 10 * 1000)
    },
    async queryCoinbasePrice (index, pairName) {
      const { methods } = await this.$store.dispatch('contract/event');
      let addr1 = this.myOrderLists[index][0];
      let addr2 = this.commonAddrs[pairName];
      console.log(addr1, addr2)
      methods.getToken3Price(addr1, addr2).call((err, res) => {
        if (!err) {
          this.$set(this.myOrderLists[index], 5, (res/Math.pow(10, 18)).toFixed(8))
        }
      })
    },
    async onClosePostion (addr) {
      const { methods } = await this.$store.dispatch('contract/event');
      if (addr == 0) return false;
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
          if (res[0].length) {
            this.myOrderLists = res[0].map((addr, index) => {
              methods.getToke(addr).call((err, res) => {
                if (!err) {
                  this.myOrderLists[index][3] = res[0];
                  this.myOrderLists[index][4] = res[1];
                  this.queryCoinbasePrice(index, res[1])
                }
              })
              return {
                0: addr,
                1: (res[1][index]/Math.pow(10,18)).toFixed(8),
                2: (res[2][index]/Math.pow(10,18)).toFixed(8),
                3: '',
                4: '',
                5: ''
              }
            })
          }
          // 查询
          this.timers[0] = setTimeout(this.queryMyOrderSell, 10 * 1000);
        }
      })
    },
    async onOpenShort () {
      // 校验金额是否超过max
      if (this.amountNumber > this.maxAmountShort) {
        this.$alert(
          this.$t('PageHome.text4') + ' ' + this.maxAmountShort + ' BNB', 
          this.$t('PageHome.text27'), 
          {
            confirmButtonText: this.$t('PageHome.text29'),
            type: 'warning'
        })
        return false;
      }
      // 校验钱包余额不足
      const walletAmount = await this.$store.dispatch('wallet/queryAmountBNB');
      if (walletAmount < this.amountNumber) {
        return this.$message.warning(this.$t('new02.text7'));
      }
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
@import '@/assets/pages/index.scss';
</style>
