import { BNB_ADDRESS, USDT_ADDRESS, ETH_ADDRESS, USDC_ADDRESS } from '@/contract/ABI';
const pairs = {
  'BNB': ['BNB', 'USDT'],
  'ETH': ['ETH', 'USDC']
};
let Web3;
if (process.browser) {
  Web3 = require('web3');
}
export const state = () => ({
  walletAddress: '',
  amountBNB: 0,
  chainIds: {
    'BNB': {
      text: 'BNB Chain',
      id: 56
    },
    'ETH': {
      text: 'Ethereum',
      id: 1
    }
  },
  nowChainName: 'BNB',
  commonAddrs: {
    'BNB': BNB_ADDRESS,
    'USDT': USDT_ADDRESS,
    "ETH": ETH_ADDRESS,
    "USDC": USDC_ADDRESS
  },
  pairLists: [],
  inviteAddress: ''
})

export const mutations = {
  changeChain (state, name) {
    state.nowChainName = name;
    state.pairLists = pairs[name];
  },
  writeWalletAddress(state, address) {
    state.walletAddress = address;
  },
  writeWalletAmount (state, amount) {
    state.amountBNB = amount;
  },
  writeInviteAddress (state, address) {
    state.inviteAddress = address || '';
    localStorage.setItem('inviteAddress', address)
  }
}

export const actions = {
  queryAmount ({ commit, dispatch }) {
    return new Promise((resolve) => {
      dispatch('linkWallet').then((walletAddress) => {
        window.web3.eth.getBalance(walletAddress).then((sAmount) => {
          let amount = (sAmount/Math.pow(10, 18)).toFixed(8);
          commit('writeWalletAmount', amount)
          resolve(amount)
        })
      })
    })
  },
  linkWallet ({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.walletAddress) {
        resolve(state.walletAddress)
      } else {
        try {
          if (!window.web3.currentProvider || !window.web3.currentProvider.chainId) {
            window.web3 = new Web3(window.ethereum);
          }
          window.ethereum.enable()
          .then((wallets) => {
            commit('writeWalletAddress', wallets[0])
            resolve(wallets[0])
          })
          .catch(reject);
        } catch (error) { }
      }
    })
  }
}