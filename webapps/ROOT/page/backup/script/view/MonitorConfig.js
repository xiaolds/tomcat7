warnDeviceId = null;
warnDeviceMac = null;
warnDeviceStatus = null;
minitorCurrentPanel = 1;
licenseWarningSystem = null;
licenseWarningDB = null;
licenseWarningUrl = null;
licenseWarningScript = null;


/*
 * 预警配置弹出窗口
 */
Ext.define("websure.backup.view.MonitorConfig", {
	extend : 'Ext.window.Window',
	alias : 'widget.monitorConfigWindow',
	title : local.backup.diskWarnConfig,
	draggable : false,
	height : 600,
	width : 700,
	closable : true,
	cls : 'config',
	layout:"vbox",
	id : 'MonitorConfigWindow',
	modal : true,    //是否模态窗口，默认为false
	resizable : false,
	constructor : function(config) {
		var me = this;
		warnDeviceId = config.parId;
		warnDeviceMac = config.parMac;
		warnDeviceStatus = config.parStatus;
		licenseWarningSystem = config.licenseWarningSystem;
		licenseWarningDB = config.licenseWarningDB;
		licenseWarningUrl = config.licenseWarningUrl;
		licenseWarningScript = config.licenseWarningScript;
		
		me.items = [{
				xtype:'tabpanel',
				cls:'verticaltab verticalTab',
				width:"100%",
				flex:1,
				tabBar : {
					width : 130,
					minTabWidth : 95,
					maxTabWidth : 95,
					height : 80,
					orientation : 'top'// vertical
				},
				tabPosition : 'left',// 竖形排列
				border:false,
				bodyStyle:'border:0;border-left:1px solid #eef2f4;',
				id:"monitorConfigTabpanel",
				plain:true,
				activeTab:0,
				items : [{
					title : local.backup.propertyMonitor,
					xtype : "capabilityWarningConfig",	// 性能预警
					iconCls:"monitorIcon",
					icon:"/images/common/pc_online_one.png",
					border:false
				}, {
					title : local.backup.mockMonitor,	// 业务预警
					xtype : "imitateWarningScript",
					iconCls:"monitorIcon",
					icon:"/images/backup/snap.png",
					border:false
				}]
			},{
			xtype : 'panel',
			width : '100%',
			height:70,
			border : false,
			style:'background:#fafbfc;border-top:1px solid #d1dade;padding:20px 20px 0 0',
			bodyStyle:'background:#fafbfc',
			defaults : {
				style : 'margin-left:10px'
			},
			alias : 'widget.configbuttonfirst',
			layout : 'hbox',
			items : [
			         {flex:1,border:false},
			         {
						xtype : 'button',
						text : local.btn.save,
						cls:"btn_focus",
						id : 'minitorSaveButton'	//TODO save Button
			         },{
			        	xtype : 'button',
			        	text : local.btn.cancle,
			        	id : 'minitorCancelButton',
			        	handler : function() {
			        		minitorCurrentPanel = 1;
			        		Ext.getCmp('MonitorConfigWindow').destroy();
					
							//重新加载，模拟监控列表
							Ext.getCmp("serviceMonitor").store.load({
								params : {
									deviceId : selectDeviceId
								}
							});
			        	}
			         }]
			}];
		me.callParent(arguments);
	},
	listeners : {
		'close' : function(){
			minitorCurrentPanel = 1;
			Ext.getCmp('MonitorConfigWindow').destroy();
			
			//重新加载，模拟监控列表
			Ext.getCmp("serviceMonitor").store.load({
				params : {
					deviceId : selectDeviceId
				}
			});
  		}
	}
});


//性能监控
Ext.define("websure.backup.view.CapabilityWarningConfig",{
	extend : 'Ext.panel.Panel',
	alias : 'widget.capabilityWarningConfig',
	id : 'capabilityWarningConfig',
	width : '100%',
    border : false,
    padding:20,
	items:[{
		xtype : 'intervalWarningConfigPanel'	// 检测频率、持续时间滑动条
	},{
		xtype: 'hdwWarningConfigPanel'			// 硬件性能预警配置滑动条
	}],
    listeners: {
    	afterrender : function(){
    		Ext.Ajax.request({
				url : '/backup/tomonitorAction!findHdwAndInfoWarningConfig.action',
				params : {
					warnDeviceId : warnDeviceId,
					configModelId : 1
				},
				success : function(response, options) {
					var obj = Ext.decode(response.responseText);
					//检测频率
					var intervalSlider = document.getElementById("intervalSlider");
					//持续时间
					var contIntervalSlider = document.getElementById("contIntervalSlider");
					getContIntervalSliderSliderValue(contIntervalSlider);	// TODO
//					getIntervalSliderSliderValue(intervalSlider);
					
					//configState  1.启动 2.关闭
					if(typeof(obj.info[0]) != "undefined"){
						//检测频率值
						var intervalSliderValue = obj.info[0].warningConfigInfo.configRunTimeInterval;
						//检测频率单位
						var intervalSliderUnit = obj.info[0].warningConfigInfo.configRunTimeIntervalUnit;
						if(intervalSliderUnit == 2){    //小时
							intervalSliderValue = (intervalSliderValue*2-2) + 60;
						}
						
//						intervalSlider.value = intervalSliderValue;
						getIntervalSliderSliderValue("#intervalSlider",{
							'value':intervalSliderValue
						});
						
						$("#intervalSlider").slider(
							"value",intervalSliderValue
						);
						
						//持续时间值
//						contIntervalSlider.value = obj.info[0].warningConfigInfo.configContRunTimeInterval;
//						getContIntervalSliderSliderValue(contIntervalSlider);
						
					}
					
					var cpuValue = "";
					var memValue = "";
					var netValue = "";
					var diskValue = "";
					
					if(obj.info == '' || obj.info == null){
						cpuValue = document.getElementById("cupMultislider").value;
						memValue = document.getElementById("memMultislider").value;
						netValue = document.getElementById("netMultislider").value;
						diskValue = document.getElementById("diskMultislider").value;
						//检查频率
						getIntervalSliderSliderValue(intervalSlider);
						//持续时间滑动条
						getContIntervalSliderSliderValue(contIntervalSlider);
					}else{
						for(var i = 0; i < obj.info.length; i++){
							if(obj.info[i].hdwWarningLevel == 1){    //正常
								if(obj.info[i].hdwWarningType == 1){    //cpu
									cpuValue = obj.info[i].hdwWarningThreshold + ";";
								}else if(obj.info[i].hdwWarningType == 2){    //mem
									memValue = obj.info[i].hdwWarningThreshold + ";";
								}else if(obj.info[i].hdwWarningType == 3){    //net
									netValue = obj.info[i].hdwWarningThreshold + ";";
								}else if(obj.info[i].hdwWarningType == 4){    //disk
									diskValue = obj.info[i].hdwWarningThreshold + ";";
								}
							}else{    //故障
								if(obj.info[i].hdwWarningType == 1){    //cpu
									cpuValue = cpuValue + obj.info[i].hdwWarningThreshold;
								}else if(obj.info[i].hdwWarningType == 2){    //mem
									memValue = memValue + obj.info[i].hdwWarningThreshold;
								}else if(obj.info[i].hdwWarningType == 3){    //net
									netValue = netValue + obj.info[i].hdwWarningThreshold;
								}else if(obj.info[i].hdwWarningType == 4){    //disk
									diskValue = diskValue + obj.info[i].hdwWarningThreshold;
								}
							}
						}
					}
					
					//cpu
					var cpuMultislider = document.getElementById("cupMultislider");
					document.getElementById("cupMultislider").value = cpuValue;
					getSliderValue(cpuMultislider);
					//mem
					var memMultislider = document.getElementById("memMultislider");
					document.getElementById("memMultislider").value = memValue;
					getSliderValue(memMultislider);
					//net
					var netMultislider = document.getElementById("netMultislider");
					document.getElementById("netMultislider").value = netValue;
					getSliderValue(netMultislider);
					//disk
					var diskMultislider = document.getElementById("diskMultislider");
					document.getElementById("diskMultislider").value = diskValue;
					getSliderValue(diskMultislider);
					
				},    //success   end
				failure : function() {
//					Ext.MessageBox.alert(local.window.tip,local.backup.dataMatchFailure);
					Ext.websure.MsgError("WF-30034",local.backup.dataMatchFailure);
				}
			});
    	},
		beforeshow : function() {
			//判断性能监控是否授权，0：未授权，1：已授权
			if(licenseWarningSystem == 0){
				Ext.getCmp("minitorSaveButton").setDisabled(true);
			}else{
				Ext.getCmp("minitorSaveButton").setDisabled(false);
			}
			minitorCurrentPanel = 1;
		}
    }
});

