
var GameScene = cc.Scene.extend({
	
	hero:null,
	stick:null,
	
	isHeigthAdd:false,
	
	stickAction:null,
	
	heroState:null,
	
	// 英雄y坐标是否已经增加
	isHeroYAdd:false,
	
	// 英雄y坐标是否已经减少
	isHeroYDecrease:false,
	
	
	floorArray:null,
	
	gameOverUI:null,
	
	// 分数label
	scoreLabel:null,
	scoreCount:0,
	
	// 惊险加分
	addScoreLabel:null,
	addScoreLabelAction:null,
	
	ctor:function(){
		this._super();
		
		var winSize = cc.director.getWinSize();

		// 设置游戏背景图片
		var bg = new cc.Sprite("res/background2.png");
		bg.attr({
			x:winSize.width*0.5,
			y:winSize.height*0.5
		});
		this.addChild(bg);
		
		var city = new cc.Sprite("res/city.png");
		city.attr({
			x:winSize.width*0.5,
			y:winSize.height*0.5
		});
		this.addChild(city);
		this.city = city;
		this.cityMoveTemp = 0;
		this.schedule(this.cityMove, 1/60);
		
		
		// 添加英雄
		var hero = new Hero();
		hero.x = 100;
		this.addChild(hero);
		this.hero = hero;
		this.heroState = GameConstant.heroStand;

		// 地板
		this.floorArray = new Array();
		
		
		// 添加棍子
		var stick = new Stick();
		this.addChild(stick);
		this.stick = stick;
		
		// 为了旋转需要，设置旋转中心，但是对它的位置不会有影响
		this.stick.anchorX = 1;
		this.stick.anchorY = 0;
		this.stickAction = new cc.Sequence(new cc.RotateBy(0.5,90),new cc.CallFunc(this.stickActionCompleted.bind(this)));
		
		// 游戏结束界面
		this.gameOverUI = new GameOverUI(this);
		this.addChild(this.gameOverUI);
		
		// 游戏分数
		this.scoreLabel = new cc.LabelTTF("分数：0","",50);
		this.scoreLabel.setColor(cc.color(0, 0, 0));
		this.scoreLabel.x = winSize.width * 0.5;
		this.scoreLabel.y = winSize.height - 50;
		this.addChild(this.scoreLabel,2);
		
		this.addScoreLabel = new cc.LabelTTF("惊险加分!+10","",25);
		this.addScoreLabel.setColor(cc.color(0, 0, 0));
		this.addChild(this.addScoreLabel,2);
		// 从小到大==》向上移动，同时褪去
		this.addScoreLabelAction = new cc.Sequence(
				new cc.ScaleBy(0.5,1.5).easing(cc.easeInOut(2)),
			new cc.Spawn(
				new cc.MoveBy(1,cc.p(0,150)).easing(cc.easeInOut(2)),
				new cc.FadeTo(1,0)
			)
		);
		
		// 初始化数据
		this.initDatas();
		

		// 添加监听器
		cc.eventManager.addListener({
			event:cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan:this.onTouchBegan.bind(this),
			onTouchEnded:this.onTouchEnded.bind(this)
		}, this);
		
		return true;
	},
	
	initDatas:function(){
		var winSize = cc.director.getWinSize();
		
		this.removeAllFloors();
		
		// 英雄
		this.hero.x = 100;
		this.hero.y = GameConstant.floorHeigth;
		this.heroState = GameConstant.heroStand;
	
		// 地板
		var floor = Floor.create(0,150);
		this.addChild(floor);
		this.floorArray.push(floor);
		
		var crossWith = GameConstant.floorMinCross + Math.random() * (GameConstant.floorMaxCross - GameConstant.floorMinCross);
		var floorWidth = GameConstant.floorMinWidth + Math.random() * (GameConstant.floorMaxWidth - GameConstant.floorMinWidth);

		var floor2 = Floor.create(floor.x + floor.width + crossWith, floorWidth);
		if(floor2.x + 50 > winSize.width){
			floor2.x = winSize.width - floor.width;
		}
		this.addChild(floor2);
		this.floorArray.push(floor2);
		
		
		// 棍子
		this.stick.x = floor.x + floor.width - GameConstant.stickThick * 2;
		this.stick.y = GameConstant.floorHeigth;
		this.stick.setRotation(0);
		this.stick._setHeight(GameConstant.stickStartHeigth);
		this.stick.setVisible(true);
		
		this.heroState = GameConstant.heroStand;
		
		this.scoreCount = 0;
		this.scoreLabel.setString("得分："+this.scoreCount*10);
		
		this.gameOverUI.setVisible(false);
		
		this.scheduleUpdate();
	},
	
	update:function(){
		
		var hero = this.hero;
		var stick = this.stick;
		var heroSpeed = GameConstant.heroSpeed;
		
		if(this.isHeigthAdd && this.heroState == GameConstant.heroStand){
			var heigth = stick._getHeight() + GameConstant.stickAddHeigth;
			this.stick._setHeight(heigth);
		}
		
		switch (this.heroState) {
			case GameConstant.heroStand:
				hero.stand();
				
				break;
			case GameConstant.heroWalk:
				hero.walk();
				
				if(hero.x < stick.x){
					hero.x += heroSpeed;
				}else if(hero.x <= stick.x + stick._getHeight()){
					if(!this.isHeroYAdd){
						hero.y += GameConstant.stickThick;
						this.isHeroYAdd = true;
						this.isHeroYDecrease = false;
					}
					hero.x += heroSpeed;
				}else if(hero.x > stick.x + stick._getHeight()){
					
					// 判断游戏是否失败
					var floor = this.floorArray[this.floorArray.length-1];
					if(stick.x + stick._getHeight() + 10 < floor.x || stick.x + stick._getHeight() + 5 > floor.x + floor.width){
						this.gameOver();
					}else if(!this.isHeroYDecrease){
						hero.y -= GameConstant.stickThick;
						this.isHeroYDecrease = true;
						hero.x += heroSpeed;
						this.heroState = GameConstant.heroMove;
						hero.stopAllActions();
						this.moveScene();
					}
				}
				
				break;	
			case GameConstant.heroMove:
				hero.move();

				break;
			default:
				
				break;
		}
		
	},
	
	gameOver:function(){
		
		this.unscheduleUpdate();
		
		var stick = this.stick;
		var floor = this.floorArray[this.floorArray.length-1];
		var hero = this.hero;
		
		if(stick.x+stick._getHeight() < floor.x){
			stick.runAction(new cc.RotateBy(0.4,90));
		}else{
			hero.x += 10;
		}
		hero.runAction(new cc.MoveBy(0.5,cc.p(0,-(GameConstant.floorHeigth + 100))));
		this.gameOverUI.setVisible(true);
	},
	
	startGame:function(){
		this.initDatas();
		this.hero.y = GameConstant.floorHeigth;
		this.gameOverUI.setVisible(false);
	},
	
	moveScene:function(){
		
		var stick = this.stick;
		var floorArray = this.floorArray;
		var hero = this.hero;
		
		var floor = floorArray[floorArray.length-1];
		
		
		// 移动英雄和棍子
		var floorMoveDistance = floor.x;
		var heroMoveAction = new cc.Sequence(new cc.MoveBy(1,cc.p(-floorMoveDistance,0)),new cc.CallFunc(this.heroMoveActionCompleted.bind(this)));
		hero.runAction(heroMoveAction);
		
		stick.runAction(new cc.MoveBy(1,cc.p(-floorMoveDistance,0)));
		
		// 移动地板
		for(var i=floorArray.length-1;i>=0;i--){
			var floor = floorArray[i];
			if(floor.x + floor.width < -100){
				cc.pool.putInPool(floor);
				this.removeChild(floor);
				floorArray.splice(i,1);
			}else{
				var floorAction = new cc.Sequence(new cc.MoveBy(1,cc.p(-floorMoveDistance,0)),new cc.CallFunc(this.floorActionCompleted.bind(this),floor,i));
				floor.runAction(floorAction);
			}
		}
	},
	
	heroMoveActionCompleted:function(){
		var winSize = cc.director.getWinSize();
		
		var stick = this.stick;
		var floorArray = this.floorArray;

		// 初始化棍子的位置和状态
		var floor = floorArray[floorArray.length-1];
		stick.x = floor.x + floor.width - GameConstant.stickThick * 2;
		stick.y = GameConstant.floorHeigth;
		stick._setHeight(GameConstant.stickStartHeigth);
		stick.setRotation(0);
		
		// 调整距离
		var distance = floor.x+floor.width-50 - this.hero.x;
		var adjustAction = new cc.MoveBy(Math.abs(distance)/100,cc.p(distance,0));
		
		this.hero.walk();
		this.hero.y = GameConstant.floorHeigth;
		this.hero.runAction(new cc.Sequence(adjustAction,new cc.CallFunc(this.heroAdjustActionCompleted.bind(this))));
	
		// 添加下一地板
		var crossWith = GameConstant.floorMinCross + Math.random() * (GameConstant.floorMaxCross - GameConstant.floorMinCross);
		var floorWidth = GameConstant.floorMinWidth + Math.random() * (GameConstant.floorMaxWidth - GameConstant.floorMinWidth);

		var floor2 = Floor.create(floor.x + floor.width + crossWith, floorWidth);
		if(floor2.x + 50 > winSize.width){
			floor2.x = winSize.width - floor.width;
		}
		this.addChild(floor2);
		this.floorArray.push(floor2);
	},
	
	heroAdjustActionCompleted:function(){
		this.heroState = GameConstant.heroStand;
		this.hero.stand();
	},
	
	removeAllFloors:function(){
		var floorArray = this.floorArray;
		if(floorArray.length > 0){
			for(var i=floorArray.length - 1;i>=0;i--){
				var floor = floorArray[i];
				floorArray.splice(i,1);
				this.removeChild(floor);
				cc.pool.putInPool(floor);
			}
		}
	},
	
	floorActionCompleted:function(floor,i){
		
	},
	
	stickActionCompleted:function(){
		var winSize = cc.director.getWinSize();
		var stick = this.stick;
		var floor = this.floorArray[this.floorArray.length-1];
		if(stick.x + stick._getHeight() + 10 >= floor.x && stick.x + stick._getHeight() + 5 <= floor.x + floor.width){
			this.scoreCount++;
			this.scoreLabel.setString("得分："+this.scoreCount*10);
			if(stick.x + stick._getHeight() + 10 - floor.x < 15 || floor.x + floor.width -(stick.x + stick._getHeight() + 5) < 15){
				this.scoreCount++;
				this.scoreLabel.setString("得分："+this.scoreCount*10);
				
				this.addScoreLabel.setScale(1);
				this.addScoreLabel.setOpacity(255);
				this.addScoreLabel.x = winSize.width * 0.5;
				this.addScoreLabel.y = winSize.height * 0.5;
				this.addScoreLabel.runAction(this.addScoreLabelAction);
			}
		}
		this.heroState = GameConstant.heroWalk;
	},
	
	onTouchBegan:function(touch,event){
		if(this.heroState == GameConstant.heroStand && this.stick._getHeight() == GameConstant.stickStartHeigth){
			this.isHeigthAdd = true;
			this.isHeroYAdd = false;
			return true;
		}
		return false;
	},
	
	onTouchEnded:function(touch,event){
		this.isHeigthAdd = false;
		this.stick.runAction(this.stickAction);
	},
	
	cityMove:function(){
		var city = this.city;
		var winSize = cc.director.getWinSize();
		this.cityMoveTemp += 0.02;
		var y = winSize.height*0.5 + 50 * Math.sin(this.cityMoveTemp);
		city.y = y;
	}

});