Ext.define('acesure.initialization.model.InitializationModel', {
    extend: 'Ext.data.Model',
   	fields: [
    	{ name: 'name', type:'String'},
        { name: 'prerequisite', type: 'string' },
        { name: 'status', type: 'int' },
        { name: 'type', type: 'int' }
    ]
});