/*
 * 预警配置，持续时间、检查频率 TODO
 */
Ext.define("websure.backup.view.IntervalWarningConfigPanel",{
	extend : 'Ext.panel.Panel',
	alias : 'widget.intervalWarningConfigPanel',
	id : 'intervalWarningConfigPanel',
	border : false,
	layout:"vbox",
    width:'100%',
	items:[{
		xtype : 'panel',
		id :'capabilityPanel',
		border : false,
		layout: 'hbox',
		items : [{
			xtype : 'label',
	    	width: 120,
	    	height: 50,
	    	padding:"10 0 0 0",
	    	html:local.backup.rateTest+':'	// 检测频率
		},{
			width:360,
			height:50,
			border:false,
			html:'<span class="bar_color2" style="display: inline-block; width: 360px;padding-top:10px "><input id="intervalSlider" type="slider" value="10"/></span>'
		}]
	},{
		xtype : 'panel',
		id :'runTimeIntervalPanel',
		border: false,
		layout: 'hbox',
		items : [{
			xtype : 'label',
	    	width: 120,
	    	height: 50,
	    	padding:"10 0 0 0",
	    	html:local.backup.runTimeInterval+':'	// 持续时间
		},{
			width:360,
			height:50,
			disabled:true,
			border:false,
			disabled:true,
			html:'<span class="bar_color2" style="display: inline-block; width: 360px;padding-top:10px "><input id="contIntervalSlider" type="slider" value="10"/></span>'
		}]
	}]
});

/*
 * 检查频率滑动条的值
 */
function getIntervalSliderSliderValue(sliderId, setting){
	// 合并参数
	var preConfig = { 
			from: 1, 
			to: 20, 
			step: 1, 
			limits: false,
			smooth: true, 
			round: 0, 
			dimension: "&nbsp;"+local.m,
//			calculate: function(value){
//				return value;
//			},
	        onstatechange: function(value){
	            $( "#contIntervalSlider" ).slider( "value", value*3 );
	        }
	};
	
	var config = jQuery.extend(preConfig, setting);
	jQuery(sliderId).slider(config);
}
/*function getIntervalSliderSliderValue2(sliderId){
	jQuery(sliderId).slider({ 
		from: 1, 
		to: 20, 
		step: 1, 
		limits: false,
		smooth: true, 
		round: 0, 
		dimension: "&nbsp;"+local.m,
        onstatechange: function(value){
        }
	});
}*/
/*
 * 持续时间滑动条的值
 */
function getContIntervalSliderSliderValue(sliderId){
	jQuery(sliderId).slider({ 
		from: 1, 
        to: 60,
        step: 1, 
        limits: false,
        smooth: true, 
        readonly:true,
        disabled:false,
        round: 0, 
        dimension: "&nbsp;"+local.m,
        calculate:function(value){
        	return value;
        }
	});
}

