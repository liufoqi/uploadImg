import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import orderApi from '../../util/orderApi';
import './chargeError.css'
import Img from '../../util/image';

export default class Charged extends Component {

  config = {
    navigationBarTitleText: '充电异常'
  }
  constructor(props) {
    super(props);// 必须存在this.state中
    this.state = {
      data: {},
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
  continueRecharge() {
    orderApi.continueCharging({ order_num: this.props.orderNum }).then(() => {
      this.props.onCharging();
    }).catch(err => {
      // console.log(err);
    })
  }

  stopRecharge() {
    orderApi.endCharging({ order_num: this.props.orderNum }).then(res => {
      this.props.onCharging();
      // console.log('结束成功')
    })
  }
  componentWillMount() { }

  componentDidMount() {
    this.autoHidenHint()
    const that = this;
    const orderNum = this.props.orderNum;
    orderApi.orderDetail({ order_num: orderNum }).then((res) => {
      that.setState({ data: res });
    }).catch((err) => {
      // console.log(err);
    })
  }

  componentWillUnmount() { }

  componentDidShow() {
    //   // console.log('hhh');

  }

  componentDidHide() { }

  render() {
    const { data } = this.state;
    const isSpread=this.state.isSpread
    const isHint=this.state.isHint
    // console.log(data);
    return (
      <View className='charged'>
        <View className='topt'>
          <Image src={Img.errorPng} />
          <View className='topr'>您的订单发生异常，是否需要继续充电</View>
        </View>
        <View className='top'>
          <Image src={Img.dingdanBg} />
          <View className='ttl'><Image src={Img.cdz} /> </View>
          <View className='ttrt'>{data.name}</View>
          <View className='ttrb'>电桩编号：{data.station_id}</View>
          <View className='ttmll'>{data.charging_degree}</View>
          <View className='ttmlr'>度</View>
          <View className='ttmlm'>充电度数</View>
          <View className='ttmm'></View>
          <View className='ttmrt'>{data.charging_time}</View>
          <View className='ttmrm'>充电时长</View>
          <View className='tbl tbl1'>订单编号</View>
          <View className='tbr tbr1'>{data.order_num}</View>
          <View className='tbl tbl2'>开始时间</View>
          <View className='tbr tbr2'>{data.charging_start_time}</View>
          <View className='tbl tbl3'>结束时间</View>
          <View className='tbr tbr3'>{data.charging_end_time}</View>
          <View className='tbl tbl4'>返还金额</View>
          <View className='tbr tbr4'>(原路退回){data.return_money}</View>
          <View className='tbl tbl5'>预冻结金额</View>
          <View className='tbr tbr5'>{data.money}</View>
          <View className='tbl tbl6'>实扣金额</View>
          <View className='tbr tbr6'>￥{data.actual_amount}</View>
        </View>
        <View className='bottom'>
          <View className='bl bc'>
            <Button onTouchStart={this.continueRecharge}>继续充电</Button>
          </View>
          <View className='br bc'>
            <Button onTouchStart={this.stopRecharge}>结束充电</Button>
          </View>
        </View>
        <View>
      {isHint&&<View className='showHint' onTouchStart={this.showSpread}> <Image src={Img.showBg} />有问题点我哦</View>}
      {!isSpread
      ?<View className='br1' onTouchStart={this.showSpread}><Image src={Img.zhankai} /></View>
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
