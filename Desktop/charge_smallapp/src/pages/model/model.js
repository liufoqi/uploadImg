import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import Img from '../../util/image';
import modelApi from '../../util/modelApi';
import './model.css'

export default class Model extends Component {

  config = {
    navigationBarTitleText: '我的车型'
  }
  constructor() {
    this.state = {
      data: {}
    }
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {   //这页面onshow 没发请求了 
    const app = getApp();
    modelApi.userCharge({
      openId: app.userInfo.openId
    }).then(res => {
      if(res!=={}){
        this.setState({
          data: res
        })
      }
      
    }).catch(e => {
      // console.log(e);
    })
  }


  componentDidHide() { }

  toModelSelect = ()=>{
    Taro.navigateTo({
      url:'../modelSelect/modelSelect'
    })
  }

  render() {
    const { model, remark } = this.state.data;
    // console.log(this.state.data+'' === {});
    return (
      <View className='model'>
        {JSON.stringify(this.state.data) === '{}' ?
          <View className='model_add' onClick={this.toModelSelect}>
            <Image className='model_addPng' src={Img.model_addPng}></Image>
            填写爱车信息，更精准的推荐
        </View> :
          <AtList>
            <AtListItem title={model} note={remark + '使用'} extraText='更改' thumb={Img.car_picPng} onClick={this.toModelSelect} />
          </AtList>}
      </View>
    )
  }
}
