import BaseService from '../model/BaseService'
import Web3 from 'web3'
import _ from 'lodash'
import WalletService from '@/service/WalletService'
import {WEB3} from '@/constant'

export default class extends BaseService {

    async decryptWallet(privatekey, opts={}){
        console.log('aaaaaaaaa', privatekey);
        const userRedux = this.store.getRedux('user')

        let web3 = new Web3(new Web3.providers.HttpProvider(WEB3.HTTP))
        // const SmartTaking = web3.eth.contract(WEB3.API)
        // const contract = SmartTaking.at(WEB3.ADDRESS_CONTRACT)

        web3.eth.defaultAccount = WEB3.ACCOUNT
        const wallet = new WalletService(privatekey)
        const walletAddress = wallet.getAddressString()

        if (!walletAddress) {
            return
        }

        wallet.balance = web3.eth.getBalance(walletAddress)

        await this.dispatch(userRedux.actions.is_login_update(true))
        await this.dispatch(userRedux.actions.profile_update({
            web3,
            wallet,
            // contract
        }))
        await this.dispatch(userRedux.actions.login_form_reset())

        return true
    }

    async logout(){
        const userRedux = this.store.getRedux('user')
        const tasksRedux = this.store.getRedux('task')

        return new Promise((resolve)=>{
            this.dispatch(userRedux.actions.is_login_update(false))
            this.dispatch(userRedux.actions.profile_reset())
            this.dispatch(tasksRedux.actions.all_tasks_reset())
            sessionStorage.clear()
            resolve(true)
        })
    }
}
