import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {Form, Icon, Input, Button, Checkbox} from 'antd'
import ReCAPTCHA from 'react-google-recaptcha';
import {RECAPTCHA_KEY} from '@/config/constant';

import './style.scss'

const FormItem = Form.Item

class C extends BaseComponent {

    handleSubmit(e) {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
                this.props.decryptWallet(values.privateKey)

            }
        })
    }

    getInputProps() {
        const {getFieldDecorator} = this.props.form
        const privateKey_fn = getFieldDecorator('privateKey', {
            rules: [{required: true, message: 'Please input your private key!'}],
            initialValue: ''
        })
        const privateKey_el = (
            <Input size="large"
                prefix={<Icon type="key" style={{color: 'rgba(0,0,0,.25)'}}/>}
                placeholder="Private key"/>
        )

        return {
            privateKey: privateKey_fn(privateKey_el)
        }
    }

    ord_render() {
        const {getFieldDecorator} = this.props.form
        const p = this.getInputProps()
        return (
            <div className="c_loginForm">
                <p>
                    Do you like to access your wallet ?
                </p>
                <Form onSubmit={this.handleSubmit.bind(this)} className="c_loginForm">
                    <FormItem>
                        {p.privateKey}
                    </FormItem>
                    <FormItem>
                        <Button loading={this.props.loading} type="ebp" htmlType="submit" className="">
                            Unlock
                        </Button>
                        &nbsp;&nbsp;
                        <Button loading={this.props.loading} type="blue" htmlType="button" className="">
                            Connect to Metamask
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(C)
