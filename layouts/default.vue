<template>
  <div class="main-content">
    <header><page-header /></header>
    <main>
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
      
    }
  },
  mounted () {
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
  }
}
</script>

<style lang="scss">
@import '~assets/common.scss';
</style>