//使用率
Ext.define("websure.backup.view.HdwWarningConfigPanel",{
	extend : 'Ext.panel.Panel',
	alias : 'widget.hdwWarningConfigPanel',
	id : 'hdwWarningConfigPanel',
	width : '100%',
	layout:'column',
	height:270,
	border: false,
    items:[{
    	xtype : 'label',
    	width: 120,
    	height: 50,
    	padding:"10 0 0 0",
    	html:local.backup.usageCpu+':'
    },{
    	width:360,
    	height:50,
    	border:false,
    	html:'<span style="display: inline-block; width: 360px;padding-top:10px "><input id="cupMultislider" type="slider" value="60;90"/></span>'
    },{
    	xtype : 'label',
    	width: 120,
    	height: 50,
    	padding:"10 0 0 0",
    	html:local.backup.usageMemory+':'
    },{
    	width:360,
    	height:50,
    	border:false,
    	html:'<span style="display: inline-block; width: 360px;padding-top:10px "><input id="memMultislider" type="slider" name="price" value="60;90" /></span>'
    },{
    	xtype : 'label',
    	width: 120,
    	height: 50,
    	padding:"10 0 0 0",
    	html:local.backup.usageWeb+':'
    },{
    	width:360,
    	height:50,
    	border:false,
    	html:'<span style="display: inline-block; width: 360px;padding-top:10px "><input id="netMultislider" type="slider" name="price" value="60;90" /></span>'
    },{
    	xtype : 'label',
    	width: 120,
    	height: 50,
    	padding:"10 0 0 0",
    	html:local.backup.usageDisk+':'
    },{
    	width:360,
    	height:50,
    	border:false,
    	html:'<span style="display: inline-block; width: 360px;padding-top:10px "><input id="diskMultislider" type="slider" name="price" value="60;90" /></span>'
    },{
    	xtype:'button',
		border:false,
		cls:'ie8 btn_pad_left',
		textAlign :'left',
		style : 'background:none;margin-top: 20px;',
	    html:'<span class="btn_text_underline">'+local.backup.defaultValue+'</span>',
	    handler : function() {
	    	var capabilityWarningConfig = Ext.getCmp("capabilityWarningConfig");
	    	capabilityWarningConfig.removeAll();
	    	capabilityWarningConfig.add({
	    		xtype : 'intervalWarningConfigPanel'
	    	},{
	    		xtype : 'hdwWarningConfigPanel'
	    	});
	    	capabilityWarningConfig.doLayout();
	    	
	    	$( "#intervalSlider" ).slider( {from: 1, 
	    		to: 20,value:10,limits: false,
	    		smooth: true, 
	    		onstatechange: function(value){
	    			$( "#contIntervalSlider" ).slider({from: 1, 
	    	    		to:60, vlaue:30,limits: false,
	    	    		smooth: true} );
	                $( "#contIntervalSlider" ).slider( "value", value*3 );
	                }} );
	    	
	    	getIntervalSliderSliderValue("intervalSlider");
	    	
	    	//cpu
	    	var cpuSlider = document.getElementById("cupMultislider");
	    	cpuSlider.value = "60;90";
	    	getSliderValue(cpuSlider);
	    	//mem
	    	var memMultislider = document.getElementById("memMultislider");
	    	memMultislider.value = "60;90";
	    	getSliderValue(memMultislider);
	    	//net
	    	var netMultislider = document.getElementById("netMultislider");
	    	netMultislider.value = "60;90";
	    	getSliderValue(netMultislider);
	    	//disk
	    	var diskMultislider = document.getElementById("diskMultislider");
	    	netMultislider.value = "60;90";
	    	getSliderValue(diskMultislider);
	    	
		}
    }]
});

/*
 * 获取硬件信息滑动条的值
 */
function getSliderValue(sliderId){
	jQuery(sliderId).slider({ 
		from: 1, 
        to: 100, 
        step: 1, 
        limits: false,
        smooth: true, 
        round: 0, 
        dimension: "&nbsp;%",
        onstatechange: function(value){
	        var arr = value.split(';');
	        var parent = jQuery(sliderId).parent();    //不同的silder只需要替换这一个就行
	        parent.find('.jslider .jslider-bg .l').width(arr[0]+'%');
	        parent.find('.jslider .jslider-bg .r').css('left',arr[1]+"%").width((100-arr[1])+'%');
	        
	        var leftText=parent.find('.jslider .jslider-bg .l i');
	        var rightText=parent.find('.jslider .jslider-bg .r i');
	        var middleText=parent.find('.jslider .jslider-bg .v i');
	        var p=parent.find('.jslider .jslider-pointer');
	        
	        if(leftText.width()<'25'){
	        	leftText.html("");
	        }else{
	        	leftText.html(local.normal);
	        }
	        if(rightText.width()<'25'){
	        	rightText.html("");
	        }else{
	        	rightText.html(local.defaulty);
	        }
	        if(middleText.width()<'25'){
	        	middleText.html("");
	        }else{
	        	middleText.html(local.warn);
	        }
        }
	});
}

//模拟监控
Ext.define("websure.backup.view.ImitateWarningScript",{
	extend : 'Ext.panel.Panel',
	alias : 'widget.imitateWarningScript',
	id : 'imitateWarningScript',
	border: false,
	items:[{
		xtype: 'imitateGrid'
    },{
    	xtype:'button',
		border:false,
		width:80,
		cls:'ie8',
		textAlign :'left',
		style : 'background:none;',
	    html:'<span class="btn_text_underline">+'+local.btn.new0+'</span>',
	    handler : function() {
			Ext.create('websure.backup.view.AddMonitorConfigWindow').show();
		}
    }],
	listeners: {
		beforeshow : function() {
			//判断业务监控是否授权，0：未授权，1：已授权
			if(licenseWarningUrl == 0 && licenseWarningDB == 0 && licenseWarningScript == 0){
				Ext.getCmp("minitorSaveButton").setDisabled(true);
			}else{
				Ext.getCmp("minitorSaveButton").setDisabled(false);
			}
			minitorCurrentPanel = 2;
			chkMockMonitorList();
		}
	}
});

/**
 * 检测 模拟监控中的条数，如果为0，保存按钮无法点按 TODO
 */
function chkMockMonitorList(){
	// 检测 模拟监控中的条数，如果为0，保存按钮无法点按
	var grid = Ext.getCmp("imitateGrid");
	if(typeof grid === "undefined") {
		return ;
	}
	var dataCount = Ext.getCmp("imitateGrid").getStore().getTotalCount();	// TODO 返回的值不对
//	var dataCount = Ext.getCmp("imitateGrid").getStore().getCount();	// TODO 返回的值不对
	console.debug("dataCount", dataCount);
	if (0 == dataCount) {
		// 置灰保存按钮
		Ext.getCmp("minitorSaveButton").setDisabled(true);
	} else {
		// 置亮保存按钮
		Ext.getCmp("minitorSaveButton").setDisabled(false);
	}
}

