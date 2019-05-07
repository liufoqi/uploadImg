import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import Img from '../../util/image';
import './wallet.css'


export default class Wallet extends Component {

  config = {
    navigationBarTitleText: '我的钱包'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='wallet'>
        <Image src={Img.hopefulPng}></Image>
        <View className='wallet_text'>敬请期待...</View>
      </View>
    )
  }
}
