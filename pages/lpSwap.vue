<template>
  <div class="page-lp-swap">
    <div class="lp-swap-topbox">
      <div class="sw-title">
        <img src="@/static/images/swapico1.png" />
        <span>Swap</span>
        <nuxt-link to="/launch" class="morelink">项目发射 <i class="el-icon-d-arrow-right"></i></nuxt-link>
      </div>
      <div class="sw-formcell">
        <div class="sw-cell">
          <h6>Balance <small>{{ selectTokens[0].balance }}</small></h6>
          <div class="sw-input">
            <div class="leftarrow" @click="showSelectToken = true, nowIndex = 0">
              <span :class="{active: !!selectTokens[0].name}">{{ selectTokens[0].name || 'Select Token' }}</span>
              <img src="@/static/images/swaparrow.png" alt="">
            </div>
            <div class="maxtext" @click="onMax(0)">
              <span>MAX</span>
            </div>
            <div class="rinput-box">
              <input type="number" class="rinput" placeholder="0" min="0"
                v-model="selectValues[0]" />
            </div>
          </div>
        </div>
        <div class="sw-ex">
          <img src="@/static/images/swapico2.png" />
        </div>
        <div class="sw-cell">
          <h6>Balance <small>{{ selectTokens[1].balance }}</small></h6>
          <div class="sw-input">
            <div class="leftarrow">
              <span :class="{active: !!selectTokens[1].name}">{{ selectTokens[1].name || 'Select Token' }}</span>
              <img src="@/static/images/swaparrow.png" alt="">
            </div>
            <!-- <div class="maxtext" @click="onMax(1)">
              <span>MAX</span>
            </div> -->
            <div class="rinput-box">
              <input type="number" class="rinput" placeholder="0" min="0" disabled
                v-model="selectValues[1]" />
            </div>
          </div>
        </div>
        <div class="sw-btn">
          <el-button type="primary" round class="themebtn-token" v-if="!isAuth"
            :disabled="!selectTokens[0].addr" :loading="authLoading"
            @click="onAuthContract(selectTokens[0].addr)">{{ $t('authorize') }}</el-button>
          <el-button type="primary" round class="themebtn-token"
            :disabled="!selectTokens[1].addr || !selectValues[0]" :loading="subLoading"
            @click="onExchangeToken">Exchange Token</el-button>
        </div>
      </div>
    </div>
    <div class="lp-swap-bottombox">
      <div class="sw-title">
        <img src="@/static/images/swapico3.png" />
        <span>Cumulative Total Burned Tokens</span>
      </div>
      <div class="sw-formcell">
        <div class="sw-cell">
          <div class="sw-input">
            <div class="leftarrow">
              <span>IPP</span>
              <img src="@/static/images/swaparrow.png" alt="">
            </div>
            <div class="rinput-box">
              <input type="number" class="rinput" placeholder="0" min="0"
                disabled v-model="blackAmount" />
            </div>
          </div>
        </div>
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
export default {
  name: 'lpSwap',
  data () {
    return {
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
      isAuth: false,
      blackAmount: 0
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
        if (this.selectTokens[0].addr) {
          this.queryAllowance(this.selectTokens[0].addr)
          .then((authAmount) => {
            this.isAuth = !!authAmount
          })
        }
      }
    }
  },
  methods: {
    async queryBurnedBalance () {
      const { methods } = await this.$store.dispatch('contract/common', {
        address: this.selectTokens[0].addr
      });
      const { decNum } = await this.$store.dispatch('contract/queyrSymbol', this.selectTokens[0].addr)
      methods.balanceOf('0x000000000000000000000000000000000000dEaD').call((err, res) => {
        if (!err) {
          this.blackAmount = (res/Math.pow(10,decNum)).toFixed(8)
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
    async queryPairInfo () {
      const { methods } = await this.$store.dispatch('contract/event', 'LPSwap');
      methods.myReward(this.selectTokens[0].addr).call((err, pairAddr) => {
        if (!err) {
          if (pairAddr == 0) {
            this.$alert(
              '代币未添加挖矿LP',
              'Tips', 
              {
                type: 'warning'
            })
          } else {
            this.queryAllCoinbase(pairAddr)
            .then((tokenInfo) => {
              this.selectTokens[1] = tokenInfo;
            })
          }
        }
      })
    },
    onSelectToken (token) {
      this.selectTokens[this.nowIndex] = token;
      this.selectValues[this.nowIndex] = '';
      this.queryAllowance(token.addr)
      .then((authAmount) => {
        this.isAuth = !!authAmount
      })
      this.queryPairInfo();
      this.queryBurnedBalance();
      this.nowIndex = -1;
      this.showSelectToken = false;
    },
    onMax (index) {
      this.selectValues[index] = this.selectTokens[index].balance || '';
    },
    async onExchangeToken () {
      const { methods } = await this.$store.dispatch('contract/event', 'LPSwap');
      const addr1 = this.selectTokens[0].addr;
      const addr2 = this.selectTokens[1].addr;
      const { decUnit } = await this.$store.dispatch('contract/queyrSymbol', addr1)
      const sellNum = web3.utils.toWei(String(this.selectValues[0]), decUnit);
      this.subLoading = true;
      methods.sell(addr1, addr2, sellNum).send((err, txHash) => {
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
</style>