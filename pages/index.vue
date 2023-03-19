<template>
  <div class="page-index">
    <!-- 背景 -->
    <video muted loop class="video-bg" autoplay playsinline>
      <source src="/videos/IMG_6322228.MP4" type="video/webm" />
      <source src="/videos/IMG_6322228.MP4" type="video/mp4" />
    </video>
    <!-- 顶部 -->
    <div class="container">
      <!-- 标题 -->
      <div class="page-title">
        <h1>DEX Short Aggregator</h1>
        <h2><span>Blockchain Revolution<br/>Short Token Smart Contracts</span></h2>
      </div>
      <!-- 操作池 -->
      <div class="operation-pool">
        <el-autocomplete
          v-model="selectValue"
          placeholder="Search Contract Address"
          :fetch-suggestions="querySearch"
          @select="handleSelect"
          popper-class="coinlist-box">
          <img src="~/static/images/searchico.png" alt="" slot="prefix" class="prefico" />
          <template slot-scope="{ item }">
            <div class="coinlist-cell">
              <div>
                <img src="~/static/images/TRDT.png" alt="" class="coinico">
                <span class="name">{{ item.name }}</span>
              </div>
              <span class="balance-text">{{ item.balance }}</span>
            </div>
          </template>
        </el-autocomplete>
        <h3 class="pair-h3">Select Pair</h3>
        <div class="pair-content">
          <div class="unitem" :class="{active: selectPairIndex == 0}" 
            @click="selectPairIndex = 0">
            <img src="~/static/images/BNB.png" alt="">
            <span>BNB</span>
          </div>
          <div class="unitem" :class="{active: selectPairIndex == 1}" 
            @click="selectPairIndex = 1">
            <img src="~/static/images/USDT.png" alt="">
            <span>USDT</span>
          </div>
        </div>
        <!-- 输入BNB -->
        <div class="write-amount">
          <el-input-number 
            v-model="amountNumber" controls-position="right" 
            :min="0.1" :step="0.1">
          </el-input-number>
          <div class="amount-unit">
            <img src="~/static/images/BNB.png" alt="" class="unitico">
            <span>BNB</span>
          </div>
        </div>
        <div class="max-short">
          <p>Max Short:<b>0.00000000</b> BNB</p>
        </div>
        <div class="shortbtn-cell">
          <el-button disabled>Open Short</el-button>
          <el-button disabled>Open Short</el-button>
        </div>
      </div>
      <!-- 奖池 -->
      <div class="jackpot-box">
        <div class="">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data () {
    return {
      selectValue: '',
      restaurants: [
        {
          "addr": "0x61f834516504fc02b3cd80d41722df08fd030141", 
          "name": "TRDT",
          "balance": "0.00"
        }
      ],
      selectPairIndex: 0,
      amountNumber: 0.1
    }
  },
  methods: {
    handleSelect (item) {
      console.log(item)
      this.selectValue = item.addr;
    },
    querySearch (queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    }
  }
}
</script>

<style lang="scss" scoped>
.page-index {
  position: relative;
  .video-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 830px;
    z-index: 0;
    object-fit: cover;
  }
}
.page-title {
  padding: 100px 0;
  min-height: 400px;
  h1 {
    font-size: 60px;
    line-height: 1.2;
  }
  h2 {
    margin-top: 20px;
  }
  span {
    background: linear-gradient(270.06deg, #FF820E 10%, #7926FF 52.51%, #356DF3 91.97%),
			#1F2226;
    font-size: 46px;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-box-decoration-break: clone;
  }
}
.operation-pool {
  width: 395px;
  height: 468px;
  padding: 30px 28px;
  position: absolute;
  top: 70px;
  right: 20px;
  box-sizing: border-box;
  background: linear-gradient(180deg,hsla(0,0%,100%,.4),hsla(0,0%,100%,.1) 87.46%);
  box-shadow: 0 20px 80px rgba(0,0,0,.05);
  border-radius: 24px;
  border: 1px solid hsla(0,0%,100%,.5);
  border-bottom: 1px solid hsla(0,0%,100%,.2);
  background-image: linear-gradient(top,pink,blue 30%,#ff0 60%,green 90%);
  display: flex;
  flex-direction: column;
  .prefico {
    width: 20px;
    height: 100%;
    object-fit: contain;
    margin: 0 20px;
  }
  .pair-h3 {
    margin-top: 20px;
    text-align: center;
  }
  .pair-content {
    background-color: #fff;
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 20px;
    margin-top: 10px;
    @include flexBox;
    .unitem {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      height: 40px;
      margin: 10px 16px;
      img {
        width: 24px;
        height: 24px;
        object-fit: contain;
        margin-right: 10px;
      }
      span {
        font-size: 16px;
        color: #666;
      }
      &.active {
        border-radius: 10px;
        background: linear-gradient(90deg,#56ffee 25.14%,#82ffca 67.46%,#a7ff62 116.99%,#fcff63 167.07%);
        span {
          font-weight: bold;
          color: #000;
        }
      }
    }
  }
  .write-amount {
    width: 336px;
    height: 80px;
    background: #fff;
    border-radius: 24px;
    padding: 12px 32px;
    padding-left: 20px;
    box-sizing: border-box;
    margin-bottom: 20px;
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
  .max-short {
    text-align: center;
    p {
      font-size: 14px;
      color: #333;
    }
  }
  .shortbtn-cell {
    margin-top: 20px;
    @include flexBox(space-between);
    .el-button {
      width: 156px;
      height: 64px;
      float: left;
      font-family: Bold;
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      line-height: 22px;
      color: #13151a;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      background: linear-gradient(90deg,#56ffee 25.14%,#82ffca 67.46%,#a7ff62 116.99%,#fcff63 167.07%);
      border-radius: 100px;
      transition: box-shadow .35s ease,background .35s ease;
      border: 0 !important;
      position: relative;
      &:active {
        border: 0;
        top: 2px;
      }
      &.is-disabled {
        color: #000 !important;
        background: #999 !important;
        top: 0;
      }
    }
  }
}
.coinlist-box {
  .coinlist-cell {
    width: 100%;
    @include flexBox(space-between, center);
    .coinico {
      width: 24px;
      height: 24px;
      object-fit: contain;
      position: relative;
      top: -2px;
    }
    .name {
      color: #333;
      line-height: 1;
    }
    .balance-text {
      color: #999;
    }
  }
}
</style>