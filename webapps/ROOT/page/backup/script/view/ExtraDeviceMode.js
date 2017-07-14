/**
 * 最外层panel
 * 
 */
Ext.define('websure.backup.view.ExtraDeviceMode', {
			extend : 'Ext.panel.Panel',
			border:false,
			alias : 'widget.ExtraDeviceMode', 
			style : 'background:#fff;',
			//padding:20,
			//layout:"vbox",
			//height:500,
			//width:"100%",
			//overflowY:"auto",
			//style:"background:#fff",
			//bodyStyle:"padding:20",
			layout:"fit",
			items : [{
					xtype:"panel",
			         border:false,
			         bodyBorder:false,
			         bodyStyle:"border:none",    //只写上面一句ie8没有效果，必须加下面的样式
			         overflowY:"auto",
			         items:[
			                {
							xtype : 'label',
							border:false,
							//height:25,
							style:"display:block",
							margin:"20 20 0 20",
							html : "<font class='font_t'>"+local.backup.backupTask+"</font>",
							width : '90%'
					},{
						xtype : "TaskInfoList",
						height:300,
						margin : '10 20 20 20'
						//padding : '10 20 20 20'
					}, {
						xtype : 'label',
						id : 'backLog',
						style:"display:block",
						margin:"0 20 10 20",
						html : "<font class='font_t'>"+local.backup.tabLog+"</font>",
						width : '90%'
					}, {
						margin : '0 20 20 20',
						flex:1,
						xtype : 'logTabPanel'
					}]
			}],
			listeners:{
				'afterrender' : function() {
					
				}
			}
});

/**
 * 定义任务列表grid
 */
