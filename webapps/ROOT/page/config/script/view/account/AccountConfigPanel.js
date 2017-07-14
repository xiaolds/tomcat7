Ext.define('acesure.config.view.account.AccountConfigPanel', {
			extend : 'Ext.panel.Panel',
			alias : 'widget.accountConfigPanel',	
			id:'accountMainPanel',
			border:false,
			cls : 'toolbar', // 设置底部toolbar背景颜色和边框
			layout:"vbox",
			items: [{
				        xtype: 'toolbar',
				        id:'cliToolBar',
				    	padding:'0 25 0 25',
				    	width:"100%",
						height:108,
						style:'background:#fafbfc;border:0;border-bottom:1px solid #e3eaec',
						defaults:{bodyStyle:'background:#fafbfc'},
						items : [{
								xtype : "panel",
								border : false,
						 		width:48,
						 		height:42,
								html : '<img src="/images/config/account.png"/ style="width:48px;height:42px">'
							}, {
								xtype : "panel",
								border : false,
								html : "<font class='font_h3'>"+local.config.accountConfig+"</font>"
							},
							'->',
							{
								id:'systemconfig_account_add',
								xtype:'button',
								text:local.config.newAccount,	
								style:'padding-left:26px',
								icon : '/images/common/new_16.png',
								itemId: 'systemconfig_account_add' 
							},
							{
								id:'systemconfig_account_bindmachine',
								xtype:'button',
								text:local.config.bindMachine,	
								style:'padding-left:26px',
								icon : '/images/common/new_16.png',
								itemId: 'systemconfig_account_bindmachine' 
							},		
							{
								xtype:'button',
								id: 'systemconfig_account_search',
								text:local.btn.searchAccount,
								itemId: 'systemconfig_account_search'
							}]
			        },
			        {
				        xtype: 'accountGridPanel',
						width:'100%',
						flex:1,
						border:false
			        }],
	       listeners:{
	    	   render: function(v, eOpts){
	    		   POWER_OP.filterEnableWidgetsOfExtjs(v, CURRENT_USER.getSystemPower());	    		   
	    	   }
	       }
});