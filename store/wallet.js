export const state = () => ({
  walletAddress: ''
  
})

export const mutations = {
  writeWalletAddress(state, address) {
    state.walletAddress = address;
  }
}

export const actions = {
  linkWallet ({ commit }) {
    return new Promise((resolve, reject) => {
      window.ethereum.enable()
      .then((wallets) => {
        commit('writeWalletAddress', wallets[0])
        resolve(wallets[0])
      })
      .catch(reject);
    })
  }
}