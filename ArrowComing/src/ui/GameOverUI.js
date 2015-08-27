
var GameOverUI = cc.Layer.extend({
	
	contentLabel:null,
	gameScene:null,
	
	ctor:function(gameScene){
		this._super();
		
		this.gameScene = gameScene;
		var winSize = cc.director.getWinSize();
		var bg = new cc.LayerColor(cc.color(0,0,0,200), winSize.width, winSize.height);
		this.addChild(bg);
		
		var contentLabel = new cc.MenuItemFont("S",null,null);
		contentLabel.attr({
			x:winSize.width*0.5,
			y:winSize.height*0.5
		});
		contentLabel.setColor(cc.color(255, 255, 255));
		this.contentLabel = contentLabel;
		
		var retryStartLabel = new cc.MenuItemFont("重新开始",this.retryStart,this);
		retryStartLabel.attr({
			x:winSize.width*0.5,
			y:contentLabel.y-contentLabel.height-50
		});
		retryStartLabel.setColor(cc.color(255, 255, 255));
		
		var menu = new cc.Menu(contentLabel,retryStartLabel);
		menu.attr({
			x:0,
			y:0
		});
		this.addChild(menu);
		
		return true;
	},
	
	showInfo:function(timeCount){
		this.contentLabel.setString("你一共坚持了"+timeCount.toFixed(1)+"秒。");
	},
	
	retryStart:function(){
		this.gameScene.retryStart();
	}
});