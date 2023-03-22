<template>
  <div class="page-header">
    <div class="fixed-header">
      <div class="coinname-assets">
        <el-carousel height="30px" direction="vertical" :autoplay="false" indicator-position="none">
          <el-carousel-item v-for="(item, index) in assetslists" :key="index">
            <div class="cinlistbox">
              <div class="medium"
                v-for="info in item" :key="info.symbol">
                <img :src="`https://assets.coincap.io/assets/icons/${info.symbol.toLocaleLowerCase()}@2x.png`" class="cnameico" />
                <span>{{ info.symbol }}</span>
                <span>${{ Number(info.priceUsd).toFixed(2) }}</span>
                <strong
                  :style="{
                    color: info.changePercent24Hr>=0 ? '#21f1c7' : 'red'
                  }"
                  >{{ Number(info.changePercent24Hr).toFixed(2) }}%</strong>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="container">
        <div class="left-navbar">
          <div class="menubtn" @click="showMobileNavbar = true"><i class="el-icon-s-grid"></i></div>
          <div class="logo">
            <img src="~/static/images/logo.png" class="img" />
          </div>
          <ul class="navbar-list" v-if="showMobileNavbar||maxWidthNavbar">
            <li v-for="(item, index) in navbarList" :key="index">
              <nuxt-link v-if="!item.path.startsWith('http')" :to="localePath(item.path)" class="n-ain">{{ item.name }}</nuxt-link>
              <a v-else :href="item.path" target="_blank" class="n-ain">{{ item.name }}</a>
            </li>
          </ul>
          <!-- 移动端导航 -->
          <el-drawer
            title="SellToken"
            :visible.sync="showMobileNavbar"
            direction="ttb"
            size="118px"
            custom-class="noneshadow">
          </el-drawer>
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
                :key="index"
                :command="locale.code"
                :divided="!!index">
                <nuxt-link
                  tag="div"
                  :to="switchLocalePath(locale.code)"
                  class="local-item">
                  <!-- <img :src="require(`~/static/images/${locale.code}.png`)" alt=""> -->
                  <img src="~/static/images/lico.png" alt="" style="opacity: 0.8">
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
          <div class="wallet-address" v-if="walletAddress"
            @click="showWalletAddress = true">
            <img src="~/static/images/walletico.png" alt="" class="walletico" v-if="!chainLoading">
            <i class="el-icon-loading loadingico" v-else></i>
            <span>{{ walletAddress.substr(0,3) }}...{{ walletAddress.substr(-4) }}</span>
            <img src="~/static/images/arrow-down-white.png" alt="" class="arrowico">
          </div>
          <div class="wallet-address" v-else @click="onConnectWallet">
            <span>{{ $t('PageHeader.connect') }}</span>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="showDrawerWallet"
      width="320px" custom-class="dialog-sucbox">
      <div class="drawer-title" slot="title">
        <p v-if="oldChainStatus">{{  $t('PageHeader.Confirm')  }}</p>
        <p v-else>{{ $t('PageHeader.NoTransactions') }}</p>
      </div>
      <div class="drawer-content">
        <el-result :title="$t('PageHeader.TransactionSubmitted')"
          v-if="txChainHash || oldChainStatus">
          <div class="" slot="icon">
            <img src="~/static/images/upico.png" alt="" class="sucico"
              v-if="(txChainHash && !oldChainStatus)">
            <img src="~/static/images/success.png" alt="" class="sucico"
              v-else-if="oldChainStatus.status">
            <img src="~/static/images/fail.png" alt="" class="sucico"
              v-else>
          </div>
          <div slot="subTitle">
            <a :href="`https://bscscan.com/tx/${txChainHash||oldChainStatus.transactionHash}`" target="_blank" class="ain-view"
              >{{ $t('PageHeader.ViewOnBscScan') }}</a>
          </div>
          <template slot="extra">
            <el-button type="primary" class="themebtn" @click="showDrawerWallet = false">
            {{ $t('PageHeader.Close') }}
            </el-button>
          </template>
        </el-result>
        <el-empty :description="$t('PageHeader.NoTransactions')" v-else></el-empty>
      </div>
    </el-dialog>
    <!-- 钱包地址 -->
    <el-dialog
      :visible.sync="showWalletAddress"
      width="320px" custom-class="dialog-sucbox">
      <div class="drawer-title" slot="title">
        <p @click="onCopyText(walletAddress)">
          {{  walletAddress.substr(0, 6) + '...' + walletAddress.substr(-6)  }}
          <img src="~/static/images/copyico.png" class="copyico" />
        </p>
      </div>
      <div class="drawer-content">
        <el-result :title="$t('new01.text9')"
          v-if="txChainHash || oldChainStatus">
          <div class="" slot="icon">
            <img src="~/static/images/success.png" alt="" class="sucico">
          </div>
          <div slot="subTitle">
            <a href="javascript:;" class="ain-view" @click="onLookRecord"
              >{{ $t('new01.text10') }}</a>
          </div>
          <template slot="extra">
            <el-button type="primary" class="themebtn" @click="onClearWalletAddress">
              {{ $t('new01.text1') }}
            </el-button>
          </template>
        </el-result>
        <el-empty :description="$t('PageHeader.NoTransactions')" v-else></el-empty>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  data () {
    return {
      showDrawerWallet: false,
      hashTimer: null,
      showMobileNavbar: false,
      maxWidthNavbar: false,
      showWalletAddress: false,
      assetslists: []
    }
  },
  computed: {
    navbarList () {
      return [
        {
          name: this.$t('PageHeader.Home'),
          path: '/'
        },
        {
          name: this.$t('PageHeader.Whitepaper'),
          path: 'https://selltoken.org/Whitepaper.pdf'
        },
        {
          name: this.$t('PageHeader.Miner'),
          path: '/miner'
        },
        {
          name: this.$t('PageHeader.Liquidity'),
          path: '/liquidity'
        },
        {
          name: this.$t('PageHeader.CertiK'),
          path: 'https://www.certik.com/projects/selltoken'
        },
        {
          name: this.$t('PageHeader.GitHup'),
          path: 'https://github.com/sellToken'
        }
      ]
    },
    oldChainStatus () {
      return this.$store.state.contract.oldChainStatus;
    },
    txChainHash () {
      return this.$store.state.contract.txHash;
    },
    chainLoading () {
      return this.$store.state.contract.chainLoading;
    },
    walletAddress () {
      return this.$store.state.wallet.walletAddress;
    }
  },
  watch: {
    $route () {
      this.showMobileNavbar = false;
    },
    txChainHash () {
      if (this.txChainHash && this.txChainHash.length == 66) {
        this.showDrawerWallet = true;
        this.$store.dispatch('contract/queryTxHashStatus')
        this.startHash()
      }
    }
  },
  created () {
    this.onConnectWallet()
    this.getCoinbaseLists()
  },
  mounted () {
    this.maxWidthNavbar = window.innerWidth > 750
  },
  methods: {
    getCoinbaseLists () {
      this.$axios.get('https://api.coincap.io/v2/assets?limit=20')
      .then(({ data }) => {
        this.assetslists = [];
        let len = Math.ceil(data.data.length/4);
        for (let i = 0; i < len; i ++) {
          let items = data.data.splice(0, 4);
          this.assetslists.push(items);
        }
        console.log(this.assetslists)
      })
    },
    onClearWalletAddress () {
      this.$store.commit('wallet/writeWalletAddress', '')
      this.showWalletAddress = false;
    },
    onLookRecord () {
      this.showWalletAddress = false;
      this.showDrawerWallet = true;
    },
    startHash () {
      clearInterval(this.hashTimer);
      this.hashTimer = setInterval(() => {
        if (!this.txChainHash) {
          clearInterval(this.hashTimer);
        } else {
          this.$store.dispatch('contract/queryTxHashStatus')
        }
      }, 8000)
    },
    onCopyText (text) {
      this.$copyText(text).then((e) => {
        this.$message.success('Copy succeeded')
      }, () => {
        this.$message.success('Copy failed')
      })
    },
    async onConnectWallet () {
      const walletAddress = await this.$store.dispatch('wallet/linkWallet')
      console.log('钱包已连接：', walletAddress)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-header {
  height: 118px;
}
.fixed-header {
  background-color: #fff;
  box-shadow: 0px 3px 16px rgba(26, 36, 57, 0.1);
  box-sizing: border-box;
  height: 118px;
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
    .menubtn {
      color: #999;
      font-size: 24px;
      display: none;
    }
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
      z-index: 10;
      @include flexBox;
      .n-ain {
        padding: 10px 12px;
        color: #888;
        transition: all 0.3s;
        font-size: 15px;
        &:hover,
        &.nuxt-link-exact-active {
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
      min-width: 110px;
      @include flexBox;
      .walletico {
        width: 20px;
        height: 20px;
        object-fit: contain;
        margin-right: 10px;
        position: relative;
        top: -1px;
      }
      .loadingico {
        margin-right: 10px;
        color: #fff;
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
  white-space: nowrap;
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
.drawer-title {
  position: relative;
  @include flexBox(flex-start);
  .ticopybtn {
    width: 20px;
    height: 30px;
    object-fit: contain;
    margin-left: 10px;
  }
}
.drawer-content {
  border: 1px solid #eee;
  border-radius: 10px;
  .ain-view {
    color: #32aa77;
    text-decoration: underline;
  }
}
.coinname-assets {
  background: linear-gradient(to right, #376bf3, #5947fa, #9b3dc1, #fb7f16);
  .cinlistbox {
    padding: 0 30px;
    color: #ffffff;
    font-size: 14px;
    @include flexBox(flex-start);
    .medium {
      margin-right: 30px;
      height: 30px;
      @include flexBox(flex-start);
      .cnameico {
        width: 20px;
        height: 20px;
        margin-right: 4px;
      }
      span {
        margin-right: 4px;
      }
      strong {
        margin-left: 6px;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .fixed-header {
    z-index: 3000;
    .menubtn {
      display: block !important;
    }
    .container {
      padding: 0 10px;
      height: 100%;
    }
    .right-wallet {
      flex-direction: column;
      align-items: flex-end;
      .lang-switch {
        top: 0;
        margin-right: 100px;
      }
      .wallet-address {
        padding: 4px 10px;
        margin-top: 10px;
        &:active {
          top: 0;
        }
      }
      .chain-link {
        position: absolute;
        margin: 0;
        right: 2px;
        top: -34px !important;
        z-index: 10;
        span {
          display: none;
        }
      }
    }
    .navbar-list {
      position: fixed;
      left: 0;
      top: 118px;
      width: 100%;
      background: #fff;
      z-index: 10000 !important;
      flex-direction: column;
      box-sizing: border-box;
      padding: 20px;
      opacity: 1;
      transition: opacity 1s linear 0s;
      li {
        width: 100%;
        a {
          width: 100%;
          display: block;
        }
      }
    }
  }
}
.copyico {
  width: 20px; 
  height: 20px;
  position: relative;
  top: -1px;
}
</style>