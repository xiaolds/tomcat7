Ext.QuickTips.init();

Ext.define('websure.backup.view.TopShowPanel',{
				       extend :'Ext.panel.Panel',
						alias : 'widget.topShowPanel',
						id :'topShowPanel',
				        style:'border-bottom:1px solid #d1dade',
				        border:false,
				        layout :'border',
				        height:108,
				        width:'100%',
				        bodyStyle: 'background:#fafbfc;',
				        items :[{
						        xtype: "panel",
						        bodyStyle: 'background:#fafbfc;',
						        border : false,
						        padding:'30 20 30 25',
						        id:'deviceCount',
						        html: "<div><img style='float:left;' src='/images/backup/backup.png'></img><div style='float:left;margin-left:15px;'><font class='font_h3'>"+local.backup.title+"</font><br>..."+local.backup.title2+"</div></div>",
						        width: 250,
						        height : 70,
						        region:'west'
						    },
						    {
						    	region:'center',
						    	border : false,
						    	bodyStyle: 'background:#fafbfc;'
						    },
						    {
						    	region:'east',
						    	border : false,
						    	width:105,
						    	bodyStyle: 'background:#fafbfc;',
						    	margin:'37 30 0 0',
						    	defaults: {style:'padding-left:26px' },
						    	items:[{
						    		xtype: 'button',
						    		id:'refrush',
						    		icon : '/images/common/refresh.png',
						    		text : local.btn.refresh,
						    		handler : function(){
						    			this.disable(true);
						    			var a = new ClassDevice();
										a.showFieldSetDevice();
						    		}
						    	}]			    
						    }]
				}); 

Ext.define("websure.backup.view.BackupView",{
		 	extend : 'Ext.panel.Panel',
		 	alias : 'widget.BackupView',
		 	id : 'BackupView',
		 	border : false,
			width : '100%',
			//overflowY:'auto',
			//bodyStyle:'overflow-y:auto;',
			layout:"vbox",
		 	items : [{
		 	xtype: "topShowPanel"},{
		 		xtype:"panel",
		 		border:false,
		 		height:45,
		 		padding:"0 20 0 0",
		 		width:"100%",
		 		html:"<div class='device_tip'>"+
		 		"<span>"+local.backup.funSample+"</span>"+
		 		"<i class='dev_icon dev_icon1'></i><span>"+local.backup.backupState+"</span>"+
		 		"<i class='dev_icon dev_icon2'></i><span>"+local.backup.propertyMonitor+"</span>"+
		 		"<i class='dev_icon dev_icon3'></i><span>"+local.backup.mockMonitor+"</span>"+
		 		"<i class='dev_sep'></i>"+
		 		"&nbsp;&nbsp;<span>"+local.backup.stateSample+"</span>"+
		 		"<i class='dev_icon dev_icon4'></i><span>"+local.normal+"</span>"+
		 		"<i class='dev_icon dev_icon5'></i><span>"+local.abnormal+"</span>"+
		 		"<i class='dev_icon dev_icon6'></i><span>"+local.unconfig+"</span>"+
		 		"<i class='dev_sep'></i>"+
		 		"<i class='dev_icon dev_icon7'></i><span>"+local.backup.online+"</span>"+
		 		"<i class='dev_icon dev_icon8'></i><span>"+local.backup.offline+"</span>"+
		 		"<i class='dev_icon dev_icon9'></i><span>"+local.unAuth+"</span>"+
		 		"<i class='dev_sep'></i>"+
		 		"<i class='dev_icon dev_icon10'></i><span>"+local.backup.pc+"</span>"+
		 		"<i class='dev_icon dev_icon11'></i><span>"+local.backup.vm+"</span>"+
		 		"</div>"
		 	},{
			 	xtype :'panel',
				id :'aboutPanel',
				width : '100%',				
				border : false,
				flex:1,
				overflowY:"auto",
				html:"",
				items: [],
		        listeners:{
		        	afterrender:function(){
		        		var a = new ClassDevice();
						a.showFieldSetDevice(); 
		        	}		        
		        }					 
		   }]
});

/*Ext.getDoc().on("contextmenu", function(e){
    e.stopEvent();
});*/