Ext.define('websure.backup.view.TaskInfoList', {
	extend : 'Ext.grid.Panel',
	id : 'taskInfoList',
	height:300,
	enableColumnMove:false,
	enableColumnResize:false,
	enableColumnHide : false,
	alias : 'widget.TaskInfoList',
	store : 'BackupTaskInfoStore',
	//border:false,
	columns : [{
				header : "ID",
				menuDisabled:true,
				//align:'center',
				sortable : true,
				dataIndex : 'id',
				hidden:true
			},{
				header : local.backup.backupTaskName,
				 width:100,
				 menuDisabled:true,
				//align:'center',
				sortable : true,
				dataIndex : 'taskName'
			}, {
				header : local.backup.deviceIP,
				 flex:1,
				 menuDisabled:true,
				//align:'center',
				sortable : true,
				dataIndex : 'deviceIp'
			}, {
				header : local.backup.deviceSys,
				 flex:1,
				 menuDisabled:true,
				//align:'center',
				sortable : true,
				dataIndex : 'deviceOs',
				renderer : function(v, m, r) {
					if ("" != v) {
						if (v == 1) {
							return "aix";
						} else if (v == 2) {
							return "solaris";
						} else if (v == 3){
							return "Redhat/CentOS";
						}else{
							return "";
						}
					} else {
						return "";
					}
				}
			}, {
				header :local.backup.deviceDB,
				//align:'center',
				menuDisabled:true,
				flex:1,
				sortable : true,
				dataIndex : 'dbType',
				renderer : function(v, m, r) {
					if ("" != v) {
						if (v == 1) {
							return "oracle";
						} else if (v == 2) {
							return "Sybase";
						} else {
							return "";
						}
					} else {
						return "";
					}
				}
			}, {
				header :local.backup.taskState,
				menuDisabled:true,
				//align:'center',
				width: 120,
				sortable : true,
				dataIndex : 'state',
				renderer : function(v, m, r) {
					if ("" != v) {
						if (v == 1) {
							return local.backup.pause;
						} else if (v == 2) {
							return local.backup.running;
						} else {
							return "";
						}
					} else {
						return "";
					}
				}
			},{
				header : local.backup.backupPath,
				menuDisabled:true,
				flex:3,
				//align:'center',
				sortable : true,
				dataIndex : 'fileSharePath'
			}, {
				header : local.backup.creatTime,
				menuDisabled:true,
				dataIndex : 'createTime',
				width:190
				//align:'center'
			},{  
                text: local.emergency.gridHander,  
                xtype : 'actioncolumn',
	        	menuDisabled:true,
	        	sortable:false,
	        	width:120,
	        	align : 'center',
	        	hideable: false, 
                items: [  
                    {  
                    	tooltip: local.btn.start,
                        getClass: function(v, metaData, record) {          // Or return a class from a function
	        			  if(record.get("state")==1){
	        				 // metaData.imgAttr = 'data-qtip="启动"';

	        				  //this.items[0].tooltip = "启动";
	        				  return 'startYes';
	        			  }else{
	        			  	//this.items[0].tooltip = "";
	        				  //metaData.imgAttr = 'data-qtip=""';
	        				  return 'startNo';
	        			  }
	        		  },
                        handler: function (grid, rowIndex, colIndex, node, e, record, rowEl) { 
	        			  var id = record.get("id");
	        			  if(record.get("state")==1){
	        			  // 启动任务
							Ext.Ajax.request({
								url : '/backup/tobackupdbAction!startTask.action',
								params : {
									id : id
								},
								success : function(response, options) {
									var obj = Ext.decode(response.responseText);
									var code = obj.msgCode;
									var content = obj.msgContent;
									if(MSG_NORMAL==code){
										Ext.websure.MsgTip.msg(local.window.tip, content, true);
											Ext.getCmp("taskInfoList").store.reload();
											Ext.getCmp("bacLog").store.reload();
										
									}else{
										Ext.websure.MsgError(code, content);
										Ext.getCmp("bacLog").store.reload();
									}
									
								},
								failure : function() {
									Ext.websure.MsgError("WF-30011", local.backup.taskStartFailure);
								}
							});
	        			  }
	        		  }  
                    },
                    { icon: '', tooltip: '',disabled : true},
                    {  
                    	tooltip: local.btn.stop,
                        getClass: function(v, metaData, record) {          // Or return a class from a function
	        			  if(record.get("state")==1){
	        				 //this.items[2].tooltip = "";
	        				  return 'stopNo';
	        			  }else{
	        			  	//this.items[2].tooltip = "暂停";
	        				  return 'stopYes';
	        			  }
	        		  },
                        handler: function (grid, rowIndex, colIndex, node, e, record, rowEl) {
	        			  var id = record.get("id");
	        			  var stste = record.get("state");
	        			  if(2 == stste){
	        			  // 停止任务
							Ext.Ajax.request({
								url : '/backup/tobackupdbAction!stopTask.action',
								params : {
									id : id
								},
								success : function(response, options) {
									var obj = Ext.decode(response.responseText);
									var code = obj.msgCode;
									var content = obj.msgContent;
									if(MSG_NORMAL==code){
										Ext.websure.MsgTip.msg(local.window.tip, content, true);
											Ext.getCmp("taskInfoList").store.reload();
											Ext.getCmp("bacLog").store.reload();
										
									}else{
										Ext.websure.MsgError(code, content);
										Ext.getCmp("bacLog").store.reload();
									}
									
								},
								failure : function() {
									Ext.websure.MsgError("WF-30011", local.backup.taskStopFailure);
								}
							});
	        			  }
	        		  }  
                    }/*,{ icon: '', tooltip: '',disabled : true},
                    {  
                    	tooltip: "修改",
                        getClass: function(v, metaData, record) {          // Or return a class from a function
	        			  if(record.get("state")==1){
	        				 //this.items[2].tooltip = "";
	        				  return 'stopNo';
	        			  }else{
	        			  	//this.items[2].tooltip = "暂停";
	        				  return 'stopYes';
	        			  }
	        		  },
                        handler: function (grid, rowIndex, colIndex, node, e, record, rowEl) {
	        			 	var parId = Ext.getCmp('DeviceBackup').deId;
							var parMac = Ext.getCmp('DeviceBackup').deMac;
							var parUUid = Ext.getCmp('DeviceBackup').deuuid;
							var parIp = Ext.getCmp('DeviceBackup').deIp;
							var parStatus = Ext.getCmp('DeviceBackup').deStatus;
							var taskId = record.get("id");
							var param = {
					    		parId : parId,
					    		parUUid : parUUid,
					    		parMac: parMac,
					    		parStatus : parStatus,
					    		parIp:parIp,
					    		taskId:taskId,
					    		operaType:2
					    	};
							Ext.create('websure.backup.view.DbBackupConfig',param).show();
	        		  }  
                    }*/,
                    { icon: '', tooltip: '',disabled : true},
                    {  
                        icon: '/images/emergency/delete_red.png', // 删除图标  
                        tooltip: local.btn.delete0,
                        handler: function(grid, rowIndex, colIndex, node, e, record, rowEl){
                        	  var id = record.get("id");
                        	  var fileSharePath = record.get("fileSharePath");
                        	  var taskName = record.get("taskName");
                        	  var path_script = fileSharePath+"/"+taskName+"/script"
                        	  Ext.Msg.show({
						        title: local.window.warn,
						        width:350,
						        style:"background-color:#FFF;",
						        msg: local.backup.deleteTaskConfirm,
						        buttons: Ext.MessageBox.YESNO,
						        fn: function(v) {
						        	if(v == 'yes') {
						        		//判断script文件夹是否存在
						        		Ext.Ajax.request({
											url : '/backup/tobackupdbAction!getSharePathIsExit.action',
											params : {
												sharPath : path_script
											},
											success : function(response, options) {
												var obj = Ext.decode(response.responseText);
												if(!obj.info){//目录不存在
													var myMask = new Ext.LoadMask(Ext.getBody(), {msg :local.backup.deleteTaskMsg});
													myMask.show();
										    		//删除任务
													Ext.Ajax.request({
														url : '/backup/tobackupdbAction!deleteTask.action',
														params : {
															id : id
														},
														success : function(response, options) {
															var obj = Ext.decode(response.responseText);
															var code = obj.msgCode;
															var content = obj.msgContent;
															if(MSG_NORMAL==code){
																Ext.websure.MsgTip.msg(local.window.tip, content, true);
																	Ext.getCmp("taskInfoList").store.reload();
																	Ext.getCmp("bacLog").store.reload();
																
															}else{
																Ext.websure.MsgError(code, content);
															}
															myMask.hide();
														},
														failure : function() {
															Ext.websure.MsgError("WF-30011", local.backup.deleteTaskFailure);
															myMask.hide();
														}
													});
												}else{
													Ext.websure.MsgError("WF-30011", local.backup.clientServerRunScriptThenOperatePage);
												}
											},
											failure : function() {
												Ext.websure.MsgError("WF-30011", local.backup.deleteTaskFailure);
												myMask.hide();
											}
										});
						        	}
						        },
						        icon: Ext.MessageBox.WARNING
							});
                        }
                    }
                ]  
            } ],
	listeners : {}
});

