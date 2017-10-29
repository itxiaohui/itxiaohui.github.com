
module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        _uiName : null,
    },

    // use this for initialization
    onLoad: function () {
        if(this._uiName) {
            gslog(this._uiName + " onLoad");
        }

        this.addButtonListener();
    },

    onEnable : function(){
        if(this._uiName) {
            gslog(this._uiName+" onEnable" );
        }
    },

    onDisable : function(){
        if(this._uiName) {
            gslog(this._uiName+" onDisable");
        }
    },

    addButtonListener : function(){
        this.travelButton(this.node);
    },

    travelButton : function(node){
        if(node && node.getComponent(cc.Button)){
            node.on("click",this.preButtonClick,this);
        }

        if(node){
            var childs = node.getChildren();
            for(var index in childs){
                var ch = childs[index];
                this.travelButton(ch);
            }
        }

    },

    preButtonClick : function(event){
        var buttonNode = event.detail.node;
        this.onButtonClick(buttonNode);
    },

    setIcon : function(ui,name){
        if(ui instanceof cc.Node){
            ui = ui.getComponent(cc.Sprite);
        }
        if(!ui || !name){
            return;
        }
        if(ui instanceof cc.Sprite){
            ui.spriteFrame = atlasData.getSpriteFrame(name);
        }
    },

    onButtonClick : function(btnNode){
        gslog("default onButtonClick : "+btnNode.name);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
