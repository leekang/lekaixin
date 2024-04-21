import Toast from '@vant/weapp/toast/toast';
const app = getApp();

// pages/me/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nickname: '',
    avatarUrl: '',
  },

  onShow(){
    const _that = this;
    const db = wx.cloud.database()
    const checkInRecordHandle = db.collection('userInfo')
    checkInRecordHandle.where({
      userUniqueId: app.globalData.user_openid,
    })
    .get({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
        const userInfo = res.data[0];
        console.log(userInfo.avatar_url)

        _that.setData({nickname:userInfo.user_name,
          avatarUrl:userInfo.avatar_url,
          })
      }
    })
  },

  setUserInfo() {
    const {avatarUrl,nickname} = this.data;
    
    if(!avatarUrl || !nickname){
      console.log('aaa')
      wx.navigateTo({
        url: `/pages/userInfo/index`,
      });
    }
    
  },
  gotoFeedbackList(){
    wx.navigateTo({
      url: `/pages/feedbackList/index`,
    });
  },
  updateData(open_id,checkInListOuter){
    const db = wx.cloud.database()
    const checkInList = checkInListOuter[0].checkInList;
    const checkInRecordHandle = db.collection('checkInRecord');
    checkInRecordHandle.where({
      userUniqueId:open_id
    }).update({
      // data 字段表示需新增的 JSON 数据
      data: {
        checkInList: checkInList.concat([{
          checkInTime: db.serverDate()
        }]),
      },
      success: function() {
        Toast('已签到成功');
      }
    })
  },
  addData(open_id){
    wx.cloud.init({
      env: 'cloud1-3gitpa0gc2ad85d3',
      traceUser: true,
    });
    wx.cloud.callFunction({
      name: 'checkin',
      data:{
        open_id
      },
      success: res =>{
        console.log(1122)
      },
    })
    // const db = wx.cloud.database()
    // const checkInRecordHandle = db.collection('checkInRecord')
    // checkInRecordHandle.add({
    //   // data 字段表示需新增的 JSON 数据
    //   data: {
    //     userUniqueId: open_id,
    //     checkInList: [{
    //       checkInTime: db.serverDate()
    //     }],
    //   },
    //   success: function() {
    //     Toast('已签到成功');
    //   }
    // })
  },
  checkin(open_id){
    const db = wx.cloud.database()
    let checkInData = {}
    let _that = this;
    // const checkInRecordHandle = db.collection('checkInRecord')
    // checkInRecordHandle.where({
    //   userUniqueId: open_id,
    // }).get({
    //   success:function(res){
    //     checkInData = res.data;
    //     console.log(checkInData,'ssssssss')
    //     if(checkInData.length !== 0){
    //       _that.updateData(open_id,checkInData);
    //     }else{
    //       _that.addData(open_id);
    //     }
    //   }
    // })
    _that.addData(open_id);
  },
  qrScan(){
    let _that = this;
    _that.addData('ol3q261MZwkPe7FjPhVlz9qjKztc');

    // wx.scanCode({
    //   scanType: ['qrCode'],
    //   success (res) {
    //     _that.checkin(res.result);
    //   }
    // })
  },
  onShareAppMessage(){
    return {
      title: `洪庆乐开心`,
      path:"pages/index/index"
    }
  }
});
