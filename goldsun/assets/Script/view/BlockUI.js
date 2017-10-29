var BaseComponent = require("BaseComponent");

cc.Class({
    extends: BaseComponent,

    properties: {

        // 0：普通   1：可打开  2：已打开
        _statusCode : 0,
        _statusText : null,
        _row : null,
        _col : null,
    },

    // use this for initialization
    onLoad: function () {
        this._super();

        this._statusText = cc.find("text",this.node);

    },

    getStatusCode : function(){
        return this._statusCode;
    },

    setStatusCode : function(code){
        this._statusCode = code;
        var text = "普通";
        switch (this._statusCode){
            case 0:
                this._statusText.color = cc.Color.BLACK;
                text = "普通";
                break;
            case 1:
                this._statusText.color = cc.Color.BLUE;
                text = "可打开";
                break;
            case 2:
                this._statusText.color = cc.Color.RED;
                text = "已打开";
                break;
            default:
                this._statusText.color = cc.Color.BLACK;
                text = "普通";
                break;
        }
        this._statusText.getComponent(cc.Label).string = text;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
