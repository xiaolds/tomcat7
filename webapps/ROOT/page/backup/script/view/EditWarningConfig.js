warnDeviceId = null;
warnDeviceMac = null;

Ext.define("websure.backup.view.EditWarningConfig", {
	extend : 'Ext.window.Window',
	alias : 'widget.editWarningConfig',
	title : local.backup.editWarningConfigWinTitle,
	draggable : false,
	height : 560,
	width : 410,
	closable : true,
	id : 'editMonitorConfigWindow',
	layout : "border",    //窗口布局类型
	modal : true,    //是否模态窗口，默认为false
	resizable : false,
	items:[{
		xtype : 'form',
		region : 'center',
		id : 'editMonitorPanel',
		style : 'background:#fff;border-left:1px solid #d1dade;',
		border : false,
		items : [{
			xtype:'panel',
			width: '100%',
			border : false,
			cls:"addMonitorPanel",
			style : 'margin-left:30px;margin-top:10px;',
            items: [{
            	xtype :'textfield',
            	id:'scriptWarningId',
				name: 'serWarningConfig.scriptWarningId', 
				hidden:true
            },{
				xtype :'textfield',
				id:'configInfoId',
				name: 'warningConfigInfo.configInfoId', 
				hidden:true
            },{ 
            	xtype :'textfield',
            	id:'deviceId',
            	name: 'warningConfigInfo.deviceId', 
            	hidden:true
            },{ 
            	xtype :'textfield',
            	id:'deviceMac',
            	name: 'serWarningConfig.deviceMac', 
            	hidden:true
            },/*{ 
            	xtype :'textfield',
            	id:'configRunTimeInterval',
            	name: 'warningConfigInfo.configRunTimeInterval', 
            	hidden:true
            },*/{
            	xtype :'textfield',
                fieldLabel: local.backup.warningName,  
                id : 'oldScriptWarningName',
                hidden:true
            },{ 
            	xtype :'textfield',
                fieldLabel: local.backup.warningName,  
                id : 'scriptWarningName',
                name : 'serWarningConfig.scriptWarningName',
                maxLength: 100,//最多字符设置
                maxLengthText: local.backup.maxLengthText100,
                regex : /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                regexText : local.backup.inputTrueMonitorName,
                allowBlank : false
            },{  
                xtype:"combo",  
                fieldLabel: local.backup.warningType,  
                id :'scriptWarningServerType',
                name : 'serWarningConfig.scriptWarningServerType',
                store: new Ext.data.SimpleStore({  
                    fields: ['value', 'text'],  
                    data: [  
                        [local.backup.httpAsk, 1],  
                        [local.backup.databaseAccess, 2],
                        [local.backup.customScript, 3]
                    ]  
                }),  
                readOnly : true,
                displayField: 'value',  
                valueField: 'text',  
                mode: 'local'
            },{
            	id :'serverTypePanel',
            	xtype : 'editHttpWarningConfigPanel',
            	border : false
            },{
            	xtype : 'panel',
            	width : '100%',
            	border : false,
            	style:'margin-top:20px;',
            	layout: 'hbox',
            	items: [{
            		xtype : 'label',
            		text : local.backup.rate+'：',
            		xtype : 'label',
            		style:'padding-top:10px;',
            		width:105,
            		hidden : true
            	},{
                	border:false,
                	hidden : true,
                	html:'<span style="display: inline-block; width: 200px;padding-top:10px;"><input id="editScriptInterSlider" type="slider" value="30" /></span>'
            	}]
            },{
            	id : 'editLevelWarningConfigPanelId',
            	border : false
            },{
            	xtype : 'panel',
            	width : '100%',
    			border : false,
            	items : [{
            		xtype: 'checkboxgroup',
                	id : 'editSuccessReturn',
                	fieldLabel: local.backup.returnValue,
                    columns: 2,
                    defaults:{width:80,height:20},
                    vertical: true,
                    items :[
						{ boxLabel: '200', id: '200', inputValue: '200' },
						{ boxLabel: '403', id: '403', inputValue: '403' }
                    ],
                    listeners : {
            			change : function(checkbox,newValue,oldValue,eOpts){
            				Ext.getCmp("editSaveButtonScript").setDisabled(true);
            				Ext.getCmp("testEditImitateButton").setDisabled(false);
            			}
            			
            		}
            	},{
            		xtype: 'checkboxgroup',
                	id : 'editFailedReturn',
                	fieldLabel: local.backup.returnValue,
                    columns: 2,
                    defaults:{width:80,height:20},
                    vertical: true,
                    items :[
						{ boxLabel: '301', id: '301', inputValue: '301' },
						{ boxLabel: '302', id: '302', inputValue: '302' },
						{ boxLabel: '400', id: '400', inputValue: '400' },
						{ boxLabel: '401', id: '401', inputValue: '401' },
						{ boxLabel: '404', id: '404', inputValue: '404' },
						{ boxLabel: '500', id: '500', inputValue: '500' },
						{ boxLabel: '503', id: '503', inputValue: '503' },
						{ boxLabel: local.backup.others, id: 'other', inputValue: 'other' }
                    ],
                    listeners : {
            			change : function(checkbox,newValue,oldValue,eOpts){
            				Ext.getCmp("editSaveButtonScript").setDisabled(true);
            				Ext.getCmp("testEditImitateButton").setDisabled(false);
            			}
            			
            		}
            	},{
            		xtype: 'checkboxgroup',
                	id : 'editSuccessDBReturn',
                	fieldLabel: local.backup.returnValue,
                    columns: 2,
                    defaults:{width:80,height:20},
                    vertical: true,
                    disabled: true,
                    items :[
						{ boxLabel: 'success', id: 'success', inputValue: 'success', checked: true }
                    ],
                    listeners : {
            			change : function(checkbox,newValue,oldValue,eOpts){
            				Ext.getCmp("editSaveButtonScript").setDisabled(true);
            				Ext.getCmp("testEditImitateButton").setDisabled(false);
            			}
            			
            		}
            	},{
            		xtype: 'checkboxgroup',
                	id : 'editFailedDBReturn',
                	fieldLabel: local.backup.returnValue,
                    columns: 2,
                    defaults:{width:80,height:20},
                    vertical: true,
                    disabled: true,
                    items :[
						{ boxLabel: 'failed', id: 'failed', inputValue: 'failed', checked: true }
                    ],
                    listeners : {
            			change : function(checkbox,newValue,oldValue,eOpts){
            				Ext.getCmp("editSaveButtonScript").setDisabled(true);
            				Ext.getCmp("testEditImitateButton").setDisabled(false);
            			}
            			
            		}
            	}]
            }]
		}]
	},{
			xtype : 'panel',
			region : 'south',
			width : '100%',
			border : false,
			style:'background:#fafbfc;border-top:1px solid #d1dade;padding:20px',
			bodyStyle:'background:#fafbfc',
			defaults : {
				style : 'margin-left:10px'
			},
			alias : 'widget.configbuttonfirst',
			layout : 'hbox',
			items : [{
				xtype : 'button',
				text : local.backup.mockTest,
				id : 'testEditImitateButton'/*,
				handler : function() {
					var bool = true;
					if(bool){
						Ext.MessageBox.alert(local.window.tip,local.backup.mockTestSuccess);
						Ext.getCmp("editSaveButtonScript").setDisabled(false);
					}
				}*/
			},{
				flex : 1,
				border : false
			}, {
				xtype : 'button',
				text : local.btn.save,
				cls:"btn_focus",
				id : 'editSaveButtonScript',
				disabled : true
			}, {
				xtype : 'button',
				text : local.btn.cancle,
				id : 'editCancelButton',
				handler : function() {
					Ext.getCmp('editMonitorConfigWindow').destroy();
				}
			}]
	}],
	listeners:{
		destroy:function(){
			chkMockMonitorList();
		}
	}
});

