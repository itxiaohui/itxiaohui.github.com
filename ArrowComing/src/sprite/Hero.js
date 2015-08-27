
var Hero = cc.Sprite.extend({
	
	ctor:function(){
		this._super("res/hero.png");
		
		this.attr({
			x:GameConstants.CircleX,
			y:GameConstants.CircleY,
			scale:0.5
		});
		
		return true;
	},
	
	// 设置scale后，通过这两个方法可以获取英雄的真实宽度和高度
	getWidth:function(){
		var heroRect = this.getBoundingBox();
		var heroWidth = cc.rectGetMaxX(heroRect) - cc.rectGetMinX(heroRect);
		
		return heroWidth;
	},
	getHeigth:function(){
		var heroRect = this.getBoundingBox();
		var heroHeigth = cc.rectGetMaxY(heroRect) - cc.rectGetMinY(heroRect);
		
		return heroHeigth;
	}
	
});