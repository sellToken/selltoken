<template>
  <div class="page-lpincome">
    <div class="top-navbarlist">
      <nuxt-link :to="localePath('/lpMiner')" class="aintext active">{{ $t('new08.nav1') }}</nuxt-link>
      <nuxt-link :to="localePath('/lpSwap')" class="aintext">{{ $t('new08.nav2') }}</nuxt-link>
      <nuxt-link :to="localePath('/community')" class="aintext">{{ $t('new08.nav3') }}</nuxt-link>
      <nuxt-link :to="localePath('/launch')" class="aintext">{{ $t('new08.text1') }}</nuxt-link>
    </div>
    <div class="container">
      <div class="top-title">
        <h2>{{ $t('new08.text2') }}</h2>
        <p>{{ $t('new08.text3') }}</p>
      </div>
      <div class="community-box">
        <div class="sw-title">
          <img src="@/static/images/linkico.png" class="lkico" />
          <span class="wxtext">{{ $t('new08.text4') }}</span>
          <div class="right-tokens">
            <div class="select-token" @click="showSelectToken = true" style="margin-left: 0">
              <img :src="coinbaseIcos[selectTokenInfo.name]||require('~/static/images/defaultico.png')" class="coinico" />
              <span>{{ selectTokenInfo.name || 'Select Token' }}</span>
              <img src="@/static/images/swaparrow.png" />
            </div>
            <div class="lpincome-pair">
              <div class="stbico" :class="{active: stbIndex == 0}">
                <img src="@/static/images/SELLC.png" class="ico" />
                <p class="stspan">SELLC</p>
              </div>
              <div class="stbico" :class="{active: stbIndex == 1}">
                <img src="@/static/images/USDT.png" class="ico" />
                <p class="stspan">USDT</p>
              </div>
            </div>
          </div>
        </div>
        <div class="lpincome-foot">
          <el-row>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <div class="cell-incomeinfo">
                <div class="c-item">
                  <h5>{{ $t('new08.text5') }}</h5>
                  <p>{{ infos[6] || '-' }}</p>
                </div>
                <div class="c-item">
                  <h5>{{ $t('new08.text10') }}</h5>
                  <p>{{ infos[3] || '-' }}</p>
                </div>
              </div>
              <div class="cell-incomeinfo">
                <div class="c-item">
                  <h5>{{ $t('new08.text7') }}</h5>
                  <p>{{ infos[5] || '-' }}</p>
                </div>
              </div>
              <div class="cell-incomeinfo">
                <div class="c-item">
                  <h5>{{ $t('new08.text9') }}</h5>
                  <p>{{ infos[1] || '-' }}</p>
                </div>
                <div class="c-item">
                  <h5>{{ $t('new08.text6') }}</h5>
                  <p>{{ infos[0] || '-' }}</p>
                </div>
              </div>
              <div class="cell-incomeinfo">
                <div class="c-item"
                  style="background: linear-gradient(to right, #9588ed, #fcb273)">
                  <h5>{{ $t('new08.text11') }}</h5>
                  <p>{{ infos[4] || '-' }}</p>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <div class="right-income">
                <h2>{{ $t('new08.text12') }}</h2>
                <div class="lpincome-pair aricotextbox">
                  <div class="stbico" :class="{active: trIndex == 0, disabled: stbIndex == 1}" 
                    @click="onTabTrn(0)">
                    <img src="@/static/images/SELLC.png" class="ico" />
                    <p class="stspan">SELLC</p>
                  </div>
                  <div class="stbico" :class="{active: trIndex == 1}" @click="onTabTrn(1)">
                    <img src="@/static/images/USDT.png" class="ico" />
                    <p class="stspan">USDT</p>
                  </div>
                </div>
                <div class="income-number">
                  <el-input-number :controls="false" :placeholder="$t('new08.text15')"
                    :precision="4"
                    v-model="writeNumber" :min="100"
                    @change="onInputNumber"></el-input-number>
                </div>
                <div class="balance-box">
                  <h5>{{ $t('new08.text16') }}:</h5>
                  <div class="flexbox-cell">
                    <p>
                      <img src="@/static/images/SELLC.png" class="ico" />
                      <span>{{ balanceInfo['SELLC'] }}</span>
                    </p>
                    <p>
                      <img src="@/static/images/USDT.png" class="ico" />
                      <span>{{ balanceInfo['USDT'] }}</span>
                    </p>
                  </div>
                </div>
                <div class="sbtn-auth-cell">
                  <el-button type="primary" round class="themebtn-token"
                    :disabled="isAuth1" :loading="authLoading"
                    @click="onAuthContract(stbTokens[0])">
                    {{ isAuth1 ? $t('new08.text17') : $t('authorize') }} SELLC
                  </el-button>
                  <el-button type="primary" round class="themebtn-token"
                    :disabled="isAuth2" :loading="authLoading"
                    @click="onAuthContract(stbTokens[1])">
                    {{ isAuth2 ? $t('new08.text17') : $t('authorize') }} USDT
                  </el-button>
                </div>
                <div class="sbtn-cell">
                  <el-button type="primary" class="themebtn-token-plain" plain round
                    :disabled="isWithdrawDisabled" 
                    :loading="subLoading" 
                    @click="onWithdraw">{{ $t('new08.text13') }}</el-button>
                  <el-button type="primary" class="themebtn-token" round
                    :loading="subLoading"
                    :disabled="!selectTokenInfo.addr || (trIndex == 0 ? !isAuth1 : !isAuth2)"
                    @click="onSubStake">{{ $t('new08.text14') }}</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <el-dialog width="420px" title="Select a token" :visible.sync="showSelectToken">
      <div style="margin-top: -20px">
        <search-token @select="onSelectToken"></search-token>
      </div>
    </el-dialog>
    <!-- <el-dialog title="维护中" :visible.sync="showWH" @closed="closePage">
      <div>
        <p>
          LP-Swap 维护20-50分钟
          <br /><br />
          1、解决用户卖出代币网体返佣可能存在转移到其他地址后出售，上级就没有返佣。<br />
          2、解决大额USDT夹子问题
          <br /><br />
          更改为：
          <br />
          用户取款收益的时候直接50%返佣给网体，卖出代币100%销毁用户得到50%金本位和50%代币
        </p>
        <div style="text-align: center; margin-top: 20px;">
          <el-button type="primary" @click="showWH = false">好的</el-button>
        </div>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import {
  SELLC_ADDRESS, USDT_ADDRESS
} from '@/contract/ABI';
export default {
  name: 'community',
  data () {
    return {
      showWH: false,
      showSelectToken: false,
      selectTokenInfo: {},
      stbIndex: -1,
      stbTokens: [SELLC_ADDRESS, USDT_ADDRESS],
      trIndex: 1,
      infos: {},
      subLoading: false,
      writeNumber: 100,
      isWithdrawDisabled: true,
      timer: null,
      isAuth1: false,
      isAuth2: false,
      authLoading: false,
      balanceInfo: {
        SELLC: 0,
        USDT: 0,
      },
      balanceTimer: null
    }
  },
  computed: {
    coinbaseIcos () {
      return this.$store.state.coinbaseIcos;
    },
    walletAddress () {
      return this.$store.state.wallet.walletAddress;
    },
    txChainHash () {
      return this.$store.state.contract.txHash;
    },
    nowChainName () {
      return this.$store.state.wallet.nowChainName;
    },
    inviteAddress () {
      return this.$store.state.wallet.inviteAddress || '0x2F98Fa813Ced7Aa9Fd6788aB624b2F3F292B9239';
    },
    inviteLink () {
      return process.browser ? globalThis.location.origin + '?addr=' + this.walletAddress : '';
    }
  },
  watch: {
    txChainHash () { // 监听授权状态
      if (!this.txChainHash) {
        this.chkAuth()
      }
    }
  },
  created () {
    this.chkAuth()
    this.queryBalance('SELLC');
    this.queryBalance('USDT');
    this.balanceTimer = setInterval(() => {
      this.queryBalance('SELLC');
      this.queryBalance('USDT');
    }, 10000)
  },
  destroyed () {
    clearTimeout(this.timer);
    clearInterval(this.balanceTimer);
  },
  methods: {
    closePage () {
      this.$router.push(this.localePath('/lpSwap'))
    },
    onInputNumber () {
      console.log(111, this.writeNumber)
      if (this.trIndex == 1 && this.writeNumber >= 300) {
        this.$alert(
          this.$t('new08.text35'),
          'Tips',
          {
          type: 'warning'
        })
      }
    },
    async queryBalance (coinbase) {
      const { methods } = await this.$store.dispatch('contract/common', { coinbase });
      methods.balanceOf(this.walletAddress).call((err, res) => {
        console.log(coinbase+'余额', (res/Math.pow(10, 18)).toFixed(4))
        this.balanceInfo[coinbase] = (res/Math.pow(10, 18)).toFixed(4);
      })
    },
    async queryAllCoinbase (addr) {
      const { methods } = await this.$store.dispatch('contract/event');
      return new Promise((resolve, reject) => {
        methods.getTokenName(addr).call((err, res) => {
          if (!err) {
            resolve(res)
          } else {
            reject(err)
          }
        })
      })
    },
    async queryPairInfo () {
      const { methods } = await this.$store.dispatch('contract/event', 'LPSwap');
      return new Promise((resolve, reject) => {
        methods.myReward(this.selectTokenInfo.addr).call((err, pairAddr) => {
          if (!err) {
            if (pairAddr == 0) {
              this.$alert(
                this.$t('new08.text34'),
                'Tips', 
                {
                  type: 'warning'
              })
              this.selectTokenInfo = {};
              this.infos = {};
              this.stbIndex = -1;
              reject(false)
            } else {
              this.queryAllCoinbase(pairAddr)
              .then((addrInfo) => {
                this.stbIndex = addrInfo[0] === 'SELLC' ? 0 : 1
                resolve(pairAddr)
              })
            }
          }
        })
      })
    },
    chkAuth () {
      if (this.stbTokens[0]) {
        this.queryAllowance(this.stbTokens[0])
        .then((authAmount) => {
          this.isAuth1 = !!authAmount
        })
      }
      if (this.stbTokens[1]) {
        this.queryAllowance(this.stbTokens[1])
        .then((authAmount) => {
          this.isAuth2 = !!authAmount
        })
      }
    },
    async onAuthContract (address) { // 执行授权
      this.authLoading = true;
      const { methods } = await this.$store.dispatch('contract/common', { address });
      const contract = await this.$store.dispatch('contract/event', 'LPSwap');
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
      const contract = await this.$store.dispatch('contract/event', 'LPSwap');
      const { decNum } = await this.$store.dispatch('contract/queyrSymbol', address)
      return new Promise((resolve, reject) => {
        methods.allowance(this.walletAddress, contract._address).call((err, res) => {
          if (err) {
            reject(err)
          } else {
            console.log('查询授权：', res/Math.pow(10, decNum))
            resolve(res/Math.pow(10, decNum))
          }
        })
      })
    },
    async querySellcNumber () {
      const { methods } = await this.$store.dispatch('contract/event', 1);
      const { decNum } = await this.$store.dispatch('contract/queyrSymbol', this.stbTokens[0]);
      return new Promise((resolve) => {
        methods.getToken3Price(this.stbTokens[0], '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c').call((err, res) => {
          if (!err) {
            const price = res/Math.pow(10,decNum);
            this.writeNumber = (101/price).toFixed(4);
            resolve(this.writeNumber)
          }
        })
      })
    },
    async onWithdraw () {
      const { methods } = await this.$store.dispatch('contract/event', 'LPSwap');
      this.subLoading = true;
      const addr1 = this.selectTokenInfo.addr;
      const addr2 = this.stbTokens[this.stbIndex];
      methods.claim(addr1, addr2).send((err, txHash) => {
        this.subLoading = false;
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    async onSubStake () {
      const { methods } = await this.$store.dispatch('contract/event', 'LPSwap');
      this.subLoading = true;
      const addr1 = this.selectTokenInfo.addr;
      const addr2 = this.stbTokens[this.stbIndex];
      const addr3 = this.stbTokens[this.trIndex];
      const num = web3.utils.toWei(String(this.writeNumber), 'ether');
      methods.stake(addr1, addr2, addr3, this.inviteAddress, num).send((err, txHash) => {
        this.subLoading = false;
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    onTabTrn (index) {
      if (this.stbIndex !== 1) {
        this.trIndex = index;
        if (index == 0) {
          this.querySellcNumber()
        } else {
          this.writeNumber = 100
        }
      }
    },
    onTab (index) {
      this.stbIndex = index;
      if (index == 1) {
        this.trIndex = index;
        this.writeNumber = 100;
      }
      this.queryInfos()
    },
    onCopyText (text) {
      this.$copyText(text).then((e) => {
        this.$message.success(this.$t('copySuccess'))
      }, () => {
        this.$message.success(this.$t('copyFail'))
      })
    },
    async queryInfos () {
      const addr1 = this.selectTokenInfo.addr;
      const addr2 = this.stbTokens[this.stbIndex];
      if (!addr1 || !addr2) return false;
      const { methods } = await this.$store.dispatch('contract/event', 'LPSwap');
      const { decNum } = await this.$store.dispatch('contract/queyrSymbol', addr1);
      methods.infos(addr1, addr2, this.walletAddress).call((err, res) => {
        if (!err) {
          this.infos = {
            0: (res[0]/Math.pow(10,decNum)).toFixed(4),
            1: new Date(Number(res[1]+'000')).toLocaleString(),
            2: (res[2]/Math.pow(10,decNum)).toFixed(8),
            3: (res[3]/Math.pow(10,decNum)).toFixed(8),
            4: (res[4]/Math.pow(10,decNum)).toFixed(8),
            5: (res[5]/Math.pow(10,decNum)).toFixed(0),
            6: (res[6]/Math.pow(10,decNum)).toFixed(0)
          }
          this.isWithdrawDisabled = !(Date.now()-(res[1]*1000)>3600000);
        }
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.queryInfos()
        }, 10000)
      })
    },
    onSelectToken (token) {
      this.selectTokenInfo = token;
      this.showSelectToken = false;
      this.queryPairInfo()
      .then(() => {
        this.queryInfos()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/pages/lpMiner.scss';

</style>