/**
 * 检测 模拟监控中的条数，如果为0，保存按钮无法点按
 */
function chkMockMonitorList(){
	// 检测 模拟监控中的条数，如果为0，保存按钮无法点按
	var grid = Ext.getCmp("imitateGrid");
	if(typeof grid === "undefined") {
		return ;
	}
	var dataCount = Ext.getCmp("imitateGrid").getStore().getTotalCount();
	if (0 == dataCount) {
		// 置灰保存按钮
		Ext.getCmp("minitorSaveButton").setDisabled(true);
	} else {
		// 置亮保存按钮
		Ext.getCmp("minitorSaveButton").setDisabled(false);
	}
}

//模拟监控：http，预警级别
Ext.define("websure.backup.view.EditHttpLevelWarningConfigPanel", {
	extend : 'Ext.form.Panel',
	alias : 'widget.editHttpLevelWarningConfigPanel',
	border : false,
	items : [{
		xtype : "combobox",
		fieldLabel : local.backup.warningClass,
		style:'margin-top:10px;',
		id:'scriptWarningLevel',
		name : 'serWarningConfig.scriptWarningLevel',
		store : new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : [/*[local.warn, '3'],*/
					[local.defaulty, 2],
					[local.normal, 1]]
		}),
		displayField : "value",
		valueField : "text",
		queryMode : "local",
		editable:false,
		forceSelection : true,
		typeAhead : true,
		listeners:{
			select:function(value,record){
				if(value.value == 1){//正常
					//返回值
					Ext.getCmp("editSuccessReturn").show();
					Ext.getCmp("editFailedReturn").hide();
					Ext.getCmp("editSuccessDBReturn").hide();
					Ext.getCmp("editFailedDBReturn").hide();
					
					Ext.getCmp("editSaveButtonScript").setDisabled(true);
					Ext.getCmp("testEditImitateButton").setDisabled(false);
				}else{
					//返回值
					Ext.getCmp("editSuccessReturn").hide();
					Ext.getCmp("editFailedReturn").show();
					Ext.getCmp("editSuccessDBReturn").hide();
					Ext.getCmp("editFailedDBReturn").hide();
					
					Ext.getCmp("editSaveButtonScript").setDisabled(true);
					Ext.getCmp("testEditImitateButton").setDisabled(false);
				}
			}
		}
	}]
});

