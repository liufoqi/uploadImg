import Config from "./config"
import request from "./request"

function login(_data) {  //用户登陆
  const url = `user/${Config.appId}/login`;
  // 这里只负责： 请求参数处理
  return request.GET(url, _data)
}

//用户信息
function userInfo(_data) {
  const url = `user/${Config.appId}/userInfo`;
  return request.GET(url, _data)
}

//用户电话
function getUserPhone(_data) {
  const url = `user/${Config.appId}/getUserPhone`;
  return request.GET(url, _data)
}

//更新老司机
function updateOldDriver(_data) {
  const url = `user/${Config.appId}/updateOldDriver`;
  return request.GET(url, _data)
}

//个人中心
function personalCenter(_data) {
  const url = `user/${Config.appId}/personalCenter`;
  return request.GET(url, _data)
}



export default {
  login: login,
  userInfo: userInfo,
  getUserPhone: getUserPhone,
  updateOldDriver: updateOldDriver,
  personalCenter: personalCenter
};
