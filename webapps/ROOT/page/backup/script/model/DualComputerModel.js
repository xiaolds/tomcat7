Ext.define('websure.backup.model.DualComputerModel', {
    extend: 'Ext.data.Model',
    fields: [
    	{ name: 'computerName', type:'String'},
    	{ name: 'deviceId', type:'String'},
    	{ name: 'clientSysversion', type:'String'},
    	{ name: 'ip', type:'String'},
    	{ name: 'clientSystype', type:'String'}
    ]
});