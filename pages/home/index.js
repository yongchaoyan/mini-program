//index.js
//获取应用实例
var util = require('../../utils/util.js')
const app = getApp()
var wayIndex = -1;
var school_area = '';
var grade = '';
// 当联想词数量较多，使列表高度超过340rpx，那设置style的height属性为340rpx，小于340rpx的不设置height，由联想词列表自身填充
// 结合上面wxml的<scroll-view>
var arrayHeight = 0;
Page({
  data: {
    inputValue: '',
  },

  onShareAppMessage: function() {
    return {
      title: '垃圾分类查询小精灵',
      desc: '垃圾分类查询',
      path: '/pages/home/index'
    }

  },
  onLoad: function() {

  },
  goBack: function() {
    wx.navigateTo({
      url: '/pages/search/index'
    })
  },
  //当tap时跳转
  bindtap: function(e) {
    wx.navigateTo({
      url: '/pages/search/index'

    })
  },
  //选择图片并分析
  addapimg: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (ress) {
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
                      success: function (ress) {
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

  //上传图片
  uploads: function() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //console.log( res )
        that.setData({
            img: res.tempFilePaths[0],
            names: '',
            scores: ''
          }),
          wx.showLoading({
            title: "努力分析中..."
          }),
          wx.uploadFile({
            url: 'https://www.stingray.fun/smallProgram/images/upload',
            filePath: res.tempFilePaths[0],
            header: {
              'content-type': 'multipart/form-data'
            },
            name: 'file',
            formData: {
              'user': 'test'
            },
            success: function(res) {
              wx.hideLoading();
              var data = res.data;
              var str = JSON.parse(data);
              console.log(str);
              if (str.words == "success") {
                that.setData({
                  names: "动物名称：" + " " + str.name,
                  scores: "可信度：" + " " + str.score
                })
              } else {
                that.setData({
                  names: str.words,
                })
              }
            },
            fail: function(res) {
              wx.hideLoading();
              console.log(res);
              that.setData({
                names: '小程序离家出走了稍后再试',
              })
            }
          })
      }
    })
  }
})