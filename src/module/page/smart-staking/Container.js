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
        async getFundBonus() {
            return await contractService.getFundBonus()
        },
        async deposit(packageId, amount) {
            return await contractService.deposit(packageId, amount)
        }
    }
})
