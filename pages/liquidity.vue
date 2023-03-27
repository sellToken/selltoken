<template>
  <div class="page-liquidity">
    <div class="topliquidity-content">
      <video muted loop class="linebg" autoplay playsinline>
        <source src="/videos/line-bg.mp4" type="video/webm">
        <source src="/videos/line-bg.mp4" type="video/mp4">
      </video>
      <div class="container">
        <div class="qui-box">
          <div class="qui-item">
            <h2>{{ $t('new01.text7') }}</h2>
            <auto-search :defaultAddress="defaultAddress" size="small" @select="onSelectCoinbase1"
              :content="$t('new03.text2')"></auto-search>
            <div class="tabs-list">
              <div class="tabs-item" 
                :class="{active: tabCurrent == item}"
                v-for="(item, index) in tabList" :key="index"
                @click="onSelectTabCurrent(item)">
                <span class="text">{{ item }} {{ $t('PageHome.text17') }}</span>
              </div>
            </div>
            <!-- 输入代币 -->
            <div class="write-amount">
              <el-input-number 
                v-model="amountNumber1" controls-position="right" 
                :min="0" :step="0.1" @change="onChangeNumber(1)">
              </el-input-number>
              <div class="amount-unit">
                <img v-if="selectInfo1" :src="coinbaseIcos[selectInfo1.name]||require('~/static/images/defaultico.png')" alt="" class="unitico">
                <!-- <span>{{ selectInfo1 ? selectInfo1.name : 'Select' }}</span> -->
              </div>
            </div>
            <div class="inbtn-box" v-if="!isHaveOwn">
              <el-button type="primary" :disabled="!amountNumber1||!selectInfo1" v-if="!isAuth1"
                :loading="authLoading"
                @click="onAuthContract(selectInfo1.addr)">{{ $t('authorize') }}</el-button>
              <el-button type="primary" 
                :disabled="!amountNumber1||!isAuth1||!tabCurrent" :loading="subLoading1"
                @click="onSetPool1">{{ $t('PageLiquidity.text1') }}</el-button>
            </div>
            <div class="inbtn-box" v-else>
              <el-button type="primary" disabled>{{ $t('new04.text1') }}</el-button>
            </div>
            <div class="inpintext">
              <p>{{ $t('PageLiquidity.text2') }}</p>
            </div>
          </div>
          <div class="qui-item">
            <h2>{{ $t('new01.text8') }}</h2>
            <auto-search size="small" @select="onSelectCoinbase2"
              :content="$t('new03.text2')"></auto-search>
            <!-- 选择交易对 -->
            <!-- <h3 class="pair-h3">{{ $t('PageHome.text3') }}</h3> -->
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
                v-model="amountNumber2" controls-position="right" 
                :min="0" :step="0.1" @change="onChangeNumber(2)">
              </el-input-number>
              <div class="amount-unit">
                <img v-if="selectInfo2" :src="coinbaseIcos[selectInfo2.name]||require('~/static/images/defaultico.png')" alt="" class="unitico">
                <!-- <span>{{ selectInfo2 ? selectInfo2.name : 'Select' }}</span> -->
              </div>
            </div>
            <div class="s-fee">
              <p>{{ $t('PageLiquidity.text8') }}: <b>{{ feeValue }}</b> {{ nowChainName }}</p>
            </div>
            <div class="inbtn-box">
              <el-button type="primary" :disabled="!amountNumber2||!selectInfo2" v-if="!isAuth2"
                :loading="authLoading"
                @click="onAuthContract(selectInfo2.addr)">{{ $t('authorize') }}</el-button>
              <el-button type="primary" 
                :disabled="!amountNumber2||!isAuth2" :loading="subLoading2"
                @click="onSetPool2">{{ $t('PageLiquidity.text1') }}</el-button>
            </div>
            <div class="inpintext">
              <p v-html="$t('PageLiquidity.text3')"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 订单 -->
    <div class="orderinfo-box">
      <div class="swiper-orderinfo" v-swiper:mySwiper="SwiperOptions">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in myMinerLists" :key="index">
            <div class="orderinfo-item">
              <img src="~/static/images/vinitembg.png" alt="" class="vimg-bg">
              <div class="coin-colors"
                :style="{backgroundColor: '#48c774'}"></div>
              <div class="o-top">
                <div class="ot-logo">
                  <img :src="coinbaseIcos[item[3]]||require('~/static/images/defaultico.png')" alt="">
                </div>
                <strong>{{ $t('PageHome.text25') }}</strong>
                <!-- <div class="o-types">
                  <b>{{ $t('new01.text2') }}</b>
                  <span v-if="item[4] != 'No pair'">{{ item[4] }}/{{ item[3] }}</span>
                  <span v-else>{{ item[4] }}</span>
                </div> -->
              </div>
              <div class="o-info">
                <div class="o-addr">
                  <!-- <div class="o-tag">{{ $t('new01.text3') }}</div> -->
                  <span>{{ item[0].substr(0, 6) }}...{{ item[0].substr(-8) }}</span>
                  <img src="~/static/images/copyico.png" alt="" class="copybtn"
                    @click="onCopyText(item[0])">
                </div>
                <div class="o-cellitem">
                  <span>{{ $t('new02.text1') }}：</span>
                  <strong >
                    <img src="~/static/images/defaultico.png" class="sico" />
                    {{ item[1] }}
                  </strong>
                </div>
                <div class="o-cellitem">
                  <span>{{ $t('new02.text2') }}：</span>
                  <strong >
                    {{ item[2] }}
                  </strong>
                </div>
                <div class="o-cellitem">
                  <span>{{ $t('new02.text3') }}：</span>
                  <strong >
                    {{ item[3] }}
                  </strong>
                </div>
                <div class="o-cellitem">
                  <span>{{ $t('new02.text4') }}：</span>
                  <strong >
                    <img src="~/static/images/defaultico.png" class="sico" />
                    {{ item[4] }}
                  </strong>
                </div>
                <div class="cp-btnbox">
                  <div class="inbtntext" :class="{disabled: item[0]==0}" 
                    @click="item[0]==0 ? '' : onRedeemCoinbase(item[0])">
                    <span>{{ $t('PageHome.text14') }}</span>
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
    <div class="liquidity-details">
      <div class="container">
        <div class="details-box">
          <h2>{{ $t('PageLiquidity.text4') }}</h2>
          <p>
            {{ $t('PageLiquidity.text5') }}：
            <b>{{ shortsInfos[2] || '0.0000' }}</b> 
            {{ selectInfo1 ? selectInfo1.name : '' }}
          </p>
          <p>
            {{ $t('PageLiquidity.text6') }}：
            <b>{{ shortsInfos[3] || '0.0000' }}</b> 
            {{ selectInfo1 ? selectInfo1.name : '' }}
          </p>
          <p>
            {{ $t('PageLiquidity.text7') }}：
            <b>{{ ((shortsInfos[3]/shortsInfos[2]*100)||0).toFixed(2) }}%</b> 
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LiquiditysPage',
  data () {
    return {
      tabList: [1, 5, 10],
      tabCurrent: '',
      selectInfo1: null,
      selectInfo2: null,
      amountNumber1: 0.1,
      amountNumber2: 0.1,
      isAuth1: false,
      isAuth2: false,
      selectPairIndex: -1,
      feeValue: '0.00000000',
      shortsInfos: {},
      miningUserInfos: {},
      defaultAddress: '',
      authLoading: false,
      subLoading1: false,
      subLoading2: false,
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
      myMinerLists: [
        {
          0: '0x0000000000000000000000000000000000000000',
          1: '0.00000000',
          2: '-',
          3: '0.000‰',
          4: '0.00000000',
        },
        {
          0: '0x0000000000000000000000000000000000000000',
          1: '0.00000000',
          2: '-',
          3: '0.000‰',
          4: '0.00000000',
        },
        {
          0: '0x0000000000000000000000000000000000000000',
          1: '0.00000000',
          2: '-',
          3: '0.000‰',
          4: '0.00000000',
        }
      ],
      isHaveOwn: false
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
    txChainHash () {
      return this.$store.state.contract.txHash;
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
  watch: {
    txChainHash () { // 监听授权状态
      if (!this.txChainHash) {
        this.onSelectCoinbase1(this.selectInfo1);
        this.onSelectCoinbase2(this.selectInfo2);
      }
    }
  },
  created () {
    this.defaultAddress = this.$route.query.addr1;
    this.queryShorts()
    this.queryMyMinerUsers()
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
    // 赎回
    async onRedeemCoinbase (addr) {
      const { methods } = await this.$store.dispatch('contract/event', 2);
      methods.minerWithdraw(addr).send((err, txHash) => {
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    async queryMyMinerUsers () {
      const { methods } = await this.$store.dispatch('contract/event', 2);
      methods.getUser(this.walletAddress).call((err, res) => {
        console.log(res)
        if (!err) {
          if (res[0].length) {
            this.myMinerLists = res[0].map((addr, index) => {
              return {
                0: addr,
                1: (res[1][index]/Math.pow(10,18)).toFixed(8),
                2: new Date(Number(res[2][index]+'000')).toLocaleString(),
                3: ((res[3][index]/10000-1)*1000).toFixed(3) + '‰',
                4: (res[4][index]/Math.pow(10,18)).toFixed(8)
              }
            })
          }
        }
      })
    },
    onChangePairIndex (index) {
      this.selectPairIndex = index;
    },
    async queryShorts () {
      if (this.selectInfo1 && this.selectInfo1.addr) {
        const { methods } = await this.$store.dispatch('contract/event');
        methods.getShorts(this.selectInfo1.addr).call((err, res) => {
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
      }
    },
    async getTokenAddress (addr) {
      const { methods } = await this.$store.dispatch('contract/event');
      return new Promise((resolve, reject) => {
        methods.getToke(addr).call((err, res) => {
          if (!err) {
            let commonAddr = this.commonAddrs[res[1]];
            if (commonAddr) {
              resolve(commonAddr)
            } else {
              reject('not address')
            }
          } else {
            reject(err)
          }
        })
      })
    },
    async onSetPool1 () {
      this.subLoading1 = true;
      const { methods } = await this.$store.dispatch('contract/event', 2);
      const coinbaseAddress = await this.getTokenAddress(this.selectInfo1.addr);
      const payAmount = web3.utils.toWei(String(this.amountNumber1), 'ether');
      methods.setPool(this.selectInfo1.addr, coinbaseAddress, payAmount, this.tabCurrent, 0)
      .send((err, txHash) => {
        this.subLoading1 = false;
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    async onSetPool2 () {
      this.subLoading2 = true;
      const { methods } = await this.$store.dispatch('contract/event', 2);
      const coinbaseAddress = this.addr2Token; // await this.getTokenAddress(this.selectInfo2.addr);
      const payAmount = web3.utils.toWei(String(this.amountNumber2), 'ether');
      const valueAmount = await this.queryFee();
      methods.setPool(this.selectInfo2.addr, coinbaseAddress, payAmount, 0, 1)
      .send({
        value: valueAmount
      }, (err, txHash) => {
        this.subLoading2 = false;
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    async queryFee () {
      const { methods } = await this.$store.dispatch('contract/event', 2);
      return new Promise((resolve) => {
        methods.fee().call((err, res) => {
          if (!err) {
            this.feeValue = (res/Math.pow(10, 18)).toFixed(8);
            resolve(res)
          }
        })
      })
    },
    onChangeNumber (typeIndex) {
      if (typeIndex == 1 && this.selectInfo1) {
        this.onSelectCoinbase1(this.selectInfo1)
      } else if (typeIndex == 2 && this.selectInfo2) {
        this.onSelectCoinbase2(this.selectInfo2)
      }
    },
    async onAuthContract (address) { // 执行授权
      this.authLoading = true;
      const { methods } = await this.$store.dispatch('contract/common', { address });
      const contract = await this.$store.dispatch('contract/event', 2);
      const authAmount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
      methods.approve(contract._address, authAmount).send((err, txHash) => {
        this.authLoading = false;
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    async queryAllowance (address) { // 查询授权
      const { methods } = await this.$store.dispatch('contract/common', { address });
      const contract = await this.$store.dispatch('contract/event', 2);
      return new Promise((resolve, reject) => {
        methods.allowance(this.walletAddress, contract._address).call((err, res) => {
          if (err) {
            reject(err)
          } else {
            console.log('查询授权：', res/Math.pow(10, 18))
            resolve(res/Math.pow(10, 18))
          }
        })
      })
    },
    onSelectTabCurrent (item) {
      this.tabCurrent = item
    },
    onSelectCoinbase1 (item) {
      this.isHaveOwn = false;
      for (let i = 0; i < this.myMinerLists.length; i ++) {
        let n = this.myMinerLists[i];
        if (n[0].toLocaleUpperCase() == item.addr.toLocaleUpperCase() && Number(n[1])>0) {
          this.isHaveOwn = true;
          break;
        }
      }
      this.selectInfo1 = item;
      this.isAuth1 = false;
      this.queryAllowance(item.addr)
      .then((authAmount) => {
        this.isAuth1 = this.amountNumber1 <= authAmount;
      })
      this.queryShorts()
    },
    onSelectCoinbase2 (item) {
      this.selectInfo2 = item;
      this.isAuth2 = false;
      this.queryAllowance(item.addr)
      .then((authAmount) => {
        this.isAuth2 = this.amountNumber2 <= authAmount;
      })
      this.queryFee()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/pages/liquidity.scss';
</style>