// 定义备份详情tab页
Ext.define('websure.backup.view.LogTabPanel', {
			extend : 'Ext.tab.Panel',
			alias : 'widget.logTabPanel',
			id:'logTabPanel',
			plain : true,
			height:300,
			enableTabScroll : true,
			bodyStyle : 'background:#fff;border-color:#e3eaec;',
			resizeTabs : true,
			cls : 'tab_s tab_1',
			activeTab : 0,
			//width : '100%',
			//margin : '10 0 0 0',
			items : [{
						title : local.backup.backLog,
						itemId : '1',
						xtype : "BacLog",
						listeners : {
							afterrender : function(){
								Ext.getCmp("bacLog").store.load({
									params : {
										deviceId : selectDeviceId
									}
								});
							}
						}
					}, {
						title : local.backup.runLog,
						itemId : '2',
						xtype : "showRunLog",
						listeners : {
							afterrender : function(){}
						}
					}],
			listeners : {
				'tabchange' : function(tabPanel, newCard, oldCard) {
					var itemi = tabPanel.activeTab.itemId;
					if (1 == itemi) {
						// 操作日志
						Ext.getCmp("bacLog").store.load({
							params : {
								deviceId : selectDeviceId
							}
						});
					} else if (2 == itemi) {
						 var store = Ext.getCmp("showRunLogTreePanel").getStore();
						      if(null != Ext.getCmp("showRunLogTreePanel").getRootNode()){
						      	Ext.getCmp("showRunLogTreePanel").getRootNode().removeAll(false);//清空数据
						      }
								 store.setProxy({
						            type : 'ajax',
									url:'/backup/tobackupdbAction!loadRunLogInfo.action',
									reader : {
										type : 'json',
										root : 'fileViewInfo'
									},
									extraParams:{  
							                deviceId:selectDeviceId  
							            } ,
						             root: {           
	                                     nodeType: 'async',            
	                                     text: 'Ext JS',            
	                                     expanded: true        
                                     }    
						        });
								 store.load();
					}
				}
			}
		});

