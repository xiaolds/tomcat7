Ext.define('acesure.model.report.LogTreeModel', {
    extend: 'Ext.data.Model',
    fields: [
       {name: 'id',					type: 'string'},
       {name: 'text',				type: 'string' },
       {name: 'iconCls',			type: 'string' },
       {name: 'expanded',			type: 'boolean' },
       {name: 'leaf',				type: 'boolean' },
       {name: 'auth',				type: 'int' }
    ]
});