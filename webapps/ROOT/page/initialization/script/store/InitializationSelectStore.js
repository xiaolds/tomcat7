Ext.define('acesure.initialization.store.InitializationSelectStore', {
    extend: 'Ext.data.Store',
    alias:'widget.InitializationSelectStore',
    model: 'acesure.initialization.model.InitializationModel',
    proxy:{
        type:'ajax',
        url : '/initialization/toInitialization!check.action',
        reader: {
            type: 'json',
            root: 'success'
        }
    },
    autoLoad: true
});
