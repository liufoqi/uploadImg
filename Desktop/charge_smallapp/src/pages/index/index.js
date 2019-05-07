import Taro, { Component } from '@tarojs/taro'
import { View, Map, CoverImage, CoverView } from '@tarojs/components'
import Route from '../route/route';
import amapFile from './amap-wx.js';
import userApi from '../../util/userApi';
import Config from "../../util/config";
import orderApi from '../../util/orderApi';
import Img from '../../util/image';
import poleApi from '../../util/poleApi'
import './index.css'

//var myAmapFun = new amapFile.AMapWX({ key: '8aecbe0dc9de90707103cd628ce58e6c' });
var myAmapFun = new amapFile.AMapWX({ key: Config.mapKey });
var timer = null, orderNum = 0, currentLocation = {};//用户当前位置
var chargerData = {}, chargerMarkers = [], page = 0, pageMarkers = [];  //三个推荐点
var centerLocation = {}, routeData = {}, searchResult = null;
var ppg = -1,recId=null;

export default class Index extends Component {
  constructor() {
    this.state = {
      stateData: { state: 0, order_num: '0' },
      markers: [],
      mapLocation: {},  // change it will change the ui 
      showRouteContent: false,
      polyline: [],
      includePoints: [],
      isOnShow: true
    }
  }

  config = {
    navigationBarTitleText: '首页',
    disableScroll: true
  }

  componentWillMount() {
    //console.log(this.$router.params);
    if(JSON.stringify(this.$router.params)!=='{}' && this.$router.params.loc &&  this.$router.params.pg &&  this.$router.params.rec_id){
      const { loc, pg ,rec_id } = this.$router.params;
      searchResult = {location:loc};
      recId=rec_id;
      ppg = pg;
      this.setState({
        isOnShow:false
      })
    }
  }

  componentDidMount() { }

  componentWillUnmount() { }
  componentDidShow() {
    //console.log(ppg);
    //console.log(searchResult);
    const { openId } = getApp().userInfo

    if (openId === '') {   //check login
      Taro.navigateTo({ url: '../login/login' })
    } else {// has logined   ---->    getOrderState
      orderApi.orderState({ openId: openId }).then(res => {
        orderNum = res.order_num
        this.setState({ stateData: res })
      }).catch(err => {
        //console.log(err)
      })

      if (searchResult && searchResult.location) {       // checkSearchResult  -----> have to search
        centerLocation = {
          longitude: searchResult.location.split(",")[0],
          latitude: searchResult.location.split(",")[1]
        }
        searchResult = null;
        this.setState({
          mapLocation: centerLocation,
        })
        if(JSON.stringify(currentLocation)==='{}'){
          new Promise((res,rej)=>{
            this.getCurrentLocation(res)
          }).then(()=>{
            this.onRegionChange({
              type: 'end',
              causedBy: 'drag'
            })
            return false
          })
        }else{
          this.onRegionChange({
            type: 'end',
            causedBy: 'drag'
          })
          return false
        }
        
      } else {     //  noSearchResult  ----->   to depend currentLoaction to seach 
        if (this.state.isOnShow && !this.state.showRouteContent) {
          this.dependOnCurrent();
        } else {
          return false;
        }
      }
    }
  }

  showThreeCharger = () => {
    this.getChargerMarkers(); //获取全部充电桩标记点3  sync
    this.getPageMarkers();//获取当前页标记点4  sync
    this.setMarkers(1); //设置地图标记点  3个(3个推荐点) 5  async
  }

  componentDidHide() {
    //onHide
  }
  getCurrentLocation = (callback) => {  //获取当前位置 async
    Taro.getLocation({
      success: (res) => {
        currentLocation = {
          longitude: res.longitude,
          latitude: res.latitude
        }
        //console.log(currentLocation);
        callback && callback("ok");
      }
    });
  }
  getChargerData = (location, callback) => { //请求充电桩数据  async
    const { openId } = getApp().userInfo;
    const { latitude, longitude } = location;
    if(!recId){
      recId='';
    }
    poleApi.search({ rec_id: recId, user_lat: currentLocation.latitude, user_lng: currentLocation.longitude,goal_lng:longitude,goal_lat:latitude,  openId: openId }).then(res => {
      ////console.log(res);
      recId=null;
      chargerData = { markers: res }
     // debugger;
      ppg === -1 ? page = 0 : page = Number(ppg)
      callback && callback("ok");
    }).catch(err => {
      //console.log(err);
    })
  }
  getChargerMarkers = () => {  //获取全部充电桩标记点
    const { markers } = chargerData;
    chargerMarkers = markers
  }

