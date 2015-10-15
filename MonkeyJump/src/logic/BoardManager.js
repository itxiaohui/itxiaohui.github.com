
var BoardManager = cc.Class.extend({
	
	boardArray:null,
	
	gameScene:null,
	
	winSize:null,
	
	ctor:function(gameScene,hero){
		
		this.gameScene = gameScene;
		this.boardArray = new Array();
		
		this.winSize = cc.director.getWinSize();
	},
	
	update:function(hero,dt){
		if(this.boardArray == null || this.boardArray.length == 0){
			return;
		}
		
		var board = this.boardArray[hero.standBoardIndex];
		switch (hero.heroState) {
			case GameConstants.HERO_STAND:
				if(board.direction == 0){
					// 向左移动
					hero.setPositionX(hero.getPositionX()-board.speed);
				}else{
					// 向右移动
					hero.setPositionX(hero.getPositionX()+board.speed);
				}
				if(hero.getPositionY() > this.winSize.height*0.5){
					hero.heroState = GameConstants.HERO_BOARD_MOVE;
				}
				break;
			case GameConstants.HERO_JUMP_UP:
				if(hero.heroJumpValue > 0){
					hero.setPositionY(hero.getPositionY()+hero.heroJumpValue);
					hero.heroJumpValue--;
				}else{
					hero.heroState = GameConstants.HERO_JUMP_DOWN;
				}
				break;
			case GameConstants.HERO_JUMP_DOWN:
				var boardUp = this.boardArray[hero.standBoardIndex+1];
				if(hero.getPositionY() > boardUp.getStandPoint().y+GameConstants.BOARD_HEIGHT-3){
					hero.setPositionY(hero.getPositionY()-hero.heroJumpValue);
					hero.heroJumpValue++;
				}else if(boardUp.isAcceptHero(hero)){
					hero.heroState = GameConstants.HERO_STAND;
					hero.setPositionY(boardUp.getStandPoint().y);
					hero.standBoardIndex++;
				}else{
					hero.heroState = GameConstants.HERO_STAND;
					hero.setPosition(board.getStandPoint());
				}
				break;
			case GameConstants.HERO_BOARD_MOVE:
				var step = 6;
				for(var i=0;i<this.boardArray.length;i++){
					var board = this.boardArray[i];
					board.unscheduleUpdate();
					board.setPositionY(board.getPositionY()-step);
				}
				hero.setPositionY(hero.getPositionY()-step);
				if(hero.getPositionY() < this.winSize.height*0.2){
					hero.heroState = GameConstants.HERO_STAND;
					for(var i=0;i<this.boardArray.length;i++){
						var board = this.boardArray[i];
						board.scheduleUpdate();
					}
					// 添加新的木板
					var startY = this.boardArray[this.boardArray.length-1].getPositionY();
					for(var i=0;i<3;i++){
						board = Board.create(100, startY+GameConstants.BOARD_GAP*(i+1), cc.color(0, 0, 0), 3);
						this.gameScene.addChild(board);
						this.addBoard(board);
					}
					
					// 移除下方不可见的木板
					for(var i=this.boardArray.length-1;i>=0;i--){
						var board = this.boardArray[i];
						if(board.getPositionY() < -300){
							this.boardArray.splice(i,1);
							hero.standBoardIndex--;
							this.gameScene.removeChild(board);
							cc.pool.putInPool(board);
						}
					}
				}
				break;
			default:
				break;
		}
		
		
	},
	
	init:function(hero){
		if(this.boardArray == null || this.boardArray.length == 0){
			return;
		}
		hero.setPosition(this.boardArray[0].getStandPoint());
	},
	
	addBoard:function(board){
		if(this.boardArray != null){
			this.boardArray.push(board);
		}
	}
});