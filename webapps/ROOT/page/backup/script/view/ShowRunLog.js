/**
 * 最外层panel
 * 
 */
Ext.define('websure.backup.view.ShowRunLog', {
			extend : 'Ext.tree.TreePanel',
			id : 'showRunLogTreePanel',
			alias : 'widget.showRunLog',
			useArrows : true,
			cls : 'treePanel_icon grid_border',
			//maxHeight : '650',
			border : false,
			enableColumnMove:false,
			enableColumnResize:false,
			enableColumnHide : false,
			singleExpand : true,    //一次展开一个节点
			rootVisible : false,    // 不可见根
			setRootNode: function() {
		        if (this.getStore().autoLoad) {
		            this.callParent(arguments);
		        }
		    },
			initComponent : function() {
				var self = this;
				Ext.applyIf(self, {
							store : 'ShowRunLogStore',
							columns : [{
										header : local.pcID,
										dataIndex : 'logId',
										hidden : true,
										hideable: false
									}, {
										xtype : 'treecolumn',
										header : local.backup.logName,
										menuDisabled : true,
										dataIndex : 'logName',
										flex:2
									}, {
										header : local.backup.filePath,
										menuDisabled : true,
										dataIndex : 'logpath',
										flex:2,
										sortable : false,
										menuDisabled : true
									}, {
										header : local.backup.logSize,
										menuDisabled : true,
										dataIndex : 'logSize',
										width : 100
									}, {
										header : local.backup.logModifyTime,
										menuDisabled : true,
										dataIndex : 'logModifyTime',
										flex:1
									}]
						});
				self.callParent(arguments);
			},
			listeners : {
				/*beforeitemexpand : {
					fn : function(record,eOpts){
						 	var self = this;  
					        var proxy = self.getStore().getProxy();  
					        proxy.extraParams.deviceId = selectDeviceId;  
					}
				},
				beforeload : {
					fn : function (node){
						loadMask = new Ext.LoadMask(this,{
                           msg :local.recovery.dataLoad,
                           removeMask : true    // 完成后移除
                        });            
                        loadMask.show();
					}
				},
				load : {
					fn : function(me, node, records, successful, eOpts){
						loadMask.hide();
					}
				}*/
			}
		});
