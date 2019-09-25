Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarActiveIndex: 0,
    imgUrls: [
      '/images/recycleDetail.png',
      '/images/harmDetail.png',
      '/images/wetDetail.png',
      '/images/dryDetail.png'
    ],
    navbarTitle: [
      "可回收垃圾",
      "有害垃圾",
      "湿垃圾",
      "干垃圾"
    ]
  },
  onShareAppMessage: function () {
    return {
      title: '垃圾分类查询小精灵',
      desc: '垃圾分类查询',
      path: '/pages/home/index'
    }

  },
  onLoad: function(options) {
    this.setData({
      navbarActiveIndex: options.navbarActiveIndex
    })
  },
  /**
   * 点击导航栏
   */
  // 导航点击事件
  onNavBarTap: function(event) {
    // 获取点击的navbar的index
    let navbarTapIndex = event.currentTarget.dataset.navbarIndex
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: navbarTapIndex
    })
  },

  /**
   * 
   */
  // 导航滑动事件
  onBindAnimationFinish: function({
    detail
  }) {
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: detail.current
    })
  }
})