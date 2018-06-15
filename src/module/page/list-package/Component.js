import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'
import { Link } from 'react-router-dom'

import './style.scss'

import { Col, Row, Icon, Form, Input, Button, Table, Breadcrumb, Modal, Menu, Checkbox } from 'antd'
const FormItem = Form.Item;

export default class extends LoggedInPage {

    renderTable() {
        const dataSource = [{
            name: 'SS0001',
            index: 0,
            amount: 50000,
            package: '7 days',
            expire: '6/22/2018',
            assumedReward: 1400
        }, {
            name: 'SS0002',
            index: 1,
            amount: 150000,
            package: '30 days',
            expire: '7/15/2018',
            assumedReward: 12000
        }];

        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => {
                return <Link to={"/list-package/" + record.index}>{name}</Link>
                // <a href={"/list-package/" + record.index} className="tableLink">{name}</a>
            }
        }, {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        }, {
            title: 'Package',
            dataIndex: 'package',
            key: 'package',
        }, {
            title: 'Expire',
            dataIndex: 'expire',
            key: 'expire',
        }, {
            title: 'Assumed Reward',
            dataIndex: 'assumedReward',
            key: 'assumedReward',
        }];

        return (<Table pagination={false} dataSource={dataSource} columns={columns} />);
    }

    ord_renderContent() {
        let { wallet, web3, contract } = this.props.profile
        let balance
        let address

        if (wallet) {
            balance = parseFloat(web3.fromWei(wallet.balance, 'ether'))
            address = wallet.getAddressString()
        }

        return (
            <div className="p_Profile">
                <div className="ebp-header-divider">

                </div>
                <div className="ebp-page">
                    {this.renderTable()}
                </div>
            </div>
        )
    }

    ord_renderBreadcrumb() {
        return (
            <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
                <Breadcrumb.Item><Icon type="home" /> Home</Breadcrumb.Item>
                <Breadcrumb.Item> List Package</Breadcrumb.Item>
            </Breadcrumb>
        );
    }
}