  getPageMarkers = () => {   //获得三个推荐点
    //// //console.log("getPageMarkers：获取当前页标记点4")
    const markers = chargerMarkers;
    const size = 3;
    if (markers) {
      const length = markers.length;
      let pageMarker = [];
      for (let i = 0; i < size; i++) {
        if (markers[size * page + i]) {
          pageMarker.push(markers[size * page + i])
        }
      }
      if( page < Math.floor(length / size)){
        ++page
      }else{
        page = -1;
        this.getPageMarkers();
      } 
      pageMarkers = pageMarker
    }
  }
  setMarkers = (type) => {  //设置地图标记点  1. 3个（3个推荐点） 或 2. 2个（当前位置 和 选中推荐点）
    // // //console.log("setMarkers：设置地图标记点  3个(3个推荐点) 5")
    if (type === 1) {
      let pagemarker = pageMarkers;
      let markers = [];
      pagemarker.map((key, item) => {
        const { distance, duration, slowChargeNum, quickChargeNum } = key;
        const name = key.name.substring(0, 8)
        const label = key.label===''?'':`(${key.label})`;
        //  const name = key.name;
        markers.push({
          ...key,
          id: item,
          iconPath: Img.dibiaoPng,
          height: 35,
          width: 25,
          callout: {
            borderRadius: 4,
            padding: 12.5,
            color: '#44B549',
            width: 159,
            fontSize: 12,
            height: 244,
            content: `${name}...${label}\n${distance}   ${duration}\n—————————————\n快充：${quickChargeNum}空闲  -  ￥94/时\n慢充：${slowChargeNum}空闲  -  ￥56/时`,
            display: 'ALWAYS',
            borderWidth: '1',
          }
        })
      })
      this.setState({
        markers: markers
      })
    }
  }

  getCenterLocation = (callback) => {  //获取圆心位置
    
    let mapCtx = Taro.createMapContext('myMap');
    //console.log(mapCtx);
    mapCtx.getCenterLocation({
      type: 'gcj02',
      success: (res) => {
        centerLocation = { latitude: res.latitude, longitude: res.longitude }
        //console.log('hhh')
        callback && callback('ok');
      },
      fail:(err)=>{
        //console.log(err);
      }
    })
  }

  setMapLocation = (location) => {  //设置地图中心点 async
    const { longitude, latitude } = location;
    this.setState({
      mapLocation: { longitude, latitude }
    })

  }

  getPolyline = (destination) => {  //获取，并描绘路线
    Taro.showLoading({
      title:'路线描绘中',
      mask:true
    })
    // const { currentLocation } = this.state;
    const origin = currentLocation.longitude + ',' + currentLocation.latitude;
    const that = this;
    myAmapFun.getDrivingRoute({
      origin: origin,
      destination: destination,
      strategy: 0,
      success: (data) => {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        const polylines = [{
          points: points,
          color: "#44B549",
          arrowLine: true,
          width: 6
        }];
        that.setState({
          polyline: polylines,
          includePoints: points // 这里已经全部放进去了
        },()=>{
          Taro.hideLoading();
        });
      }
    })
  }

  handleClickMasker = () => {  //处理点击遮罩层
    this.setMarkers(1);
    const { longitude, latitude } = centerLocation;
    this.setState({
      showRouteContent: false,
      polyline: [],
      mapLocation: { longitude, latitude }
    })
  }

  handleChange = () => {
    this.getPageMarkers();
    this.setMarkers(1);
  }

  onRegionChange = (e) => {
    if (!this.state.showRouteContent && e.type == 'end' && e.causedBy !== 'scale' && e.causedBy == 'drag') {
      clearTimeout(timer);
      timer = setTimeout(() => {
        new Promise((res, rej) => {
          this.getCenterLocation(res);  //获取圆心位置   async
        }).then(() => {
          return new Promise((res, rej) => {
            const { longitude, latitude } = centerLocation;
            const location = { longitude, latitude };
            this.getChargerData(location, res); //请求充电桩数据
          })
        }).then(() => {
          this.showThreeCharger();
        })
      }, 700);
    }
  }

  onMarkerTap = (e) => {
    clearTimeout(timer);
    let markerId = e.markerId;
    routeData = this.state.markers[markerId];
    const currentMarkers = this.state.markers;
    let marker = currentMarkers[markerId];
    const destination = marker.longitude + ',' + marker.latitude;
    this.getPolyline(destination);
    delete marker.callout;
    const { longitude, latitude } = currentLocation;
    this.setState({
      markers: [
        marker, //这个都好
        {
          longitude,
          latitude,
          iconPath: Img.centerLocationPng,
          width: 20,
          height: 35
        },
      ],
      showRouteContent: true
    })
  }

  setSearchResult = sr => {
    searchResult = sr;
  }

  toSearch() {
    // // //console.log("e");
    Taro.navigateTo({
      url: '../search/search'
    })
  }

