
//User数据集合
Ext.define('websure.backup.store.SysLogConfigStore', {
    extend: 'Ext.data.Store',
    model: 'websure.backup.model.SysLogConfigModel',
    storeId: 'sysWarningId',
    proxy:{
        type:'ajax',
        url:'/backup/tomonitorAction!findAllSysLogConfigInfo.action',
        reader: {
            type: 'json',
            root: 'detail',
            totalProperty: 'total' //数据总条数
        }
    }
//    autoLoad: true //很关键
});