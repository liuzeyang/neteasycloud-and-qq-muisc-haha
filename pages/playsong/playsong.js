const app = getApp()
var that;
var util = require('../../utils/util.js');
var count =0;
Page({
	data:{
    circular: false,
    dddd:  0 ,
		animation: '',
		dotAnData: {},
		playsong: null,
    songlists: null,
    songUrl: '',
    songImg: '',
    songTitle: '',
    songState: {
      progress: 0,
      currentPosition: '00:00',
      duration: '00:00'
    },
    isPlaying: true,
    selectedIndex: 0,
    hasSonglists: true,
    lyricSwiperH: 400,
    lyric: null,
    dotsClass: [
      'on', ''
    ],
    songFrom: 0,
    scrollTop: 0,
    timer:'',
    twoindex:'',
    index: ''
	},
	onLoad(options){
		  that = this;
	    var songlists = app.globalData.songlists;
	    var songdata = app.globalData.songData;
	    var arr = [];

	    var index = parseInt(options.no);
	    var id = options.id;
	    var mid = options.mid;
	    var albummid = options.albummid;

      that.setData({ index: index})
      console.log(this.data.index);
	    that.setData({songFrom: options.songFrom, songTitle: songdata.albumname})

		that.setData({
			songImg: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + albummid + '.jpg'
		})
		if (options.songFrom === 'toplist') {
	      for (var i = 0, len = songlists.length; i < len; i++) {
	        songlists[i].data.title = songlists[i].data.songname;
	        songlists[i].data.mid = songlists[i].data.songmid;
	        arr[i] = songlists[i].data;
	      }
	      songlists = arr;
	      that.setData({songlists: arr});
	    }
	     wx.getSystemInfo({
	      success: function (res) {
	        that.setData({
	          lyricSwiperH: res.windowHeight - 180
	        });
	      }
	    });
       console.log(that.songTitle);
	    // 修改配置
	    that.changeOption(index, id, mid, albummid, songlists);
		// wx.showActionSheet({
		//   itemList: ['A', 'B', 'C'],
		//   success: function(res) {
		//     console.log(res.tapIndex)
		//   },
		//   fail: function(res) {
		//     console.log(res.errMsg)
		//   }
		// })
	},
	onShow: function(){
        that.Rota()
        that.CDrota()
    },

    //cd旋转
    Rota:function(){
    	var i = 0
    	var dotAnData =wx.createAnimation({
            duration: 2000,
            timingFunction: 'linear'
        })
    	that.timer=setInterval(function() {
	             dotAnData.rotate(60 * (++i)).step()
	             that.setData({
	                  dotAnData: dotAnData.export()
	             })
	    }.bind(that), 2000)
    },
    stopt:function(){
    	clearInterval(that.timer)
    	that.setData({
	        dotAnData: {}
	     })
    },
    CDrota:function(){
    	 that.animation = wx.createAnimation({
  		  transformOrigin: "right top",
  		  duration: 3000,
  		  timingFunction: "ease",
  		  delay: 0
  		})
    	that.animation.rotate(30).step()
	    that.setData({
	      //输出动画
	      animation: that.animation.export()
	    })
    },
    CDrerota:function(){
       that.animation = wx.createAnimation({
        transformOrigin: "right top",
        duration: 3000,
        timingFunction: "ease",
        delay: 0
      })
      that.animation.rotate(0).step()
      that.setData({
        //输出动画
        animation: that.animation.export()
      })
    },
    onReady: function () {
    // 使用后台播放器播放音乐
	    wx.playBackgroundAudio({dataUrl: that.data.songUrl, title: that.data.songTitle, coverImgUrl: that.data.songImg});
	    that.startPlay();
	  },
  // 修改配置
  changeOption: function (index, id, mid, albummid, songlists) {
    // 调用showapi站点的音乐歌词
    that.getLyric(id);
    // 获取歌曲信息
    util.getSongInfo(id, mid, function (data) {
      //sthat.setData({playsong: data[0]});
    });
    that.setData({
      selectedIndex: index,
      songlists: songlists,
      songUrl: 'http://ws.stream.qqmusic.qq.com/C100' + mid + '.m4a?fromtag=38',
      songImg: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + albummid + '.jpg'
    });
  },
  Show: function () {
    if(count%2 === 0){
      that.setData({
        dddd:1
      })
      count++
    }else{
      that.setData({
        dddd:0
      })
      count++
    }
  },
  // 开始播放
  startPlay: function () {
    // 页面渲染完成
    that.songPlay();
    // 监听音乐播放
    wx.onBackgroundAudioPlay(function () {
      that.songPlay();
    });
  },
  // 歌词滚动
  scrollHandle: function () {},
  // 获取歌词
  getLyric: function (id) {
    util
      .getLyric(id, function (data) {
        var lyric = that
          .reconvert(data.showapi_res_body.lyric)
          .slice(4);
        lyric = that.parseLyric(lyric);
        that.setData({lyric: lyric})
      });
  },
  // 解码>>中文
  reconvert: function (str) {
    str = str.replace(/(\\u)(\w{1,4})/gi, function ($0) {
      return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{1,4})/g, "$2")), 16)));
    });
    str = str.replace(/(&#x)(\w{1,4});/gi, function ($0) {
      return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
    });
    str = str.replace(/(&#)(\d{1,6});/gi, function ($0) {
      return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2")));
    });
    return str;
  },
  // 解析歌词的方法
  parseLyric: function (lrc) {
    var lyrics = lrc.split("\n");
    var lrcObj = {};
    for (var i = 0; i < lyrics.length; i++) {
      var lyric = decodeURIComponent(lyrics[i]);
      var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
      var timeRegExpArr = lyric.match(timeReg);
      if (!timeRegExpArr) 
        continue;
      var clause = lyric.replace(timeReg, '');
      if (clause.length > 0) {
        for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
          var t = timeRegExpArr[k];
          var min = Number(String(t.match(/\[\d*/i)).slice(1)),
            sec = Number(String(t.match(/\:\d*/i)).slice(1));
          var time = min * 60 + sec;
          lrcObj[time] = clause;
        }
      }
    }
    return lrcObj;
  },
  // 转换时间格式
  timeToString: function (duration) {
    var str = '';
    var minute = parseInt(duration / 60) < 10
      ? ('0' + parseInt(duration / 60))
      : (parseInt(duration / 60));
    var second = parseInt(duration % 60) < 10
      ? ('0' + parseInt(duration % 60))
      : (parseInt(duration % 60));
    str = minute + ':' + second;
    return str;
  },
  // 播放状态控制
  songPlay: function () {
    clearInterval(timer);
    var timer = setInterval(function () {
      // 获取后台音乐播放状态
      wx.getBackgroundAudioPlayerState({
        success: function (res) {
          // 播放状态 1表示播放中
          if (res.status == 1) {
            that.setData({
              isPlaying: true,
              songState: {
                progress: res.currentPosition / res.duration * 100,
                currentPosition: that.timeToString(res.currentPosition),
                duration: that.timeToString(res.duration)
              }
            });
            //播放完切换
            if(that.data.songState.currentPosition == that.data.songState.duration){
              that.changesong()
            }
          } else {
            that.setData({isPlaying: false});
            clearInterval(timer);
          }
        }
      });
    }, 1000);
  },

  // 切换播放状态按钮
  songToggle: function () {
     wx.getBackgroundAudioPlayerState({
       success: function(res){
         var status = res.status;
         // 播放中
         if(status==1){
          wx.pauseBackgroundAudio();
          that.stopt();
          that.CDrerota();
          count=0;
         }else if(status==0){ // 暂停中
          wx.playBackgroundAudio({
            coverImgUrl: that.data.songImg,
            dataUrl: that.data.songUrl
          });
            that.songPlay();
            that.Rota();
            that.CDrota();
         }
       }
     });
    // if (that.data.isPlaying) {
    //   wx.pauseBackgroundAudio();
    // } else {
    //   wx.playBackgroundAudio({title: that.data.playsong.title, coverImgUrl: that.data.songImg});
    //   that.songPlay();
    // };

  },
  // 改变播放歌曲
  changeSong: function (ev) {
    var that = this;
    var currentIndex = ev.currentTarget.dataset.index;
    var songlists = that.data.songlists;
    var currentData = songlists[currentIndex];

    // 修改配置
    var id = currentData.id;
    var mid = currentData.mid;

    if (that.data.songFrom === 'toplist') {
      var albummid = currentData.albummid;
      id = currentData.songid;
    } else {
      var albummid = currentData.album.mid;
    }

    that.setData({songTitle: currentData.title});

    that.changeOption(currentIndex, id, mid, albummid, songlists);
    wx.seekBackgroundAudio({position: 0});
    that.startPlay();
    // 使用后台播放器播放音乐
    wx.playBackgroundAudio({dataUrl: that.data.songUrl, title: that.data.songTitle, coverImgUrl: that.data.songImg});
  },
  // 修改swiper 点样式
  swiperChange: function (ev) {
    var that = this;
    var dotsClass = ['', ''];
    dotsClass[ev.detail.current] = 'on';
    that.setData({dotsClass: dotsClass});
  },
  //华东切换歌曲
  changesong: function () {

    var songlists = that.data.songlists;
    var index = that.data.index;
    var twoindex = index + 1;
    var currentData = songlists[twoindex];
    that.setData({
      index: twoindex
    })
    // 修改配置
    var id = currentData.id;
    var mid = currentData.mid;

    if (that.data.songFrom === 'toplist') {
      var albummid = currentData.albummid;
      id = currentData.songid;
    } else {
      var albummid = currentData.album.mid;
    }

    that.setData({songTitle: currentData.title});

    that.changeOption(twoindex, id, mid, albummid, songlists);
    wx.seekBackgroundAudio({position: 0});
    that.startPlay();
    // 使用后台播放器播放音乐
    wx.playBackgroundAudio({dataUrl: that.data.songUrl, title: that.data.songTitle, coverImgUrl: that.data.songImg});
  },
  //切换歌曲
  prevsong: function () {

    var songlists = that.data.songlists;
    var index = that.data.index;
    var twoindex = index - 1 < 0 ? 0 : index-1 ;
    var currentData = songlists[twoindex];
    that.setData({
      index: twoindex
    })
    // 修改配置
    var id = currentData.id;
    var mid = currentData.mid;

    if (that.data.songFrom === 'toplist') {
      var albummid = currentData.albummid;
      id = currentData.songid;
    } else {
      var albummid = currentData.album.mid;
    }

    that.setData({songTitle: currentData.title});

    that.changeOption(twoindex, id, mid, albummid, songlists);
    wx.seekBackgroundAudio({position: 0});
    that.startPlay();
    // 使用后台播放器播放音乐
    wx.playBackgroundAudio({dataUrl: that.data.songUrl, title: that.data.songTitle, coverImgUrl: that.data.songImg});
  },
  //切换歌曲
  nextsong: function () {

    var songlists = that.data.songlists;
    var index = that.data.index;
    var twoindex = index + 1 > songlists.length ? 0 : index + 1;
    var currentData = songlists[twoindex];
    that.setData({
      index: twoindex
    })
    // 修改配置
    var id = currentData.id;
    var mid = currentData.mid;

    if (that.data.songFrom === 'toplist') {
      var albummid = currentData.albummid;
      id = currentData.songid;
    } else {
      var albummid = currentData.album.mid;
    }

    that.setData({songTitle: currentData.title});

    that.changeOption(twoindex, id, mid, albummid, songlists);
    wx.seekBackgroundAudio({position: 0});
    that.startPlay();
    // 使用后台播放器播放音乐
    wx.playBackgroundAudio({dataUrl: that.data.songUrl, title: that.data.songTitle, coverImgUrl: that.data.songImg});
  }
})