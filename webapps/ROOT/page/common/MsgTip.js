/**
     * Extjs消息提示框
     * Ext.websure.MsgTip.msg('消息标题', '消息内容');//不自动隐藏
     * Ext.websure.MsgTip.msg('消息标题', '消息内容',true);//默认2秒后自动隐藏
     * Ext.websure.MsgTip.msg('消息标题', '消息内容',true,5000);//5秒后自动隐藏
     */

Ext.namespace('Ext.websure');

Ext.websure.MsgTip = function(){
        var msgCt;
        function createBox(t, s){
            return '<div class="msg" style=""><h3 style="margin: 0 0 8px;font-weight: bold;font-size: 14px;">' + t + '</h3><p style="margin:0">' + s + '</p></div>';
        }
        return {
            msg : function(title, message,autoHide,pauseTime){
                if(!msgCt){
                    msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div22'}, true);
                }
                msgCt.alignTo(document, 't-t');
                //给消息框右下角增加一个关闭按钮
                message+='<br><span class="close"><span color="blank"><img style="cursor:hand;" onclick="Ext.websure.MsgTip.hide(this);" src="/images/common/close.png"/></span></span>';
                var m = Ext.DomHelper.append(msgCt, {html:createBox(title, message)}, true);
                m.slideIn('t');
                if(!Ext.isEmpty(autoHide)&&autoHide==true){
                    if(Ext.isEmpty(pauseTime)){
                        pauseTime=2000;
                    }
                    m.pause(pauseTime).ghost("tr", {remove:true});
                }
            },
            hide:function(v){
                var msg=Ext.get(v.parentElement.parentElement.parentElement.parentElement);
                msg.ghost("tr", {remove:true});
            }
        };
    }();
    //infoNum为消息码，content为内容文字
    Ext.websure.MsgError=function(infoNum,content,fun){
        Ext.Msg.show({
            title: local.window.tip,
            minWidth:300,
            msg:"<div class='win_state'><div class='msg_state_t'>"+local.window.infoNum+"<span>("+infoNum+")</span></div><div class='msg_state_c'>"+content+"</div></div>",
            buttons: Ext.MessageBox.OK,
            fn: fun   //增加callback回调函数 by xuyingan
        });
    };
    //带有图标提示的消息提示框
    Ext.websure.MsgTipIcon = function(){
        var msgCt;
        function createBox(t, s , icon){
            return '<div class="msg" style=""><h3 style="margin: 0 0 8px;font-weight: bold;font-size: 14px;">' + t + '</h3><p style="margin:0"><i class="msg_icon msg_icon_'+icon+'"></i>' + s + '</p></div>';
        }
        return {
            msg : function(title, message,icon,autoHide,pauseTime){
                if(!msgCt){
                    msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div22'}, true);
                }
                msgCt.alignTo(document, 't-t');
                //给消息框右下角增加一个关闭按钮
                message+='<br><span class="close"><span color="blank"><img style="cursor:hand;" onclick="Ext.websure.MsgTip.hide(this);" src="/images/common/close.png"/></span></span>';
                var m = Ext.DomHelper.append(msgCt, {html:createBox(title, message,icon)}, true);
                m.slideIn('t');
                if(!Ext.isEmpty(autoHide)&&autoHide==true){
                    if(Ext.isEmpty(pauseTime)){
                        pauseTime=2000;
                    }
                    m.pause(pauseTime).ghost("tr", {remove:true});
                }
            },
            hide:function(v){
                var msg=Ext.get(v.parentElement.parentElement.parentElement.parentElement);
                msg.ghost("tr", {remove:true});
            }
        };
    }();
    /**
     * Extjs消息提示框，带有图标，默认不写为正常，1为警告，2为错误
     * Ext.websure.MsgTipIcon.msg('消息标题', '消息内容');//不自动隐藏，默认图标为正常
     * Ext.websure.MsgTipIcon.msg('消息标题', '消息内容','1',true);//默认2秒后自动隐藏，图标为警告
     * Ext.websure.MsgTipIcon.msg('消息标题', '消息内容','2',true,5000);//5秒后自动隐藏，图标为错误
     */
/*    Ext.websure.MsgTipIcon.msg('消息标题', '消息内容');
    Ext.websure.MsgTipIcon.msg('消息标题', '消息内容','1',true);
    Ext.websure.MsgTipIcon.msg('消息标题', '消息内容','2',true,5000);*/
    //window.onload=function(){Ext.websure.MsgError("2003","4kljkll")}