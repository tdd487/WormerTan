// pages/me/me.js
import Api from '/../../utils/api.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type:1,
    items: [
      {value: '1', name: '生活琐事', checked: 'true'},
      {value: '2', name: '读书笔记'}
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // that.shake();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  shake() {
    var numX = 1 //x轴
    var numY = 1 // y轴
    var numZ = 0 // z轴
    var stsw = true // 开关，保证在一定的时间内只能是一次，摇成功
    var positivenum = 0 //正数 摇一摇总数
    //  var audioCtx = wx.createAudioContext('myAudio') //音频，用于摇成功提示
    wx.onAccelerometerChange(function (res) {  //小程序api 加速度计
      if (numX < res.x && numY < res.y) {  //个人看法，一次正数算摇一次，还有更复杂的
        positivenum++
        setTimeout(() => { positivenum = 0 }, 2000) //计时两秒内没有摇到指定次数，重新计算
      }
      if (numZ < res.z && numY < res.y) { //可以上下摇，上面的是左右摇
        positivenum++
        setTimeout(() => { positivenum = 0 }, 2000) //计时两秒内没有摇到指定次数，重新计算
      }
      if (positivenum == 2 && stsw) { //是否摇了指定的次数，执行成功后的操作
        stsw = false;
        wx.showModal({
          title: 'test',
          content: 'yaoyiyao',
        })
      }
    });
  },
  formSubmit(e) {
    var that = this
    let title = e.detail.value.title
    let content = e.detail.value.content
    let type = e.detail.value.type
    let _params = {
      title: title, //项目id
      content: content,
      type: type // 可选，默认为为5
    }
    console.log('提交事件',JSON.stringify(_params));
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    Api.saveTimeriver(e.detail.value).then(res => {
      console.log(res)
      if(res.data.code == 200) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000,
          mask:true,
          success:function(){
            wx.navigateTo({
              url: '../more/more?catid='+ e.detail.value.type
          })
          }
        }
          )
      }
    });
  },
  radioChange(e) {
    var that = this
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      type:e.detail.value
    })
  }
})
