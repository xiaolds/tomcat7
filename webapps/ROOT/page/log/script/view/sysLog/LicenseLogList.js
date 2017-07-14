Ext.define("acesure.view.sysLog.LicenseLogToolbar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.licenseLogToolbar',
	height:108,
	padding:'0 0 0 25',
	style:'border:0;border-bottom:1px solid #d1dade;background:#fafbfc;',
	defaults:{bodyStyle:'background:#fafbfc'},
	items : [ {
				xtype : "panel",
				border : false,
				width:48,
				height:42,
				id : "licenseLogTitlePngId",
				html : ''
		 }, {
				xtype : "panel",
				border : false,
				id : "licenseLogTitleId",
				html : ""
		 },
		 "->",
		 {
			xtype : "panel",
			border:false,
			width:56,
			margin:0,
			height:"100%",
			html: "<div class='shrink' onclick='fadeout();'><img src='/images/backup/shrink.png'/></div>"
		}]
});

function fadeout() {
	var logTree = Ext.getCmp('logTreeId');    //treeId
	var reportLogPanel = Ext.getCmp('reportLogPanel');
	reportLogPanel.removeAll();
	reportLogPanel.add({
		xtype : 'logView'
	});
	reportLogPanel.doLayout();
} 

Ext.define('acesure.view.sysLog.LicenseLogContentHtml', {
	extend : "Ext.panel.Panel",
	border : false,
	alias : "widget.licenseLogContentHtml",
	id : "licenseLogHtmlId",
	cls:"log_text_wrap",
	html: ""
});


Ext.define('acesure.view.sysLog.LicenseLogList', {
	extend : 'Ext.panel.Panel',
	width : '100%',
	border : false,
	alias : 'widget.licenseLogList',
	layout:"vbox",
	overflowY:"auto",
	items: [{
		width:"100%",
		xtype : 'licenseLogToolbar'
	},{
		width:"100%",
		xtype: 'licenseLogContentHtml'
	}]
});

