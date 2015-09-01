
var FloorManager = cc.Class.extend({

	gameScene:null,
	floorArray:null,
	
	ctor:function(gameScene){
		
		this.gameScene = gameScene;
		this.floorArray = new Array();
		
	}
	
});