(function() {
	function focusPic(container) {
		this.container = container;
		this.list = this.container.children(".list");
		this.prevBtn = this.container.children(".prev-btn");
		this.nextBtn = this.container.children(".next-btn");
		this.circleContainer = this.container.children(".circle-container");
		this.circles = null;
		this.picNums = this.list.children("li").length;
		this.animateFlag = true;
		this.index = 1;
		this.timeout = null;
		this.setting = {
			width: 600,
			height: 400,
			autoplay: false,
			delay: 2000
		};
		$.extend(this.setting, this.getDataSetting());
		this.initStyle();
		this.initEvent();
		if (this.setting.autoplay == true)
			this.autoplay();
	}
	focusPic.prototype = {
		getDataSetting: function() {
			var setting = this.container.attr("data-setting");
			if (setting && setting != "")
				return $.parseJSON(setting);
			else
				return null;
		},

		initStyle: function() {
			this.container.css({
				"width": this.setting.width,
				"height": this.setting.height,
			});
			this.list.css({
				"width": this.picNums * this.setting.width,
				"left": -this.setting.width,
			});
			this.prevBtn.css({
				"top": (this.setting.height - 45) / 2,
			});
			this.nextBtn.css({
				"top": (this.setting.height - 45) / 2,
			});
			this.circleContainer.css({
				"width": 24 * (this.picNums - 2),
				"left": (this.setting.width - 24 * (this.picNums - 2)) / 2
			});
			for (let i = 0; i < this.picNums - 2; i++) {
				var span = $("<span></span>");
				if (i == 0)
					span.addClass("active");
				span.attr("tag", i + 1);
				this.circleContainer.append(span);
			}
			this.circles = this.circleContainer.children("span");
		},

		initEvent: function() {
			var self = this;
			this.prevBtn.click(function() {
				if (self.animateFlag == true) {
					self.animateFlag = false;
					self.index--;
					self.index = self.index < 1 ? self.picNums - 2 : self.index;
					var newLeft = parseInt(self.list.css("left")) + self.setting.width;
					self.changePosition(newLeft);
					self.changeCircle();
				}
			});
			this.nextBtn.click(function() {
				if (self.animateFlag == true) {
					self.animateFlag = false;
					self.index++;
					self.index = self.index > self.picNums - 2 ? 1 : self.index;
					var newLeft = parseInt(self.list.css("left")) - self.setting.width;
					self.changePosition(newLeft);
					self.changeCircle();
				}
			});
			this.circles.each(function(i, elem) {
				$(elem).click(function() {
					var tag = $(elem).attr("tag");
					if (tag == self.index)
						return;
					else {
						var newLeft = parseInt(self.list.css("left")) - (tag - self.index) * self.setting.width;
						self.changePosition(newLeft);
						self.index = tag;
						self.changeCircle();
					}
				});
			})
		},

		changePosition: function(newLeft) {
			var self = this;
			this.list.animate({
				"left": newLeft,
			}, 500, function() {
				var currentLeft = parseInt($(this).css("left"));
				if (currentLeft >= 0) {
					$(this).css("left", -(self.picNums - 2) * self.setting.width);
				} else if (currentLeft <= -(self.picNums - 1) * self.setting.width) {
					$(this).css("left", -self.setting.width);
				}
				self.animateFlag = true;
			})
		},

		changeCircle: function() {
			var self = this;
			this.circles.each(function(i, elem) {
				if ($(elem).hasClass("active") && (i + 1) != self.index)
					$(elem).removeClass("active");
				if ((i + 1) == self.index)
					$(elem).addClass("active");
			});
		},

		autoplay: function() {
			var self = this;
			this.timeout = setInterval(function() {
				self.nextBtn.click();
			}, this.setting.delay);
			this.container.mouseenter(function() {
				if (self.timeout)
					clearInterval(self.timeout);
			});
			this.container.mouseleave(function() {
				self.timeout = setInterval(function() {
					self.nextBtn.click();
				}, self.setting.delay);
			})
		}

	};
	focusPic.init = function(containers) {
		containers.each(function(i, elem) {
			new focusPic($(elem));
		});
	}
	window["focusPic"] = focusPic;
})()