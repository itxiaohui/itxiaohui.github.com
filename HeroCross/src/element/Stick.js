
//注意：LayerColor 的锚点设置是无效的，不管怎么设置，它的锚点永远是cc.p(0,0)

var Stick = cc.LayerColor.extend({
	
	ctor:function(){
		this._super(cc.color(0, 0, 0),GameConstant.stickThick,GameConstant.stickStartHeigth);
		
//		this.anchorY = 0;
		return true;
	}
	
});