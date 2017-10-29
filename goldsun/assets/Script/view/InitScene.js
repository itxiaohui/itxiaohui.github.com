const i18n = require('LanguageData');
window.localText = i18n;
window.BaseComponent = require("BaseComponent");
window.msgac = require("MsgAc");
window.atlasData = require("AtlasData");

window.gs = {};
window.gs.clientMsg = require("ClientMsg");

window.gslog = function(msg){
    cc.log(msg);
};

cc.Class({
    extends: BaseComponent,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this._super();

        this.initGame();
        this.loadDatas();
    },

    loadDatas : function(){
        cc.director.preloadScene("MainScene");

        // 加载图集
        cc.loader.loadRes('atlas/test', cc.SpriteAtlas,
            function(completedCount ,totalCount ){
                gslog("completedCount:"+completedCount + " totalCount:"+totalCount);
            },
            function (err, atlas) {
                if (err) {
                    gslog(err.message);
                    return;
                }
                var spriteFrames = atlas.getSpriteFrames();
                atlasData.addData(spriteFrames);
            });
    },

    initGame : function(){
        // 语言国际化
        localText.init("zh");

        // 开启消息接发送系统
        setInterval(gs.clientMsg.update.bind(gs.clientMsg),100);
    },

    onButtonClick : function(btnNode){

        switch (btnNode.name){
            case "startGame":
                cc.director.loadScene("MainScene");

                //var testIcon = cc.find("test",this.node);
                //this.setIcon(testIcon.getComponent(cc.Sprite),"ui_diamond");

                break;
            default:
                break;
        }

    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

    },
});
