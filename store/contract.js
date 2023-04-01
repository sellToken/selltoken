import Vue from 'vue';
if (process.browser) {
  const Web3 = require('web3');
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
  } else {
    window.web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  }
  if (!window.web3 || !window.web3.currentProvider.chainId) {
    setTimeout(() => {
      console.log('loading web3', window.ethereum)
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
      }
    }, 2000);
  }
}
export const state = () => ({
  defaultGas: 800000,
  gas: {
    'BNB': 800000,
    'ETH': 500000
  },
  minerGas: {
    'BNB': 1500000,
    'ETH': 500000
  },
  setGas: {
    'BNB': 150000,
    'ETH': 150000
  },
  gasPrice: '5000000000',
  txHash: '',
  chainLoading: false,
  oldChainStatus: null
})

export const mutations = {
  saveOldInfo (state, info) {
    state.oldChainStatus = info;
    localStorage.setItem('oldInfo', JSON.stringify(state.oldChainStatus));
  },
  saveChainHash (state, hash) {
    if (hash == 'undefined' || hash == 'null') hash = '';
    state.txHash = hash || '';
    localStorage.setItem('txHash', state.txHash)
  },
  changeLoading (state, status) {
    state.chainLoading = status
  }
}

export const actions = {
  async queyrSymbol ({ dispatch }, address) {
    const { methods } = await dispatch('common', {address});
    return new Promise((resolve, reject) => {
      methods.decimals().call((err, decNum) => {
        if (!err) {
          let decUnit = '';
          for (let k in window.web3.utils.unitMap) {
            let n = window.web3.utils.unitMap[k];
            if (n.length == (Number(decNum)+1)) {
              decUnit = k;
              break;
            }
          }
          resolve({
            decUnit, decNum
          })
        } else {
          reject(err)
        }
      })
    })
  },
  async queryTxHashStatus ({ state, commit, rootState }) {
    return new Promise((resolve, reject) => {
      window.web3.eth.getTransactionReceipt(state.txHash, (err, res) => {
        console.log('status---', err, res)
        if (!err) {
          commit('saveOldInfo', res)
          if (res === null) {
            commit('changeLoading', true);
            resolve(res);
          } else {
            let message = '';
            if (rootState.wallet.nowChainName == 'BNB') {
              message = `
                <a href="https://bscscan.com/tx/${state.txHash}" 
                  style="color:#32aa77; text-decoration: underline" 
                  target="_blank">View on BscScan</a>
                <br>
              `;
            } else {
              message = `
                <a href="https://etherscan.com/tx/${state.txHash}" 
                  style="color:#32aa77; text-decoration: underline" 
                  target="_blank">View on EthScan</a>
                <br>
              `;
            }
            Vue.prototype.$notify({
              title: res.status ? 'Successfully' : 'Uplink failed',
              message: message,
              type: res.status ? 'success' : 'error',
              offset: 100,
              duration: 20*1000,
              dangerouslyUseHTMLString: true
            });
            commit('saveChainHash', '')
            commit('changeLoading', false);
            resolve(res.status);
          }
        } else {
          commit('saveChainHash', '')
          reject(err)
        }
      })
    })
  },
  async cochainHashError ({ commit }, { err }) {
    commit('changeLoading', false);
    if (err.code!=4001) {
      Vue.prototype.$notify({
        title: `上链失败-${err.code}`,
        message: err.message,
        type: 'error',
        offset: 100,
        duration: 20*1000
      });
    }
  },
  async cochainHashSuccess ({ commit }, { txHash }) {
    commit('changeLoading', true);
    commit('saveChainHash', txHash);

  },
  async common ({ state, dispatch, rootState }, { address,coinbase }) {
    const ResultCommon = await import('@/contract/ABI.json');
    const ContractAbi = {
      ABI: ResultCommon.ABI,
      ADDRESS: address || ResultCommon[`${coinbase}_ADDRESS`]
    };
    if (!ContractAbi.ADDRESS) return Promise.reject('address is undefined');
    const walletAddress = await dispatch('wallet/linkWallet', {}, {root: true});
    const sourceContract = new window.web3.eth.Contract(ContractAbi.ABI, ContractAbi.ADDRESS, {
      gas: state.gas[rootState.wallet.nowChainName] || state.defaultGas,
      from: walletAddress
    });
    return Promise.resolve(sourceContract);
  },
  async event ({ state, dispatch, rootState }, version=1) {
    let ContractAbi;
    switch (version) {
      case 1:
        ContractAbi = await import('@/contract/Ev1.json');
      break;
      case 2:
        ContractAbi = await import('@/contract/Ev2.json');
      break;
      case 'Miner':
        ContractAbi = await import('@/contract/Miner.json');
      break;
      case 'IDO':
        ContractAbi = await import('@/contract/IDO.json');
      break;
    }
    const chainName = rootState.wallet.nowChainName;
    const ADDRESS = ContractAbi[`${chainName}_ADDRESS`];
    const walletAddress = await dispatch('wallet/linkWallet', {}, {root: true});
    
    const sourceContract = new window.web3.eth.Contract(ContractAbi.ABI, ADDRESS, {
      gas: state.gas[chainName] || state.defaultGas,
      from: walletAddress
    });
    return Promise.resolve(sourceContract);
  }
}