import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'

import './style.scss'

import { Col, Row, Icon, Alert, Input, Button, Table, Breadcrumb, Modal, Menu, Checkbox } from 'antd'

export default class extends LoggedInPage {

    ord_renderContent() {
        let { wallet, web3, contract } = this.props.profile
        let balance
        let address

        if (wallet) {
            balance = parseFloat(web3.fromWei(wallet.balance, 'ether'))
            address = wallet.getAddressString()
        }

        return (
            <div className="">
                <div className="ebp-header-divider">

                </div>
                <div className="">
                    <h2 className="text-center">SS0001</h2>
                    <Row>
                        <Col span={12} style={{'textAlign': 'right'}}>
                            <span>Package:</span>
                        </Col>
                        <Col span={4} style={{'textAlign': 'left', 'marginLeft': '25px'}}>
                            <span>30 days</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} style={{'textAlign': 'right'}}>
                            <span>Expire Date:</span>
                        </Col>
                        <Col span={4} style={{'textAlign': 'left', 'marginLeft': '25px'}}>
                            <span>6/22/2018</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} style={{'textAlign': 'right'}}>
                            <span>Current reward:</span>
                        </Col>
                        <Col span={4} style={{'textAlign': 'left', 'marginLeft': '25px'}}>
                            <span>1400</span>
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
                <Breadcrumb.Item><Icon type="home" /> Home</Breadcrumb.Item>
                <Breadcrumb.Item> List Package</Breadcrumb.Item>
                <Breadcrumb.Item> Detail</Breadcrumb.Item>
            </Breadcrumb>
        );
    }

    confirm () {
        Modal.confirm({
            title: 'Are you sure?',
            content: '',
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
