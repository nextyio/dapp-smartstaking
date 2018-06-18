import BaseService from '../model/BaseService'
import _ from 'lodash'
import Tx from 'ethereumjs-tx'
const SolidityFunction = require('web3/lib/web3/function')
import {WEB3} from '@/constant'

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

    async getPackageInfo(index) {
        return this.getPackage(index)
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
            const packageInfo = this.getPackage(i)

            packages.push({
                index: i + 1,
                ...packageInfo
            })
        }

        return packages;
    }

    async deposit(packageId, amount) {
        const storeUser = this.store.getState().user
        let {contract, web3, wallet} = storeUser.profile

        const balance = parseFloat(web3.fromWei(wallet.balance, 'ether'))
        const nonce = web3.eth.getTransactionCount(wallet.getAddressString())

        const rawTx = {
            nonce: nonce,
            from: wallet.getAddressString(),
            value: web3.toWei(amount, "ether"),
            to: contract.address,
            data: '0x000000000000000000000000000000000000000000000000000000000000000' + packageId
        }

        const gas = this.estimateGas(rawTx)
        rawTx.gas = gas

        return this.sendRawTransaction(rawTx)
    }

    async callFunction(functionName, params) {
        const storeUser = this.store.getState().user
        let {contract, web3, wallet} = storeUser.profile

        const functionDef = new SolidityFunction('', _.find(WEB3.ABI, { name: functionName }), '')
        const payloadData = functionDef.toPayload(params).data
        const nonce = web3.eth.getTransactionCount(wallet.getAddressString())

        const rawTx = {
            nonce: nonce,
            from: wallet.getAddressString(),
            value: '0x0',
            to: contract.address,
            data: payloadData
        }
        const gas = this.estimateGas(rawTx)
        rawTx.gas = gas

        return this.sendRawTransaction(rawTx)
    }

    getPackage(index) {
        const storeUser = this.store.getState().user
        let {contract} = storeUser.profile

        if (!contract) {
          return
        }

        const packageInfo = contract.getPackageInfo(index)
        let isPaid = packageInfo[0]
        let amount = packageInfo[1].toString()
        let packageId = packageInfo[2].toString()
        let bonusPercent = packageInfo[3].toString()
        let lastDateWithdraw = packageInfo[4].toString()
        let expiredDate = packageInfo[5].toString()

        return {
            isPaid,
            amount,
            packageId,
            bonusPercent,
            lastDateWithdraw,
            expiredDate
        }
    }

    sendRawTransaction(rawTx) {
        const storeUser = this.store.getState().user
        let {web3, wallet} = storeUser.profile

        const privatekey = wallet.getPrivateKey()
        const tx = new Tx(rawTx)
        tx.sign(privatekey)
        const serializedTx = tx.serialize()

        return web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'))
    }

    estimateGas(rawTx) {
        const storeUser = this.store.getState().user
        let {web3} = storeUser.profile
        let gas

        try {
            gas = web3.eth.estimateGas(rawTx)
        } catch(err) {
            gas = 100000
        }

        return gas
    }

    getEventWithdraw() {
        
        const storeUser = this.store.getState().user
        let {contract, web3, wallet} = storeUser.profile
        return contract.Withdraw()
    }
}
