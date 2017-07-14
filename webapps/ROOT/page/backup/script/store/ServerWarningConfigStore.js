
Ext.define('websure.backup.store.ServerWarningConfigStore', {
    extend: 'Ext.data.Store',
    model: 'websure.backup.model.ServerWarningConfigModel',
    proxy:{
        type:'ajax',
        url:'/backup/tomonitorAction!findServeAndNotifyWarningBydeviceId.action',
        reader: {
            type: 'json',
            root: 'details'
        }
    }
});