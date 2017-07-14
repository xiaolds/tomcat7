Ext.define('acesure.config.view.common.ConfigTreePanel', {
			extend : 'Ext.tree.TreePanel',
			alias : 'widget.configTreePanel',
			rootVisible:false,
			cls:'bgcolor',
			id:'configTree',
		    style:'background:#f5f8fa',
		    padding:'14 10 10 12',
			border:false,
			autoScroll:true,
			lines:false,
			bodyBorder:false,
			store:'ConfigTreeStore'
	});
