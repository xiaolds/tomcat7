/**
 * author:yangbobin
 * date:2017-5-18
 */
Ext.define('websure.backup.store.ClientInfoListStore', {  
        extend: 'Ext.data.Store',
        model: 'websure.backup.model.ClientInfoModel',
        data:[
        {clientIP:'192.168.1.1',clientUName:'admin',clientPsd:'123'},
        {clientIP:'192.168.1.2',clientUName:'admin',clientPsd:'123'}
        ]
});