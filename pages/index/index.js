//index.js
//获取应用实例
const app = getApp()

Page(
  {
    // 页面数据:
    data: {
      now: {
        temp: 12,
        weather: "晴"
      }
    },
    // 功能函数: 更新天气显示
    getNow(completeCallback) {
      wx.request(
        {
          url: "https://test-miniprogram.com/api/weather/now",
          data: {
            city: "深圳市"
          },
          header: {
            'content-type': 'application/json'
          },
          success: res => {
            // 导航栏颜色设置:
            const weatherNavBarColor = {
              'sunny': '#cbeefd',
              'cloudy': '#deeef6',
              'overcast': '#c6ced2',
              'lightrain': '#bdd5e1',
              'heavyrain': '#c5ccd0',
              'snow': '#aae1fc'
            };
            // 天气编码解析:
            const weatherCookbook = {
              'sunny': '晴天',
              'cloudy': '多云',
              'overcast': '阴',
              'lightrain': '小雨',
              'heavyrain': '大雨',
              'snow': '雪'
            }

            // 服务器返回数据:
            var weatherInfo = res.data.result;

            // 解析当前天气:
            var temp = weatherInfo.now.temp;
            var weather = weatherInfo.now.weather;

            // 更新导航栏颜色:
            wx.setNavigationBarColor(
              {
                frontColor: '#ffffff',
                backgroundColor: weatherNavBarColor[weather]
              }
            );
            // 更新当前天气:
            this.setData(
              {
                now: {
                  temp: temp,
                  weather: weatherCookbook[weather]
                }
              }
            );
          },
          complete: () => {
            completeCallback && completeCallback();
          }
        }
      )
    },
    // 生命周期函数：01-加载
    onLoad() {
      this.getNow();
    },
    // 生命周期函数: 02-下拉刷新
    onPullDownRefresh() {
      this.getNow(wx.stopPullDownRefresh);
    }
  }
)