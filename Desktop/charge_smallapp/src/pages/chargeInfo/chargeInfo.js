import Taro, { Component } from '@tarojs/taro'
import { View,Image,Form,Button } from '@tarojs/components'
import Img from '../../util/image';
import functionApi from '../../util/functionApi';
import './ChargeInfo.css'

const soc = parseInt(Math.random() * 36);
export default class ChargeInfo extends Component {
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
  //新手教程
  help(){
    Taro.navigateTo({
      url:'../course/course'
    })
  }
  componentWillMount () { }

  componentDidMount () {
    this.autoHidenHint()
   }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  toRecharge = e => {
    const { formId } = e.detail;
    const { openId } = getApp().userInfo;
    functionApi.collectFormId({ openId: openId, formId: formId }).then(res => {
      console.log('收集formid成功')
    }).catch(err => {
      console.log(err);
    })
    
    if(getApp().userInfo.openId===''){
      Taro.navigateTo({
        url:'../login/login'
      }) 
    }else{
      Taro.navigateTo({
        url:'../recharge/recharge?soc='+soc
      })
    }
  }
  render () {
    const isSpread=this.state.isSpread
    const isHint=this.state.isHint
    return (
      <View className='charging'>
      <View className='top'>
       <View className='topL'>

       </View>
       <View className='topM'>
       <View className='topMml'>{soc}</View>
       <View className='topMmr'>%</View>
       <View className='topMb'>SOC</View>
       </View>
       <View className='topR'>

      </View>
        <Image src={Img.topPng} />
       </View>
      <View className='mt'>
        <View className='mtlt'>需求电流</View>
        <View className='mtlb'>120</View>
        <View className='mtlbr'>A</View>
        <View className='mtm'></View>
        <View className='mtrt'>需求电压</View>
        <View className='mtrb'>360</View>
        <View className='mtrbr'>V</View>
       </View>
      <View className='mb'>
      <View className='mbt'>
      <View className='circle'></View>
      <View className='mbtt'>最高单体电压</View>
      <View className='mbtr'>37</View>
      <View className='mbtrr'>分</View>
      </View>
      <View className='mbtb mbty'></View>
      <View className='mbm'>
      <View  className='circle'></View>
      <View className='mbtt'>最高允许单体电压</View>
      <View className='mbtr'>3.9</View>
      <View className='mbtrr'>kwh</View>
      </View>
      <View className='mbmb mbty'></View>
      <View className='mbb'>
      <View  className='circle'></View>
      <View className='mbtt'>最高监测点温度</View>
      <View className='mbtr'>120</View>
      <View className='mbtrr'>元</View>
      </View>
      </View>
      {/* <View  onClick={this.toRecharge}></View> */}
      <View className='bttr' onTouchStart={this.help} >不会用？</View>
      <Form onSubmit={this.toRecharge} reportSubmit={1}>
            <Button className='bt' formType='submit'>快速充值</Button>
      </Form>
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
