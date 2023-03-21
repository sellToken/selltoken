import Vue from 'vue';
if (process.browser) {
  const Web3 = require('web3');
  web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
}

export const state = () => ({
  gas: 500000,
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
    state.txHash = hash;
    localStorage.setItem('txHash', state.txHash)
  },
  changeLoading (state, status) {
    state.chainLoading = status
  }
}

export const actions = {
  async queryTxHashStatus ({ state, commit }) {
    return new Promise((resolve, reject) => {
      console.log(111, state.txHash)
      web3.eth.getTransactionReceipt(state.txHash, (err, res) => {
        console.log('status---', err, res)
        if (!err) {
          commit('saveOldInfo', res)
          if (res.status === null) {
            commit('changeLoading', true);
          } else {
            Vue.prototype.$notify({
              title: res.status ? 'Successfully' : 'Uplink failed',
              message: `
                <a href="https://bscscan.com/tx/${state.txHash}" 
                  style="color:#32aa77; text-decoration: underline" 
                  target="_blank">View on BscScan</a>
                <br>
              `,
              type: res.status ? 'success' : 'error',
              offset: 100,
              duration: 20*1000,
              dangerouslyUseHTMLString: true
            });
            commit('saveChainHash', '')
            commit('changeLoading', false);
          }
          resolve(res.status)
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
  async common ({ state, dispatch }, { address,coinbase }) {
    const ResultCommon = await import('@/contract/ABI.json');
    const ContractAbi = {
      ABI: ResultCommon.ABI,
      ADDRESS: address || ResultCommon[`${coinbase}_ADDRESS`]
    };
    if (!ContractAbi.ADDRESS) return Promise.reject('address is undefined');
    const walletAddress = await dispatch('wallet/linkWallet', {}, {root: true});
    const sourceContract = new web3.eth.Contract(ContractAbi.ABI, ContractAbi.ADDRESS, {
      gas: state.gas,
      gasPrice: state.gasPrice,
      from: walletAddress
    });
    return Promise.resolve(sourceContract);
  },
  async event ({ state, dispatch }, version=1) {
    let ContractAbi;
    switch (version) {
      case 1:
        ContractAbi = await import('@/contract/Ev1.json');
      break;
      case 2:
        ContractAbi = await import('@/contract/Ev2.json');
      break;
    }
    const walletAddress = await dispatch('wallet/linkWallet', {}, {root: true});
    const sourceContract = new web3.eth.Contract(ContractAbi.ABI, ContractAbi.ADDRESS, {
      gas: state.gas,
      gasPrice: state.gasPrice,
      from: walletAddress
    });
    return Promise.resolve(sourceContract);
  }
}