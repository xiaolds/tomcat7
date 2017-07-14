/*
 * 头部
 */
Ext.define("acesure.view.log.report.HeadToolbar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.headToolbar',
	padding:'0 0 0 25',
	height:108,
	style:'border:0;border-bottom:1px solid #d1dade;background:#fafbfc;',
	defaults:{bodyStyle:'background:#fafbfc'},
	items : [{
		 		xtype : "panel",
		 		border : false,
		 		width:48,
		 		height:42,
		 		html : '<img src="/images/log/report_system_title.png"/>'
	         }, {
		 		xtype : "panel",
		 		border : false,
		 		minWidth:300,
		 		id : 'entireHeadId',
		 		html : "<font class='font_h3'>"+local.log.defaultReport+"</font><br>"+local.log.title2+" "+local.log.title3+" "+local.log.title4
	         },"->",{
				xtype : "button",
				text : local.btn.refresh,
				style:'padding-left:26px',
				icon : '/images/common/refresh.png',
				handler : function() {
					var reportLogPanel = Ext.getCmp('reportLogPanel');
        		 	reportLogPanel.removeAll();
		  			reportLogPanel.add({
		  				xtype : 'entireReportList'
		  			});
				}
			}, {
				xtype: 'combobox',
		        width: 160,
		        labelWidth: 40,
		        fieldLabel: local.time, 
		        lableAlign: 'right',
				store : [[1,local.log.oneMonth],[2,local.log.threeMonth],[3,local.log.sixMonth],[4,local.log.oneYear],[5,local.recovery.tabAll]],
				valueField : 'type',
				editable : false,
				displayField : 'name',
				id: 'exportTimeId',
				emptyText:local.log.chTime,
				value : 1
			},{
				xtype : "button",
				text : local.btn.export0, 
				style:'padding-left:26px',
				icon : '/images/log/export.png',
				id : 'reportTimeExportId',
				itemId : 'reportlog_report_faultexport',
				handler: function(){
					Ext.getCmp('exportTimeId').setVisible(true);
					Ext.getCmp('reportTimeExportId').setVisible(false);
					Ext.getCmp('entireReportExportId').setVisible(true);
				}
			},{
				xtype : "button",
				text : local.btn.export0, 
				style:'padding-left:26px',
				icon : '/images/log/export.png',
				id : 'entireReportExportId'
			}, {
				xtype : "panel",
				id : 'entireReportShrink',
				border:false,
				width:56,
				margin:0,
				height:"100%",
				html: "<div class='shrink' onclick='fadeout();'><img src='/images/backup/shrink.png'/></div>"
			}],
			listeners:{
		    	afterrender:function(){
		    		Ext.getCmp('exportTimeId').setVisible(false);
		    		Ext.getCmp('entireReportExportId').setVisible(false);
		    		Ext.Ajax.request({
		    			url: '/syslog/toSystemEntire!findSystemEntireTopStatus.action',
						success : function(response, options) {
							var obj = Ext.decode(response.responseText);
							if(typeof(obj.details) != "undefined"){
								Ext.getCmp("entireHeadId").update("<font class='font_h3'>"+local.log.defaultReport+"</font><br>"+
										local.log.title2+obj.details.day+local.log.title3+obj.details.entireError+local.log.title4);
							}
						}
		    		})
		    	}
			}
});

//返回事件
function fadeout() {
	var reportLogPanel = Ext.getCmp('reportLogPanel');
	reportLogPanel.removeAll();
	reportLogPanel.add({
		xtype : 'logView'
	});
	reportLogPanel.doLayout();

}

