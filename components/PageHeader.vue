<template>
  <div class="page-header">
    <div class="fixed-header">
      <div class="container">
        <div class="left-navbar">
          <div class="logo">
            <img src="~/static/images/logo.png" class="img" />
          </div>
          <ul class="navbar-list">
            <li v-for="(item, index) in navbarList" :key="index">
              <nuxt-link v-if="!item.path.startsWith('http')" :to="item.path" class="n-ain">{{ item.name }}</nuxt-link>
              <a v-else :href="item.path" target="_blank" class="n-ain">{{ item.name }}</a>
            </li>
          </ul>
        </div>
        <div class="right-wallet">
          <!-- lang switch -->
          <el-dropdown trigger="click" placement="bottom-start">
            <div class="lang-switch">
              <img src="~/static/images/langico.png" alt="" class="langico">
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(locale, index) in $i18n.locales"
                :key="locale.code"
                :command="locale.code"
                :divided="!!index">
                <nuxt-link
                  tag="div"
                  :to="switchLocalePath(locale.code)"
                  class="local-item">
                  <img :src="require(`~/static/images/${locale.code}.png`)" alt="">
                  <span>{{ locale.name }}</span>
                </nuxt-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- chain link -->
          <el-dropdown trigger="click" placement="bottom-start">
            <div class="chain-link">
              <img src="~/static/images/bnb_link.png" alt="" class="chainlinkico">
              <span>BNB Chain</span>
              <img src="~/static/images/arrow-down.png" alt="" class="arrowico">
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="BNB">
                <div class="chainlink-cell">
                  <img src="~/static/images/bnb_link.png" alt="" class="linkico">
                  <span>BNB Smart Chain</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item command="ETH" disabled divided>
                <div class="chainlink-cell">
                  <img src="~/static/images/eth_link.png" alt="" class="linkico">
                  <span>Ethereum (Not open)</span>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- wallet -->
          <div class="wallet-address">
            <img src="~/static/images/walletico.png" alt="" class="walletico">
            <span>0x...88dd</span>
            <img src="~/static/images/arrow-down-white.png" alt="" class="arrowico">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  data () {
    return {
      navbarList: [
        {
          name: 'Home',
          path: '/'
        },
        {
          name: 'Whitepaper',
          path: 'https://selltoken.org/Whitepaper.pdf'
        },
        {
          name: 'Insert',
          path: '/insert'
        },
        {
          name: 'Liquidity',
          path: '/liquidity'
        }
      ]
    }
  },
  created () {
    console.log(this.$i18n.locales)
  }
}
</script>

<style lang="scss" scoped>
.page-header {
  height: 88px;
}
.fixed-header {
  background-color: #fff;
  box-shadow: 0px 3px 16px rgba(26, 36, 57, 0.1);
  box-sizing: border-box;
  height: 88px;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  .container {
    padding: 18px 20px;
    @include flexBox(space-between);
  }
  .left-navbar {
    position: relative;
    @include flexBox(space-between);
    .logo {
      width: 134px;
      height: 52px;
      @include flexBox;
      .img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .navbar-list {
      padding-left: 20px;
      @include flexBox;
      .n-ain {
        padding: 10px 12px;
        color: #888;
        transition: all 0.3s;
        font-size: 15px;
        &:hover,
        &.nuxt-link-active {
          color: #356DF3;
        }
      }
    }
  }
  .right-wallet {
    flex: 1;
    @include flexBox(flex-end);
    .arrowico {
      width: 16px;
      margin-left: 4px;
      position: relative;
    }
    .lang-switch {
      margin-right: 20px;
      position: relative;
      height: 32px;
      width: 32px;
      border-radius: 10px;
      transition: all 0.3s;
      cursor: pointer;
      top: 2px;
      @include flexBox;
      .langico {
        width: 20px;
        height: 20px;
      }
      &:hover {
        background-color: #eee;
      }
      &:active {
        top: 4px;
      }
    }
    .chain-link {
      padding: 6px 12px;
      background-color: #ffffff;
      border-radius: 50px;
      cursor: pointer;
      box-shadow: 1px 1px 1px rgba($color: #000000, $alpha: 0.3);
      position: relative;
      margin-right: 20px;
      transition: all 0.3s;
      @include flexBox;
      .chainlinkico {
        width: 20px;
        height: 20px;
        object-fit: contain;
        margin-right: 10px;
        position: relative;
      }
      span {
        font-size: 14px;
        color: #333333;
        line-height: 20px;
      }
      &:hover {
        background-color: #eee;
      }
      &:active {
        top: 2px;
      }
    }
    .wallet-address {
      padding: 6px 12px;
      background-color: #2E343C;
      border-radius: 50px;
      cursor: pointer;
      box-shadow: 1px 1px 1px rgba($color: #000000, $alpha: 0.3);
      position: relative;
      @include flexBox;
      .walletico {
        width: 20px;
        height: 20px;
        object-fit: contain;
        margin-right: 10px;
        position: relative;
        top: -1px;
      }
      span {
        font-size: 14px;
        color: #ffffff;
        line-height: 20px;
      }
      &:active {
        background-color: #222;
        top: 2px;
      }
    }
  }
}
.chainlink-cell {
  @include flexBox(flex-start, center);
  .linkico {
    width: 20px;
    height: 20px;
    object-fit: contain;
    margin-right: 10px;
  }
}
.local-item {
  @include flexBox(flex-start, center);
  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
    margin-right: 10px;
  }
}
</style>