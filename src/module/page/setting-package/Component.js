import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'

import './style.scss'

import { Col, Row, Icon, Form, Input, Button, InputNumber, Breadcrumb, Modal, Menu, Checkbox } from 'antd'
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
                    <h3>Interest rate</h3>
                    <Row>
                        <Col span={8}>
                            7 days
                        </Col>
                        <Col span={8}>
                        <InputNumber
                            defaultValue={0}
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={this.onChange7Days.bind(this)}
                        />
                        </Col>
                        <Col span={8}>
                            <span>{this.state.package7daysReward}%</span>
                        </Col>
                    </Row>
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={8}>
                            30 days
                        </Col>
                        <Col span={8}>
                        <InputNumber
                            defaultValue={0}
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={this.onChange30Days.bind(this)}
                        />
                        </Col>
                        <Col span={8}>
                            <span>{this.state.package30daysReward}%</span>
                        </Col>
                    </Row>
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={8}>
                            90 days
                        </Col>
                        <Col span={8}>
                        <InputNumber
                            defaultValue={0}
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={this.onChange90Days.bind(this)}
                        />
                        </Col>
                        <Col span={8}>
                            <span>{this.state.package90daysReward}%</span>
                        </Col>
                    </Row>
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={8}>
                            180 days
                        </Col>
                        <Col span={8}>
                        <InputNumber
                            defaultValue={0}
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={this.onChange180Days.bind(this)}
                        />
                        </Col>
                        <Col span={8}>
                            <span>{this.state.package180daysReward}%</span>
                        </Col>
                    </Row>

                    <Row style={{'marginTop': '15px'}}>
                        <Col span={8}>
                            
                        </Col>
                        <Col span={8}>
                            <Button onClick={this.reset.bind(this)} type="primary" className="btn-margin-top">Reset</Button>
                            <Button style={{'marginLeft': '15px'}} type="primary" onClick={this.set.bind(this)} className="btn-margin-top">Set</Button>
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
            <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
                <Breadcrumb.Item><Icon type="home" /> Home</Breadcrumb.Item>
                <Breadcrumb.Item> Smart Staking</Breadcrumb.Item>
            </Breadcrumb>
        );
    }

    set () {
        
    }

    reset () {
        
    }

    onChange7Days(value) {
        this.setState({
            percent_7days: value,
            package7daysReward: 7 * value
        });
    }
    onChange30Days(value) {
        this.setState({
            percent_30days: value,
            package30daysReward: 30 * value
        });
    }
    onChange90Days(value) {
        this.setState({
            percent_90days: value,
            package90daysReward: 90 * value
        });
    }
    onChange180Days(value) {
        this.setState({
            percent_180days: value,
            package180daysReward: 180 * value
        });
    }
}
