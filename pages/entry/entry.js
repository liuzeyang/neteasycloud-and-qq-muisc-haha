const app = getApp()
var util = require('../../utils/util.js');
var that;

Page({
	data:{
		navbar:[
			'推荐','排行榜','搜索'
		],
		currentTab:0,
		silder:[],
		radioList:[],
		songList:[]
	},

	onLoad: function (options) {
		that= this;
		wx.showLoading({title: '数据加载中...',mask: true})
		util.getRecommend(function (data) {
			wx.hideLoading();
			that.setData({slider: data.data.slider, radioList:data.data.radioList, songList: data.data.songList})
		});
		util.getToplist(function (data) {
			that.setData({
				topList: data.filter((item, i) => item.id != 201)
			})
		})

	},
	//切换navbar
	onNavbarTap(event){
		this.setData({currentTab:event.currentTarget.dataset.index});
	},
	onToplistTap(event){
		var id = event.currentTarget.dataset.id
		wx.navigateTo({
		  url: '../toplist/toplist?topListId='+id
		})
	}
	
})