//模拟监控表格信息
Ext.define('websure.backup.view.ImitateGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.imitateGrid',
	id : 'imitateGrid',
	width:'100%',
	height:400,
	border:false,
	enableColumnResize:false,
	style:"border-bottom:1px solid #DBE0E2",
	plugins:[  
        Ext.create('Ext.grid.plugin.CellEditing',{  
        	clicksToEdit:1 //设置单击单元格编辑  
        })  
    ], 
	store: 'ImitateStore',
    columns: [
        { header: 'scriptWarningId',  menuDisabled:true,dataIndex: 'scriptWarningId', hideable: false, hidden: true },
        { header: 'configState',  menuDisabled:true,dataIndex: 'configState', hideable: false, hidden: true },
        { header: 'configRunTimeIntervalUnit',  menuDisabled:true,dataIndex: 'configRunTimeIntervalUnit', hideable: false, hidden: true },
        { header: local.name, flex:2, menuDisabled:true,dataIndex: 'scriptWarningName'},
        { header: local.type, flex:1,menuDisabled:true,dataIndex: 'scriptWarningServerType',
        	renderer : function(v) {
				if (v == 1) {
					return "URL";
				} else if (v == 2){
					return local.backup.database;
				}else if (v == 3){
					return local.backup.script;
				}
			}
        },
        /*{ header: local.backup.rate, menuDisabled:true,dataIndex: 'configRunTimeInterval',
        	renderer : function(v,m,record,ri,ci) {
        		//频率单位
        		var unit = record.get('configRunTimeIntervalUnit');
        		if(unit == 1){
        			return v+local.dayEverytime;
        		}else if(unit == 2){
        			return v+local.hourEverytime;
        		}else if(unit == 3){
        			return v+local.mEverytime;
        		}else {
        			return v+local.sEverytime;
        		}
        		
			}
        },*/
        { header: local.backup.warningClass, menuDisabled:true,flex:1,dataIndex: 'scriptWarningLevel',
        	align: 'center',
        	/*editor: { 
        		xtype:'combobox',
        		editable:false,
        		store : new Ext.data.SimpleStore({
					fields : ['value', 'text'],
					data : [[1, local.normal], [2, local.defaulty],[3, local.warn]]
				}),
				displayField : "text",    //显示的
				valueField : "value",    //需要提交的值
				forceSelection : true,
				typeAhead : true,
				editable: false,
				listeners:{
					select:function(value,record){
						var scriptWarningId;
						var scriptWarningLevel = value.value;
						var grid = Ext.getCmp("imitateGrid");
						var store = Ext.getCmp("imitateGrid").getStore();
						var rows = grid.getSelectionModel().getSelection();// 返回值为 Record 数组 
						for(i = 0;i < rows.length; i++){
							scriptWarningId = rows[i].get("scriptWarningId");
						}
						
						//修改预警级别
						Ext.Ajax.request({
							url : '/backup/tomonitorAction!updateServerWarningConfigById.action',
							params : {
								"serWarningConfig.scriptWarningId" : scriptWarningId,
								"serWarningConfig.scriptWarningLevel" : scriptWarningLevel
							},
							success : function(response, options) {
								var obj = Ext.decode(response.responseText);
							}
						});
						
					}
				}
        	},*/
        	renderer:function(v) {  
        		if (v == 1) {
					return local.normal;
				} else if (v == 2){
					return local.defaulty;
				}else if (v == 3){
					return local.warn;
				}
            }  
        },
        {
        	menuDisabled:true,
        	xtype : 'actioncolumn',
        	flex:1,
			text : local.emergency.gridHander,
			dataIndex : 'id',
			tdCls : 'action',
			menuText : local.emergency.gridHander,    //viewConfig,列的显示值
			flex:1,
			items : [{
				action : 'edit',
				align: 'center',
				icon : '/images/common/edit.png',
				tooltip : local.btn.modify,
				handler : function(grid,rowIndex, colIndex,node, e, record, rowEl) {
					this.fireEvent('itemclick',this, grid,rowIndex, colIndex,node, e, record,rowEl);
				}
			},
			{
				icon : '',
				tooltip : ''
			},{
				icon : '',
				tooltip : ''
			},
			{
				action : 'delete',
				align: 'center',
				icon : '/images/common/delete.png',
				tooltip : local.btn.delete0,
				handler : function(grid,rowIndex, colIndex,node, e, record, rowEl) {
					this.fireEvent('itemclick',this, grid,rowIndex, colIndex,node, e, record,rowEl);
				}
			}]
        }
    ],
    listeners : {
		"afterrender" : function(){
			Ext.getCmp("imitateGrid").store.load({
    			params : {
    				deviceId : warnDeviceId,
    				"warningConfigInfo.configModelId" : 2
    			}
    		});
		}
		/*"columnschanged":function(ct, eOpts){//TODO
			chkMockMonitorList();
			alert("columnschanged");
		},
		"columnshow":function(){
			chkMockMonitorList();
			alert("columnshow");
		},
		"columnhide":function(){
			chkMockMonitorList();
			alert("columnhide");
		}*/
		/*"cellclick":function(){
			alert("cellclick");
		},*/
		/*"add":function(){
			chkMockMonitorList();
			console.debug("add", this);
		},
		"remove":function(){
			chkMockMonitorList();
			alert("remove");
		}*/
		/*"columnschanged":function(ct, eOpts){//TODO
			chkMockMonitorList();
			alert("columnschanged");
		},
		"columnshow":function(){
			chkMockMonitorList();
			alert("columnshow");
		},
		"columnhide":function(){
			chkMockMonitorList();
			alert("columnhide");
		}*/
		/*"cellclick":function(){
			alert("cellclick");
		},*/
		/*"add":function(){
			chkMockMonitorList();
			console.debug("add", this);
		},
		"remove":function(){
			chkMockMonitorList();
			alert("remove");
		}*/
    }
});

/*
 * 业务监控，新增Window
 */
