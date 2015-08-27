
var CircleUI = cc.ClippingNode.extend({
	
	ctor:function(){
		this._super();
		
		var winSize = cc.director.getWinSize();
		
		var drawNode = new cc.DrawNode();
		
		// 这个方法可以画圆，但是空心圆，只有圆上的点才能显示内容，不符合需求
		// cc.color(0, 0, 0,255) 255代表不透明
//		drawNode.drawCircle(cc.p(GameConstants.CircleX,GameConstants.CircleY),GameConstants.CircleRadius,
//				360,100,false,1,cc.color(0, 0, 0));
		
		
		// 这个方法虽然可以画实心圆，但是在遮罩层里面，无缘无故会变成包围它的矩形
//		drawNode.drawDot(cc.p(GameConstants.CircleX,GameConstants.CircleY),GameConstants.CircleRadius,cc.color(0, 0, 0));
		
		// 采用自己组装圆上点的集合，来画多边形，完美解决以上两个问题，正是我们所需要的
		var pointArray = new Array();
		var x = GameConstants.CircleX - GameConstants.CircleRadius;
		var y = 0;
		
		// 取上半圆的点
		for(x;x<=GameConstants.CircleX + GameConstants.CircleRadius;x++){
			y = GameConstants.CircleY + Math.sqrt(Math.pow(GameConstants.CircleRadius,2) - Math.pow(x-GameConstants.CircleX,2));
			pointArray.push(cc.p(x,y));
		}
		
		// 取下半圆的点
		for(x=GameConstants.CircleX + GameConstants.CircleRadius;x>=GameConstants.CircleX - GameConstants.CircleRadius;x--){
			y = GameConstants.CircleY - Math.sqrt(Math.pow(GameConstants.CircleRadius,2) - Math.pow(x-GameConstants.CircleX,2));
			pointArray.push(cc.p(x,y));
		}
		
		drawNode.drawPoly(pointArray,cc.color(0, 0, 0), 3, cc.color(0, 0, 0));
		
		this.setStencil(drawNode);
		
		return true;
	}
	
});