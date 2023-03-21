<template>
  <div class="page-liquidity">
    <div class="topliquidity-content">
      <video muted loop class="linebg" autoplay playsinline>
        <source src="/videos/line-bg.mp4" type="video/webm">
        <source src="/videos/line-bg.mp4" type="video/mp4">
      </video>
      <div class="container">
        <div class="qui-box">
          <div class="qui-item">
            <auto-search :defaultAddress="defaultAddress" size="small" @select="onSelectCoinbase1"></auto-search>
            <div class="tabs-list">
              <div class="tabs-item" 
                :class="{active: tabCurrent == item}"
                v-for="(item, index) in tabList" :key="index"
                @click="onSelectTabCurrent(item)">
                <span class="text">{{ item }} {{ $t('PageHome.text17') }}</span>
              </div>
            </div>
            <!-- 输入代币 -->
            <div class="write-amount">
              <el-input-number 
                v-model="amountNumber1" controls-position="right" 
                :min="0.1" :step="0.1" @change="onChangeNumber(1)">
              </el-input-number>
              <div class="amount-unit">
                <img v-if="selectInfo1" :src="coinbaseIcos[selectInfo1.name]||require('~/static/images/defaultico.png')" alt="" class="unitico">
                <!-- <span>{{ selectInfo1 ? selectInfo1.name : 'Select' }}</span> -->
              </div>
            </div>
            <div class="inbtn-box">
              <el-button type="primary" :disabled="!amountNumber1" v-if="!isAuth1"
                @click="onAuthContract(selectInfo1.addr)">{{ $t('authorize') }}</el-button>
              <el-button type="primary" 
                :disabled="!amountNumber1||!isAuth1||!tabCurrent"
                @click="onSetPool1">{{ $t('PageLiquidity.text1') }}</el-button>
            </div>
            <div class="inpintext">
              <p>{{ $t('PageLiquidity.text2') }}</p>
            </div>
          </div>
          <div class="qui-item">
            <auto-search size="small" @select="onSelectCoinbase2"></auto-search>
            <!-- 输入代币 -->
            <div class="write-amount">
              <el-input-number 
                v-model="amountNumber2" controls-position="right" 
                :min="0.1" :step="0.1" @change="onChangeNumber(2)">
              </el-input-number>
              <div class="amount-unit">
                <img v-if="selectInfo2" :src="coinbaseIcos[selectInfo2.name]||require('~/static/images/defaultico.png')" alt="" class="unitico">
                <!-- <span>{{ selectInfo2 ? selectInfo2.name : 'Select' }}</span> -->
              </div>
            </div>
            <div class="s-fee">
              <p>Service Charge: <b>{{ feeValue }}</b> BNB</p>
            </div>
            <div class="inbtn-box">
              <el-button type="primary" :disabled="!amountNumber2" v-if="!isAuth2"
                @click="onAuthContract(selectInfo2.addr)">authorize</el-button>
              <el-button type="primary" 
                :disabled="!amountNumber2||!isAuth2"
                @click="onSetPool2">{{ $t('PageLiquidity.text1') }}</el-button>
            </div>
            <div class="inpintext">
              <p v-html="$t('PageLiquidity.text3')"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="liquidity-details">
      <h2>{{ $t('PageLiquidity.text4') }}</h2>
      <div class="container">
        <div class="details-box">
          <p>{{ $t('PageLiquidity.text5') }}：<b>{{ shortsInfos[2] || '0.0000' }}</b> TRDT</p>
          <p>{{ $t('PageLiquidity.text6') }}：<b>{{ shortsInfos[3] || '0.0000' }}</b> TRDT</p>
          <p>{{ $t('PageLiquidity.text7') }}：<b>{{ ((shortsInfos[3]/shortsInfos[2]*100)||0).toFixed(2) }}%</b> </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ADDRESS } from '@/contract/Ev2.json';
