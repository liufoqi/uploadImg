//车型API
import request from "./request"

//车型列表
function typeList(_data) {
    const url = "charge/typeList"
    return request.GET(url, _data)
}

//绑定车型
function updateType(_data) {
    const url = "charge/updateType"
    return request.POST(url, _data)
}

//已绑定车型
function userCharge(_data) {
    const url = "charge/userCharge"
    return request.GET(url, _data)
}

export default {
    typeList: typeList,
    updateType: updateType,
    userCharge: userCharge
}