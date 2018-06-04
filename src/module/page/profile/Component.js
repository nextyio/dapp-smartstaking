import React from 'react';
import StandardPage from '../StandardPage';
import Footer from '@/module/layout/Footer/Container'

import './style.scss'

import { Col, Row, Icon, Form, Input, Button, Dropdown } from 'antd'
const FormItem = Form.Item;

export default class extends StandardPage {

    ord_renderContent () {
        let {wallet, web3} = this.props.profile
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
                    <p>Account Address: {address}</p>
                    <p>Account Balance: {balance}</p>
                </div>
                <Footer />
            </div>
        )
    }
}
