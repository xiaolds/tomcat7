Ext.define('acesure.controller.sysLog.SystemLogController',{
	extend : 'Ext.app.Controller',
    alias:"widget.systemLogController",
    views:['sysLog.SystemLogList','sysLog.EmergencyLogList','sysLog.RecoveryLogList',
           'sysLog.UserLogList','sysLog.ModuleLogList','sysLog.ManageLogList',
           'sysLog.DiskCloneLogList','sysLog.WarningLogList','sysLog.BackupDBLogList',
           'sysLog.LicenseLogList','sysLog.ClusterLogList'],
    stores:['sysLog.SystemLogStore','sysLog.EmergencyLogStore','sysLog.RecoveryLogStore',
            'sysLog.UserLogStore','sysLog.ModuleLogStore','sysLog.ManageLogStore',
            'sysLog.DiskCloneLogStore','sysLog.WarningLogStore','sysLog.BackupDBLogStore',
            'sysLog.ClusterLogStore'],
    models:['sysLog.SystemLogModel','sysLog.ManageLogModel','sysLog.DiskCloneLogModel',
            'sysLog.WarningLogModel','sysLog.BackupDBLogModel','sysLog.ClusterLogModel'],
    init: function(){
        this.control({
        	//备份日志-搜索
        	'diskCloneSearchToolbar button[id=searchDiskCloneLogBut]' : {
    			click : this.searchDiskCloneLogBut
    		},//备份日志-重置
    		'diskCloneSearchToolbar button[id=resetDiskCloneLogBut]' : {
    			click : this.resetDiskCloneLogBut
    		},
    		//集群日志-搜索
        	'clusterSearchToolbar button[id=searchClusterLogBut]' : {
    			click : this.searchClusterLogBut
    		},
    		//集群日志-重置
    		'clusterSearchToolbar button[id=resetClusterLogBut]' : {
    			click : this.resetClusterLogBut
    		},
    		//预警日志-搜索
    		'warningCenterToolbar button[id=searchWarningLogBut]' : {
        		click : this.searchWarningLogBut
        	},//预警日志-重置
        	'warningCenterToolbar button[id=resetWarningLogBut]' : {
        		click : this.resetWarningLogBut
        	},//系统日志-搜索
        	'systemCenterToolbar button[id=searchSystemLogBut]' : {
        		click : this.searchSystemLogBut
        	},//系统日志-重置 
        	'systemCenterToolbar button[id=resetSystemLogBut]' : {
        		click : this.resetSystemLogBut
        	},//应急日志-搜索
        	'emergencyLogSearchToolbar button[id=searchEmergencyLogBut]' : {
        		click : this.searchEmergencyLogBut
        	},//应急日志-重置
        	'emergencyLogSearchToolbar button[id=resetEmergencyLogBut]' : {
        		click : this.resetEmergencyLogBut
        	},//存储恢复日志-搜索
        	'recoveryLogSearchToolbar button[id=searchRecoveryLogBut]' : {
        		click : this.searchRecoveryLogBut
        	},//存储恢复日志-重置
        	'recoveryLogSearchToolbar button[id=resetRecoveryLogBut]' : {
        		click : this.resetRecoveryLogBut
        	},//账户操作日志-搜索
        	'userLogSearchToolbar button[id=searchUserLogBut]' : {
        		click : this.searchUserLogBut
        	},//账户操作日志-重置
        	'userLogSearchToolbar button[id=resetUserLogBut]' : {
        		click : this.resetUserLogBut
        	},//模块运行日志-搜索
        	'moduleLogSearchToolbar button[id=searchModuleLogBut]' : {
        		click : this.searchModuleLogBut
        	},//模块运行日志-重置
        	'moduleLogSearchToolbar button[id=resetModuleLogBut]' : {
        		click : this.resetModuleLogBut
        	},//运维日志-搜索
        	'manageSearchToolbar button[id=searchManageLogBut]' : {
    			click : this.searchManageLogBut
    		},//运维日志-重置
    		'manageSearchToolbar button[id=resetManageLogBut]' : {
    			click : this.resetManageLogBut
    		},//数据库备份日志-搜索
    		'backupDBCenterToolbar button[id=searchBackupDBLogBut]' : {
    			click : this.searchBackupDBLogBut
    		},//数据库备份日志-重置
    		'backupDBCenterToolbar button[id=resetBackupDBLogBut]' : {
    			click : this.resetBackupDBLogBut
    		},//备份日志-导出
    		'diskCloneLogToolbar button[id=diskCloneLogExportId]':{
    			click : this.diskCloneLogExport
    		},
    		//集群日志-导出
    		'clusterLogToolbar button[id=clusterLogExportId]':{
    			click : this.clusterLogExport
    		},//预警日志-导出
    		'warningLogToolbar button[id=warningLogExportId]':{
    			click : this.warningLogExport
    		},//应急日志-导出
    		'emergencyLogToolbar button[id=emergencyLogExportId]':{
    			click : this.emergencyLogExport
    		},//存储恢复日志-导出
    		'recoveryLogToolbar button[id=recoveryLogExportId]':{
    			click : this.recoveryLogExport
    		},//系统日志-导出
    		'systemLogToolbar button[id=systemLogExportId]':{
    			click : this.systemLogExport
    		},//运维日志-导出
    		'manageLogToolbar button[id=manageLogExportId]':{
    			click : this.manageLogExport
    		},//数据库备份日志-导出
    		'backupDBLogToolbar button[id=backupDBLogExportId]':{
    			click : this.backupDBLogExport
    		}
        })
    },
    //备份日志搜索
    searchDiskCloneLogBut : function(){
    	var beginDateId = Ext.getCmp("beginDateId").value;
    	var endDateId = Ext.getCmp("endDateId").value;
    	var diskCloneLogLevel = Ext.getCmp("diskCloneLogLevel").value;
    	
    	if(beginDateId != null && endDateId != null){
    		if(beginDateId > endDateId){
    			Ext.MessageBox.alert(local.window.tip,local.log.noExceed);
    			return false;
    		}
    	}
    	
    	var diskCloneStore = Ext.getCmp('diskCloneLogGridId').getStore();
    	
    	var params = {
    		beginDateId : beginDateId,
    		endDateId : endDateId,
    		diskCloneLogLevel :diskCloneLogLevel
    	}
		
    	diskCloneStore.load({
			params : params
		});
    	
    	//往store附加额外的参数（用于分页条件查询）
		diskCloneStore.on('beforeload', function() {
        	diskCloneStore.proxy.extraParams = {
                beginDateId : beginDateId,
    			endDateId : endDateId,
    			diskCloneLogLevel :diskCloneLogLevel
            };
         });
    }, 
    //集群日志搜索
    searchClusterLogBut : function(){
    	
    	var beginDateId = Ext.getCmp("beginDateId").value;
    	var endDateId = Ext.getCmp("endDateId").value;
    	var clusterLogLevel = Ext.getCmp("clusterLogLevel").value;
    	var clusterLogModule = Ext.getCmp("clusterLogModule").value;
    	
    	if(beginDateId != null && endDateId != null){
    		if(beginDateId > endDateId){
    			Ext.MessageBox.alert(local.window.tip,local.log.noExceed);
    			return false;
    		}
    	}
    	
    	var store = Ext.getCmp('clusterLogGridId').getStore();
    	
    	var params = {
    		beginDateId : beginDateId,
    		endDateId : endDateId,
    		logLevel : clusterLogLevel,
    		logModule : clusterLogModule
    	}
		
    	store.load({
			params : params
		});
    	
    	//往store附加额外的参数（用于分页条件查询）
    	/*store.on('beforeload', function() {
        	store.proxy.extraParams = {
                beginDateId : beginDateId,
    			endDateId : endDateId,
    			logLevel :clusterLogLevel
            };
         });*/
    }, 
    //系统日志搜索
    searchSystemLogBut : function(){
    	var beginDateId = Ext.getCmp("beginDateId").value;
    	var endDateId = Ext.getCmp("endDateId").value;
    	var systemLogLevel = Ext.getCmp("systemLogLevel").value;
    	
    	if(beginDateId != null && endDateId != null){
    		if(beginDateId > endDateId){
    			Ext.MessageBox.alert(local.window.tip,local.log.noExceed);
    			return false;
    		}
    	}
    	
    	var params = {
    		beginDateId : beginDateId,
    		endDateId : endDateId,
    		systemLogLevel :systemLogLevel
    	}
		
    	var systemStore = Ext.getCmp('systemLogGridId').getStore();
    	
    	systemStore.load({
			params : params
		});
		
		//往store附加额外的参数（用于分页条件查询）
		systemStore.on('beforeload', function() {
        	systemStore.proxy.extraParams = {
                beginDateId : beginDateId,
    			endDateId : endDateId,
    			systemLogLevel : systemLogLevel
            };
         });
		
    },
    //预警日志搜索
    searchWarningLogBut : function(){
    	var beginDateId = Ext.getCmp("beginDateId").value;
    	var endDateId = Ext.getCmp("endDateId").value;
    	var warningLogLevel = Ext.getCmp("warningLogLevel").value;
    	
    	if(beginDateId != null && endDateId != null){
    		if(beginDateId > endDateId){
    			Ext.MessageBox.alert(local.window.tip,local.log.noExceed);
    			return false;
    		}
    	}
    	
    	var params = {
    		beginDateId : beginDateId,
    		endDateId : endDateId,
    		warningLogLevel : warningLogLevel
    	}
		
    	var warningStore = Ext.getCmp('warningLogGridId').getStore();
    	
    	warningStore.load({
			params : params
		});
		
		//往store附加额外的参数（用于分页条件查询）
		warningStore.on('beforeload', function() {
        	warningStore.proxy.extraParams = {
                beginDateId : beginDateId,
    			endDateId : endDateId,
    			warningLogLevel : warningLogLevel
            };
         });
		
    },
    //应急日志搜索
    searchEmergencyLogBut : function(){
    	var beginDateId = Ext.getCmp("beginDateId").value;
    	var endDateId = Ext.getCmp("endDateId").value;
    	var emergencyLogLevel = Ext.getCmp("emergencyLogLevel").value;
    	
    	if(beginDateId != null && endDateId != null){
    		if(beginDateId > endDateId){
    			Ext.MessageBox.alert(local.window.tip,local.log.noExceed);
    			return false;
    		}
    	}
    	
    	var params = {
    			beginDateId : beginDateId,
    			endDateId : endDateId,
    			emergencyLogLevel : emergencyLogLevel
    	}
    	
    	var emergencyStore = Ext.getCmp('emergencyLogGridId').getStore();
    	
    	emergencyStore.load({
    		params : params
    	});
    	
    	//往store附加额外的参数（用于分页条件查询）
    	emergencyStore.on('beforeload', function() {
    		emergencyStore.proxy.extraParams = {
    				beginDateId : beginDateId,
    				endDateId : endDateId,
    				emergencyLogLevel : emergencyLogLevel
    		};
    	});
    	
    },
    //存储恢复日志搜索
    searchRecoveryLogBut : function(){
    	var beginDateId = Ext.getCmp("beginDateId").value;
    	var endDateId = Ext.getCmp("endDateId").value;
    	var storageLogLevel = Ext.getCmp("storageLogLevel").value;

    	if(beginDateId != null && endDateId != null){
    		if(beginDateId > endDateId){
    			Ext.MessageBox.alert(local.window.tip,local.log.noExceed);
    			return false;
    		}
    	}
    	
    	var params = {
    			beginDateId : beginDateId,
    			endDateId : endDateId,
    			storageLogLevel : storageLogLevel
    	}
    	
    	var recoveryStore = Ext.getCmp('recoveryLogGridId').getStore();
    	
    	recoveryStore.load({
    		params : params
    	});
    	
    	//往store附加额外的参数（用于分页条件查询）
    	recoveryStore.on('beforeload', function() {
    		recoveryStore.proxy.extraParams = {
    				beginDateId : beginDateId,
    				endDateId : endDateId,
        			storageLogLevel : storageLogLevel
    		};
    	});
    	
    },
    //账户操作日志搜索
    searchUserLogBut : function(){
    	var beginDateId = Ext.getCmp("beginDateId").value;
    	var endDateId = Ext.getCmp("endDateId").value;
    	
    	if(beginDateId != null && endDateId != null){
    		if(beginDateId > endDateId){
    			Ext.MessageBox.alert(local.window.tip,local.log.noExceed);
    			return false;
    		}
    	}
    	
    	var params = {
    			beginDateId : beginDateId,
    			endDateId : endDateId
    	}
    	
    	var userStore = Ext.getCmp('userLogGridId').getStore();
    	
    	userStore.load({
    		params : params
    	});
    	
    	//往store附加额外的参数 （用于分页条件查询）
    	userStore.on('beforeload', function() {
    		userStore.proxy.extraParams = {
    				beginDateId : beginDateId,
    				endDateId : endDateId
    		};
    	});
    }, 
    //模块运行日志搜索
    searchModuleLogBut : function(){
    	var beginDateId = Ext.getCmp("beginDateId").value;
    	var endDateId = Ext.getCmp("endDateId").value;
    	
    	if(beginDateId != null && endDateId != null){
    		if(beginDateId > endDateId){
    			Ext.MessageBox.alert(local.window.tip,local.log.noExceed);
    			return false;
    		}
    	}
    	
    	var params = {
    			beginDateId : beginDateId,
    			endDateId : endDateId
    	}
    	
    	var moduleStore = Ext.getCmp('moduleLogGridId').getStore();
    	
    	moduleStore.load({
    		params : params
    	});
    	
    	//往store附加额外的参数 （用于分页条件查询）
    	moduleStore.on('beforeload', function() {
    		moduleStore.proxy.extraParams = {
    				beginDateId : beginDateId,
    				endDateId : endDateId
    		};
    	});
    }, 
    //运维日志搜索
    searchManageLogBut : function(){
    	var beginDateId = Ext.getCmp("beginDateId").value;
    	var endDateId = Ext.getCmp("endDateId").value;
    	var manageLogLevel = Ext.getCmp("manageLogLevel").value;
    	
    	if(beginDateId != null && endDateId != null){
    		if(beginDateId > endDateId){
    			Ext.MessageBox.alert(local.window.tip,local.log.noExceed);
    			return false;
    		}
    	}
    	
    	var params = {
    		beginDateId : beginDateId,
    		endDateId : endDateId,
    		manageLogLevel :manageLogLevel
    	}
    	
    	var manageStore = Ext.getCmp('manageLogGridId').getStore();
    	
    	manageStore.load({
			params : params
		});
		
		//往store附加额外的参数 （用于分页条件查询）
    	manageStore.on('beforeload', function() {
    		manageStore.proxy.extraParams = {
                beginDateId : beginDateId,
    			endDateId : endDateId,
    			manageLogLevel :manageLogLevel
            };
         });
    },
    //数据库备份日志
    searchBackupDBLogBut : function(){
    	var beginDateId = Ext.getCmp("beginDateId").value;
    	var endDateId = Ext.getCmp("endDateId").value;
    	var backupDBLevel = Ext.getCmp("backupDBLevel").value;
    	
    	if(beginDateId != null && endDateId != null){
    		if(beginDateId > endDateId){
    			Ext.MessageBox.alert(local.window.tip,local.log.noExceed);
    			return false;
    		}
    	}
    	
    	var params = {
    		beginDateId : beginDateId,
    		endDateId : endDateId,
    		backupDBLevel : backupDBLevel
    	}
        	
    	var backupDBLogStore = Ext.getCmp('backupDBLogGridId').getStore();
    	
		backupDBLogStore.load({
			params : params
		});
		
		//往store附加额外的参数 （用于分页条件查询）
		backupDBLogStore.on('beforeload', function() {
		backupDBLogStore.proxy.extraParams = {
                beginDateId : beginDateId,
    			endDateId : endDateId,
        		backupDBLevel : backupDBLevel
            };
         });
    	
    },
    //备份日志重置
    resetDiskCloneLogBut : function(){
    	Ext.getCmp("beginDateId").setValue();
    	Ext.getCmp("endDateId").setValue();
    	Ext.getCmp("diskCloneLogLevel").setValue();
    },
    //集群日志重置
    resetClusterLogBut : function(){
    	Ext.getCmp("beginDateId").setValue();
    	Ext.getCmp("endDateId").setValue();
    	Ext.getCmp("clusterLogLevel").setValue();
    	Ext.getCmp("clusterLogModule").setValue();
    },
    //预警日志重置
    resetWarningLogBut : function(){
    	Ext.getCmp("beginDateId").setValue();
    	Ext.getCmp("endDateId").setValue();
    	Ext.getCmp("warningLogLevel").setValue();
    },
    //系统日志重置
    resetSystemLogBut : function(){
    	Ext.getCmp("beginDateId").setValue();
    	Ext.getCmp("endDateId").setValue();
    	Ext.getCmp("systemLogLevel").setValue();
    },
    //应急日志重置
    resetEmergencyLogBut :function(){
    	Ext.getCmp("beginDateId").setValue();
    	Ext.getCmp("endDateId").setValue();
    	Ext.getCmp("emergencyLogLevel").setValue();
    },
    //存储恢复日志重置
    resetRecoveryLogBut :function(){
    	Ext.getCmp("beginDateId").setValue();
    	Ext.getCmp("endDateId").setValue();
    	Ext.getCmp("storageLogLevel").setValue();
    },
    //账户操作日志重置
    resetUserLogBut :function(){
    	Ext.getCmp("beginDateId").setValue();
    	Ext.getCmp("endDateId").setValue();
    },
    //模块运行日志重置
    resetModuleLogBut :function(){
    	Ext.getCmp("beginDateId").setValue();
    	Ext.getCmp("endDateId").setValue();
    },
    //运维日志重置
    resetManageLogBut :function(){ 
    	Ext.getCmp("beginDateId").setValue();
    	Ext.getCmp("endDateId").setValue();
    	Ext.getCmp("manageLogLevel").setValue();
    },
    //数据库操作日志重置
    resetBackupDBLogBut :function(){ 
    	Ext.getCmp("beginDateId").setValue();
    	Ext.getCmp("endDateId").setValue();
    	Ext.getCmp("backupDBLevel").setValue();
    },
    //备份日志-导出
    diskCloneLogExport : function(){
    	//通过执行window.open()来打开一个下载框图
    	window.open('/syslog/toSystemLog!DiskCloneLogExport.action');
    },
    //集群日志-导出
    clusterLogExport : function(){
    	//通过执行window.open()来打开一个下载框图
    	window.open('/syslog/toSystemLog!ClusterLogExport.action');
    },
    //预警日志-导出
    warningLogExport : function(){
    	//通过执行window.open()来打开一个下载框图
    	window.open('/syslog/toSystemLog!WarningLogExport.action');
    },
    //应急日志-导出
    emergencyLogExport : function(){
    	//通过执行window.open()来打开一个下载框图
    	window.open('/syslog/toSystemLog!EmergencyCloneLogExport.action');
    },
    //存储恢复日志-导出
    recoveryLogExport : function(){
    	//通过执行window.open()来打开一个下载框图
    	window.open('/syslog/toSystemLog!RecoveryCloneLogExport.action');
    },
    //系统日志-导出
    systemLogExport : function(){
    	//通过执行window.open()来打开一个下载框图
    	window.open('/syslog/toSystemLog!SystemLogExport.action');
    },
    //系统日志-导出
    manageLogExport : function(){
    	//通过执行window.open()来打开一个下载框图
    	window.open('/syslog/toSystemLog!ManageLogExport.action');
    },
    //数据库备份日志-导出
    backupDBLogExport : function(){
    	//通过执行window.open()来打开一个下载框图
    	window.open('/syslog/toSystemLog!BackupDBLogExport.action');
    }
})