// 设备日志
Ext.define('websure.backup.view.BacLog', {
            extend : 'Ext.grid.Panel',
			alias : 'widget.BacLog',
			id : 'bacLog',
			enableColumnMove:false,
			enableColumnResize:false,
			enableColumnHide : false,
			store : 'BackupDBLogStore',
            //height: 300,
            //width:"100%",
            //style:'border-bottom:1px solid #000',
            columns: [
            		  { header: local.num, width:80, menuDisabled : true,dataIndex: 'backupDBId'},
            		  { header: local.log.gridEvent+'ID', menuDisabled : true,width: 90, dataIndex: 'backupDBEventId'},
                      { header: local.log.gridLevel, width: 100, menuDisabled : true,dataIndex: 'backupDBLevel', 
     	                        	  renderer:function(v){
  	  	          		            	if(v == "1"){
						        			return "<img src='/images/log/normal.gif' align='absmiddle' />&nbsp;"+local.normal;
						        		}else if(v == "2"){
						        			return "<img src='/images/log/error.gif' align='absmiddle' />&nbsp;"+local.defaulty;
						        		}else if(v == "3"){
						        			return "<img src='/images/log/warning.gif' align='absmiddle' />&nbsp;"+local.warn;
						        		}
     	                        	  }},
     	              { header: local.log.gridSource, width:150, menuDisabled : true,dataIndex: 'backupDBIp'},
                      { header: local.log.gridTime, flex:1, menuDisabled : true,dataIndex: 'backupDBInsertTime'},
                      { header: local.content, flex:3, menuDisabled : true,dataIndex:'backupDBContent'} 
                     ],
	         loadMask:{
		      msg:local.loading
		    },
		    dockedItems : [{
							xtype : 'pagingtoolbar',
							store : 'BackupDBLogStore', // same store GridPanel is using
							dock : 'bottom', //分页 位置
							emptyMsg : local.backup.dataEmpty,
							displayInfo : true,
							displayMsg :local.toolbarDisplayMsg,
							beforePageText : local.toolbarBeforePageText,
							afterPageText : local.toolbarAfterPageText,
							afterPageText : local.toolbarAfterPageText,
							 listeners : {  
				                      beforechange : function(obj, pdata, options) {
				                      	
				                      		var store = Ext.getCmp('bacLog').store;
				                      	
				                      	    store.on("beforeload",function(){
												        Ext.apply(store.proxy.extraParams, {deviceId : selectDeviceId});
												    });
					                    }  
					                }
						}]
});

