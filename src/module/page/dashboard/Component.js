import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'

import './style.scss'

import { Col, Row, Icon, Form, Input, Button, Dropdown, Breadcrumb } from 'antd'
const FormItem = Form.Item;

export default class extends LoggedInPage {

    setingPackage() {
        let {contract} = this.props.profile
        contract.setupPackage1(10)
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

        let data = '1'
        const rawTx = {
            nonce: nonce,
            from: wallet.getAddressString(),
            value: web3.toWei(0.1, "ether"),
            to: contract.address,
            data: '0x' + this.toHex(data),
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
        let {contract} = this.props.profile
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
        console.log('xxx', packageInfo)

        return (
            <div>
                <p>Total fund: {fund.toString()}</p>
                <p>Total fund for bonus (interest): {fundBonus.toString()}</p>
                <p>Count package: {packageCount.toString()}</p>
                <p>Package Ids: {package1.toString()}, {package2.toString()}, {package3.toString()}, {package4.toString()}</p>
                <Button type="ebp" htmlType="button" onClick={this.setingPackage.bind(this)} className="">
                    Setting Package1
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
                <div className="ebp-page content-center">
                    <Row>
                        <Col span={12}>
                            <h1>10.000</h1>
                            <span className="text-stat">Current amount in Smart Staking</span>
                        </Col>
                        <Col span={12}>
                            <h1>50.000</h1>
                            <span className="text-stat">Total Smart Staking amount</span>
                        </Col>
                    </Row>
                    <div className="ebp-header-divider dashboard-rate-margin">

                    </div>
                    {/* <div><span className="text-stat">Current amount in Smart Staking: 10.000</span></div> */}
                    {/* <div><span className="text-stat">Total Smart Staking amount: 50.000</span></div> */}
                    <div><span className="text-stat">Current interest rate:</span></div>

                    <Row>
                        <Col span={6}>
                            <h1>1%</h1>
                            7 days
                        </Col>
                        <Col span={6}>
                            <h1>2%</h1>
                            30 days
                        </Col>
                        <Col span={6}>
                            <h1>3%</h1>
                            180 days
                        </Col>
                        <Col span={6}>
                            <h1>4%</h1>
                            360 days
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }

    ord_renderBreadcrumb() {
        return (
            <div>
                <Breadcrumb.Item><Icon type="home" /> Home</Breadcrumb.Item>
                <Breadcrumb.Item> Dashboard</Breadcrumb.Item>
            </div>
        );
    }
}
