/**
 * author:Mr.wang
 * date:2016-9-1
 * dest:目标同步介质树形组件Store
 */
 Ext.define('acesure.config.store.TargetStoragePathTreeStore', {
    extend: 'Ext.data.TreeStore'/*,
    model:"acesure.config.model.StoragePathTreeModel",
    proxy:{
        type : 'ajax',
        url : '/config/toSynchStPath!getTargetStoPath.action',
        reader : {
            type : 'json',
            root: 'children'
        }
    }*/
});