import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'
import { Link } from 'react-router-dom'
import moment from 'moment/moment'

import './style.scss'

import { Col, Row, Icon, Form, Input, Button, Table, Breadcrumb, Modal, Menu, Checkbox } from 'antd'
const FormItem = Form.Item;

export default class extends LoggedInPage {

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        this.props.getUserPackages().then((packages) => {
            this.setState({
                packages
            })
        })
    }

    renderTable() {
        const dataSource = this.state.packages;

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
                return <p>{parseFloat(amount / 1e18).toFixed(8)} NTY</p>
            }
        },  {
            title: 'Status',
            dataIndex: 'isPaid',
            key: 'isPaid',
            render: (isPaid) => {
                return <p>{isPaid ? 'Expired' : 'Processing'}</p>
            }
        }, {
            title: 'Package',
            dataIndex: 'packageId',
            key: 'packageId',
            render: (packageId) => {
                const days = {
                    '1' : '7 days',
                    '2' : '30 days',
                    '3' : '90 days',
                    '4' : '180 days',
                }
                return <p>{days[packageId]}</p>
            }
        }, {
            title: 'Maturity date',
            dataIndex: 'expiredDate',
            key: 'expiredDate',
            render: (expiredDate) => {
                return <p>{moment.utc(expiredDate * 1000).format('DD/MM/YYYY') }</p>
            }
        }, {
            title: 'Estimated Reward',
            dataIndex: 'bonusPercent',
            key: 'bonusPercent',
            render: (bonusPercent, packageInfo) => {
                return <p>{parseFloat(((packageInfo.bonusPercent * packageInfo.amount) / 10000) / 1e18).toFixed(8)} NTY</p>
            }
        }];

        return (<Table pagination={false} dataSource={dataSource} columns={columns} />);
    }

    ord_renderContent() {
        let { wallet, web3, contract } = this.props.profile
        if (!contract || !wallet || !web3) {
            return null;
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
                <Breadcrumb.Item><Link to="/dashboard"><Icon type="home" /> Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item> List Packages</Breadcrumb.Item>
            </Breadcrumb>
        );
    }
}
