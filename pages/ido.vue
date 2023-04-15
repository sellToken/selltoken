<template>
  <div class="page-ido">
    <!-- 背景 -->
    <video muted loop class="video-bg" autoplay playsinline>
      <source src="/videos/IMG_6322228.MP4" type="video/mp4" />
    </video>
    <!-- 顶部 -->
    <div class="ido-content">
      <div class="container">
        <!-- 空投 -->
        <div class="ido-pool" v-loading="infoLoading">
          <h2>{{ $t('new07.text8') }}</h2>
          <div class="ido-text">
            <p>
              {{ $t('new07.text1') }} <span class="ml10">{{ airdropInfo[0] }}</span>
              <img src="~/static/images/TRDT.png" class="unitico" />
            </p>
            <p>
              {{ $t('new07.text10') }} <span class="ml10">{{ airdropInfo[1] }}</span>
              <img src="~/static/images/TRDT.png" class="unitico" />
            </p>
            <p>
              {{ $t('new07.text3') }} <span class="ml10">{{ airdropInfo[4] }}</span>
              <img src="~/static/images/TRDT.png" class="unitico" />
            </p>
            <p>
              {{ $t('new07.text4') }} <span class="ml10">{{ airdropInfo[3] }} {{ $t('new07.text11') }}</span>
            </p>
            <p>
              {{ $t('new07.text5') }} <span class="ml10 textcolor">{{ airdropInfo[2] }}</span>
            </p>
          </div>
          <div class="idobtn">
            <el-button 
              class="themebtn" :disabled="isNotReleaseTime2" :loading="idoLoading"
              @click="onAirdrop">{{ $t('new07.text3') }}</el-button>
          </div>
          <div class="otips">
            <p>
              {{ $t('new07.text6') }}: <br>
              <span>{{ $t('new07.text12') }}</span>
            </p>
          </div>
        </div>
        <!-- IDO -->
        <div class="ido-pool" v-loading="infoLoading">
          <h2>{{ $t('new07.text9') }}</h2>
          <div class="ido-text">
            <p>
              {{ $t('new07.text1') }} <span class="ml10">{{ idoInfo[0] }}</span>
              <img src="~/static/images/TRDT.png" class="unitico" />
            </p>
            <p>
              {{ $t('new07.text2') }} <span class="ml10">{{ idoInfo[1] }}</span>
              <img src="~/static/images/TRDT.png" class="unitico" />
            </p>
            <p>
              {{ $t('new07.text3') }} <span class="ml10">{{ idoInfo[4] }}</span>
              <img src="~/static/images/TRDT.png" class="unitico" />
            </p>
            <p>
              {{ $t('new07.text4') }} <span class="ml10">{{ idoInfo[3] }} {{ $t('PageHome.text17') }}</span>
            </p>
            <p>
              {{ $t('new07.text5') }} <span class="ml10 textcolor">{{ idoInfo[2] }}</span>
            </p>
          </div>
          <div class="idobtn">
            <el-button 
              class="themebtn" :disabled="isNotReleaseTime" :loading="idoLoading"
              @click="onRelease">{{ $t('new07.text3') }}</el-button>
          </div>
          <div class="otips">
            <p>
              {{ $t('new07.text6') }}: <br>
              <span>{{ $t('new07.text7') }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IDOPage',
  data () {
    return {
      idoInfo: {},
      isNotReleaseTime: true,
      idoLoading: false,
      infoLoading: true,
      airdropInfo: {},
      isNotReleaseTime2: false
    }
  },
  computed: {
    walletAddress () {
      return this.$store.state.wallet.walletAddress;
    },
    nowChainName () {
      return this.$store.state.wallet.nowChainName;
    }
  },
  created () {
    this.getInfoIDO()
    this.getInfoAirdrop()
  },
  mounted () {

  },
  methods: {
    async onAirdrop () {
      const { methods } = await this.$store.dispatch('contract/event', 'Airdrop');
      this.idoLoading = true;
      methods.claim().send((err, txHash) => {
        this.idoLoading = false;
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    async onRelease () {
      const { methods } = await this.$store.dispatch('contract/event', 'STOCK');
      this.idoLoading = true;
      methods.claim().send((err, txHash) => {
        this.idoLoading = false;
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    async getInfoAirdrop () {
      const { methods } = await this.$store.dispatch('contract/event', 'Airdrop');
      methods.getUser(this.walletAddress).call((err, res) => {
        this.infoLoading = false;
        if (!err) {
          this.airdropInfo = {
            0: (res[0]/Math.pow(10, 18)).toFixed(4),
            1: (res[1]/Math.pow(10, 18)).toFixed(4),
            2: new Date(Number(res[2]+'000')).toLocaleString(),
            3: res[3],
            4: (res[4]/Math.pow(10, 18)).toFixed(4)
          }
          this.isNotReleaseTime2 = Date.now() < Number(res[2]+'000');
        }
      })
    },
    async getInfoIDO () {
      const { methods } = await this.$store.dispatch('contract/event', 'STOCK');
      methods.getUser(this.walletAddress).call((err, res) => {
        this.infoLoading = false;
        if (!err) {
          this.idoInfo = {
            0: (res[0]/Math.pow(10, 18)).toFixed(4),
            1: (res[1]/Math.pow(10, 18)).toFixed(4),
            2: new Date(Number(res[2]+'000')).toLocaleString(),
            3: res[3],
            4: (res[4]/Math.pow(10, 18)).toFixed(4)
          }
          this.isNotReleaseTime = Date.now() < Number(res[2]+'000');
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/pages/ido.scss';

</style>