//模拟监控：数据库，预警级别
Ext.define("websure.backup.view.EditDBLevelWarningConfigPanel", {
	extend : 'Ext.form.Panel',
	alias : 'widget.editDBLevelWarningConfigPanel',
	border : false,
	items : [{
		xtype : "combobox",
		fieldLabel : local.backup.warningClass,
		style:'margin-top:10px;',
		id:'scriptWarningLevel',
		name : 'serWarningConfig.scriptWarningLevel',
		store : new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : [/*[local.warn, '3'],*/
					[local.defaulty, 2],
					[local.normal, 1]]
		}),
		displayField : "value",
		valueField : "text",
		queryMode : "local",
		editable:false,
		forceSelection : true,
		typeAhead : true,
		listeners : {
			select:function(value,record){
				if(value.value == 1){//正常
					//返回值
					Ext.getCmp("editSuccessReturn").hide();
					Ext.getCmp("editFailedReturn").hide();
					Ext.getCmp("editSuccessDBReturn").show();
					Ext.getCmp("editFailedDBReturn").hide();
					
					Ext.getCmp("editSaveButtonScript").setDisabled(true);
					Ext.getCmp("testEditImitateButton").setDisabled(false);
				}else{
					//返回值
					Ext.getCmp("editSuccessReturn").hide();
					Ext.getCmp("editFailedReturn").hide();
					Ext.getCmp("editSuccessDBReturn").hide();
					Ext.getCmp("editFailedDBReturn").show();
					
					Ext.getCmp("editSaveButtonScript").setDisabled(true);
					Ext.getCmp("testEditImitateButton").setDisabled(false);
				}
			}
		}
	}]
});

//模拟监控：自定义脚本，预警级别
Ext.define("websure.backup.view.EditScriptLevelWarningConfigPanel", {
	extend : 'Ext.form.Panel',
	alias : 'widget.editScriptLevelWarningConfigPanel',
	border : false,
	items : [{
		xtype : "combobox",
		fieldLabel : local.backup.warningClass,
		style:'margin-top:10px;',
		id : 'scriptWarningLevel',
		name : 'serWarningConfig.scriptWarningLevel',
		store : new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : [[local.warn, 3],
					[local.defaulty, 2],
					[local.normal, 1]]
		}),
		displayField : "value",
		valueField : "text",
		queryMode : "local",
		editable:false,
		forceSelection : true,
		typeAhead : true
	}]
});

