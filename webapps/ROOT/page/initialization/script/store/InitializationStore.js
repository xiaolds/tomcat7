Ext.define('acesure.initialization.store.InitializationStore', {
    extend: 'Ext.data.Store',
    alias:'widget.InitializationStore',
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
