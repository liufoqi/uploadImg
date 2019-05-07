import Taro, { Component } from '@tarojs/taro'
import { View,Image } from '@tarojs/components'
import Img from '../../util/image';
import './rechargeSuccess.css'


export default class RechargeRecord extends Component {

  config = {
    navigationBarTitleText:'充值成功'
  }
  constructor(){
    this.state={
      orderNum:''
    }
  }

  componentWillMount () {
    const { orderNum } = this.$router.params ;
    this.setState({orderNum:orderNum})
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  toCharged=()=>{
    Taro.navigateTo({
      url:'../orderDetail/orderDetail?orderNum='+this.state.orderNum
    })
  }

  toIndex = () => {
    Taro.redirectTo({
      url:'/pages/index/index'
    })
  }

  render () {
    return (
      <View className='rechargeSuccess'>
       <View className='tt'><Image src={Img.success}/></View>
       <View className='tm'>订单支付成功</View>
       <View className='tb'>您可以在我的订单中查询详情</View>
       <View className='bt' onClick={this.toCharged}>查看充电详情</View>
       <View className='bb' onClick={this.toIndex}>返回首页</View>
      </View>
    )
  }
}
