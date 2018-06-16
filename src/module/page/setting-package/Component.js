import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'
import { Link } from 'react-router-dom'

import './style.scss'

import { Col, Row, Icon, Form, Input, Button, InputNumber, Breadcrumb, Modal, Menu, Checkbox, Alert } from 'antd'
const FormItem = Form.Item;

export default class extends LoggedInPage {
  componentDidMount() {
      this.loadData()
  }

  loadData() {
      this.props.getFund().then((fund) => {
          this.setState({fund})
      })

      this.props.getFundBonus().then((fundBonus) => {
          this.setState({fundBonus})
      })

      this.props.getPackagesInfo().then((packages) => {
          this.setState({
              package7daysPosted:false,
              toReset_percent_7days: packages.package1[1].toString(),
              toReset_percent_30days: packages.package2[1].toString(),
              toReset_percent_90days: packages.package3[1].toString(),
              toReset_percent_180days: packages.package4[1].toString(),
              percent_7days: packages.package1[1].toString(),
              percent_30days: packages.package2[1].toString(),
              percent_90days: packages.package3[1].toString(),
              percent_180days: packages.package4[1].toString(),
              package7daysReward:packages.package1[1].toString()*7,
              package30daysReward:packages.package2[1].toString()*30,
              package90daysReward:packages.package3[1].toString()*90,
              package180daysReward:packages.package4[1].toString()*180
          })
      })
  }

    ord_renderContent () {
        let {wallet, web3, contract} = this.props.profile
        let balance
        let address
        //if (this.state.package7daysSuccess) console.log('done');

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
                            value={this.state.percent_7days}
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
                            value={this.state.percent_30days}
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
                            value={this.state.percent_90days}
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
                            value={this.state.percent_180days}
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

    clear(){
        this.setState({
          package7daysPosted:null,
          package30daysPosted:null,
          package90daysPosted:null,
          package180daysPosted:null,
          package7daysSuccess:null,
          package30daysSuccess:null,
          package90daysSuccess:null,
          package180daysSuccess:null
        })
    }

    set () {
        //console.log('xxx', this.state.package7daysReward);
        this.clear.bind(this);
        if (this.state.percent_7days != this.state.toReset_percent_7days) {
            this.props.callFunction('setupPackage1', [this.state.percent_7days]).then((result) => {
                this.setState({
                    package7daysSuccess:result,
                })
            });
            this.setState({
                package7daysPosted:true,
            })
        }

        if (this.state.percent_30days != this.state.toReset_percent_30days) {
            this.props.callFunction('setupPackage2', [this.state.percent_30days]).then((result) => {
                this.setState({
                    package30daysSuccess:result,
                })
            });
            this.setState({
                package30daysPosted:true,
            })
        }

        if (this.state.percent_90days != this.state.toReset_percent_90days) {
            this.props.callFunction('setupPackage3', [this.state.percent_90days]).then((result) => {
                this.setState({
                    package30daysSuccess:result,
                })
            });
            this.setState({
                package90daysPosted:true,
            })
        }

        if (this.state.percent_180days != this.state.toReset_percent_180days) {
            this.props.callFunction('setupPackage4', [this.state.percent_180days]).then((result) => {
                this.setState({
                    package180daysSuccess:result,
                })
            });
            this.setState({
                package180daysPosted:true,
            })
        }

    }

    reset () {
      this.setState({
          percent_7days: this.state.toReset_percent_7days,
          percent_30days: this.state.toReset_percent_30days,
          percent_90days: this.state.toReset_percent_90days,
          percent_180days: this.state.toReset_percent_180days,
          package7daysReward:this.state.toReset_percent_7days*7,
          package30daysReward:this.state.toReset_percent_30days*30,
          package90daysReward:this.state.toReset_percent_90days*90,
          package180daysReward:this.state.toReset_percent_180days*180,
      })
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
