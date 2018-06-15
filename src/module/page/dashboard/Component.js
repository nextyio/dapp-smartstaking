import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'

import './style.scss'

import { Col, Row, Icon, Form, Input, Button, Dropdown, Breadcrumb } from 'antd'
const FormItem = Form.Item;

export default class extends LoggedInPage {

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
        console.log('xxx', packageInfo)

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
        if (!contract || !wallet || !web3) {
            return null;
        }
        console.log('contract', contract)

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
                <Breadcrumb.Item><Icon type="home" /> Home</Breadcrumb.Item>
                <Breadcrumb.Item> Dashboard</Breadcrumb.Item>
            </Breadcrumb>
        );
    }
}
