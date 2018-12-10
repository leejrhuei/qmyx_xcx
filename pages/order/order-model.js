import {
  Base
} from '../../utils/base.js';

class Order extends Base {
  constructor() {
    super();
    this._storageKeyName = 'newOrder';
  }

  // 下单
  doOrder(param, callback) {
    var that = this;
    var allParams = {
      url: 'order',
      type: 'post',
      data: {
        products: param
      },
      sCallback: function(data) {
        that.execSetStorageSync(true);
        callback && callback(data);
      },
      eCallback: function() {}
    };
    this.request(allParams);
  }

  // 更新缓存
  execSetStorageSync(data) {
    wx.setStorageSync(this._storageKeyName, data)
  }

  /*
   * 拉起微信支付
   * params:
   * norderNumber - {int} 订单id
   * return：
   * callback - {obj} 回调方法 ，返回参数 可能值 0:商品缺货等原因导致订单不能支付;  1: 支付失败或者支付取消； 2:支付成功；
   * */
  execPay(orderNumber, callback) {
    var param = {
      url: 'pay/pre_order',
      type: 'post',
      data: {
        id: orderNumber
      },
      sCallback: function(data) {
        var timeStamp = data.timeStamp;
        if (timeStamp) {
          wx.requestPayment({
            'timeStamp': timeStamp.toString(),
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            success: function() {
              callback && callback(2);
            },
            fail: function() {
              callback && callback(1);
            }
          });
        } else {
          callback && callback(0);
        }
      }
    };
    this.request(param);
  }

  // 获得订单的具体内容
  getOrderInfoById(id, callback) {
    var that = this;
    var param = {
      url: 'order/' + id,
      sCallback: function(data) {
        callback && callback(data);
      },
      eCallback: function() {

      }
    };
    this.request(param);
  }

  // 获得所有订单,pageIndex 从1开始
  getOrders(pageIndex, callback) {
    var param = {
      url: 'order/by_user',
      data: {
        page: pageIndex
      },
      type: 'get',
      sCallback: function(data) {
        // 1未支付 2已支付 3已发货 4已支付，但库存不足
        callback && callback(data);
      }
    };
    this.request(param);
  }

  // 是否有新的订单
  hasNewOrder() {
    var flag = wx.getStorageSync(this._storageKeyName);
    return flag == true;
  }
}

export {
  Order
}