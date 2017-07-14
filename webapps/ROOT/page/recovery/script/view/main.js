/**
 * author:yangbobin date:2015-10-27
 */
Ext.Loader.setConfig({
	
	enabled : true
});
Ext.application({
	name : 'acesure.recovery',
	appFolder : '/page/recovery/script',
	controllers : [ 'RecoveryController' ],
	// 当前页面加载完成执行的函数
	launch : function() {
		// 页面加载完成之后执行
		Ext.create('acesure.recovery.view.mainPanel');
	}
});
/**
 * 恢复存储主框架
 */
var deviceId;
var deviceName; 
Ext.define('acesure.recovery.view.mainPanel', {
	extend : 'Ext.container.Viewport',
	layout : 'border',
	border : false,
	minWidth:1250,
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype:'GlobalMenu',
			border:false,
			region:'north',
			height:60
		},{
			xtype : 'grobleTreePanel',
			region : 'west',
			floating : false,
			width : 239,
			bodyStyle:'background:#f5f8fa;',
			listeners:{
				'itemcontextmenu' : function(menutree, record, items, index, e) {  
					e.preventDefault(); 
					var licenseFlagFirst = record.raw.licenseFlag;
					if(2 == licenseFlagFirst){
						Ext.MessageBox.alert(local.window.tip, local.unauthDevNoOperate);
						return;
					}
					var nodemenu = new Ext.menu.Menu({
						floating : true,  
						items : []  
					});

					if(record.data.id.split("-")[1]=="d"){
						nodemenu.add([
						              {  
						            	  text : local.toTakeover,  
						            	  icon:"/images/backup/icon_link.png",
						            	  handler : function() { 
						            		  var href = document.getElementById("sel_mon").href;
						            		  window.open(href+"?deviceId="+record.data.id,"_self");
						            	  }, 
						            	  listeners : { 
						            		  afterrender:function(v){
						            			  var licenseFlag_ = record.raw.licenseFlag;
						            			  //未授权设备，不是手动添加设备，没有自动接管权限
						            			  if(licenseFlag_==2){
						            				  v.setDisabled(true);
						            			  }else{
						            				  v.setDisabled(false);
						            			  }
						            		  }
						            	  }
						              },
						              {  
						            	  text : local.tobackupWarning,  
						            	  icon:"/images/backup/icon_link.png",
						            	  handler : function() { 
						            		  var href = document.getElementById("sel_bac").href;
						            		  window.open(href+"?deviceId="+record.data.id,"_self");
						            	  }, 
						            	  listeners : { 
						            		  afterrender:function(v){
						            			  var licenseFlag_ = record.raw.licenseFlag;
						            			  //未授权设备，不是手动添加设备，没有自动接管权限
						            			  if(licenseFlag_==2){
						            				  v.setDisabled(true);
						            			  }else{
						            				  v.setDisabled(false);
						            			  }
						            		  }
						            	  }
						              }
						              ]);
						nodemenu.showAt(e.getXY());
					}else if(record.data.id.split("-")[1]=="g"){
                            //分组右键菜单【只有集群分组拥有功能链接】
                            if(record.raw.groupType==2 || record.raw.groupType==3){
                                    nodemenu.removeAll();
                                    //跳转至集群 应急
                                    nodemenu.add({  
                                        text : local.toTakeover,  
                                        icon:"/images/backup/icon_link.png",
                                        handler : function() { 
                                            var href = document.getElementById("sel_mon").href;
                                            window.open(href+"?deviceId="+record.data.id,"_self");
                                        },  
                                        listeners : { 
                                            
                                        } 
                                   });
                                   //跳转至集群 备份
                                    nodemenu.add({  
                                        text : local.tobackupWarning,  
                                        icon:"/images/backup/icon_link.png",
                                        handler : function() {  
                                            var href = document.getElementById("sel_bac").href;
                                            window.open(href+"?deviceId="+record.data.id,"_self");
                                        },  
                                        listeners : { 
                                            
                                        }  
                                   });
                               
                                nodemenu.showAt(e.getXY());
                            }
                           
                    }
				}
			}
			}, {
				xtype : 'panel',
				region : 'center',
				itemId : 'recoveryPanel',
				id : 'recoveryContentPanel',
				layout : 'fit',
				style:'border-left:1px solid #d1dade;',
				border:false,							
				items : [{
						xtype : 'recovery',
						itemId : 'recoveryPanel'
						}]
				}];

		me.callParent(arguments);
	},
	listeners:{
		afterrender:function(){
			var di = getQueryString('deviceId'); 
			if(null != di){
				var d = new Ext.util.DelayedTask(function(){
					var tree = Ext.getCmp('grobleTreePanel');
					var record = tree.getStore().getNodeById(di);
					Ext.getCmp("grobleTreePanel").getSelectionModel().select(record);
					Ext.getCmp("grobleTreePanel").fireEvent("itemclick",null,record);
				});
				d.delay(700); 
			}
		},
		render: function(me) {
            me.el.dom.onclick = function(e){
                closeClusterWin(e);
            }
        }
	}

});

function getQueryString(name) {
var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
var r = window.location.search.substr(1).match(reg);
if (r != null) return unescape(r[2]); return null;
} 