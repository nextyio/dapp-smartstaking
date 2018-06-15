import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'
import { Link } from 'react-router-dom'

import './style.scss'

import { Col, Row, Icon, Form, Input, Button, Dropdown, Breadcrumb } from 'antd'
const FormItem = Form.Item;

export default class extends LoggedInPage {

    ord_renderContent () {
        let {wallet, web3, contract} = this.props.profile
        if (!contract || !wallet || !web3) {
            return null;
        }

        const balance = parseFloat(web3.fromWei(wallet.balance, 'ether'))
        const address = wallet.getAddressString()

        const fund = contract.fund().toString() / 1e18
        const fundBonus = contract.fundBonus().toString() / 1e18

        const packageInfo1 = contract.packages(1)
        const packageInfo2 = contract.packages(2)
        const packageInfo3 = contract.packages(3)
        const packageInfo4 = contract.packages(4)

        const bonusPackage1 = packageInfo1[1].toString()
        const bonusPackage2 = packageInfo2[1].toString()
        const bonusPackage3 = packageInfo3[1].toString()
        const bonusPackage4 = packageInfo4[1].toString()

        return (
            <div className="p_Profile">
                <div className="ebp-header-divider">

                </div>
                <div className="ebp-page content-center">
                    <Row>
                        <Col span={12}>
                            <h1>{fundBonus} NTY</h1>
                            <span className="text-stat">Current amount in Smart Staking</span>
                        </Col>
                        <Col span={12}>
                            <h1>{fund} NTY</h1>
                            <span className="text-stat">Total Smart Staking amount</span>
                        </Col>
                    </Row>
                    <div className="ebp-header-divider dashboard-rate-margin">

                    </div>

                    <div><span className="text-stat">Current interest rate:</span></div>

                    <Row>
                        <Col span={6}>
                            <h1>{bonusPackage1} %</h1>
                            7 days
                        </Col>
                        <Col span={6}>
                            <h1>{bonusPackage2} %</h1>
                            14 days
                        </Col>
                        <Col span={6}>
                            <h1>{bonusPackage3} %</h1>
                            90 days
                        </Col>
                        <Col span={6}>
                            <h1>{bonusPackage4} %</h1>
                            190 days
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }

    ord_renderBreadcrumb() {
        return (
            <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
                <Breadcrumb.Item><Link to="/dashboard"><Icon type="home" /> Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item> Dashboard</Breadcrumb.Item>
            </Breadcrumb>
        );
    }
}
