import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCheckbox, AtImagePicker, AtButton } from 'taro-ui'
import './reportRepair.css'

export default class ReportRepair extends Component {

  config = {
    navigationBarTitleText: '故障报修'
  }
  constructor () {
    super(...arguments)
    this.state = {
      disabled:false,
      checkedList: ['1'],
      files: []
    }
    this.checkboxOption = [{
      value: '1',
      label: '电桩损坏',
    },{
      value: '2',
      label: '屏幕损坏'
    },{
      value: '3',
      label: '电缆损坏'
    },{
      value: '4',
      label: '充电枪头损坏'
    }
  ]
}
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleChange (value) {
    this.setState({
      checkedList: value
    },()=>{
      if(this.state.checkedList.length===0){
        this.setState({disabled:1})
      }else{
        this.setState({disabled:false})
      }
    })
  }
  onChange (files) {
    this.setState({
      files
    })
  }

  handleSubmit = () => {
    Taro.showModal({
      title: '提示',
      content:'提交成功',
      showCancel:false,
      success(res) {
        if (res.confirm) {
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
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  }

  render () {
    return (
      <View className='reportRepair'>
      <View className='title'>选项列表(多选)</View>
       <AtCheckbox options={this.checkboxOption} selectedList={this.state.checkedList}  onChange={this.handleChange.bind(this)} className='my-checkbox' />
       <View className='title'>上传图片(选填)</View>
       <AtImagePicker length={4} files={this.state.files} onChange={this.onChange.bind(this)} />
       <AtButton disabled={this.state.disabled?1:0} circle type='primary' size='normal' className='my-button' onClick={this.handleSubmit}>提交</AtButton>
      </View>
    )
  }
}
