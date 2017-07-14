/**
 * author:yangbobin
 * desc: 消息中心-通知数据源
 * date:2016-4-25
 */
Ext.define('acesure.msgcenter.store.NotifyListStore', {
    extend: 'Ext.data.Store',
    model: 'acesure.msgcenter.model.NotifyModel',
    params: {
        'pageBean.firstResult': 0,
        'pageBean.maxResult': 30
    },
    proxy: {
        type: 'ajax',
        url: '/notify/tonotifyAction!showUserNotify',    //消息通知列表
        startParam: 'pageBean.firstResult',
        limitParam: 'pageBean.maxResult',
        reader: {
            type: 'json',
            root: 'detail',
            totalProperty: 'total'
        }
    },
    pageSize: 30    //每页显示记录数
});