import request from "./request"

//搜索历史记录
function historySearch(_data) {  //这个要写这里？ _data是 body参数  调用POST的时候传给他 前面看我怎么穿
  const url = 'user/search/historySearch';
  // 这里只负责： 请求参数处理
  return request.GET(url, _data)
}

//删除搜索记录
function delHistorySearch(_data) {
  const url = "user/search/delHistorySearch?openId=" + _data.openId;
  return request.DELETE(url, _data)
}

//添加搜索记录
function addHistoryInfo(_data) {
  const url = "user/search/addSearchInfo"
  return request.POST(url, _data)
}

export default {
  historySearch: historySearch,
  delHistorySearch: delHistorySearch,
  addHistoryInfo: addHistoryInfo
}