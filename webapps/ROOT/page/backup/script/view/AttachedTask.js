reportDeviceId = null;
reportDeviceType = null;
licenseNum = null;
operaType=0;//0-新增  1-更新
/*
 * 修改任务模块窗口
 */
Ext.define("websure.backup.view.AttachedTask", {
	extend : 'Ext.window.Window',
	title : local.backup.winAttachedTask, // 附加任务类型
	draggable : false, 
	border:false,
	//height : 300, 
	width : 600, 
	alias : 'widget.AttachedTask',
	id : 'attachedTask',
	layout : "fit", //窗口布局类
	modal : true,	//是否模态窗口，默认为false
	resizable : false,
	constructor : function(config) {
		//填充外部设备Id
		reportDeviceId = config.deviceId;
		
		/**
		 * 任务模块Form表单
		 */
		 Ext.define("websure.backup.view.AttachedTaskForm",{
		 	  extend:'Ext.form.FormPanel',
		 	  alias : 'widget.AttachedTaskForm',
		 	  id:'AttachedTaskForm',
		 	  border: false,
			  labelWidth: 50,
			  margin:10,
			  //labelAlign: "right",
			  items: [{height:32,xtype:"panel",border:false,id:"licenseNum",html:""},{
			  	xtype:"label",
			  	height:40,
			  	text:local.backup.winAttachedTaskChoose    //请选择任务类型:
			  },/*{
		          xtype: 'checkboxgroup',
		          margin:"10 0 0 0",
		          id:"attachType",
		          columns : 1,
		          items:[
		          	 {height:34,boxLabel:local.backup.gridDiscBackup,id:'attach1',name:'rb', inputValue: '1',disabled:true},    
		             {height:34,boxLabel:local.backup.tabTitleWarn, id:'attach2', name:'rb', inputValue: '2',disabled:true },
		             {height:34,boxLabel:local.backup.tabTitleDB, id:'attach3', name:'rb', inputValue: '3' },    
		             {boxLabel:local.backup.gridDateBackupTimeC, id:'attach4', name:'rb', inputValue: '4' }
		           ]    
		        }*/
			  {
				 // border:false,
				  width:"100%",
				  height:130,
				  padding:10,
				  style:"border:1px solid #eee",
				  bodyStyle:"border:none",
				  margin:"10 0 0 0",
				  layout:"hbox",
				  //margin:10,
				  items:[
					  {
				          xtype: 'checkboxgroup',
				          id:"attachType",
				          width:100,
				          layout:"vbox",
				          height:"100%",
				          items:[
				          	 {height:34,boxLabel:local.backup.gridDiscBackup,id:'attach1',name:'rb', inputValue: '1',disabled:true},    
				             {height:34,boxLabel:local.backup.tabTitleWarn, id:'attach2', name:'rb', inputValue: '2',disabled:true },
				             {height:34,boxLabel:local.backup.tabTitleDB, id:'attach3', name:'rb', inputValue: '3' }/*,    
				             {boxLabel:local.backup.gridDateBackupTimeC, id:'attach4', name:'rb', inputValue: '4' }*/
				           ]    
				        },{
				        	border:false,
				        	flex:1,
				        	height:"100%",
				        	layout:"vbox",
				        	defaults:{style:"display:block;line-height:26px;color:#666;",height:39},
				        	items:[
				        	       {
				        	    	   xtype:'label',
				        	    	   width:"100%",
				        	    	   html:local.backup.backupExplain
				        	       },{
				        	    	   xtype:'label',
				        	    	   html:local.backup.warningExplain
				        	       },{
				        	    	   xtype:'label',
				        	    	   width:"100%",
				        	    	   html:local.backup.DBExplain+"<font color='red'>"+local.backup.saveNoModifyS+"</font>"
				        	       }]
				        }
				  ]
			  }
			  ]
		 });
			 
		var me = this;
		//将Form表单添加到panel中
		me.items = [{
			xtype : 'AttachedTaskForm'
		}];
		
		//添加两个按钮
		me.buttons = [{
			cls:"btn_focus",
            text: local.btn.save,
			handler : function() {
				//获取
		 		var taskCheck = Ext.getCmp('attachType').items;
                var tm = [];
                var cou=0;
                Ext.Array.each(taskCheck.items, function(item){
                     if(item.checked){
                     		cou++;
                         tm.push(item.inputValue);
                     }
                 });
                 
                 if(0 == operaType){//新增
						//判断数据库授权点数是否超过限制
						if(-1 != licenseNum){
							if(licenseNum == 0){
								Ext.MessageBox.alert(local.window.tip,local.backup.DBBackupNoAuth);
								return;
							}
						}
					}
             //提交数据到后台
          	Ext.Ajax.request({
						url : '/backup/todeviceAction!saveReportDeviceModeInfo.action',
						params: {
					    	taskMode:tm,
					    	deviceId:reportDeviceId
					    },
						success : function(response, options) {//成功后关闭页面，刷新树
							/*Ext.MessageBox.alert(local.window.tip,local.backup.addDMSuccess,function(){
								Ext.getCmp("attachedTask").destroy();
								Ext.getCmp("grobleTreePanel").getStore().load();
							});*/
							var obj=Ext.decode(response.responseText);
							console.log(obj);
							var code = obj.msgCode;
							var content = obj.msgContent;
							if(MSG_NORMAL==code){
								Ext.websure.MsgTip.msg(local.window.tip, content, true);   
								Ext.getCmp("attachedTask").destroy();
//								Ext.getCmp("grobleTreePanel").getStore().load();
								
								if(null != selectDeviceId){
									if(selectDeviceId == reportDeviceId){
//										var d = new Ext.util.DelayedTask(function(){  
											var item = Ext.getCmp("grobleTreePanel").getStore().getNodeById(selectDeviceId+"-d");
											Ext.getCmp("grobleTreePanel").getSelectionModel().select(item);
											Ext.getCmp("grobleTreePanel").fireEvent("itemclick",null,item);
//										});
//										d.delay(500);  
									}
								}
							}else{
								Ext.websure.Ms1gError(code, content);
							}
							
						},
						failure : function() {//失败后关闭页面
//							Ext.MessageBox.alert(local.window.tip,local.backup.addDMFailure);
							Ext.websure.MsgError("WF-30006",local.backup.addDMFailure);
							Ext.getCmp("attachedTask").destroy();
						}
					}); 
				}
        },{
            text: local.btn.cancle,
			handler : function() {
				Ext.getCmp("attachedTask").destroy();
			}
        }];

		me.callParent(arguments);
	},
	listeners : {
		'afterrender' : function() {
			operaType = 0;//初始化
			//获取备份模块的授权点数
					Ext.Ajax.request({
						url : '/backup/tobackupdbAction!getLicenseNumForDB.action',
						success : function(response, options) {
							var obj = Ext.decode(response.responseText);
							
							if(null != obj.info){
								var result = "";
								licenseNum = obj.info;
								if(-1 == obj.info){
									result = local.backup.unlimit;
								}else{
									result = obj.info+local.backup.title2;
								}
								Ext.getCmp("licenseNum").update("<font color='red'>"+local.backup.DBBackupResultAuthNum+result+"</font>");
							}
						},
						failure : function() {
							Ext.websure.MsgError("WF-30015",local.backup.getDBBackupResultAuthNumFailure);
							Ext.getCmp("createGroup").destroy();
						}
					});
			if(null != reportDeviceId ){
				//填充数据
				Ext.Ajax.request({
					url : '/backup/todeviceAction!geteReportDeviceModeInfo.action',
					params : {
						deviceId : reportDeviceId
					},
					success : function(response, options) {
						var obj = Ext.decode(response.responseText);
						//根据后台数据填充页面数据
						if(null != obj.info){
							var deviceMode = obj.info;
								var s = deviceMode.split("");
								if(s.length>0){
									for(var i=0;i<s.length;i++){
										if(1 == s[i]){
											Ext.getCmp("attach1").setValue(true);
										}else if(2 == s[i]){
											Ext.getCmp("attach2").setValue(true);
										}else if(3 == s[i]){
											Ext.getCmp("attach3").setValue(true);
											Ext.getCmp("attach3").setDisabled(true);
											operaType = 1;//更新
										}else if(4 == s[i]){
											Ext.getCmp("attach4").setValue(true);
										}
									}
								}else{
									Ext.getCmp("attach1").setValue(true);
									Ext.getCmp("attach2").setValue(true);
								}
						}
					},
					failure : function() {
//						Ext.MessageBox.alert(local.window.tip,local.backup.matchDMFailure);
						Ext.websure.MsgError("WF-30007",local.backup.matchDMFailure);
					}
				});
			}
		}
	}
});
