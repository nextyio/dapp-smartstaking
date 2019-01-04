import BaseService from '../model/BaseService'
import Web3 from 'web3'
import _ from 'lodash'
import WalletService from '@/service/WalletService'
import {WEB3} from '@/constant'

export default class extends BaseService {

    async decryptWalletMeta() {
        if (window.web3 && window.web3.currentProvider.isMetaMask) {
            console.log('metamask found')
            window.web3.eth.getAccounts((error, accounts) => {
                if (error || accounts.length === 0) {
                    window.ethereum.enable()
                    return false
                } else {
                    const userRedux = this.store.getRedux('user')
                    console.log('metamask acc = ', accounts[0])
                    console.log('loaded success web3 Metamask')

                    let web3 = new Web3(new Web3.providers.HttpProvider(WEB3.HTTP))
                    let web3Meta = new Web3(window.web3.currentProvider)

                    const SmartTaking = web3.eth.contract(WEB3.ABI)
                    const contract = SmartTaking.at(WEB3.ADDRESS_CONTRACT)

                    const SmartTakingMeta = web3Meta.eth.contract(WEB3.ABI)
                    const contractMeta = SmartTakingMeta.at(WEB3.ADDRESS_CONTRACT)
                    // const contractMeta = new Web3.eth.contract(WEB3.ABI, WEB3.ADDRESS_CONTRACT)
                    console.log('contract address', contractMeta.address)

                    const wallet = accounts[0] // new WalletService(privatekey)
                    const walletAddress = accounts[0]

                    if (!walletAddress) {
                        window.ethereum.enable()
                        return false
                    }
                    console.log('wallet found')
                    web3.eth.defaultAccount = walletAddress
                    let isMetamask = true
                    // wallet.balance = web3.eth.getBalance(walletAddress)

                    const owner = contract.owner()

                    if (walletAddress === owner) {
                        console.log('is Admin')
                        this.dispatch(userRedux.actions.is_admin_update(true))
                    }

                    this.dispatch(userRedux.actions.is_login_update(true))
                    this.dispatch(userRedux.actions.profile_update({
                        web3,
                        web3Meta,
                        wallet,
                        isMetamask,
                        contract,
                        contractMeta
                    }))
                    this.dispatch(userRedux.actions.login_form_reset())
                    this.path.push('/dashboard')
                    return true
                }
            })
        }
        return false
    }

    async decryptWallet(privatekey, opts = {}) {
        const userRedux = this.store.getRedux('user')

        let web3 = new Web3(new Web3.providers.HttpProvider(WEB3.HTTP))

        const SmartTaking = web3.eth.contract(WEB3.ABI)
        const contract = SmartTaking.at(WEB3.ADDRESS_CONTRACT)

        const wallet = new WalletService(privatekey)
        const walletAddress = wallet.getAddressString()

        if (!walletAddress) {
            return
        }

        web3.eth.defaultAccount = walletAddress
        wallet.balance = web3.eth.getBalance(walletAddress)

        const owner = contract.owner()
        let isMetamask = false

        if (walletAddress === owner) {
            await this.dispatch(userRedux.actions.is_admin_update(true))
        }

        await this.dispatch(userRedux.actions.is_login_update(true))
        await this.dispatch(userRedux.actions.profile_update({
            web3,
            wallet,
            isMetamask,
            contract
        }))
        await this.dispatch(userRedux.actions.login_form_reset())

        return true
    }

    async getBalance() {
        const storeUser = this.store.getState().user
        let {web3, web3Meta, isMetamask, wallet} = storeUser.profile
        if (isMetamask) {
            return new Promise((resolve) => {
                // var self = this
                web3Meta.eth.getBalance(wallet, function (error, wei) {
                    if (!error) {
                        const balance = parseFloat(web3.fromWei(wei, 'ether'))
                        resolve(balance)
                    }
                }
                );
            })
        } else {
            const walletAddress = wallet.getAddressString()
            const balance = web3.eth.getBalance(walletAddress)

            return parseFloat(web3.fromWei(balance, 'ether'))
        }
    }

    async logout() {
        const userRedux = this.store.getRedux('user')
        const tasksRedux = this.store.getRedux('task')

        return new Promise((resolve) => {
            this.dispatch(userRedux.actions.is_login_update(false))
            this.dispatch(userRedux.actions.is_admin_update(false))
            this.dispatch(userRedux.actions.profile_reset())
            this.dispatch(tasksRedux.actions.all_tasks_reset())
            sessionStorage.clear()
            resolve(true)
        })
    }
}
