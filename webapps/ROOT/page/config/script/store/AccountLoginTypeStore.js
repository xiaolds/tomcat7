Ext.define('acesure.config.store.AccountLoginTypeStore', {
    extend: 'Ext.data.SimpleStore',
    model: 'acesure.config.model.AccountLoginTypeModel',   
    data: [
	       [PASSWORD_TYPE_LOGIN, PASSWORD_DESC],
	       [USBKEY_TYPE_LOGIN, USBKEY_DESC],
	       [BOTH_TYPE_LOGIN, PASSWORD_OR_USBKEY_DESC]
	       ] 
});

