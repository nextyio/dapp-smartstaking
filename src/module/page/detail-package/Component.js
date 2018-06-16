import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'
import { Link } from 'react-router-dom'
import moment from 'moment/moment'

import './style.scss'

import { Col, Row, Icon, Alert, Input, Button, Table, Breadcrumb, Modal, Menu, Checkbox } from 'antd'

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
                packageInfo
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

        const lastToExpired =  dateExpired.diff(dateLastWithDraw, 'minutes')
        const nowToLast =  dateNow.diff(dateLastWithDraw, 'minutes')
        const expiredToNow = dateExpired.diff(dateNow, 'minutes')

        const bonusPerday = ((this.state.packageInfo.amount * this.state.packageInfo.bonusPercent) / 100) / days[this.state.packageInfo.packageId]
        let amount

        if (expiredToNow < 0) {
            amount = lastToExpired * bonusPerday
        } else {
            amount = nowToLast * bonusPerday
        }

        if (amount > 0) {
            amount = amount / 1e18
        }

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

        return (
            <div className="">
                <div className="ebp-header-divider">

                </div>
                <div className="">
                    <h2 className="text-center">SS000{packageId}</h2>
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
                            <Alert className="alert-withdraw" message="You cannot withdraw deposit" type="error" />
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

    confirm () {
        Modal.confirm({
            title: 'Are you sure?',
            content: '',
            okText: 'OK',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => {
                this.props.confirm()
            },
            onCancel() {
            }
        })
    }
}