Ext.define("websure.backup.view.AddMonitorConfigWindow", {
	extend : 'Ext.window.Window',
	alias : 'widget.addMonitorConfigWindow',
	title : local.backup.AddMockMonitor,
	draggable : false,
	height : 530,
	width : 415,
	closable : true,
	id : 'addMonitorConfigWindow',
	layout : "border",    //窗口布局类型
	modal : true,    //是否模态窗口，默认为false
	resizable : false,
	items:[{
		xtype : 'form',
		region : 'center',
		id : 'addMonitorPanel',
		cls:"addMonitorPanel",
		style : 'background:#fff;border-left:1px solid #d1dade;',
		border : false,
		items : [{
			xtype:'panel',
			width: '100%',
			border : false,
			style : 'margin-left:30px;margin-top:10px;',
			
            items: [{ 
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
                store: 'WarningServerTypeStore',
                /*store: new Ext.data.SimpleStore({  
                    fields: ['value', 'text'],  
                    data: [  
                        [local.backup.httpAsk, 1],  
                        [local.backup.databaseAccess, 2],
                        [local.backup.customScript, 3]
                    ]  
                }),*/
                editable:false,
                displayField: 'text',  
                valueField: 'value', 
                queryMode : 'local',
                value : '1',
                listeners:{
					select:function(value,record){
						var serverType = value.value;
						var levelWarningConfig = Ext.getCmp("levelWarningConfigPanelId");
						var serverTypePanel = Ext.getCmp("serverTypePanel");
						serverTypePanel.removeAll();
						levelWarningConfig.removeAll();
						if(serverType == 1){
							serverTypePanel.add({
								xtype : 'httpWarningConfigPanel'
							});
							//预警级别，http或数据库
							levelWarningConfig.add({
								xtype : 'httpLevelWarningConfigPanel'
							});
							
							//返回值
							Ext.getCmp("successReturn").show();
							Ext.getCmp("failedReturn").hide();
							Ext.getCmp("successDBReturn").hide();
							Ext.getCmp("failedDBReturn").hide();
							
							//让保存按钮暂时失效
							Ext.getCmp("addSaveButtonScript").setDisabled(true);
							Ext.getCmp("testImitateButton").setDisabled(false);
						}else if(serverType == 2){
							serverTypePanel.add({
								xtype : 'dBWarningConfigPanel'
							});
							//预警级别，http或数据库
							levelWarningConfig.add({
								xtype : 'dbLevelWarningConfigPanel'
							});
							
							//返回值
							Ext.getCmp("successReturn").hide();
							Ext.getCmp("failedReturn").hide();
							Ext.getCmp("successDBReturn").show();
							Ext.getCmp("failedDBReturn").hide();
							
							//让保存按钮暂时失效
							Ext.getCmp("addSaveButtonScript").setDisabled(true);
							Ext.getCmp("testImitateButton").setDisabled(false);
						}else{
							serverTypePanel.add({
								xtype : 'scriptWarningConfigPanel'
							});
							//预警级别，自定义脚本
							levelWarningConfig.add({
								xtype : 'scriptLevelWarningConfigPanel'
							});
							
							//判断该机器为Windows还是Linu,设置不同的后缀
							var type_store = Ext.getCmp("scriptWarningServerType").getStore();
							//linux
							if(type_store.data.length == 3){
								Ext.getCmp("scriptUrlSuffixId").update(".sh");
							}else{//windows
								Ext.getCmp("scriptUrlSuffixId").update(".bat");
							}
							
							Ext.MessageBox.alert(local.window.tip, local.backup.scriptPointOutMsg);
							
							//返回值
							Ext.getCmp("successReturn").hide();
							Ext.getCmp("failedReturn").hide();
							Ext.getCmp("successDBReturn").hide();
							Ext.getCmp("failedDBReturn").hide();
							
							//让保存按钮暂时失效
							Ext.getCmp("addSaveButtonScript").setDisabled(true);
							Ext.getCmp("testImitateButton").setDisabled(false);
						}
					}
				}
            },{
            	id :'serverTypePanel',
            	xtype : 'httpWarningConfigPanel',
            	border : false
            },{
            	xtype : 'panel',
            	width : '100%',
            	border : false,
            	//style:'margin-top:20px;',
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
                	html:'<span style="display: inline-block; width: 200px;"><input id="scriptInterSlider" type="slider" value="10" /></span>',
            		listeners : {
            			'afterrender' : function() {
            				//设置默认值为10
            				var scriptInterSlider = document.getElementById("scriptInterSlider");
            				scriptInterSlider.value = 10;
            	    		getIntervalSliderSliderValue(scriptInterSlider);
            			}
            		}
            	}]
            },{
            	id : 'levelWarningConfigPanelId',
            	border : false,
				xtype : 'httpLevelWarningConfigPanel'
            },{
            	xtype : 'panel',
            	width : '100%',
    			border : false,
            	items : [{
            		xtype: 'checkboxgroup',
                	id : 'successReturn',
                	fieldLabel: local.backup.returnValue,
                    columns: 2,
                    defaults:{width:80,height:20},
                    vertical: true,
                    items :[
						{ boxLabel: '200', itemId: '200', inputValue: '200', checked: true },
						{ boxLabel: '403', itemId: '403', inputValue: '403', checked: true }
                    ],
                    listeners : {
            			change : function(checkbox,newValue,oldValue,eOpts){
            				Ext.getCmp("addSaveButtonScript").setDisabled(true);
            				Ext.getCmp("testImitateButton").setDisabled(false);
            			}
            			
            		}
            	},{
            		xtype: 'checkboxgroup',
                	id : 'failedReturn',
                	fieldLabel: local.backup.returnValue,
                    columns: 2,
                    defaults:{width:80,height:20},
                    vertical: true,
                    items :[
						{ boxLabel: '301', itemId: '301', inputValue: '301', checked: true },
						{ boxLabel: '302', itemId: '302', inputValue: '302', checked: true },
						{ boxLabel: '400', itemId: '400', inputValue: '400', checked: true },
						{ boxLabel: '401', itemId: '401', inputValue: '401', checked: true },
						{ boxLabel: '404', itemId: '404', inputValue: '404', checked: true },
						{ boxLabel: '500', itemId: '500', inputValue: '500', checked: true },
						{ boxLabel: '503', itemId: '503', inputValue: '503', checked: true },
						{ boxLabel: local.backup.others, itemId: 'other', inputValue: 'other' }
                    ],
                    listeners : {
            			change : function(checkbox,newValue,oldValue,eOpts){
            				Ext.getCmp("addSaveButtonScript").setDisabled(true);
            				Ext.getCmp("testImitateButton").setDisabled(false);
            			}
            			
            		}
            	},{
            		xtype: 'checkboxgroup',
                	id : 'successDBReturn',
                	fieldLabel: local.backup.returnValue,
                    columns: 2,
                    defaults:{width:100,height:20},
                    vertical: true,
                    disabled: true,
                    items :[
						{ boxLabel: 'success', inputValue: 'success', checked: true }
                    ],
                    listeners : {
            			change : function(checkbox,newValue,oldValue,eOpts){
            				Ext.getCmp("addSaveButtonScript").setDisabled(true);
            				Ext.getCmp("testImitateButton").setDisabled(false);
            			}
            			
            		}
            	},{
            		xtype: 'checkboxgroup',
                	id : 'failedDBReturn',
                	fieldLabel: local.backup.returnValue,
                    columns: 2,
                    vertical: true,
                    defaults:{width:100,height:40},
                    disabled: true,
                    items :[
						{ boxLabel: 'failed', inputValue: 'failed', checked: true }
                    ],
                    listeners : {
            			change : function(checkbox,newValue,oldValue,eOpts){
            				Ext.getCmp("addSaveButtonScript").setDisabled(true);
            				Ext.getCmp("testImitateButton").setDisabled(false);
            			}
            			
            		}
            	}]
            }],
        	listeners : {
        		"beforerender" : function(){
        			//返回值
        			Ext.getCmp("successReturn").show();
					Ext.getCmp("failedReturn").hide();
					Ext.getCmp("successDBReturn").hide();
					Ext.getCmp("failedDBReturn").hide();
					
        			Ext.getCmp("scriptWarningServerType").store.load({
        				params : {
        					deviceId : warnDeviceId
        				}
        			});
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
			alias : 'widget.configbuttonfirst',
			layout : 'hbox',
			items : [{
				xtype : 'button',
				text : local.backup.mockTest,
				id : 'testImitateButton'/*,
				handler : function() {
					var bool = true;
					if(bool){
						Ext.MessageBox.alert(local.window.tip,"验证成功!");
						Ext.getCmp("addSaveButtonScript").setDisabled(false);
					}
				}*/
			},{
				flex : 1,
				border : false
			}, {
				xtype : 'button',
				text : local.btn.save,
				cls:"btn_focus", 
				id : 'addSaveButtonScript',
				disabled : true
			}, {
				xtype : 'button',
				text : local.btn.cancle,
				id : 'addCancelButton',
				handler : function() {
					Ext.getCmp('addMonitorConfigWindow').destroy();
				}
			}]
	}]
});

//模拟监控：http，预警设置
Ext.define("websure.backup.view.HttpLevelWarningConfigPanel", {
	extend : 'Ext.form.Panel',
	alias : 'widget.httpLevelWarningConfigPanel',
	border : false,
	items : [{
		xtype : "combobox",
		fieldLabel : local.backup.warningClass,
		//style:'margin-top:10px;',
		id : 'scriptWarningLevel',
		name : 'serWarningConfig.scriptWarningLevel',
		store : new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : [/*[local.warn, 3],*/
			        [local.defaulty, 2],
			        [local.normal, 1]]
		}),
		displayField : "value",
		valueField : "text",
		queryMode : "local",
		forceSelection : true,
		typeAhead : true,
		editable:false,
		value : 1, // 默认选中
		listeners:{
			select:function(value,record){
				if(value.value == 1){//正常
					Ext.getCmp("successReturn").show();
					Ext.getCmp("failedReturn").hide();
					Ext.getCmp("successDBReturn").hide();
					Ext.getCmp("failedDBReturn").hide();
					
					Ext.getCmp("addSaveButtonScript").setDisabled(true);
					Ext.getCmp("testImitateButton").setDisabled(false);
				}else{
					Ext.getCmp("successReturn").hide();
					Ext.getCmp("failedReturn").show();
					Ext.getCmp("successDBReturn").hide();
					Ext.getCmp("failedDBReturn").hide();
					
					Ext.getCmp("addSaveButtonScript").setDisabled(true);
					Ext.getCmp("testImitateButton").setDisabled(false);
				}
			}
		}
	}]
});

