// pages/product/product.js

import {
  Product
} from 'product-model.js';
var product = new Product();
import {
  Cart
} from '../cart/cart-model.js';
var cart = new Cart();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    countsArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    productCounts: 1,
    tabBox: ['商品详情', '售后保障'],
    currentTabsIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    this.data.id = id;
    this._loadData();
  },

  _loadData: function() {
    product.getDetailInfo(this.data.id, (res) => {
      this.setData({
        product: res,
        cartTotalCounts: cart.getCartTotalCounts()
      });
    })
  },

  // 选择购买数字
  bindPickerChange: function(event) {
    this.setData({
      productCounts: this.data.countsArray[event.detail.value],
    })
  },

  // 切换详情面板
  onTabsItemTap: function(event) {
    var index = product.getDataSet(event, 'index');
    this.setData({
      currentTabsIndex: index
    });
  },

  // 加入购物车
  onAddingToCartTap: function(event) {
    // 先加入购物车
    this.addToCart();
    // 统计购物车总量
    var counts = cart.getCartTotalCounts();
    this.setData({
      cartTotalCounts: counts
    });
  },

  addToCart: function() {
    var tempObj = {};
    var keys = ['id', 'name', 'main_img_url', 'price'];
    for (var key in this.data.product) {
      if (keys.indexOf(key) >= 0) {
        tempObj[key] = this.data.product[key];
      }
    }
    cart.add(tempObj, this.data.productCounts);
  },

  onCartTap: function(event) {
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  }
})