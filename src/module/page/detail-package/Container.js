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
        async getPackageInfo(index) {
            return await contractService.getPackageInfo(index)
        },
        async callFunction(functionName, params) {
          return await contractService.callFunction(functionName, params)
        }
    }
})
