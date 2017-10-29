
module.exports = {

    // 事件监听列表
    listeners : [],

    // 接收的事件缓存列表
    events : [],

    // 添加监听
    on : function(ac,cb,sender){
        if(!ac || !cb || !sender){
            gslog("clientMsg on fail because of params error.");
            return;
        }

        for(var i=0;i<this.listeners.length;i++){
            var sl = this.listeners[i];
            if(sl.ac == ac && sl.cb == cb){
                return;
            }
        }

        var listener = {};
        listener.ac = ac;
        listener.cb = cb;
        listener.sender = sender;
        this.listeners.push(listener);

    },

    // 移除监听
    off : function(ac,cb,sender){
        if(!ac || !cb || !sender){
            gslog("clientMsg off fail because of params error.");
            return;
        }

        var tmpListeners = [];
        for(var i=0;i<this.listeners.length;i++){
            var sl = this.listeners[i];
            if(sl.ac == ac && sl.cb == cb){
                continue;
            }
            tmpListeners.push(sl);
        }
        this.listeners = tmpListeners;
    },

    // 发送消息
    send : function(ac,data,save){
        if(!ac || !data){
            gslog("clientMsg send fail because of params error.");
            return;
        }

        var isFind = false;
        for(var i=0;i<this.listeners.length;i++){
            var sl = this.listeners[i];
            if(sl.ac == ac){
                isFind = true;
                var cbData = {};
                cbData.ac = ac;
                cbData.data = data;
                if(sl.cb && sl.sender){
                    try{
                        sl.cb.call(sl.sender,cbData);
                    }catch(e){
                        gslog(e.message+" \nclientMsg send error : ac="+ac+",data="+JSON.stringify(data));
                    }
                }
            }
        }

        if(save == undefined){
            save = true;
        }
        if(!isFind && save){
            var event = {};
            event.ac = ac;
            event.data = data;
            this.events.push(event);
        }
    },

    update : function(){

        if(!this.events || this.events.length <= 0){
            return;
        }

        var tmpEvents = [];
        for(var key in this.events){
            var event = this.events[key];
            var isFind = false;
            for(var i in this.listeners){
                var listener = this.listeners[i];
                if(listener.ac == event.ac){
                    var cbData = {};
                    cbData.ac = event.ac;
                    cbData.data = event.data;
                    if(listener.cb && listener.sender){
                        try{
                            listener.cb.call(listener.sender,cbData);
                        }catch(e){
                            gslog("clientMsg update send error : ac="+event.ac+",data="+JSON.stringify(event.data));
                        }
                    }
                    isFind = true;
                }
            }
            if(!isFind){
                tmpEvents.push(event);
            }
        }
        this.events = tmpEvents;
    }
};
