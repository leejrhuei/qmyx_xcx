// pages/my/my.js

import {
  Address
} from '../../utils/address.js';
import {
  Order
} from '../order/order-model.js';
import {
  My
} from '../my/my-model.js';

var address = new Address();
var order = new Order();
var my = new My();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    orderArr: [],
    isLoadedAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadData();
    this._getAddressInfo();
  },

  onShow: function() {
    var newOrderFlag = order.hasNewOrder();
    if (newOrderFlag) {
      this.refresh();
    }
  },

  refresh: function() {
    var that = this;
    this.data.orderArr = [];
    this._getOrders(() => {
      that.data.isLoadedAll = false;
      that.data.pageIndex = 1;
      order.execSetStorageSync(false);
    });
  },

  _loadData: function() {
    this._getOrders();
  },

  userInfo: function() {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              that.setData({
                userInfo: res.userInfo
              });
              // 更新至数据库
              my._updateUserInfo(res.userInfo);
            }
          })
        }
      }
    });
  },

  _getAddressInfo: function() {
    var that = this;
    address.getAddress((addressInfo) => {
      that._bindAddressInfo(addressInfo);
    });
  },

  // 绑定地址信息
  _bindAddressInfo: function(addressInfo) {
    this.setData({
      addressInfo: addressInfo
    });
  },

  _getOrders: function(callback) {
    order.getOrders(this.data.pageIndex, (res) => {
      var data = res.data.data;
      if (data) {
        // 数组合并
        this.data.orderArr.push.apply(this.data.orderArr, data);
      } else {
        this.data.isLoadedAll = true;
      }
      this.setData({
        orderArr: this.data.orderArr
      });
      callback && callback();
    });
  },

  onReachBottom: function() {
    if (!this.data.isLoadedAll) {
      this.data.pageIndex++;
      this._getOrders();
    }
  },

  showOrderDetailInfo: function(event) {
    var id = order.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../order/order?from=order&id=' + id
    });
  },

  // 未支付订单再次支付
  rePay: function(event) {
    var id = order.getDataSet(event, 'id'),
      index = order.getDataSet(event, 'index');
    this._execPay(id, index);
  },

  _execPay: function(id, index) {
    var that = this;
    order.execPay(id, (statusCode) => {
      if (statusCode > 0) {
        var flag = statusCode == 2;

        //更新订单显示状态
        if (flag) {
          that.data.orderArr[index].status = 2;
          that.setData({
            orderArr: that.data.orderArr
          });
        }

        //跳转到 成功页面
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=my'
        });
      } else {
        that.showTips('支付失败', '商品已下架或库存不足');
      }
    });
  },

  /*
   * 提示窗口
   * params:
   * title - {string}标题
   * content - {string}内容
   * flag - {bool}是否跳转到 "我的页面"
   */
  showTips: function(title, content, flag) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function(res) {
        if (flag) {
          wx.switchTab({
            url: '/pages/my/my'
          });
        }
      }
    });
  },

  editAddress: function() {
    var that = this;
    wx.chooseAddress({
      success: function(res) {
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res),
        }
        that._bindAddressInfo(addressInfo);

        // 保存地址
        address.submitAddress(res, (flag) => {
          if (!flag) {
            that.showTips('操作提示', '地址信息更新失败！');
          }
        });
      }
    })
  },
})