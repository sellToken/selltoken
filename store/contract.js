if (process.browser) {
  const Web3 = require('web3');
  web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
}

export const state = () => ({
  gas: 500000,
  gasPrice: '5000000000',
  hashList: [],
  chainLoading: false
})

export const mutations = {
  
}

export const actions = {
  async cochainHashError ({}, { err }) {

  },
  async cochainHashSuccess ({}, { txHash }) {

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