<template>
  <div class="main-content">
    <header><page-header /></header>
    <main>
      <div class="box-loading" v-if="loading">
        <i class="el-icon-loading"></i>
      </div>
      <nuxt />
    </main>
    <footer><page-footer /></footer>
  </div>
</template>

<script>
export default {
  name: 'defaultLayout',
  data () {
    return {
      loading: true
    }
  },
  computed: {
    chainIds () {
      return this.$store.state.wallet.chainIds;
    }
  },
  mounted () {
    this.initChainLink();
    const txHash = localStorage.getItem('txHash');
    const oldInfo = localStorage.getItem('oldInfo');
    if (txHash) {
      this.$store.commit('contract/changeLoading', true)
      this.$store.commit('contract/saveChainHash', txHash)
    }
    try {
      this.$store.commit('contract/saveOldInfo', oldInfo ? JSON.parse(oldInfo) : '')
    } catch (error) {
      
    }
  },
  methods: {
    async initChainLink () { // 初始化判断网络
      const nowId = await web3.eth.getChainId();
      for (let k in this.chainIds) {
        let item = this.chainIds[k];
        if (item.id == nowId) {
          this.$store.commit('wallet/changeChain', k);
          break;
        }
      }
      this.loading = false;
      // 监听账号切换
      ethereum.on('accountsChanged', () => {
        this.$message.success('Account switched');
        setTimeout(() => {
          location.reload();
        }, 100)
      });
      // 监听网络切换
      ethereum.on('chainChanged', () => {
        this.$message.success('Network switched');
        setTimeout(() => {
          location.reload();
        }, 100)
      });
    }
  }
}
</script>

<style lang="scss">
@import '~assets/common.scss';
</style>