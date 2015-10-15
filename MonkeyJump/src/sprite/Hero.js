
var Hero = cc.Sprite.extend({
	
	standBoardIndex:0,

	heroState:0,
	heroJumpValue:20,
	
	ctor:function(){
		this._super("res/hero.png",cc.rect(0, 0, 282/3, 105));
		
		var animation = new cc.Animation();
		animation.addSpriteFrame(new cc.SpriteFrame("res/hero.png",cc.rect(0, 0, 282/3, 105)));
		animation.addSpriteFrame(new cc.SpriteFrame("res/hero.png",cc.rect(282/3, 0, 282/3, 105)));
		animation.addSpriteFrame(new cc.SpriteFrame("res/hero.png",cc.rect(2*282/3, 0, 282/3, 105)));
		animation.setDelayPerUnit(1/5);
		
		var action = new cc.Animate(animation).repeatForever();
		
		this.runAction(action);
		
		this.setAnchorPoint(cc.p(0.5, 0));
		
		return true;
	}
	
});