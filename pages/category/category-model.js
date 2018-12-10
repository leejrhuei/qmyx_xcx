import {
  Base
} from '../../utils/base.js';

class Category extends Base {
  constructor() {
    super();
  }

  // 获取所有分类
  getCategoryType(callback) {
    var params = {
      url: 'category/all',
      sCallback: function(res) {
        callback && callback(res);
      }
    };
    this.request(params);
  }

  // 获得某种分类的商品
  getProductsByCategory(id, callback) {
    var params = {
      url: 'product/by_category?id=' + id,
      sCallback: function (res) {
        callback && callback(res);
      }
    };
    this.request(params);
  }
}

export {
  Category
}