Ext.define('acesure.config.model.MailConfigModel', {
    extend : 'Ext.data.Model',      
    fields : [
             { name : 'mailSMTPHost' },
             { name : 'mailAddress' },
             { name : 'mailPwd' },
             { name : 'configUpdateTime' }
         ]
});


