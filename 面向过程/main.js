var animateFlag = true;

function prepareFocusPic() {
	var container=document.getElementById("container");
	var list = document.getElementById("list");
	var prevBtn = document.getElementById("pre-btn");
	var nextBtn = document.getElementById("next-btn");
	var circleContainer = document.getElementById("circle-container");
	var circles = circleContainer.getElementsByTagName("span");
	var index = 1;
	list.style.left = "-600px";
	prevBtn.onclick = function() {
		if (animateFlag == true) {
			animateFlag = false;
			index--;
			index = index < 1 ? 5 : index;
			changeCircle(circles, index);
			var currentLeft = parseInt(list.style.left);
			var newLeft = currentLeft + 600;
			changePosition(list, currentLeft, newLeft);
		}
	};
	nextBtn.onclick = function() {
		if (animateFlag == true) {
			animateFlag = false;
			index++;
			index = index > 5 ? 1 : index;
			changeCircle(circles, index);
			var currentLeft = parseInt(list.style.left);
			var newLeft = currentLeft - 600;
			changePosition(list, currentLeft, newLeft);
		}
	};
	for (let i = 0; i < circles.length; i++) {
		circles[i].onclick = function() {
			var tag = circles[i].getAttribute("tag");
			if (tag == index)
				return;
			else {
				changeCircle(circles, tag);
				var currentLeft = parseInt(list.style.left);
				var newLeft = currentLeft - (tag - index) * 600;
				changePosition(list, currentLeft, newLeft);
				index = tag;
			}
		}
	}
	container.timeout = setInterval(function() {
		nextBtn.onclick();
	}, 2000);
	container.onmouseenter = function() {
		if (container.timeout)
			clearInterval(container.timeout);
	}
	container.onmouseleave = function() {
		container.timeout = setInterval(function() {
			nextBtn.onclick();
		}, 2000);
	}
}

function changePosition(elem, currentLeft, newLeft) {
	if (currentLeft === newLeft) {
		if (currentLeft >= 0) {
			elem.style.left = "-3000px";
		} else if (currentLeft <= -3600) {
			elem.style.left = "-600px";
		}
		animateFlag = true;
		return;
	} else if (currentLeft > newLeft) {
		currentLeft -= Math.ceil((currentLeft - newLeft) / 10);
	} else if (currentLeft < newLeft) {
		currentLeft += Math.ceil((newLeft - currentLeft) / 10);
	}
	elem.style.left = currentLeft + "px";
	setTimeout(function() {
		changePosition(elem, currentLeft, newLeft);
	}, 10);
}

function changeCircle(circles, index) {
	for (let i = 0; i < circles.length; i++) {
		if (circles[i].className == "active") {
			circles[i].className = "";
			break;
		}
	}
	circles[index - 1].className = "active";
}

window.onload = prepareFocusPic;