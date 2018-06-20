import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {Layout, Menu, Icon, Badge, Avatar, Modal, Dropdown, Button} from 'antd'
import _ from 'lodash'
import I18N from '@/I18N'
const { Header, Sider, Content } = Layout

import {USER_ROLE} from '@/constant';
import './style.scss';

// const {Header} = Layout;
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobi l e') !== -1);
};

const isMobile = isMobileDevice();

export default class extends BaseComponent {
  componentDidMount() {
      this.loadData()
  }
  state = {
  collapsed: isMobile,
}
toggleCollapsed = () => {
  this.setState({
    collapsed:!this.state.collapsed,
    siderWidth: this.state.collapsed?'200px':'0px'
  });
  console.log(this.state.siderWidth)
}

loadData() {
  this.setState({
    siderWidth: isMobile?'0px':'200px'
  });
}


    ord_render() {
        const isAdmin = this.props.isAdmin
        return (

            <Sider collapsed={this.state.collapsed}
                trigger={null}
                collapsedWidth="0px"
                collapsible
                >
                <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 ,position: 'absolute',top:0,left:this.state.siderWidth }}>
                    <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                </Button>
                <div className="xlogo">
                    <img src='/assets/images/logo.png' onClick={this.toggleCollapsed} />
                    Smart Staking
                </div>
                <Menu onClick={this.clickItem.bind(this)} theme="dark" mode="inline" className="menu-sidebar" defaultSelectedKeys={this.detectUrl()}>
                    <Menu.Item key="dashboard">
                        <Icon type="dashboard" /> {I18N.get('0003')}
                    </Menu.Item>
                    <Menu.Item key="deposit">
                        <Icon type="wallet" /> {I18N.get('0013')}
                    </Menu.Item>
                    <Menu.Item key="list-package">
                        <Icon type="database" /> {I18N.get('0011')}
                    </Menu.Item>
                    { isAdmin &&
                        <Menu.Item key="smart-staking">
                            <Icon type="wallet" /> {I18N.get('0007')}
                        </Menu.Item>
                    }
                    { isAdmin &&
                        <Menu.Item key="setting-packages">
                            <Icon type="setting" /> {I18N.get('0012')}
                        </Menu.Item>
                    }
                </Menu>

            </Sider>

        )
    }

    clickItem(e) {
        const key = e.key
        if (_.includes([
            'home',
            'smart-staking',
            'register',
            'signup',
            'dashboard',
            'about',
            'contact',
            'profile',
            'setting-packages',
            'list-package',
            'deposit'
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

    detectUrl() {
        let url = window.location.pathname;

        let sidebar = [
            'smart-staking',
            'dashboard',
            'setting-packages',
            'list-package',
            'deposit'
        ];

        if (!url) {
            return ['dashboard']
        }

        for(var menu in sidebar) {
            try {
                if(url.indexOf(sidebar[menu]) > -1) {
                    return [sidebar[menu]];
                    break;
                }
            } catch (e) {
                return [sidebar[0]];
            }
        }
        return [sidebar[0]];
    }
}
