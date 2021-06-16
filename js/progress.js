/* 
	1.方便进度条复用
	2.方便维护
 */

(function(window) {
	function Progress($progressBar, $progressLine, $progressDot) {
		return new Progress.prototype.init($progressBar, $progressLine, $progressDot);
	}
	Progress.prototype = {
		constructor: Progress,
		init: function($progressBar, $progressLine, $progressDot) {
			this.$progressBar = $progressBar;
			this.$progressLine = $progressLine;
			this.$progressDot = $progressDot;
		},
		isMove: false, //防止拖拽改变进度条时与同步播放进度条冲突
		progressClick: function(callBack) {
			var $this = this; //此时此刻的this是progress
			//思路：点击后拉动进度条的长度（进度条开始离页面窗口左侧的距离，点击后离左侧的距离，用左侧距离减开始距离）
			//监听背景的点击
			this.$progressBar.click(function(event) { //传入获取横坐标的参数
				//获取背景距离窗口默认的位置
				var normalLeft = $(this).offset().left; //而这里的this则是进度条的属性事件的this
				//获取点击的位置距离窗口的位置
				var eventLeft = event.pageX; //点击位置距离窗口参数
				//设置前景的长度
				$this.$progressLine.css("width", eventLeft - normalLeft);
				//设置小圆点跟着前景的长度而同步变化
				$this.$progressDot.css("left", eventLeft - normalLeft);
				//计算进度条的比例
				var value = (eventLeft - normalLeft) / $(this).width();  //前景宽度/背景宽度
				callBack(value);
			});
		},
		progressMove: function(callBack) {
			var $this = this; //此时此刻的this是progress
			//获取背景距离窗口默认的位置
			//提升变量作用域（这里是为了鼠标抬起时间的调用）
			var normalLeft = this.$progressBar.offset().left; //背景距离窗口默认的位置距离；而这里的this则是进度条的属性事件的this
			var barWidth = this.$progressBar.width(); //获取进度条背景的长度（宽度）
			var eventLeft; //点击的位置距离窗口的位置距离
			//1.监听鼠标的按下事件
			this.$progressBar.mousedown(function(){
				$this.isMove = true;  //小圆点被拖拽时为true,停止进度条播放同步
				//2.监听鼠标的移动事件
				//2.1为了使拖拽时离开进度条也可监听就需使用document
				$(document).mousemove(function(){
					//获取点击的位置距离窗口的位置
					eventLeft = event.pageX; //点击位置距离窗口参数
					//设置前景的长度
					var offset = eventLeft - normalLeft;
					if(offset >=0 && offset <= barWidth){ //不超出进度条背景长度
						$this.$progressLine.css("width", offset);
						//设置小圆点跟着前景的长度而同步变化
						$this.$progressDot.css("left", offset);
						//计算声音进度条的比例
						var voiceValue = (offset) / $this.$progressBar.width();  //前景宽度/背景宽度
						callBack(voiceValue);
					}
				})
			})
			//3.监听鼠标的抬起事件
			$(document).mouseup(function(){
				$(document).off("mousemove");
				$this.isMove = false; //但拖拽完毕,重新开始进度条同步
				//计算播放进度条的比例
				//注意：移动播放进度条这里的计算进度条比例不能写入移动的函数内，不然会导致每一次的拖拽期间，不断回调请求，导致音乐断续播放
				var value = (eventLeft - normalLeft) / $this.$progressBar.width();  //前景宽度/背景宽度
				callBack(value);
			})
		},
		//同步进度条
		setProgress: function(value){
			if(this.isMove) return; //当拖拽时为true执行,使进度条改变但暂停同步播放进度,解决冲突
			if(value < 0 || value > 100) return;
			this.$progressLine.css({
				width: value+"%"
			});
			this.$progressDot.css({
				left: value+"%"
			});
		}
	}
	Progress.prototype.init.prototype = Progress.prototype;
	window.Progress = Progress;
})(window);

/* (function (window) {
    function Progress($progressBar,$progressLine,$progressDot) {
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    Progress.prototype = {
        constructor: Progress,
        init: function ($progressBar,$progressLine,$progressDot) {
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        isMove: false,
        progressClick: function (callBack) {
            var $this = this; // 此时此刻的this是progress
            // 监听背景的点击
            this.$progressBar.click(function (event) {
                // 获取背景距离窗口默认的位置
                var normalLeft = $(this).offset().left;
                // 获取点击的位置距离窗口的位置
                var eventLeft = event.pageX;
                // 设置前景的宽度
                $this.$progressLine.css("width", eventLeft - normalLeft);
                $this.$progressDot.css("left", eventLeft - normalLeft);
                // 计算进度条的比例
                var value = (eventLeft - normalLeft) / $(this).width();
                callBack(value);
            });
        },
        progressMove: function (callBack) {
            var $this = this;
            // 获取背景距离窗口默认的位置
            var normalLeft = this.$progressBar.offset().left;
            var barWidth = this.$progressBar.width();
            var eventLeft;
            // 1.监听鼠标的按下事件
            this.$progressBar.mousedown(function () {
                $this.isMove = true;
                // 2.监听鼠标的移动事件
                $(document).mousemove(function (event) {
                    // 获取点击的位置距离窗口的位置
                    eventLeft = event.pageX;
                    var offset = eventLeft - normalLeft;
                    if(offset >=0 && offset <= barWidth){
                        // 设置前景的宽度
                        $this.$progressLine.css("width", offset);
                        $this.$progressDot.css("left", offset);
                    }
                });
            });
            // 3.监听鼠标的抬起事件
            $(document).mouseup(function () {
                $(document).off("mousemove");
                $this.isMove = false;
                // 计算进度条的比例
                var value = (eventLeft - normalLeft) / barWidth;
                callBack(value);
            });
        },
        setProgress: function (value) {
            if(this.isMove) return;
            if(value < 0 || value > 100) return;
            this.$progressLine.css({
                width: value+"%"
            });
            this.$progressDot.css({
                left: value+"%"
            });
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window); */
