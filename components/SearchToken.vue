<template>
  <div class="search-token">
    <el-input v-model="selectValue" placeholder="search token address"
      @input="querySearch"></el-input>
    <div class="token-result">
      <h5>Token name</h5>
      <div class="result-list">
        <div class="result-item" 
          v-for="(item, index) in renderList" :key="index"
          @click="handleSelectCoinbase(item)">
          <img :src="coinbaseIcos[item.name]||require('~/static/images/defaultico.png')" alt="" class="coinico" />
          <span class="name">{{ item.name }}</span>
          <span class="balance">{{ item.balance }}</span>
          <div class="mlxico" v-if="!defaultContracts.includes(item.name)">
            <img src="~/static/images/add2.png" alt="" class="addico" v-if="item.isAdd" @click.stop="onAddCoinbase(item)">
            <img src="~/static/images/add.png" alt="" class="addico" v-else>
          </div>
        </div>
      </div>
    </div>
    <!-- 导入提示 -->
    <el-dialog
      title="Import Tokens"
      :visible.sync="showImportTips"
      width="320px"
      custom-class="tipsdialog"
      :close-on-click-modal="false"
      append-to-body>
      <div>
        <el-alert
          :title="content || $t('new08.text18')"
          type="warning"
          :closable="false">
        </el-alert>
        <div class="contract-address" v-if="waitImportInfo.name">
          <h5>
            <img :src="coinbaseIcos[waitImportInfo.name]||require('~/static/images/defaultico.png')"
              style="max-width: 30px; max-height: 30px;" />
            {{ waitImportInfo.name }}
          </h5>
          <p>{{ waitImportInfo.addr.substr(0, 4) }}...{{ waitImportInfo.addr.substr(-4) }}</p>
          <a class="aintext" 
            v-if="nowChainName == 'BNB'"
            :href="`https://bscscan.com/address/${waitImportInfo.addr}`" 
            target="_blank">({{ $t('PageHeader.ViewOnBscScan') }})</a>
          <a class="aintext" 
            v-else
            :href="`https://etherscan.com/address/${waitImportInfo.addr}`" 
            target="_blank">({{ $t('PageHeader.ViewOnEthScan') }})</a>
        </div>
        <div class="contract-unbtn">
          <el-checkbox size="medium" v-model="isUnderstand">I understand</el-checkbox>
        </div>
      </div>
      <div slot="footer" class="dialog-footer-tips">
        <el-button type="primary" class="themebtn" :disabled="!isUnderstand"
          @click="confirmImportCoinbase">Import</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SearchToken',
  props: {
    defaultAddress: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      contractLists: [
        {
          "addr": '0x2170ed0880ac9a755fd29b2688956bd959f933f8', 
          "pairs": "",
          "name": "ETH",
          "balance": "0.00",
          "isAdd": true,
          "chainName": "BNB"
        },
        {
          "addr": require('@/contract/ABI').TRDT_ADDRESS, 
          "pairs": "",
          "name": "TRDT",
          "balance": "0.00",
          "isAdd": true,
          "chainName": "BNB"
        },
        {
          "addr": "0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe", 
          "pairs": "",
          "name": "XRP",
          "balance": "0.00",
          "isAdd": true,
          "chainName": "BNB"
        },
        {
          "addr": "0xa645995e9801f2ca6e2361edf4c2a138362bade4", 
          "pairs": "",
          "name": "SELLC",
          "balance": "0.00",
          "isAdd": true,
          "chainName": "BNB"
        },
        {
          "addr": "0x8121d345b16469f38bd3b82ee2a547f6be54f9c9", 
          "pairs": "",
          "name": "QiQi",
          "balance": "0.00",
          "isAdd": true,
          "chainName": "BNB"
        }
      ],
      showImportTips: false,
      selectInfo: null,
      selectValue: '',
      waitImportInfo: {},
      isUnderstand: false,
      defaultContracts: [],
      renderList: []
    }
  },
  computed: {
    coinbaseIcos () {
      return this.$store.state.coinbaseIcos;
    },
    nowChainName () {
      return this.$store.state.wallet.nowChainName;
    }
  },
  mounted () {
    this.defaultContracts = this.contractLists.map(item => item.name);
    this.selectValue = this.defaultAddress;
    let cacheList = localStorage.getItem('contractLists');
    this.contractLists = cacheList ? JSON.parse(cacheList) : this.contractLists;
    this.$nextTick(() => {
      this.cb(this.contractLists)
      setTimeout(() => {
        this.allCacheInitBalance()
      }, 10)
    })
  },
  methods: {
    allCacheInitBalance () { // 初始化请求余额
      this.contractLists.forEach(async (item) => {
        if ((item.chainName||'BNB') == this.nowChainName) {
          const addrInfo = await this.queryAllCoinbase(item.addr);
          const { decNum } = await this.$store.dispatch('contract/queyrSymbol', item.addr);
          item.pairs = addrInfo[1];
          item.balance = (addrInfo[2]/Math.pow(10, decNum)).toFixed(4);
        }
      })
    },
    async queryAllCoinbase (addr) {
      const { methods } = await this.$store.dispatch('contract/event');
      return new Promise((resolve, reject) => {
        methods.getTokenName(addr).call((err, res) => {
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
      this.waitImportInfo = item;
      if (item.isAdd) {
        this.confirmImportCoinbase()
      } else {
        this.showImportTips = true;
      }
    },
    confirmImportCoinbase () {
      this.selectInfo = this.waitImportInfo;
      this.selectValue = this.waitImportInfo.addr;
      this.$emit('select', this.waitImportInfo);
      this.showImportTips = false;
      this.isUnderstand = false;
      if (!this.selectInfo.isAdd) {
        this.onAddCoinbase(this.waitImportInfo)
      }
      this.waitImportInfo = {};
      this.selectValue = '';
    },
    cb (list) {
      this.renderList = [...list];
    },
    async querySearch (queryAddress) {
      console.log(queryAddress)
      if (queryAddress && queryAddress.length === 42) {
        try {
          let now = this.contractLists.filter(item => {
            if (item.addr && (item.chainName||'BNB') == this.nowChainName) {
              return item.addr.toUpperCase() == queryAddress.toUpperCase();
            } else {
              return false;
            }
          })
          if (now.length) {
            this.cb(now)
          } else {
            const addrInfo = await this.queryAllCoinbase(queryAddress);
            const { decNum } = await this.$store.dispatch('contract/queyrSymbol', queryAddress);
            const results = [
              {
                "addr": queryAddress, 
                "name": addrInfo[0],
                "pairs": addrInfo[1],
                "balance": (addrInfo[2]/Math.pow(10,decNum)).toFixed(4),
                "isAdd": false,
                "chainName": this.nowChainName || 'BNB'
              }
            ];
            console.log(222, results)
            this.cb(results);
          }
        } catch (e) {
          console.log('01-error', e)
          this.cb([{}]);
        }
      } else {
        this.cb(this.contractLists.filter(m => (m.chainName||'BNB') == this.nowChainName));
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.search-token {
  position: relative;
  width: 100%;
  height: 400px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .token-result {
    position: relative;
    h5 {
      font-size: 16px;
      font-weight: normal;
      border-bottom: 1px solid #f8f8f8;
      padding: 20px 0;
    }
    .result-list {
      overflow-y: auto;
      max-height: 300px;
      .result-item {
        display: flex;
        align-items: center;
        padding: 10px;
        cursor: pointer;
        &:hover {
          background-color: #eee;
        }
        .coinico {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }
        .name {
          font-size: 16px;
        }
        .balance {
          margin-left: auto;
        }
        .mlxico {
          margin-left: 10px;
          .addico {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }
}
</style>