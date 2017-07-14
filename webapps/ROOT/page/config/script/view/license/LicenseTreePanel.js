Ext.define('acesure.config.view.license.LicenseTreePanel', {
	extend : 'Ext.tree.Panel',
	alias : "widget.licenseTreePanel",
	id : 'licenseListTree',
	cls:'treePanel_icon2 grid_border',  
	height : '100%',
	width : '100%',
	bodyStyle : "color:#666",
	enableHdMenu : false,
	enableColumnResize : false,
    useArrows: true,
	rootVisible: false,
	multiSelect: true,
    singleExpand: true,
	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {
			store : 'LicenseTreeStore',
			 columns: [{
		            xtype: 'treecolumn', //this is so we know which column will show the tree
		            text: local.config.productUuid,
		            flex: 1,
		            sortable: true,
		            menuDisabled:true,
		            dataIndex: 'uuid'
		        }, {
					header : local.config.productType,
					menuDisabled:true,
					xtype : 'gridcolumn',
					dataIndex : 'type',
					align : 'left',
					width : '10%',
					renderer : function(val) {
						return val == '0' ? local.config.basicPro :local.config.extendPro;
					}
				}, {
					header : local.btn.detailInfo,
					menuDisabled:true,
					dataIndex : 'lcsinfo',
					hidden : true,//暂时隐藏，测试提bug，此列为空
					align : 'center',
					width : '15%'
				}, {
					header : local.config.companyName,
					menuDisabled:true,
					dataIndex : 'desc',
					align : 'center',
					width : '15%'
				}, {
					header : local.config.versionType,
					menuDisabled:true,
					xtype : 'gridcolumn',
					dataIndex : 'version',
					width : '10%',
					align : 'center',
					renderer : function(value) {
						return value == '1' ? local.config.version : local.config.trial;
					}
				}, {
					header : local.config.registerTime,
					menuDisabled:true,
					width : '15%',
					align : 'center',
					dataIndex : 'register'
				}, {
					header : local.config.remainDays,
					menuDisabled:true,
					xtype : 'gridcolumn',
					flex : 1,
					align : 'center',
					dataIndex : 'remainday',
					renderer : function(value) {
						if (0 == value) {
							delay(100, function() {	
								me.columns[6].show();
							});		
						} else if (-1 == value){
							value = local.config.forever;
						}
						return value;
					}
				}, {
					xtype : 'gridcolumn',
					menuDisabled:true,
					header : local.config.remainHour,
					flex : 1,
					align : 'center',
					dataIndex : 'remainhour',
					hidden : true
				}]
		});

		me.callParent(arguments);
	}
});
