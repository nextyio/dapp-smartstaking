import BaseRedux from '@/model/BaseRedux';

class UserRedux extends BaseRedux {
    defineTypes() {
        return ['user'];
    }

    defineDefaultState() {
        return {
            is_login : false,
            is_admin: false,

            login_form : {
                privatekey : '',
                loading : false
            },

            profile : {
                web3 : null,
                web3Meta : null,
                wallet : null,
                isMetamask : null,
                contract : null,
                contractMeta: null
            }
        };
    }
}

export default new UserRedux()
