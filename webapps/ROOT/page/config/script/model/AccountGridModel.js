Ext.define('acesure.config.model.AccountGridModel', {
    extend : 'Ext.data.Model',      
    fields : [
             { name : 'userId' },
             { name : 'userName' },
             { name : 'userPwd' },
             { name : 'userState' }, 
             { name : 'userLoginType' },
             { name : 'userRegDateTime' },
             { name : 'userUpdateDateTime'},
             { name : 'userLoginDateTime' },
             { name : 'userLockDateTime'},
             { name : 'userLoginErrorCount'},
             { name : 'userEmail'},
             { name : 'userPhone' },
             { name : 'userRemark'},
             { name : 'role'}
         ]
});


