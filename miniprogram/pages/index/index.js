const { envList } = require("../../envList");
const dayjs = require('dayjs');
const { QuickStartPoints, QuickStartSteps } = require("./constants");
const app = getApp();
Page({
  data: {
    checkInCount: '--'
  },
  getCheckInData(){
    const db = wx.cloud.database()
    let checkInData = {}
    const checkInRecordHandle = db.collection('checkInRecord')
    let _that = this;
    checkInRecordHandle.where({
      _openid: app.user_openid,
    }).get({
      success:function(res){
        checkInData = res.data;
        console.log(checkInData[0],'11')
        if(checkInData[0].checkInList){
          console.log(checkInData[0].checkInList.length)
          _that.setData({
            checkInCount:checkInData[0].checkInList.length
          })
        }
      }
    })
  },
  onLoad(){
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
    this.getCheckInData();
  },
  gotoRecordList(){
    wx.navigateTo({
      url: `/pages/recordList/index`,
    });
  },
  addData(){
    console.log('aaa')
    const db = wx.cloud.database()
    const checkInRecordHandle = db.collection('checkInRecord')
    checkInRecordHandle.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        _openid: app.user_openid,
        checkInList: [dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss')],
      },
      success: function(res) {
        console.log('aa')
      }
    })
  },
  checkin(){
    const db = wx.cloud.database()
    let checkInData = {}
    let _that = this;
    const checkInRecordHandle = db.collection('checkInRecord')
    checkInRecordHandle.where({
      _openid: app.user_openid,
    }).get({
      success:function(res){
        checkInData = res.data;
        console.log(checkInData)
        console.log(checkInData.length)
        if(checkInData.length !== 0){
          _that.updateData();
        }else{
          _that.addData();
        }
      }
    })
    
  },
  
});
