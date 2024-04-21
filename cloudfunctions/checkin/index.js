// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const checkInRecordHandle = await db.collection('checkInRecord')
  checkInRecordHandle.add({
    // data 字段表示需新增的 JSON 数据
    data: {
      userUniqueId: event.open_id,
      checkInList: [{
        checkInTime: db.serverDate()
      }],
    },
    success: function() {
      console.log('sss')
    }
  })

  const tasks = [checkInRecordHandle]
  return{}
  // 等待所有
}