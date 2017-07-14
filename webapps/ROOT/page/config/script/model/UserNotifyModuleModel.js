Ext.define('acesure.config.model.UserNotifyModuleModel', {
    extend : 'Ext.data.Model',      
    fields : [
             { name : 'id' },
             { name : 'moduleID' },
             { name : 'userID' },
             { name : 'notifyTime' }, 
             { name : 'notifyTypes' },
             { name : 'desc' },
             { name : 'notifyModule' }
         ]
});