//模拟监控：数据库，预警设置
Ext.define("websure.backup.view.DBLevelWarningConfigPanel", {
	extend : 'Ext.form.Panel',
	alias : 'widget.dbLevelWarningConfigPanel',
	border : false,
	items : [{
		xtype : "combobox",
		fieldLabel : local.backup.warningClass,
		//style:'margin-top:10px;',
		id : 'scriptWarningLevel',
		name : 'serWarningConfig.scriptWarningLevel',
		store : new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : [/*[local.warn, 3],*/
			        [local.defaulty, 2],
			        [local.normal, 1]]
		}),
		displayField : "value",
		valueField : "text",
		queryMode : "local",
		forceSelection : true,
		typeAhead : true,
		editable:false,
		value : 1, // 默认选中
		listeners:{
			select:function(value,record){
				if(value.value == 1){//正常
					Ext.getCmp("successReturn").hide();
					Ext.getCmp("failedReturn").hide();
					Ext.getCmp("successDBReturn").show();
					Ext.getCmp("failedDBReturn").hide();
					
					Ext.getCmp("addSaveButtonScript").setDisabled(true);
					Ext.getCmp("testImitateButton").setDisabled(false);
				}else{
					Ext.getCmp("successReturn").hide();
					Ext.getCmp("failedReturn").hide();
					Ext.getCmp("successDBReturn").hide();
					Ext.getCmp("failedDBReturn").show();
					
					Ext.getCmp("addSaveButtonScript").setDisabled(true);
					Ext.getCmp("testImitateButton").setDisabled(false);
				}
			}
		}
	}]
});

//模拟监控：自定义脚本，预警级别
Ext.define("websure.backup.view.ScriptLevelWarningConfigPanel", {
	extend : 'Ext.form.Panel',
	alias : 'widget.scriptLevelWarningConfigPanel',
	border : false,
	items : [{
		xtype : "combobox",
		fieldLabel : local.backup.warningClass,
		style:'margin-top:10px;',
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
		forceSelection : true,
		typeAhead : true,
		editable:false,
		value : 1 // 默认选中
	}]
});

//HTTP请求
Ext.define("websure.backup.view.HttpWarningConfigPanel", {
	extend : 'Ext.form.Panel',
	alias : 'widget.httpWarningConfigPanel',
	id : 'httpWarningConfigPanel',
	border : false,
	items: [{
		xtype :'textareafield',
        fieldLabel: 'URL'+local.address, 
        id : 'scriptWarningUrl',
        name: 'serWarningConfig.scriptWarningUrl',
        maxLength: 200,//最多字符设置
        maxLengthText:local.backup.maxLengthText,
        allowBlank : false,
        listeners : {
			change : function(checkbox,newValue,oldValue,eOpts){
				Ext.getCmp("addSaveButtonScript").setDisabled(true);
				Ext.getCmp("testImitateButton").setDisabled(false);
			}
			
		}
	}]
});

//数据库访问
Ext.define("websure.backup.view.DBWarningConfigPanel", {
	extend : 'Ext.form.Panel',
	alias : 'widget.dBWarningConfigPanel',
	id : 'dBWarningConfigPanel',
	border : false,
	items: [{
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
		value : 1,
		listeners:{
			select:function(value,record){
				var dbType = value.value;
				var dbTypePanel = Ext.getCmp("scriptWarningDBPanel");
				dbTypePanel.removeAll();
				if(dbType == 1){
					dbTypePanel.add({
						xtype : 'scriptWarningMysqlDBPanel'
					});
				}else if(dbType == 2){
					dbTypePanel.add({
						xtype : 'scriptWarningOracleDBPanel'
					});
				}
			}
		}
    },{
    	xtype : "combobox",
		fieldLabel : local.backup.systemType,
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
		value : 2
		/*emptyText:local.backup.choose*/
    },{
		id : 'scriptWarningDBPanel',
    	xtype : 'scriptWarningMysqlDBPanel',
    	listeners : {
			change : function(checkbox,newValue,oldValue,eOpts){
				Ext.getCmp("addSaveButtonScript").setDisabled(true);
				Ext.getCmp("testImitateButton").setDisabled(false);
			}
			
		}
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
				Ext.getCmp("addSaveButtonScript").setDisabled(true);
				Ext.getCmp("testImitateButton").setDisabled(false);
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
				Ext.getCmp("addSaveButtonScript").setDisabled(true);
				Ext.getCmp("testImitateButton").setDisabled(false);
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
				Ext.getCmp("addSaveButtonScript").setDisabled(true);
				Ext.getCmp("testImitateButton").setDisabled(false);
			}
			
		}
	}]
});

