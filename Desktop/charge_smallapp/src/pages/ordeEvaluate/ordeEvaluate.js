import Taro, { Component } from '@tarojs/taro'
import { View,Image } from '@tarojs/components'
import Img from '../../util/image';
import './ordeEvaluate.css'

export default class RechargeRecord extends Component {

  config = {
    navigationBarTitleText: '评价成功'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  
  toIndex(){
    Taro.redirectTo({
        url:'../index/index'
    })
  }

  render () {
    return (
      <View className='ordeEvaluate'>
       <View className='top'>
         <Image src={Img.pingjiaSuccess} />
       </View>
       <View className='mt'>感谢您的评价</View>
       <View className='mm'>我们会持续改善您的使用体验</View>
       <View className='mb' onClick={this.toIndex}>返回首页</View>
      </View>
    )
  }
}
