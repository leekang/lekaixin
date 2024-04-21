const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
import tool from '../../utils/index'
const app = getApp();

Page({
  data: {
    nickname: '',
    avatarUrl: defaultAvatarUrl,
    dbAvatarUrl: ''
  },
  onLoad(){
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
        _that.setData({nickname:userInfo.user_name,
          avatarUrl:userInfo.avatar_url,
          dbAvatarUrl:userInfo.avatar_url})
      }
    })
  },
  onChooseAvatar(e) {
    const {dbAvatarUrl,nickname} = this.data;
    const { avatarUrl } = e.detail 
    this.setData({avatarUrl:avatarUrl})
    console.log('111')
    wx.cloud.uploadFile({
      cloudPath: 'avatar',
      filePath: avatarUrl, // 文件路径
      success: res => {
        // get resource ID
        console.timeLog(avatarUrl)
        if(!dbAvatarUrl && !nickname){
          const db = wx.cloud.database()
          const checkInRecordHandle = db.collection('userInfo')
          checkInRecordHandle.add({
            // data 字段表示需新增的 JSON 数据
            data: {
              userUniqueId: app.globalData.user_openid,
              avatar_url: res.fileID
            },
            success: function(res) {
            }
          })
        }else{
          const db = wx.cloud.database()
          const checkInRecordHandle = db.collection('userInfo')
          checkInRecordHandle.where({
            userUniqueId: app.globalData.user_openid,
          }).update({
            // data 字段表示需新增的 JSON 数据
            data: {
              avatar_url: res.fileID
            },
            success: function() {
            }
          })
        }
      },
      fail: err => {
        // handle error
      }
    })
  },
  onInputChange: tool.debounce(function(e){
    const {nickname,dbAvatarUrl} = this.data;
    if(!dbAvatarUrl && !nickname){
      const value = e[0].detail.value;
      if(!value){
        return
      }
      const db = wx.cloud.database()
      const checkInRecordHandle = db.collection('userInfo')
      checkInRecordHandle.add({
        // data 字段表示需新增的 JSON 数据
        data: {
          userUniqueId: app.globalData.user_openid,
          user_name: value
        },
        success: function(res) {
          console.log('aa')
        }
      })
    }else{
      const value = e[0].detail.value;
      if(!value){
        return
      }
      const db = wx.cloud.database()
      const checkInRecordHandle = db.collection('userInfo')
      checkInRecordHandle.where({
        userUniqueId: app.globalData.user_openid,
      }).update({
        // data 字段表示需新增的 JSON 数据
        data: {
          user_name: value
        },
        success: function() {
        }
      })
    }
  },500)
})