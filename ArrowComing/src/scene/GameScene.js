
var GameScene = cc.Scene.extend({
	
	_hero:null,
	_circleUI:null,
	
	_heroRadius:0,
	_heroStep:0,
	_heroDirection:0,
	
	// 利用数组来保存按键状态，让执行逻辑在update函数中操作
	_isKeyAllReleased:true,
	_hasKeyPressed:false,
	_keyStatusArray:null,
	
	// 记录时间
	_time:null,
	_timeCount:0,
	
	// 箭的batchNode和管理器
	_arrowBitchNode:null,
	_arrowManager:null,
	
	// 游戏结束层UI
	_gameOverUI:null,
	
	ctor:function(){
		this._super();
		
		// 初始化UI和英雄
		this.initUI();
		
		// 添加按键监听器
		this.addListener();
		
		// 初始化数据，并且开启update函数
		this.initDatas();
		
		return true;
	},

	update:function(dt){
		var winSzie = cc.director.getWinSize();

		// 更新计时器
		this._timeCount += dt;
		this._time.setString(""+this._timeCount.toFixed(1));
		
		// 更新英雄位置
		if(this.hasKeyPressed()){
			this._heroStep += 0.1;

			// 控制英雄最大步进值
			if(this._heroStep > GameConstants.HERO_STEP_MAX){
				this._heroStep = GameConstants.HERO_STEP_MAX;
			}

			// left:37 up:38 right:39 down:40
			switch (this._heroDirection) {
			// 左边
			case 37:
				this._hero.x -= this._heroStep;
				break;
				// 上边
			case 38:
				this._hero.y += this._heroStep;
				break;
				// 右边
			case 39:
				this._hero.x += this._heroStep;
				break;
				// 下边
			case 40:
				this._hero.y -= this._heroStep;
				break;
			default:
				break;
			}

			// 控制英雄位置始终在圆内
			this.handleHeroPosition(this._heroDirection);
		}else{
			this._heroStep = GameConstants.HERO_STEP_START;
		}
		
		// 执行箭的管理器update函数
		this._arrowManager.update(this._hero, dt,this._timeCount);
	},
	
	initUI:function(){
		var winSize = cc.director.getWinSize();
		
		// 设置游戏背景图片
		var bg = new cc.Sprite("res/GameSceneBG.jpg");
		bg.attr({
			x:winSize.width*0.5,
			y:winSize.height*0.5
		});
		this.addChild(bg);
		
		// 添加遮罩层，并且底色设置为白色
		var circleUI = new CircleUI();
		this.addChild(circleUI,1);
		this._circleUI = circleUI;
		var layer = new cc.LayerColor(cc.color(255, 255, 255, 255),winSize.width,winSize.height);
		this._circleUI.addChild(layer);
		
		// 添加数字计时器
		var time = new cc.LabelTTF("00.0","Arial",150);
		time.setColor(cc.color(0,0,0));
		time.attr({
			x:GameConstants.CircleX,
			y:GameConstants.CircleY,
			opacity:100
		});
		this._circleUI.addChild(time);
		this._time = time;
		
		// 添加箭的batchNode
		this._arrowBitchNode = new cc.SpriteBatchNode("res/arrow.png");
		this._circleUI.addChild(this._arrowBitchNode);

		// 添加英雄
		this._hero = new Hero();
		this.addChild(this._hero,2);
		
		// 添加结束层
		this._gameOverUI = new GameOverUI(this);
		this.addChild(this._gameOverUI,3);
	},
	
	addListener:function(){
		// 添加按键监听器
		cc.eventManager.addListener({
			event:cc.EventListener.KEYBOARD,

			onKeyPressed:this.onKeyPressed.bind(this),
			onKeyReleased:this.onKeyReleased.bind(this)

		}, this);
	},
	
	initDatas:function(){
		var winSize = cc.director.getWinSize();
		
		this._hero.attr({
			x:GameConstants.CircleX,
			y:GameConstants.CircleY
		});
		
		this._timeCount = 0;
		
		this._heroRadius = GameConstants.CircleRadius - Math.sqrt(Math.pow(this._hero.getWidth(), 2) + Math.pow(this._hero.getHeigth(),2)) * 0.3;
		this._keyStatusArray = [0,0,0,0];
		this._heroStep = GameConstants.HERO_STEP_START;

		this._arrowManager = new ArrowManager(this);
		this._arrowManager.init();
		
		if(this._gameOverUI){
			this._gameOverUI.setVisible(false);
		}
		
		this.scheduleUpdate();
	},
	
	showGameOver:function(){
		if(this._gameOverUI){
			this._gameOverUI.setVisible(true);
			this._gameOverUI.showInfo(this._timeCount);
		}
		
		this.unscheduleUpdate();
		this._arrowManager.removeAll();
	},
	
	retryStart:function(){
		this.initDatas();
	},
	
	onKeyPressed:function(code,event){
		
		this._heroDirection = code;
		
		// left:37 up:38 right:39 down:40
		switch (code) {
			// 左边
			case 37:
				if(this._keyStatusArray[0] == 0){
					this._keyStatusArray[0] = 1;
				}
				break;
			// 上边
			case 38:
				if(this._keyStatusArray[1] == 0){
					this._keyStatusArray[1] = 1;
				}
				break;
			// 右边
			case 39:
				if(this._keyStatusArray[2] == 0){
					this._keyStatusArray[2] = 1;
				}
				break;
			// 下边
			case 40:
				if(this._keyStatusArray[3] == 0){
					this._keyStatusArray[3] = 1;
				}
				break;
			default:
				break;
		}
	},
	
	onKeyReleased:function(code,event){
		// left:37 up:38 right:39 down:40    enter:13
		switch (code) {
			// 左边
			case 37:
				if(this._keyStatusArray[0] == 1){
					this._keyStatusArray[0] = 0;
				}
				break;
			// 上边
			case 38:
				if(this._keyStatusArray[1] == 1){
					this._keyStatusArray[1] = 0;
				}
				break;
			// 右边
			case 39:
				if(this._keyStatusArray[2] == 1){
					this._keyStatusArray[2] = 0;
				}
				break;
			// 下边
			case 40:
				if(this._keyStatusArray[3] == 1){
					this._keyStatusArray[3] = 0;
				}
				break;
			// Enter键   重新开始
			case 13:
				if(this._gameOverUI && this._gameOverUI.isVisible()){
					this.retryStart();
				}
				break;
			default:
				break;
		}
		
	},
	
	// 控制英雄位置始终在圆内
	handleHeroPosition:function(code){
		var x = 0;
		var y = 0;
		var radius = this._heroRadius;
		switch (code) {
			// 左边
			case 37:
				y = this._hero.y;
				x = GameConstants.CircleX - Math.sqrt(Math.pow(radius, 2) - Math.pow(GameConstants.CircleY - y,2));
				if(this._hero.x < x){
					this._hero.x = x;
				}
				break;
			// 上边
			case 38:
				x = this._hero.x;
				y = GameConstants.CircleY + Math.sqrt(Math.pow(radius, 2) - Math.pow(GameConstants.CircleX - x,2));
				if(this._hero.y > y){
					this._hero.y = y;
				}
				break;
			// 右边
			case 39:
				y = this._hero.y;
				x = GameConstants.CircleX + Math.sqrt(Math.pow(radius, 2) - Math.pow(GameConstants.CircleY - y,2));
				if(this._hero.x > x){
					this._hero.x = x;
				}
				break;
			// 下边
			case 40:
				x = this._hero.x;
				y = GameConstants.CircleY - Math.sqrt(Math.pow(radius, 2) - Math.pow(GameConstants.CircleX - x,2));
				if(this._hero.y < y){
					this._hero.y = y;
				}
				break;
			default:
				break;
		}
	},
	
	hasKeyPressed:function(){
		for(var i=0;i<this._keyStatusArray.length;i++){
			if(this._keyStatusArray[i] == 1){
				return true;
			}
		}
		return false;
	}
	
});