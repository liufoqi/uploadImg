import Taro, { Component } from '@tarojs/taro'
import { View, Input, Image, Text, ScrollView } from '@tarojs/components'
import amapFile from '../index/amap-wx.js';
import Img from '../../util/image';
import historyApi from '../../util/historyApi';
import './search.css'

var myAmapFun = new amapFile.AMapWX({ key: '8aecbe0dc9de90707103cd628ce58e6c' });
export default class Search extends Component {
  constructor() {
    this.state = {
      data: null,
      searchVal: "",
      tags: []
    }
  }
  config = {
    navigationBarTitleText: '搜索'
  }

  componentWillMount() {


  }
  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {
    const { openId } = getApp().userInfo;

    historyApi.historySearch({openId:openId,num:8}).then(res => {
   
      this.setState({
        tags: res
      })
    }).catch(err => {
      // console.log(err)
    })
  }

  componentDidHide() { }

  handleHistoryClear = () => {
    const { openId } = getApp().userInfo;
    historyApi.delHistorySearch({openId:openId}).then(res => {
   
      Taro.showToast({
        icon: "success",
        title: "清空成功"
      })
      this.setState({
        tags: []
      })
    }).catch(err => {
      // console.log(err)
    })
  }
  
  handleClick = (e) => {
    //// console.log(e);
    this.setState({
      searchVal: e,
    })
    this.handleConfirm({
      detail: {
        value: e
      }
    })

  }
  handleChange = e => {
    
    this.setState({
      searchVal: e.detail.value
    });
    e.detail.value == "" && this.setState({ data: null })
  }

  handleConfirm = e => {
    const val = e.detail.value;
    if(val===''){
      Taro.showModal({
        title:'提示',
        content:'搜索不能为空',
        showCancel:false,
        success:(res)=>{
          if(res.confirm){

          }
        }
      })
    }else{
      const { openId } = getApp().userInfo;
    historyApi.addHistoryInfo({openId:openId,remark:val}).then((res)=>{
      // console.log('成功')
    }).catch(err=>{
      // console.log(err);
    })

    if (val == "") return false;
    Taro.showLoading({
      title: "搜索中",
      mask: true
    })
    myAmapFun.getInputtips({
      keywords: val,
      datatype: 'poi',
      city: '010',

      fail: err => {
        Taro.hideLoading();
      },
      success: (_data) => {
        let data = _data.tips;
        let newData = [];
        Taro.hideLoading();
        data.map((key) => {
          let str1, str2, str3;
          const i = key.name.indexOf(val);
          const dataName = key.name;
          let name = [];
          if (i === -1) {
            name = [key.name, '', ''];
          } else {
            str1 = dataName.substring(0, i);
            str2 = dataName.substring(i, i + val.length);
            str3 = dataName.substring(i + val.length, dataName.length);
            name = [str1, str2, str3]
          }
          newData.push({ ...key, name })
        })
        this.setState({
          data: newData
        })
      }
    })

    }
    
  }
  handleCancel = () => {

    const pages = getCurrentPages();
    // 获取上一页的对象
    const prevPage = pages[pages.length - 2];
    if (prevPage) {
      //  prevPage.$component 等于上一页的 this对象
      prevPage.$component.setState({
        isOnShow: false
      }, () => {
        Taro.navigateBack();
      })
    }
  }
  
  handleClickBack = (key) => {
   
    //当前所有入栈 的页面
    const pages = getCurrentPages();
    // 获取上一页的对象
    const prevPage = pages[pages.length - 2];
    if (prevPage) {
      //  prevPage.$component 等于上一页的 this对象
      console.log(prevPage.$component);
      prevPage.$component.setSearchResult(key);
        Taro.navigateBack();
    }
    // Taro.redirectTo({
    //   url:'../index/index?searchResearch='+key
    // })
  }
  handleInputClear = () => {
    this.setState({
      searchVal: '',
      data: null
    });
  }
  render() {
    return (
      <View className='search'>
        <View className='search_input'>
          <View className='input_box'>
            <Image src={Img.searchPng}></Image>
            <Input placeholder='输入搜索关键字' focus={1} value={this.state.searchVal} confirm-type='search' onConfirm={this.handleConfirm} onInput={this.handleChange} placeholder-style='width:180px;height:26px;font-size:26rpx;font-family:MicrosoftYaHei;font-weight:400;color:#999999;line-height:46px;opacity:0.77'></Input>
            <Image className='icon_close' onClick={this.handleInputClear} src={Img.closePng} style={this.state.searchVal != "" ? "display:block" : "display:none"}></Image>
          </View>
          <View className='search_cancel' onClick={this.handleCancel}>取消</View>

        </View>


        {this.state.data !== null ?
          <View>
            <View className='history'>
              <View className='history_search'>搜索推荐</View><View className='history_clear'></View>
            </View>

            {!(this.state.data !== null && this.state.data.length > 0) ?
              <ScrollView scroll-y={1} className={!(this.state.data != null && this.state.data.length > 0) ? "result_list nodata" : "result_list"} >
                <View className='noResult'>
                  <Image src={Img.zanwuPng} ></Image>
                  <Text>没有找到匹配的结果</Text>
                </View>
              </ScrollView>
              : <ScrollView scroll-y={1} className={!(this.state.data != null && this.state.data.length > 0) ? "result_list nodata" : "result_list"} >
                <View>{this.state.data.map((key, item) => {
                  return (
                    <View key={item}  className='result' onClick={() => { this.handleClickBack(key) }}>
                      <View className='result_left'>
                        <Image src={Img.positionPng}></Image>
                        <View className='content'>
                          <View className='content_top'>{key.name[0]}<Text className='highlight'>{key.name[1]}</Text>{key.name[2]}</View>
                          <View className='content_bottom'>12km<Text>|</Text>{key.district} {key.address}</View>
                        </View>
                      </View>
                      <View className='result_right'><Image src={Img.daohangPngA}></Image><Text>到这去</Text></View>
                    </View>)
                })}</View>
              </ScrollView>
            }
          </View>
          :
          <View>
            <View className='history'>
              <View className='history_search'>搜索历史</View><View className='history_clear' onClick={this.handleHistoryClear}><Image src={Img.deletePng}></Image>清除历史</View>
            </View>
            <View className='history_box'>
              {this.state.tags.map((item,key) => {
                return (
                  <View key={key} onClick={() => { this.handleClick(item) }} hoverClass='background:#EFFFF0;border:1px solid #A3E5A5;box-shadow:0px 0px 14px 0px rgba(0, 0, 0, 0.08);border-radius:4px;'>{item}</View>
                )
              })}

            </View></View>}

      </View>
    )
  }
}