import { BNB_ADDRESS, USDT_ADDRESS } from '@/contract/ABI';
export default {
  name: 'LiquiditysPage',
  data () {
    return {
      tabList: [1, 5, 10],
      tabCurrent: '',
      selectInfo1: null,
      selectInfo2: null,
      amountNumber1: 0.1,
      amountNumber2: 0.1,
      isAuth1: false,
      isAuth2: false,
      commonAddrs: {
        'BNB': BNB_ADDRESS,
        'USDT': USDT_ADDRESS
      },
      feeValue: '0.00000000',
      shortsInfos: {},
      defaultAddress: ''
    }
  },
  computed: {
    coinbaseIcos () {
      return this.$store.state.coinbaseIcos;
    },
    walletAddress () {
      return this.$store.state.wallet.walletAddress;
    },
  },
  created () {
    this.defaultAddress = this.$route.query.addr1;
    this.queryShorts()
  },
  methods: {
    async queryShorts () {
      if (this.selectInfo1 && this.selectInfo1.addr) {
        const { methods } = await this.$store.dispatch('contract/event');
        methods.getShorts(this.selectInfo1.addr).call((err, res) => {
          if (!err) {
            console.log(res)
            this.shortsInfos = {
              0: (res[0]/Math.pow(10,18)).toFixed(8),
              1: (res[1]/Math.pow(10,18)).toFixed(8),
              2: (res[2]/Math.pow(10,18)).toFixed(4),
              3: (res[3]/Math.pow(10,18)).toFixed(4),
            }
          }
        })
      }
    },
    async getTokenAddress (addr) {
      const { methods } = await this.$store.dispatch('contract/event');
      return new Promise((resolve, reject) => {
        methods.getToke(addr).call((err, res) => {
          if (!err) {
            let commonAddr = this.commonAddrs[res[1]];
            if (commonAddr) {
              resolve(commonAddr)
            } else {
              reject('not address')
            }
          } else {
            reject(err)
          }
        })
      })
    },
    async onSetPool1 () {
      const { methods } = await this.$store.dispatch('contract/event', 2);
      const coinbaseAddress = await this.getTokenAddress(this.selectInfo1.addr);
      const payAmount = web3.utils.toWei(String(this.amountNumber1), 'ether');
      methods.setPool(this.selectInfo1.addr, coinbaseAddress, payAmount, this.tabCurrent, 0)
      .send((err, txHash) => {
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    async onSetPool2 () {
      const { methods } = await this.$store.dispatch('contract/event', 2);
      const coinbaseAddress = await this.getTokenAddress(this.selectInfo2.addr);
      const payAmount = web3.utils.toWei(String(this.amountNumber2), 'ether');
      const valueAmount = await this.queryFee();
      methods.setPool(this.selectInfo2.addr, coinbaseAddress, payAmount, 0, 1)
      .send({
        value: valueAmount
      }, (err, txHash) => {
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    async queryFee () {
      const { methods } = await this.$store.dispatch('contract/event', 2);
      return new Promise((resolve) => {
        methods.fee().call((err, res) => {
          if (!err) {
            this.feeValue = (res/Math.pow(10, 18)).toFixed(8);
            resolve(res)
          }
        })
      })
    },
    onChangeNumber (typeIndex) {
      if (typeIndex == 1 && this.selectInfo1) {
        this.onSelectCoinbase1(this.selectInfo1)
      } else if (typeIndex == 2 && this.selectInfo2) {
        this.onSelectCoinbase2(this.selectInfo2)
      }
    },
    async onAuthContract (address) { // 执行授权
      const { methods } = await this.$store.dispatch('contract/common', { address });
      const authAmount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
      methods.approve(ADDRESS, authAmount).send((err, txHash) => {
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    async queryAllowance (address) { // 查询授权
      const { methods } = await this.$store.dispatch('contract/common', { address });
      return new Promise((resolve, reject) => {
        methods.allowance(this.walletAddress, ADDRESS).call((err, res) => {
          if (err) {
            reject(err)
          } else {
            console.log('查询授权：', res/Math.pow(10, 18))
            resolve(res/Math.pow(10, 18))
          }
        })
      })
    },
    onSelectTabCurrent (item) {
      this.tabCurrent = item
    },
    onSelectCoinbase1 (item) {
      this.selectInfo1 = item;
      this.isAuth1 = false;
      this.queryAllowance(item.addr)
      .then((authAmount) => {
        this.isAuth1 = this.amountNumber1 <= authAmount;
      })
      this.queryShorts()
    },
    onSelectCoinbase2 (item) {
      this.selectInfo2 = item;
      this.isAuth2 = false;
      this.queryAllowance(item.addr)
      .then((authAmount) => {
        this.isAuth2 = this.amountNumber2 <= authAmount;
      })
      this.queryFee()
    }
  }
}
</script>

<style lang="scss" scoped>
.page-liquidity {
  min-height: 600px;
}
.linebg {
  top: 0;
  left: 0;
  width: 100%;
  height: 580px;
  z-index: 0;
  position: absolute;
  object-fit: cover;
}
.topliquidity-content {
  position: relative;
  .qui-box {
    position: relative;
    z-index: 10;
    padding: 40px 20px;
    @include flexBox;
    .qui-item {
      width: 398px;
      height: 468px;
      padding: 30px 28px;
      box-sizing: border-box;
      background: linear-gradient(180deg,hsla(0,0%,100%,.4),hsla(0,0%,100%,.1) 87.46%);
      box-shadow: 0 20px 80px rgba(0,0,0,.05);
      border-radius: 24px;
      border: 1px solid hsla(0,0%,100%,.5);
      border-bottom: 1px solid hsla(0,0%,100%,.2);
      margin: 0 30px;
    }
    .tabs-list {
      padding: 0 2px;
      @include flexBox(space-between, center);
      .tabs-item {
        width: 102px;
        height: 40px;
        margin-top: 20px;
        background: #fff;
        border-radius: 10px;
        font-size: 16px;
        cursor: pointer;
        @include flexBox;
        flex-wrap: wrap;
        &.active {
          color: #fff;
          background-color: #0b48e6;
        }
      }
    }
    .write-amount {
      width: 100%;
      height: 80px;
      background: #fff;
      border-radius: 24px;
      padding: 12px 32px;
      padding-left: 20px;
      box-sizing: border-box;
      margin-top: 20px;
      @include flexBox(space-between, center);
      .amount-unit {
        padding-left: 10px;
        @include flexBox;
        .unitico {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          position: relative;
          top: -1px;
        }
        span {
          font-style: normal;
          font-size: 14.4px;
          line-height: 20px;
          color: #13151a;
          min-width: 44px;
          text-align: center;
        }
      }
    }
  }
  .inbtn-box {
    margin-top: 30px;
    @include flexBox(space-between, center);
    .el-button {
      flex: 1;
      height: 50px;
      border-radius: 15px;
      border: 0px;
      background-color: #0b48e6;
      color: #fff;
      font-size: 18px;
      position: relative;
      top: 0;
      &:active {
        top: 2px;
        background-color: #073eca;
      }
    }
  }
  .inpintext {
    padding: 20px 0;
    font-size: 14px;
    text-align: center;
    color: #333;
    b {
      color: red;
    }
  }
}
.liquidity-details {
  background: #F2F5FA;
  padding: 100px 30px 60px;
  h2 {
    font-size: 40px;
    text-align: center;
  }
  .details-box {
    padding: 60px 20%;
    background-color: #fff;
    border-radius: 20px;
    margin-top: 50px;
    p {
      font-size: 24px;
      border-bottom: 1px dotted #ccc;
      padding: 10px 0;
      b {
        color: #00a2f2;
      }
    }
  }
}
.s-fee {
  text-align: center;
  font-size: 14px;
  color: #333;
  margin-top: 20px;
}
@media screen and (max-width: 750px) {
  .topliquidity-content {
    background: #c0c2e9;
  }
  .qui-box {
    padding: 20px 0 !important;
    flex-direction: column;
    .qui-item {
      max-width: 100% !important;
      margin: 20px 0 0 !important;
      padding: 20px !important;
      height: auto !important;
    }
  }
  .liquidity-details {
    padding: 50px 0 60px;
    h2 {
      font-size: 26px;
    }
    .details-box {
      padding: 30px 20px;
      margin-top: 20px;
      p {
        font-size: 16px;
      }
    }
  }
  .topliquidity-content .qui-box .tabs-list .tabs-item {
    width: 32%;
  }
}
</style>