<template>
  <div class="page-lpincome">
    <div class="top-navbarlist">
      <nuxt-link to="/lpIncome" class="aintext active">LP mining income</nuxt-link>
      <nuxt-link to="/community" class="aintext">Community mining income</nuxt-link>
    </div>
    <div class="container">
      <div class="top-title">
        <h2>LP mining income</h2>
        <p>After the funds are invested, the contract will be automatically injected into the liquidity pool to obtain LP computing power. The LP computing power comes from the Nth power of the total amount of invested funds * coefficient. N represents the number of days the mining pool was created. The same investment amount, the later the LP computing power is obtained bigger.</p>
      </div>
      <div class="community-box">
        <div class="sw-title">
          <img src="@/static/images/linkico.png" class="lkico" />
          <span class="wxtext">Select Tokens</span>
          <div class="right-tokens">
            <div class="select-token" @click="showSelectToken = true" style="margin-left: 0">
              <img :src="coinbaseIcos[selectTokenInfo.name]||require('~/static/images/defaultico.png')" class="coinico" />
              <span>{{ selectTokenInfo.name || 'Select Token' }}</span>
              <img src="@/static/images/swaparrow.png" />
            </div>
            <div class="lpincome-pair">
              <div class="stbico" :class="{active: stbIndex == 0}" @click="onTab(0)">
                <img src="@/static/images/SELLC.png" class="ico" />
                <p class="stspan">SELLC</p>
              </div>
              <div class="stbico" :class="{active: stbIndex == 1}" @click="onTab(1)">
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
                  <h5>LP总算力</h5>
                  <p>{{ infos[6] || '-' }}</p>
                </div>
                <div class="c-item">
                  <h5>LP累计收益</h5>
                  <p>{{ infos[0] || '-' }}</p>
                </div>
              </div>
              <div class="cell-incomeinfo">
                <div class="c-item">
                  <h5>个人LP算力</h5>
                  <p>{{ infos[5] || '-' }}</p>
                </div>
                <div class="c-item">
                  <h5>每日收益</h5>
                  <p>{{ infos[2] || '-' }}</p>
                </div>
              </div>
              <div class="cell-incomeinfo">
                <div class="c-item">
                  <h5>挖矿时间</h5>
                  <p>{{ infos[1] || '-' }}</p>
                </div>
                <div class="c-item">
                  <h5>每秒收益</h5>
                  <p>{{ infos[3] || '-' }}</p>
                </div>
              </div>
              <div class="cell-incomeinfo">
                <div class="c-item"
                  style="background: linear-gradient(to right, #9588ed, #fcb273)">
                  <h5>佣金收益</h5>
                  <p>{{ infos[4] || '-' }}</p>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <div class="right-income">
                <h2>投入币种</h2>
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
                  <el-input-number :controls="false" placeholder="请输入数量"
                    :disabled="trIndex == 0" :precision="4"
                    v-model="writeNumber" :min="100"></el-input-number>
                </div>
                <div>

                </div>
                <div class="sbtn-cell">
                  <el-button type="primary" class="themebtn-token-plain" plain round
                    :disabled="!infos[4] || infos[4]<=0" 
                    :loading="subLoading" 
                    @click="onWithdraw">取款</el-button>
                  <el-button type="primary" class="themebtn-token" round
                    :loading="subLoading"
                    :disabled="!selectTokenInfo.addr"
                    @click="onSubStake">stake</el-button>
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
      showSelectToken: false,
      selectTokenInfo: {},
      stbIndex: 0,
      stbTokens: [SELLC_ADDRESS, USDT_ADDRESS],
      trIndex: 0,
      infos: {},
      subLoading: false,
      writeNumber: 100
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
  created () {
    this.querySellcNumber()
  },
  methods: {
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
      }
      if (index == 0) {
        this.querySellcNumber()
      } else {
        this.writeNumber = 100
      }
    },
    onTab (index) {
      this.stbIndex = index;
      if (index == 1) {
        this.trIndex = index;
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
        console.log(res)
        if (!err) {
          this.infos = {
            0: (res[0]/Math.pow(10,decNum)).toFixed(8),
            1: res[1],
            2: (res[2]/Math.pow(10,decNum)).toFixed(8),
            3: (res[3]/Math.pow(10,decNum)).toFixed(8),
            4: (res[4]/Math.pow(10,decNum)).toFixed(8),
            5: res[5],
            6: res[6],
          }
        }
      })
    },
    onSelectToken (token) {
      this.selectTokenInfo = token;
      this.showSelectToken = false;
      this.queryInfos()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/pages/lpIncome.scss';

</style>