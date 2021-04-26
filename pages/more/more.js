// pages/more/more.js
import Api from '/../../utils/api.js';
var username = '';
// var dataIndex = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    catid:'',
    items:[],
    years:[{year:2021},{year:2020}],
    months:[1,2,3,4,5,6,7,8,9,10,11,12],
    isWorm:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      catid:options.catid
    })
    let _params = {
      type:options.catid
    }
    console.log('用户缓存',wx.getStorageSync('userInfo'))
    if(wx.getStorageSync('userInfo').nickName == 'ㅤ' && that.catid == '1') {
      Api.findByType(_params).then(res=>{
        console.log('生活数据',res);
        that.setData({
          items:res.data.data
        })
      })
    }else {
      Api.findByType(_params).then(res=>{
        console.log(that.catid == '2'?'读书数据':that.catid == '3'?'工作数据':'',res);
        that.setData({
          items:res.data.data
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
   
  },
  forTitle(e) {
  },
  forRemark(e) {
  },
  earMonth(n) {
  },
  getLine() { 
  },
  bindGetUserInfo(res) {
    var that = this;
    var userInfo = {};
    if (res) {
      userInfo = res.detail.userInfo;
    } else {
      wx.getUserInfo({
        success: function(res) {
          userInfo = res.userInfo;
        }
      })
    }
    if (!userInfo) return false;
    if (userInfo.nickName == 'Wormer') {
      that.setData({
        isRose: true
      });
      username = userInfo.nickName;
    }
  },
  editItem(e) {
    let showEdit = this.data.showEdit;
    let showid = e.currentTarget.dataset.forid;
    this.setData({
      showEdit: !showEdit,
      showid: showid
    });
  },
  editOne(e) {
    var that = this;
    let tt = e.currentTarget.dataset;  
    let {id, title, remark} = tt;
    that.setData({
      title: title,
      remark: remark,
      disabled: false,
      id: id,
      images: [],
      showEdit: false
    });
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  resetPage() { //默认的展示状态
    var that = this;
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    month = String(month).padStart(2, '0');
    that.setData({
      id: '',
      title: '',
      remark: '',
      year: year,
      month: month,
      showEdit: false,
      images: [],
      bigData: [],
      monthData: [],
    });
    that.getLine();
  },
  deleteOne(e) { //删除本条
    var that = this;
    let id = e.currentTarget.dataset.id;
    let _params = {
      catid: that.data.catid,
      id: id
    }
    wx.showModal({
      title: '提示',
      content: '确认删除?',
      confirmColor: '#adb4b1',
      success(res) {
        if (res.confirm) {
          Api.everydelete(_params).then(res => {
            if (!res.data.code) {
              that.resetPage();
            } else {
              wx.showModal({
                showCancel: false,
                confirmColor: '#adb4b1',
                content: `该功能已经暂停，暂不支持删除数据!`,
              })
            }
          });
        } else if (res.cancel) {}
      }
    })
  },
  removeImage(e) {
    let idx = e.target.dataset.idx;
    let img = this.data.images;
    img.splice(idx, 1);
    this.setData({
      images: img
    });
  },
  imagePreview(e) {
    let idx = e.target.dataset.idx;
    let arr = e.target.dataset.arr;
    wx.previewImage({
      current: arr[idx], //当前预览的图片
      urls: arr, //所有要预览的图片
    });
  },
  uploadImg() {
    var that = this;
    var aids = [];
    var images = that.data.images;
    return new Promise(function(resolve, reject) {
      if (images.length == 0) {
        resolve();
        return false;
      }
      for (let i = 0, h = images.length; i < h; i++) {
        wx.uploadFile({
          url: '',
          filePath: images[i],
          name: 'file',
          success: res => {
            let _data = JSON.parse(res.data)
            if (_data.code == 0) {
              let _aid = _data.aid;
              aids.push(_aid);
              that.setData({
                aids: aids
              });
              if (images.length == aids.length) {
                resolve(aids);
              }
            }
          },
          fail: function(res) {
            reject(res);
            wx.showModal({
              content: '上传图片失败',
              showCancel: false,
              confirmColor: '#adb4b1',
              success: res => {}
            });
          }
        });
      }
    });
  },
  chooseImg() { //选取图片
    var that = this;
    if (that.data.images.length < 3) { // 限制最多只能留下3张照片
      wx.chooseImage({
        count: 3,
        sizeType: ['compressed', 'original'],
        sourceType: ['album', 'camera'], // 指定来源
        success: res => {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let images = that.data.images.concat(res.tempFilePaths);
          that.setData({
            images: images
          });
        }
      });
    }
  },
  formSubmit() {
    wx.showLoading();
    var that = this,
      aids = [];
    that.setData({
      disabled: true //想偷懒都不行，这里需要点击按钮后，按钮就设置成disabled, 避免重负提交
    });
    var promise = that.uploadImg(); //进行图片的上传
    promise.then(res => {
      aids = that.data.aids;
      let aidStr = aids.join(';');
      let _params = {
        catid: that.data.catid,
        title: that.data.title,
        remark: that.data.remark,
        username: username,
        aids: aidStr //图片
      }
      if (that.data.id) { //如果有id， 修改
        _params.id = that.data.id;
        Api.everyupdate(_params).then(res => {
          if (!res.data.code) {
            wx.hideLoading();
            that.resetPage();
          }
        });
      } else {
        Api.everyadd(_params).then(res => { //更新
          if (!res.data.code) {
            wx.hideLoading();
            that.resetPage();
          } else {
            wx.hideLoading();
            wx.showModal({
              showCancel: false,
              confirmColor: '#adb4b1',
              content: '暂停更新数据功能',
            })
          }
        });
      }
    })
  },
  hideData(e) { //隐藏该月的数组
    var that = this;
    debugger;
    this.isWorm = true;
    console.log('hideData',that.isWorm);
  }
})
