
module.exports = {

    // name->SpriteFrame
    data : {},

    addData : function(spriteFrames){
        if(!spriteFrames){
            return;
        }
        for(var i in spriteFrames){
            var sp = spriteFrames[i];
            this.data[sp.name] = sp;
        }
    },

    getSpriteFrame : function(name){
        if(!name){
            return null;
        }
        if(!this.data.hasOwnProperty(name)){
            return null;
        }
        return this.data[name];
    }
};