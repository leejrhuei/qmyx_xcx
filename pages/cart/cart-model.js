import {
  Base
} from '../../utils/base.js';

class Cart extends Base {
  constructor() {
    super();
    this._storageKeyName = 'cart';
  }

  add(item, counts) {
    var cartData = this.getCartDataFromLocal();
    var isHadInfo = this._isHasThatOne(item.id, cartData);
    if (isHadInfo.index == -1) {
      // 新商品
      item.counts = counts;
      // 默认在购物车中为选中状态
      item.selectStatus = true;
      cartData.push(item);
    } else {
      // 已有商品
      cartData[isHadInfo.index].counts += counts;
    }
    // 更新缓存
    this.execSetStorageSync(cartData);
    return cartData;
  }

  // 从缓存中读取购物车数据
  getCartDataFromLocal(flag) {
    var res = wx.getStorageSync(this._storageKeyName);
    if (!res) {
      res = [];
    }
    // 在下单的时候过滤掉未选的商品，
    if (flag) {
      var newRes = [];
      for (let i = 0; i < res.length; i++) {
        if (res[i].selectStatus) {
          newRes.push(res[i]);
        }
      }
      res = newRes;
    }
    return res;
  }

  // 更新缓存
  execSetStorageSync(data) {
    wx.setStorageSync(this._storageKeyName, data)
  }

  // 判断某个商品是否存在购物车中
  _isHasThatOne(id, arr) {
    var item,
      result = {
        index: -1
      };
    for (let i = 0; i < arr.length; i++) {
      item = arr[i];
      if (item.id == id) {
        result = {
          index: i,
          data: item
        };
        break;
      }
    }
    return result;
  }

  // 获取购物车中的数量, flag为真时表示选中的总数量，反之则表示全部的总数量
  getCartTotalCounts(flag) {
    var data = this.getCartDataFromLocal();
    var counts = 0;
    for (let i = 0; i < data.length; i++) {
      if (flag) {
        if (data[i].selectStatus) {
          counts += data[i].counts;
        }
      } else {
        counts += data[i].counts;
      }
    }
    return counts;
  }

  // 修改商品数目
  _changeCounts(id, counts) {
    var cartData = this.getCartDataFromLocal(),
      hasInfo = this._isHasThatOne(id, cartData);
    if (hasInfo.index != -1) {
      if (hasInfo.data.counts > 0) {
        cartData[hasInfo.index].counts += counts;
      }
    }
    // 更新缓存
    this.execSetStorageSync(cartData);
  };

  // 购物车加
  addCounts(id) {
    this._changeCounts(id, 1);
  };

  // 购物车减
  cutCounts(id) {
    this._changeCounts(id, -1);
  };

  // 删除
  delete(ids) {
    if (ids.constructor !== true) {
      ids = [ids];
    }
    var cartData = this.getCartDataFromLocal();
    for (let i = 0; i < ids.length; i++) {
      var hasInfo = this._isHasThatOne(ids[i], cartData);
      if (hasInfo.index != -1) {
        cartData.splice(hasInfo.index, 1);
      }
    }
    // 更新缓存
    this.execSetStorageSync(cartData);
  }
}

export {
  Cart
};