export const state = () => ({
  walletAddress: '',
  amountBNB: 0
})

export const mutations = {
  writeWalletAddress(state, address) {
    state.walletAddress = address;
  },
  writeWalletAmountBNB (state, amount) {
    state.amountBNB = amount;
  }
}

export const actions = {
  queryAmountBNB ({ commit, dispatch }) {
    return new Promise((resolve) => {
      dispatch('linkWallet').then((walletAddress) => {
        web3.eth.getBalance(walletAddress).then((sAmount) => {
          let amount = (sAmount/Math.pow(10, 18)).toFixed(8);
          commit('writeWalletAmountBNB', amount)
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