/**
 * author:yangbobin
 * desc:消息中心-主模块
 * date:2016-4-25
 */
Ext.Loader.setConfig({
    enabled : true
});

Ext.application({
    name : "acesure.msgcenter",
    appFolder : '/page/msgcenter/script',
    controllers : ['NotifyController'],
    //页面加载完成之后执行的函数
    launch : function() {
    }
});

/**
 * 消息通知视图主框架
 */
Ext.define('acesure.msgcenter.view.MsgMainPanel',{
    extend : 'Ext.panel.Panel',
    alias : 'widget.msgMainPanel',
    border : false,
    id : 'msgMainPanel',
    layout : 'hbox',
    items : [{
                xtype : 'notifyGrid',    //消息通知列表
                width:350,
                height:340
            },{
                xtype : 'notifyInfo',    //消息通知详情
                width:500,
                height:340
            }]
});
