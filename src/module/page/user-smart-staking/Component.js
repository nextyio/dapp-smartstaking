import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'

import './style.scss'

import { Col, Row, Icon, Form, Input, Button, Dropdown, Breadcrumb, Modal, Menu, Checkbox } from 'antd'
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
            data: '0x0000000000000000000000000000000000000000000000000000000000000001'
        }

        var gas = web3.eth.estimateGas(rawTx);
        rawTx.gas = gas
        // rawTx.data = '0x' + this.toHex(1)

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
        // contract.withdrawBonusPackage(0)
        console.log('xxx', packageInfo.toString())

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

    renderPackageDropdown() {
        const menu = (
            <Menu onClick={this.handleMenuClick.bind(this)}>
                <Menu.Item key="7">7 days</Menu.Item>
                <Menu.Item key="30">30 days</Menu.Item>
                <Menu.Item key="90">90 days</Menu.Item>
                <Menu.Item key="180">180 days</Menu.Item>
            </Menu>
        );

        return (
            <Dropdown overlay={menu}>
                <Button>
                    {this.state.package ? this.state.package + " days" : "Choose"} <Icon type="down" />
                </Button>
            </Dropdown>
        )
    }

    handleMenuClick(e) {
        this.setState({
            package: e.key
        })
    }

    onAmountChange(e) {
        this.setState({
            amount: e.target.value
        })
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
                    <h3>Smart Staking Information</h3>
                    <Row>
                        <Col span={4}>
                            Your balance:
                        </Col>
                        <Col span={8}>
                            {balance}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4}>
                            Reward pool:
                        </Col>
                        <Col span={8}>
                            2.000.000 pNTY
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col span={4}>
                            Package:
                        </Col>
                        <Col span={8}>
                            {this.renderPackageDropdown()}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4}>
                            Amount:
                        </Col>
                        <Col span={8}>
                            <Input onChange={this.onAmountChange.bind(this)} type="number" />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4}>
                            
                        </Col>
                        <Col span={8}>
                            <Checkbox onChange={this.onChangeCheckbox}>I accept terms</Checkbox>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col span={4}>
                            
                        </Col>
                        <Col span={8}>
                            <Button onClick={this.confirm.bind(this)} className="btn-margin-top">Add</Button>
                        </Col>
                    </Row>
                    {/* <p>Account Address: {address}</p> */}
                    {/* <p>Account Balance: {balance}</p> */}
                    {/* {this.renderContractInfo()} */}
                </div>
            </div>
        )
    }

    ord_renderBreadcrumb() {
        return (
            <div>
                <Breadcrumb.Item><Icon type="home" /> Home</Breadcrumb.Item>
                <Breadcrumb.Item> User Smart Staking</Breadcrumb.Item>
            </div>
        );
    }

    confirm () {
        const _package = this.state.package;
        const package_timestamp = parseInt(_package) * 24 * 60 * 60 * 1000;
        const expire_timestamp = new Date().getTime() + package_timestamp;
        const expire_date = new Date(expire_timestamp);
        const expire_month = expire_date.getMonth() + 1;
        const expire_day = expire_date.getDate();
        const expire_year = expire_date.getFullYear();

        const content = (
            <div>
                <div>
                    Package: {this.state.package} days
                </div>
                <div>
                    Amount: {this.state.amount}
                </div>
                <div>
                    Assumed reward: 2.000.000
                </div>
                <div>
                    Exprire date: {expire_month}/{expire_day}/{expire_year}
                </div>
            </div>
        );

        Modal.confirm({
            title: 'Are you sure?',
            content: content,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                this.props.confirm()
            },
            onCancel() {
            }
        })
    }
}
