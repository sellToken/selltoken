<template>
  <div class="auto-search">
    <div class="w-autowint autocomplete-custom" 
      :class="{'autocomplete-custom-small': size==='small'}"
      v-if="!selectInfo">
      <el-autocomplete
        v-model="selectValue"
        placeholder="Search Contract Address"
        :fetch-suggestions="querySearch"
        @select="handleSelectCoinbase"
        popper-class="coinlist-box"
        ref="selectRef">
        <img src="~/static/images/searchico.png" alt="" slot="prefix" class="prefico" />
        <template slot-scope="{ item }">
          <div class="coinlist-cell" v-if="item.name">
            <div>
              <img :src="coinbaseIcos[item.name]||require('~/static/images/defaultico.png')" alt="" class="coinico">
              <span class="name">{{ item.name }}</span>
            </div>
            <div class="raddbox">
              <span class="balance-text">{{ item.balance }}</span>
              <div v-if="item.name !== 'TRDT'" @click.stop="onAddCoinbase(item)">
                <img src="~/static/images/add2.png" alt="" class="addico" v-if="item.isAdd">
                <img src="~/static/images/add.png" alt="" class="addico" v-else>
              </div>
            </div>
          </div>
          <div class="not-have" v-else>
            <p>no data</p>
          </div>
        </template>
      </el-autocomplete>
    </div>
    <div class="select-info" :class="{'select-info-small': size==='small'}" v-else @click="onClearSelectInfo">
      <img :src="coinbaseIcos[selectInfo.name]||require('~/static/images/defaultico.png')" alt="" class="c-logo">
      <span class="si-unit">{{ selectInfo.name }}</span>
      <i class="el-icon-arrow-down"></i>
      <span class="si-balance">Balance: {{ selectInfo.balance }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AutoSearch',
  props: {
    defaultAddress: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      selectInfo: null,
      selectValue: '',
      contractLists: [
        {
          "addr": require('@/contract/ABI').TRDT_ADDRESS, 
          "pairs": "",
          "name": "TRDT",
          "balance": "0.00",
          "isAdd": true
        }
      ],
    }
  },
  computed: {
    coinbaseIcos () {
      return this.$store.state.coinbaseIcos;
    },
  },
  mounted () {
    this.selectValue = this.defaultAddress;
    let cacheList = localStorage.getItem('contractLists');
    this.contractLists = cacheList ? JSON.parse(cacheList) : this.contractLists;
    this.allCacheInitBalance()
  },
  methods: {
    allCacheInitBalance () { // 初始化请求余额
      this.contractLists.forEach(async (item) => {
        const addrInfo = await this.queryAllCoinbase(item.addr);
        item.pairs = addrInfo[1];
        item.balance = (addrInfo[2]/Math.pow(10, 18)).toFixed(4);
      })
    },
    async queryAllCoinbase (addr) {
      const { methods } = await this.$store.dispatch('contract/event');
      return new Promise((resolve, reject) => {
        methods.getToke(addr).call((err, res) => {
          if (!err) {
            resolve(res)
          } else {
            reject(err)
          }
        })
      })
    },
    onAddCoinbase (item) {
      item.isAdd = !item.isAdd;
      if (!item.isAdd) {
        let index = -1;
        for (let i = 0; i < this.contractLists.length; i ++) {
          if (this.contractLists[i].addr == item.addr) {
            index = i;
            break;
          }
        }
        if (index >= 0) {
          this.contractLists.splice(index, 1)
        }
      } else {
        this.contractLists.push(item)
      }
      localStorage.setItem('contractLists', JSON.stringify(this.contractLists));
    },
    onClearSelectInfo () {
      this.selectInfo = null;
      this.$nextTick(() => {
        this.$refs.selectRef.focus()
        this.$emit('clear')
      })
    },
    handleSelectCoinbase (item) {
      this.selectInfo = item;
      this.selectValue = item.addr;
      this.$emit('select', item)
    },
    async querySearch (queryAddress, cb) {
      if (queryAddress && queryAddress.length === 42) {
        try {
          let now = this.contractLists.filter(item => {
            return item.addr.toUpperCase() == queryAddress.toUpperCase();
          })
          if (now.length) {
            cb(now)
          } else {
            const addrInfo = await this.queryAllCoinbase(queryAddress);
            const results = [
              {
                "addr": queryAddress, 
                "name": addrInfo[0],
                "pairs": addrInfo[1],
                "balance": (addrInfo[2]/Math.pow(10,18)).toFixed(4),
                "isAdd": false
              }
            ];
            console.log(222, results)
            cb(results);
          }
        } catch (e) {
          console.log('01-error', e)
          cb([{}]);
        }
      } else {
        cb(this.contractLists);
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.auto-search {
  .w-autowint {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .select-info {
    cursor: pointer;
    min-height: 80px;
    height: 80px;
    box-sizing: border-box;
    @include flexBox(space-between, center);
    position: relative;
    background-color: #fff;
    border-radius: 24px;
    padding: 10px;
    .c-logo {
      width: 30px;
      height: 30px;
      margin-right: 10px;
      object-fit: cover;
      position: relative;
      top: -2px;
    }
    .si-unit {
      font-weight: bold;
      font-size: 24px;
    }
    .si-balance {
      margin-left: auto;
      color: #666;
      font-size: 13px;
    }
    &.select-info-small {
      height: 66px;
      min-height: 66px;
      .si-unit {
        font-size: 20px;
      }
      .c-logo {
        top: -1px;
        width: 26px;
        height: 26px;
      }
    }
  }
  .prefico {
    width: 20px;
    height: 100%;
    object-fit: contain;
    margin: 0 20px;
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
    .raddbox {
      @include flexBox;
    }
    .balance-text {
      color: #999;
    }
    .addico {
      vertical-align: middle;
      position: relative;
      width: 20px;
      height: 20px;
      margin-left: 20px;
    }
  }
}
.not-have {
  text-align: center;
}
</style>