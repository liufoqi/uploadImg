import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import orderApi from '../../util/orderApi'
import Img from '../../util/image';
import './myOrder.css'

export default class MyOrder extends Component {

  config = {
    navigationBarTitleText: '我的订单'
  }
  constructor(){
    this.state={
      data:[]
    }
  }

  componentWillMount () { }

  componentDidMount () {

    const { openId } = getApp().userInfo;
    orderApi.orderList({openId:openId}).then(res=>{
      this.setState({
        data:res
      })
    }).catch((err)=>{
      // console.log(err);

    })
   }
   toDetail=(orderNum)=>{
     Taro.navigateTo({
       url:'../orderDetail/orderDetail?orderNum='+orderNum
     })
   }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { data } = this.state;
    return (
      <View className='myOrder'>
        <AtList>
        {data!==[] && data.map((item,key)=>{
            return <AtListItem key={key} onClick={()=>this.toDetail(item.orderNum)} title={item.name} note={`${item.remark}  | ${item.createTime}`} extraText={`¥${item.money}`} thumb={Img.electricPng} />
          })}
          
        </AtList>
      </View>
    )
  }
}
