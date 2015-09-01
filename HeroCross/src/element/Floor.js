

//注意：LayerColor 的锚点设置是无效的，不管怎么设置，它的锚点永远是cc.p(0,0)

var Floor = cc.LayerColor.extend({
	
	ctor:function(x,width){
		
		this._super(cc.color(0, 0, 0, 255),width,GameConstant.floorHeigth);
//		this.anchorX = 0;
//		this.anchorY = 0;
		this.y = 0;
		
		this.initData(x, width);
		
		return true;
	},
	
	initData:function(x,width){
		
		this.width = width;
		this.x = x;
		
	},
	
	reuse:function(x,width){
		this.initData(x,width);
	},
	
	unuse:function(){
		
	}
});

Floor.create = function(x,width){
	
	if(cc.pool.hasObject(Floor)){
		return cc.pool.getFromPool(Floor,x,width);
	}
	return new Floor(x,width);
}
