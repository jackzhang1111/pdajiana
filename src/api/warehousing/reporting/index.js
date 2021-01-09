import { main, park } from '@/api/index'
//上报列表
export function queryreportListApi(params) {
    return park({
        url: `/stockreport/queryreportList`,
        method: 'POST',
        data: params
    })
}
//上报详情
export function queryRegionNameListApi(params) {
    return park({
        url: `/stockreport/queryRegionNameList`,
        method: 'POST',
        data: params
    })
}

//上报提交
export function addreportModelApi(params) {
    return park({
        url: `/stockreport/addreportModel`,
        method: 'POST',
        data: params
    })
}

