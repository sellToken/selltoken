<template>
  <div class="page-community">
    <div class="container">
      <div class="top-title">
        <h2>My community</h2>
        <p>You can bind the invitation relationship here, or you can copy the invitation link to invite your friends to join. When you and your friends have new currency holdings every day, you can get promotion rewards.</p>
      </div>
      <div class="community-box">
        <div class="sw-title">
          <img src="@/static/images/comico1.png" />
          <span>My inviter's address</span>
        </div>
        <div class="invite-celllink">
          <input class="invite-input" disabled placeholder="No invitation address" />
          <el-button class="invite-btn" disabled
            @click="onCopyText()">Copy Link</el-button>
        </div>
        <div class="sw-title">
          <img src="@/static/images/comico2.png" />
          <span>Invite data directly</span>
          <div class="select-token" @click="showSelectToken = true">
            <img :src="coinbaseIcos[selectTokenInfo.name]||require('~/static/images/defaultico.png')" class="coinico" />
            <span>{{ selectTokenInfo.name || 'Select Token' }}</span>
            <img src="@/static/images/swaparrow.png" />
          </div>
        </div>
        <div class="intable-list">
          <div class="intable-cell thin">
            <div class="tditem">
              <span>地址</span>
            </div>
            <div class="tditem">
              <span>LP挖矿</span>
            </div>
            <div class="tditem">
              <span>佣金</span>
            </div>
          </div>
          <div class="intable-cell" v-for="(item, index) in infoList" :key="index">
            <div class="tditem">
              <span>{{ item[0] }}</span>
            </div>
            <div class="tditem">
              <span>{{ item[1] }}</span>
            </div>
            <div class="tditem">
              <span>{{ item[2] }}</span>
            </div>
          </div>
          <div class="intable-empty" v-if="!infoList.length">
            <el-empty></el-empty>
          </div>
        </div>
      </div>
      <div class="community-tips">
        <div class="linktextbox">
          <h3>提示：</h3>
          <p>
            本网体关系终身享受平台所有项目方创建挖矿项目的自动返佣，每个项目都需要挖矿100USDT以上，否则返佣烧伤，当用户挖矿收入卖出代币的50％进行网体奖励，总计10代，30%，15%，15%，10%，10%，4%，4%，4%，4%，4%，层级不足10代自动沉淀矿池，上级地址挖矿小于100USDT，会被烧伤。
          </p>
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
  name: 'community',
  data () {
    return {
      showSelectToken: false,
      selectTokenInfo: {},
      infoList: []
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
  methods: {
    onCopyText (text) {
      this.$copyText(text).then((e) => {
        this.$message.success(this.$t('copySuccess'))
      }, () => {
        this.$message.success(this.$t('copyFail'))
      })
    },
    async queryAddList () {
      const address = this.selectTokenInfo.addr;
      const { methods } = await this.$store.dispatch('contract/event', 'LPSwap');
      const { decNum } = await this.$store.dispatch('contract/queyrSymbol', address);
      methods.getAddr(address, this.walletAddress).call((err, res) => {
        console.log(res)
        if (!err) {
          this.infoList = res[0].map((item, index) => {
            return {
              0: res[0][index],
              1: (res[1][index]/Math.pow(10,decNum)).toFixed(4),
              2: (res[2][index]/Math.pow(10,decNum)).toFixed(4),
            }
          })
        }
      })
    },
    onSelectToken (token) {
      this.selectTokenInfo = token;
      this.showSelectToken = false;
      this.queryAddList()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/pages/community.scss';

</style>