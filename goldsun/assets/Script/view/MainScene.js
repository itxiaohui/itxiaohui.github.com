
cc.Class({
    extends: BaseComponent,

    properties: {
        blockPrefab : cc.Prefab,

        _contentLayout : null,
        _blocksUI : [],

        _rowCount : 6,
        _colCount : 6,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this._uiName = "MainScene";

        gs.clientMsg.on(msgac.block_click,this.process_ac,this);

        this.initUI();
    },

    onDestroy : function(){
        gs.clientMsg.off(msgac.block_click,this.process_ac,this);
    },

    initUI : function(){
        this._cotentLayout = cc.find("content",this.node);

        for(var i=0;i<this._rowCount;i++){
            var rows = [];
            for(var j=0;j<this._colCount;j++){
                var block = cc.instantiate(this.blockPrefab);
                var width = block.width;
                var height = block.height;
                block.position = cc.p(j*width,i*height);
                this._cotentLayout.addChild(block);

                var blockCom = block.getComponent("BlockUI");
                blockCom.setStatusCode(0);
                blockCom._row = i;
                blockCom._col = j;
                rows.push(blockCom);
            }
            this._blocksUI.push(rows);
        }

        // 随机设置一块为可打开状态
        var row = Math.floor(Math.random()*this._rowCount);
        var col = Math.floor(Math.random()*this._colCount);
        this._blocksUI[row][col].setStatusCode(1);

        // test


        this.addButtonListener();
    },


    onButtonClick : function(btnNode){
        switch (btnNode.name){
            case "block":
                var blockUI = btnNode.getComponent("BlockUI");
                if(blockUI.getStatusCode() == 1){
                    blockUI.setStatusCode(2);

                    var row = blockUI._row;
                    var col = blockUI._col;
                    if(row+1<this._rowCount && this._blocksUI[row+1][col].getStatusCode()==0){
                        this._blocksUI[row+1][col].setStatusCode(1);
                    }
                    if(row-1>=0 && this._blocksUI[row-1][col].getStatusCode()==0){
                        this._blocksUI[row-1][col].setStatusCode(1);
                    }
                    if(col+1<this._colCount && this._blocksUI[row][col+1].getStatusCode()==0){
                        this._blocksUI[row][col+1].setStatusCode(1);
                    }
                    if(col-1>=0 && this._blocksUI[row][col-1].getStatusCode()==0){
                        this._blocksUI[row][col-1].setStatusCode(1);
                    }
                }else{
                    gslog("not : "+blockUI.getStatusCode());
                }
                break;
            default:
                break;
        }
    },

    process_ac : function(event){
        var data = event.data;
        var ac = event.ac;
        switch (ac){
            default:
                break;
        }
    },

});