//HTTP请求
Ext.define("websure.backup.view.EditHttpWarningConfigPanel", {
	extend : 'Ext.form.Panel',
	alias : 'widget.editHttpWarningConfigPanel',
	id : 'editHttpWarningConfigPanel',
	border : false,
	items: [{
		xtype :'textfield',
		id : 'scriptWarningServerName',
		name: 'serWarningConfig.scriptWarningServerName',
		hidden:true
    },{
    	xtype :'textfield',
    	id : 'scriptWarningServerText',
    	name: 'serWarningConfig.scriptWarningServerText',
    	hidden:true
    },{
		xtype :'textareafield',
        fieldLabel: 'URL'+local.address, 
        id : 'scriptWarningUrl',
        name: 'serWarningConfig.scriptWarningUrl',
        maxLength: 200,//最多字符设置
        maxLengthText:local.backup.maxLengthText,
        allowBlank : false,
        listeners : {
			change : function(checkbox,newValue,oldValue,eOpts){
				Ext.getCmp("editSaveButtonScript").setDisabled(true);
				Ext.getCmp("testEditImitateButton").setDisabled(false);
			}
			
		}
	}]
});

//数据库访问
Ext.define("websure.backup.view.EditDBWarningConfigPanel", {
	extend : 'Ext.form.Panel',
	alias : 'widget.editDBWarningConfigPanel',
	id : 'editDBWarningConfigPanel',
	border : false,
	items: [{
		xtype :'textfield',
		id : 'scriptWarningServerName',
		name: 'serWarningConfig.scriptWarningServerName',
		hidden:true
    },{
    	xtype :'textfield',
    	id : 'scriptWarningServerText',
    	name: 'serWarningConfig.scriptWarningServerText',
    	hidden:true
    },{
		xtype : "combobox",
		fieldLabel : local.backup.database,
		id : 'scriptWarninDB',
		name : 'serWarningConfig.scriptWarninDB',
		store : new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : [['My Sql', 1],
					['Oracle', 2]/*,
					['Sql Server', 3]*/]
		}),
		displayField : "value",
		valueField : "text",
		queryMode : "local",
		forceSelection : true,
		typeAhead : true,
		editable:false,
		readOnly : true,
		emptyText:local.backup.choose,
		listeners:{
			select:function(value,record){
				var dbType = value.value;
				var dbTypePanel = Ext.getCmp("editScriptWarningDBPanel");
				dbTypePanel.removeAll();
				if(dbType == 1){
					dbTypePanel.add({
						xtype : 'editScriptMysqlDBPanel'
					});
				}else if(dbType == 2){
					dbTypePanel.add({
						xtype : 'editScriptOracleDBPanel'
					});
				}
			}
		}
    },{
    	xtype : "combobox",
		fieldLabel : local.backup.driveType,
		id : 'scriptWarninSystem',
		name :'serWarningConfig.scriptWarninSystem',
		store : new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : [/*['Windows', 1],*/
					['Linux', 2]]
		}),
		displayField : "value",
		valueField : "text",
		queryMode : "local",
		forceSelection : true,
		typeAhead : true,
		editable:false,
		emptyText:local.backup.choose
    },{
    	id : 'editScriptWarningDBPanel',
    	border : false/*,
    	xtype : 'editScriptMysqlDBPanel'*/
	},{
		xtype :'textfield',
        fieldLabel: local.backup.dbUserName,  
        id : 'scriptWarninUserName',
        name: 'serWarningConfig.scriptWarninUserName',
        maxLength: 100,//最多字符设置
        maxLengthText: local.backup.maxLengthText100,
        regex : /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
        regexText : local.backup.inputTrueUsername,
        allowBlank : false,
        listeners : {
			change : function(checkbox,newValue,oldValue,eOpts){
				Ext.getCmp("editSaveButtonScript").setDisabled(true);
				Ext.getCmp("testEditImitateButton").setDisabled(false);
			}
			
		}
	},{
		xtype :'textfield',
        fieldLabel: local.backup.password,  
        inputType: 'password',
        id : 'scriptWarninUserPwd',
        name: 'serWarningConfig.scriptWarninUserPwd',
        maxLength: 100,//最多字符设置
        maxLengthText: local.backup.maxLengthText100,
        allowBlank : false,
        listeners : {
			change : function(checkbox,newValue,oldValue,eOpts){
				Ext.getCmp("editSaveButtonScript").setDisabled(true);
				Ext.getCmp("testEditImitateButton").setDisabled(false);
			}
			
		}
	},{
		xtype :'textfield',
        fieldLabel: local.backup.installPath, 
        id : 'scriptWarninInstallPath',
        name: 'serWarningConfig.scriptWarninInstallPath',
        maxLength: 200,//最多字符设置
        maxLengthText: local.backup.maxLengthText,
        allowBlank : false,
        listeners : {
			change : function(checkbox,newValue,oldValue,eOpts){
				Ext.getCmp("editSaveButtonScript").setDisabled(true);
				Ext.getCmp("testEditImitateButton").setDisabled(false);
			}
			
		}
	}]
});

