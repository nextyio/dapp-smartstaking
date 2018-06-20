import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'
import { Link } from 'react-router-dom'
import moment from 'moment/moment'

import './style.scss'

import { Col, Row, Icon, Alert, Input, Button, Table, Breadcrumb, Modal, Menu, Checkbox, Message, notification } from 'antd'

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobi l e') !== -1);
};

const isMobile = isMobileDevice();

const oneday = 60; // will be 60 * 60 * 24 on product;

Message.config({
    top: 100
})

export default class extends LoggedInPage {

    state = {
        packageInfo: {
            isPaid: false,
            amount: 0,
            packageId: 0,
            bonusPercent: 0,
            lastDateWithdraw: 0,
            expiredDate: 0
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
            '1': 7,
            '2': 30,
            '3': 90,
            '4': 180,
        }

        const dateNow = moment.utc(new Date())
        const dateLastWithDraw = moment.utc(this.state.packageInfo.lastDateWithdraw * 1000)
        const dateExpired = moment.utc(this.state.packageInfo.expiredDate * 1000);

        //const lastToExpired =  dateExpired.diff(dateLastWithDraw, 'days')
        //const nowToLast =  dateNow.diff(dateLastWithDraw, 'days')
        //const expiredToNow = dateExpired.diff(dateNow, 'days')

        const lastToExpired =  dateExpired.diff(dateLastWithDraw, 'seconds')
        const nowToLast =  dateNow.diff(dateLastWithDraw, 'seconds')
        const expiredToNow = dateExpired.diff(dateNow, 'seconds')

        const bonusPerday = ((this.state.packageInfo.amount * this.state.packageInfo.bonusPercent) / 10000) / days[this.state.packageInfo.packageId]

    console.log(lastToExpired + " " + nowToLast + " " + expiredToNow + " " + bonusPerday*1e-18+ " " + this.state.packageInfo.bonusPercent+ " " + this.state.packageInfo.amount*1e-18 );
        let amount

        if (expiredToNow < 0) {
            //amount = lastToExpired * bonusPerday
            amount = (Math.floor(lastToExpired/oneday)) * bonusPerday
        } else {
            //amount = nowToLast * bonusPerday
            amount = (Math.floor(nowToLast/oneday)) * bonusPerday
        }

        if (amount > 0) {
            amount = amount / 1e18
        }

        if (amount < 0) {
            amount = 0
        }


        amount=amount.toFixed(8);

        return (<p>{amount} NTY</p>)
    }

