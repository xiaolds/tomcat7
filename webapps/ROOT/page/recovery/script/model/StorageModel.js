/**
 * author:yangbobin date:2015-10-27
 */
Ext.define('acesure.recovery.model.StorageModel', {
	extend : 'Ext.data.Model',
	fields : [ {name : 'id',type : 'int'},
	           {name : 'uniqueId',type : 'string'},
	           {name : 'name',type : 'string'}, 
	           {name : 'type',type : 'int'},    //1.本地存储 2.网络存储 3.备份存储
	           {name : 'ipLan',type : 'string'},
	           {name : 'ipNet',type : 'string'}, 
	           {name : 'state',type : 'int'},    //1.在线/正常 2.不在线/异常
	           {name : 'managePort',type : 'int'},
	           {name : 'maxManageNum',type : 'int'},
	           {name : 'userCmdPort',type : 'int'}, 
	           {name : 'userDataPort',type : 'int'}, 
	           {name : 'maxUserNum',type : 'int'},
	           {name : 'maxUserRwNum',type : 'int'}, 
	           {name : 'setupTime',type : 'string'},
	           {name : 'localPort',type : 'int'},
	           {name : 'systemType',type : 'int'},    //系统类型
	           {name : 'isExistPath',type : 'int'},     //是否启用已存在路径1.不启用 2.启用 
	           {name : 'version',type : 'string'},
	           {name : 'licState',type : 'int'},     //==1 未授权 ==2已授权
	           {name : 'remark',type : 'string'},
	           {name : 'reserver1',type : 'string'}, 
	           {name : 'reserver2',type : 'string'},
	           {name : 'redirectedRootSymbol',type : 'string'},
	           {name : 'redirectStoragePathSource',type : 'string'}, 
	           {name : 'redirectStoragePathDest',type : 'string'}
	         ]
});