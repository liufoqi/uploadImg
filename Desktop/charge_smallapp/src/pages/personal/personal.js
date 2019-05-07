import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtAvatar, AtList, AtListItem, AtBadge } from 'taro-ui'
import Img from '../../util/image';
import userApi from '../../util/userApi';
import './personal.css'

export default class Model extends Component {
  constructor() {
    super(...arguments)
    this.state = {
  
      data: {
        head_url: Img.admin_iconPng,
        nick_name: '未知',
        order_size: 0
      }
    }
  }

  config = {
    navigationBarTitleText: '个人中心',
    disableScroll: true
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {
    const { openId } = getApp().userInfo;
    userApi.personalCenter({ openId: openId }).then((res) => {
      this.setState({ data: res })
    })
  }

  componentDidHide() { }

  toMyOrder = () => {
    Taro.navigateTo({
      url: '../myOrder/myOrder'
    });
  }

  toModel = () => {

    Taro.navigateTo({
      url: '../model/model'
    });
  }

  toWallet = () => {
    Taro.navigateTo({
      url: '../wallet/wallet'
    });
  }

  toRechargeRecord = () => {
    Taro.navigateTo({
      url: '../rechargeRecord/rechargeRecord'
    });
  }

  toCourse = () => {
    Taro.navigateTo({
      url: '../course/course'
    });
  }

  toCustomerService = () => {
    Taro.navigateTo({
      url: '../customerService/customerService'
    });
  }

  render() {
    const { head_url, nick_name, order_size } = this.state.data
    return (
      <View className='personal'>
        <View className='user'>
          <Image src={Img.admin_bgPng}></Image>
          <View className='admin'>
            <AtAvatar circle image={head_url} className='admin_img'></AtAvatar>
            <Text className='admin_text'>{nick_name}</Text>
          </View>
        </View>
        <View className='content'>
          <AtBadge className='indent_num' value={order_size} maxValue={99}></AtBadge>
          <AtList>
            <AtListItem onClick={this.toMyOrder} title='我的订单' arrow='right' thumb={Img.indentPng} />
            <AtListItem onClick={this.toModel} title='我的车型' arrow='right' thumb={Img.chePng} />
            <AtListItem onClick={this.toWallet} title='我的钱包' arrow='right' thumb={Img.walletPng} />
            <AtListItem onClick={this.toRechargeRecord} title='充值记录' arrow='right' thumb={Img.rechargePng} />
            <AtListItem onClick={this.toCourse} title='新手帮助' arrow='right' thumb={Img.helpPng} />
            <AtListItem onClick={this.toCustomerService} title='联系客服' arrow='right' thumb={Img.servicePng} />
          </AtList>
        </View>
      </View>
    )
  }
}