//Mysql数据库名+数据库表
Ext.define("websure.backup.view.ScriptWarningMysqlDBPanel", {
	extend : 'Ext.form.Panel',
	alias : 'widget.scriptWarningMysqlDBPanel',
	id : 'scriptWarningMysqlDBPanel',
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
				Ext.getCmp("addSaveButtonScript").setDisabled(true);
				Ext.getCmp("testImitateButton").setDisabled(false);
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
        maxLengthText: local.backup.maxLengthText,
        listeners : {
			change : function(checkbox,newValue,oldValue,eOpts){
				Ext.getCmp("addSaveButtonScript").setDisabled(true);
				Ext.getCmp("testImitateButton").setDisabled(false);
			}
			
		}*/
	},{
		xtype :'numberfield',
        fieldLabel: local.config.port,  
        id : 'scriptWarninDBPort',
		hideTrigger : true,	//隐藏微调按钮
		allowDecimals : false,	//不允许输入小数
		nanText : local.recovery.tipNumM,
		maxValue : 10000,	 // 最大值
		minValue : 1,	// 最小值
        name: 'serWarningConfig.scriptWarninDBPort',
        allowBlank : false,
        listeners : {
			change : function(checkbox,newValue,oldValue,eOpts){
				Ext.getCmp("addSaveButtonScript").setDisabled(true);
				Ext.getCmp("testImitateButton").setDisabled(false);
			}
			
		}
	}]
	
});

//Oracle实例名+表空间（数据库名+数据库表）
Ext.define("websure.backup.view.ScriptWarningOracleDBPanel", {
	extend : 'Ext.form.Panel',
	alias : 'widget.scriptWarningOracleDBPanel',
	id : 'scriptWarningOracleDBPanel',
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
				Ext.getCmp("addSaveButtonScript").setDisabled(true);
				Ext.getCmp("testImitateButton").setDisabled(false);
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
        regexText : local.backup.inputTrueDBTableSpace,
        allowBlank : false,
        listeners : {
			change : function(checkbox,newValue,oldValue,eOpts){
				Ext.getCmp("addSaveButtonScript").setDisabled(true);
				Ext.getCmp("testImitateButton").setDisabled(false);
			}
			
		}
	},{
		xtype :'numberfield',
        fieldLabel: local.config.port,  
        id : 'scriptWarninDBPort',
        value : 1521,
        hidden : true
	}]
});

//自定义脚本 
Ext.define("websure.backup.view.ScriptWarningConfigPanel", {
	extend : 'Ext.form.Panel',
	alias : 'widget.scriptWarningConfigPanel',
	id : 'scriptWarningConfigPanel',
	border : false,
	items: [{
		xtype : 'panel',
    	width : '100%',
    	border : false,
    	layout: 'hbox',
    	items: [{
    		xtype : 'label',
    		style:"display:block;margin-top:3px;",
    		text : local.backup.scriptFile+'：',
    		width:105
    	},{
    		//width:105,
    		xtype : 'textfield',
    		id : 'scriptWarningServerName',
            name: 'serWarningConfig.scriptWarningServerName',
            regex : /^([a-z]|[A-Z]|[0-9]|[-]){1,20}$/,
    		style:'margin-right:10px;',
    		allowBlank : false,
    		/*readOnly : true,*/
    		listeners : {
    			change : function(checkbox,newValue,oldValue,eOpts){
    				Ext.getCmp("scriptWarninInstallPath").setValue("");
    				Ext.getCmp("addSaveButtonScript").setDisabled(true);
    				Ext.getCmp("testImitateButton").setDisabled(false);
    			}
    		}
		},{
			xtype : 'label',
			style:"display:block;margin-top:3px;",
			id :"scriptUrlSuffixId",
    		html : "",
    		width: 30
		},{
			xtype : 'button',
			margin:"-4 0 0 0",
			cls:"ie8 btn_padding_left btn_left_posi",
			border:false,
			style:"background:none;",
			html : '<span class="btn_text_underline">'+local.backup.loadingPath+'</span>',
			handler : function() {
				var server_name = Ext.getCmp("scriptWarningServerName").getValue();
				if(server_name == null || server_name == ''){
					Ext.MessageBox.alert(local.window.tip, local.backup.inputUpScript)
					return false;
				}else{
					//文件名验证
					var strRegex = '^([a-z]|[A-Z]|[0-9]|[-]){1,20}$'; 
					var re = new RegExp(strRegex);
					if (!re.test(server_name)) { 
						Ext.MessageBox.alert(local.window.tip,local.backup.inputTrueUpScript);
						return false; 
					}else{
						if(server_name.indexOf("urlL") == 0 
							|| server_name.indexOf("urlW") == 0
							|| server_name.indexOf("mysqlL") == 0
							|| server_name.indexOf("oracleL") == 0 ){
							
							Ext.MessageBox.alert(local.window.tip,local.backup.inputScriptNameUnusable);
							return false; 
						}
					}
				}
				
				//遮罩层
				var loadMarsk = new Ext.LoadMask("addMonitorConfigWindow", {    
				    msg:local.backup.getPathingLoading,    
				    removeMask:true // 完成后移除    
				}); 
				loadMarsk.show();
				
				//根据设备和脚本名，获取脚本路径
				Ext.Ajax.request({
					url : '/backup/tomonitorAction!findWarningEmptyScriptName.action',
					timeout: 100000, 
					params : {
						warnDeviceId : warnDeviceId,
						warnDeviceMac : warnDeviceMac,
						serverName : server_name
					},
					success : function(response, options) {
						loadMarsk.hide();
						var obj = Ext.decode(response.responseText);
						
						if(obj.msgCode == MSG_NORMAL){//30000
							Ext.getCmp("scriptWarninInstallPath").setValue(obj.msgContent);
						}else{
							showResultDialog(obj.msgCode, obj.msgContent);
							Ext.getCmp("scriptWarninInstallPath").setValue("");
						}
					}
				});
				
			}
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
				Ext.getCmp("addSaveButtonScript").setDisabled(true);
				Ext.getCmp("testImitateButton").setDisabled(false);
			}
			
		}
	}]
});

/*
 * 表格输入框验证
 */
