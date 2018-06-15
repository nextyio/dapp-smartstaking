import React from 'react';
import StandardPage from '../StandardPage';
import LoginForm from '@/module/form/LoginForm/Container';
import Footer from '@/module/layout/Footer/Container';

import './style.scss'

export default class extends StandardPage {
    ord_renderContent() {
        return (
            <div>
                <div className="p_login ebp-wrap">
                    <div className="d_box">
                        <LoginForm />

                    </div>

                </div>
                <Footer />
            </div>
        );
    }

    ord_checkLogin(isLogin) {
        if (isLogin) {
            this.props.history.replace('/dashboard');
        }
    }
}
