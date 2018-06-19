import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import { Link } from 'react-router-dom'
//import {CopyToClipboard} from 'react-copy-to-clipboard'

import './style.scss'

import { Col, Row, Icon, Form, Input, Button, Dropdown, Breadcrumb, Modal, Menu, Checkbox, Message, Alert, InputNumber } from 'antd'
const FormItem = Form.Item;
Message.config({
    top: 100
})

export default class extends LoggedInPage {

  validValue(value) {
    var deciPart = (value + ".").split(".")[1];
    if (deciPart>99999999) {return value.toFixed(8)} else {return value};
  }

    onChangeInput(value) {
      this.setState({
            amount: this.validValue(value)
        })

    }

    componentDidMount() {
        this.loadData();
        this.setState({
          copied: false,
        });
    }

    loadData() {
        this.props.getFundBonus().then((fundBonus) => {
            this.setState({fundBonus})
        })

        this.props.getBalance().then((balance) => {
            this.setState({balance})
        })
        //this.setState({amount:0})
    }

    ord_renderContent () {
        let {wallet, web3, contract} = this.props.profile

        if (!contract || !wallet || !web3) {
            return null;
        }

        let txhash = null;
        if (this.state.txhash) {
            const message = 'Transaction hash: ' + this.state.txhash
             txhash = <Alert message={message} type="success" showIcon />;

             Message.success(message, 3);
        }

        return (
            <div className="">
                <div className="ebp-header-divider">

                </div>
                <div className="ebp-page">
                    <h3 className="text-center">Smart Staking Information</h3>
                    <div className="ant-col-md-11 ant-col-md-offset-6 text-alert">
                        <Row>

                        </Row>
                    </div>
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={8} offset={6} style={{'textAlign': 'left'}}>
                            Current amount in smart staking wallet:
                        </Col>
                        <Col span={8} style={{'textAlign': 'left'}}>
                            {parseFloat(this.state.fundBonus).toFixed(8)} NTY
                        </Col>
                    </Row>
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={8} offset={6} style={{'textAlign': 'left'}}>
                            Your balance:
                        </Col>
                        <Col span={8} style={{'textAlign': 'left'}}>
                            {parseFloat(this.state.balance).toFixed(8)} NTY
                        </Col>
                    </Row>
                    <h3 className="text-center">Add more</h3>
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={8} offset={6} style={{'textAlign': 'left'}}>
                            Amount:
                        </Col>
                        <Col span={12} offset={6} style={{'textAlign': 'left'}}>

                            <InputNumber
                                className={"defaultWidth"}
                                defaultValue={0}
                                value={this.state.amount}
                                onChange={this.onChangeInput.bind(this)}
                            />
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
        this.props.deposit(0, this.state.amount).then((result) => {
            if (!result) {
                Message.error('Deposit error')
            }

            Message.success('Adding deposit to reward pool successfully')
            this.setState({
                txhash: result,
                amount: 0,
            })
        })
    }

    depositNTY() {
        if (!this.state.amount) {
            return Message.error('Invalid amount')
        }

        if (this.state.amount > this.state.balance) {
            return Message.error('Amount do not greater than your balance')
        }

        if (this.state.amount <= 0) {
            return Message.error('Amount must be value greater than 0')
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
