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
    inpuVal: "", //input框内值
    listarr: [], //搜索历史
    keydown_number: 0, //检测input框内是否有内容
    hostarr: ['小龙虾','奶茶','麻辣烫','面膜','尿布','塑料'], //热门搜索接收请求存储数组
    input_value: "", //value值

    historyShowed: false,
    touch: "",
    inputValue: '',
    bindSource: [],
  },
  goBack: function() {
    wx.switchTab({
      url: '/pages/home/index'
    })
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  onShareAppMessage: function() {
    return {
      title: '垃圾分类查询小精灵',
      desc: '垃圾分类查询',
      path: '/pages/index/index'
    }

  },
  onLoad: function(options) {
    let This = this;
    console.log(options.input)
    This.setData({
      inputShowed: true,
      inputValue: options.input
    })
    wx.getStorage({
      key: 'list_arr',
      success: function (res) {
        console.log(res.data)
        This.setData({
          listarr: res.data
        })
      }
    })
  },
  onShow: function() {
  },
  //点击搜索记录搜索
  this_value: function(e) {

    this.setData({
      inputShowed: true
    })
    let value = e.currentTarget.dataset.text;
    this.setData({
      inputValue:value,
      input_value: value,
      keydown_number: 1
    })
  },
  // 清空page对象data的history数组 重置缓存为[]
  clearHistory: function() {
    this.setData({
      listarr: []
    });
    //清除缓存数据
    wx.removeStorage({
      key: 'list_arr'
    })
  },
  //当键盘输入时，触发input事件
  bindinput: function(e) {
    if (e.detail.value == "") {
      this.setData({
        historyShowed: false
      })
    } else {
      this.setData({
        historyShowed: false,
      })
      if (e.detail.cursor != 0) {
        this.setData({
          keydown_number: 1
        })
      } else {
        this.setData({
          keydown_number: 0
        })
      }
    }
  },

  //当焦点消失
  bindblur: function(e) {
    var that = this;
    var prefix = e.detail.value
    //匹配的结果
    var newSource = []
    if (prefix != "") {
      //将内容添加到历史
      wx.request({
        url: util.TXAPI_BASE_URL + '/txapi/lajifenlei/', //垃圾分类接口
        data: {
          key: util.TXAPI_KEY,
          word: prefix
        },
        success: function(res) {
          if (res.data.code == 200) {
            var newSource = res.data.newslist
            that.setData({
              historyShowed: true,
              bindSource: newSource,
              arrayHeight: newSource.length * 71
            })
          } else {
            console.error('错误码：' + res.data.code + '\n错误提示：' + res.data.msg + '\n接口详情：https://www.tianapi.com/apiview/97')
            wx.showModal({
              title: '垃圾分类',
              content: res.data.msg,
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
            that.setData({
              hideScroll: true,
              bindSource: []
            })
          }
        }
      })
    }
  },
  //点击弹出详情

  query: function(e) {
    var that = this;
    var s = this.data.bindSource[e.currentTarget.id]
    var name = s.name;
    console.log('s', s)
    if (s.type == 0) {
      var trashType = "可回收垃圾"
    } else if (s.type == 1) {
      var trashType = "有害垃圾"
    } else if (s.type == 2) {
      var trashType = "湿（厨余）垃圾"
    } else if (s.type == 3) {
      var trashType = "干（其他）垃圾"
    }
    //提示框
    wx.showModal({
      title: name,
      content: '属于：' + trashType,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    //搜索记录添加到历史纪录
    if (this.data.keydown_number == 1) {
      let This = this;
      var name = s.name;
      //把获取的input值插入数组里面
      let arr = this.data.listarr;
      console.log(name)
      console.log(this.data.input_value)
      //判断取值是手动输入还是点击赋值
      if (this.data.input_value == "") {
        // console.log('进来第er个')
        // 判断数组中是否已存在
        let arrnum = arr.indexOf(name);
        console.log(arr.indexOf(this.data.inputVal));
        if (arrnum != -1) {
          // 删除已存在后重新插入至数组
          arr.splice(arrnum, 1)
          arr.unshift(name);

        } else {
          arr.unshift(name);
        }

      } else {
        console.log('进来第一个')
        let arr_num = arr.indexOf(this.data.input_value);
        console.log(arr.indexOf(this.data.input_value));
        if (arr_num != -1) {
          arr.splice(arr_num, 1)
          arr.unshift(this.data.input_value);
        } else {
          arr.unshift(this.data.input_value);
        }

      }
      console.log(arr)

      //存储搜索记录
      wx.setStorage({
        key: "list_arr",
        data: arr
      })


      //取出搜索记录
      wx.getStorage({
        key: 'list_arr',
        success: function(res) {
          This.setData({
            listarr: res.data
          })
        }
      })
      this.setData({
        input_value: '',
      })
    } else {
      console.log("取消")
    }

  },
  //清除搜索记录
  delete_list: function() {
    //清除当前数据
    this.setData({
      listarr: []
    });
    //清除缓存数据
    wx.removeStorage({
      key: 'list_arr'
    })
  }

})