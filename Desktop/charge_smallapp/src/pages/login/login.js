import Taro, { Component } from '@tarojs/taro'
import { View,Button,Image} from '@tarojs/components'
import './login.css'
import Img from '../../util/image'
import  user from '../../util/userApi.js'

export default class Login extends Component {
  config = {
    navigationBarTitleText: '登录授权'
  }
  constructor(props) {
    super(props);
    // 必须存在this.state中
    this.state={
      isLoggedIn:false,//控制获取手机号窗口
      isGetuser:false,//控制获取个人信息窗口
      isGetuserInfo:false,
      openId:'cvdsgv' ,
      sessionKey:'xfsx',
      signature:'',
      isNovice:false,
      headUrl:'',
      nickName:'',
    }
  }
  getLogin(){
    var that=this
    Taro.login({
      success(res) {
       if (res.code) {
          // 发起网络请求
         // // console.log(res.code)
          that.postCode(res.code)
          // that.setState({
          //   isLoggedIn:true,
          // })
        } else {
         // // console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
  postCode(code){
   // // console.log(code)
     var that=this
     user.login({code:code}).then(function (ress){
     // // console.log(ress)
      that.setState({
        openId:ress.openId,
        sessionKey:ress.sessionKey,
        isNovice:ress.isNovice,
      } ,()=>{
      if(ress.isAuthorize==true&&ress.isPhone==true){
         //设置全局数据
         getApp().userInfo={
          isNovice:ress.isNovice,
          openId:ress.openId,
          sessionKey:ress.sessionKey,
          headUrl:ress.headUrl,
          nickName:ress.nickName,
        }
       // // console.log(getApp().userInfo)
       Taro.navigateBack({
         delta:1
       })
       //已获取全部授权，跳转首页
      // that.setState({
      //   isGetuser:true,
      // })
     // // console.log('已获取全部授权，跳转首页')
    }
     else if(ress.isAuthorize==true&&ress.isPhone==false){
      //手机号未授权
      //个人信息已授权
      that.setState({
        headUrl:ress.headUrl,
        nickName:ress.nickName,
        },()=>{
         that.setState({
           isLoggedIn:true,
         })
      })
    }
    else{
      //未获取手机号和个人信息授权
      that.setState({
        isGetuser:true,
      })
    }
      })
      
     }).catch(error=>{
        // // console.log(error)
       })
  }
  
  //获取位置预授权
  getLocation(){
    const that= this
    Taro.getSetting({
      success(res) {
       // // console.log(res)
        if (!res.authSetting['scope.record']){
          Taro.authorize({
            scope: 'scope.userLocation',
            success(){
              // 用户已经同意小程序使用定位功能，后续调用 Taro.getLocation 接口不会弹窗询问
             // // console.log('已授权')
              that.getLogin()
            },
            fail(){
              const isGetuserInfo='1' //首次授权
              that.showLocationModal(isGetuserInfo)
            }
          })
        }
      }
    })
    }
    //提示用户必须授权获取位置
 showLocationModal(isGetuserInfo){
      const that= this
      Taro.showModal({
        title:'用户未授权',
        content:'如果需要正常使用路线查询功能，请按确定并在授权管理中打开“位置”。最后再进入小程序即可正常使用',
        // confirmText:'确定',
        showCancel:false,
        success:function(){
          that.openLocationSetting(isGetuserInfo)
         }
      })
    }
    //打开设置接口
    openLocationSetting(isGetuserInfo){
      const that= this
      if(isGetuserInfo=='1'){
        Taro.openSetting({
          success(res){
           // // console.log(res)
            if(res.authSetting['scope.userLocation']){
             // // console.log('已授权')
              that.getLogin()
            }else{
             // // console.log('未授权')
              const isGetLocation='1'
              that.showLocationModal(isGetLocation)
            }
            },
            fail(res){
             // // console.log(res)
              that.setState({
                isLoggedIn:true,
              })
            }
        })
      }
      else if(isGetuserInfo=='2'){
        Taro.openSetting({
          success(res){
           // // console.log(res)
            if(res.authSetting['scope.userInfo']&&res.authSetting['scope.userLocation']){
             // // console.log('已授权')
              Taro.getUserInfo({
                success(ress){
                 // // console.log(ress)
                  user.userInfo({
                    sessionKey:that.state.sessionKey,
                    encryptedData:ress.encryptedData,
                    iv:ress.iv,
                    rawData:ress.rawData,
                    signature:ress.signature,
                  }).then(resss=>{
                    that.setState({
                      signature:ress.signature,
                      headUrl:resss.headUrl,  
                      nickName:resss.nickName,  
                    },()=>{
                      that.setState({
                        isLoggedIn:true
                      })
                    })
                   // // console.log(resss)
                  }).catch(error=>{
                    Taro.showModal({
                      title:error,
                      // content:'如果需要正常使用功能，请按确定并点击再次登录，并同意获取手机号',
                      // confirmText:'确定',
                      showCancel:false,
                      success:function(){
                        // that.openPhoneNumberSetting()
                       }
                    })
                  })
                }
              })
              
            } 
            else if(!res.authSetting['scope.userInfo']&&res.authSetting['scope.userLocation']){
              that.showUserInfoModal()
            }
            else if(res.authSetting['scope.userInfo']&& !res.authSetting['scope.userLocation']){
              const isGetPhone='2' //意外关闭位置授权
             // // console.log()
              that.showLocationModal(isGetPhone)
            }
            else{
              const isGetPhone='2' //关闭所有权限 
              that.showLocationModal(isGetPhone)
             // // console.log('未授权')
            }}
        })
      }
      else{}
    }
  cancelGetUserInfo(){
   this.showUserInfoModal()
  }
   // 获取用户信息
  getUserInfo(e){
    var that=this
      if(e.type='getuserinfo'){
        if(e.target.iv){
         // // console.log(e)
          user.userInfo({
            sessionKey:that.state.sessionKey,
            encryptedData:e.detail.encryptedData,
            iv:e.detail.iv,
            rawData:e.detail.rawData,
            encryptedData:e.detail.encryptedData,
            signature:e.detail.signature,
          }).then(ress =>{
              that.setState({
                signature:e.detail.signature,  
                headUrl:ress.headUrl,  
                nickName:ress.nickName,  
              } ,()=>{
                that.setState({
                  isLoggedIn:true,//控制获取手机号窗口
                  isGetuser:false,//控制获取个人信息窗口 
                })
              })
            
            // // console.log(ress)
          }).catch(error=>{
           // // console.log(error)
          })
         }
        else{
         // // console.log('未授权')
         // // console.log(e)
          if(this.state.isGetuserInfo){
            this.showUserInfoModal() 
            this.setState({
              isGetuser:false,
            })
          }
          this.setState({
            isGetuserInfo:true,
          })
        }
      }
     }
      // 获取用户信息弹窗
    showUserInfoModal(){
      const that= this
      Taro.showModal({
        title:'用户未授权',
        content:'如果需要正常使用，请按确定并在授权管理中打开“用户信息”。最后再进入小程序即可正常使用',
        // confirmText:'确定',
        showCancel:false,
        success:function(){
          that.openUserInfoSetting()
         }
      })
    }
   // 获取打开用户信息设置窗口
  openUserInfoSetting(){
      const that= this
      Taro.openSetting({
        success(res){
         // // console.log(res)
          if(res.authSetting['scope.userInfo']&&res.authSetting['scope.userLocation']){
           // // console.log('已授权')
            Taro.getUserInfo({
              success(ress){
               // // console.log(ress)
                user.userInfo({
                  sessionKey:that.state.sessionKey,
                  encryptedData:ress.encryptedData,
                  iv:ress.iv,
                  rawData:ress.rawData,
                  signature:ress.signature,
                }).then(resss=>{
                  that.setState({
                    signature:resss.signature,
                    headUrl:resss.headUrl,  
                    nickName:resss.nickName,
                  },()=>{
                    that.setState({
                      isLoggedIn:true,//控制获取手机号窗口
                      isGetuser:false,//控制获取个人信息窗口 
                    })
                  })
                 // // console.log(resss)
                }).catch(error=>{
                  Taro.showModal({
                    title:error,
                    // content:'如果需要正常使用功能，请按确定并点击再次登录，并同意获取手机号',
                    // confirmText:'确定',
                    showCancel:false,
                    success:function(){
                      // that.openPhoneNumberSetting()
                     }
                  })
                })
              }
            })
             that.setState({
              isGetuser:false
            })
          } 
          else if(!res.authSetting['scope.userInfo']&&res.authSetting['scope.userLocation']){
            that.showUserInfoModal()
          }
          else if(res.authSetting['scope.userInfo']&& !res.authSetting['scope.userLocation']){
            const isGetuserInfo='2' //意外关闭位置授权
            that.showLocationModal(isGetuserInfo)
          }
          else{
            const isGetuserInfo='2' //关闭所有权限 
            that.showLocationModal(isGetuserInfo)
           // // console.log('未授权')
          }

          }
      })
    }
// 获取手机号
  getPhoneNumber(e){
    //// // console.log(e)
   var that=this
   if(e.type=='getphonenumber'){
      if(e.detail.iv){
       // // console.log(e)
       // // console.log(e.detail.errMsg)
       // // console.log(e.detail.iv)
       // // console.log(e.detail.encryptedData)
        user.getUserPhone({
            openId:that.state.openId,
            sessionKey:that.state.sessionKey,
            encryptedData:e.detail.encryptedData,
            iv:e.detail.iv,
            signature:that.state.signature,
        }).then(res=>{
         // // console.log(res)
          getApp().userInfo={
            isNovice:that.state.isNovice,
            openId:that.state.openId,
            sessionKey:that.state.sessionKey,
            headUrl:that.state.headUrl,
            nickName:that.state.nickName,
          }
         // // console.log(getApp().userInfo)
         // // console.log('已获取全部授权，跳转首页')
             Taro.redirectTo({
              url: '../index/index'
            })
           }).catch(error=>{
              Taro.showModal({
                title:error,
                // content:'如果需要正常使用功能，请按确定并点击再次登录，并同意获取手机号',
                // confirmText:'确定',
                showCancel:false,
                success:function(){
                  // that.openPhoneNumberSetting()
                 }
              })
          })
      }
      else{
         // // console.log('未授权')
          that.showPhoneNumberModal()
        }
       }
     }
 // 获取手机号失败弹窗
     showPhoneNumberModal(){
  // const that= this
  Taro.showModal({
    title:'登录失败',
    content:'如果需要正常使用功能，请按确定并点击再次登录，并同意获取手机号',
    // confirmText:'确定',
    showCancel:false,
    success:function(){
      // that.openPhoneNumberSetting()
     }
  })
}
  componentWillMount () {
    // this.getLogin()
    this.getLocation()
}

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }


  render () {
    const isLoggedIn=this.state.isLoggedIn
    const isGetuser=this.state.isGetuser
    // const isGetuserInfo=this.state.isGetuserInfo
     return (
      <View className='login'>
       <View className='logins'><Image src={Img.bg} /></View>
       {isLoggedIn && <View className='pop'><View className='title'>快速登录</View><View className='content'>为了更精准的给您推荐充电桩，请先登录</View><View className='btn'><Button open-type='getPhoneNumber' bindgetphonenumber='getPhoneNumber' onClick={this.getPhoneNumber}>微信手机号快捷登录</Button></View></View>}
       {isGetuser&& !isLoggedIn && <View className='user'>
       <View className='tt'>
       <View className='ttl'>e充电</View>
       <View className='ttr'>申请</View>
       </View>
       <View className='tb'>获取你的昵称、头像、地区及性别</View>
       <View className='m'>
        <View className='ml'><open-data type='userAvatarUrl'></open-data></View>
        <View className='mm'>
        <View className='mmt'>微信个人信息</View>
        <View className='mmb'><open-data type='userNickName'></open-data></View>
        </View>
        <View className='mr'><View className='at-icon at-icon-check'></View></View>
       </View>
       <View className='b'>
       {/* <View className='bl'><Button open-type='getUserInfo' bindgetuserinfo='getUserInfo' onClick={this.getUserInfo}>取消</Button></View> */}
       <View className='br'><Button open-type='getUserInfo' bindgetuserinfo='getUserInfo' onClick={this.getUserInfo}>确定</Button></View>
       </View>
       </View>}
       </View>
     )
  }
}

