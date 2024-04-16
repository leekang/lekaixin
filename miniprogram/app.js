// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-3gitpa0gc2ad85d3',
        traceUser: true,
      });
      wx.cloud.callFunction({
        name: 'getOpenId',
        success: res =>{
          this.globalData.user_openid = res.result.openid;
        },
      })
    }

    this.globalData = {
      user_openid: '',
      userInfo: null
    };
  }
});
