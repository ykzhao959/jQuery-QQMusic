(function (window) {
    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor: Lyric,
        init: function (path) {
            this.path = path;
        },
		times: [], //保存所有时间
		lyrics: [], //保存所有歌词
		index: -1, //先定义一个歌词索引为-1
		loadLyric: function(callBack){
			var $this = this;
			$.ajax({
				url: $this.path,  //加载文件的地址
				dataType: "text",  //加载文件的类型
				success: function(data){  //加载成功后，调用success的回调函数，并且把加载的数据通过参数传递给你
					//console.log(data); //这里的data是单纯文件读取的数据
					$this.parseLyric(data);
					callBack();
				},
				error: function(e){  //加载失败，将失败的error的回调函数的e参数传递给你
					console.log(e);
				}
			})
		},
		//歌词解析
		parseLyric: function(data){
			var $this = this;
			//在解析其他歌曲的歌词前一定要清空上一首音乐的歌词信息和时间
			$this.times = [];
			$this.lyrics = [];
			var array = data.split("\n"); //切割split歌词
			//console.log(array);  //这里的array,是将读取的文件数据进行切割重新存入数组
			//"[00:00.92]"
			var timeReg = /\[(\d*:\d*\.\d*)\]/ //正则表达式  这里(\d*:\d*\.\d*)用一个中括号包围起来，可以使读取的数据另外读取出时间不包括中括号
			//遍历取出每一条歌词
			$.each(array,function(index,ele){
				/*
				注意：处理歌词
					切割完出现两个索引字符串，要拿到歌词列，就选择索引[1]
					0: "[01:59.56"
					1: "花店玫瑰 名字写错谁"
				注意：放到前面先提前处理歌词
				 */
				var lrc = ele.split("]")[1]; //拿到索引[1]
				//console.log(lrc); //获取切割后的歌词
				//排除空字符串（没有歌词）
				if(lrc.length == 1 || lrc.length == 0) return true; //如果返回的长度为1就代表空字符串
				$this.lyrics.push(lrc);
				
				//console.log(ele); //这里将数组进行遍历，可用于数据读取使用
				var res = timeReg.exec(ele);
				//console.log(res); //这里是转正则表达式的歌曲信息
				if(res == null) return true;
				var timeStr = res[1]; //00:00.92
				var res2 = timeStr.split(":"); //以时间的:为分隔点
				var min = parseInt(res2[0]) *60; //将分钟转换为秒
				var sec = parseFloat(res2[1]); //获取秒与毫秒
				var time = parseFloat(Number(min + sec).toFixed(2)); //获取总时间(toFixed(2))保留两位小数，会变成字符串，那就需要在前面加parseFloat，将字符串转换为浮点型
				//console.log(time); //获取歌词对应的时间
				$this.times.push(time); //push()把指定的值添加到数组后并返回新长度
				
			})
			console.log($this.times);
			console.log($this.lyrics); //清除歌词中空字符串
		},
		currentIndex: function(currentTime){ //currentTime是歌曲同步时间
			//console.log(currentTime);
			if(currentTime >= this.times[0]){ //当歌曲的播放时间大于歌词出现的时间时，则执行歌词同步
				this.index++;
				this.times.shift(); //shift()删除数组最前面的一个元素 删掉歌词时间，就同步到下一条歌词（bug：如果歌曲进度条回滚，被删掉的歌词就出现bug）
			}
			return this.index; //重新返回定义的索引
		}
        /*
        [6.4,23.59,26.16,29.33,34.27,36.9];
        ["告白气球 - 周杰伦","词：方文山","曲：周杰伦","塞纳河畔 左岸的咖啡","我手一杯 品尝你的美","留下唇印的嘴","花店玫瑰 名字写错谁","告白气球 风吹到对街"]
        */
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);

/* (function (window) {
    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor: Lyric,
        init: function (path) {
            this.path = path;
        },
        times: [],
        lyrics: [],
        index: -1,
        loadLyric: function (callBack) {
            var $this = this;
            $.ajax({
                url: $this.path,
                dataType: "text",
                success: function (data) {
                    // console.log(data);
                    $this.parseLyric(data);
                    callBack();
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        parseLyric: function (data) {
            var $this = this;
            // 一定要清空上一首歌曲的歌词和时间
            $this.times = [];
            $this.lyrics = [];
            var array = data.split("\n");
            // console.log(array);
            // [00:00.92]
            var timeReg = /\[(\d*:\d*\.\d*)\]/
            // 遍历取出每一条歌词
            $.each(array, function (index, ele) {
                // 处理歌词
                var lrc = ele.split("]")[1];
                // 排除空字符串(没有歌词的)
                if(lrc.length == 1) return true;
                $this.lyrics.push(lrc);

                // 处理时间
                var res = timeReg.exec(ele);
                // console.log(res);
                if(res == null) return true;
                var timeStr = res[1]; // 00:00.92
                var res2 = timeStr.split(":");
                var min = parseInt(res2[0]) * 60;
                var sec = parseFloat(res2[1]);
                var time = parseFloat(Number(min + sec).toFixed(2)) ;
                $this.times.push(time);
            });
            // console.log($this.times + "");
            // console.log($this.lyrics + "");
        },
        currentIndex: function (currentTime) {
            // console.log(currentTime);
            // 0.93 >= 0.92
            // 4.8 >= 4.75
            if(currentTime >= this.times[0]){
                this.index++; // 0  1
                this.times.shift(); // 删除数组最前面的一个元素
            }
            return this.index; // 1
        }
        /*
        [6.4,23.59,26.16,29.33,34.27,36.9];
        ["告白气球 - 周杰伦","词：方文山","曲：周杰伦","塞纳河畔 左岸的咖啡","我手一杯 品尝你的美","留下唇印的嘴","花店玫瑰 名字写错谁","告白气球 风吹到对街"]
        */
	   /*
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window); */