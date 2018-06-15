import BaseService from '../model/BaseService'
import _ from 'lodash'
import Tx from 'ethereumjs-tx'

export default class extends BaseService {
    async getFund() {
        const storeUser = this.store.getState().user
        let {contract} = storeUser.profile
        if (!contract || contract.fund().toString() == 0) {
          return 0
        }
        return contract.fund().toString() / 1e18
    }

    async getFundBonus() {
        const storeUser = this.store.getState().user
        let {contract} = storeUser.profile
        if (!contract || contract.fundBonus().toString() == 0) {
          return 0
        }
        return contract.fundBonus().toString() / 1e18
    }

    async getPackagesInfo() {
        const storeUser = this.store.getState().user
        let {contract} = storeUser.profile

        if (!contract) {
          return
        }

        return {
            package1: contract.packages(1),
            package2: contract.packages(2),
            package3: contract.packages(3),
            package4: contract.packages(4)
        }
    }

    async getUserPackages() {
        const storeUser = this.store.getState().user
        let {contract} = storeUser.profile

        if (!contract) {
          return
        }

        const packageCount = contract.getPackageCount().toString()
        const packages = []

        for (let i = 0; i < packageCount; i++) {
            const packageInfo = contract.getPackageInfo(i)
            let isPaid = packageInfo[0]
            let amount = packageInfo[1].toString()
            let packageId = packageInfo[2].toString()
            let bonusPercent = packageInfo[3].toString()
            let lastDateWithdraw = packageInfo[4].toString()
            let expiredDate = packageInfo[5].toString()

            packages.push({
                index: i + 1,
                isPaid,
                amount,
                packageId,
                bonusPercent,
                lastDateWithdraw,
                expiredDate
            })
        }

        return packages;
    }

    async deposit(packageId, amount) {
        const storeUser = this.store.getState().user
        let {contract, web3, wallet} = storeUser.profile

        const balance = parseFloat(web3.fromWei(wallet.balance, 'ether'))

        const privatekey = wallet.getPrivateKey()
        const nonce = web3.eth.getTransactionCount(wallet.getAddressString())

        const rawTx = {
            nonce: nonce,
            from: wallet.getAddressString(),
            value: web3.toWei(amount, "ether"),
            to: contract.address,
            data: '0x000000000000000000000000000000000000000000000000000000000000000' + packageId
        }

        var gas = web3.eth.estimateGas(rawTx);
        rawTx.gas = gas
        const tx = new Tx(rawTx)
        tx.sign(privatekey)
        const serializedTx = tx.serialize()

        return web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'))
    }
}
