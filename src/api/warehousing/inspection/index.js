import { main, park } from '@/api/index'
//稽查列表
export function querystockreportListApi(params) {
    return park({
        url: `/stockreport/querystockreportList`,
        method: 'POST',
        data: params
    })
}

//稽查错误上报
export function updatereportObjectApi(params) {
    return park({
        url: `/stockreport/updatereportObject`,
        method: 'POST',
        data: params
    })
}

//稽查详情
export function queryreportObjectApi(params) {
    return park({
        url: `/stockreport/queryreportObject`,
        method: 'POST',
        data: params
    })
}

