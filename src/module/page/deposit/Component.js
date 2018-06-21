import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import Tx from 'ethereumjs-tx'
import { Link } from 'react-router-dom'
import './style.scss'
import { MIN_VALUE_DEPOSIT } from '@/constant'
import moment from 'moment/moment'

import { Col, Row, Icon, Form, Input, Button, Dropdown, Breadcrumb, Modal, Menu, Checkbox, Alert, Message, InputNumber, notification} from 'antd'
const FormItem = Form.Item;

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobi l e') !== -1);
};

const isMobile = isMobileDevice();

Message.config({
    top: 100
})

export default class extends LoggedInPage {

    componentDidMount() {
        this.init();
    }

    loadData() {
        this.props.getFundBonus().then((fundBonus) => {
            this.setState({fundBonus})
        })

        this.props.getBalance().then((balance) => {
            this.setState({balance})
        })
        this.props.getPackagesInfo().then((packages) => {
            this.setState({
                package7daysReward:packages.package1[1].toString()/100,
                package30daysReward:packages.package2[1].toString()/100,
                package90daysReward:packages.package3[1].toString()/100,
                package180daysReward:packages.package4[1].toString()/100
            })
        })
    }

    init(){
        this.setState({
            isLoading:false
        })
        this.setState({
            currentReward:null,
        })
        this.props.getFundBonus().then((fundBonus) => {
            this.setState({fundBonus})
        })

        this.props.getBalance().then((balance) => {
            this.setState({balance})
        })
        this.props.getPackagesInfo().then((packages) => {
            this.setState({
                package7daysReward:packages.package1[1].toString()/100,
                package30daysReward:packages.package2[1].toString()/100,
                package90daysReward:packages.package3[1].toString()/100,
                package180daysReward:packages.package4[1].toString()/100
            })
        })
    }


    renderPackageDropdown() {
        const menu = (
            <Menu onClick={this.handleMenuClick.bind(this)} >
                <Menu.Item key="7">7 days ({parseFloat(this.state.package7daysReward).toFixed(2)}%)</Menu.Item>
                <Menu.Item key="30">30 days ({parseFloat(this.state.package30daysReward).toFixed(2)}%)</Menu.Item>
                <Menu.Item key="90">90 days ({parseFloat(this.state.package90daysReward).toFixed(2)}%)</Menu.Item>
                <Menu.Item key="180">180 days ({parseFloat(this.state.package180daysReward).toFixed(2)}%)</Menu.Item>
            </Menu>
        );

        return (

            <Dropdown overlay={menu} className="defaultWidth" >

                <Button className="defaultWidth">
                    {this.state.package ? this.state.package + " days" : "Please Choose"}  <Icon type="down" />
                </Button>

            </Dropdown>
        )
    }

    handleMenuClick(e) {
        this.setState({
            package: e.key,
            isLoading: false,
            txhash: null
        })

        var value=null;
        if (e.key=='7') value=this.state.package7daysReward;
        if (e.key=='30') value=this.state.package30daysReward;
        if (e.key=='90') value=this.state.package90daysReward;
        if (e.key=='180') value=this.state.package180daysReward;
        this.setState({
            currentReward: value
        })
    }

    validValue(value) {
      var deciPart = (value + ".").split(".")[1];
    //   console.log(deciPart)
      if (deciPart.length>2) {return value.toFixed(2)} else {return value};
    }

    onAmountChange(value) {
      if (this.state.balance<value) {
        this.setState({
            notEnoughNTY: <p className="alert-no-padding">Your balance is not enough</p>,
        })
      } else
      this.setState({
          notEnoughNTY: null
      })
        this.setState({
            amount: this.validValue(value),
            txhash: null,
        })
    }

    onChangeCheckbox(e) {
        this.setState({
            checkedTerms: e.target.checked
        })
    }

