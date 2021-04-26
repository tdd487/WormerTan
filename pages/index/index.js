// pages/index/index.js
import Api from '/../../utils/api.js';
import login from '/../../utils/login.js';
const app = getApp();
var page = 1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: true,
    notices: [
      // {id:'1',catid:'1',title:'情绪',description:'没有什么情绪是叹一口气缓解不了的，如果有，就叹两口 气；就像没有什么肚腩是吸一口气藏不住的，如果有，就用力 吸！'},
      // {id:'2',catid:'2',title:'忍耐',description:'这个世界上最厉害的人，不是手里的武器有多 先进，不是银行卡里的余额有多可观，不是脑子里的人生哲理有 多深厚，而是控制情绪的能力有多强。'}
  ],
    items: [],
    loadMore: false,
    every: [{
      icon: 'icon-yinyue',
      name: '生活',
      id: 1
    },
    {
      icon: 'icon-xiangmu',
      name: '工作',
      id: 3
    },
    {
    icon: 'icon-book',
    name: '读书',
    id: 2
    }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.hideLoading();
    that.getNotice();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) { },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    page = 1;
    that.setData({
      items: [],
      loadMore: true
    });
    if (that.data.loadMore) {
      that.getNotice();
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    page = page + 1;
    if (that.data.loadMore) {
      that.getLists();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '',
      imageUrl: '/assets/images/share.jpg'
    }
  },
  articleDetail(e) {
    
    let {id, catid} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../detail/detail?catid=${catid}&id=${id}`
    });
  },
  getLists(e) {
    let that = this;
    let params = {
      pageNo: page,
      pagesize: 8
    }
    Api.all(params).then(res => { //文章列表,过滤thumb为1的数据
      if (200 == res.data.code) {
        let _data = res.data.data;
        let _itemss = [];
        for(var i =0;i<_data.length;i++) {
          if(_data[i].thumb != '1') {
            _itemss.push(_data[i]);
          }
        }
        let _items = [...that.data.items, ..._itemss];
        if (_data.length < 8) {
          that.setData({
            loadMore: false
          })
        }
        that.setData({
          items: _items
        });
      }
    });
  },
  top10() {
    Api.hits().then(res => { //文章列表
      if (!res.data.code) {
        let _data = res.data.data;
        this.setData({
          top10: _data
        });
      }
    });
  },
  getNotice() {
    var that = this;
    let _params = {
      catid: 21, //项目id
      pageNo: 1,
      pagesize: 3 // 可选，默认为为5
    }
    Api.lists(_params).then(res => {
      console.log("你是睡");
      if (!that.data.code) {
        let _data = res.data.data;
        let _notices = [];
        for(var i = 0;i<_data.length;i++) {
          if(_data[i].thumb == '1'){
            _notices.push(_data[i]);
          }
        }
        that.setData({
          notices: _notices,
        })
        that.getLists();
        wx.hideLoading();
      }
    });
  },
  onPageScroll(e) {
    var _backShow = false;
    if (e.scrollTop > 100) {
      _backShow = true;
    } else {
      _backShow = true;
    }
  },
  controlMusic() {
    if (this.data.isPlay) {
      app.AppMusic.pause();
      this.setData({
        isPlay: false
      });
    } else {
      app.AppMusic.play();
      this.setData({
        isPlay: true
      });
    }
  },
  bindGetUserInfo(res) {
    debugger;
    var that = this;
    var userInfo = {};
    if (res) {
      userInfo = res.detail.userInfo;
      wx.setStorageSync('userInfo', res.detail.userInfo);
    } else {
      wx.getUserInfo({
        success: function(res) {
          wx.setStorageSync('userInfo', res.detail.userInfo);
        }
      })
    }
    console.log(wx.getStorageSync('userInfo'));
  },
})
