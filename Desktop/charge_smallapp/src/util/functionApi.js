//功能模块
import request from "./request"

//收集推送信息
function collectFormId(_data) {
    const url = "push/collectFormId"
    return request.POST(url, _data)
}

export default {
    collectFormId: collectFormId
}