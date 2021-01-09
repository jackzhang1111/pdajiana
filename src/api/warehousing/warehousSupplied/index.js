import {main, park} from '@/api/index'
//供货入库接口
export function supplyorderlistApi(params) {
    return park({
        url:`/storage/supplyorderlist`,
        method: 'POST',
        data:params
    })
}

//供货详情接口
export function orderinfoApi(params) {
    return park({
        url:`/storage/orderinfo`,
        method: 'GET',
        params
    })
}

//待上架详情接口
export function watingtheShelvesApi(params) {
    return park({
        url:`/storage/watingtheShelves`,
        method: 'GET',
        params
    })
}

//入库信息
export function confirmationStockInApi(params) {
    return park({
        url:`/storage/ConfirmationStockIn`,
        method: 'GET',
        params
    })
}

//上架详情
export function stockInToShelvesApi(params) {
    return park({
        url:`/storage/stockInToShelves`,
        method: 'POST',
        data:params
    })
}

//全部上架
export function stockInToShelvesAllApi(params) {
    return park({
        url:`/storage/stockInToShelvesAll`,
        method: 'POST',
        data:params
    })
}

//扫描供货单再扫描商品编码后的确定全部入库操作
export function scanproductbarcodeApi(params) {
    return park({
        url:`/storage/Scanproductbarcode`,
        method: 'POST',
        data:params
    })
}

//PDA首页订单数量统计
export function pdaselecthomeordertotalApi(params) {
    return park({
        url:`/storage/pdaselecthomeordertotal`,
        method: 'GET',
        params
    })
}

//PDA扫描入库
export function pdascanningordernoinApi(params) {
    return park({
        url:`/storage/pdascanningordernoin`,
        method: 'GET',
        params
    })
}

//PDA扫描出库
export function pdascanningordernooutApi(params) {
    return park({
        url:`/storage/pdascanningordernoout`,
        method: 'GET',
        params
    })
}

//PDA一次性加载所有库位信息
export function getwarehouseregionIDApi(params) {
    return park({
        url:`/storage/getwarehouseregionID`,
        method: 'post',
        data:params
    })
}

// 检查条码所属平台
export function checkbarcodesourceApi(params) {
    return park({
        url:`/PDAlogin/checkbarcodesource`,
        method: 'post',
        data:params
    })
}


//通过供货单Id +商品条码得到确认入库页面的信息
export function getsupplyinstockorderconfirminfoApi(params) {
    return park({
        url: `/supplystockinorder/getsupplyinstockorderconfirminfo`,
        method: 'POST',
        data: params
    })
}


//确认供货入库
export function confirmsupplyinstockorderApi(params) {
    return park({
        url: `/supplystockinorder/confirmsupplyinstockorder`,
        method: 'POST',
        data: params
    })
}


//通过供货入库单号得到确认上架页面的信息
export function getsupplyshelfuporderconfirminfoApi(params) {
    return park({
        url: `/supplystockinorder/getshelfuporderconfirminfo`,
        method: 'POST',
        data: params
    })
}


//通过入库仓库Id获取可上架的位置
export function getcanupregionlistApi(params) {
    return park({
        url: `/transferstockinorder/getcanupregionlist`,
        method: 'POST',
        data: params
    })
}
//供货入库确认上架（支持部分上架）
export function confirmsupplyshelfuporderApi(params) {
    return park({
        url: `/supplystockinorder/confirmsupplyshelfuporder`,
        method: 'POST',
        data: params
    })
}

//待上架入库单列表
export function waitingforshelfuporderlistApi(params) {
    return park({
        url:`/supplystockinorder/waitingforshelfuporderlist`,
        method: 'POST',
        params
    })
}