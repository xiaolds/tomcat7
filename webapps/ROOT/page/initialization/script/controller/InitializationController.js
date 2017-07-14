 Ext.define('acesure.initialization.controller.InitializationController',{
        extend : 'Ext.app.Controller',
        alias:"widget.InitializationController",
        views:['InitializationList'],
        stores:['InitializationStore','InitializationSelectStore'],
        models:['InitializationModel'],
        init: function(){
                
        }
});