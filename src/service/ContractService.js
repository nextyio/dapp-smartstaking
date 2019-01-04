import BaseService from '../model/BaseService'
import _ from 'lodash'
import Tx from 'ethereumjs-tx'
import {WEB3} from '@/constant'
const SolidityFunction = require('web3/lib/web3/function')

export default class extends BaseService {
    async getFund() {
        const storeUser = this.store.getState().user
        let {contract} = storeUser.profile
        if (!contract || contract.fund().toString() === 0) {
            return 0
        }
        return contract.fund().toString() / 1e18
    }

    async getFundBonus() {
        const storeUser = this.store.getState().user
        let {contract} = storeUser.profile
        if (!contract || contract.fundBonus().toString() === 0) {
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

/*     async depositMeta(packageId, amount) {
        const storeUser = this.store.getState().user
        let {contractMeta, web3, wallet} = storeUser.profile
        console.log(contractMeta)
        contractMeta.deposit.sendTransaction(packageId, {from: wallet, value: web3.toWei(amount, 'ether')}, function(error, txnHash) {
            if (error) throw error;
            console.log(txnHash);
        });
    } */
/*     async depositMeta(packageId, amount) {
        const storeUser = this.store.getState().user
        let {contractMeta, contract, web3, web3Meta, wallet} = storeUser.profile
        const functionDef = new SolidityFunction('', _.find(WEB3.ABI, { name: 'deposit' }), '')
        const payloadData = functionDef.toPayload([packageId]).data
        console.log(web3Meta)
        const rawTx = {
            from: wallet,
            value: web3.toWei(amount, 'ether'),
            to: contract.address,
            data: payloadData
        }

        return contractMeta.sendTransaction(rawTx)
    } */

    async deposit(packageId, amount) {
        const storeUser = this.store.getState().user
        let {contract, web3, web3Meta, isMetamask, wallet} = storeUser.profile
        console.log('isMetamask = ', isMetamask)
        // if (isMetamask) {
        //     return this.depositMeta(packageId, amount)
        // } else {
        const functionDef = new SolidityFunction('', _.find(WEB3.ABI, { name: 'deposit' }), '')
        const payloadData = functionDef.toPayload([packageId]).data

        const rawTx = {
            from: isMetamask ? wallet : wallet.getAddressString(),
            value: web3.toWei(amount, 'ether'),
            to: contract.address,
            data: payloadData
        }

        if (!isMetamask) {
            const gas = this.estimateGas(rawTx)
            rawTx.gas = gas
            rawTx.nonce = web3.eth.getTransactionCount(wallet.getAddressString())
            return this.sendRawTransaction(rawTx)
        } else {
            return web3Meta.eth.sendTransaction(rawTx, function(error, txnHash) {
                if (error) throw error;
                console.log(txnHash);
            });
        }
    }

    async callFunction(functionName, params) {
        const storeUser = this.store.getState().user
        let {contract, web3, web3Meta, isMetamask, wallet} = storeUser.profile

        const functionDef = new SolidityFunction('', _.find(WEB3.ABI, { name: functionName }), '')
        const payloadData = functionDef.toPayload(params).data

        const rawTx = {
            from: isMetamask ? wallet : wallet.getAddressString(),
            value: '0x0',
            to: contract.address,
            data: payloadData
        }
        if (!isMetamask) {
            const gas = this.estimateGas(rawTx)
            rawTx.nonce = web3.eth.getTransactionCount(wallet.getAddressString())
            rawTx.gas = gas
            return this.sendRawTransaction(rawTx)
        } else {
            return web3Meta.eth.sendTransaction(rawTx, function(error, txnHash) {
                if (error) throw error;
                console.log(txnHash);
            });
        }

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
        let {web3, web3Meta, isMetamask, wallet} = storeUser.profile
        if (isMetamask) {

        } else {
            const privatekey = wallet.getPrivateKey()
            const tx = new Tx(rawTx)
            tx.sign(privatekey)
            const serializedTx = tx.serialize()
    
            return web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'))
        }
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

    getEventDepositRewardPool() {
        const storeUser = this.store.getState().user
        let {contract, web3, wallet} = storeUser.profile
        return contract.DepositRewardPool()
    }

    getEventJoinSmartStaking() {
        const storeUser = this.store.getState().user
        let {contract, web3, wallet} = storeUser.profile
        return contract.JoinSmartStaking()
    }    
}
