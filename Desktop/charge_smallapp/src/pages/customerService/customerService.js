import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './customerService.css'

export default class CustomerService extends Component {

  config = {
    navigationBarTitleText: '联系客服'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='customerService'>
      <View className='at-article'>
        <View className='at-article__h1'>
        联系客服
        </View>
        <View className='at-article__content'>
          <View className='at-article__section'>
            <View className='at-article__h3'> 当您使用的国家电网充电桩出现故障时，拨打24小时免费热线 95598-1-7。我们的客服人员将会与您及时联系，为您处理此申请,感谢您长期以来对我们工作的支持!</View>
            <View className='at-article__h3'> 1.当您在国家电网充电桩上进行充电时，若充电桩发生故障，您可以拨打95598服务热线，进行故障报修。电话报修后，我们会在第一时间派人维修。</View>
            <View className='at-article__h3'> 2.在充电桩异常状态下，请您尽量远离充电桩或桩与车的连接位置，以保证您的人身安全后在进行电话报修。</View>
          </View>
        </View>
      </View>
    </View>
    )
  }
}
