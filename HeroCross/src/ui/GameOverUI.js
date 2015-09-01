
var GameOverUI = cc.Layer.extend({
	
	ctor:function(gameScene){
		this._super();
		
		this.gameScene = gameScene;
		var winSize = cc.director.getWinSize();
		
		var bg = new cc.LayerColor(cc.color(0, 0, 0, 200),winSize.width,winSize.heigth);
		this.addChild(bg);
		
		var startBtn = new cc.MenuItemImage("res/start_normal.png","res/start_select.png","res/start_normal.png",this.startGame,this);
		
		var menu = new cc.Menu(startBtn);
		
		menu.alignItemsVerticallyWithPadding(20);
		
		this.addChild(menu);
		
		return true;
	},
	
	startGame:function(){
		this.gameScene.startGame();
	}
});