export const state = () => ({
  walletAddress: ''
  
})

export const mutations = {
  writeWalletAddress(state, address) {
    state.walletAddress = address;
  }
}

export const actions = {
  queryAmountBNB ({ dispatch }) {
    return new Promise((resolve) => {
      dispatch('linkWallet').then((walletAddress) => {
        web3.eth.getBalance(walletAddress).then((sAmount) => {
          resolve((sAmount/Math.pow(10, 18)).toFixed(8))
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