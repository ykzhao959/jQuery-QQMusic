/* (function (window) {
	/*
		1.创建一个闭包，与外界数据隔绝，不会污染数据环境
		2.给闭包传递window参数目的是将闭包里需要暴露给外界使用的东西，变成我们的全局变量，暴露给外界使用 
	*/
   /*
	function Player(){
		return new Player.prototype.init(); //作用：创建Player实例化对象就可以自动调用init初始化对象方法,无需另行调用
	}
	Player.prototype = { 
		constructor: Player, //将Player原型改为{}.prototype
		init: function(){  //在Player的原型对象中创建init对象-init作用是作为初始化方法
			
		}
	}
	Player.prototype.init.prototype = Player.prototype; //将init的原型对象指向{}.prototype原型对象,无论以后实例化的对象是谁，只要是Player和init创建的实例化对象就都可以访问到{}.prototype原型对象
	window.Player = Player;
})(window); */

(function (window) {
	/* 
		1.创建一个闭包，与外界数据隔绝，不会污染数据环境
		2.给闭包传递window参数目的是将闭包里需要暴露给外界使用的东西，变成我们的全局变量，暴露给外界使用 
	*/
	function Player($audio){
		return new Player.prototype.init($audio); //作用：创建Player实例化对象就可以自动调用init初始化对象方法,无需另行调用
	}
	Player.prototype = { 
		constructor: Player, //将Player原型改为{}.prototype
		musicList: [], //index.js中传入的歌曲数据，存储到player.js的musicList参数的数组内
		init: function($audio){  //在Player的原型对象中创建init对象-init作用是作为初始化方法
			this.$audio = $audio; //js封装好的对象
			this.audio = $audio.get(0); //原生的对象
		},
		currentIndex: -1,
		playMusic: function(index,music){
			//判断是否是同一首音乐
			if(this.currentIndex == index){
				//同一首音乐
				if(this.audio.paused){
					this.audio.play();
				}else{
					this.audio.pause();
				}
			}else{
				//不是同一首
				this.$audio.attr("src",music.link_url);  //更改另一首歌的路径
				this.audio.play(); //重新播放
				this.currentIndex = index; //把重新播放的索引设为当前播放的索引
			}
		},
		preIndex: function(){  //上一首索引
			var index = this.currentIndex - 1;  //当前索引减1
			if(index < 0){  //当当前索引小于0，也就是说要跳转为最后一首音乐
				index = this.musicList.length - 1; //把歌单长度-1（相当于最后一首音乐）的长度赋值当前索引
			}
			return index;
		},
		nextIndex: function(){  //下一首索引
			var index = this.currentIndex + 1; //当前索引加1
			if(index > this.musicList.length - 1){
				index = 0;
			}
			return index;
		},
		changeMusic: function(index){  //找到音乐的当前索引
			//删除对应的数据
			this.musicList.splice(index , 1);  //splice()方法删除当前索引
			//判断当前删除的是否是正在播放音乐的前面的音乐
			if(index < this.currentIndex){
				//如果删除的是前面的音乐，那么索引减1再重新赋值给当前索引
				this.currentIndex = this.currentIndex - 1;
			}
		},
		//歌曲音频长度
		musicTimeUpDate: function(callBack){
			var $this = this;
			this.$audio.on("timeupdate",function(){
				var duration = $this.audio.duration; //duration 属性返回当前音频的长度
				var currentTime = $this.audio.currentTime; //currentTime 属性设置或返回音频播放的当前位置（以秒计）; 当设置该属性时，播放会跳跃到指定的位置
				//console.log(duration,currentTime);
				var timeStr = $this.formatData(currentTime,duration)
				callBack(currentTime,duration,timeStr); //不能用return，return只能是就近原则；在外围函数传入一个参数调用callBack
			});
		},
		//定义一个格式化播放时间的方法
		formatData: function(currentTime,duration){
			// 结束的分钟与秒钟
			var endMin = parseInt(duration / 60); //分钟
			var endSec = parseInt(duration % 60); //秒钟
			if(endMin < 10){
				endMin = "0" + endMin;
			}
			if(endSec < 10){
				endSec = "0" +endSec;
			}
			// 开始的分钟与秒钟
			var startMin = parseInt(currentTime / 60); //分钟
			var startSec = parseInt(currentTime % 60); //秒钟
			if(startMin < 10){
				startMin = "0" + startMin;
			}
			if(startSec < 10){
				startSec = "0" +startSec;
			}
			return startMin + ":" +startSec + "/" +endMin + ":" + endSec;
		},
		//点击播放进度条位置使音乐播放同一进度
		musicSeekTo: function(value){
			if(isNaN(value)) return;
			this.audio.currentTime = this.audio.duration * value;  //将歌曲音频长度 * 被点击进度条比例
		},
		//点击声音进度条
		musicVoiceSeekTo: function(voiceValue){
			if(isNaN(voiceValue)) return;
			if(voiceValue < 0 || voiceValue >1) return;
			//0~1 值越大声音越大
			this.audio.volume = voiceValue; //设置音乐声音大小
		}
	}
	Player.prototype.init.prototype = Player.prototype; //将init的原型对象指向{}.prototype原型对象,无论以后实例化的对象是谁，只要是Player和init创建的实例化对象就都可以访问到{}.prototype原型对象
	window.Player = Player;
})(window);

/* (function (window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor: Player,
        musicList: [],
        init: function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        currentIndex: -1, // 4  3
        playMusic: function (index, music) {
            // 判断是否是同一首音乐
            if(this.currentIndex == index){
                // 同一首音乐
                if(this.audio.paused){
                    this.audio.play();
                }else{
                    this.audio.pause();
                }
            }else {
                // 不是同一首
                this.$audio.attr("src", music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        preIndex: function () {
            var index = this.currentIndex - 1;
            if(index < 0){
                index = this.musicList.length - 1;
            }
            return index;
        },
        nextIndex: function () {
            var index = this.currentIndex + 1;
            if(index > this.musicList.length - 1){
                index = 0;
            }
            return index;
        },
        changeMusic: function (index) {
            // 删除对应的数据
            this.musicList.splice(index, 1);

            // 判断当前删除的是否是正在播放音乐的前面的音乐
            if(index < this.currentIndex){
                this.currentIndex = this.currentIndex - 1;
            }
        },
        musicTimeUpdate: function (callBack) {
            var $this = this;
            this.$audio.on("timeupdate", function () {
                var duration = $this.audio.duration;
                var currentTime = $this.audio.currentTime;
                var timeStr = $this.formatDate(currentTime, duration);
                callBack(currentTime, duration, timeStr);
            });
        },
        formatDate: function (currentTime, duration) {
            var endMin = parseInt(duration / 60); // 2
            var endSec = parseInt(duration % 60);
            if(endMin < 10){
                endMin = "0" + endMin;
            }
            if(endSec < 10){
                endSec = "0" + endSec;
            }

            var startMin = parseInt(currentTime / 60); // 2
            var startSec = parseInt(currentTime % 60);
            if(startMin < 10){
                startMin = "0" + startMin;
            }
            if(startSec < 10){
                startSec = "0" + startSec;
            }
            return startMin+":"+startSec+" / "+endMin+":"+endSec;
        },
        musicSeekTo: function (value) {
            if(isNaN(value)) return;
            this.audio.currentTime = this.audio.duration * value;
        },
        musicVoiceSeekTo: function (value) {
            if(isNaN(value)) return;
            if(value <0 || value > 1) return;
            // 0~1
            this.audio.volume = value;
        }
    }
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window); */