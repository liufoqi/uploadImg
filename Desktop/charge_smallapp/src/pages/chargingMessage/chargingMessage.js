import Taro, { Component } from '@tarojs/taro'
import { View,Image} from '@tarojs/components'
import Img from '../../util/image';
import './chargingMessage.css'


export default class Charging extends Component {
  config = {
    navigationBarTitleText: '充电信息'
  }
  constructor(props) {
    super(props);
    // 必须存在this.state中
    this.state = {
      isSpread:false,
      isHint:true,
    }
  }
 help(){
  Taro.navigateTo({
    url:'../course/course'
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
  endCharge(){
   
  }
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const isSpread=this.state.isSpread
    const isHint=this.state.isHint
    return (
      <View className='charging'>
      <View className='top'>
       <View className='topM'>
       <View className='topMt'>充电速度2km/h</View>
       <View className='topMml'>42</View>
       <View className='topMmr'>%</View>
       <View className='topMb'>SOC</View>
       </View>
        <Image src={Img.topPng} />
       </View>
      <View className='mt'>
        <View className='mtlt'>需求电流</View>
        <View className='mtlb'>120</View>
        <View className='mtlbr'>  A</View>
        <View className='mtm'></View>
        <View className='mtrt'>需求电压</View>
        <View className='mtrb'>360</View>
        <View className='mtrbr'>  V</View>
       </View>
      <View className='mb'>
      <View className='mbt'>
      <View className='circle'></View>
      <View className='mbtt'>最高单体电压</View>
      <View className='mbtr'>3.90</View>
      <View className='mbtrr'>v</View>
      </View>
      <View className='mbtb mbty'></View>
      <View className='mbm'>
      <View  className='circle'></View>
      <View className='mbtt'>最高允许单体电压</View>
      <View className='mbtr'>4.18</View>
      <View className='mbtrr'>v</View>
      </View>
      <View className='mbmb mbty'></View>
      <View className='mbb'>
      <View  className='circle'></View>
      <View className='mbtt'>最高测量点温度</View>
      <View className='mbtr'>16</View>
      <View className='mbtrr'>度</View>
      </View>
      </View>
      <View className='bttr' onTouchStart={this.help}>不会用？</View>
      <View className='bt' >快速充值</View>
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
