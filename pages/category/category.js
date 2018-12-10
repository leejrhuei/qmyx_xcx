// pages/category/category.js

import {
  Category
} from 'category-model.js';
var category = new Category();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    transClassArr: ['tanslate0', 'tanslate1', 'tanslate2', 'tanslate3', 'tanslate4', 'tanslate5'],
    currentMenuIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadData();
  },

  _loadData: function() {
    category.getCategoryType((res) => {
      this.setData({
        categoryTypeArr: res
      });

      // 要在回调内进行获取分类详情的方法调用
      category.getProductsByCategory(res[0].id, (data) => {
        var dataObj = {
          procucts: data,
          topImgUrl: res[0].img.url,
          title: res[0].name
        };
        this.setData({
          categoryInfo0: dataObj
        });
      });
    });
  },

  // 切换分类
  changeCategory: function(event) {
    var index = category.getDataSet(event, 'index');
    var id = category.getDataSet(event, 'id');
    this.setData({
      currentMenuIndex: index
    });

    this.getProductsByCategory(id, (data) => {
      this.setData(this.getDataObjForBind(index, data));
    });
  },

  getProductsByCategory: function(id, callback) {
    category.getProductsByCategory(id, (data) => {
      callback && callback(data);
    });
  },

  getDataObjForBind: function(index, data) {
    var obj = {},
      arr = [0, 1, 2, 3, 4, 5],
      baseData = this.data.categoryTypeArr[index];
    for (var item in arr) {
      if (item == arr[index]) {
        obj['categoryInfo' + item] = {
          procucts: data,
          topImgUrl: baseData.img.url,
          title: baseData.name
        };

        return obj;
      }
    }
  },

  // 跳转到商品详情
  onProductsItemTap: function(event) {
    var id = category.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
    })
  },
})