
var Hero = cc.Sprite.extend({
	
	walkAction:null,
	
	heroState:null,
	
	ctor:function(){
		this._super("res/hero.png",cc.rect(32*1, 32*3, 32, 32),0);
		
		var animation = new cc.Animation();
		animation.addSpriteFrame(new cc.SpriteFrame("res/hero.png",cc.rect(32*0, 32*3, 32, 32)));
		animation.addSpriteFrame(new cc.SpriteFrame("res/hero.png",cc.rect(32*1, 32*3, 32, 32)));
		animation.addSpriteFrame(new cc.SpriteFrame("res/hero.png",cc.rect(32*2, 32*3, 32, 32)));
		animation.addSpriteFrame(new cc.SpriteFrame("res/hero.png",cc.rect(32*3, 32*3, 32, 32)));
		animation.setDelayPerUnit(1/5);
		
		var animate = new cc.Animate(animation);
		
		this.walkAction = animate.repeatForever();
		
		this.anchorY = 0;
		this.y = GameConstant.floorHeigth;
		this.setScale(2);
		
		this.heroState = GameConstant.heroStand;
		
		return true;
	},
	
	walk:function(){
		
		if(this.heroState == GameConstant.heroWalk){
			return;
		}
		
		this.runAction(this.walkAction);
		this.heroState = GameConstant.heroWalk;
		
	},
	
	stand:function(){
		
		if(this.heroState == GameConstant.heroStand){
			return;
		}
		
		this.stopAllActions();
		this.setSpriteFrame(new cc.SpriteFrame("res/hero.png",cc.rect(32*1, 32*3, 32, 32)));
		this.heroState = GameConstant.heroStand;
		
	},
	
	move:function(){
		
		if(this.heroState == GameConstant.heroMove){
			return;
		}

		this.setSpriteFrame(new cc.SpriteFrame("res/hero.png",cc.rect(32*1, 32*3, 32, 32)));
		this.heroState = GameConstant.heroMove;
	}
	
});