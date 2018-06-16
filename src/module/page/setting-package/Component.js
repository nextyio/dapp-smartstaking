import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'
import { Link } from 'react-router-dom'

import './style.scss'

import { Col, Row, Icon, Form, Input, Button, InputNumber, Breadcrumb, Modal, Menu, Checkbox } from 'antd'
const FormItem = Form.Item;

export default class extends LoggedInPage {

    ord_renderContent () {
        let {wallet, web3, contract} = this.props.profile
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
                <div className="ebp-page">
                    <h3 className="text-center">Interest rate</h3>
                    <Row>
                        <Col span={4} offset={6}>
                            7 days
                        </Col>
                        <Col span={4}>
                        <InputNumber
                            defaultValue={0}
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={this.onChange7Days.bind(this)}
                        />
                        </Col>
                        <Col span={4}>
                            <span>{this.state.package7daysReward}%</span>
                        </Col>
                    </Row>
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={4} offset={6}>
                            30 days
                        </Col>
                        <Col span={4}>
                        <InputNumber
                            defaultValue={0}
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={this.onChange30Days.bind(this)}
                        />
                        </Col>
                        <Col span={4}>
                            <span>{this.state.package30daysReward}%</span>
                        </Col>
                    </Row>
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={4} offset={6}>
                            90 days
                        </Col>
                        <Col span={4}>
                        <InputNumber
                            defaultValue={0}
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={this.onChange90Days.bind(this)}
                        />
                        </Col>
                        <Col span={4}>
                            <span>{this.state.package90daysReward}%</span>
                        </Col>
                    </Row>
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={4} offset={6}>
                            180 days
                        </Col>
                        <Col span={4}>
                        <InputNumber
                            defaultValue={0}
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={this.onChange180Days.bind(this)}
                        />
                        </Col>
                        <Col span={4}>
                            <span>{this.state.package180daysReward}%</span>
                        </Col>
                    </Row>

                    <Row style={{'marginTop': '15px'}}>
                        <Col span={4} offset={6}>

                        </Col>
                        <Col span={4}>
                            <Button onClick={this.reset.bind(this)} type="primary" className="btn-margin-top">Reset</Button>
                            <Button style={{'marginLeft': '15px'}} type="primary" onClick={this.set.bind(this)} className="btn-margin-top">Set</Button>
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
                <Breadcrumb.Item> Setting Package</Breadcrumb.Item>
            </Breadcrumb>
        );
    }

    set () {
        console.log('xxx', this.state)
    }

    reset () {

    }

    onChange7Days(value) {
        this.setState({
            percent_7days: value,
            package7daysReward: 7 * value
        });
    }
    onChange30Days(value) {
        this.setState({
            percent_30days: value,
            package30daysReward: 30 * value
        });
    }
    onChange90Days(value) {
        this.setState({
            percent_90days: value,
            package90daysReward: 90 * value
        });
    }
    onChange180Days(value) {
        this.setState({
            percent_180days: value,
            package180daysReward: 180 * value
        });
    }
}