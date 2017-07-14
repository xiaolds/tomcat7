/**
 * author:yangbobin date:2015-11-11
 */
Ext.define('acesure.config.model.StorageAndPathTreeModel', {
	extend : 'Ext.data.Model',
	fields : [ 
     {name : 'text',type : 'string'},
	 {name : 'id',type : 'int'},
	 {name : 'uniqueId',type : 'string'},
	 {name : 'name',type : 'string'},
	 {name : 'type',type : 'int'},
	 {name : 'ipLan',type : 'string'},
	 {name : 'ipNet',type : 'string'},
 	 {name : 'state',type : 'int'},
 	 {name : 'managePort',type : 'int'},
 	 {name : 'maxManageNum',type : 'string'},
 	 {name : 'userCmdPort',type : 'int'},
 	 {name : 'userDataPort',type : 'int'},
 	 {name : 'maxUserNum',type : 'string'},
	 {name : 'maxUserRwNum',type : 'int'},
	 {name : 'setupTime',type : 'string'},
	 {name : 'localPort',type : 'int'},
	 {name : 'systemType',type : 'string'},
	 {name : 'isExistPath',type : 'int'},
	 {name : 'version',type : 'string'},
	 {name : 'licState',type : 'int'},
	 {name : 'pathId',type : 'int'},
	 {name : 'storageId',type : 'int'},
	 {name : 'path',type : 'string'},
	 {name : 'symbol',type : 'string'},
	 {name : 'freeSize',type : 'string'},
	 {name : 'recommand',type : 'int'}
	  ]
});