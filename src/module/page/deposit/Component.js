import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'
import { Link } from 'react-router-dom'

import './style.scss'

import { Col, Row, Icon, Form, Input, Button, Dropdown, Breadcrumb, Modal, Menu, Checkbox } from 'antd'
const FormItem = Form.Item;

export default class extends LoggedInPage {

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        this.props.getFundBonus().then((fundBonus) => {
            this.setState({fundBonus})
        })

        this.props.getBalance().then((balance) => {
            this.setState({balance})
        })
    }

    renderPackageDropdown() {
        const menu = (
            <Menu onClick={this.handleMenuClick.bind(this)}>
                <Menu.Item key="7">7 days</Menu.Item>
                <Menu.Item key="30">30 days</Menu.Item>
                <Menu.Item key="90">90 days</Menu.Item>
                <Menu.Item key="180">180 days</Menu.Item>
            </Menu>
        );

        return (
            <Dropdown overlay={menu}>
                <Button>
                    {this.state.package ? this.state.package + " days" : "Choose"} <Icon type="down" />
                </Button>
            </Dropdown>
        )
    }

    handleMenuClick(e) {
        this.setState({
            package: e.key
        })
    }

    onAmountChange(e) {
        this.setState({
            amount: e.target.value
        })
    }

    onChangeCheckbox(e) {
        this.setState({
            checkedTerms: e.target.checked
        })
    }

    ord_renderContent () {
        return (
            <div className="">
                <div className="ebp-header-divider">

                </div>
                <div className="ebp-page">
                    <h3 className="text-center">Smart Staking Information</h3>
                    <div className="ant-col-md-10 ant-col-md-offset-6" style={{'textAlign': 'left'}}>
                    <Row>
                        <Col span={12}>
                            Your balance:
                        </Col>
                        <Col span={12}>
                            {this.state.balance} NTY
                        </Col>
                    </Row>
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={12}>
                            Reward pool:
                        </Col>
                        <Col span={12}>
                            {this.state.fundBonus} NTY
                        </Col>
                    </Row>
                    <hr />
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={12}>
                            Package:
                        </Col>
                        <Col span={12}>
                            {this.renderPackageDropdown()}
                        </Col>
                    </Row>
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={12}>
                            Amount:
                        </Col>
                        <Col span={12}>
                            <Input onChange={this.onAmountChange.bind(this)} type="number" />
                        </Col>
                    </Row>
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={12}>

                        </Col>
                        <Col span={12}>
                            <Checkbox onChange={this.onChangeCheckbox.bind(this)}>I accept terms</Checkbox>
                        </Col>
                    </Row>

                    <Row style={{'marginTop': '15px'}}>
                        <Col span={12}>

                        </Col>
                        <Col span={12}>
                            <Button onClick={this.confirm.bind(this)} type="primary" className="btn-margin-top">Add</Button>
                        </Col>
                    </Row>
                    </div>
                </div>
            </div>
        )
    }

    ord_renderBreadcrumb() {
        return (
            <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
                <Breadcrumb.Item><Link to="/dashboard"><Icon type="home" /> Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item> Deposit</Breadcrumb.Item>
            </Breadcrumb>
        );
    }

    confirm () {
        const _package = this.state.package;
        const package_timestamp = parseInt(_package) * 24 * 60 * 60 * 1000;
        const expire_timestamp = new Date().getTime() + package_timestamp;
        const expire_date = new Date(expire_timestamp);
        const expire_month = expire_date.getMonth() + 1;
        const expire_day = expire_date.getDate();
        const expire_year = expire_date.getFullYear();

        const content = (
            <div>
                <div>
                    Package: {this.state.package} days
                </div>
                <div>
                    Amount: {this.state.amount}
                </div>
                <div>
                    Assumed reward: 2.000.000
                </div>
                <div>
                    Exprire date: {expire_month}/{expire_day}/{expire_year}
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
                this.props.confirm()
            },
            onCancel() {
            }
        })
    }
}