function validateValue(){
	//监控名称
	var warningName = Ext.getCmp("scriptWarningName").getValue();
	//监控类型
	var serverType = Ext.getCmp("scriptWarningServerType").getValue();
	//频率
	//var timeInterval = Ext.getCmp("configRunTimeInterval").getValue();
	
	if(warningName == "" || warningName == null){
		Ext.MessageBox.alert(local.window.tip,local.backup.inputMonitorName);
		return false;
	}
	
	if(serverType == 1){    //http访问
		var scriptWarningUrl = Ext.getCmp("scriptWarningUrl").getValue();
		if(scriptWarningUrl == "" || scriptWarningUrl == null){
			Ext.MessageBox.alert(local.window.tip,local.backup.inputURLAdress);
			return false;
		}else if(scriptWarningUrl != "" && scriptWarningUrl != null){
			//url验证
			var strRegex = '^((https|http|ftp|rtsp|mms)?://)' 
				+ '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@ 
				+ '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184 
				+ '|' // 允许IP和DOMAIN（域名） 
				+ '([0-9a-z_!~*\'()-]+.)*' // 域名- www. 
				+ '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名 
				+ '[a-z]{2,6})' // first level domain- .com or .museum 
				+ '(:[0-9]{1,4})?' // 端口- :80 
				+ '((/?)|' // a slash isn't required if there is no file name 
				+ '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$'; 
			var re = new RegExp(strRegex);
			if (!re.test(scriptWarningUrl)) { 
				Ext.MessageBox.alert(local.window.tip,local.backup.inputURLAdressError);
				return false; 
			}
		}
	}else if(serverType == 2){    //数据库访问
		//数据库
		var warninDB = Ext.getCmp("scriptWarninDB").getValue();
		//系统类型
		var warninSystem = Ext.getCmp("scriptWarninSystem").getValue();
		//数据库名称
		var warninDBName = Ext.getCmp("scriptWarninDBName").getValue();
		//端口
		var warninDBPort = Ext.getCmp("scriptWarninDBPort").getValue();
		//数据表
		var warninDBTable = Ext.getCmp("scriptWarninDBTable").getValue();
		//用户名
		var warninUserName = Ext.getCmp("scriptWarninUserName").getValue();
		//密码
		var warninUserPwd = Ext.getCmp("scriptWarninUserPwd").getValue();
		//安装路径
		var installPath = Ext.getCmp("scriptWarninInstallPath").getValue();

		if(warninDB == "" || warninDB == null){
			Ext.MessageBox.alert(local.window.tip,local.backup.inputDB);
			return false;
		}
		if(warninSystem == "" || warninSystem == null){
			Ext.MessageBox.alert(local.window.tip,local.backup.inputSystemType);
			return false;
		}
		if(warninDBName == "" || warninDBName == null){
			if(warninDB == 1){
				Ext.MessageBox.alert(local.window.tip,local.backup.inputDBName);
			}else{
				Ext.MessageBox.alert(local.window.tip,local.backup.inputDBOName);
			}
			return false;
		}
		if(warninDB == 2){
			if(warninDBTable == "" || warninDBTable == null){
				Ext.MessageBox.alert(local.window.tip,local.backup.inputDBTableSpace);
				return false;
			}
		}
		if(warninDBPort == "" || warninDBPort == null){
			Ext.MessageBox.alert(local.window.tip,local.backup.inputPort);
			return false;
		}
		if(warninUserName == "" || warninUserName == null){
			Ext.MessageBox.alert(local.window.tip,local.backup.inputUsername);
			return false;
		}
		if(warninUserPwd == "" || warninUserPwd == null){
			Ext.MessageBox.alert(local.window.tip,local.backup.inputPassword);
			return false;
		}
		var reg =/\s/;
		if(installPath == "" || installPath == null){
			Ext.MessageBox.alert(local.window.tip,local.backup.inputInstallPath);
			return false;
		}else if(reg.test(installPath)){    //前后不能存在空格
			Ext.MessageBox.alert(local.window.tip,local.backup.inputTrueInstallPath);
			return false;
		}
		
	}else if(serverType == 3){    //自定义脚本
		//脚本名称
		var serverText = Ext.getCmp("scriptWarningServerName").getValue();
		//脚本路径
		var serverPath = Ext.getCmp("scriptWarninInstallPath").getValue();
		//返回值
		var returnValue = Ext.getCmp("scriptWarningReturnValue").getValue();
		
		if(serverText == "" || serverText == null){
			Ext.MessageBox.alert(local.window.tip,local.backup.inputUpScript);
			return false;
		}
		if(serverPath == "" || serverPath == null){
			Ext.MessageBox.alert(local.window.tip,local.backup.inputScriptPath);
			return false;
		}
		if(returnValue == "" || returnValue == null){
			Ext.MessageBox.alert(local.window.tip,local.backup.inputReturnValue);
			return false;
		}
	}
	
	/*if(timeInterval == "" || timeInterval == null){
		Ext.MessageBox.alert(local.window.tip,local.backup.inputRateTime);
		return false;
	}*/
	return true;
}

/*获得返回值*/
function getScriptWarningReturnValue(urlsReturn,urlfReturn,dbsReturn,dbfReturn){
	//服务类型 1.URL 2.数据库 3.脚本
	var serverType = Ext.getCmp('scriptWarningServerType').getValue();
	
	var returnValue = "";
	var hobbyValue = "";
	if(serverType == 1){
		//预警级别 , 1.正常 2.故障 3.警告
		var level = Ext.getCmp('scriptWarningLevel').getValue();
		if(level == 1){
			//获取选中值
			hobbyValue = Ext.getCmp(urlsReturn).getChecked();
		}else{
			//获取选中值
			hobbyValue = Ext.getCmp(urlfReturn).getChecked();
		}
	}else if(serverType == 2){
		//预警级别 , 1.正常 2.故障 3.警告
		var levelDB = Ext.getCmp('scriptWarningLevel').getValue();
		if(levelDB == 1){
			//获取选中值
			hobbyValue = Ext.getCmp(dbsReturn).getChecked();
		}else{
			//获取选中值
			hobbyValue = Ext.getCmp(dbfReturn).getChecked();
		}
	}
	
	if(hobbyValue == ""){
		Ext.MessageBox.alert(local.window.tip,local.backup.inputCheckReturnValue);
		return false;
	}
	
	//获取通过checkboxgroup定义的checkbox值
	for(var i = 0; i < hobbyValue.length; i++){
		if(i == hobbyValue.length - 1){
			if(hobbyValue[i].inputValue == "other"){
				returnValue += "303@304@305@306@402@403@405@407@415@501@502";
			}else{
				returnValue += hobbyValue[i].inputValue;
			}
		}else{
			returnValue += hobbyValue[i].inputValue + "@";
		}
	}
	return returnValue;
}