import Taro from '@tarojs/taro';
import Config from './config';

//公共的GET请求
function GET(_url, _data) {
  return new Promise((resp, rej) => {
    if(_url!=='charging/realTime'){
      Taro.showLoading({
        title: '加载中',
      })
    }
    Taro.request({
      url: `${Config.serverUrl}${_url}`,
      data: _data,
      success: res => {
        if (res.statusCode == 200 && res.data.resultCode == 200) {
          resp(res.data.resultData);
        } else {
          rej(res);
          Taro.showModal({
            title: res.data.resultMessage
          })
        }
      },
      fail: () => {
        Taro.showModal({
          title: '网络错误' + _url
        })
      },
      complete:()=>{
        Taro.hideLoading()
      }
    })
  })
}
//公共的POST请求  这里只负责读取后台数据
function POST(_url, _data) {
  return new Promise((resp) => {
    Taro.showLoading({
      title: '提交中',
    })
    Taro.request({
      url: `${Config.serverUrl}${_url}`,
      data: _data,
      header: {
        "Content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: res => {
        if (res.statusCode == 200 && res.data.resultCode == 200) {
          resp(res.data.resultData);
        } else {
          Taro.showModal({
            title: res.data.resultMessage
          })
        }
      },
      fail: () => {
        Taro.showModal({
          title: '网络错误' + _url
        })
      },
      complete:()=>{
        Taro.hideLoading()
      }
    })

  })
}

//公共的POST请求  这里只负责读取后台数据
function DELETE(_url, _data) {
  return Taro.request({
    url: `${Config.serverUrl}${_url}`,
    data: _data,
    header: {
      "Content-type": "application/x-www-form-urlencoded"
    },
    method: "DELETE"
  })
}

export default {
  GET: GET,
  POST: POST,
  DELETE: DELETE
}