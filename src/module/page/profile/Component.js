import React from 'react';
import StandardPage from '../StandardPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'
import _ from 'lodash'
const SolidityFunction = require('web3/lib/web3/function')

import './style.scss'

import { Col, Row, Icon, Form, Input, Button, Dropdown } from 'antd'
import {WEB3} from '@/constant'
const FormItem = Form.Item;

export default class extends StandardPage {

    setingPackage() {
        const {contract, wallet, web3} = this.props.profile
        const privatekey = wallet.getPrivateKey()
        const functionDef = new SolidityFunction('', _.find(WEB3.ABI, { name: 'withdrawBonusPackage' }), '')
        console.log('xxx1', functionDef)

        const payloadData = functionDef.toPayload([0]).data;
        console.log('xxx2', payloadData)
        const nonce = web3.eth.getTransactionCount(wallet.getAddressString())

        const rawTx = {
            nonce: nonce,
            from: wallet.getAddressString(),
            value: '0x0',
            to: contract.address,
            data: payloadData
        }

        // var gas = web3.eth.estimateGas(rawTx);
        rawTx.gas = 50000

        const tx = new Tx(rawTx)
        tx.sign(privatekey)
        const serializedTx = tx.serialize()

        web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
            console.log('err', err)
            if (!err)
                console.log(hash)
        })
    }

    toHex(str) {
        var hex = '';

        for(var i=0; i<str.length; i++) {
            hex += '' + str.charCodeAt(i).toString(16);
        }

        return hex;
    }

    depositPackage1() {
        const {contract, wallet, web3} = this.props.profile
        const privatekey = wallet.getPrivateKey()

        const nonce = web3.eth.getTransactionCount(wallet.getAddressString())

        const rawTx = {
            nonce: nonce,
            from: wallet.getAddressString(),
            value: web3.toWei(2, "ether"),
            to: contract.address,
            data: '0x0000000000000000000000000000000000000000000000000000000000000001'
        }

        var gas = web3.eth.estimateGas(rawTx);
        rawTx.gas = gas

        console.log('rawTx', rawTx)
        const tx = new Tx(rawTx)
        tx.sign(privatekey)
        const serializedTx = tx.serialize()

        web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
            console.log('err', err)
            if (!err)
                console.log(hash)
        })
    }

    renderContractInfo () {
        let {contract, wallet} = this.props.profile

        console.log('contract', contract)

        if (!contract) {
            return null
        }

        const fund = contract.fund()
        const fundBonus = contract.fundBonus()
        const package1 = contract.PACKAGE1()
        const package2 = contract.PACKAGE2()
        const package3 = contract.PACKAGE3()
        const package4 = contract.PACKAGE4()
        const MIN_AMOUNT_STAKING = contract.MIN_AMOUNT_STAKING()
        const investors = contract.investors(0)
        const packageCount = contract.getPackageCount()
        const packageInfo = contract.getPackageInfo(0)
        // contract.withdrawBonusPackage(2)

        return (
            <div>
                <p>Total fund: {fund.toString()}</p>
                <p>Total fund for bonus (interest): {fundBonus.toString()}</p>
                <p>Count package: {packageCount.toString()}</p>
                <p>Package Ids: {package1.toString()}, {package2.toString()}, {package3.toString()}, {package4.toString()}</p>
                <Button type="ebp" htmlType="button" onClick={this.setingPackage.bind(this)} className="">
                    withdrawBonusPackage
                </Button>
                <Button type="ebp" htmlType="button" onClick={this.depositPackage1.bind(this)} className="">
                    Deposit Package
                </Button>
            </div>
        )
    }

    ord_renderContent () {
        let {wallet, web3, contract} = this.props.profile
        let balance
        let address

        if (wallet) {
            balance = parseFloat(web3.fromWei(wallet.balance, 'ether'))
            address = wallet.getAddressString()
        }

        return (
            <div className="p_Profile">
                <div className="ebp-header-divider">

                </div>
                <div className="ebp-page">
                    <p>Account Address: {address}</p>
                    <p>Account Balance: {balance}</p>
                    {this.renderContractInfo()}
                </div>
                <Footer />
            </div>
        )
    }
}
