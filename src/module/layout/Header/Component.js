import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {Layout, Menu, Icon, Badge, Avatar, Modal, Dropdown} from 'antd'
import _ from 'lodash'
import I18N from '@/I18N'


import {USER_ROLE} from '@/constant'

const {Header} = Layout
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

export default class extends BaseComponent {

    buildAcctDropdown() {

        const isLogin = this.props.isLogin
        const hasAdminAccess = [USER_ROLE.ADMIN, USER_ROLE.COUNCIL].includes(this.props.role)

        return (
            <Menu onClick={this.clickItem.bind(this)}>
                {isLogin ?
                    <Menu.Item key="profile">
                        {I18N.get('0200')}
                    </Menu.Item> :
                    <Menu.Item key="login">
                        {I18N.get('0201')}
                    </Menu.Item>
                }
                {isLogin && hasAdminAccess &&
                    <Menu.Item key="admin/tasks">
                        {I18N.get('0203')}
                    </Menu.Item>
                }
                {isLogin &&
                    <Menu.Item key="logout">
                        {I18N.get('0204')}
                    </Menu.Item>
                }
            </Menu>
        )
    }

    ord_render() {

        const isLogin = this.props.isLogin

        const acctDropdown = this.buildAcctDropdown()

        return (
            <Header className="c_Header">
                <Menu onClick={this.clickItem.bind(this)} className="c_Header_Menu" selectedKeys={['mail']} mode="horizontal">
                    <Menu.Item className="c_MenuItem logo" key="home-icon">
                        <img src='/assets/images/Elastos_Logo_Temp.png' />
                    </Menu.Item>

                    <Menu.Item className="c_MenuItem" key="home">
                        {I18N.get('0002')}
                    </Menu.Item>

                    <Menu.Item className="c_MenuItem" key="about">
                        {I18N.get('0008')}
                    </Menu.Item>

                    <Menu.Item className="c_MenuItem" key="contact">
                        {I18N.get('0010')}
                    </Menu.Item>

                    <Menu.Item className="c_MenuItem account right-side">
                        <Dropdown overlay={acctDropdown} style="margin-top: 24px;">
                            <a className="ant-dropdown-link" href="#">
                                {I18N.get('0004')} <Icon type="down" />
                            </a>
                        </Dropdown>
                    </Menu.Item>
                </Menu>

            </Header>
        )
    }

    clickItem(e) {
        const key = e.key
        if (_.includes([
            'home',
            'account',
            'login',
            'register',
            'signup',
            'profile',
            'about',
            'contact'
        ], key)) {
            this.props.history.push('/' + e.key)
        }
        else if (key === 'logout') {
            Modal.confirm({
                title: 'Are you sure you want to logout?',
                content: '',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk: () => {
                    this.props.logout()
                },
                onCancel() {
                }
            })
        }
    }
}
