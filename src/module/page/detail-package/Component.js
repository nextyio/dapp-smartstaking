import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'
import { Link } from 'react-router-dom'
import moment from 'moment/moment'

import './style.scss'

import { Col, Row, Icon, Alert, Input, Button, Table, Breadcrumb, Modal, Menu, Checkbox, Message, notification } from 'antd'

Message.config({
    top: 100
})

export default class extends LoggedInPage {

    state = {
        packageInfo: {
            isPaid : false,
            amount : 0,
            packageId : 0,
            bonusPercent : 0,
            lastDateWithdraw : 0,
            expiredDate : 0
        },
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        const packageId = this.props.match.params.id
        this.props.getPackageInfo(packageId - 1).then((packageInfo) => {

            this.setState({
                packageInfo,
                packageId
            })
        })
    }

    renderReward() {
        const days = {
            '1' : 7,
            '2' : 30,
            '3' : 90,
            '4' : 180,
        }

        const dateNow = moment.utc(new Date())
        const dateLastWithDraw = moment.utc(this.state.packageInfo.lastDateWithdraw * 1000)
        const dateExpired = moment.utc(this.state.packageInfo.expiredDate * 1000);

        //const lastToExpired =  dateExpired.diff(dateLastWithDraw, 'days')
        //const nowToLast =  dateNow.diff(dateLastWithDraw, 'days')
        //const expiredToNow = dateExpired.diff(dateNow, 'days')
        const oneday= 60 //seconds, testing 1 day=1min=60s
        const lastToExpired =  dateExpired.diff(dateLastWithDraw, 'seconds')
        const nowToLast =  dateNow.diff(dateLastWithDraw, 'seconds')
        const expiredToNow = dateExpired.diff(dateNow, 'seconds')

        const bonusPerday = ((this.state.packageInfo.amount * this.state.packageInfo.bonusPercent) / 10000) / days[this.state.packageInfo.packageId]

        //console.log(lastToExpired + " " + nowToLast + " " + expiredToNow + " " + bonusPerday+ " " + this.state.packageInfo.bonusPercent+ " " + this.state.packageInfo.amount*1e-18);
        let amount

        if (expiredToNow < 0) {
            //amount = lastToExpired * bonusPerday
            amount = (Math.floor((lastToExpired+0.1)/oneday)) * bonusPerday
        } else {
            //amount = nowToLast * bonusPerday
            amount = (Math.floor((nowToLast+0.1)/oneday)) * bonusPerday
        }

        if (amount > 0) {
            amount = amount / 1e18
        }

        amount=amount.toFixed(8);

        return (<p>{amount} NTY</p>)
    }

    ord_renderContent() {
        const packageId = this.props.match.params.id

        const days = {
            '1' : '7 days',
            '2' : '30 days',
            '3' : '90 days',
            '4' : '180 days',
        }

        let txhash = null;
        if (this.state.txhash) {
            const message = 'Transaction hash: ' + this.state.txhash
             txhash = <Alert message={message} type="success" showIcon />
        }

        return (
            <div className="">
                <div className="ebp-header-divider">

                </div>
                <div className="">
                    <h2 className="text-center">SS000{packageId}</h2>
                    <div className="ant-col-md-10 ant-col-md-offset-7 text-alert">
                        <Row>
                            {txhash}
                        </Row>
                    </div>
                    <Row>
                        <Col span={12} style={{'textAlign': 'right'}}>
                            <span>Package:</span>
                        </Col>
                        <Col span={4} style={{'textAlign': 'left', 'marginLeft': '25px'}}>
                            <span>{days[this.state.packageInfo.packageId]}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} style={{'textAlign': 'right'}}>
                            <span>Expire Date:</span>
                        </Col>
                        <Col span={4} style={{'textAlign': 'left', 'marginLeft': '25px'}}>
                            <span>{moment.utc(this.state.packageInfo.expiredDate * 1000).format('MM/DD/YYYY') }</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} style={{'textAlign': 'right'}}>
                            <span>Current reward:</span>
                        </Col>
                        <Col span={4} style={{'textAlign': 'left', 'marginLeft': '25px'}}>
                            <span>{this.renderReward()}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8} offset={8}>
                            {/*<Alert className="alert-withdraw" message="You cannot withdraw deposit" type="error" />*/}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8} offset={8}>
                            <Button onClick={this.confirm.bind(this)} className="btn-withdraw" type="primary">Withdraw</Button>
                        </Col>
                    </Row>
                </div>
                <div className="ebp-page">

                </div>
            </div>
        )
    }

    ord_renderBreadcrumb() {
        return (
            <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
                <Breadcrumb.Item><Link to="/dashboard"><Icon type="home" /> Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to="/list-package"> List Package</Link></Breadcrumb.Item>
                <Breadcrumb.Item> Detail</Breadcrumb.Item>
            </Breadcrumb>
        );
    }

    confirmWithraw() {
        const self = this;
        this.props.callFunction('withdrawBonusPackage', [(this.state.packageId - 1)]).then((result) => {
            if (!result) {
                Message.error('Deposit error')
            }

            self.props.getEventWithdraw().watch(function (err, response) {
                // console.log("err, response", err, response, self.props.profile.wallet.getAddressString());

                if(response.args._to == self.props.profile.wallet.getAddressString()) {
                    self.setState({
                        tx_success: true
                    });
                    notification.success({
                        message: 'Transaction successfully',
                        // description: 'Transaction has been successfully',
                    });
                }
            });

            setTimeout(function() {
                if(!self.state.tx_success) {
                    notification.error({
                        message: 'Transaction failed',
                        description: 'Transaction has been failed. You can not withdraw now.',
                    });
                }
            }, 5000);

            // Message.success('Deposit successfully')
            this.setState({
                txhash: result
            })
        })
    }

    confirm () {
        Modal.confirm({
            title: 'Are you sure?',
            content: '',
            okText: 'OK',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => {
                this.confirmWithraw()
            },
            onCancel() {
            }
        })
    }
}
