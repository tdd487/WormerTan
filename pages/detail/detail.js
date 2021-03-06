// pages/detail/detail.js
import Api from '/../../utils/api.js';
import util from '/../../utils/util.js';
let wxparse = require("../../wxParse/wxParse.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userIdd:0,
    items: {},
    dkcontent: '',
    id: '',
    catid: '',
    comments: [], //反馈列表
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    disabled: true,
    loadMore: true,
    focus: true,
    userInfo: {},
    content: '',
    placeholder: '爱发言的人运气都不会太差',
    reply_username: '',
    pid: 0,
    page: 1,
    likenum: null,
    like: false,
    maskHidden: false,
    codeurl: "",
    commentshow: false,
    modalshow: true,
    imagePath: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading();
    var that = this;
    let _userInfo = wx.getStorageSync('userInfo')
    let scene = decodeURIComponent(options.scene);
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      let info_arr = [];      
      info_arr = scene.split('&');
      let _catid = info_arr[0];
      let _id = info_arr[1];
      that.setData({
        userInfo: _userInfo,
        id: _id,
        catid: _catid
      });
    } else {
      that.setData({
        userInfo: _userInfo,
        id: options.id,
        catid: options.catid
      });
    }
    if (wx.getStorageSync('userInfo')) {} else {
      wx.getSetting({
        success: function(res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                let _userInfo = res.userInfo;
                app.globalData.userInfo = _userInfo;
                wx.setStorageSync('userInfo', _userInfo)
              }
            })
          }
        }
      });
    }
    that.getData();
    that.commentlists(); //反馈列表
    that.top10(); //top 10推荐
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
    var that = this;
    let page = that.data.page + 1;
    that.setData({
      page: page
    });
    if (that.data.loadMore) {
      that.commentlists();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.items.title,
      path: "/detail/detail",
      imageUrl: '/assets/images/share.jpg'
    }
  },
  getData() {
    var that = this;
    let _params = {
      id: that.data.id
    };
    Api.pageitem(_params).then(res => {
      if (200 == res.data.code) {
        wx.hideLoading();
        let _data = res.data.data;
        var _tpl = _data.content;
        that.setData({
          likenum: _data.thumbs_up,
          items: _data,
          dkcontent: _tpl
        });
        wxparse.wxParse('dkcontent', 'html', _tpl, that, 5);
      }
    })
  },
  commentNow() {
    this.setData({
      focus: true
    })
  },
  commentBox() {
    var that = this;
    that.setData({
      commentshow: !that.data.commentshow,
    })
    if (!that.data.codeurl) {
      that.getCode();
    }
  },
  wetherLike() { //点赞
    var that = this;
    let params = {
      id: that.data.id,
      catid: that.data.catid
    }
    if (!that.data.like) {
      Api.likenum(params).then(res => {
        if (!res.data.code) {
          let _data = res.data.data;
          let linknn = parseInt(that.data.likenum)
          that.setData({
            likenum: linknn + 1,
            like: !that.data.like
          })
          wx.showToast({
            title: '感谢您的鼓励！',
            icon: 'none',
            duration: 2000
          })
        }
      });
    }
    if (that.data.like) {
      let linknn = parseInt(that.data.likenum)
      that.setData({
        likenum: linknn - 1,
        like: !that.data.like
      })
      wx.showToast({
        title: '我会继续努力！',
        icon: 'none',
        duration: 2000
      })
    }
  },
  backContent(e) { //回复的评论
    let _from = e.currentTarget.dataset.from;
    let _id = e.currentTarget.dataset.pid;
    this.setData({
      placeholder: '回复 ' + _from,
      focus: true,
      reply_username: _from,
      pid: _id,
      commentshow: false
    })
  },
  top10() { //推荐阅读
    var that = this;
    let params = {
      pagesize: 5,
      page: 1,
      catid: that.data.catid
    }
    Api.lists(params).then(res => { //文章列表
      if (!res.data.code) {
        let _data = res.data.data;
        that.setData({
          top10: _data
        });
      }
    })
  },
  articleDetail(e) {
    let {id, catid} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../detail/detail?catid=' + catid + '&id=' + id
    });
  },
  previewImage(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },
  goHome() {
    wx.switchTab({
      url: '../index/index'
    });
  },
  forContent(e) {
    let that = this;
    let _content = e.detail.value;
    // 禁止输入空格
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    var emptyy = re.test(_content);
    if (emptyy) return false;
    //end
    that.setData({
      content: _content
    })
    if (that.data.content) {
      that.setData({
        disabled: false
      })
    } else {
      that.setData({
        disabled: true
      })
    }
  },
  bindGetUserInfo(e) {
    console.log("bindGetUserInfo")
    var that = this;
    var userInfovarvar = {};
    wx.getUserInfo({
      success: function (res) {
        userInfovarvar = res.userInfo
        let _params = {
          "nickName": res.userInfo.nickName,
          "avatarUrl": res.userInfo.avatarUrl,
          "gender": res.userInfo.gender,
          "country": res.userInfo.country,
          "province": res.userInfo.province,
          "city": res.userInfo.city, 
          "language": res.userInfo.language
        }
        console.log("======================userInfovarvar======================");
        console.log(JSON.stringify(userInfovarvar));
        Api.saveUserInfo(_params).then(res =>{
          userInfovarvar.id = res.data.data
          that.setData({
            userInfo: userInfovarvar
          })
        });
        console.log("======================userInfo======================");
        console.log(JSON.stringify(userInfovarvar));
      },
      fail: function (res) {
        wx.showModal({
          showCancel: false,
          confirmColor: '#adb4b1',
          confirmColor: '#adb4b1',
          content: '授权通过后才能评论哟，请重新授权！'
        })
      }
    })
    
  },
  postComments() {
  },
  commentlists() {
    var that = this;
    let _params = {
      newsid: that.data.id,
      page: that.data.page,
      pagesize: 10
    }
    // Api.commentlists(_params).then(res => {
    //   if (res.data.code == 0) {
    //     let _data = res.data.data;
    //     let _count = res.data.count;
    //     let _arr = that.data.comments.concat(_data);
    //     that.setData({
    //       comments: _arr,
    //       count: _count
    //     });
    //     if (_data.length < 10) {
    //       that.setData({
    //         loadMore: false
    //       });
    //     }
    //   } else {
    //     wx.showModal({
    //       showCancel: false,
    //       confirmColor: '#adb4b1',
    //       content: '评论加载失败!'
    //     })
    //   }
    // });
  },
  forRemark(e) {
    var that = this;
    let _data = e.detail.value;
    // 禁止输入空格
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    var emptyy = re.test(_data);
    if (emptyy) return false;
    //end
    that.setData({
      content: _data
    });
    if (that.data.content) {
      that.setData({
        disabled: false
      })
    } else {
      that.setData({
        disabled: true
      })
    }
  },
  makePhoto(e) { //点击生成海报
    var that = this;
    if (this.data.imagePath) {
      that.setData({
        modalshow: false,
      });
      return false;
    }
    wx.showToast({
      title: '请骚等...',
      icon: 'loading',
      duration: 1000
    });
    that.setData({
      modalshow: false,
      commentshow: false
    });
    const datas = that.data.items;
    const titles = datas.title; //標題
    const desc = datas.description; //介绍
    const imgs = datas.thumb ? datas.thumb : ''; //图片
    wx.getImageInfo({
      src: that.data.codeurl, //服务器返回的图片地址
      success: res => {
        let Path = res.path;
        that.createNewImg(Path, imgs, titles, desc);
      }
    })
  },
  /*
  海报
  */
  createNewImg: function(codes, img, title, desc) {
    var that = this;
    var Worm = wx.createCanvasContext('mycanvas');
    Worm.setFillStyle("#ffffff")
    Worm.fillRect(0, 0, 600, 1000); //填充一个矩形。用 setFillStyle
    wx.getImageInfo({
      src: img, //服务器返回的图片地址
      success: function(res) {
        var thumb = res.path;
        var datee = new Date();
        var cctime = util.formatTime(datee);
        var bg = "/assets/images/44.png";
        Worm.drawImage(bg, 0, 737, 640, 395); //绘制首图
        Worm.drawImage(thumb, 20, 140, 560, 300); //绘制首图
        Worm.drawImage(codes, 360, 720, 200, 200); //绘制二维码
        Worm.setFontSize(30);
        Worm.setTextAlign('right'); //设置字体对齐
        Worm.setFillStyle('#adb4b1');
        Worm.fillText('虫子博客', 560, 60);
        Worm.setFontSize(20);
        Worm.setFillStyle('#666');
        Worm.fillText(cctime, 560, 120);
        Worm.beginPath();
        Worm.lineWidth = "2";
        Worm.strokeStyle = "#adb4b1";
        Worm.rect(400, 20, 180, 60);
        Worm.stroke();
        Worm.beginPath();
        Worm.lineWidth = "2";
        Worm.strokeStyle = "#f2f2f2";
        Worm.rect(20, 690, 570, 230);
        Worm.stroke();
        Worm.setFillStyle("#333");
        Worm.setFontSize(20); //设置字体大小
        Worm.setTextAlign('center'); //设置字体对齐
        Worm.beginPath() //分割线
        Worm.stroke();
        Worm.setTextAlign('left');
        Worm.setFontSize(40);
        if (title.length <= 14) {
          Worm.fillText(title, 40, 500); //文章标题
        } else {
          Worm.fillText(title.substring(0, 14), 40, 500);
          Worm.fillText(title.substring(14, 26), 40, 550);
        }
        Worm.setFillStyle("#999");
        Worm.setFontSize(20);
        if (title.length <= 14 && desc.length >= 26) {
          Worm.fillText(desc.substring(0, 26), 40, 560);
          Worm.fillText(desc.substring(26, 50) + '...', 40, 595);
        } else if (title.length <= 14 && desc.length <= 26) {
          Worm.fillText(desc, 26, 560);
        } else if (title.length >= 14 && desc.length <= 26) {
          Worm.fillText(desc, 26, 640); //文章描述
        } else {
          Worm.fillText(desc.substring(0, 26), 40, 610);
          Worm.fillText(desc.substring(26, 50) + '...', 40, 645);
        }
        Worm.setTextAlign('left');
        Worm.setFontSize(28);
        Worm.setFillStyle('#666');
        Worm.fillText('Hi, 这篇文章很精彩,', 40, 770);
        Worm.fillText('我想转发给你！', 40, 820);
        Worm.setFillStyle('#999');
        Worm.setFontSize(20);
        Worm.fillText('长按识别阅读文章', 380, 950);
        wx.showToast({
          title: '分享图片生成中...',
          icon: 'loading',
          duration: 1000
        });
        Worm.draw();
        // 将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
        setTimeout(function() {
          wx.canvasToTempFilePath({
            canvasId: 'mycanvas',
            success: function(res) {
              var tempFilePath = res.tempFilePath;
              that.setData({
                imagePath: tempFilePath,
                canvasHidden: true,
                commentShow: false
              });
              wx.hideToast()
            },
            fail: function(res) {}
          }, this);
        }, 1000);
      }
    })
  },
  //点击保存到相册
  baocun() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function(res) {
            if (res.confirm) {
              /* 该隐藏的隐藏 */
              that.setData({
                modalshow: true
              })
            }
          },
          fail: function(res) {}
        })
      }
    })
  },
  quxiao() {
    var that = this;
    that.setData({
      modalshow: true
    })
  },
  //点击生成
  getCode() { //生成二维码
    var that = this;
    let _params = {
      catid: that.data.catid,
      id: that.data.id
    }
    Api.creatcode(_params).then(res => {
      if (res.data.code == 0) {
        let _data = res.data.url;
        that.setData({
          codeurl: _data
        })
      }
    });
  }
})
