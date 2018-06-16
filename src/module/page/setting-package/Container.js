import {createContainer} from '@/util'
import Component from './Component'
import ContractService from '@/service/ContractService'

export default createContainer(Component, (state) => {
    return {
        ...state.user
    }
}, () => {
    const contractService = new ContractService()

    return {
        async getFund() {
            return await contractService.getFund()
        },
        async getFundBonus() {
            return await contractService.getFundBonus()
        },
        async getPackagesInfo() {
            return await contractService.getPackagesInfo()
        }
    }
})

/*import {createContainer} from '@/util'
import Component from './Component'

export default createContainer(Component, (state) => {
    return {
        ...state.user
    }
})
*/