  checkOldDriver = () => {
    const that = this;
    const appInstance = getApp();
    if (!appInstance.userInfo.isNovice) {
      Taro.showModal({
        title: '新手教程',
        cancelText: '老司机',
        confirmText: '新手教程',
        content: '如果您是老司机，请忽略',
        confirmColor: '#3478F7',
        cancelColor: '#3478F7',
        success: function (res) {
          if (res.confirm) {
            Taro.navigateTo({
              url: '../course/course'
            })
          } else if (res.cancel) {
            //更新老司机
            const { openId } = appInstance.userInfo;
            userApi.updateOldDriver({ openId: openId, appId: Config.appId }).then(ress => {
              appInstance.userInfo.isNovice = 1;
              // //console.log("请求成功", res)
            }).catch(err => {
              //console.log(err)
            })
            that.scanCode();
          }
        },
      })
    } else {
      this.scanCode();
    }
  }
  scanCode = () => {
    Taro.scanCode({
      success: () => {
        Taro.navigateTo({
          url: '../chargeInfo/chargeInfo'
        })
      },
      fail: (err) => {
        Taro.showModal({
          title: '提示',
          content: err.errMsg
        })
      }
    })
  }

  toPersonalCenter = () => {
    Taro.navigateTo({
      url: '../personal/personal'
    })
  }

  toDetail = () => {
    const { state, order_num } = this.state.stateData;
    if (state === 1) {
      orderApi.bubble({ order_num: order_num })
    }
    Taro.navigateTo({
      url: '../orderDetail/orderDetail?orderNum=' + orderNum
    })
  }

  dependOnCurrent = () =>{
    new Promise((res, rej) => {
      this.getCurrentLocation(res);  //获取当前位置 1     async
    }).then(() => {
      return new Promise((res, rej) => {
        const { longitude, latitude } = currentLocation;
        const location = { longitude, latitude };
        this.getChargerData(location, res);  //请求充电桩数据2  async
        //console.log(currentLocation);
        this.setMapLocation(currentLocation); //2设置地图中心点  async
      })
    }).then(() => {
      let mapCtx = Taro.createMapContext('myMap');
        mapCtx.moveToLocation();
      this.showThreeCharger();
    });
  }



  render() {
    //console.log(page);
    const textArray = [['0', '您的爱车正在充电'], ['1', '充电已完成'], ['-1', '充电异常']];
    const iconArray = [['0', Img.chongdianPng], ['1', Img.checkBoxBg], ['-1', Img.errorPng]];
    const stateText = new Map(textArray);
    const stateIcon = new Map(iconArray);
    const { stateData, mapLocation, markers, polyline, showRouteContent, includePoints } = this.state;
    const { longitude, latitude } = mapLocation;
    return (
      <View className='index'>
        <Map id='myMap' showLocation={1} style={showRouteContent ? 'height:66vh' : 'height:100vh'} polyline={polyline} includePoints={includePoints} bindCalloutTap={this.onMarkerTap} scale={14.8} className='map-container' markers={markers} longitude={longitude} latitude={latitude} onRegionChange={this.onRegionChange} onMarkerTap={this.onMarkerTap}  >
          {showRouteContent ? null : <CoverImage src={Img.scanCodePng} onClick={this.checkOldDriver} className='scanCode'></CoverImage>}
          {stateText.get(`${stateData.state}`) !== undefined &&
            <CoverView className='carInfo'>
              <CoverImage className='carInfo_img' src={stateIcon.get(`${stateData.state}`)}></CoverImage>
              <CoverView className='carInfo_content'>{stateText.get(`${stateData.state}`)}...</CoverView>
              <CoverView className='toDetail' onClick={this.toDetail}>详情</CoverView>
            </CoverView>
          }
          {showRouteContent ? null : <CoverImage src={Img.centerLocationPng} className='centerIcon'></CoverImage>}
          {showRouteContent ? null : <CoverImage className='change' src={Img.changePng} onClick={this.handleChange}></CoverImage>}
          {showRouteContent ? null : <CoverImage className='current-location' src={Img.gpsIndexPng} onClick={this.dependOnCurrent}></CoverImage>}
          {showRouteContent ? null : <CoverImage className='personalCenter' src={Img.myPng} onClick={this.toPersonalCenter}></CoverImage>}
          {showRouteContent ? <CoverView className='masker' onClick={this.handleClickMasker}></CoverView> : null}
          {showRouteContent ? null : <CoverView className='search' onClick={this.toSearch}><CoverView className='search-icon-box'><CoverImage className='search-box' src={Img.searchPng}></CoverImage><CoverView>搜索</CoverView></CoverView></CoverView>}
        </Map>
        {showRouteContent ? <Route page={page-1} centerLocation={JSON.stringify(centerLocation)==='{}' ? currentLocation : centerLocation} routeData={routeData} /> : null}
      </View>
    )
  }
}
