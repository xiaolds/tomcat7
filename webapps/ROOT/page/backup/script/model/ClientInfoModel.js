/**
 * author:yangbobin
 * date:2017-5-18
 */
 Ext.define('websure.backup.model.ClientInfoModel', {
    extend: 'Ext.data.Model',
    fields: [  
            {name : 'clientIP',    type: 'string'},
            {name : 'clientUName', type: 'string'},
            {name : 'clientPsd',type: 'string'}
        ]  
});