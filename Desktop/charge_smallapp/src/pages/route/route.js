import Taro, { Component } from '@tarojs/taro'
import { View, Image, Form, Button, Text } from '@tarojs/components'
import Img from '../../util/image';
import poleApi from '../../util/poleApi';
import functionApi from '../../util/functionApi';
import './route.css'

export default class Route extends Component {


  constructor() {


  }
  componentWillMount() {
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {
    console.log('hhh');
  }

  componentDidHide() { }

  handleToRepair = () => {
    Taro.navigateTo({
      url: '../reportRepair/reportRepair'
    })
  }

  formSubmit = e => {
    console.log(e);
    ////// console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const { formId } = e.detail;
    const { openId } = getApp().userInfo;
    const { centerLocation, routeData, page } = this.props;
    const { longitude, name, latitude, stationId, recId, address } = routeData;
    functionApi.collectFormId({ openId: openId, formId: formId }).then(res => {
      console.log('收集formid成功')
    }).catch(err => {
      console.log(err);
    })
    poleApi.chargeInfo({
      openId,
      stationId: stationId,
      rec_id: recId,
      charging_add: address,
      page_num: page,
      user_lng: centerLocation.longitude,
      user_lat: centerLocation.latitude
    }).then(res => {
      console.log('nyc')
    })

    Taro.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 28,
      name: name,
    })
  }
  render() {
    //const routeData = this.props.routeData?JSON.parse(this.props.routeData):{}; 
    const routeData = this.props.routeData || {};
    //// console.log(routeData);
    return (
      <View className='route-box'>

        <View className='showRoute' >

          <View className='charger_content'>
            <View className='location'>
              <Image src={Img.positionPng} ></Image>
              <View>
                <View className='location_title'>
                  <View>{routeData.name}</View>
                  <View className='tag'>
                    {routeData.label !== '' ? <Text style={'background-image:url(' + Img.tagPng + ')'}>{routeData.label}</Text> : null}
                  </View>
                </View>
                <View className='location_detail'>{routeData.distance}/{routeData.duration} |  {routeData.address}</View>
              </View>
              <Form onSubmit={this.formSubmit} reportSubmit={1}>
                <Button formType='submit'><Image className='route' src={Img.daohangPng}></Image></Button>
              </Form>
            </View>
            <View className='charger_detail'>
              <View className='free'>
                <View className='sum fast'>
                  <View className='speed'>快</View>
                  <View className='free_text'>空闲 {routeData.quickChargeNum}<View className='total'>/ 共{routeData.dcCount}</View></View>
                </View>
              </View>
              <View className='free'>
                <View className='sum slow'>
                  <View className='speed'>慢</View>
                  <View className='free_text'>空闲 {routeData.slowChargeNum}<View className='total'>/ 共{routeData.acCount}</View></View>
                </View>
              </View>
              <View className='type'>国际2011/2015</View>
            </View>
            <View className='charger_content_detail'>
              <View className='fee_content'>
                <View>电费:{routeData.chargerFee}</View>
                <View>服务费:{routeData.serviceFee}</View>
                <View>停车费:5元/小时</View>
              </View>

              <View className='price'>
                <View className='fast'>快 94元/时</View>
                <View className='dot'>•</View>
                <View className='slow'>慢 56元/时</View>
                <View>（以上信息以实际费用为准）</View>
              </View>
              <Image className='repair' src={Img.baoxiuPng} onClick={this.handleToRepair}></Image>
            </View>
          </View>

        </View>
      </View>
    )
  }
}
