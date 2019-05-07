import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtAccordion, AtList, AtListItem } from "taro-ui"
import modelApi from '../../util/modelApi'
import Img from '../../util/image';
import './modelSelect.css'

export default class ModelSelect extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      open: [true, false, false],
      data: []
    }
  }
  handleClick(index,_open) { 
    let open = this.state.open;
    open[index] = _open;
    this.setState({
      open: open
    })
  }
  config = {
    navigationBarTitleText: '车型选择'
    // disableScroll: true
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {
    modelApi.typeList().then(res => {
      this.setState({
        data: res
      })
    }).catch(err => {
      // console.log(err);
    })
  }

  componentDidHide() { }

  updateType = (id) =>{

    const { openId }=getApp().userInfo;
    modelApi.updateType({
      openId:openId,
      modelId:id
    }).then((res)=>{
      Taro.navigateBack({
        delta:1
      })
    }).catch(err=>{
      // console.log(err)
    });
  }

  

  render() {
    const { data } = this.state;
    return (
      <View className='modelSelect'>
        <View className='hot_car'>
          <View className='car_title'>
            热门车型
          </View>
          <View className='details'>
            {data && data.length!==0 && data.hotChargetype.map((key,i) => {
              return (
                <View className='details_public' key={i} onClick={()=>this.updateType(key.id)}>
                  <Image src={Img.car_picPng}></Image>
                  <View className='details_text'>
                    <Text>{key.brand}+{key.model}</Text>
                    <Text className='details_person'>{key.remark}使用</Text>
                  </View>
                </View>
              )
            })}
          </View>

        </View>
        <View className='much_car'>
          <View className='car_title'>
            更多车型
          </View>
          <View className='interval'>
          {data.length!==0 && data.moreType && Object.keys(data.moreType) && Object.keys(data.moreType).map((key,ke) => {
            return (
              
              <AtAccordion key={ke} open={this.state.open[ke]} onClick={this.handleClick.bind(this,ke)} title={key}>
                <AtList hasBorder={false} isAnimation={false} data-idx={ke}>
                  {data.moreType[key] && data.moreType[key].map((item) => <View data-key={ke} key={ke}> 
                    <AtListItem title={item.model} note={item.remark} thumb={Img.car_picPng} onClick={()=>this.updateType(item.id)} />
                  </View>)}
                </AtList>
              </AtAccordion>)})
          }
          </View>
        </View>
      </View>
    )
  }
}
