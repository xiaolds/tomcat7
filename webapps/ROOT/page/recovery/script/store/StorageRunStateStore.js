/**
 * description:存储器运行状态store
 * author:yangbobin
 * date:2016-1-20
 */
Ext.define('acesure.recovery.store.StorageRunStateStore',{
    extend: 'Ext.data.Store',
	model:'acesure.recovery.model.StorageRunStateModel',
	alias:'widget.storageRunStateStore',
	proxy:{
		type:'ajax',
		url:'/recovery/recoveryAction!showStorageRunState.action',    //获取存储器运行状态信息
		reader:{
			type:'json',
			root:'storageRunStateInfo'
		}
	}
});