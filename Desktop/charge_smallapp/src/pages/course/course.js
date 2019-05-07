import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import Img from '../../util/image';

import './course.css'

export default class Model extends Component {

  config = {
    navigationBarTitleText: '新手教程'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='course'>
        <View className='at-article'>
          <View className='at-article__h1'>
          小程序充电流程介绍
          </View>
          <View className='at-article__content'>
            <View className='at-article__section'>
              <View className='at-article__h3'>1.把充电枪正确插入您的电动汽车充电接口。</View>
              <View className='at-article__h3'>2.确定插抢正确后，选择预充金额，先从余额中锁定金额，如充电完成后还有剩余，会原路退回您的账户中。输入完金额后，点击确定按钮，开始充电。</View>
              <Image className='at-article__img' src={Img.course_1Png} mode='widthFix' />
              <View className='at-article__h3'>3.充电过程中可以添加爱车，可以更多了解车辆相关信息。</View>
              <Image className='at-article__img' src={Img.course_2Png} mode='widthFix' />
              <View className='at-article__h3'>4.充电过程中发生异常，请不要惊慌，您会收到小程序通知</View>
              <Image className='at-article__img' src={Img.course_3Png} mode='widthFix' />             
              <View className='at-article__h3'>5.打开小程序通知，点击查看详情，进入到订单异常页面，就可以继续充电了，或者点击小程序首页右上角的位置</View>
              <Image className='at-article__img' src={Img.course_4Png} mode='widthFix' />                          
              <Image className='at-article__img end' src={Img.course_5Png} mode='widthFix' />                          
            </View>
          </View>
        </View>
      </View>
    )
  }
}