    ord_renderContent() {
        const packageId = this.props.match.params.id

        const days = {
            '1': '7 days',
            '2': '30 days',
            '3': '90 days',
            '4': '180 days',
        }
        const days_time = {
            '1': 7 * oneday,
            '2': 30 * oneday,
            '3': 90 * oneday,
            '4': 180 * oneday
        }

        let withdrawable;
        const dateNow = moment.utc(new Date())
        const dateExpired = moment.utc(this.state.packageInfo.expiredDate * 1000);


        const expiredToNow = dateExpired.diff(dateNow, 'seconds')

        // let now_unix = new Date().getTime() / 1000;
        if(expiredToNow >= days_time[this.state.packageInfo.packageId] - oneday) {
            withdrawable = false;
        } else {
            withdrawable = true;
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
                <div className="ant-col-md-18 ant-col-md-offset-3 text-alert" style={{'textAlign': 'left'}}>
                    <h2>SS000{packageId}</h2>
                </div>

                <div className="ant-col-md-18 ant-col-md-offset-3 text-alert" style={{'textAlign': 'left'}}>
                    {this.state.txhash &&
                    <Row>
                        <Col span={6}>
                            TxHash:
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={0} xl={0}/>
                        <Col span={18}>
                        {this.state.txhash &&
                              <div>
                                  {this.state.txhash} {this.state.isLoading ? <img src='/assets/images/Loading.gif' style = {{'width' : '20px'}} /> :
                                  <Icon type="check" style={{ fontSize: 24, color: '#4CAF50' }}/>}
                              </div>
                        }
                        </Col>
                    </Row>
                    }
                </div>


                <div className="ant-col-md-18 ant-col-md-offset-3 text-alert" style={{'textAlign': 'left'}}>
                    <Row>
                        <Col span={6}>
                            <span>Amount:</span>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={0} xl={0}/>
                        <Col span={18}>
                            <span>{(this.state.packageInfo.amount*1e-18).toFixed(8)} NTY</span>
                        </Col>
                    </Row>
                </div>

                <div className="ant-col-md-18 ant-col-md-offset-3 text-alert" style={{'textAlign': 'left'}}>
                    <Row>
                        <Col span={6}>
                            <span>Package:</span>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={0} xl={0}/>
                        <Col span={18}>
                            <span>{days[this.state.packageInfo.packageId]}</span>
                        </Col>
                    </Row>
                </div>

                <div className="ant-col-md-18 ant-col-md-offset-3 text-alert" style={{'textAlign': 'left'}}>
                    <Row>
                        <Col span={6}>
                            <span>Expired date:</span>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={0} xl={0}/>
                        <Col span={18}>
                            <span>{moment.utc(this.state.packageInfo.expiredDate * 1000).format('DD/MM/YYYY') }</span>
                        </Col>
                    </Row>
                </div>

                <div className="ant-col-md-18 ant-col-md-offset-3 text-alert" style={{'textAlign': 'left'}}>
                    <Row>
                        <Col span={6}>
                            <span>Current reward:</span>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={0} xl={0}/>
                        <Col span={18}>
                            <span>{this.renderReward()}</span>
                        </Col>
                    </Row>
                </div>
                <div className="ant-col-md-18 ant-col-md-offset-3 text-alert" style={{'textAlign': 'left'}}>

                    <Row>
                        <Col span={24}>
                            {!withdrawable && <Alert message="You cannot withdraw now." type="error" showIcon /> }
                        </Col>
                    </Row>
                </div>
                <Col xs={24} sm={24} md={24} lg={0} xl={0}/>
                <div className="ant-col-md-18 ant-col-md-offset-3 text-alert" style={{'textAlign': 'left'}}>
                    <Row>
                        {!this.state.tx_success &&
                        <Col md={8}>
                            <Button disabled={!withdrawable || this.state.packageInfo.isPaid} onClick={this.confirm.bind(this)} className="btn-withdraw" type="primary">Withdraw</Button>
                        </Col>
                        }
                    </Row>
                </div>
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
                <Breadcrumb.Item><Link to="/list-package"> List Packages</Link></Breadcrumb.Item>
                <Breadcrumb.Item> Details</Breadcrumb.Item>
            </Breadcrumb>
        );
    }

    confirmWithraw() {
        const self = this;
        self.setState({
          isLoading: true,
        })
        this.props.callFunction('withdrawBonusPackage', [(this.state.packageId - 1)]).then((result) => {
            if (!result) {
                Message.error('Deposit error')
            }

            var event = self.props.getEventWithdraw();

            event.watch(function (err, response) {
                // console.log("err, response", err, response, self.props.profile.wallet.getAddressString());

                if (response.args._to == self.props.profile.wallet.getAddressString() && response.event == "Withdraw") {
                    self.setState({
                        tx_success: true,
                        isLoading: false,
                    });
                    notification.success({
                        message: 'Withdraw successfully',
                        // description: 'Transaction has been successfully',
                    });

                    event.stopWatching();
                }
            });
/*
            setTimeout(function () {
                if (!self.state.tx_success) {
                    notification.error({
                        message: 'Withdraw failed',
                        description: 'You can not withdraw now.',
                    });
                    event.stopWatching();
                }
            }, 10000);
*/

            // Message.success('Deposit successfully')
            self.setState({
                txhash: result
            })
        })
    }

    confirm() {
        Modal.confirm({
            title: 'Are you sure?',
            content: '',
            okType: 'danger',
            cancelText: 'OK',
            okText: 'Cancel',
            onOk() {
              //this.confirmWithraw()
            },
            onCancel: () => {
                this.confirmWithraw()
            }
        })
    }
}