//Mysql数据库名+数据库表
Ext.define("websure.backup.view.EditScriptWarningMysqlDBPanel", {
	extend : 'Ext.form.Panel',
	alias : 'widget.editScriptMysqlDBPanel',
	id : 'editScriptMysqlDBPanel',
	border : false,
	items:[{
		xtype :'textfield',
        fieldLabel: local.backup.databaseName,  
        id : 'scriptWarninDBName',
        name :'serWarningConfig.scriptWarninDBName',
        maxLength: 200,//最多字符设置
        maxLengthText: local.backup.maxLengthText,
        regex : /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
        regexText : local.backup.inputTureDBName,
        allowBlank : false,
        listeners : {
			change : function(checkbox,newValue,oldValue,eOpts){
				Ext.getCmp("editSaveButtonScript").setDisabled(true);
				Ext.getCmp("testEditImitateButton").setDisabled(false);
			}
			
		}
	},{
		xtype :'textfield',
        fieldLabel: local.backup.databaseTable, 
        id : 'scriptWarninDBTable',
        value : 'test',
        hidden : true
        /*name: 'serWarningConfig.scriptWarninDBTable',
        maxLength: 200,//最多字符设置
        maxLengthText:local.backup.maxLengthText,
        listeners : {
			change : function(checkbox,newValue,oldValue,eOpts){
				Ext.getCmp("editSaveButtonScript").setDisabled(true);
				Ext.getCmp("testEditImitateButton").setDisabled(false);
			}
			
		}*/
	},{
		xtype :'textfield',
        fieldLabel: local.config.port,  
        id : 'scriptWarninDBPort',
        name: 'serWarningConfig.scriptWarninDBPort',
        allowBlank : false,
        listeners : {
			change : function(checkbox,newValue,oldValue,eOpts){
				Ext.getCmp("editSaveButtonScript").setDisabled(true);
				Ext.getCmp("testEditImitateButton").setDisabled(false);
			}
			
		}
	}]
	
});

