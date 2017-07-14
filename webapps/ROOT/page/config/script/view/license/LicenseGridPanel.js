Ext.define('acesure.config.view.license.LicenseGridPanel', {
	extend : 'Ext.grid.GridPanel',
	alias : "widget.licenseGridPanel",
	id : 'licenseListGrid',
	height : '100%',
	width : '100%',
	bodyStyle : "color:#666",
	enableHdMenu : false,
	enableColumnResize : false,
	cls:'treePanel_icon grid_border', 
	initComponent : function() {
		var me = this;

		Ext.applyIf(me, {
			store : 'LicenseProductStore',
			columns : [ {
				xtype : 'rownumberer',
				header : local.config.rowNum,
				align : 'center',
				width : '5%'
			}, {
				header : local.config.productUuid,
				align : 'center',
				dataIndex : 'uuid',
				width : '15%'
			}, {
				header : local.config.productType,
				xtype : 'gridcolumn',
				dataIndex : 'type',
				align : 'left',
				width : '10%',
				renderer : function(val) {
					return val == '0' ? local.config.basicPro :local.config.extendPro;
				}
			}, {
				header : local.btn.detailInfo,
				dataIndex : 'lcsinfo',
				align : 'center',
				width : '15%'
			}, {
				header : local.config.describe,
				dataIndex : 'desc',
				align : 'center',
				width : '15%'
			}, {
				header : local.config.versionType,
				xtype : 'gridcolumn',
				dataIndex : 'version',
				width : '10%',
				align : 'center',
				renderer : function(value) {
					return value == '1' ? local.config.version : local.config.trial;
				}
			}, /*{
				header : local.config.registerTime,
				width : '15%',
				align : 'center',
				dataIndex : 'register'
			}, {
				header : local.config.registerTime,
				width : '10%',
				align : 'center',
				dataIndex : 'regday'
			}, */{
				header : local.config.remainDays,
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
