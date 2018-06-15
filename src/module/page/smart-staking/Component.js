import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'
import { Link } from 'react-router-dom'

import './style.scss'

import { Col, Row, Icon, Form, Input, Button, Dropdown, Breadcrumb, Modal, Menu, Checkbox, Message } from 'antd'
const FormItem = Form.Item;
Message.config({
    top: 100
})

export default class extends LoggedInPage {
    onChangeInput(e) {
        this.setState({
            amount: e.target.value
        })
    }

    ord_renderContent () {
        let {wallet, web3, contract} = this.props.profile

        if (!contract || !wallet || !web3) {
            return null;
        }

        const balance = parseFloat(web3.fromWei(wallet.balance, 'ether'))
        const fundBonus = contract.fundBonus().toString() / 1e18

        return (
            <div className="">
                <div className="ebp-header-divider">

                </div>
                <div className="ebp-page">
                    <h3 className="text-center">Smart Staking Information</h3>
                    <Row>
                        <Col span={8} offset={6} style={{'textAlign': 'left'}}>
                            Current amount in smart staking wallet:
                        </Col>
                        <Col span={8} style={{'textAlign': 'left'}}>
                            {fundBonus} NTY
                        </Col>
                    </Row>
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={8} offset={6} style={{'textAlign': 'left'}}>
                            Your balance:
                        </Col>
                        <Col span={8} style={{'textAlign': 'left'}}>
                            {balance} NTY
                        </Col>
                    </Row>
                    <h3 className="text-center">Add more</h3>
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={8} offset={6} style={{'textAlign': 'left'}}>
                            Amount:
                        </Col>
                        <Col span={12} offset={6} style={{'textAlign': 'left'}}>
                            <Input type="number" onChange={this.onChangeInput.bind(this)} />
                        </Col>
                    </Row>

                    <Row style={{'marginTop': '15px'}}>

                        <Col span={8} offset={8}>
                            <Button onClick={this.depositNTY.bind(this)} type="primary" className="btn-margin-top">Add</Button>
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
                <Breadcrumb.Item><Link to="/dashboard"><Icon type="home" /> Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item> Smart Staking</Breadcrumb.Item>
            </Breadcrumb>
        );
    }

    confirm() {
        let {wallet, web3, contract} = this.props.profile
        const balance = parseFloat(web3.fromWei(wallet.balance, 'ether'))

        const privatekey = wallet.getPrivateKey()
        const nonce = web3.eth.getTransactionCount(wallet.getAddressString())

        const rawTx = {
            nonce: nonce,
            from: wallet.getAddressString(),
            value: web3.toWei(this.state.amount, "ether"),
            to: contract.address,
            data: '0x0000000000000000000000000000000000000000000000000000000000000000'
        }

        var gas = web3.eth.estimateGas(rawTx);
        rawTx.gas = gas
        const tx = new Tx(rawTx)
        tx.sign(privatekey)
        const serializedTx = tx.serialize()

        web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
            console.log('err', err)
            if (!err) {
                Message.success('Deposit successful')
            }
        })
    }

    depositNTY() {
        let {wallet, web3, contract} = this.props.profile
        const balance = parseFloat(web3.fromWei(wallet.balance, 'ether'))

        if (!this.state.amount) {
            return Message.error('Amount is required')
        }

        if (this.state.amount > balance) {
            return Message.error('Amount do not greater than your balance')
        }

        if (this.state.amount <= 0) {
            return Message.error('Amount do not less than 0')
        }

        const content = (
            <div>
                <div>
                    Deposit amount: {this.state.amount} NTY
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
                this.confirm()
            },
            onCancel() {
            }
        })
    }
}
