
var GameScene = cc.Scene.extend({
	
	hero:null,
	
	boardManager:null,
	
	ctor:function(){
		this._super();
		
		var winSize = cc.director.getWinSize();
		
		// 添加背景图
		var bgSprite = new cc.Sprite("res/background2.png");
		bgSprite.attr({
			x:winSize.width*0.5,
			y:winSize.height*0.5
		});
		this.addChild(bgSprite);
		
		
		// 点击事件监听
		cc.eventManager.addListener({
			event:cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan:this.onTouchBegan.bind(this)
		}, this);
		
		this.boardManager = new BoardManager(this);
		
		var board = null;
		for(var i=0;i<10;i++){
			board = Board.create(100, 200+GameConstants.BOARD_GAP*i, cc.color(0, 0, 0), 3);
			this.addChild(board);
			this.boardManager.addBoard(board);
		}
		
		this.hero = new Hero();
		this.hero.attr({
			x:50,
			y:GameConstants.BOARD_HEIGHT-2.5
		});
		this.addChild(this.hero);
		this.hero.heroState = GameConstants.HERO_STAND;
		
		this.boardManager.init(this.hero);
		
		this.scheduleUpdate();
		
		return true;
	},
	
	update:function(dt){
		
		this.boardManager.update(this.hero, dt);
	},
	
	onTouchBegan:function(){
		if(this.hero.heroState == GameConstants.HERO_STAND){
			this.hero.heroState = GameConstants.HERO_JUMP_UP;
			this.hero.heroJumpValue = GameConstants.HERO_JUMP_VALUE;
		}
	}
});