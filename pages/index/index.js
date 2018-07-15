//index.js
//获取应用实例
const app = getApp()

Page(
  {
    // 页面数据:
    data: {
      now: {
        temp: 12,
        weather: "晴",
        background: "/resources/images/weather/sunny-bg.png"
      },
      forecasts: [],
      today: {
        date: "",
        minTemp: 0,
        maxTemp: 0
      }
    },
    // 功能函数: 更新当前天气
    setNow(now) {
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

      // 解析当前天气:
      let temp = now.temp;
      let weather = now.weather;
      let background = "/resources/images/weather/" + weather + "-bg.png";

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
            weather: weatherCookbook[weather],
            background: background
          }
        }
      );
    },
    // 功能函数: 更新天气预报
    setForecasts(forecast) {
      // 解析天气预报:
      let nowHour = new Date().getHours();
      let forecasts = [];
      for (let i = 0; i < forecast.length; ++i) {
        forecasts.push(
          {
            time: ((nowHour + 3 * i) % 24) + "时",
            icon: "/resources/images/forecast/" + forecast[i].weather + "-icon.png",
            temp: forecast[i].temp
          }
        )
      }
      forecasts[0].time = "现在";
      // 更新当前天气:
      this.setData(
        {
          forecasts: forecasts 
        }
      );
    },
    // 功能函数: 更新今日最高最低气温
    setMinMaxTemp(today) {
      let now = new Date();

      // 日期:
      let date = `今日 ${now.getFullYear()}-${now.getMonth() + 1}-${now.getDay() + 1}`;
      // 最高最低气温:
      let tempRange = `${today.minTemp}℃ - ${today.maxTemp}℃`;

      this.setData(
        {
          today: {
            date: date,
            tempRange: tempRange
          }
        }
      )
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
            // 服务器返回数据:
            let result = res.data.result;
            // 更新当前天气:
            this.setNow(result.now);
            // 更新天气预报:
            this.setForecasts(result.forecast);
            // 更新今日最高最低气温:
            this.setMinMaxTemp(result.today);
            console.log(result);
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