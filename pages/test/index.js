var util = require('../../utils/util.js')
const app = getApp()
var name = "";
var score = "";
var words = "";
Page({
  data: {
    motto: '动物识别',
    userInfo: {},
    images: {},
    info: "点击查看识别结果",
    names: "",
    scores: "",
    remark: ""
  },
  onShareAppMessage: function() {
    return {
      title: '动物识别小程序',
      path: '/pages/plant/plant',
      success: function(res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          wx.showToast({
            title: '分享成功',
            icon: 'success',
            duration: 500
          });
        }
      },
      fail: function(res) {
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          wx.showToast({
            title: '分享取消',
            icon: 'loading',
            duration: 500
          })
        }
      }
    }
  },
  clear: function(event) {
    console.info(event);
    wx.clearStorage();
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //选择图片并分析
  addapimg: function() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(ress) {
        console.log(ress)
        if (ress.size > 1024 * 1024 * 4) {
          wx.showModal({
            title: '垃圾分类',
            content: '很抱歉，图片最大允许4M，当前为' + (ress.size / (1024 * 1024)).toFixed(2),
          })
          return false;
        } else {
          that.setData({
              img: ress.tempFilePaths[0],
              names: '',
              scores: ''
            }),
            wx.showLoading({
              title: "努力分析中..."
            }),
            wx.getFileSystemManager().readFile({
              filePath: ress.tempFilePaths[0], //选择图片返回的相对路径
              encoding: 'base64', //编码格式
              success: res => { //成功的回调
                console.log('data:image/png;base64,' + res.data)

                util.getBaiduToken().then((resss) => {
                  console.log('baidu--token', resss);
                  let token = resss.data.access_token;
                  console.log('token----', token);
                  let data = {
                    "image": res.data
                  }
                  util.getImgIdentify(token, data).then((res) => {
                    console.log('baidu--img-detect', res);
                    let score = parseInt(res.data.result_num);
                    that.setData({
                      score: score,
                      name: res.data.result[0].keyword,
                    })
                    wx.hideLoading();
                    wx.showActionSheet({
                      itemList: [res.data.result[0].keyword, res.data.result[1].keyword, res.data.result[2].keyword, res.data.result[3].keyword, res.data.result[4].keyword],
                      success: function(ress) {
                        if (!ress.cancel) {
                          console.log(ress.tapIndex)
                          console.log(res.data.result[ress.tapIndex].keyword)
                          wx.redirectTo({
                            url: '/pages/search/index?input=' + res.data.result[ress.tapIndex].keyword,
                          })
                          //console.log('redirectTo', url)
                        }
                      }
                    });
                  })
                })
              }
            })
        }
      }
    })
  },
  onLoad: function() {

  }
});