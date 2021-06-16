$(function() {
	//0.自定义滚动条
	$('.content_list').mCustomScrollbar();
	
	//播放功能
	var $audio = $("audio");
	var player = new Player($audio);
	var progress;
	var voiceProgress;
	var lyric;
	
	//1.加载本地歌曲列表
	getPlayerList();  //调用加载歌曲文件方法
	function getPlayerList(){
		$.ajax({
			url: "./source/musiclist.json",  //加载文件的地址
			dataType: "json",  //加载文件的类型
			success: function(data){  //加载成功后，调用success的回调函数，并且把加载的数据通过参数传递给你
				player.musicList = data; //将歌曲的数据传给Player的实例对象
				//3.1遍历获取到的数据，创建每一条音乐
				var $musicList = $(".content_list ul"); //将获取到的歌曲信息（html）插入.content_list ul目录下（只需要查找一次）
				$.each(data, function(index,ele){
					var $item = crateMusicItem(index,ele); //获取（一条）歌曲信息-crateMusicItem方法
					$musicList.append($item) //向.content_list ul目录下插入歌曲信息
				});
				initMusicInfo(data[0]); //传入单首音乐的歌曲数据
				initMusicLyric(data[0]); //传入单首音乐歌词的数据
			},
			error: function(e){  //加载失败，将失败的error的回调函数的e参数传递给你
				console.log(e);
			}
		})
	}
	
	//2.初始化歌曲信息
	function initMusicInfo(music){
		//获取对应的元素
		//歌曲右侧信息
		var $musicImage = $(".song_info_pic img"); //歌曲图片
		var $musicName = $(".song_info_name a");  //歌曲名称
		var $musicSinger = $(".song_info_singer a");  //歌手
		var $musicAblum = $(".song_info_ablum a"); //专辑
		//进度条
		var $musicProgressNameOne = $(".music_progress_name_one");
		//var $musicProgressNametwo = $(".music_progress_name_two"); //横杆
		var $musicProgressNameTress = $(".music_progress_name_three");
		var $musicProgressTime = $(".music_progress_time");
		//背景
		var $musicMaskBg = $(".mask_bg");
		
		//给获取的元素赋值
		$musicImage.attr("src",music.cover);
		$musicName.text(music.name);
		$musicSinger.text(music.singer);
		$musicAblum.text(music.album);
		
		$musicProgressNameOne.text(music.name);
		$musicProgressNameTress.text(music.singer);
		$musicProgressTime.text("00:00 / "+music.time);
		
		$musicMaskBg.css("background","url('"+music.cover+"')");
	}
	
	//3.初始化歌词方法
	function initMusicLyric(music){  //根据传入的歌曲信息拿到歌词
		lyric = new Lyric(music.link_lrc); //（歌曲.歌词地址）
		var $lyricContainer = $(".song_lyric");
		//清空上一首音乐的歌词
		$lyricContainer.html("");
		lyric.loadLyric(function(){
			//创建歌词列表容器
			$.each(lyric.lyrics,function(index,ele){
				var $item = $("<li>"+ele+"</li>"); //一条歌词的创建
				$lyricContainer.append($item);
			});
		});
	}
		
	//4.初始化进度条
	initProgress();
	function initProgress(){
		//3.1初始化播放进度条功能
		var $progressBar = $(".music_progress_bar");
		var $progressLine = $(".music_progress_line");
		var $progressDot = $(".music_progress_dot");
		progress = Progress($progressBar,$progressLine,$progressDot);
		progress.progressClick(function(value){
			player.musicSeekTo(value);
		});
		progress.progressMove(function(value){
			player.musicSeekTo(value);
		});
		
		//3.2初始化声音进度条功能
		var $voiceBar = $(".music_voice_bar");
		var $voiceLine = $(".music_voice_line");
		var $voiceDot = $(".music_voice_dot");
		voiceProgress = Progress($voiceBar,$voiceLine,$voiceDot);
		voiceProgress.progressClick(function(voiceValue){
			player.musicVoiceSeekTo(voiceValue); //这里的value (var value = (eventLeft - normalLeft) / $(this).width();  //前景宽度/背景宽度)
		});
		voiceProgress.progressMove(function(voiceValue){
			player.musicVoiceSeekTo(voiceValue); 
		});
	}
	
	//5.初始化事件监听 
	initEvents();
	function initEvents(){
		/*
			1.注意：动态创建的，需要用事件委托
		 */
		//1.监听歌曲的移入移出事件
		$('.content_list').delegate(".list_music","mouseenter",function(){
			//显示子菜单
			$(this).find(".list_menu").stop().fadeIn(100);
			$(this).find(".list_time a").stop().fadeIn(100);
			//隐藏时长
			$(this).find(".list_time span").stop().fadeOut(100);
		})
		$('.content_list').delegate(".list_music","mouseleave",function(){
			//隐藏子菜单
			$(this).find(".list_menu").stop().fadeOut(100)
			$(this).find(".list_time a").stop().fadeOut(100);
			//显示时长
			$(this).find(".list_time span").stop().fadeIn(100);
		})
		/* $('.list_music').hover(function(){
			//显示子菜单
			$(this).find(".list_menu").stop().fadeIn(100);
			$(this).find(".list_time a").stop().fadeIn(100);
			//隐藏时长
			$(this).find(".list_time span").stop().fadeOut(100);
		},function(){
			//隐藏子菜单
			$(this).find(".list_menu").stop().fadeOut(100)
			$(this).find(".list_time a").stop().fadeOut(100);
			//显示时长
			$(this).find(".list_time span").stop().fadeIn(100);
		}) */
		
		// 2.监听复选框的点击事件
		$('.content_list').delegate(".list_check","click",function(){
			$(this).toggleClass("list_checked")
		})
		/* $(".list_check").click(".list_check","click",function(){
			$(this).toggleClass("list_checked")
		}) */
		
		// 3.添加子菜单播放按钮的监听  
		var $musicPlay = $(".music_play")  //找到底部的播放按钮
		$('.content_list').delegate(".list_menu_play","click",function(){
			var $item = $(this).parents(".list_music");
			/* 
				console.log($item.get(0).index);
				console.log($item.get(0).music); 
			*/
			//3.1切换播放图标
			$(this).toggleClass("list_menu_play_two")
			//3.2复原其他播放图标
			//$(this).找到当前的音乐.的其他音乐.的list_menu_play类.移除他们的list_menu_play_two类
			$item.siblings().find(".list_menu_play").removeClass("list_menu_play_two")
			//3.3同步切换底部按钮样式
			if($(this).attr("class").indexOf("list_menu_play_two") != -1){
				//当前子菜单的播放按钮是播放状态
				$musicPlay.addClass("music_play_two")
				//让文字高亮
				$item.find("div").css("color","#fff");
				$item.siblings().find("div").css("color", "rgba(255,255,255,0.5)");
			}else{
				//当前子菜单的播放按钮不是播放状态
				$musicPlay.removeClass("music_play_two")
				//让文字恢复不高亮
				$item.find("div").css("color","rgba(255,255,255,0.5)")
			}
			//3.4切换序号的状态
			$item.find(".list_number").toggleClass("list_number_two");
			$item.siblings().find(".list_number").removeClass("list_number_two");
			
			//3.5播放音乐
			player.playMusic($item.get(0).index,$item.get(0).music);
			
			//3.6切换歌曲信息
			initMusicInfo($item.get(0).music);
			
			//3.7切换歌词信息
			initMusicLyric($item.get(0).music);
		});
		// 4.监听底部控制区域播放按钮的点击
		$musicPlay.click(function(){
			//判断有没有播放过音乐
			if(player.currentIndex == -1){
				//没有播放过音乐
				//找到所以的li.的第一个li.找到li中的播放按钮.自动触发点击事件
				$(".list_music").eq(0).find(".list_menu_play").trigger("click");
			}else{
				//已经播放过音乐
				// eq(player.currentIndex)找到已经播放音乐的索引
				$(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
			}
		})
		// 5.监听底部控制区域上一首按钮的点击
		$(".music_pre").click(function(){
			$(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
		})
		// 6.监听底部控制区域下一首按钮的点击
		$(".music_next").click(function(){
			$(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
		})
		//7.监听删除按钮的点击
		//由于删除按钮是动态创建，需要使用事件委托
		$(".content_list").delegate(".list_menu_del","click",function(){
			//找到被点击的音乐
			var $item = $(this).parents(".list_music");
			
			//判断删除的音乐是否是正在播放的音乐
			if($item.get(0).index == player.currentIndex){
				//删除了当前播放的音乐，需要自动跳转播放下一首音乐
				$(".music_next").trigger("click");  //找到下一首音乐，自动触发下一首的click事件
			}
			
			//移除当前被点击删除的音乐
			$item.remove();
			//删除音乐的当前索引
			player.changeMusic($item.get(0).index);
			
			//删除前面，歌曲重新排序
			$(".list_music").each(function(index,ele){ //遍历当前索引
				ele.index = index; //把删除后的索引重新赋值给ele
				$(ele).find(".list_number").text(index + 1); //找到歌曲序号，把删除当前歌曲后面的序号全部索引加1
			})
		});
		
		//8.监听播放的进度
		player.musicTimeUpDate(function(currentTime,duration,timeStr){
			//同步时间
			$(".music_progress_time").text(timeStr);
			//同步进度条
			//计算播放比例
			var value = currentTime / duration * 100;  //计算出一首歌平均每一次返回的进度频率，播放到100进度结束播放，歌曲结束
			progress.setProgress(value);
			
			//实现歌词同步
			var index = lyric.currentIndex(currentTime); //把（歌曲时间）传入歌词定义的函数，通过定义的方法进行同步，把同步结果赋值给歌词index索引
			var $item = $(".song_lyric li").eq(index); //通过插入的歌词找到歌词的索引
			$item.addClass("cur"); //给同步的歌词添加同步样式
			$item.siblings().removeClass("cur"); //排他，不同步的歌词移除样式
			
			//歌词滚动
			if(index <= 2) return; //防止index返回-1 只让index大于2的时候执行滚动
			$(".song_lyric").css({
				marginTop: ((-index + 2) * 35) //向上滚动，只有当歌词到中间行的时候滚动，每次滚动35px行距
			})
		});
		
		// 9.监听声音播放按钮点击事件
		$(".music_voice_icon").click(function(){
			//图标切换
			$(this).toggleClass("music_voice_icon_two");
			//声音切换
			if($(this).attr("class").indexOf("music_voice_icon_two") != -1){
				//变为没有声音
				player.musicVoiceSeekTo(0);
			}else{
				//变为有声音
				player.musicVoiceSeekTo(1);
			}
		})
	}
	
	//定义一个方法创建一条音乐
	function crateMusicItem(index,music){ //两个参数（编号索引，歌曲信息）
		var $item = $("<li class=\"list_music\">\n" +
						"<div class=\"list_check\"><i></i></div>\n" +  //添加一个类-list_checked，实现复选框打钩
						"<div class=\"list_number\">"+(index+1)+"</div>\n" +
						"<div class=\"list_name\">"+music.name+"\n" +
						"<div class=\"list_menu\">\n" +
							"<a href=\"javascript:;\" title=\"播放\" class=\"list_menu_play\"></a>\n" +
							"<a href=\"javascript:;\" title=\"添加\"></a>\n" +
							"<a href=\"javascript:;\" title=\"下载\"></a>\n" +
							"<a href=\"javascript:;\" title=\"分享\"></a>\n" +
						"</div>\n" +
						"</div>\n" +
						"<div class=\"list_singer\">"+music.singer+"</div>\n" +
						"<div class=\"list_time\">\n" +
							"<span>"+music.time+"</span>\n" +
							"<a href=\"javascript:;\" title=\"删除\" class=\"list_menu_del\"></a>\n" +
						"</div>\n" +
					"</li>");
					$item.get(0).index = index; //拿到当前歌曲原生的索引
					$item.get(0).music = music; //拿到当前歌曲原生的音乐
				return $item; //返回（一条）歌曲数据
	}
	
	/* //3.监听点击播放与暂停按钮事件
	$(".music_play").click(function(){
		$(this).toggleClass("music_play_two")
	})
	//4.监听点击播放循环样式事件
	$(".music_mode").click(function(){
		$(this).toggleClass("music_mode_two")
		$(".music_mode_two").click(function(){
			$(this).toggleClass("music_mode_three")
			$(".music_mode_three").click(function(){
				$(this).toggleClass("music_mode_four")
			})
		})
	})
	//5.监听点击收藏喜欢按钮切换事件
	$(".music_fav").click(function(){
		$(this).toggleClass("music_fav_two")
	})
	//6.监听纯净模式的点击切换事件
	$(".music_only").click(function(){
		$(this).toggleClass("music_only_two")
	}) */
});

