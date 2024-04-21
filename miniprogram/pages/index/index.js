import Toast from '@vant/weapp/toast/toast';
const dayjs = require('dayjs');
import drawQrcode from 'weapp-qrcode'
const app = getApp();
Page({
  data: {
    checkInData: [],
    show: false,
    todayHasCheck: 1,
    calendarConfig: {
      theme: 'elegant',
      multi: true,
      // showHolidays: true,
      // emphasisWeek: true,
      // chooseAreaMode: true
      // autoChoosedWhenJump: true
    },
    checkInCount: '--'
  },
  showPopup() {
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'myQrcode',
      // ctx: wx.createCanvasContext('myQrcode'),
      text: app.globalData.user_openid,
      // v1.0.0+版本支持在二维码上绘制图片
      image: {
        dx: 70,
        dy: 70,
        dWidth: 60,
        dHeight: 60
      }
    })
    this.setData({ show: true });
  },
  onClickHide(){
    this.setData({show:false})
  },
  watcherFunc(userUniqueId){
    
    const db = wx.cloud.database()
    const _that = this;
    console.log(userUniqueId)
    db.collection('checkInRecord').where({
      userUniqueId
    })
    
    .watch({
      onChange: function(snapshot) {
        console.log('aaa111')
        console.log(snapshot)
        _that.onClickHide();

      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
  },
  getCheckInData(userUniqueId){
    const db = wx.cloud.database()
    let checkInDataList = [];
    const checkInRecordHandle = db.collection('checkInRecord')
    let _that = this;
    console.log('-------')
    console.log(app.globalData)
    console.log({userUniqueId})
    checkInRecordHandle.where({
      userUniqueId
    }).get({
      success:function(res){
        checkInDataList = res.data;
        console.log(res,'22222',checkInDataList.length )
        if(checkInDataList.length > 0){
          _that.updateCalendar(checkInDataList[0].checkInList);
          _that.updateCheckStatus(checkInDataList[0].checkInList);
          _that.setData({
            checkInData:checkInDataList,
            checkInCount:checkInDataList[0].checkInList.length
          })
        }else{
          _that.setData({
            todayHasCheck: 3
          })
        }
      }
    })
  },
  checkinTomorrow(){
    Toast('明天再来吧！')
  },
  updateCheckStatus(checkInDataList){
    const lastDataItem = checkInDataList[checkInDataList.length-1].checkInTime;
    console.log(lastDataItem)
    const currentLocalTime = dayjs().unix();
    const lastServerUpdateTime = dayjs(lastDataItem).unix();
    if(currentLocalTime - lastServerUpdateTime >= 60){
      this.setData({
        todayHasCheck: 3
      })
    }else{
      this.setData({
        todayHasCheck: 2
      })
    }
  },  
  updateCalendar(checkInDataList){
    const calendar = this.selectComponent('#calendar').calendar
    const toSet = []
    checkInDataList.forEach((item)=>{
      toSet.push({
        year: dayjs(item.checkInTime).format('YYYY'),
        month: dayjs(item.checkInTime).format('MM'),
        date: dayjs(item.checkInTime).format('DD')
      })
    })
    calendar.setSelectedDates(toSet)
  },
  afterCalendarRender(e) {
    // const calendar = this.selectComponent('#calendar').calendar

    // const toSet = [
    //   {
    //     year: 2024,
    //     month: 4,
    //     date: 15
    //   },
    //   {
    //     year: 2024,
    //     month: 4,
    //     date: 18
    //   }
    // ]
    // calendar.setSelectedDates(toSet)
  },
  onLoad(){
    const _that = this;
    wx.cloud.init({
      env: 'cloud1-3gitpa0gc2ad85d3',
      traceUser: true,
    });
    wx.cloud.callFunction({
      name: 'getOpenId',
      success: res =>{
        _that.watcherFunc(res.result.openid)
        _that.getCheckInData(res.result.openid);
       
      },
    })
    
  },
  gotoRecordList(){
    wx.navigateTo({
      url: `/pages/recordList/index`,
    });
  },
  
});
