import {
  Base
} from '../../utils/base.js';

class My extends Base {
  constructor() {
    super();
  }

  // 得到用户信息
  getUserInfo(cb) {
    var that = this;
    wx.login({
      success: function(data) {
        wx.getUserInfo({
          success: function (res) {
            console.log(res);
            typeof cb == "function" && cb(res.userInfo);
            // 将用户昵称提交到服务器
            that._updateUserInfo(res.userInfo);
          },
          fail: function (res) {
            console.log(res);
            typeof cb == "function" && cb({
              avatarUrl: '../../imgs/icon/user@default.png',
              nickName: '游客'
            });
          }
        });
      },
    })
  }

  // 更新用户信息到服务器
  _updateUserInfo(res) {
    var allParams = {
      url: 'user/wx_info',
      data: {
        userData: JSON.stringify(res)
      },
      type: 'post',
      sCallback: function(data) {}
    };
    this.request(allParams);
  }
}

export {
  My
}