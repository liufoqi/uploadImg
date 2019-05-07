//电装API
import r from "./request"

//导航电桩
function chargeInfo(_data) {
    const url = "station/record/chargeInfo";
    return r.POST(url, _data)
}

//搜索电桩
function search(_data) {
    const url = "station/search";
    return r.GET(url, _data)
}

export default {
    chargeInfo: chargeInfo,
    search: search
}