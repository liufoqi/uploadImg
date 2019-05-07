//订单API
import r from "./request"

//推荐金额
function proposalMoney(_data) {
    const url = "pay/proposalMoney"
    return r.GET(url, _data)
}


//用户充值
function recharge(_data) {
    const url = "pay/recharge"
    return r.POST(url, _data)
}

//实时充电
function charging(_data) {
    const url = "charging/realTime"
    return r.GET(url, _data)
}

//结束充电
function endCharging(_data) {
    const url = "charging/endCharging"
    return r.GET(url, _data)
}

//继续充电
function continueCharging(_data) {
    const url = "charging/continueCharging"
    return r.GET(url, _data)
}

//订单列表
function orderList(_data) {
    const url = "order/orderList"
    return r.GET(url, _data)
}

//订单详情
function orderDetail(_data) {
    const url = "/order/orderDetail"
    return r.GET(url, _data)
}

//用评价信息
function evaluateList(_data) {
    const url = "order/evaluateList"
    return r.GET(url, _data)
}

//用户评价  
//TODO
function orderEvaluate(_data){
    return r.POST("order/evaluate",_data)
}

//首页订单状态
function orderState(_data) {
    const url = "order/orderState"
    return r.GET(url, _data)
}

//取消首页气泡
function bubble(_data) {
    const url = "order/bubble"
    return r.GET(url, _data)
}

export default {
    proposalMoney: proposalMoney,
    recharge: recharge,
    charging: charging,
    endCharging: endCharging,
    continueCharging: continueCharging,
    orderList: orderList,
    orderDetail: orderDetail,
    evaluateList: evaluateList,
    orderState: orderState,
    bubble: bubble,
    orderEvaluate:orderEvaluate
}