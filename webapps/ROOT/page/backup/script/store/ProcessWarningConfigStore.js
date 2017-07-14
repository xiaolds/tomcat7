
//User数据集合
Ext.define('websure.backup.store.ProcessWarningConfigStore', {
    extend: 'Ext.data.Store',
    model: 'websure.backup.model.ProcessWarningConfigModel',
    proxy:{
        type:'ajax',
        url:'/backup/tomonitorAction!findProcessWarningConfigInfoByParam.action',
        reader: {
            type: 'json',
            root: 'detail'
        }
    }
//    autoLoad: true //很关键
});