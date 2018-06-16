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
              //package7daysPosted:false,
              toReset_7days: packages.package1[1].toString(),
              toReset_30days: packages.package2[1].toString(),
              toReset_90days: packages.package3[1].toString(),
              toReset_180days: packages.package4[1].toString(),

              package7daysReward:packages.package1[1].toString(),
              package30daysReward:packages.package2[1].toString(),
              package90daysReward:packages.package3[1].toString(),
              package180daysReward:packages.package4[1].toString()
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
                            value={this.state.package7daysReward}
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={this.onChange7Days.bind(this)}
                        />
                        </Col>
                        <Col span={4}>
                            <Button style={{'marginLeft': '15px'}} type="primary" onClick={this.set1.bind(this)} className="btn-margin-top">Set</Button>
                        </Col>
                    </Row>

                    <Row style={{'marginTop': '15px'}}>
                        <Col span={4} offset={6}>
                            30 days
                        </Col>
                        <Col span={4}>
                        <InputNumber
                            defaultValue={0}
                            value={this.state.package30daysReward}
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={this.onChange30Days.bind(this)}
                        />
                        </Col>
                        <Col span={4}>
                            <Button style={{'marginLeft': '15px'}} type="primary" onClick={this.set2.bind(this)} className="btn-margin-top">Set</Button>
                        </Col>

                    </Row>

                    <Row style={{'marginTop': '15px'}}>
                        <Col span={4} offset={6}>
                            90 days
                        </Col>
                        <Col span={4}>
                        <InputNumber
                            defaultValue={0}
                            value={this.state.package90daysReward}
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={this.onChange90Days.bind(this)}
                        />
                        </Col>
                        <Col span={4}>
                            <Button style={{'marginLeft': '15px'}} type="primary" onClick={this.set3.bind(this)} className="btn-margin-top">Set</Button>
                        </Col>

                    </Row>

                    <Row style={{'marginTop': '15px'}}>
                        <Col span={4} offset={6}>
                            180 days
                        </Col>
                        <Col span={4}>
                        <InputNumber
                            defaultValue={0}
                            value={this.state.package180daysReward}
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={this.onChange180Days.bind(this)}
                        />
                        </Col>
                        <Col span={4}>
                            <Button style={{'marginLeft': '15px'}} type="primary" onClick={this.set4.bind(this)} className="btn-margin-top">Set</Button>
                        </Col>

                    </Row>

                    <Row style={{'marginTop': '15px'}}>
                        <Col span={4} offset={6}>

                        </Col>
                        <Col span={4}>
                            <Button onClick={this.reset.bind(this)} type="primary" className="btn-margin-top">Reset</Button>
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

  /*  clear(){
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
    }*/
    set1 () {
        if (this.state.package7daysReward != this.state.toReset_7days) {
            this.props.callFunction('setupPackage1', [this.state.package7daysReward]).then((result) => {
              console.log("done1");
              this.state.toReset_7days=this.state.package7daysReward;
            })
        }
    }

    set2 (){
        if (this.state.package30daysReward != this.state.toReset_30days) {
            this.props.callFunction('setupPackage2', [this.state.package30daysReward]).then((result) => {
              console.log("done2");
              this.state.toReset_30days=this.state.package30daysReward;
            })
        }
    }

    set3 (){
        if (this.state.package90daysReward != this.state.toReset_90days) {
            this.props.callFunction('setupPackage3', [this.state.package90daysReward]).then((result) => {
              console.log("done3");
              this.state.toReset_90days=this.state.package90daysReward;
            })
        }
    }

    set4 (){
        if (this.state.package180daysReward != this.state.toReset_180days) {
            this.props.callFunction('setupPackage4', [this.state.package180daysReward]).then((result) => {
              console.log("done4");
              this.state.toReset_180days=this.state.package180daysReward;
            })
        }
    }

    set () {
        //console.log('xxx', this.state.package7daysReward);
        //this.clear.bind(this);
        if (this.state.package7daysReward != this.state.toReset_7days) {
            this.props.callFunction('setupPackage1', [this.state.package7daysReward]).then((result) => {
              console.log("done1");
              this.state.toReset_7days=this.state.package7daysReward;
            })
        }

        if (this.state.package30daysReward != this.state.toReset_30days) {
            this.props.callFunction('setupPackage2', [this.state.package30daysReward]).then((result) => {
              console.log("done2");
              this.state.toReset_30days=this.state.package30daysReward;
            })
        }

        if (this.state.package90daysReward != this.state.toReset_90days) {
            this.props.callFunction('setupPackage3', [this.state.package90daysReward]).then((result) => {
              console.log("done3");
              this.state.toReset_90days=this.state.package90daysReward;
            })
        }

        if (this.state.package180daysReward != this.state.toReset_180days) {
            this.props.callFunction('setupPackage4', [this.state.package180daysReward]).then((result) => {
              console.log("done4");
              this.state.toReset_180days=this.state.package180daysReward;
            })
        }

    }

    reset () {
      this.setState({

          package7daysReward:this.state.toReset_7days,
          package30daysReward:this.state.toReset_30days,
          package90daysReward:this.state.toReset_90days,
          package180daysReward:this.state.toReset_180days,
      })
    }

    onChange7Days(value) {
        this.setState({
            package7daysReward: value
        });
    }
    onChange30Days(value) {
        this.setState({

            package30daysReward: value
        });
    }
    onChange90Days(value) {
        this.setState({
            package90daysReward: value
        });
    }
    onChange180Days(value) {
        this.setState({
            package180daysReward: value
        });
    }
}
