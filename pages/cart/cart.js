// pages/cart/cart.js

import {
  Cart
} from 'cart-model.js';
var cart = new Cart();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var cartData = cart.getCartDataFromLocal();
    var cal = this._calcTotalAccountAndCounts(cartData);
    this.setData({
      selectedCounts: cal.selectedCounts,
      selectedTypeCounts: cal.selectedTypeCounts,
      account: cal.account,
      cartData: cartData
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // 更新缓存
    cart.execSetStorageSync(this.data.cartData);
  },

  _calcTotalAccountAndCounts: function(cartData) {
    var len = cartData.length,
      // 选中商品总额
      account = 0,
      // 选中商品总数
      selectedCounts = 0,
      // 购物车选中的条数
      selectedTypeCounts = 0;
    let multiple = 100;
    for (let i = 0; i < len; i++) {
      if (cartData[i].selectStatus) {
        account += cartData[i].counts * multiple * Number(cartData[i].price) * multiple;
        selectedCounts += cartData[i].counts;
        selectedTypeCounts++;
      }
    }
    return {
      selectedCounts: selectedCounts,
      selectedTypeCounts: selectedTypeCounts,
      account: account / (multiple * multiple)
    }
  },

  // 单选
  toggleSelect: function(event) {
    var id = cart.getDataSet(event, 'id'),
      status = cart.getDataSet(event, 'status'),
      index = this._getProductIndexById(id);
    this.data.cartData[index].selectStatus = !status;
    this._resetCartData();
  },

  // 全选
  toggleSelectAll: function(event) {
    var status = cart.getDataSet(event, 'status') == 'true';
    var data = this.data.cartData,
      len = data.length;
    for (let i = 0; i < len; i++) {
      data[i].selectStatus = !status;
    }
    this._resetCartData();
  },

  // 根据商品id得到所在下标
  _getProductIndexById: function(id) {
    var data = this.data.cartData,
      len = data.length;
    for (let i = 0; i < len; i++) {
      if (data[i].id == id) {
        return i;
      }
    }
  },

  // 更新购物车商品数据
  _resetCartData: function() {
    // 重新计算总金额和商品总数
    var newData = this._calcTotalAccountAndCounts(this.data.cartData);
    this.setData({
      account: newData.account,
      selectedCounts: newData.selectedCounts,
      selectedTypeCounts: newData.selectedTypeCounts,
      cartData: this.data.cartData
    });
  },

  // 数量变化
  changeCounts: function(event) {
    var id = cart.getDataSet(event, 'id'),
      type = cart.getDataSet(event, 'type'),
      index = this._getProductIndexById(id),
      counts = 1;
    if (type == 'add') {
      cart.addCounts(id);
    } else {
      counts = -1;
      cart.cutCounts(id);
    }
    // 更新商品数量
    this.data.cartData[index].counts += counts;
    this._resetCartData();
  },

  // 删除
  delete: function(event) {
    var that = this;
    wx.showModal({
      title: '删除',
      content: '确定删除？且删且珍惜...',
      success: function(res) {
        if (res.confirm) {
          var id = cart.getDataSet(event, 'id'),
            index = that._getProductIndexById(id);
          // 删除某一项商品
          that.data.cartData.splice(index, 1);
          // 删除缓存中的商品
          cart.delete(id);
          that._resetCartData();
        }
      },
      fail: function() {
        wx.showToast({
          title: '删除失败',
        })
      }
    })
  },

  // 下单
  submitOrder: function(event) {
    wx.navigateTo({
      url: '../order/order?account=' + this.data.account + '&from=cart'
    });
  }
})