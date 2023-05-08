<template>
  <div class="page-lp-swap">
    <div class="top-navbarlist">
      <nuxt-link :to="localePath('/lpMiner')" class="aintext">{{ $t('new08.nav1') }}</nuxt-link>
      <nuxt-link :to="localePath('/lpSwap')" class="aintext">{{ $t('new08.nav2') }}</nuxt-link>
      <nuxt-link :to="localePath('/community')" class="aintext">{{ $t('new08.nav3') }}</nuxt-link>
      <nuxt-link :to="localePath('/launch')" class="aintext active">{{ $t('new08.text1') }}</nuxt-link>
    </div>
    <div class="lp-swap-topbox">
      <div class="sw-title">
        <img src="@/static/images/swapico1.png" />
        <span>{{ $t('new08.text1') }}</span>
      </div>
      <div class="sw-formcell">
        <div class="sw-cell">
          <h6>{{ $t('new08.text16') }} <small>{{ selectTokens[0].balance }}</small></h6>
          <div class="sw-input">
            <div class="leftarrow" @click="showSelectToken = true, nowIndex = 0">
              <span :class="{active: !!selectTokens[0].name}">{{ selectTokens[0].name || 'Select Token' }}</span>
              <img src="@/static/images/swaparrow.png" alt="">
            </div>
            <div class="rinput-box">
              <input type="number" class="rinput" placeholder="0" min="0" disabled
                v-model="selectValues[0]" />
            </div>
          </div>
        </div>
        <div class="sw-cell">
          <h6>{{ $t('new08.text16') }} <small>{{ nowAmount }}</small></h6>
          <div class="sw-input">
            <div class="leftarrow left-tabitem">
              <div class="stbico" :class="{active: stbIndex == 0}" @click="onTab(0)">
                <img src="@/static/images/SELLC.png" class="ico" />
                <span class="stspan">SELLC</span>
              </div>
              <div class="stbico" :class="{active: stbIndex == 1}" @click="onTab(1)">
                <img src="@/static/images/USDT.png" class="ico" />
                <span class="stspan">USDT</span>
              </div>
            </div>
            <div class="maxtext" @click="onMax(1)">
              <span>MAX</span>
            </div>
            <div class="rinput-box">
              <input type="number" class="rinput" placeholder="0" min="0"
                v-model="selectValues[1]" />
            </div>
          </div>
        </div>
        <div class="sw-btn auth-btn">
          <el-button type="primary" round class="themebtn-token"
            :disabled="isAuth1" :loading="authLoading"
            @click="onAuthContract(stbTokens[stbIndex])">
            {{ isAuth1 ? $t('new08.text17') : $t('authorize') }} {{ ['SELLC', 'USDT'][stbIndex] || '' }}
          </el-button>
          <el-button type="primary" round class="themebtn-token"
            :disabled="isAuth2 || !selectTokens[0].addr" :loading="authLoading"
            @click="onAuthContract(selectTokens[0].addr)">
            {{ isAuth2 ? $t('new08.text17') : $t('authorize') }} {{ selectTokens[0].name || '' }}
          </el-button>
        </div>
        <div class="sw-btn">
          <el-button type="primary" round class="themebtn-token"
            :disabled="!selectTokens[0].addr || !selectValues[1] || !isAuth1 || !isAuth2" 
            :loading="subLoading"
            @click="onAddLiquidity">{{ $t('new08.text32') }}</el-button>
        </div>
      </div>
    </div>
    <div class="lp-swap-bottombox">
      <div class="linktextbox">
        <h3>{{ $t('new08.text30') }}</h3>
        <p>
          <span v-html="$t('new08.text33')"></span> 
          <b @click="onCopyText(`https://selltoken.org/miner?addr=0x2F98Fa813Ced7Aa9Fd6788aB624b2F3F292B9239`)">https://selltoken.org/miner?addr=0x2F98Fa813Ced7Aa9Fd6788aB624b2F3F292B9239 <i class="el-icon-document-copy"></i></b>
        </p>
      </div>
    </div>
    <el-dialog width="420px" title="Select a token" :visible.sync="showSelectToken">
      <div style="margin-top: -20px">
        <search-token @select="onSelectToken"></search-token>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  SELLC_ADDRESS, USDT_ADDRESS
} from '@/contract/ABI';
import {
  BNB_ADDRESS
} from '@/contract/Miner';
export default {
  name: 'Launch',
  data () {
    return {
      MinerAddress: BNB_ADDRESS,
      showSelectToken: false,
      nowIndex: -1,
      selectTokens: {
        0: {},
        1: {}
      },
      selectValues: {
        0: '',
        1: ''
      },
      subLoading: false,
      authLoading: false,
      isAuth1: false,
      isAuth2: false,
      blackAmount: 0,
      stbIndex: 0,
      nowAmount: 0,
      stbTokens: [SELLC_ADDRESS, USDT_ADDRESS]
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
    }
  },
  watch: {
    txChainHash () { // 监听授权状态
      if (!this.txChainHash) {
        this.chkAuth()
      }
    }
  },
  mounted () {
    this.queryBurnedBalance();
    this.chkAuth();
  },
  methods: {
    chkAuth () {
      if (this.stbTokens[this.stbIndex]) {
        this.queryAllowance(this.stbTokens[this.stbIndex])
        .then((authAmount) => {
          this.isAuth1 = !!authAmount
        })
      }
      if (this.selectTokens[0].addr) {
        this.queryAllowance(this.selectTokens[0].addr)
        .then((authAmount) => {
          this.isAuth2 = !!authAmount
        })
      }
    },
    onCopyText (text) {
      this.$copyText(text).then((e) => {
        console.log(e)
        this.$message.success(this.$t('copySuccess'))
      }, () => {
        this.$message.success(this.$t('copyFail'))
      })
    },
    onTab (index) {
      this.stbIndex = index;
      this.chkAuth();
      this.queryBurnedBalance();
    },
    async queryBurnedBalance () {
      const address = this.stbIndex == 0 ? SELLC_ADDRESS : USDT_ADDRESS;
      const { methods } = await this.$store.dispatch('contract/common', { address });
      const { decNum } = await this.$store.dispatch('contract/queyrSymbol', address);
      methods.balanceOf(this.walletAddress).call((err, res) => {
        if (!err) {
          this.nowAmount = (res/Math.pow(10,decNum)).toFixed(8)
        }
      })
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
    async queryTotalSupply () {
      const address = this.selectTokens[0].addr;
      const { decNum } = await this.$store.dispatch('contract/queyrSymbol', address);
      const { methods } = await this.$store.dispatch('contract/common', { address });
      methods.totalSupply().call((err, res) => {
        if (!err) {
          this.selectValues[0] = (res/Math.pow(10, decNum)).toFixed(4);
        }
      })
    },
    onSelectToken (token) {
      this.selectTokens[this.nowIndex] = token;
      this.selectValues[this.nowIndex] = '';
      this.chkAuth();
      this.queryTotalSupply();
      this.queryBurnedBalance();
      this.nowIndex = -1;
      this.showSelectToken = false;
    },
    onMax (index) {
      this.selectValues[index] = this.nowAmount || '';
    },
    async onAddLiquidity () {
      const { methods } = await this.$store.dispatch('contract/event', 'LPSwap');
      const addr1 = this.selectTokens[0].addr;
      const addr2 = this.stbIndex == 0 ? SELLC_ADDRESS : USDT_ADDRESS;
      const sellNum =  web3.utils.toWei(String(this.selectValues[1]), 'ether');
      this.subLoading = true;
      const liquidityGas = this.$store.state.contract.liquidityGas[this.nowChainName];
      methods.addLiquidity(addr1, addr2, sellNum).send({
        gas: liquidityGas
      },(err, txHash) => {
        this.subLoading = false;
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/pages/lpSwap.scss';
.left-tabitem.leftarrow {
  position: relative;
  padding: 0 10px;
  box-sizing: border-box;
  @include flexBox;

  .stbico {
    @include flexBox;
    flex-direction: column;
    text-align: center;
    flex: 1;
    border-radius: 50px;
    .ico {
      width: 20px;
      height: 20px;
    }
    .stspan {
      font-size: 12px !important;
      margin: 0 !important;
      color: #999 !important;
    }
    &.active {
      background: rgba(#8b33de, 0.5) !important;
      .stspan {
        color: #Fff !important;
      }
    }
  }
}
.linktextbox {
  position: relative;
  padding: 30px 0;
  h3 {
    padding-bottom: 20px;
    border-bottom: 1px solid #f8f8f8;
    margin-bottom: 20px;
  }
  p {
    font-size: 14px;
    color: #333;
    line-height: 2em;
    b {
      color: red;
      cursor: pointer;
    }
  }
}
</style>