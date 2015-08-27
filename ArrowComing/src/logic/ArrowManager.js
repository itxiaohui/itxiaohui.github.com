
var ArrowManager = cc.Class.extend({
	
	// 存储屏幕上箭的数组
	arrowArray:null,
	// 游戏主场景
	gameScene:null,
	// 箭的batchNode
	arrowBatchNode:null,
	
	// 箭创建计数器和阈值
	arrowCount:0,
	arrowCreateTh:0,
	
	// 特殊箭组的标志
	horizontalArrow:false,
	circlArrow:false,
	verticalArrow:false,
	circlArrow2:false,
	mixHorizontalCircleArrow:false,
	
	// 箭创建位置的半径值
	arrowCreateRadius:0,
	
	ctor:function(gameScene){
		this.gameScene = gameScene;
		this.arrowArray = new Array();
		this.arrowBatchNode = gameScene._arrowBitchNode;
		this.arrowCreateRadius = GameConstants.CircleRadius + GameConstants.ARROW_CREATE_ADD_RADIUS;
	},
	
	init:function(){
		this.arrowCreateTh = GameConstants.ARROW_CREATE_SPEED_1;
		this.horizontalArrow = false;
		this.circlArrow = false;
		this.verticalArrow = false;
		this.circlArrow2 = false;
		this.mixHorizontalCircleArrow = false;
	},
	
	update:function(hero,dt,timeCount){
		// 不断创建箭对象
		this.createArrow(hero, dt,timeCount);
		
		// 不断更新箭位置、检测碰撞以及缓存箭
		this.animateArrow(hero, dt);
	},
	
	createArrow:function(hero,dt,timeCount){
		var winSize = cc.director.getWinSize();
		
		// 根据时间控制普通单支箭的创建速率
		if(timeCount < 10){
			this.arrowCreateTh = GameConstants.ARROW_CREATE_SPEED_1;
		}else if(timeCount < 20){
			this.arrowCreateTh = GameConstants.ARROW_CREATE_SPEED_2;
		}else if(timeCount < 30){
			this.arrowCreateTh = GameConstants.ARROW_CREATE_SPEED_3;
		}else if(timeCount < 40){
			this.arrowCreateTh = GameConstants.ARROW_CREATE_SPEED_4;
		}else if(timeCount < 50){
			this.arrowCreateTh = GameConstants.ARROW_CREATE_SPEED_5;
		}
		
		if(this.arrowCount < this.arrowCreateTh){
			this.arrowCount++;
		}else{
			this.arrowCount = 0;
			var arrow = Arrow.create(hero);
			arrow.type = 0;
			this.arrowBatchNode.addChild(arrow);
			this.arrowArray.push(arrow);
		}
		
		// 创建一些特殊图案的箭
		if(timeCount > 15 && !this.horizontalArrow){
			this.horizontalArrowCreate(hero);
			this.horizontalArrow = true;
		}
		if(timeCount > 25 && !this.circlArrow){
			this.circlArrowCreate(hero,2);
			this.circlArrow = true;
		}
		if(timeCount > 35 && !this.verticalArrow){
			this.verticalArrowCreate(hero);
			this.verticalArrow = true;
		}
		if(timeCount > 45 && !this.circlArrow2){
			this.circlArrowCreate(hero,2.5);
			this.circlArrow2 = true;
		}
		if(timeCount > 55 && !this.mixHorizontalCircleArrow){
			this.circlArrowCreate(hero,2);
			this.horizontalArrowCreate(hero);
			this.mixHorizontalCircleArrow = true;
		}
		
	},
	
	horizontalArrowCreate:function(hero){
		var x = 0;
		var y = 0;
		for(x=GameConstants.CircleX - this.arrowCreateRadius;x<=GameConstants.CircleX + this.arrowCreateRadius;x=x+2*hero.getWidth()){
			y = 0;
			var arrow = Arrow.create(hero);
			this.arrowBatchNode.addChild(arrow);
			this.arrowArray.push(arrow);
			arrow.hasTrack = false;
			arrow.x = x;
			arrow.y = y;
			arrow.type = 0;
			arrow.speed = 2;
			arrow.setRotation(-90);
			arrow.targetX = arrow.x;
			arrow.targetY = this.arrowCreateRadius;
			arrow.createX = x;
			arrow.createY = y;
			arrow.createFlag = 0;
		}
	},
	
	verticalArrowCreate:function(hero){
		var x = 0;
		var y = 0;
		for(y=GameConstants.CircleY - this.arrowCreateRadius;y<=GameConstants.CircleY + this.arrowCreateRadius;y=y+2*hero.getWidth()){
			x = GameConstants.CircleX - this.arrowCreateRadius;
			var arrow = Arrow.create(hero);
			this.arrowBatchNode.addChild(arrow);
			this.arrowArray.push(arrow);
			arrow.hasTrack = false;
			arrow.x = x;
			arrow.y = y;
			arrow.type = 0;
			arrow.speed = 3;
			arrow.setRotation(0);
			arrow.targetX = GameConstants.CircleX;
			arrow.targetY = arrow.y;
			arrow.createX = x;
			arrow.createY = y;
			arrow.lineK = 0;
			if(y > GameConstants.CircleY){
				arrow.createFlag = 2;
			}else{
				arrow.createFlag = 3;
			}
		}
	},
	
	circlArrowCreate:function(hero,speed){
		// 创建上半圆的箭
		for(x=GameConstants.CircleX - this.arrowCreateRadius;x<=GameConstants.CircleX + this.arrowCreateRadius;x=x+110){
			y = GameConstants.CircleY + Math.sqrt(Math.pow(this.arrowCreateRadius, 2) - Math.pow(x-GameConstants.CircleX, 2));
			var arrow = Arrow.create(hero);
			this.arrowBatchNode.addChild(arrow);
			this.arrowArray.push(arrow);
			arrow.hasTrack = false;
			arrow.x = x;
			arrow.y = y;
			arrow.type = 1;
			arrow.speed = speed;
			arrow.targetX = GameConstants.CircleX;
			arrow.targetY = GameConstants.CircleY;
			arrow.createX = x;
			arrow.createY = y;
			if(x < GameConstants.CircleX){
				arrow.createFlag = 2;
			}else if(x > GameConstants.CircleX){
				arrow.createFlag = 1;
			}else{
				arrow.createFlag = 0;
			}
			if(arrow.createFlag != 0){
				// 调整箭头指向圆心
				this.handleArrowToCenter(arrow);
				arrow.lineK = (arrow.createY - arrow.targetY) / (arrow.createX - arrow.targetX);
			}
			
		}
		
		// 创建下半圆的箭
		for(x=GameConstants.CircleX + this.arrowCreateRadius;x>=GameConstants.CircleX - this.arrowCreateRadius;x=x-110){
			y = GameConstants.CircleY - Math.sqrt(Math.pow(this.arrowCreateRadius, 2) - Math.pow(x-GameConstants.CircleX, 2));
			var arrow = Arrow.create(hero);
			this.arrowBatchNode.addChild(arrow);
			this.arrowArray.push(arrow);
			arrow.hasTrack = false;
			arrow.x = x;
			arrow.y = y;
			arrow.type = 1;
			arrow.speed = speed;
			arrow.targetX = GameConstants.CircleX;
			arrow.targetY = GameConstants.CircleY;
			arrow.createX = x;
			arrow.createY = y;
			if(x < GameConstants.CircleX){
				arrow.createFlag = 3;
			}else if(x > GameConstants.CircleX){
				arrow.createFlag = 4;
			}else{
				arrow.createFlag = 0;
			}
			if(arrow.createFlag != 0){
				// 调整箭头指向圆心
				this.handleArrowToCenter(arrow);
				arrow.lineK = (arrow.createY - arrow.targetY) / (arrow.createX - arrow.targetX);
			}
		}
	},
	
	// 调整箭头的方向，使得指向圆心
	handleArrowToCenter:function(arrow){
		var x = arrow.x;
		var y = arrow.y;
		var dx = Math.abs(arrow.x - GameConstants.CircleX);
		var dy = Math.abs(arrow.y - GameConstants.CircleY);
		var angle = 0;
		if(y >= GameConstants.CircleY){
			if(x < GameConstants.CircleX){
				angle = Math.atan(dy/dx) * GameConstants.HUDU_TO_JIAODU;
			}else{
				angle = 180 - Math.atan(dy/dx) * GameConstants.HUDU_TO_JIAODU;
			}
		}else{
			if(x < GameConstants.CircleX){
				angle = -Math.atan(dy/dx) * GameConstants.HUDU_TO_JIAODU;
			}else{
				angle = -(180 - Math.atan(dy/dx) * GameConstants.HUDU_TO_JIAODU);
			}
		}
		arrow.setRotation(angle);
	},
	
	animateArrow:function(hero,dt){
		for(var i=this.arrowArray.length-1;i>=0;i--){
			var arrow = this.arrowArray[i];
			// 如果超出大圆外，直接返回，并把箭对象放入缓存池
			if(Math.sqrt(Math.pow(arrow.x-GameConstants.CircleX, 2)+Math.pow(arrow.y-GameConstants.CircleY, 2)) > GameConstants.CircleRadius + GameConstants.ARROW_CREATE_ADD_RADIUS+100){
				this.arrowArray.splice(i,1);
				this.arrowBatchNode.removeChild(arrow);
				cc.pool.putInPool(arrow);
				return;
			}
			
			// 让箭头指向英雄
			this.arrowToHero(hero,arrow);
			
			// 不断靠近目标值
			this.closeToTarget(hero,arrow);
			
			// 碰撞检测
			if(Math.sqrt(Math.pow(hero.x-arrow.x, 2) + Math.pow(hero.y-arrow.y, 2)) < hero.getWidth()*0.5){
				this.gameScene.showGameOver();
				break;
//				cc.log("game over");
			}
			
		}
	},
	
	// 如果箭值可跟踪的，则不断调整方向，使得指向英雄
	arrowToHero:function(hero,arrow){
		if(!arrow.hasTrack){
			return;
		}
		
		if(arrow.isTrackInvalid()){
			arrow.hasTrack = false;
			return;
		}
		
		if(arrow.trackCount < arrow.trackTh){
			arrow.trackCount++;
			return;
		}
		arrow.trackCount = 0;
		var x = arrow.x;
		var y = arrow.y;
		var dx = Math.abs(hero.x - x);
		var dy = Math.abs(hero.y - y);
		var angle = 0;
		if(y >= hero.y){
			if(x < hero.x){
				angle = Math.atan(dy/dx) * GameConstants.HUDU_TO_JIAODU;
				arrow.createFlag = 2;
			}else{
				angle = 180 - Math.atan(dy/dx) * GameConstants.HUDU_TO_JIAODU;
				arrow.createFlag = 1;
			}
		}else{
			if(x < hero.x){
				angle = -Math.atan(dy/dx) * GameConstants.HUDU_TO_JIAODU;
				arrow.createFlag = 3;
			}else{
				angle = -(180 - Math.atan(dy/dx) * GameConstants.HUDU_TO_JIAODU);
				arrow.createFlag = 4;
			}
		}
		arrow.setRotation(angle);
		arrow.targetX = hero.x;
		arrow.targetY = hero.y;
		arrow.lineK = (arrow.targetY - arrow.y)/(arrow.targetX - arrow.x);
	},
	
	closeToTarget:function(hero,arrow){
		
		if(arrow.createFlag == 0){
			if(arrow.createY > GameConstants.CircleY){
				arrow.y -= arrow.speed;
			}else{
				arrow.y += arrow.speed;
			}
		}else{
			var dx = 0;
			var tempX = 0;
			var resultY = 0;
			if(arrow.createFlag == 2 || arrow.createFlag == 3){
				
				dx = arrow.speed;
				tempX = arrow.x + dx;
				resultY = arrow.lineK * (tempX - arrow.targetX) + arrow.targetY;
				
				// 限制箭的移动速度端值
				if(Math.sqrt(Math.pow(dx, 2) + Math.pow(resultY - arrow.y, 2)) > GameConstants.ARROW_MAX_SPEED){
					var angle = Math.atan(Math.abs(arrow.lineK));
					dx = GameConstants.ARROW_MAX_SPEED * Math.cos(angle);
				}else if(Math.sqrt(Math.pow(dx, 2) + Math.pow(resultY - arrow.y, 2)) < GameConstants.ARROW_MIN_SPEED){
					var angle = Math.atan(Math.abs(arrow.lineK));
					dx = GameConstants.ARROW_MIN_SPEED * Math.cos(angle);
				}
				
				// 圆心箭，按方向上的长度移动
				if(arrow.type == 1){
					var angle = Math.atan(Math.abs(arrow.lineK));
					dx = arrow.speed * Math.cos(angle);
				}
				
				tempX = arrow.x + dx;
				resultY = arrow.lineK * (tempX - arrow.targetX) + arrow.targetY;
				
				arrow.x = tempX;
				arrow.y = resultY;
			}else if(arrow.createFlag == 1 || arrow.createFlag == 4){
				dx = arrow.speed;
				tempX = arrow.x - dx;
				resultY = arrow.lineK * (tempX - arrow.targetX) + arrow.targetY;

				// 限制箭的移动速度端值
				if(Math.sqrt(Math.pow(dx, 2) + Math.pow(resultY - arrow.y, 2)) > GameConstants.ARROW_MAX_SPEED){
					var angle = Math.atan(Math.abs(arrow.lineK));
					dx = GameConstants.ARROW_MAX_SPEED * Math.cos(angle);
				}else if(Math.sqrt(Math.pow(dx, 2) + Math.pow(resultY - arrow.y, 2)) < GameConstants.ARROW_MIN_SPEED){
					var angle = Math.atan(Math.abs(arrow.lineK));
					dx = GameConstants.ARROW_MIN_SPEED * Math.cos(angle);
				}
				
				// 圆心箭，按方向上的长度移动
				if(arrow.type == 1){
					var angle = Math.atan(Math.abs(arrow.lineK));
					dx = arrow.speed * Math.cos(angle);
				}
				
				tempX = arrow.x - dx;
				resultY = arrow.lineK * (tempX - arrow.targetX) + arrow.targetY;
				
				arrow.x = tempX;
				arrow.y = resultY;
			}else{
				cc.log("bug coming");
			}
		}
		
	},
	
	// 移除屏幕上所有的箭，放入存储池中
	removeAll:function(){
		if(this.arrowArray.length > 0){
			for(var i=this.arrowArray.length-1;i>=0;i--){
				var arrow = this.arrowArray[i];
				this.arrowArray.splice(i,1);
				this.arrowBatchNode.removeChild(arrow);
				cc.pool.putInPool(arrow);
			}
		}
	}
});