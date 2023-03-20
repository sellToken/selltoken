<template>
  <div class="page-liquidity">
    <div class="">
      <video muted="" loop="" class="linebg" autoplay="" playsinline="" poster="https://selltoken.org/images/ankr_bg-321d14aebd4c1056eb778965d5785767.jpg">
        <source src="/videos/line-bg.mp4" type="video/webm">
        <source src="/videos/line-bg.mp4" type="video/mp4">
      </video>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LiquiditysPage',
  created () {
    console.log(this.$route)
  }
}
</script>

<style lang="scss" scoped>
.page-liquidity {
  min-height: 600px;
}
.linebg {
  top: -72px;
  left: 0;
  width: 100%;
  height: 580px;
  z-index: 1;
  position: absolute;
  object-fit: cover;
}
</style>