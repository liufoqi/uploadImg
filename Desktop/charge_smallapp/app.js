/* eslint-disable import/first */
import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'
import './app.css'
import 'taro-ui/dist/style/index.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }


class App extends Component {

  userInfo = {
    isNovice: 0,
    openId: '',
    headUrl: '',
    phone: '',
    sessionKey: '',
    nickName: '',
  }

  config = {
    pages: [
     'pages/index/index',  //首页
      'pages/recharge/recharge',//充值
       'pages/chargeError/chargeError',//充电异常
      'pages/charged/charged',   //充电完成
       'pages/charging/charging',   //充电中
       'pages/chargeInfo/chargeInfo',   //充电信息 (快速充值)
      'pages/login/login',  //  登录（手机登录） 授权
     'pages/rechargeSuccess/rechargeSuccess',//充值成功
      //'pages/charged/charged',  //订单详情
      'pages/orderDetail/orderDetail',
      'pages/ordeEvaluate/ordeEvaluate',//感谢你的评价
      // 'pages/charging/charging',   //充电中
      'pages/reportRepair/reportRepair',// 报修
      'pages/customerService/customerService', // 联系客服
      'pages/model/model',  //  车型
      'pages/modelSelect/modelSelect',//  车型选择
      'pages/myOrder/myOrder',   //订单
      'pages/rechargeRecord/rechargeRecord',// 充值记录
      'pages/search/search',//   搜索定位
      'pages/wallet/wallet',//  钱包
      'pages/course/course', //新手教程
      'pages/personal/personal', //个人中心

    ],

    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    "permission": {
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序位置接口的效果展示"
      }
    },

  }

  componentDidMount() { }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
