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
            <auto-search size="small" @select="onSelectCoinbase" @clear="onClearSelectInfo"
              :content="$t(`new03.text3_${nowChainName}`)"></auto-search>
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
                :min="0.000001" :step="0.1" :max="5">
              </el-input-number>
              <div class="amount-unit">
                <img :src="require(`~/static/images/${nowChainName}.png`)" alt="" class="unitico">
              </div>
            </div>
            <div class="write-balance">
              <div class="wbleft">
                <img :src="require(`~/static/images/${nowChainName}.png`)" class="ico" />
                <span>{{ $t('new02.text5') }}： {{ walletAmount }}</span>
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
      <div class="old-tabbox">
        <h5 v-if="cacheMiners.length">
          {{ $t('new02.text8') }}
          <!-- <p>当前查询：{{ nowSearchAddr }}</p> -->
        </h5>
        <div class="old-tablist" v-if="cacheMiners.length">
          <el-button size="small" :loading="searchLoading"
            v-for="item in cacheMiners" :key="item.name"
            @click="onSearchMiner(item)">{{ item.name }}</el-button>
        </div>
        <div class="contract-balance">
          <h5>{{ $t('new04.text2') }}</h5>
          <h6>
            <img v-if="nowSearchInfo" :src="coinbaseIcos[nowSearchInfo?nowSearchInfo.name:'']||require('~/static/images/defaultico.png')" alt="">
            <img v-else :src="coinbaseIcos[selectInfo?selectInfo.name:'']||require('~/static/images/defaultico.png')" alt="">
            {{ nowContractAmount }}
          </h6>
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
                  <img v-if="nowSearchInfo" :src="coinbaseIcos[nowSearchInfo?nowSearchInfo.name:'']||require('~/static/images/defaultico.png')" alt="">
                  <img v-else :src="coinbaseIcos[selectInfo?selectInfo.name:'']||require('~/static/images/defaultico.png')" alt="">
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
                      <img :src="require(`~/static/images/${nowChainName}.png`)" >
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
                  <el-button class="inbtntext-int1" 
                    :disabled="(!nowSearchInfo.addr&&!selectInfo.addr)||!item[5]" :loading="inLoading"
                    @click="onIncome(nowSearchInfo.addr||selectInfo.addr)">{{ $t('income') }}</el-button>
                  <el-button class="inbtntext-int2" 
                    :disabled="(!nowSearchInfo.addr&&!selectInfo.addr)||!item[5]" :loading="inLoading"
                    @click="onResupply(nowSearchInfo.addr||selectInfo.addr)">{{ $t('resupply') }}</el-button>
                </div>
              </div>
              <div v-else>
                <el-empty description="No Data"></el-empty>
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
            {{ $t('PageMiner.text7', { contractAddress: MinerAddress }) }}<br>
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
export default {
  name: 'MinerPage',
  data () {
    return {
      selectInfo: null,
      amountNumber: 0.1,
      MinerAddress: '',
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
          5: false,
          6: '-'
        },
        {
          0: '0.00000000',
          1: '-',
          2: '-',
          3: '0.00000000',
          4: '0.00000000',
          5: false,
          6: '-'
        },
        {
          0: '0.00000000',
          1: '-',
          2: '-',
          3: '0.00000000',
          4: '0.00000000',
          5: false,
          6: '-'
        },
        {
          0: '0.00000000',
          1: '-',
          2: '-',
          3: '0.00000000',
          4: '0.00000000',
          5: false,
          6: '-'
        },
        {
          0: '0.00000000',
          1: '-',
          2: '-',
          3: '0.00000000',
          4: '0.00000000',
          5: false,
          6: '-'
        },
        {
          0: '0.00000000',
          1: '-',
          2: '-',
          3: '0.00000000',
          4: '0.00000000',
          5: false,
          6: '-'
        }
      ],
      walletAmount: 0,
      cacheMiners: [],
      nowSearchInfo: {},
      searchLoading: false,
      nowContractAmount: 0,
      inLoading: false
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
    commonAddrs () {
      return this.$store.state.wallet.commonAddrs;
    },
    pairLists () {
      return this.$store.state.wallet.pairLists;
    },
    nowChainName () {
      return this.$store.state.wallet.nowChainName;
    }
  },
  created () {
    this.defaultAddress = this.$route.query.addr1;
    this.$store.dispatch('wallet/queryAmount')
    .then((amount) => {
      this.walletAmount = amount
    })
  },
  mounted () {
    let cacheMiners = localStorage.getItem('cacheMiners') || '[]';
    this.cacheMiners = JSON.parse(cacheMiners);
    this.getMinerAddress();
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    async getMinerAddress () {
      const contract = await this.$store.dispatch('contract/event', 'Miner');
      this.MinerAddress = contract._address;
    },
    async queryCoinbaseBalance (coinbaseAddress) {
      const { methods } = await this.$store.dispatch('contract/common', {address: coinbaseAddress});
      methods.balanceOf(this.MinerAddress).call((err, res) => {
        if (!err) {
          this.nowContractAmount = (res/Math.pow(10, 18)).toFixed(8)
        }
      })
    },
    async onSearchMiner (item) {
      this.nowSearchInfo = item;
      this.queryMinerOrder(item.addr);
      this.queryCoinbaseBalance(item.addr)
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.queryMinerOrder(item.addr)
      }, 10*1000)
    },
    onAllValue () {
      this.amountNumber = (this.walletAmount-0.001)
    },
    async onResupply (addr) {
      this.inLoading = true;
      const { methods } = await this.$store.dispatch('contract/event', 'Miner');
      const minerGas = this.$store.state.contract.minerGas[this.nowChainName];
      methods.Resupply(addr).send({
        gas: minerGas
      }, (err, txHash) => {
        this.inLoading = false;
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    async onIncome (addr) {
      this.inLoading = true;
      const { methods } = await this.$store.dispatch('contract/event', 'Miner');
      const totalAmount = this.myMinerLists.reduce((a, b) => {
        return a[4] ? Number(a[4]) + Number(b[4]) : a + Number(b[4]);
      })
      const myCoinbase = await this.$store.dispatch('contract/common', { address: this.selectInfo.addr });
      const { decNum } = await this.$store.dispatch('contract/queyrSymbol', this.selectInfo.addr)
      myCoinbase.methods.balanceOf(this.walletAddress).call((err, res) => {
        if (!err) {
          const myAmount = res/Math.pow(10,decNum);
          if (totalAmount > myAmount) {
            this.inLoading = false;
            return this.$alert(this.$t('new06.text6'), 'Tips', {
              confirmButtonText: this.$t('new04.text4')
            })
          }
          methods.sendMiner(addr).send((err, txHash) => {
            this.inLoading = false;
            if (!err) {
              this.$store.dispatch('contract/cochainHashSuccess', { txHash })
            } else {
              this.$store.dispatch('contract/cochainHashError', { err })
            }
          })
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
            let nowTime = Date.now()/1000;
            return {
              0: (text/Math.pow(10,18)).toFixed(8),
              1: res[1][index],
              2: res[2][index] == 0 ? '0' : new Date(Number(res[2][index]+'000')).toLocaleString(),
              3: null,
              4: null,
              5: nowTime > (Number(res[2][index])+86400)
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
      const minerGas = this.$store.state.contract.minerGas[this.nowChainName];
      methods.setBNB(this.selectInfo.addr, this.addr2Token).send({
        value: payAmount,
        gas: minerGas
      }, (err, txHash) => {
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
          let isHave = false;
          for (let i = 0; i < this.cacheMiners.length; i ++) {
            let nowItem = this.cacheMiners[i];
            if (nowItem.addr == this.selectInfo.addr) {
              isHave = true;
              break;
            }
          }
          if (!isHave) {
            this.cacheMiners.push({
              addr: this.selectInfo.addr,
              name: this.selectInfo.name,
            })
            localStorage.setItem('cacheMiners', JSON.stringify(this.cacheMiners));
          }
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    onChangePairIndex (index) {
      const cName = this.selectInfo ? this.selectInfo.name : '';
      this.$alert(this.$t('new04.text6', {
        tokenName: this.pairLists[index],
        coinbaseName: cName
      }), this.$t('new04.text3'), {
        confirmButtonText: this.$t('new04.text4'),
        cancelButtonText: this.$t('new04.text5'),
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(async () => {
        this.selectPairIndex = index;
      }).catch(() => {})
    },
    onSelectCoinbase (item) {
      this.nowSearchInfo = {};
      this.selectInfo = item;
      this.queryMinerOrder(item.addr);
      this.queryCoinbaseBalance(item.addr);
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