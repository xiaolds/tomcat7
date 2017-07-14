/**
 * author:yangbobin
 * date:2016-8-31
 * desc:介质同步设置列表Store
 */

Ext.define('acesure.config.store.SynchStoragePathStore', {
    extend: 'Ext.data.Store',
    pageSize: 15,
    model: 'acesure.config.model.SynchStoragePathModel', 
    params:{
        'pageBean.firstResult':0,
        'pageBean.maxResult':15
        },
    proxy:{
        type : 'ajax',
        url : '/config/toSynchStPath!getSynchInfo.action',
        startParam:'pageBean.firstResult',
        limitParam:'pageBean.maxResult',
        reader : {
            type : 'json',
            root : 'synchList',
            totalProperty: 'total'
        }
     },   
    autoLoad: true 
});

