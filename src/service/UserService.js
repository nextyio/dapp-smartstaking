import BaseService from '../model/BaseService'
import Web3 from 'web3'
import _ from 'lodash'
import WalletService from '@/service/WalletService'
import {WEB3} from '@/constant'

export default class extends BaseService {

    async decryptWallet(privatekey, opts={}){
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

        if (walletAddress === owner) {
            await this.dispatch(userRedux.actions.is_admin_update(true))
        }

        await this.dispatch(userRedux.actions.is_login_update(true))
        await this.dispatch(userRedux.actions.profile_update({
            web3,
            wallet,
            contract
        }))
        await this.dispatch(userRedux.actions.login_form_reset())

        return true
    }

    async getBalance() {
        const storeUser = this.store.getState().user
        let {web3, wallet} = storeUser.profile
        return parseFloat(web3.fromWei(wallet.balance, 'ether'))
    }

    async logout(){
        const userRedux = this.store.getRedux('user')
        const tasksRedux = this.store.getRedux('task')

        return new Promise((resolve)=>{
            this.dispatch(userRedux.actions.is_login_update(false))
            this.dispatch(userRedux.actions.is_admin_update(false))
            this.dispatch(userRedux.actions.profile_reset())
            this.dispatch(tasksRedux.actions.all_tasks_reset())
            sessionStorage.clear()
            resolve(true)
        })
    }
}