Ext.define("acesure.view.report.EntireReportToolbar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.entireReportToolbar',
	id : 'entireReportToolbar',
	height: 50,
	padding:'16 25 0 25',
	border:false,
	items : [{
		xtype: 'combobox',
        width: 180,
        labelWidth: 40,
        fieldLabel: local.btn.show, 
        lableAlign: 'right',
		store : [['1',local.showByDevName],['2',local.showByIPName],['3',local.showByDevDescribleName]],
		valueField : 'type',
		editable : false,
		displayField : 'name',
		id: 'entireViewId',
		emptyText:local.log.disType,
		listeners:{
			select:function(value,record){
				logType = value.value;
				var entireReportTreePanelId = Ext.getCmp('entireReportTreePanelId');
				entireReportTreePanelId.removeAll();
				entireReportTreePanelId.add({
	  				xtype : 'entireReportCharTree'
	  			});
			}
		}
		
	}, "->" ,{
				xtype: 'combobox',
		        width: 160,
		        labelWidth: 40,
		        fieldLabel: local.time, 
		        lableAlign: 'right',
				store : [[1,local.log.defaults],[2,local.log.oneDay],[3,local.log.oneWeek],[4,local.log.halfMonth],[5,local.log.oneMonth],[6,local.log.custom]],
				valueField : 'type',
				editable : false,
				displayField : 'name',
				id: 'entireTimeId',
				emptyText:local.log.chTime,
				listeners:{
					select:function(value,record){
						var serverType = value.value;
						if(serverType == 6){
							 Ext.getCmp('entireReprotSeachTime').setVisible(true);
						}else{
							Ext.getCmp('entireReprotSeachTime').setVisible(false);
							Ext.getCmp('beginDateId').setValue();
							Ext.getCmp('endDateId').setValue();
							
						}
					}
				}
			},{
				xtype :'toolbar',
				id : 'entireReprotSeachTime',
				border : false,
				items : [{
					xtype: 'datefield',
					id : 'beginDateId',
	                width: 130,
	                format :'Y-m-d',
	                editable : false,
	                labelWidth: 40,
		             maxValue: new Date(),
		             minValue:new Date(new Date().getTime() - 365*86400000)
		 		}, ' - ', {
		 			xtype: 'datefield',
					id : 'endDateId',
	                width: 130,
	                format :'Y-m-d',
	                editable : false,
		             maxValue: new Date(),
		             minValue:new Date(new Date().getTime() - 365*86400000)
		 		}]
			},{
				xtype : "button",
				text : local.btn.inquire,
				id : 'searchEntireReportBut'
			}],
			listeners:{
		    	afterrender:function(){
		    		Ext.getCmp('entireReprotSeachTime').setVisible(false);
		    	}
		    }
});

/*
 * 统计图表
 */
Ext.define("acesure.view.log.report.EntireReportCharTree", {
	extend : 'Ext.panel.Panel',
	alias : 'widget.entireReportCharTree',
	id: 'entireReportCharTreeId',
	border : false,
	width : '100%',
	listeners:{
    	afterrender:function(){
			var entireReportCharTreeId = Ext.getCmp("entireReportCharTreeId");
			var ylength = 70;
			Ext.Ajax.request({
				url: '/syslog/toSystemEntire!findLogDevicesTree.action',
				params : {
					"logType" : logType
				},
				success: function (response) {
					var obj = eval("(" + response.responseText + ")").children;
					var cou = 0;
					for(var i = 0;i < obj.length;i++){
						if("createGroup" != obj[i].id && "createNewDevice" != obj[i].id){
							if(obj[i].children.length>0){
							entireReportCharTreeId.add({
								xtype : 'fieldset',
								id : 'fieldset'+obj[i].id,
								title :obj[i].text,
								border : "1 0 0 0",
								collapsible : true,
								style:'border-color:#e6e6e6;padding:10px 20px 20px 0;',
								margin:20,
								defaults : {
									anchor : '100%'
								},
								items : [{
									xtype : 'panel',
									id : 'panel'+obj[i].id,
									name : 'panel'+obj[i].id,
									width : '100%',
									height : '100%',
									layout : 'column',
			    					columns : 2,
			    					border : false
					    					
					    		}]
					 		});
				 		}
			 		}
					}
			 		for(var k = 0 ;k<obj.length; k++){
						var pannelgroup = Ext.getCmp("panel"+obj[k].id+"");
						if("createGroup" != obj[k].id && "createNewDevice" != obj[k].id){
						 	cou = cou+obj[k].children.length;
							for(var m = 0 ;m<obj[k].children.length; m++){
								var pan = new Ext.panel.Panel({ 
									id :'sonPanel'+obj[k].children[m].id,
									width : '100%',
									border : false,
									layout: {
										type: 'table',
										columns: 2    // 列数
									},
									defaults: {
										width:260,
										style:'cursor:pointer'
									},
									items :[{
								        id : 'gson'+obj[k].children[m].id,
								        bodyStyle: 'padding-top:14px',
								        border : false,
								        width:20,
								        height:34,
								        html: "<div><img src='/images/backup/pc_big_online_one.png' onclick=''/></div>",
							            listeners: {
							            	afterrender : function() {    //渲染后添加事件
						            			var sonPanel=this;
						            			var status = obj[k].children[m].status;    //设备状态 1-在线  2-不在线  0-新加入   3-正在备份
						            			var standby = obj[k].children[m].standby;    //设备是否双机  1:是双机 2：非双击
							            		if(1 == status){
					            					if(1 == standby){
					            						sonPanel.update("<div><img style='float:left;' src='/images/common/pc_online_two.png'></img></span></div>");
					            					}else{
					            						sonPanel.update("<div><img style='float:left;' src='/images/common/pc_online_one.png'></img></span></div>");
					            					}
						            			}else if(2 == status){
						            				if(1 == standby){
					            						sonPanel.update("<div><img style='float:left;' src='/images/common/pc_offline.png'></img></span></div>");
					            					}else{
					            						sonPanel.update("<div><img style='float:left;' src='/images/common/pc_offline_one.png'></img></span></div>");
					            					}
						            			}else if(0 == status){
						            				sonPanel.update("<div><img style='float:left;' src='/images/common/pc_message.png'></img></span></div>");
						            			}else{
						            				sonPanel.update("<div><img style='float:left;' src='/images/common/pc_error.png'></img></span></div>");
						            			};
						            		}
						            	}
								    },{
							            id:'sername'+obj[k].children[m].id,
							            border : false,
							            height:34,
							            bodyStyle: 'padding-top:10px;padding-right:20px;',
							            html : '<font class="font_h4" title="'+obj[k].children[m].text+'">'+obj[k].children[m].text+'</font>'
						       	 	},{
						       	 		colspan: 2,	
						       	 		border : false,
						       	 		height:200,
						       	 		id: 'scatter'+obj[k].children[m].id,
										listeners:{
											afterrender:function(){
												getScatterValue(obj[k].children[m].id,obj[k].children[m].text);
											}
										}
						        	}]
								});
								pannelgroup.add(pan);
							}
						}
					}
		 		}
	 		}) 
   		}
   }
	
});

