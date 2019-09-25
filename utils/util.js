
var TXAPI_BASE_URL = "https://api.tianapi.com";  //天行数据接口域名
var TXAPI_KEY = "";  //请填写你在天行数据www.tianapi.com获得apikey

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


const getBaiduToken = function () {
  return new Promise((resolve, reject) => {
    const apiKey = '你百度图像识别的id';
    const secKey = '密码';
    const tokenUrl = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=Ex7WD50bqxyjD8wzZbgGoDZY&client_secret=Ao9H2CoqHuv9a2Bv7s12S5CyDdg5zvjm';
    wx.request({
      url: tokenUrl,
      method: 'POST',
      dataType: "json",
      header: {
        'content-type': 'application/json; charset=UTF-8'
      },
      success: function (res) {
        resolve(res);
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，请重试！',
          icon: 'none',
          duration: 2000
        })
        reject(res);
      },
      complete: function (res) {
        resolve(res);
      }
    })
  })
}

const getImgIdentify = function (tokenUrl, data) {
  return new Promise((resolve, reject) => {
    const detectUrl = 'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token='+tokenUrl;
    console.log('token', tokenUrl);
    console.log('detectUrl', detectUrl);
    wx.request({
      url: detectUrl,
      data: data,
      method: 'POST',
      dataType: "json",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        resolve(res);
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，请重试！',
          icon: 'none',
          duration: 2000
        })
        reject(res);
      },
      complete: function (res) {
        resolve(res);
      }
    })
  })
}


module.exports = {
  TXAPI_BASE_URL: TXAPI_BASE_URL,
  TXAPI_KEY: TXAPI_KEY,
  formatTime: formatTime,
  getBaiduToken,
  getImgIdentify
}
