import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components';
import './charged.css';
import Img from '../../util/image';
import orderApi from '../../util/orderApi';

let _chargedUngoodContent = []

let _chargedGoodContent = []

export default class Charged extends Component {

  config = {
    navigationBarTitleText: '订单详情'
  }
  constructor(props) {
    super(props);
    // 必须存在this.state中
    this.state = {
      isSatisfaction: false,
      isConfirm: true,
      chargedUngoodContent: _chargedUngoodContent,
      chargedGoodContent:_chargedGoodContent,
      orderResult:{},
      chargedContent: [],
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
  noSatisfaction() {
    if (this.state.isSatisfaction == true) {
      var chargedUngoodContent = this.state.chargedUngoodContent
      this.setState({
        chargedContent: chargedUngoodContent,
        isSatisfaction: false,
        isConfirm: true,
      })
    }
  }
  satisfaction() {
    if (this.state.isSatisfaction == false) {
      var chargedGoodContent = this.state.chargedGoodContent
      this.setState({
        chargedContent: chargedGoodContent,
        isSatisfaction: true,
        isConfirm: true
      })
    }
  }
  pitchUp(idx) {

    if(this.state.orderResult.is_evaluate){
        return false;
    }
    let chargedContent = this.state.chargedContent,
      thisItem = chargedContent[idx];
    thisItem.isClick = !thisItem.isClick;
    this.setState({
      chargedContent:chargedContent
    },()=>{
      this.confirm()
    })

  }
  confirm() {
    let isSelect = 0
    for(let item of this.state.chargedContent){
        if(item.isClick){
          isSelect += 1
        }
    }
    this.setState({
      isConfirm: !(isSelect>0)
    })
  }
  estimateComplate() {
    console.log('评价成功！');
    let remake = '';
    for(let item of this.state.chargedContent){
        if(item.isClick){ remake+=","+item.tag }
    }
   remake = remake.substring(1);
    orderApi.orderEvaluate({  
      order_num:this.props.orderNum,
      remark:remake,
      is_praise:this.state.isSatisfaction?"1":"0"
    }).then(res=>{
        console.log(res);
        Taro.redirectTo({
          url: '../ordeEvaluate/ordeEvaluate'
        })
    })
  }
  componentWillMount() {
    let chargedContent= [];
    let orderResult = this.state.orderResult;
      //订单详情api
      orderApi.orderDetail({
         order_num:this.props.orderNum
      }).then(res=>{
        console.log(res);
        orderResult =res;
        return new Promise((proRes,proRej)=>{
              false && proRej(1);
              
              //是否评价
              if(res.is_evaluate){
                    //是否有评价内容 
                    for(let item of res.evaluate_remark){
                      chargedContent.push({
                          isClick:true,
                          tag:item
                      })
                    }
                    proRes(null);
              }else{
                //评价信息
                orderApi.evaluateList().then(res2=>{ 
                   //不满意数组
                   _chargedUngoodContent=[];
                    for(let item of res2.dissatisfied){
                      _chargedUngoodContent.push({
                          isClick:false,
                          tag:item
                      })
                    }
                    
                    //满意数组
                    _chargedGoodContent= [];
                    for(let item of res2.pleased){
                      _chargedGoodContent.push({
                          isClick:false,
                          tag:item
                      })
                    }
                    chargedContent =_chargedGoodContent;
                    proRes(res2)
                })
              }
          })
      }).then(res=>{
        console.log(res);

        let isSatisfaction = !(orderResult.is_praise && orderResult.is_praise=="1")
        this.setState({
            orderResult:orderResult,
            chargedUngoodContent:_chargedUngoodContent,
            chargedGoodContent:_chargedGoodContent,
            isSatisfaction:isSatisfaction,
            chargedContent:chargedContent.length==0?_chargedUngoodContent:chargedContent
        })
      })
   }

  componentDidMount() {
    this.autoHidenHint()
   }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const isSpread=this.state.isSpread
    const isHint=this.state.isHint
    const chargedContents = this.state.chargedContent;
    const {orderResult,isSatisfaction,isConfirm }= this.state;
    const content = chargedContents.map((chargedContent, index) => {
      return <View key={index} onClick={this.pitchUp.bind(this, index)} >
        {!chargedContent.isClick
          ? <View className='bt bt1'>{chargedContent.tag}</View>
          : <View className='bt bt2'>{chargedContent.tag}</View>}
      </View>
    })
    return (
      <View className='charged'>
        <View className='top'>
          <Image src={Img.dingdanBg} />
          <View className='ttl'><Image src={Img.cdz} /> </View>
          <View className='ttrt'>{orderResult.name}</View>
          <View className='ttrb'>电桩编号：{orderResult.station_id}</View>
          <View className='ttmll'>{orderResult.charging_degree}</View>
          <View className='ttmlr'></View>
          <View className='ttmlm'>充电度数</View>
          <View className='ttmm'></View>
          <View className='ttmrt'>{orderResult.charging_time}</View>
          <View className='ttmrm'>充电时长</View>
          <View className='tbl tbl1'>订单编号</View>
          <View className='tbr tbr1'>{this.props.orderNum}</View>
          <View className='tbl tbl2'>开始时间</View>
          <View className='tbr tbr2'>{orderResult.charging_start_time}</View>
          <View className='tbl tbl3'>结束时间</View>
          <View className='tbr tbr3'>{orderResult.charging_end_time}</View>
          <View className='tbl tbl4'>返还金额</View>
          <View className='tbr tbr4'>(原路退回){orderResult.return_money}</View>
          <View className='tbl tbl5'>预冻结金额</View>
          <View className='tbr tbr5'>{orderResult.money}</View>
          <View className='tbl tbl6'>实扣金额</View>
          <View className='tbr tbr6'>￥{orderResult.actual_amount}</View>
        </View>
          {this.state.orderResult && this.state.orderResult.is_evaluate? 
              <View>
                    <View className='praise'>
                      <View>
                          您对本次服务的评价
                      </View>
                      {
                        this.state.orderResult.is_praise=="1" ?
                        <Image src={Img.myActive} /> :
                        <Image src={Img.bmyActive} />
                      }
                    </View>

                <View className='bottomt'>
                  {content}
                </View>
                <View  className='thanks'>感谢您的评价，我们会持续改善您的使用体验！</View>
              </View>
            
            :
            <View>
                <View className='mt'>如何评价本次服务？</View>
                <View className='mb'>
                  {!isSatisfaction
                    ? <View><View className='mblt' onTouchStart={this.noSatisfaction}><Image src={Img.bmyActive} /></View>
                      <View className='mblb' onTouchStart={this.noSatisfaction}>不满意</View></View>
                    : <View><View className='mblt' onTouchStart={this.noSatisfaction}><Image src={Img.bmyLink} /></View>
                      <View className='mblb' onTouchStart={this.noSatisfaction}>不满意</View></View>}
                  {!isSatisfaction
                    ? <View><View className='mbrt' onTouchStart={this.satisfaction}><Image src={Img.myLink} /></View>
                      <View className='mbrb' onTouchStart={this.satisfaction}>满意</View></View>
                    : <View><View className='mbrt' onTouchStart={this.satisfaction}><Image src={Img.myActive} /></View>
                      <View className='mbrb' onTouchStart={this.satisfaction}>满意</View></View>}
                </View>
                <View className='bottomt'>
                  {content}
                </View>
                {isConfirm
                  ? <View className='bb'><View className='bm bml'>确定</View></View>
                  : <View className='bb'><View className='bm bma' onTouchStart={this.estimateComplate}>确定</View></View>
                }

            </View>
            }
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