//取图表点的值
function getScatterValue(deviceId,deviceName){
	var deviceChartId = Ext.getCmp("scatter"+deviceId);
	deviceChartId.add({
		html: '<div id="main'+deviceId + '"style="width:260px;height:170px;cursor:pointer;background:#fbfbfb url(\'/images/log/null.png\') no-repeat center center;"  onclick="getChartGrid(\''+deviceId +'\''+','+'\''+deviceName+'\''+');" ></div>',    //为ChartPie准备一个具备大小（宽高）的Dom
		id : "entire-scatter"+deviceId,
		border:false,
		height:190,
		bodyBorder:false,
		cls:"log_chart",
		listeners : {
	    	afterrender : function(){
	    		var beginDateId = Ext.getCmp("beginDateId").value;
	        	var endDateId = Ext.getCmp("endDateId").value;
	        	var entireTimeId = Ext.getCmp("entireTimeId").value;
	        	
	        	if(entireTimeId == 6){
	        		if(beginDateId == null && endDateId == null){
	        			Ext.MessageBox.alert(local.window.tip,local.log.chTime+local.mark);
	        			return false;
	        		}
	        	}
	        	
	    		Ext.Ajax.request({
            		method : 'post',
				    url: '/syslog/toSystemEntire!findScatterByDeviceId.action',
				    timeout: 10000,
				    params : {
						'deviceId':deviceId,
						"entireTimeId":entireTimeId,
				    	"beginDateId": beginDateId,
				    	"endDateId": endDateId
					},
				    success: function (response){
				    	var obj = Ext.decode(response.responseText);
	    	
						if(obj.scatterUp == null || typeof(obj.scatterUp) == "undefined" || obj.scatterUp == ''){
				    		return ;
				    	}else{
				    		for(var i = 0 ; i < obj.scatterUp.length; i++){
								var value = obj.scatterUp[i];
								
				    			// 基于准备好的dom，初始化echarts图表
							    var myChart = echarts.init(document.getElementById('main'+value.id),'macarons'); 
							    
							    var option = getScatterOption(value);
							    
								 //    为echarts对象加载数据 
							     myChart.setOption(option);
							     
				    			var deviceScatterId = Ext.getCmp("entire-scatter"+deviceId);
				    			deviceScatterId.add({
				    				border : false,
				    				cls:"log_chart_title",
				    				html: "<font style='color:#666;'>"+value.errorCount+local.log.aMistake+ value.warnCount +local.log.awarning+"</font>"
				    			});
				    			deviceScatterId.doLayout();
				    		}
				    	}
				    }
	    		});
	    		
	    	}
	    }					
	})
}

//获得点的图表
function getScatterOption(obj){
	var option = {
			backgroundColor:"#fff",
		    grid:{
	            x: 30,
	            y: 30,
	            x2: 0,
	            y2: 10,
	            backgroundColor: '#fff',
		  		borderWidth:0,
		  		borderColor:'#fff'
		    },
		    xAxis : [{
		    	type : 'value',
		   		max:100,
				splitArea : false, 
				splitLine : false,
		        axisLine : false,
		        axisLabel: false
			}],
		    yAxis : [{
		    	type : 'value',
		        max:100,
				splitArea : false,
				splitLine : false,
		        axisLine : false,
		        axisLabel: false
		    }],
		    //无数据 取消动画效果
		    noDataLoadingOption:{
	     		text: ' ',
	    		effect: 'bubble',
	    		effectOption : {
	   	 			effect: {
	     				n: 0
	      			}
	    		},
	    		textStyle: {    //字体大小
	    			fontSize: 14
	    		}
			},
		    series : [{
		            name:'errorScatter',    //错误点
		            type:'scatter',
		            symbolSize: 7,
		            data: obj.error,
		            itemStyle: {    //点的样式
		                  normal: {
		                      color: '#ff4d4d'
		                  }
		            }
		    },{
		            name:'warnScatter',    //警告点
		            type:'scatter',
		            symbolSize: 5,
		            itemStyle: {    //点的样式
		                  normal: {
		                      color: '#ffb73e'
		                  }
		            },
		            data: obj.warn
		    }]
		};
	return option;
}

