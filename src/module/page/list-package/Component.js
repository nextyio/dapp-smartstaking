import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'
import { Link } from 'react-router-dom'
import moment from 'moment/moment';

import './style.scss'

import { Col, Row, Icon, Form, Input, Button, Table, Breadcrumb, Modal, Menu, Checkbox } from 'antd'
const FormItem = Form.Item;

export default class extends LoggedInPage {

    renderTable(packages) {
        const dataSource = packages;

        const columns = [{
            title: 'Name',
            dataIndex: 'index',
            key: 'index',
            render: (index, record) => {
                return <Link to={"/list-package/" + index}>SS000{index}</Link>
            }
        }, {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => {
                return <p>{amount / 1e18} NTY</p>
            }
        }, {
            title: 'Package',
            dataIndex: 'packageId',
            key: 'packageId',
            render: (packageId) => {
                const days = {
                    '1' : '7 days',
                    '2' : '14 days',
                    '3' : '90 days',
                    '4' : '180 days',
                }
                return <p>{days[packageId]}</p>
            }
        }, {
            title: 'Expire',
            dataIndex: 'expiredDate',
            key: 'expiredDate',
            render: (expiredDate) => {
                return <p>{moment.utc(expiredDate*1000).format('MM/DD/YYYY') }</p>
            }
        }, {
            title: 'Assumed Reward',
            dataIndex: 'bonusPercent',
            key: 'bonusPercent',
            render: (bonusPercent, packageInfo) => {
                return <p>{((packageInfo.bonusPercent * packageInfo.amount) / 100) / 1e18}</p>
            }
        }];

        return (<Table pagination={false} dataSource={dataSource} columns={columns} />);
    }

    getPackages(contract) {
        const packageCount = contract.getPackageCount().toString()
        const packages = []

        for (let i = 0; i < packageCount; i++) {
            const packageInfo = contract.getPackageInfo(i)
            let isPaid = packageInfo[0]
            let amount = packageInfo[1].toString()
            let packageId = packageInfo[2].toString()
            let bonusPercent = packageInfo[3].toString()
            let lastDateWithdraw = packageInfo[4].toString()
            let expiredDate = packageInfo[5].toString()

            packages.push({
                index: i + 1,
                isPaid,
                amount,
                packageId,
                bonusPercent,
                lastDateWithdraw,
                expiredDate
            })
        }

        return packages;
    }

    ord_renderContent() {
        let { wallet, web3, contract } = this.props.profile
        if (!contract || !wallet || !web3) {
            return null;
        }

        const packages = this.getPackages(contract)

        return (
            <div className="p_Profile">
                <div className="ebp-header-divider">

                </div>
                <div className="ebp-page">
                    {this.renderTable(packages)}
                </div>
            </div>
        )
    }

    ord_renderBreadcrumb() {
        return (
            <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
                <Breadcrumb.Item><Link to="/dashboard"><Icon type="home" /> Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item> List Package</Breadcrumb.Item>
            </Breadcrumb>
        );
    }
}
