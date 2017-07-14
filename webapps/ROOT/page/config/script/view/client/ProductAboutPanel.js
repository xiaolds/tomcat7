Ext.define('acesure.config.view.client.ProductAboutPanel', {
			extend : 'Ext.panel.Panel',
			alias : 'widget.productAboutPanel',	
			border:false,
			items: [{
				       xtype: 'toolbar',
				       id:'cliToolBar',
				       height:108,
						padding:'0 25 0 25',
						style:'background:#fafbfc;border:0;border-bottom:1px solid #e3eaec',
						defaults:{bodyStyle:'background:#fafbfc'},
						items : [ {
							xtype : "panel",
							border : false,
							html : '<img src="/images/config/about.png" style="width:48px;height:42px"/>'
						}, {
							xtype : "panel",
							border : false,
							html : '<font class="font_h3">极简主义 · 实用之道</font>'
						}]
			        },
			        {
				        xtype: 'panel',
						height:400,
						width:'100%',
						id:'versionId',
						border:false,
						padding:25,
						html:'<font id="versionId" style="line-height:26px;">数腾业务应急支撑平台（AceSure 6.0.10.XXX）</br>数腾软件 版权所有</br>Copyright © 2017 DataSure.All Rights Reserved.</font>',
						listeners:{
							'afterrender': function(node,eOpts) {
								Ext.Ajax.request({
									url:"/config/toSystemConfigAction!getSystemVersion.action",
									success: function(response, options){
										
										var versionTxt = Ext.getCmp("versionId");
										var reText = Ext.decode(response.responseText);
										var txt = '<font id="versionId" style="line-height:26px;">数腾业务应急支撑平台（AceSure ' + 
											reText.version.info + '）<br>数腾软件 版权所有<br>Copyright © 2017 DataSure.All Rights Reserved.</font>';
										versionTxt.update(txt);
									}
								});
							}
						}
					}]
			
				 
});


	