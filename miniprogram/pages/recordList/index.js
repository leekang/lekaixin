Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkInList: [
      {checkInTime: '2024.09.12 12:12:11'}
    ]
  },

  onLoad(options) {
    this.setData({
      envId: options.envId
    });
   
   
  },
});
