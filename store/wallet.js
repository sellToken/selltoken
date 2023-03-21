export const state = () => ({
  walletAddress: ''
  
})

export const mutations = {
  writeWalletAddress(state, address) {
    state.walletAddress = address;
  }
}

export const actions = {
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