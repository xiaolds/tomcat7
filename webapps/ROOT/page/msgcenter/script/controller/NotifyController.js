/**
 * author:yangbobin 
 * desc:消息中心控制器 
 * date:2016-4-25
 */
Ext.define('acesure.msgcenter.controller.NotifyController', {
    extend: 'Ext.app.Controller',
    alias: 'widget.notifyController',
    views: ['NotifyGrid', 'NotifyInfo'],
    models: ['NotifyModel'],
    stores: ['NotifyListStore'],
    init: function () {
        this.control({
            'notifyGrid': {
                itemclick: this.showNotifyInfo
            },
            'msgMainPanel': {
                afterrender: this.showFirstInfo
            }
        });
    },
    /**
     * 点击展现通知详细信息
     */
    showNotifyInfo: function (self, record, item, index, e, eOpts) {
        updateNotifyDetail(record);
    },
    /**
     * 
     * 展示列表第一条通知信息
     */
    showFirstInfo: function (self) {
        Ext.getCmp("notifyGrid").store.load({
            callback: function (records, operation, success) {
                var firstRecord = records[0];    //加载完毕获取第一条记录
                if (firstRecord) {
                    updateNotifyDetail(firstRecord);
                }
            }
        });
    }
 
});
 
/**
 * 根据通知记录展示通知详细信息
 */
function updateNotifyDetail(record) {
    var notify = record.data;    //通知信息
    var notifyInfo = Ext.getCmp('notifyInfo');
 
    //更新消息通知基本信息 
    var stateTitle = null;    //消息级别
    var stateClass = null;
    var stateInco = notifyInfo.query("panel[itemId=stateIcon]")[0];    //消息级别图标
    //1.正常 2.故障 3.警告
    if (notify.notifyState == 1) {
        stateInco.update('<img src="/images/msgcenter/normal_51.png"/>');
        stateTitle = local.normal;
        stateClass = "info_title_blue";    //正常样式
    } else if (notify.notifyState == 2) {
        stateInco.update('<img src="/images/msgcenter/error_51.png"/>');
        stateTitle = local.defaulty;
        stateClass = "info_title_red";    //故障样式
    } else if (notify.notifyState == 3) {
        stateInco.update('<img src="/images/msgcenter/warning_51.png"/>');
        stateTitle = local.warn;
        stateClass = "info_title_orange";    //警告样式
    }
 
    var isRead = notify.isRead;    //1:未读 2：已读
    var readState = "";
    if (isRead == 1) {
        readState = local.msg.unread;
    } else {
        readState = local.msg.read;
    }
 
    var title = notifyInfo.query("panel[itemId=title]")[0];    //消息标题
    title.update("<span class=" + stateClass + ">" + stateTitle + "<span><div class='info_text'>" + notify.title +
        "<span>[" + readState + "]</span></div>");
 
    var baseInfo = notifyInfo.query("panel[itemId=baseInfo]")[0];    //消息基本信息
    var notifyId = notify.notifyId;
    var moduleType = notify.moduleType;    //模块类型
    var notifyTime = notify.notifyTime;    //通知产生时间
    var notifySource = notify.notifySource;    //通知来源
    baseInfo.update("<div class='base_info'><span class='base_info_t'>" + local.num + local.colon +
        "</span><span class='base_info_c'>" + notifyId + "</span><span class='base_info_t'>" + local.time + local.colon +
        "</span><span class='base_info_c'>" + notifyTime + "</span>" +
        "</div><div class='base_info'><span class='base_info_t'>" + local.log.module + local.colon +
        "</span><span class='base_info_c'>" + moduleType + "</span><span class='base_info_t'>" + local.log.gridSource +
        local.colon + "</span><span class='base_info_c'>" + notifySource + "</span></div>");
 
    //更新消息通知内容      
    var detailInfo = notifyInfo.query("panel[itemId=detailInfo]")[0];    //消息通知内容
    detailInfo.update("<span class='base_info_t'>" + local.msg.Details + "</span><br>" + notify.content);
 
 
    //当前消息状态：未读 则更改状态为已读
    if (isRead == 1) {
        notify.isRead = 2;    //更新页面已读/未读 显示状态
        Ext.Ajax.request({
            url: '/notify/tonotifyAction!setNotifyRead.action',
            params: {
                'notify.notifyId': notifyId
            },
            success: function (response, options) {}
        });
    }
 
}