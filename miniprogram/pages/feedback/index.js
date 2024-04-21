import Toast from '@vant/weapp/toast/toast';

const app = getApp();


Page({
  data: {
    content: '',
    contentList: []
  },

  onLoad() {
    const db = wx.cloud.database()
      const checkInRecordHandle = db.collection('userFeedback')
      checkInRecordHandle.get({
        userUniqueId: app.globalData.user_openid,
        success: function(res) {
          this.setData({contentList:res.data})
        }
      })
  },
  submit (){
    const content = this.data.content;
    const contentList = this.data.contentList;
    const _that = this;
    if(contentList.length === 0){
      const db = wx.cloud.database()
      const checkInRecordHandle = db.collection('userFeedback')
      checkInRecordHandle.add({
        // data 字段表示需新增的 JSON 数据
        data: {
          userUniqueId: app.globalData.user_openid,
          contentList:[{
            info: content,
            createTime: db.serverDate()
          }],

        },
        success: function() {
          _that.setData({
            contentList:[{
              info: content
            }]
          })
          Toast('反馈成功');
        }
      })
    }else{
      const db = wx.cloud.database()
      const checkInRecordHandle = db.collection('userFeedback');
      const resContent = contentList.concat([{
        info: content,
        createTime: db.serverDate()
      }])
      checkInRecordHandle.where({
        userUniqueId: app.globalData.user_openid,
      }).update({
        // data 字段表示需新增的 JSON 数据
        data: {
          userUniqueId: app.globalData.user_openid,
          contentList:resContent,
        },
        success: function() {
          Toast.success('反馈成功');
        }
      })
    }
  },
  onInputChange(e){
    this.setData({content:e.detail.value})
  }
});   