//Oracle实例名+表空间（数据库名+数据库表）
Ext.define("websure.backup.view.EditScriptWarningOracleDBPanel", {
	extend : 'Ext.form.Panel',
	alias : 'widget.editScriptOracleDBPanel',
	id : 'editScriptOracleDBPanel',
	border : false,
	items:[{
		xtype :'textfield',
        fieldLabel: local.backup.databaseInstance,  
        id : 'scriptWarninDBName',
        name :'serWarningConfig.scriptWarninDBName',
        maxLength: 200,//最多字符设置
        maxLengthText: local.backup.maxLengthText,
        regex : /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
        regexText : local.backup.inputTureDBOName,
        allowBlank : false,
        listeners : {
			change : function(checkbox,newValue,oldValue,eOpts){
				Ext.getCmp("editSaveButtonScript").setDisabled(true);
				Ext.getCmp("testEditImitateButton").setDisabled(false);
			}
			
		}
	},{
		xtype :'textfield',
        fieldLabel: local.backup.databaseSpace, 
        id : 'scriptWarninDBTable',
        name: 'serWarningConfig.scriptWarninDBTable',
        maxLength: 200,//最多字符设置
        maxLengthText: local.backup.maxLengthText,
        regex : /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
        regexText : local.backup.inputTureDBTableSpace,
        allowBlank : false,
        listeners : {
			change : function(checkbox,newValue,oldValue,eOpts){
				Ext.getCmp("editSaveButtonScript").setDisabled(true);
				Ext.getCmp("testEditImitateButton").setDisabled(false);
			}
			
		}
	},{
		xtype :'textfield',
        fieldLabel: local.config.port,  
        id : 'scriptWarninDBPort',
        value : 1521,
        hidden : true
	}]
});


//自定义脚本 
Ext.define("websure.backup.view.EditScriptWarningConfigPanel", {
	extend : 'Ext.form.Panel',
	alias : 'widget.editScriptWarningConfigPanel',
	id : 'editScriptWarningConfigPanel',
	border : false,
	items: [{
		xtype : 'panel',
    	width : '100%',
    	border : false,
    	layout: 'hbox',
    	items: [{
    		xtype :'textfield',
        	id:'scriptName',
        	name: 'serWarningConfig.scriptName', 
        	hidden:true
    	},{
    		xtype : 'label',
    		text : local.backup.scriptFile+'：',
    		width:105
    	},{
    		width:150,
    		xtype : 'textfield',
    		id : 'scriptWarningServerName',
            name: 'serWarningConfig.scriptWarningServerName',
    		style:'margin-right:10px;',
    		readOnly : true/*,
    		listeners : {
    			change : function(checkbox,newValue,oldValue,eOpts){
    				Ext.getCmp("scriptWarninInstallPath").setValue("");
    			}
    		}*/
		},{
			xtype : 'button',
			cls:"ie8 btn_padding_left btn_left_posi",
			border:false,
			style:"background:none;"/*,
			html : '<span class="btn_text_underline">'+local.backup.loadingPath+'</span>'*/
			
			/*xtype : 'button',
			cls:"ie8 btn_padding_left btn_left_posi",
			border:false,
			style :"background:none;",
			html : '<span class="btn_text_underline">'+local.backup.uploading+'</span>',
			handler : function() {
				Ext.create('websure.backup.view.EditScriptWarningConfigField').show();
			}*/
    	}]
	},{
		xtype : 'textfield',
		fieldLabel : local.backup.uploadingScriptSrc,
		id : 'scriptWarninInstallPath',
        name: 'serWarningConfig.scriptWarninInstallPath',
		style:'margin-right:10px;',
		readOnly : true
	},{
		xtype :'textfield',
        fieldLabel: local.backup.returnValue, 
        id :'scriptWarningReturnValue',
        name: 'serWarningConfig.scriptWarningReturnValue',
        maxLength: 200,//最多字符设置
        maxLengthText: local.backup.maxLengthText,
        allowBlank : false,
        regex : /^[a-zA-Z@0-9]+$/,
        regexText : local.backup.inputTrueReturnValue,
        listeners : {
			change : function(checkbox,newValue,oldValue,eOpts){
				Ext.getCmp("editSaveButtonScript").setDisabled(true);
				Ext.getCmp("testEditImitateButton").setDisabled(false);
			}
			
		}
	}]
});

