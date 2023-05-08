<template>
  <div class="page-community">
    <div class="top-navbarlist">
      <nuxt-link to="/lpMiner" class="aintext">LP mining income</nuxt-link>
      <nuxt-link to="/lpSwap" class="aintext">Swap</nuxt-link>
      <nuxt-link to="/community" class="aintext active">Community mining income</nuxt-link>
      <nuxt-link to="/launch" class="aintext">{{ $t('new08.text1') }}</nuxt-link>
    </div>
    <div class="container">
      <div class="top-title">
        <h2>{{ $t('new08.text21') }}</h2>
        <p>{{ $t('new08.text22') }}</p>
      </div>
      <div class="community-box">
        <div class="sw-title">
          <img src="@/static/images/comico1.png" />
          <span>{{ $t('new08.text23') }}</span>
        </div>
        <div class="invite-celllink">
          <input class="invite-input" disabled placeholder="No invitation address" v-model="inviteLink" />
          <el-button class="invite-btn"
            @click="onCopyText(inviteLink)">{{ $t('new08.text24') }}</el-button>
        </div>
        <div style="margin-top: -20px;">
          <el-alert type="error" :title="$t('new08.text25')" :closable="false"></el-alert>
        </div>
        <div class="sw-title">
          <img src="@/static/images/comico2.png" />
          <span>{{ $t('new08.text26') }}</span>
          <div class="select-token" @click="showSelectToken = true">
            <img :src="coinbaseIcos[selectTokenInfo.name]||require('~/static/images/defaultico.png')" class="coinico" />
            <span>{{ selectTokenInfo.name || 'Select Token' }}</span>
            <img src="@/static/images/swaparrow.png" />
          </div>
        </div>
        <div class="intable-list">
          <div class="intable-cell thin">
            <div class="tditem">
              <span>{{ $t('new08.text27') }}</span>
            </div>
            <div class="tditem">
              <span>{{ $t('new08.text29') }}</span>
            </div>
            <div class="tditem">
              <span>{{ $t('new08.text28') }}</span>
            </div>
          </div>
          <div class="intable-cell" v-for="(item, index) in infoList" :key="index">
            <div class="tditem">
              <span>{{ item[0] }}</span>
            </div>
            <div class="tditem">
              <span>{{ item[2] }}</span>
            </div>
            <div class="tditem">
              <span>{{ item[1] }}</span>
            </div>
          </div>
          <div class="intable-empty" v-if="!infoList.length">
            <el-empty></el-empty>
          </div>
        </div>
      </div>
      <div class="community-tips">
        <div class="linktextbox">
          <h3>{{ $t('new08.text30') }}</h3>
          <p>
            {{ $t('new08.text31') }}
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
    },
    inviteAddress () {
      return this.$store.state.wallet.inviteAddress || '0x2F98Fa813Ced7Aa9Fd6788aB624b2F3F292B9239';
    },
    inviteLink () {
      return process.browser ? globalThis.location.origin + '/lpMiner?addr=' + this.walletAddress : '';
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