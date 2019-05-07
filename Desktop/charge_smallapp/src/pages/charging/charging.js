import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import Img from '../../util/image';
import orderApi from '../../util/orderApi'
import './charging.css'

export default class Charging extends Component {
  config = {
    navigationBarTitleText: '充电中'
  }
  constructor(props) {
    super(props);
    // 必须存在this.state中
    this.state = {
      isAddCar: false,
      //  isEndCharge:false,
      isSpread:false,
      isHint:true, 
    }
  }
  //添加爱车
  addCar = ()=> {
   Taro.navigateTo({
     url:'../modelSelect/modelSelect'
   })
  }
//自动隐藏提示
autoHidenHint(){
  const a=setTimeout(()=>{
    this.setState({
      isHint:false,
    })
  },2000)
  console.log(a)
}
//打开帮助页面
showSpread(){
this.setState({
  isHint:false,
  isSpread:true,
})
}
//联系客服
lianxikefu(){
  Taro.navigateTo({
    url:'../customerService/customerService'
  })
}
//保修检测
 baoxiu(){
  Taro.navigateTo({
    url:'../reportRepair/reportRepair'
  })
 }
//收回帮助页面
showBack(){
  this.setState({
    isSpread:false,
  })
}
endCharge() {
    orderApi.endCharging({ order_num: this.props.orderNum }).then(() => {
      // console.log('结束成功');
    })

  }
  componentWillMount() { }

  componentDidMount() {
    this.autoHidenHint()
   }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { data } = this.props;
    const isAddCar = this.state.isAddCar
    const isSpread=this.state.isSpread
    const isHint=this.state.isHint
    // const isEndCharge=this.state.isEndCharge
    return (
      <View className='charging'>
        <View className='top'>
          {data.is_bind_type && <View className='topL'>
            <View className='topLtl'>充满剩余</View>
            <Image src={Img.timePng} />
            <View className='topLm'></View>
            <View className='topLb'>{data.estimate_time}</View>
          </View>}
          <View className='topM'>
            {data.is_bind_type && <View className='topMt'>充电速度{data.charge_speed}km/h</View>}
            <View className='topMml'>{data.soc}</View>
            <View className='topMmr'>%</View>
            <View className='topMb'>SOC</View>
          </View>
          {data.is_bind_type && <View className='topR'>
            <View className='topRtr'>预计行驶</View>
            <Image src={Img.logationPng} />
            <View className='topRm'></View>
            <View className='topRb'>{data.mileage}km</View>
          </View>}
          <Image src={Img.topPng} />
        </View>
        <View className='mt'>
          <View className='mtlt'>实时电流</View>
          <View className='mtlb'>{data.voltage}</View>
          <View className='mtlbr'>A</View>
          <View className='mtm'></View>
          <View className='mtrt'>实时电压</View>
          <View className='mtrb'>{data.current}</View>
          <View className='mtrbr'>V</View>
        </View>
        <View className='mb'>
          <View className='mbt'>
            <View className='circle'></View>
            <View className='mbtt'>已充时长</View>
            <View className='mbtr'>{data.charge_time}</View>
            <View className='mbtrr'>分</View>
          </View>
          <View className='mbtb mbty'></View>
          <View className='mbm'>
            <View className='circle'></View>
            <View className='mbtt'>已充电量</View>
            <View className='mbtr'>{data.charging_degree}</View>
            <View className='mbtrr'>度</View>
          </View>
          <View className='mbmb mbty'></View>
          <View className='mbb'>
            <View className='circle'></View>
            <View className='mbtt'>充电金额</View>
            <View className='mbtr'>{data.charge_amount}</View>
            <View className='mbtrr'>元</View>
          </View>
        </View>
        {!data.is_bind_type && <View className='btt'>
          <Image src={Img.licheng} />
          <View className='bttm'>想要获取当前可行驶里程？</View>
          <View className='bttr' onTouchStart={this.addCar}>添加爱车</View>
        </View>}
        <View className='bttb'>当前电费0.5元/度，服务费0.8元/度</View>
        <View className='bt' onTouchStart={this.endCharge}>结束充电</View>
        <View className='bb'>金额用完或电量充满自动结束充值</View>
        <View>
      {isHint&&<View className='showHint' onTouchStart={this.showSpread}> <Image src={Img.showBg} />有问题点我哦</View>}
      {!isSpread
      ?<View className='br' onTouchStart={this.showSpread}><Image src={Img.zhankai} /></View>
      :<View className='brshow'>
      <View className='brl' onTouchStart={this.showBack}><Image  src={Img.shouqi} /></View>
      <View className='brr' onTouchStart={this.baoxiu}><Image  src={Img.baoxiuHidden} /></View>
      <View className='brm brct' onTouchStart={this.lianxikefu}><Image  src={Img.servicePng} /></View>
      </View>}
      </View>
      </View>
    )
  }
}