/*
 * 图表点击事件(查看设备详细信息)
 */
function getChartGrid(deviceId,deviceName){
	var entireReportListId = Ext.getCmp("entireReportListId");
	var footPanelId = Ext.getCmp("footPanelId");
	entireReportListId.remove(footPanelId);
	entireReportListId.add({
		extend:'Ext.panel.Panel',
	    id: 'footPanelId',
	    width: '100%',
	    border: false,
	    padding:20,
	    items:[{
	    	xtype : 'label',
	    	width:"100%",
			border:false,
			html:"<font class='font_t'>"+deviceName+"</font>"
		}],
		listeners:{
			afterrender: function(){
				var footPanelId = Ext.getCmp("footPanelId");
				footPanelId.add({
					xtype: 'grid',
				    id : 'enticeDeviceGridId',
				    width: '100%',
				    margin:"10 0 0 0",
				    minHeight:200,
					enableColumnResize:false,
					enableColumnMove:false,
					enableColumnHide:false,
			    	store: 'report.EntireDeviceStore',
			    	columns: [ 
				        { width:200,menuDisabled:true, header: local.log.gridLevel,  dataIndex: 'notifyState',
				        	renderer:function(v) {
				        		if(v == 2){
				        			return "<img src='/images/log/error.gif' align='absmiddle' />&nbsp;"+local.defaulty
				        		}else if(v == 3){
				        			return "<img src='/images/log/warning.gif' align='absmiddle' />&nbsp;"+local.warn
				        		}
				        	}
				        },
				        { width:300,menuDisabled:true, header: local.log.gridEvent, dataIndex: 'source'  },
				        { flex:2,menuDisabled:true, header: local.content, dataIndex: 'content' },
				        { width:300,menuDisabled:true, header: local.log.gridTime, dataIndex: 'notifyTime' }
				    ],
				    listeners : {
				    	afterrender : function(){
				    		var beginDateId = Ext.getCmp("beginDateId").value;
							var endDateId = Ext.getCmp("endDateId").value;
							var entireTimeId = Ext.getCmp("entireTimeId").value;
				    		
				    		var enticeDeviceStore = Ext.getCmp('enticeDeviceGridId').getStore();
							
				    		enticeDeviceStore.load({
				    			params : {
									deviceId : deviceId,
									beginDate : beginDateId,
					                endDate : endDateId,
					                entireTimeId : entireTimeId
								}
				    		});
				    		
				    		//往store附加额外的参数（用于分页条件查询）
				    		enticeDeviceStore.on('beforeload', function() {
					        	enticeDeviceStore.proxy.extraParams = {
					                deviceId : deviceId,
					                beginDate : beginDateId,
					                endDate : endDateId,
					                entireTimeId : entireTimeId
					            };
					        });
				    	}
				    },
				    dockedItems: [{
						id:'entireReportPage',
				        xtype: 'pagingtoolbar',
				        store: 'report.EntireDeviceStore',
				        dock: 'bottom', //分页 位置
				        emptyMsg: local.toobarEmptyMsg,
				        displayInfo: true,
				        displayMsg: local.toolbarDisplayMsg,
				        beforePageText:local.toolbarBeforePageText,
				        afterPageText: local.toolbarAfterPageText
					}]
				});		    
			}
		}
	});
}

Ext.define('acesure.view.report.EntireReportTreePanel', {
	extend : 'Ext.panel.Panel',
	width : '100%',
	alias : 'widget.entireReportTreePanel',
	id: 'entireReportTreePanelId',
	border:false,
	bodyStyle:'overflow-y:auto;',
	items: [{
		xtype : 'entireReportCharTree'
	}]
});

Ext.define('acesure.view.report.EntireReportList', {
		extend : 'Ext.panel.Panel',
		width : '100%',
		alias : 'widget.entireReportList',
		id: 'entireReportListId',
		border:false,
		//bodyStyle:'overflow-y:auto;',
		layout:'vbox',
		items: [{
			width:"100%",
			xtype : 'headToolbar'
		},{
			width:"100%",
			xtype : 'entireReportToolbar'
		},{
			flex:1,
			overflowY:"auto",
			xtype : 'entireReportTreePanel'
		}],
		listeners:{
			render:function(v, eOpts){
				POWER_OP.filterEnableWidgetsOfExtjs(v, CURRENT_USER.getReportlogPower());
			}
		}
});	

