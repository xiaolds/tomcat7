
//User数据集合
Ext.define('websure.backup.store.SetupWarningConfigStore', {
    extend: 'Ext.data.Store',
    model: 'websure.backup.model.SetupWarningConfigModel',
    proxy:{
        type:'ajax',
        url:'/backup/tomonitorAction!findSetupWarningConfigInfoByParam.action',
        reader: {
            type: 'json',
            root: 'detail'
        }
    }
//    autoLoad: true //很关键
});