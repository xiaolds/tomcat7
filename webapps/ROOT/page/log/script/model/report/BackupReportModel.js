Ext.define('acesure.model.report.BackupReportModel', {
    extend: 'Ext.data.Model',
    fields: [  
    		{name: 'deviceId',	  		type: 'int'},
    		{name: 'uniqueId', 			type: 'string'},
    		{name: 'status',			type: 'int'},
            {name: 'markDel',  			type: 'int'},  
            {name: 'mac',      			type: 'string'},
            {name: 'ip',      			type: 'string'},
            {name: 'computerName',  	type: 'string'},
            {name: 'use',     			type: 'string'},
            {name: 'isStandby',     	type: 'int'},
            {name: 'standbyId',     	type: 'int'},
            {name: 'diskcloneId',   	type: 'int'},
            {name: 'uuid',      		type: 'string'},
            {name: 'online',      		type: 'int'},
            {name: 'state',      		type: 'int'},
            {name: 'vmimgModifyTime',   type: 'string'},
            {name: 'synchrIntervalValue', type: 'int'},
            {name: 'synchrIntervalType', type: 'int'}
        ]
});