    ord_renderContent () {
        const self = this;
        let alerts = [];
        if(this.state.submitted) {
            const error = self.validate();
            if(error) {
                alerts.push(<Alert message={error} type="error" showIcon />)
            }
        }

        // let alerts = [];
        // if(this.state.error) {
        //     alerts.push(<Alert message={this.state.error} type="error" showIcon />)
        // }

        let txhash = null;
        if (this.state.txhash) {
            const message = 'Transaction hash: ' + this.state.txhash
             txhash = <Alert description={message} type="success" showIcon />
        }



        // const valid = this.state.package && this.state.amount && (alerts.length == 0);
        // if(valid) {
        //     alerts = [];
        // }

        return (
            <div className="">
                <div className="ebp-header-divider">

                </div>
                <div className="ebp-page">
                    <h3 className="text-center">Smart Staking Information</h3>
                    <div className="ant-col-md-18 ant-col-md-offset-3 text-alert" style={{'textAlign': 'left'}}>
                        <Row>
                            {alerts}
                        </Row>
                        {this.state.txhash &&
                        <Row>
                          <Col span={6}>
                              TxHash:
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={0} xl={0}/>
                          <Col span={18}>
                            {this.state.txhash &&
                                  <div>
                                      {this.state.txhash} {this.state.isLoading ? <img src='/assets/images/Loading.gif' style = {{'width' : '20px'}} /> :
                                      <Icon type="check" style={{ fontSize: 24, color: '#4CAF50' }}/>}
                                  </div>
                            }
                            </Col>
                        </Row>
                        }
                    </div>
                    <div className="ant-col-md-18 ant-col-md-offset-3" style={{'textAlign': 'left'}}>
                    <Row>
                        <Col span={6}>
                            Your balance:
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={0} xl={0}/>
                        <Col span={18}>
                            {parseFloat(this.state.balance).toFixed(2)} NTY
                        </Col>
                    </Row>
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={6}>
                            Reward pool:
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={0} xl={0}/>
                        <Col span={18}>
                            {parseFloat(this.state.fundBonus).toFixed(2)} NTY
                        </Col>
                    </Row>
                    <hr />
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={6}>
                            Package:
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={0} xl={0}/>
                        <Col span={6}>
                            {this.renderPackageDropdown()}
                        </Col>
                    </Row>
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={6}>
                            Amount:
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={0} xl={0}/>
                        <Col span={6}>

                            <InputNumber className="defaultWidth"
                                defaultValue={0}
                                value={this.state.amount}
                                onChange={this.onAmountChange.bind(this)}
                            />
                        </Col>
                    </Row>
                    { !this.validate() &&
                    <Row style={{'marginTop': '15px'}}>
                        <Col span={6}>
                            Total estimated Reward:
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={0} xl={0}/>
                        <Col span={18}>
                            {(this.state.amount*(this.state.currentReward/100)).toFixed(2)} NTY
                        </Col>
                    </Row>
                    }
                    <Row style={{'marginTop': '12px'}}>
                        <Col span={6}>

                        </Col>
                        <Col xs={24} sm={24} md={24} lg={0} xl={0}/>
                        <Col span={18}>
                            <Checkbox checked={this.state.checkedTerms} onChange={this.onChangeCheckbox.bind(this)}>I have read and accepted the Terms & Conditions.</Checkbox>
                        </Col>
                    </Row>

                    <Row style={{'marginTop': '15px'}}>
                        <Col span={6}>

                        </Col>
                        <Col xs={24} sm={24} md={24} lg={0} xl={0}/>
                        <Col span={18}>
                            <Button disabled={(!this.state.checkedTerms) || this.state.isLoading} onClick={this.confirm.bind(this)} type="primary" className="btn-margin-top">Add</Button>
                        </Col>
                    </Row>
                    </div>
                </div>

            </div>
        )
    }

    ord_renderBreadcrumb() {
        return (
            <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
                <Breadcrumb.Item><Link to="/dashboard"><Icon type="home" /> Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item> Deposit</Breadcrumb.Item>
            </Breadcrumb>
        );
    }

    confirm () {
        const error = this.validate();
        this.setState({
            error: error,
            submitted: true
        });
        if(error) {
            return;
        }

        const _package = this.state.package;
        const package_timestamp = parseInt(_package) * 24 * 60 * 60 * 1000;
        const expire_timestamp = new Date().getTime() + package_timestamp + 7 * 24 * 60 * 60 * 1000;
        const expire_date = new Date(expire_timestamp);
        const expire_date_default_format= moment.utc(expire_date).format('DD/MM/YYYY') ;
    //    const expire_month = expire_date.getMonth() + 1;
    //    const expire_day = expire_date.getDate();
    //    const expire_year = expire_date.getFullYear();

        const content = (
            <div>
                <div>
                    Package: {this.state.package} days
                </div>
                <div>
                    Amount: {this.state.amount} NTY
                </div>
                <div>
                    Estimated reward: {(this.state.amount*(this.state.currentReward/100)).toFixed(2)} NTY
                </div>
                <div>
                    Maturity date: {expire_date_default_format}
                </div>
            </div>
        );

        Modal.confirm({
            title: 'Are you sure?',
            content: content,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                this.onConfirmDeposit()
            },
            onCancel() {
            }
        })
    }

    onConfirmDeposit() {
        const mapsDaysToPackage = {
            '7': 1,
            '30': 2,
            '90': 3,
            '180': 4
        }
        this.setState({
            isLoading: true
        });

        const self = this;
        this.props.deposit(mapsDaysToPackage[this.state.package], this.state.amount).then((result) => {
            if (!result) {
                Message.error('Cannot send smart staking transaction!')
            }

            var event = self.props.getEventJoinSmartStaking()
            event.watch(function (err, response) {
                if(response.event == 'JoinSmartStaking') {
                    self.setState({
                        tx_success: true,
                        isLoading: false
                    });
                    self.loadData();
                    notification.success({
                        message: 'Smart staking success',
                        description: 'Deposit successfully!',
                    });
                    event.stopWatching()
                }
            });

            Message.success('Smart staking transaction has been sent successfully!')
            this.setState({
                txhash: result,
                amount: '',
                package: null,
                submitted: false,
                checkedTerms: false
            })
        })
        //setTimeout(this.loadData.bind(this), 6000);

    }

    validate() {
        let errorFields = [];
        if ((this.state.amount*(this.state.currentReward/100)).toFixed(2)>this.state.fundBonus) errorFields.push(<p className="alert-no-padding">Reward Pool is not enough</p>);
        if(this.state.notEnoughNTY) {
            errorFields.push(this.state.notEnoughNTY);
        }

        if(!this.state.package) {
            errorFields.push(<p className="alert-no-padding">Package is required</p>);
        }
        if(!this.state.amount && this.state.amount !== 0) {
            errorFields.push(<p className="alert-no-padding">Amount is required</p>);
        }
        if(this.state.amount < MIN_VALUE_DEPOSIT) {
            errorFields.push(<p className="alert-no-padding">Amount must be equal or greater than { MIN_VALUE_DEPOSIT } NTY</p>);
        }
        if(errorFields.length == 0) return null;
        return (
            <div>
                {errorFields}
            </div>
        )
        // return errorFields.join(", "); //+ " is required.";
    }
}
