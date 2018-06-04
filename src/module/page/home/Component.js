import React from 'react';
import StandardPage from '../StandardPage';
import _ from 'lodash'

import './style.scss'

import { Col, Row, List, Button } from 'antd'
import Footer from '@/module/layout/Footer/Container'
import moment from 'moment/moment'

export default class extends StandardPage {

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    getCoreTenets() {
        return [
            'Organizers are decided by a transparent voting system',
            'Voting power (EVP) is only earned through participation',
            'Nexty can only veto tasks and define the ELA rewards'
        ]
    }

    ord_renderContent(){

        const backdropStyle = {
            backgroundPosition: '0 50%',
            backgroundImage: `url('/assets/images/HomeHeader.jpg')`
        }

        return (
            <div className="c_Home">
                <div className="d_topBackdrop" style={backdropStyle}>
                    <div className="d_topBackdrop_title">
                        Nexty Smart Staking
                    </div>
                </div>
                <div className="horizGap">

                </div>
                <Row className="d_rowPrograms">
                    <Col span={8}>
                        <a href="/">
                            <img src="/assets/images/Home_Developers.png" />
                            <h3>
                                Smart Staking
                            </h3>
                        </a>
                    </Col>
                    <Col span={8} className="d_colProgram_middle">
                        <a href="/">
                            <img src="/assets/images/ss.jpeg" />
                            <h3>
                                Smart Staking
                            </h3>
                        </a>
                    </Col>
                    <Col span={8}>
                        <a href="/">
                            <img src="/assets/images/Home_Leader.png" />
                            <h3>
                                Smart Staking
                            </h3>
                        </a>
                    </Col>
                </Row>
                <div className="horizGap d_rowGrey">

                </div>

                <Footer />
            </div>
        );
    }
}
