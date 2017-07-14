Ext.define('websure.backup.model.AlarmHistoryModel', {
    extend: 'Ext.data.Model',
    fields: [
	   /*{name: 'deviceId',					    type: 'int'		},
	   {name: 'deviceTime',  				    type: 'String'	},
	   {name: 'threshold',   				    type: 'int'	},
	   {name: 'usedsize',   				    type: 'int'	},
	   {name: 'warningSource',   			    type: 'int'	},
	   {name: 'warningType',    			    type: 'int'	},
	   {name: 'scriptName',    				    type: 'String'	}*/
	   {name: 'deviceId',					    type: 'int'		},
	   {name: 'notifyState',				    type: 'int'		},
	   {name: 'content',					    type: 'String'		},
	   {name: 'source',					    	type: 'String'		},
	   {name: 'notifyTime',					    type: 'String'		},
	   {name: 'scriptName',					    type: 'String'		},
	   {name: 'continueTime',					type: 'String'		},
	   {name: 'configRunTimeInterval',		    type: 'int'		},
	   {name: 'configRunTimeIntervalUnit',	    type: 'String'		},
       {name: 'configContRunTimeInterval',		type: 'int'		},
       {name: 'configContRunTimeIntervalUnit',	type: 'String'		}
    ]
});