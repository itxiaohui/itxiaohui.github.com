
var Board = cc.LayerColor.extend({
	
	speed:0,
	
	// 0:表示向左移动    1:表示向右移动
	direction:0,
	
	ctor:function(width,y,color,speed){
		this._super();
		
		this.init(width, y, color, speed);
		
		return true;
	},
	
	init:function(width,y,color,speed){
		this.speed = speed;
		
		this.setContentSize(cc.size(width, GameConstants.BOARD_HEIGHT));
		this.setColor(color);
		
		this.setPositionY(y);
		var screenWidth = cc.director.getWinSize().width;
		this.setPositionX(Math.random()*(screenWidth-width));
		
		if(Math.random() > 0.5){
			this.direction = 0;
		}else{
			this.direction = 1;
		}
		
		this.scheduleUpdate();
	},
	
	update:function(dt){
		
		if(this.direction == 0){
			// 向左移动
			if(this.getPositionX() <= 0){
				this.direction = 1;
			}else{
				this.setPositionX(this.getPositionX()-this.speed);
			}
		}else if(this.direction == 1){
			// 向右移动
			if(this.getPositionX() >= cc.director.getWinSize().width-this.getContentSize().width){
				this.direction = 0;
			}else{
				this.setPositionX(this.getPositionX()+this.speed);
			}
		}
	},
	
	isAcceptHero:function(hero){
		var heroX = hero.getPositionX();
		if(heroX >= this.getPositionX() && heroX <= this.getPositionX()+this.getContentSize().width){
			return true;
		}else{
			return false;
		}
	},
	
	getStandPoint:function(){
		return cc.p(this.getPositionX()+this.getContentSize().width*0.5,this.getPositionY()+GameConstants.BOARD_HEIGHT-3);
	},
	
	reuse:function(width,y,color,speed){
		this.init(width, y, color, speed);
	},
	unuse:function(){
		this.unscheduleUpdate();
	}
});


Board.create = function(width,y,color,speed){
	
	if(cc.pool.hasObject(Board)){
		return cc.pool.getFromPool(Board,width,y,color,speed);
	}else{
		return new Board(width,y,color,speed);
	}
	
}