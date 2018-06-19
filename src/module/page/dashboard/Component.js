import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'
import { Link } from 'react-router-dom'

import './style.scss'

import { Col, Row, Icon, Form, Input, Button, Dropdown, Breadcrumb } from 'antd'
const FormItem = Form.Item;

export default class extends LoggedInPage {
    componentDidMount() {
        this.loadData()
    }

    loadData() {
        this.props.getFund().then((fund) => {
            this.setState({fund})
        })

        this.props.getFundBonus().then((fundBonus) => {
            this.setState({fundBonus})
        })

        this.props.getPackagesInfo().then((packages) => {
            this.setState({
                bonusPackage1: packages.package1[1].toString()/100,
                bonusPackage2: packages.package2[1].toString()/100,
                bonusPackage3: packages.package3[1].toString()/100,
                bonusPackage4: packages.package4[1].toString()/100
            })
        })
    }

    ord_renderContent () {
        let {wallet, web3} = this.props.profile
        if (!wallet || !web3) {
            return null;
        }

        const balance = parseFloat(web3.fromWei(wallet.balance, 'ether'))
        const address = wallet.getAddressString()

        return (
            <div className="p_Profile">
                <div className="ebp-header-divider">

                </div>
                <div className="ebp-page content-center">
                    <Row>
                        <Col span={12}>
                            <h1>{parseFloat(this.state.fundBonus).toFixed(8)} NTY</h1>
                            <span className="text-stat">Reward pool</span>
                        </Col>
                        <Col span={12}>
                            <h1>{parseFloat(this.state.fund).toFixed(8)} NTY</h1>
                            <span className="text-stat">Total Smart Staking amount</span>
                        </Col>
                    </Row>
                    <div className="ebp-header-divider dashboard-rate-margin">

                    </div>

                    <div><span className="text-stat">Current reward rate:</span></div>

                    <Row>
                        <Col span={6}>
                            <h1>{parseFloat(this.state.bonusPackage1).toFixed(2)} %</h1>
                            7 days
                        </Col>
                        <Col span={6}>
                            <h1>{parseFloat(this.state.bonusPackage2).toFixed(2)} %</h1>
                            30 days
                        </Col>
                        <Col span={6}>
                            <h1>{parseFloat(this.state.bonusPackage3).toFixed(2)} %</h1>
                            90 days
                        </Col>
                        <Col span={6}>
                            <h1>{parseFloat(this.state.bonusPackage4).toFixed(2)} %</h1>
                            180 days
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
