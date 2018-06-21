import React from 'react';
import StandardPage from '../StandardPage';
import Footer from '@/module/layout/Footer/Container'
import { Link } from 'react-router-dom'

import { Icon, Breadcrumb } from 'antd'

export default class extends StandardPage {

    ord_renderContent () {
        return (
            <div className="">
                <div className="ebp-header-divider">

                </div>
                <div className="ebp-page">
                    <h3 className="text-center">User Guide</h3>
                    <p>Nexty’s unique Smart Staking program plays an active role in user’s staking decisions, which helps the price stabilization program by controlling supply and demand. Smart Staking encourages users to keep the coins with different interest rate incentives throughout different program lengths.</p>
                </div>
            </div>
        )
    }

    ord_renderBreadcrumb() {
        return (
            <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
                <Breadcrumb.Item><Link to="/dashboard"><Icon type="home" /> Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item> Smart Staking</Breadcrumb.Item>
            </Breadcrumb>
        );
    }
}
