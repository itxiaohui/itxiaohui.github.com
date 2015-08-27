
var Arrow = cc.Sprite.extend({
	
	arrowCreateRadius:0,
	hero:null,
	
	// 记录产生的象限
	createFlag:0,
	
	// 靠近英雄的速度
	speed:0,
	
	// 初始坐标
	createX:0,
	createY:0,
	
	// 目标坐标
	targetX:0,
	targetY:0,
	
	// 直线斜率
	lineK:0,
	
	// 是否拥有跟踪玩家的能力
	hasTrack:false,
	// 跟踪旋转计数和阈值
	trackCount:0,
	trackTh:5,
	// 记录跟踪能力下的产生的象限，因为在有跟踪能力情况下createFlag会改变，因此把createFlag保存到trackCreateFlag中
	trackCreateFlag:0,
	
	// 箭的类型    普通：0    圆心箭：1
	type:0,
	
	ctor:function(hero){
		this._super("res/arrow.png");
		this.setScale(0.3);
		this.hero = hero;
		this.arrowCreateRadius = GameConstants.CircleRadius + GameConstants.ARROW_CREATE_ADD_RADIUS;
		this.initPosition();
		return true;
	},
	// 设置scale后，通过这两个方法可以获取真实宽度和高度
	getWidth:function(){
		var rect = this.getBoundingBox();
		var width = cc.rectGetMaxX(rect) - cc.rectGetMinX(rect);

		return width;
	},
	getHeigth:function(){
		var rect = this.getBoundingBox();
		var heigth = cc.rectGetMaxY(rect) - cc.rectGetMinY(rect);

		return heigth;
	},
	
	initPosition:function(){
		var winSzie = cc.director.getWinSize();
		
		this.speed = 0.5 + Math.random();
		if(Math.random() > 0.5){
			this.hasTrack = true;
		}else{
			this.hasTrack = false;
		}
//		this.hasTrack = true;
		this.trackCount = 0;
		
		var x = GameConstants.CircleX - this.arrowCreateRadius + Math.random() * this.arrowCreateRadius * 2;
		var y = 0;
		if(Math.random() > 0.5){
			y = GameConstants.CircleY + Math.sqrt(Math.pow(this.arrowCreateRadius, 2) - Math.pow(x-GameConstants.CircleX, 2));
		}else{
			y = GameConstants.CircleY - Math.sqrt(Math.pow(this.arrowCreateRadius, 2) - Math.pow(x-GameConstants.CircleX, 2));
		}
		this.attr({
			x:x,
			y:y
		});
//		cc.log("x:%f,y:%f",x,y);
		// 特殊处理圆的上下端点
		if(x == GameConstants.CircleX){
			if(y > GameConstants.CircleY){
				this.setRotation(90);
			}else{
				this.setRotation(-90);
			}
			this.createFlag = 0;
		}
		
//		// 测试用的
//		x = GameConstants.CircleX - 100;
//		y = GameConstants.CircleY - 100;
//		this.attr({
//			x:x,
//			y:y
//		});
		
		var dx = Math.abs(this.hero.x - x);
		var dy = Math.abs(this.hero.y - y);
		var angle = 0;
		if(y >= this.hero.y){
			if(x < this.hero.x){
				angle = Math.atan(dy/dx) * GameConstants.HUDU_TO_JIAODU;
				this.createFlag = 2;
			}else{
				angle = 180 - Math.atan(dy/dx) * GameConstants.HUDU_TO_JIAODU;
				this.createFlag = 1;
			}
		}else{
			if(x < this.hero.x){
				angle = -Math.atan(dy/dx) * GameConstants.HUDU_TO_JIAODU;
				this.createFlag = 3;
			}else{
				angle = -(180 - Math.atan(dy/dx) * GameConstants.HUDU_TO_JIAODU);
				this.createFlag = 4;
			}
		}
		
		this.setRotation(angle);
		
		this.createX = x;
		this.createY = y;
		this.targetX = this.hero.x;
		this.targetY = this.hero.y;
		
		if(this.createFlag != 0){
			this.lineK = (this.createY - this.targetY) / (this.createX - this.targetX);
		}
		this.trackCreateFlag = this.createFlag;
	},
	
	// 从缓存池中获取该对象的时候自动调用
	reuse:function(){
		this.initPosition();
	},
	// 将该对象放入缓存池的时候调用
	unuse:function(){

	},
	// 跟踪能力是否失效
	isTrackInvalid:function(){
		if(!this.hasTrack){
			return true;
		}
		var x = this.x;
		var y = this.y;
		var currentFlag = 0;
		if(y >= this.hero.y){
			if(x < this.hero.x){
				currentFlag = 2;
			}else{
				currentFlag = 1;
			}
		}else{
			if(x < this.hero.x){
				currentFlag = 3;
			}else{
				currentFlag = 4;
			}
		}
		if(currentFlag != this.trackCreateFlag){
			return true;
		}
		
		if(Math.sqrt(Math.pow(x-this.hero.x,2)+Math.pow(y-this.hero.y, 2)) < 80){
			return true;
		}
		
		return false;
	}
});

Arrow.create = function(hero){
	if(cc.pool.hasObject(Arrow)){
		return cc.pool.getFromPool(Arrow);
	}else{
		return new Arrow(hero);
	}
}