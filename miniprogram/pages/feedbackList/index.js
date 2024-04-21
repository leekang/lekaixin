import dayjs from 'dayjs';

Page({
  data: {
    feedbackList: [],
  },

  onLoad() {
    const _that = this;
    wx.cloud.init({
      env: 'cloud1-3gitpa0gc2ad85d3',
      traceUser: true,
    });

    wx.cloud.callFunction({
      name: 'getfeedbackinfo',
      success: res =>{
        _that.fetchFeedbackList(res.result)
      },
    })
    // this.fetchFeedbackList();
  },

  async fetchFeedbackList(dbData) {
    const _that = this;
    let feedbackTemp = [];
    (dbData.data || []).forEach((dateItem)=>{
      dateItem.contentList.forEach((contentItem)=>{
        contentItem.createTime = dayjs(contentItem.createTime).format('YY-MM-DD HH:MM')
      })
      feedbackTemp = feedbackTemp.concat(dateItem.contentList || []);
    })
    console.log(feedbackTemp)
    _that.setData({feedbackList:feedbackTemp})
  },
});   