import Taro, { Component } from '@tarojs/taro'
import { View,Form, Input, Text, Image,Button } from '@tarojs/components'
import './recharge.css'
import Img from '../../util/image';
import orderApi from '../../util/orderApi'
import functionApi from '../../util/functionApi'

var soc=0;
export default class RechargeRecord extends Component {

  config = {
    navigationBarTitleText: '充值'
  }
  constructor(props) {
    super(props);
    // 必须存在this.state中
    this.state = {
      isBtn:[false, true, false, false],
      isRecommend:[false,false,false,false],  //暂不使用推荐功能
      select:1,
      isAddCar:false,
      value:'',
      proposalMoney:0
    }
  }
  pitchUp(id){
    this.setState({
      value:''
      });
      
    // console.log(id)
   if(this.state.isBtn[id]){
     
   }else{
     this.setState({
      select:id
     },()=>{
      let price =this.state.isBtn

      for(let i in price){
        price[i] = false
      }
      price[id]=true
      // console.log(price)
      this.setState({
        isBtn:price
      })
     })
    
   }
  }
  //添加爱车
  isAddCar(){
   Taro.navigateTo({
     url:'../modelSelect/modelSelect'
   })
  }

  getInputValue(e){
    // console.log(e.detail.value)
    var price =this.state.isBtn
    price[this.state.select]=false
    this.setState({
      isBtn:price
    })
    if(e){
      this.setState({
        value:e.detail.value
      })
    }
    
  }
  
  getRrecharge(e){
    const { formId } = e.detail;
    const { openId } = getApp().userInfo;
    functionApi.collectFormId({ openId: openId, formId: formId }).then(res => {
      console.log('收集formid成功')
    }).catch(err => {
      console.log(err);
    })
    let money=-1;
    let hasSelect = false;
    const { isBtn,value } = this.state;
    isBtn.map((item,key)=>{
      if(item) {
        hasSelect=true
        money=key*20+80;
      }
    })
    if(value){ money = value}

    if(!value && !hasSelect){
      Taro.showModal({
        title:'提示',
        content:'请选择充值金额',
        showCancel:false
      })
    }else{
      this.handleRecharge(money);
    }
   
  }
  componentWillMount() {
    // console.log(soc);
    soc=this.$router.params.soc
   }

  componentDidMount() {
    
   }

  componentWillUnmount() { }

  componentDidShow() {
    const {openId} = getApp().userInfo;
       orderApi.proposalMoney({openId,soc}).then(res=>{
         if(res.isBind){
           this.setState({
             proposalMoney:res.proposalMoney,
             isAddCar:true
            })
         }
       })
  }

  componentDidHide() { }

  handleRecharge = (money) => {
    
    const { openId } = getApp().userInfo;
    orderApi.recharge({ soc, openId, money }).then((res) => {
      const orderNum = res.order_num
      Taro.navigateTo({
        url: '../rechargeSuccess/rechargeSuccess?orderNum=' + orderNum
      })
    }).catch(err => {
      // console.log(err);
    })
  }

  toCourse = () => {
    Taro.navigateTo({
      url:'../course/course'
    })
  }

  render() {
    const isBtn=this.state.isBtn
    const isRecommend=this.state.isRecommend
    const isAddCar=this.state.isAddCar
    // const value=this.state.value
    return (
      <View className='recharge'>
       {isAddCar
        ?<View className='tt'>
         <View className='ttl'>
         <Image src={Img.czhi} />
         </View>
         <View className='ttm'>预充值</View>
         <View className='ttr'>预计{this.state.proposalMoney}元可充满</View>
       </View> 
       :<View className='top'>
       <View className='tl'>
       <Image src={Img.czhi} />
       </View>
       <View className='tm'>想要预估充值金额？</View>
       <View className='tr'  onTouchStart={this.isAddCar}>添加爱车</View>
       </View>}
        <View className='topb'>
        {!isBtn[0]
          ?<View className='tb1 tb' onClick={this.pitchUp.bind(this, '0')}>80元
          { isRecommend[0] &&
          <View className='recommend'>
          <Image src={Img.tuijian} />
          </View>
          }
          </View>
          :<View className='tb1 tb tbb' onClick={this.pitchUp.bind(this, '0')}>80元
          { isRecommend[0] &&<View className='recommend'>
          <Image src={Img.tuijian} />
          </View>
          }
          </View>
        }
        {!isBtn[1]
          ?<View className='tb1 tb' onClick={this.pitchUp.bind(this, '1')}>100元
          { isRecommend[1] &&<View className='recommend'>
          <Image src={Img.tuijian} />
          </View>
          }
          </View>
          :<View className='tb1 tb tbb' onClick={this.pitchUp.bind(this, '1')}>100元
          { isRecommend[1] &&<View className='recommend'>
          <Image src={Img.tuijian} />
          </View>
          }
          </View>
        }
       {!isBtn[2]
          ?<View className='tb1 tb' onClick={this.pitchUp.bind(this, '2')}>120元
          { isRecommend[2] &&<View className='recommend'>
          <Image src={Img.tuijian} />
          </View>
          }
          </View>
          :<View className='tb1 tb tbb' onClick={this.pitchUp.bind(this, '2')}>120元
          { isRecommend[2] &&<View className='recommend'>
          <Image src={Img.tuijian} />
          </View>
          }
          </View>
        }
       {!isBtn[3]
          ?<View className='tb1 tb' onClick={this.pitchUp.bind(this, '3')}>140元
          { isRecommend[3] &&<View className='recommend'>
          <Image src={Img.tuijian} />
          </View>
          }
          </View>
          :<View className='tb1 tb tbb' onClick={this.pitchUp.bind(this, '3')}>140元
          { isRecommend[3] &&<View className='recommend'>
          <Image src={Img.tuijian} />
          </View>
          }
          </View>
        }
        </View>
       <View className='mb'>
       <View className='mbl'>充值金额</View><Input onFocus={this.getInputValue} type='number' value={this.state.value} placeholder='请输入充值金额' maxLength='10' bindinput='getInputValue'  onbindinput={this.getInputValue} />
       </View>
       <View className='mbb' onClick={this.toCourse}>不会用 ？</View>
       <Form onSubmit={this.getRrecharge} reportSubmit={1}>
            <Button className='bt' formType='submit'>微信充值</Button></Form>
      </View>
    )
  }
}
