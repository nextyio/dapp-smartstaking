import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'
import { Link } from 'react-router-dom'

import './style.scss'

import { Col, Row, Icon, Form, Input, Button, InputNumber, Breadcrumb, Modal, Menu, Checkbox, Alert, message} from 'antd'
const FormItem = Form.Item;

message.config({
    top: 100
})


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
              package30daysPosted:false,
              package90daysPosted:false,
              package180daysPosted:false,

              package7daysSuccess:false,
              package30daysSuccess:false,
              package90daysSuccess:false,
              package180daysSuccess:false,

              toReset_7days: packages.package1[1].toString()/100,
              toReset_30days: packages.package2[1].toString()/100,
              toReset_90days: packages.package3[1].toString()/100,
              toReset_180days: packages.package4[1].toString()/100,

              package7daysReward:packages.package1[1].toString()/100,
              package30daysReward:packages.package2[1].toString()/100,
              package90daysReward:packages.package3[1].toString()/100,
              package180daysReward:packages.package4[1].toString()/100
          })
      })
  }

    ord_renderContent () {
        let {wallet, web3, contract} = this.props.profile
        let balance
        let address
        //if (this.state.package7daysSuccess) //console.log('done');

        if (wallet) {
            balance = parseFloat(web3.fromWei(wallet.balance, 'ether'))
            address = wallet.getAddressString()
        }

        return (
            <div className="">
                <div className="ebp-header-divider">

                </div>
                <div className="ebp-page">
                    <h3 className="text-center">Reward rate</h3>
                    <Row>
                        <Col xs={0} sm={0} md={0} lg={6} xl={6} />
                        <Col xs={24} sm={24} md={24} lg={4} xl={4} className="defaultPadding">
                            7 days
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={4} xl={4} className="defaultPadding">
                        <InputNumber
                            className={"defaultWidth"}
                            defaultValue={0}
                            value={this.state.package7daysReward}
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={this.onChange7Days.bind(this)}
                        />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={4} xl={4} className="defaultPadding">
                            <Button type="primary" onClick={this.set1.bind(this)} className="defaultWidth" >Set</Button>
                        </Col>
                        { this.state.package7daysPosted &&
                            <div>
                                {this.state.package7daysSuccess ? (<Col xs={24} sm={24} md={12} lg={4} xl={4} className="defaultPadding">
                                    <Alert message="Success" type="success" showIcon />
                                </Col>) : (
                                <Col xs={24} sm={24} md={12} lg={4} xl={4} className="defaultPadding">
                                    <Alert message="Failed" type="error" showIcon />
                                </Col>)
                              }
                            </div>
                        }

                    </Row>

                    <Row>
                        <Col xs={0} sm={0} md={0} lg={6} xl={6} />
                        <Col xs={24} sm={24} md={24} lg={4} xl={4} className="defaultPadding">
                            30 days
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={4} xl={4} className="defaultPadding">
                        <InputNumber
                            className={"defaultWidth"}
                            defaultValue={0}
                            value={this.state.package30daysReward}
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={this.onChange30Days.bind(this)}
                        />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={4} xl={4} className="defaultPadding">
                            <Button type="primary" onClick={this.set2.bind(this)} className="defaultWidth" >Set</Button>
                        </Col>
                        { this.state.package30daysPosted &&
                            <div>
                                {this.state.package30daysSuccess ? (<Col xs={24} sm={24} md={12} lg={4} xl={4} className="defaultPadding">
                                    <Alert message="Success" type="success" showIcon />
                                </Col>) : (
                                <Col xs={24} sm={24} md={12} lg={4} xl={4} className="defaultPadding">
                                    <Alert message="Failed" type="error" showIcon />
                                </Col>)
                              }
                            </div>
                        }

                    </Row>

                    <Row>
                        <Col xs={0} sm={0} md={0} lg={6} xl={6} />
                        <Col xs={24} sm={24} md={24} lg={4} xl={4} className="defaultPadding">
                            90 days
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={4} xl={4} className="defaultPadding">
                        <InputNumber
                            className={"defaultWidth"}
                            defaultValue={0}
                            value={this.state.package90daysReward}
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={this.onChange90Days.bind(this)}
                        />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={4} xl={4} className="defaultPadding">
                            <Button type="primary" onClick={this.set3.bind(this)} className="defaultWidth" >Set</Button>
                        </Col>
                        { this.state.package90daysPosted &&
                            <div>
                                {this.state.package90daysSuccess ? (<Col xs={24} sm={24} md={12} lg={4} xl={4} className="defaultPadding">
                                    <Alert message="Success" type="success" showIcon />
                                </Col>) : (
                                <Col xs={24} sm={24} md={12} lg={4} xl={4} className="defaultPadding">
                                    <Alert message="Failed" type="error" showIcon />
                                </Col>)
                              }
                            </div>

                        }

                    </Row>

                    <Row>
                        <Col xs={0} sm={0} md={0} lg={6} xl={6} />
                        <Col xs={24} sm={24} md={24} lg={4} xl={4} className="defaultPadding">
                            180 days
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={4} xl={4} className="defaultPadding">
                        <InputNumber
                            className={"defaultWidth"}
                            defaultValue={0}
                            value={this.state.package180daysReward}
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={this.onChange180Days.bind(this)}
                        />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={4} xl={4} className="defaultPadding">
                            <Button type="primary" onClick={this.set4.bind(this)} className="defaultWidth" >Set</Button>
                        </Col>
                        { this.state.package180daysPosted &&
                            <div>
                                {this.state.package180daysSuccess ? (<Col xs={24} sm={24} md={12} lg={4} xl={4} className="defaultPadding">
                                    <Alert message="Success" type="success" showIcon />
                                </Col>) : (
                                <Col xs={24} sm={24} md={12} lg={4} xl={4} className="defaultPadding">
                                    <Alert message="Failed" type="error" showIcon />
                                </Col>)
                              }
                            </div>
                        }

                    </Row>

                    <Row>
                        <Col span={4} offset={6}>

                        </Col>
                        <Col span={4}>
                            <Button onClick={this.reset.bind(this)} type="primary" className="defaultWidth">Refresh</Button>
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
                <Breadcrumb.Item> Setting Packages</Breadcrumb.Item>
            </Breadcrumb>
        );
    }

    clear(){
        this.setState({
          package7daysPosted:false,
          package7daysSuccess:false,
          package30daysPosted:false,
          package30daysSuccess:false,
          package90daysPosted:false,
          package90daysSuccess:false,
          package180daysPosted:false,
          package180daysSuccess:false,
        })
    }

    set1 () {
        if (this.state.package7daysReward != this.state.toReset_7days) {
            this.setState({
              package7daysPosted:true,
              package30daysPosted:false,
              package90daysPosted:false,
              package180daysPosted:false,
            })
            this.props.callFunction('setupPackage1', [this.state.package7daysReward*100]).then((result) => {
              ////console.log("done1");
              this.state.toReset_7days=this.state.package7daysReward;
              this.setState({
                package7daysSuccess:true,
              })
            },
            this.setState({
              package7daysSuccess:false,
            })
          )
      }
    }

    set2 (){
        if (this.state.package30daysReward != this.state.toReset_30days) {
            this.setState({
              package7daysPosted:false,
              package30daysPosted:true,
              package90daysPosted:false,
              package180daysPosted:false,
            })
            this.props.callFunction('setupPackage2', [this.state.package30daysReward*100]).then((result) => {
              //console.log("done2");
              this.state.toReset_30days=this.state.package30daysReward;
              this.setState({
                package30daysSuccess:true,
              })
            },
            this.setState({
              package30daysSuccess:false,
            })
          )
        }
    }

    set3 (){
        if (this.state.package90daysReward != this.state.toReset_90days) {
            this.setState({
              package7daysPosted:false,
              package30daysPosted:false,
              package90daysPosted:true,
              package180daysPosted:false,
            })
            this.props.callFunction('setupPackage3', [this.state.package90daysReward*100]).then((result) => {
              //console.log("done3");
              this.state.toReset_90days=this.state.package90daysReward;
              this.setState({
                package90daysSuccess:true,
              })
            },
            this.setState({
              package90daysSuccess:false,
            })
          )
        }
    }

    set4 (){
        if (this.state.package180daysReward != this.state.toReset_180days) {
            //console.log(this.state.package90daysPosted,this.state.package90daysSuccess);
            this.setState({
              package7daysPosted:false,
              package30daysPosted:false,
              package90daysPosted:false,
              package180daysPosted:true,
            })
            this.props.callFunction('setupPackage4', [this.state.package180daysReward*100]).then((result) => {
              //console.log("done4");
              this.state.toReset_180days=this.state.package180daysReward;
              this.setState({
                package180daysSuccess:true,
              })
              return;
            },
            this.setState({
              package180daysSuccess:false,
            })
          )
        }
    }

    set () {
        ////console.log('xxx', this.state.package7daysReward);
        //this.clear.bind(this);
        if (this.state.package7daysReward != this.state.toReset_7days) {
            this.props.callFunction('setupPackage1', [this.state.package7daysReward]).then((result) => {
              //console.log("done1");
              this.state.toReset_7days=this.state.package7daysReward;
            })
        }

        if (this.state.package30daysReward != this.state.toReset_30days) {
            this.props.callFunction('setupPackage2', [this.state.package30daysReward]).then((result) => {
              //console.log("done2");
              this.state.toReset_30days=this.state.package30daysReward;
            })
        }

        if (this.state.package90daysReward != this.state.toReset_90days) {
            this.props.callFunction('setupPackage3', [this.state.package90daysReward]).then((result) => {
              //console.log("done3");
              this.state.toReset_90days=this.state.package90daysReward;
            })
        }

        if (this.state.package180daysReward != this.state.toReset_180days) {
            this.props.callFunction('setupPackage4', [this.state.package180daysReward]).then((result) => {
              //console.log("done4");
              this.state.toReset_180days=this.state.package180daysReward;
            })
        }

    }

    reset () {
      this.clear()
      this.setState({

          package7daysReward:this.state.toReset_7days,
          package30daysReward:this.state.toReset_30days,
          package90daysReward:this.state.toReset_90days,
          package180daysReward:this.state.toReset_180days,
      })
    }

    validValue(value) {
      var deciPart = (value + ".").split(".")[1];
      if (deciPart>99) {return value.toFixed(2)} else {return value};
    }

    onChange7Days(value) {
      this.clear()
        this.setState({
            package7daysReward: this.validValue(value)
        });
    }
    onChange30Days(value) {
      this.clear()
        this.setState({

            package30daysReward: this.validValue(value)
        });
    }
    onChange90Days(value) {
      this.clear()
        this.setState({
            package90daysReward: this.validValue(value)
        });
    }
    onChange180Days(value) {
      this.clear()
        this.setState({
            package180daysReward: this.validValue(value)
        });
    }
}
