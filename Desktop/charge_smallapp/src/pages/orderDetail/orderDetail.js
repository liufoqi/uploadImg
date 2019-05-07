import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Charging from '../charging/charging';
import orderApi from '../../util/orderApi';
import ChargeError from '../chargeError/chargeError';
import Charged from '../charged/charged';
import './orderDetail.css';

var orderNum = '';
export default class OrderDetail extends Component {

    config = {
        navigationBarTitleText: '订单'
    }

    constructor() {
        this.state = {
            data: {},
            state: 100,  //initial 100
        }
    }


    componentWillMount() {
        Taro.showLoading({
            title: '加载中',
          })
        orderNum = this.$router.params.orderNum
    }

    componentDidMount() {

    }

    componentWillUnmount() { }

    componentDidShow() {
        this.onCharging()
    }
    onCharging = () => {
        let state = 0
        let TimerID = setInterval(() => {
            orderApi.charging({ order_num: orderNum }).then((res) => {
                  // console.log(res.state)
                state = res.state;
                if (state !== 0) {//不正在充电
                    clearInterval(TimerID);
                    this.setState({
                        state: state
                    })
                } else {//正在充电
                    const current = Math.floor(355 + Math.random() * (365 - 355));
                    const voltage = Math.random().toFixed(1);
                    this.setState({
                        state: state,
                        data: { ...res, current: current, voltage: voltage }
                    });
                }
            }).catch(err=>{
                // console.log(err);
                clearInterval(TimerID);
            })
        }, 2000);
    }

    componentDidHide() { }

    render() {
        const { state, data } = this.state;
        return (
            <View className='order-detail'>
                {state === 0 ? <Charging data={data} orderNum={orderNum} /> : null}
                {state === -1 ? <ChargeError onCharging={this.onCharging} orderNum={orderNum} /> : null}
                {state === 1 ? <Charged orderNum={orderNum} onCharging={this.onCharging} /> : null}
            </View>)
    }
}
