import MyHttp from './request.js';
//所有的请求
const ALL_API = {
  // all: { //全部文章
  //   method: 'POST',
  //   url: '/index.php?m=content&c=api&a=index'
  // },
  // hits: { //top10
  //   method: 'POST',
  //   url: '/index.php?m=content&c=api&a=hits'
  // },
  lists: { //分类文章
    method: 'POST',
    url: '/index.php?m=content&c=api&a=lists'
  },
  // pageitem: { //详情
  //   method: 'POST',
  //   url: '/index.php?m=content&c=api&a=show'
  // },
  // commentlists: { //文章列表
  //   method: 'POST',
  //   url: '/index.php?m=content&c=wxcomment&a=lists'
  // },
  // postcomments: { //发布评论
  //   method: 'POST',
  //   url: '/index.php?m=content&c=wxcomment&a=publish'
  // },
  // showday: { //时间轴
  //   method: 'POST',
  //   url: '/index.php?m=content&c=punch&a=lists'
  // },
  // everyadd: { //打卡添加
  //   method: 'POST',
  //   url: '/index.php?m=content&c=punch&a=add'
  // },
  // everyupdate: { //打卡编辑
  //   method: 'POST',
  //   url: '/index.php?m=content&c=punch&a=update'
  // },
  // everydelete: { //打卡删除
  //   method: 'POST',
  //   url: '/index.php?m=content&c=punch&a=delete'
  // },
  // feedback: { //意见反馈
  //   method: 'POST',
  //   url: '/index.php?m=content&c=punch&a=feedback'
  // },
  // likenum: { //意见反馈
  //   method: 'POST',
  //   url: '/index.php?m=content&c=api&a=thumbs_up'
  // },
  // creatcode: { //二维码
  //   method: 'POST',
  //   url: '/index.php?m=content&c=msg&a=get_qrcode'
  // },
}
const Api = new MyHttp({}, ALL_API);
export default Api;
