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
            <auto-search size="small" @select="onSelectCoinbase" @clear="onClearSelectInfo"></auto-search>
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
            <div class="write-balance">
              <div class="wbleft">
                <img src="~/static/images/BNB.png" class="ico" />
                <span>{{ $t('new02.text5') }}： {{ amountBNB }}</span>
              </div>
              <el-button type="text" @click="onAllValue">{{ $t('new02.text6') }}</el-button>
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
    <div class="orderinfo-box">
      <!-- 历史数据 -->
      <div class="old-tabbox" v-if="cacheMiners.length">
        <h5>
          {{ $t('new02.text8') }}
          <!-- <p>当前查询：{{ nowSearchAddr }}</p> -->
        </h5>
        <div class="old-tablist">
          <el-button size="small" :loading="searchLoading"
            v-for="item in cacheMiners" :key="item.name"
            @click="onSearchMiner(item)">{{ item.name }}</el-button>
        </div>
      </div>
      <div class="swiper-orderinfo" v-swiper:mySwiper="SwiperOptions">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in myMinerLists" :key="index">
            <div class="orderinfo-item ominer-item">
              <img src="~/static/images/vinitembg.png" alt="" class="vimg-bg">
              <div class="coin-colors"
                :style="{backgroundColor: '#7cbbf1'}"></div>
              <div class="o-top">
                <div class="ot-logo">
                  <img :src="coinbaseIcos[selectInfo?selectInfo.name:'']||require('~/static/images/defaultico.png')" alt="">
                </div>
                <strong>{{ $t('PageMiner.text1') }}</strong>
              </div>
              <div class="o-info" v-if="nowSearchInfo.addr||selectInfo">
                <!-- <h6>{{ $t('PageHome.text15') }}</h6> -->
                <div class="o-addr">
                  <div class="o-tag">{{ $t('new01.text3') }}</div>
                  <template v-if="nowSearchInfo.addr">
                    <span>{{ nowSearchInfo.addr.substr(0, 4) }}...{{ nowSearchInfo.addr.substr(-6) }}</span>
                    <img src="~/static/images/copyico.png" alt="" class="copybtn"
                      @click="onCopyText(nowSearchInfo.addr)">
                  </template>
                  <template v-else>
                    <span>{{ selectInfo.addr.substr(0, 4) }}...{{ selectInfo.addr.substr(-6) }}</span>
                    <img src="~/static/images/copyico.png" alt="" class="copybtn"
                      @click="onCopyText(selectInfo.addr)">
                  </template>
                </div>
                <!-- <h5>-</h5> -->
                <div class="o-amount">
                  <div class="mxtext">
                    <p>{{ $t('new01.text6') }}：{{ nowSearchInfo.name || selectInfo.name }}</p>
                    <p>
                      <b>{{ $t('PageMiner.text2') }}：</b>
                    </p>
                    <p>
                      <img src="~/static/images/BNB.png" >
                      <strong>{{ item[0] }}</strong>
                    </p>
                  </div>
                  <p>
                    {{ $t('PageMiner.text3') }}： {{ item[1] }} {{ $t('PageHome.text17') }}
                  </p>
                  <p>
                    {{ $t('PageMiner.text4') }}： {{ item[2] }}
                  </p>
                  <p>
                    {{ $t('PageMiner.text5') }}： {{ item[3] }} {{ nowSearchInfo.name || selectInfo.name }}
                  </p>
                  <p>
                    {{ $t('PageMiner.text6') }}： {{ item[4] }} {{ nowSearchInfo.name || selectInfo.name }}
                  </p>
                </div>
                <div class="cp-btnbox">
                  <el-button class="inbtntext-int1" :disabled="!nowSearchInfo.addr&&!selectInfo.addr"
                    @click="onIncome(nowSearchInfo.addr||selectInfo.addr)">{{ $t('income') }}</el-button>
                  <el-button class="inbtntext-int2" :disabled="!nowSearchInfo.addr&&!selectInfo.addr"
                    @click="onResupply(nowSearchInfo.addr||selectInfo.addr)">{{ $t('resupply') }}</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
      <div v-if="!myMinerLists.length">
        <el-empty description="No Data"></el-empty>
      </div>
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
      myMinerLists: [
        {
          0: '0.00000000',
          1: '-',
          2: '-',
          3: '0.00000000',
          4: '0.00000000',
          5: '0x0000000000000000000000000000000000000000',
          6: '-'
        },
        {
          0: '0.00000000',
          1: '-',
          2: '-',
          3: '0.00000000',
          4: '0.00000000',
          5: '0x0000000000000000000000000000000000000000',
          6: '-'
        },
        {
          0: '0.00000000',
          1: '-',
          2: '-',
          3: '0.00000000',
          4: '0.00000000',
          5: '0x0000000000000000000000000000000000000000',
          6: '-'
        },
        {
          0: '0.00000000',
          1: '-',
          2: '-',
          3: '0.00000000',
          4: '0.00000000',
          5: '0x0000000000000000000000000000000000000000',
          6: '-'
        },
        {
          0: '0.00000000',
          1: '-',
          2: '-',
          3: '0.00000000',
          4: '0.00000000',
          5: '0x0000000000000000000000000000000000000000',
          6: '-'
        },
        {
          0: '0.00000000',
          1: '-',
          2: '-',
          3: '0.00000000',
          4: '0.00000000',
          5: '0x0000000000000000000000000000000000000000',
          6: '-'
        }
      ],
      amountBNB: 0,
      cacheMiners: [],
      nowSearchInfo: {},
      searchLoading: false
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
    this.$store.dispatch('wallet/queryAmountBNB')
    .then((amount) => {
      this.amountBNB = amount
    })
  },
  mounted () {
    let cacheMiners = localStorage.getItem('cacheMiners') || '[]';
    this.cacheMiners = JSON.parse(cacheMiners);
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    async onSearchMiner (item) {
      this.nowSearchInfo = item;
      this.queryMinerOrder(item.addr);
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.queryMinerOrder(item.addr)
      }, 10*1000)
    },
    onAllValue () {
      this.amountNumber = (this.amountBNB-0.001)
    },
    async onResupply (addr) {
      const { methods } = await this.$store.dispatch('contract/event', 'Miner');
      methods.Resupply(addr).send((err, txHash) => {
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    async onIncome (addr) {
      const { methods } = await this.$store.dispatch('contract/event', 'Miner');
      methods.sendMiner(addr).send((err, txHash) => {
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
    async queryMinerOrder (addr) {
      this.searchLoading = true;
      const { methods } = await this.$store.dispatch('contract/event', 'Miner');
      methods.getMiner(addr).call((err, res) => {
        this.searchLoading = false;
        if (!err && res[0]) {
          this.myMinerLists = res[0].map((text, index) => {
            return {
              0: (text/Math.pow(10,18)).toFixed(8),
              1: res[1][index],
              2: res[2][index] == 0 ? '0' : new Date(Number(res[2][index]+'000')).toLocaleString(),
              3: null,
              4: null,
            }
          })
          methods.getMiner1s(addr).call((err, res) => {
            console.log('数据01：', res)
            if (!err) {
              for (let i = 0; i < this.myMinerLists.length; i ++) {
                this.myMinerLists[i][3] = (res[0][i]/Math.pow(10, 18)).toFixed(8);
                this.myMinerLists[i][4] = (res[1][i]/Math.pow(10, 18)).toFixed(8);
              }
            }
          })
        }
      })
    },
    async onSetStarMiner () {
      const { methods } = await this.$store.dispatch('contract/event', 'Miner');
      const payAmount = web3.utils.toWei(String(this.amountNumber), 'ether');
      methods.setBNB(this.selectInfo.addr, this.addr2Token).send({
        value: payAmount,
        gas: this.$store.state.contract.minerGas
      }, (err, txHash) => {
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
          this.cacheMiners.push({
            addr: this.selectInfo.addr,
            name: this.selectInfo.name,
          })
          localStorage.setItem('cacheMiners', JSON.stringify(this.cacheMiners));
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    onChangePairIndex (index) {
      this.selectPairIndex = index;
    },
    onSelectCoinbase (item) {
      this.nowSearchInfo = {};
      this.selectInfo = item;
      this.queryMinerOrder(item.addr);
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.queryMinerOrder(item.addr)
      }, 10*1000)
    },
    onClearSelectInfo () {
      this.selectInfo = null;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/pages/miner.scss';
</style>