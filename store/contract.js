if (process.browser) {
  const Web3 = require('web3');
  web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
}

export const state = () => ({
  gas: 500000,
  gasPrice: '5000000000'
})

export const mutations = {
  
}

export const actions = {
  async cochainHashError ({}, { err }) {

  },
  async cochainHashSuccess ({}, { txHash }) {

  },
  async event ({ state, dispatch }, version=1) {
    let ContractAbi;
    switch (Number(version)) {
      case 1:
        ContractAbi = await import('@/contract/Ev1.json');
      break;
      case 2:
        ContractAbi = await import('@/contract/Ev2.json');
      break;
    }
    const walletAddress = await dispatch('wallet/linkWallet', {}, {root: true});
    console.log(walletAddress)
    const sourceContract = new web3.eth.Contract(ContractAbi.ABI, ContractAbi.ADDRESS, {
      gas: state.gas,
      gasPrice: state.gasPrice,
      from: walletAddress
    });
    return Promise.resolve(sourceContract);
  }
}