//上传文件
Ext.define("websure.backup.view.EditScriptWarningConfigField", {
		extend : 'Ext.window.Window',
		alias : 'widget.editScriptWarningConfigField',
		title : local.backup.editWarningConfigWinTitleEdit,
		draggable : false,
		height : 210,
		width : 450,
		closable : true,
		id : 'editScriptWarningConfigField',
		layout : "border",    //窗口布局类型
		modal : true,    //是否模态窗口，默认为false
		resizable : false,
		items:[{
			xtype : 'form',
			region : 'center',
			id : 'editScriptFormPanel',
			style : 'background:#fff;border-left:1px solid #d1dade;',
			border : false,
			items : [{
				xtype: 'filefield',
		        id : 'scriptText',
		        name : 'scriptText',
		        fieldLabel: local.backup.scriptFile,
		        style : 'margin-top:20px;',
		        msgTarget: 'side',
		        allowBlank: false,
		        anchor: '100%',
		        buttonText: local.backup.glanceOver,
		        validator: function(value){
		        	var arr = value.split('.');
		        	//获得后缀名
		        	var result =/\.[^\.]+/.exec(value);
		        	if(result == ".sh" || result == ".bat"){
		        		return true;
		        	}else if(result != null){
		        		//文件类型错误!
		        		Ext.MessageBox.alert(local.window.tip, local.backup.fileTypeError);
		        		return false;
		        	}
		        }
			}]
		},{
			xtype : 'panel',
			region : 'south',
			width : '100%',
			border : false,
			style:'background:#fafbfc;border-top:1px solid #d1dade;padding:20px',
			bodyStyle:'background:#fafbfc',
			defaults : {
				style : 'margin-left:10px'
			},
			alias : 'widget.scriptFieldPanel',
			layout : 'hbox',
			items : [{
				flex : 1,
				border : false
			}, {
				xtype : 'button',
				text : local.btn.save,
				id : 'editFieldSaveButtonScript',
				handler : function(){
					var scriptText = Ext.getCmp("scriptText").getValue();
					//判断是否上传文件
					if(scriptText == ''){
						Ext.MessageBox.alert(local.window.tip,local.backup.uploadingChoose);
						return false;
					}else{
						 //取控件DOM对象   
					    var field = document.getElementById('scriptText');  
					    //取控件中的input元素   
					    var inputs = field.getElementsByTagName('input');  
					    var fileInput = null;  
					    var il = inputs.length;  
					    //取出input 类型为file的元素   
					    for(var i = 0; i < il; i ++){  
					        if(inputs[i].type == 'file'){  
					            fileInput = inputs[i];  
					            break;  
					        }  
					    }  
						var file_size = getFileSize(fileInput);
						if(file_size > 2){
							//文件大小超过限制,请重新上传文件!
							Ext.MessageBox.alert(local.window.tip, local.backup.fileSizeError);
							return false;
						}
					}
					scriptText = scriptText.substring(scriptText.lastIndexOf("\\") + 1);
					
					Ext.getCmp('editScriptFormPanel').getForm().submit({  
						url : '/backup/tomonitorAction!findWarningConfigField.action',
						waitMsg: local.backup.uploadingFileing,  
						params : {
							scriptText : scriptText,
							deviceMac : warnDeviceMac
						},
                        success: function(form, action) {
                        	var obj = action.result.msg;
        					if(obj == "1"){    //文件上传成功
        						Ext.getCmp("scriptWarningServerName").setValue(scriptText);
        						Ext.getCmp('editScriptWarningConfigField').destroy();
        						//修改文件，需要重新模拟测试
        						Ext.getCmp("editSaveButtonScript").setDisabled(true);
        					}else if(obj == "2"){    //文件已存在
        						Ext.MessageBox.alert(local.window.tip, local.backup.uploadingFileFailue);
        					}
                        }  
                    });  
				}
			}, {
				xtype : 'button',
				text : local.btn.cancle,
				id : 'editFieldCancelButton',
				handler : function() {
					Ext.getCmp('editScriptWarningConfigField').destroy();
				}
			}]
	}]
});

//计算文件大小，返回文件大小值，单位MB  
function getFileSize(target){  
    var isIE = /msie/i.test(navigator.userAgent) && !window.opera;  
    var fs = 0;  
    if (isIE && !target.files) {  
        var filePath = target.value;  
        var fileSystem = new ActiveXObject("Scripting.FileSystemObject");  
        var file = fileSystem.GetFile (filePath);  
        fs = file.Size;   
    }else if(target.files && target.files.length > 0){  
        fs = target.files[0].size;  
    }else{  
        fs = 0;  
    }  
    if(fs > 0){  
        fs = fs /(1024*1024);  
    }  
    return fs;  
} 