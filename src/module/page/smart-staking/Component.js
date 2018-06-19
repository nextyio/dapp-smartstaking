import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import { Link } from 'react-router-dom'
//import {CopyToClipboard} from 'react-copy-to-clipboard'

import './style.scss'

import { Col, Row, Icon, Form, Input, Button, Dropdown, Breadcrumb, Modal, Menu, Checkbox, Message, Alert, InputNumber, notification} from 'antd'
const FormItem = Form.Item;
Message.config({
    top: 100
})

export default class extends LoggedInPage {

  validValue(value) {
    var deciPart = (value + ".").split(".")[1];
    if (deciPart.length>8) {return value.toFixed(8)} else {return value};
  }

    onChangeInput(value) {
      this.setState({
            amount: this.validValue(value),
            isLoading: false,
            txhash: false,
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

             //Message.success(message, 3);
        }

        return (
            <div className="">
                <div className="ebp-header-divider">

                </div>
                <div className="ebp-page">
                    <h3 className="text-center">Smart Staking Information</h3>


                        {this.state.txhash &&
                        <Row>
                          <Col span={4} offset={2} style={{'textAlign': 'left'}} >
                              TxHash:
                          </Col>
                          <Col span={18} style={{'textAlign': 'left'}}>
                            {this.state.txhash &&
                                  <div>
                                      {this.state.txhash} {this.state.isLoading ? <img src='/assets/images/Loading.gif' style = {{'width' : '20px'}} /> :
                                      <Icon type="check" style={{ fontSize: 24, color: '#4CAF50' }}/>}
                                  </div>
                            }
                            </Col>
                        </Row>
                        }


                    <Row style={{'marginTop': '15px'}}>
                        <Col span={4} offset={2} style={{'textAlign': 'left'}}>
                            Reward pool:
                        </Col>
                        <Col span={18} style={{'textAlign': 'left'}}>
                            {parseFloat(this.state.fundBonus).toFixed(8)} NTY
                        </Col>
                    </Row>
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={4} offset={2} style={{'textAlign': 'left'}}>
                            Your balance:
                        </Col>
                        <Col span={18} style={{'textAlign': 'left'}}>
                            {parseFloat(this.state.balance).toFixed(8)} NTY
                        </Col>
                    </Row>
                    <h3 className="text-center">Add more</h3>
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={4} offset={2} style={{'textAlign': 'left'}}>
                            Amount:
                        </Col>
                        <Col span={18} offset={2} style={{'textAlign': 'left'}}>

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
        this.setState({
          isLoading: true,
        })

        const self = this;
        this.props.deposit(0, this.state.amount).then((result) => {
            if (!result) {
                Message.error('Cannot send reward pool funding transaction!')
            }

            var event = self.props.getEventDepositRewardPool()
            event.watch(function (err, response) {
                if(response.event == 'DepositRewardPool') {
                    self.setState({
                        tx_success: true,
                        isLoading: false
                    });
                    self.loadData();
                    notification.success({
                        message: 'Reward pool fund success',
                        description: 'Deposit fund to reward pool successfully!',
                    });
                    event.stopWatching()
                }
            });

            Message.success('Reward pool funding transaction has been sent successfully!')
            self.setState({
                txhash: result,
                amount: '',
            })

        })
    }

    depositNTY() {
        if (!this.state.amount) {
            return Message.error('Invalid amount')
        }

        if (this.state.amount > this.state.balance) {
            return Message.error('Amount must be less than your balance')
        }

        if (this.state.amount <= 0) {
            return Message.error('Amount must be greater than 0')
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
