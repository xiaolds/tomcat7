Ext.define('acesure.initialization.view.InitializationList', {
	extend: 'Ext.panel.Panel',
	width: 960,
	height :650,
	border: false,
	alias: 'widget.InitializationList',
	id: 'initializationListId',
	shadow:true, 
	layout:"fit", 
	bodyStyle:'background:#fff;overflow-y:auto;',
	items: [{
		id: 'initializationBeginId',
		xtype: 'InitializationBegin'
	},{
		id: 'initializationCleckId',
		xtype: 'InitializationCleck'
	},{
		id: 'initializationConfigId',
		xtype: 'InitializationConfig'
	},{
		id: 'initializationNetwork',
		xtype: 'InitializationNetwork'
	}],
	listeners: {
	    render: function() {
	    	// TODO
	    	//隐藏第二页、第三页、第四页内容
	        var initializationCleckId = Ext.getCmp('initializationCleckId');
			initializationCleckId.hide();
	        var initializationConfigId = Ext.getCmp('initializationConfigId');
			initializationConfigId.hide();
			var initializationNetwork = Ext.getCmp('initializationNetwork');
			initializationNetwork.hide();
			
			checkIsProgress(function(){
				// 跳到最后一页
				var initializationListId = Ext.getCmp('initializationListId');
	  			initializationListId.removeAll();
	  			initializationListId.add({
	  				xtype : 'InitializationEnd'
	  			});
	  			initializationListId.doLayout();
			});
	    }
    }
});

function checkIsProgress(callback){
	Ext.Ajax.request({
		method : 'post',
		url: '/initialization/toInitialization!getProgress.action',
		timeout:1000,
		failure : function (response, opts){
		},
		success: function (response){
			var result = JSON.parse(response.responseText);
			
			var inProgress = result.inProgress;
			var percent = result.percent;
			var msg = result.msg;
			
			if(inProgress && percent != 100){
				callback();
				getProgress();
			} 
		}
	})
}


//开始安装
 Ext.define('websure.initialization.view.InitializationBegin', {
	extend : 'Ext.panel.Panel',
	width : "100%",
	height :"100%",
	border : false,
	alias : 'widget.InitializationBegin',
	id: 'initializationBeginId',
    bodyStyle: {
        background: 'url(/images/initialization/bg_welcome.png) no-repeat'
    },
	items :[
	        {
	        	xtype:'panel',
	        	border:false,
	        	width:'100%',
	        	style:'margin-top:100px;',
	        	bodyStyle:'background:none;',
	        	html:"<div class='font_h1'>"+local.init.createExperience+"</div></br><div class='font_h22'>"+local.init.welcomeUse+
	        	"</div><p class='font_h23'>"+local.init.createExperienceMore+"</p>"
	        },
	        {
		xtype:'button',
		text:local.init.startConfiguration,
		width:260,
		height:55,
		cls:'btn_first',
		style:'margin:20px 0 0 352px;',
		handler:function(){
			var initializationBeginId = Ext.getCmp('initializationBeginId');
			initializationBeginId.hide();
			var initializationCleckId = Ext.getCmp('initializationCleckId');
			initializationCleckId.show();
			var initializationConfigId = Ext.getCmp('initializationConfigId');
			initializationConfigId.hide();
			var initializationNetwork = Ext.getCmp('initializationNetwork');
			initializationNetwork.hide();
		},
		listeners: {
	    	afterrender : function(){
	    		var next_button = Ext.getCmp('next_button');
	    		next_button.disable();
	    	}
	    }
	}]
});

/*
 * 环境检测必须
 */
Ext.define('websure.initialization.view.InitializationMustGrid',{
	extend:'Ext.grid.Panel',
	alias:'widget.InitializationMustGrid',
	id : 'initializationMustGrid',
	enableColumnResize:false,
	enableColumnMove:false,
	enableColumnHide:false,
	store: 'InitializationStore',
    columns: [
        { header: local.init.project,  dataIndex: 'name', width:95,menuDisabled:true, sortable: false },
        { header: local.init.currentState, align:'left',width:50,dataIndex: 'status', menuDisabled:true, sortable: false,
        	renderer:function(v, cellmeta, record){
				var next_button = Ext.getCmp('next_button');
        		if(v == 0){
					next_button.disable();
        			return '<span style="color:orange;">'+local.init.abnormal+'<span>';
        		}else{
        			next_button.enable();
        			return '<span style="color:green;">'+local.init.normal+'<span>';
        		}
        	}
        },
        { header: local.init.describle, dataIndex: 'prerequisite', flex: 1, menuDisabled:true, sortable: false,
        	renderer:function(v){
        		return "<div class='text_wrap' title='"+v+"'>"+v+"</div>"
        	}
        	},
        { header: local.init.type, dataIndex: 'type', hidden: true, id:'type'}
    ],
    height: 430,
    width: 360,
    listeners: {
    	afterrender : function(){
    		var mustGridId = Ext.getCmp('initializationMustGrid');
    		mustGridId.store.load({
    			callback: function(records, options, success){
    				var next_button = Ext.getCmp('next_button');
					mustGridId.store.each(function(item, index, count) {
						var status = item.data.status;
						if(status == 0){
							next_button.disable();
						}
					})
		      	}
    		});
			mustGridId.store.filter("type",1);
    	}
    }
});

/*
 * 环境检测可选
 */
Ext.define('websure.initialization.view.InitializationSelectGrid',{
	extend:'Ext.grid.Panel',
	alias:'widget.InitializationSelectGrid',
	id: 'initializationSelectGridId',
	store: 'InitializationSelectStore',
    columns: [
        { header: local.init.project,  dataIndex: 'name', width:95,menuDisabled:true, sortable: false },
        { header: local.init.currentState, align:'center',width:50,dataIndex: 'status', menuDisabled:true, sortable: false,
        	renderer:function(v, cellmeta, record){
        		if(v == 1){
        			return '<span style="color:green;">'+local.init.normal+'<span>';
        		}else{
        			return '<span style="color:orange;">'+local.init.abnormal+'<span>';;
        		}
        	}
        },
       { header: local.init.describle, dataIndex: 'prerequisite', flex: 1, menuDisabled:true, sortable: false,
        	renderer:function(v){
        		return "<div class='text_wrap' title='"+v+"'>"+v+"</div>"
        	}}
    ],
    height: 430,
    width: 360,
    listeners: {
    	afterrender : function(){
    		var selectGridId = Ext.getCmp('initializationSelectGridId');
    		selectGridId.store.filter("type",0);
    	}
    }
});

//环境检测
Ext.define('websure.initialization.view.InitializationCleck',{
	extend : 'Ext.panel.Panel',
	alias : 'widget.InitializationCleck',
	id:'initializationCleckId',
	width :"100%" ,
	height : "100%",
	border : false,
	layout:'hbox',
	cls:'button_padding',
	defaults:{border:false},
	items:[
	       {
	    	   xtype:'panel',
	    	   width:170,
	    	   height:'100%',
	    	   border:false,
	    	   html:"<div class='pro'><span>"+local.init.environmental+"</span><br>"+local.init.administratorsConfig+"<br>"+local.init.LAN+"<br>开始配置</div>"
	       },
	       {
	    	   xtype:'panel',
	    	   layout:'vbox',
	    	   height:"100%",
	    	   flex:1,
	    	   border:false,
	    	   padding:'30 40 20 20',
	    	   items: [{
	    			xtype:'panel',
	    			width : '100%',
	    			//height : 480,
	    			flex:1,
	    			border:false,
	    			layout:{type:'table',columns:2},
	    			items: [{
	    				xtype : 'label',
	    				html:"<span style='font-weight:bolder;font-size:16px;'>"+local.init.must+"&nbsp;&nbsp;&nbsp;</span><span style='color=#ccc'>"+local.init.mustInfo+"</span>",
	    				border:false,
	    				width : 373,
	    				height : 40
	    			},{
	    				xtype : 'label',
	    				html:"<span style='font-weight:bolder;font-size:16px;'>"+local.init.others+"&nbsp;&nbsp;&nbsp;</span><span style='color=#ccc'>"+local.init.othersInfo+"</span>",
	    				border:false,
	    				style:'margin-left:10px',
	    				width : 300,
	    				height : 40
	    			},{
	    			    style:'margin-top:20px',
	    			    xtype:'InitializationMustGrid'
	    			},{
	    			    style:'margin-top:20px;margin-left:10px',
	    				xtype:'InitializationSelectGrid'
	    			}]
	    		},{
	    			xtype:'panel',
	    			width : '100%',
	    			height:40,
	    			border:false,
	    			style:'margin-top:15px',
	    			layout : 'hbox',
	    			items :[
	    			        {
	    			        	flex:1,border:false
	    			        },
	    			        {
	    				xtype:'button',
	    				cls:'btn_sec_gray',
	    				width:136,
	    				height:40,
	    				text:local.btn.previous,    				
	    	        	handler:function(){
	    					var initializationBeginId = Ext.getCmp('initializationBeginId');
	    					initializationBeginId.show();
	    					var initializationCleckId = Ext.getCmp('initializationCleckId');
	    					initializationCleckId.hide();
	    					var initializationConfigId = Ext.getCmp('initializationConfigId');
	    					initializationConfigId.hide();
	    					var initializationNetwork = Ext.getCmp('initializationNetwork');
	    					initializationNetwork.hide();
	    				}
	    			},{
	    				xtype:'button',
	    				id:'next_button',
	    	        	text: local.btn.next,  
	    	        	cls:'btn_sec',
	    				width:136,
	    				height:40,
	    				style:'margin-left:10px;',
	    	        	handler:function(){
	    					var initializationBeginId = Ext.getCmp('initializationBeginId');
	    					initializationBeginId.hide();
	    					var initializationCleckId = Ext.getCmp('initializationCleckId');
	    					initializationCleckId.hide();
	    					var initializationConfigId = Ext.getCmp('initializationConfigId');
	    					initializationConfigId.show();
	    					var initializationNetwork = Ext.getCmp('initializationNetwork');
	    					initializationNetwork.hide();
	    				}
	    			}]
	    		}]
	       }]
});

//管理员配置
 Ext.define('websure.initialization.view.InitializationConfig', {
	extend : 'Ext.panel.Panel',
	width : '100%',
	height : '100%',
	border : false,
	alias : 'widget.InitializationConfig',
	layout:"hbox",
	items:[
	       {
	    	   xtype:'panel',
	    	   width:170,
	    	   height:'100%',
	    	   border:false,
	    	   html:"<div class='pro pro2'>"+local.init.environmental+"<br><span>"+local.init.administratorsConfig+"</span><br>"+local.init.LAN+"<br>"+local.init.startConfiguration+"</div>"
	       },
	       {
	    	   xtype:'panel',
	    	   layout:'vbox',
	    	   flex:1,
	    	   height:"100%",
	    	   border:false,
	    	   overflowY:"auto",
	    	   padding:'20 40 20 20',
	    	   items: [{
	    				xtype : 'label',
	    				style:"font-weight:bold;font-size:16px;",
	    				html:local.init.admin,
	    				width : '98%'
	    			},{
	    				border:false,
	    				style:"margin-top:6px;",
	    				width:'100%',
	    				items:{
		    				xtype:'checkbox',
		    				id:'serverConfigManagerMode',
		    				boxLabel :local.init.threeManage+'&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#666;">'+local.init.threeManageMore+'</span>',
		    				listeners:{
		    					change:function(newValue, oldValue, eOpts){
		    						if(newValue.value){//选中
		    							Ext.getCmp("sanyuan").show();
		    						}else{
		    							Ext.getCmp("sanyuan").hide();
		    						}
		    					
		    					}
		    				
		    				}
		    			}
	    			},{
	    				border:false,
	    				style:"margin-top:6px;",
	    				width:'100%',
	    				items:{
		    				xtype:'checkbox',
		    				id:'systemPwdStrength',
		    				boxLabel :local.init.codeStrengthOpen+'&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#666;">'+local.init.codeStrengthOpenMore+'</span>'
		    			}
	    			},{
	    				xtype : 'label',
	    				style:"margin-top:10px",
	    				html:local.init.adminSuper,
	    				border:false,
	    				width : '98%'
	    			},{
	    				xtype:'panel',
	    				border:false,
	    				style:"margin-top:6px;border:1px solid #eee;",
	    				padding:'10 10 5 10',
	    				layout: 'column',
	    				width:'100%',
	    				items:[{
	    			        border:false,
	    			        columnWidth:.45,
	    					items:[
	    						{xtype:'textfield',id:'adminPwd',inputType:'password',fieldLabel:local.init.userPassword},
	    						{xtype:'textfield',id:'adminConfirmPwd',inputType:'password',fieldLabel:local.init.userPasswordConfirm},
	    		        		{xtype:'textfield',id:'adminEmail',fieldLabel:local.init.email}
	    					]
	    				},{
	    					border:false,
	    					columnWidth:.5,
	    					html:'<span style="font-size:14px;color:#666;">'+local.init.platformSystem+'</span>'
	    				}]
	    			},{
	    				xtype:'panel',
	    				border:false,
	    				style:"margin-top:6px;border:1px solid #eee;",
	    				padding:'10 10 5 10',
	    				id:'sanyuan',
	    				hidden:true,
	    				layout: 'vbox',
	    				width:'100%',
	    				items:[{
			    				xtype : 'label',
			    				html:local.init.audit,
			    				border:false,
			    				width : '98%',
			    				height : 20
			    			},{
			    				xtype:'panel',
			    				style:"margin-top:6px;border:1px solid #eee",
			    				padding:'10 10 5 10',
			    				border:false,
			    				width:"100%",
			    				layout: 'hbox',
			    				items:[{
			    			        border:false,
			    			        width:300,
			    					items:[
			    						{xtype:'textfield',id:'auditorPwd',inputType:'password',fieldLabel:local.init.userPassword},
			    						{xtype:'textfield',id:'auditorConfirmPwd',inputType:'password',fieldLabel:local.init.userPasswordConfirm},
			    		        		{xtype:'textfield',id:'auditorEmail',fieldLabel:local.init.email}
			    					]
			    				},{
			    					border:false,
			    					flex:1,
			    					html:'<span style="font-size:14px;color:#666;">'+local.init.auditMore+'</span>'
			    				}]	
			    			},{
			    				xtype : 'label',
			    				style:"margin-top:12px",
			    				html:local.init.safety,
			    				border:false,
			    				width : '98%'
			    			},{
			    				xtype:'panel',
			    				style:"margin-top:6px;border:1px solid #eee;",
			    				padding:'10 10 5 10',
			    				border:false,
			    				layout: 'hbox',
			    				width:'100%',
			    				items:[{
			    			        border:false,
			    			        width:300,
			    					items:[
			    						{xtype:'textfield',id:'securityPwd',inputType:'password',fieldLabel:local.init.userPassword},
			    		        		{xtype:'textfield',id:'securityConfirmPwd',inputType:'password',fieldLabel:local.init.userPasswordConfirm},
			    		        		{xtype:'textfield',id:'securityEmail',fieldLabel:local.init.email}
			    					]
			    				},{
			    					border:false,
			    					flex:1,
			    					html:'<span style="color:#666">'+local.init.safetyMore+'</span>'
			    				}]	
			    			}]
	    			},{flex:1,border:false},{
	    				xtype:'panel',
	    				width : '100%',
	    				height:40,
	    				border:false,
	    				layout : 'hbox',
		    			style:'margin-top:15px',
	    				items :[ {
    			        	flex:1,border:false
    			        },{
	    					xtype:'button',
	    					text:local.btn.previous,
	    					height:40,
		    				cls:'btn_sec_gray',
	    					width:136,
	    					handler:function(){
	    						var initializationBeginId = Ext.getCmp('initializationBeginId');
	    						initializationBeginId.hide();
	    						var initializationCleckId = Ext.getCmp('initializationCleckId');
	    						initializationCleckId.show();
	    						var initializationConfigId = Ext.getCmp('initializationConfigId');
	    						initializationConfigId.hide();
	    						var initializationNetwork = Ext.getCmp('initializationNetwork');
	    						initializationNetwork.hide();
	    					}
	    				},{
	    					xtype:'button',
	    		        	text: local.btn.next,  
		    				cls:'btn_sec',
		    				style:'margin-left:10px',
	    		        	width:136,
	    		        	height:40,
	    		        	handler:function(){
	    		        		if(checkUserPwd()){
	    							var initializationBeginId = Ext.getCmp('initializationBeginId');
	    							initializationBeginId.hide();
	    							var initializationCleckId = Ext.getCmp('initializationCleckId');
	    							initializationCleckId.hide();
	    							var initializationConfigId = Ext.getCmp('initializationConfigId');
	    							initializationConfigId.hide();
	    							var initializationNetwork = Ext.getCmp('initializationNetwork');
	    							initializationNetwork.show();
	    		            	}
	    					}
	    				}]
	    			}]
	       }
	       ]

});

//存储器配置说明
var storageInfo = '<div style="font-size:14px;color:#666;">'+local.init.SCMserverIP+'</div>';

//网络配置
 Ext.define('websure.initialization.view.InitializationNetwork', {
	extend : 'Ext.panel.Panel',
	width : '100%',
	height : '100%',
	border : false,
	alias : 'widget.InitializationNetwork',
	layout:'hbox',
	items:[
	       {
	    	   xtype:'panel',
	    	   width:170,
	    	   height:'100%',
	    	   border:false,
	    	   html:"<div class='pro'>"+local.init.environmental+"<br>"+local.init.administratorsConfig+"<br><span>"+local.init.LAN+"</span><br>"+local.init.startConfiguration+"</div>"
	       },
	       {
	    	   xtype:'panel',
	    	   layout:'vbox',
	    	   height:"100%",
	    	   flex:1,
	    	   border:false,
	    	   padding:'20 40 20 20',
	    	   items :[{
	    		   			height:40,
							xtype : 'label',
							style:"font-weight:bold;font-size:16px;",
							text:local.init.LAN
	},{
		xtype:'panel',
		//height:300,
		style:"margin-top:10px;border:1px solid #eee",
		border:false,
		layout: 'hbox',
		padding:'10 10 5 10',
		width:'100%',
		items:[{
	        border:false,
	        width:318,
	        defaults:{width:230,xtype:'textfield'},
			items:[
				{id:'LanIp',fieldLabel:local.init.firstIP},
				{id:'NetIp',fieldLabel:local.init.secondIP}
			]
		},{
			border:false,
			flex:1,
			margin:"0 0 0 10",
			html: storageInfo
		}]
	},{flex:1,border:false},{
		xtype:'panel',
		width : '100%',
		height : 40,
		border:false,
		style:'margin-top:15px',
		layout : 'hbox',
		items :[ {
        	flex:1,border:false
        },{
			xtype:'button',
			text:local.btn.previous,
			height:40,
			width:136,
			cls:'btn_sec_gray',
			columnWidth:0.1,
        	handler:function(){
				var initializationCleckId = Ext.getCmp('initializationCleckId');
				initializationCleckId.hide();
        		var initializationConfigId = Ext.getCmp('initializationConfigId');
				initializationConfigId.show();
				var initializationNetwork = Ext.getCmp('initializationNetwork');
				initializationNetwork.hide();
			}
		},{
			xtype:'button',
        	text: local.init.complete,  
    		style:'margin-left:10px',
        	height:40,
			width:136,
			cls:'btn_sec',
        	handler:function(){
        		if(checkMedia()){
        			//保存账号配置及网络配置值
        			getUserAndNetWorkValue();
	        		var initializationListId = Ext.getCmp('initializationListId');
		  			initializationListId.removeAll();
		  			initializationListId.add({
		  				xtype : 'InitializationEnd'
		  			});
		  			initializationListId.doLayout();
        		}
        	}
		}]
			
	}]}]
});

var timeoutProcess;    //进度条时间函数
var value;    //进度条状态
var bool = true;
//开始配置
 Ext.define('websure.initialization.view.InitializationEnd', {
	extend : 'Ext.panel.Panel',
	width : '100%',
	height : "100%",
	border : false,
	alias : 'widget.InitializationEnd',
	layout : 'hbox',
	items:[
	       {
	    	   xtype:'panel',
	    	   width:170,
	    	   height:'100%',
	    	   border:false,
	    	   html:"<div class='pro'>"+local.init.environmental+"<br>"+local.init.administratorsConfig+"<br>"+local.init.LAN+"<br><span>"+local.init.startConfiguration+"</span></div>"
	       },
	       {
	    	   xtype:'panel',
	    	   layout:'vbox',
	    	   flex:1,
	    	   height:"100%",
	    	   border:false,
	    	   padding:'60 40 20 40',
	    	   layout:"vbox",
			   items :[{
					xtype : 'label',
					style:"font-weight:bold;font-size:18px;text-align:center;color:#000;",
					id:"initTitle",
					html:"<div style='line-height:32px;height:32px;background:url(/images/initialization/loading.gif) no-repeat 250px top'>"+local.init.configing+"</div>",
					border: false,
					width : '100%',
					height:60
				},{					
					xtype:'panel',
					width : '100%',
					flex:1,
					border: false,
					layout:"fit",
					items:[{
						border:false,
						html:'<div id="progressBars" width="100%"></div></br>' +
						"<div id='progressMsgId' style='height:440px;overflow-y:auto;border:1px solid #eee;padding:10px;line-height:28px'></div>",
					 listeners:{
						 'afterrender':function(){
							// 添加进度条
							var progressBarId = Ext.create("Ext.ProgressBar", {
								id: "progressBarId",
								text: local.init.preparation,
								height: 25,
								border: false,
								renderTo: 'progressBars',
								listeners:{
									afterrender: function() {
										// 预加载一个错误的图片，用于网络错误后显示
										var img = new Image();
										img.src = "/images/initialization/icon_error.png";
										// TODO
										start();
										getProgress();
									}
								}
							 });
						 }
					 }
					}]
				}]
			}]
});

 

// 开始
function start(){
	
	var userTemp = userPwd + "," + auditorPwd + "," + securityPwd;
	var userTempe = userEmail + "," + auditorEmail + "," + securityEmail;
 	if(systemPwdStrength){
		systemPwdStrength = 1;
		systemPwdType = 1;
		isPwdCheck = 1;
	}else{
		systemPwdStrength = 0;
		systemPwdType = 0;
		isPwdCheck = 0;
	}
	if(serverConfigManagerMode){
		serverConfigManagerMode = 1;
	}else{
		serverConfigManagerMode = 0;
	}
	
	Ext.Ajax.request({
		method : 'post',
		url: '/initialization/toInitialization!start.action',
		params : {
			'password':userTemp,
			'email':userTempe,
			'serverConfig.isPwdCheck':systemPwdStrength,
			'serverConfig.serverBackupIP':NetIp,
			'serverConfig.serverHostIP':LanIp,
			'serverConfig.pwdCheckType':systemPwdType,
			'serverConfig.isPwdCheck':isPwdCheck,
			'serverConfig.serverConfigManagerMode':serverConfigManagerMode
		},
		timeout:1000,
		failure : function (response, opts){
//			getProgress();
		}
	})
}
// 获取进度
function getProgress() {
	setTimeout(function(){
		Ext.Ajax.request({
			method : 'post',
			url: '/initialization/toInitialization!getProgress.action',
			timeout:1000,
			failure : function (response, opts){
//				getProgress();
				var contentBox = document.getElementById("progressMsgId");
				var html = contentBox.innerHTML;
				var errorImg = "<img src='/images/initialization/icon_error.png'>";
				contentBox.innerHTML = html + "<div>" + errorImg + "网络错误，请检查网络后重试！" + "</div>";
			},
			success: function (response){
				var result = JSON.parse(response.responseText);
				
				var inProgress = result.inProgress;
				var percent = result.percent;
				var msg = result.msg;
				var progressBar = Ext.getCmp("progressBarId");
				// 刷新进度条
				progressBar.updateProgress(percent/100, percent+"%", true);
				// 刷新信息
				var contentBox = document.getElementById("progressMsgId");
				var html = "";
				
				var loadingImg = "<img src='/images/initialization/icon_loading.gif'>";
				var completeImg = "<img src='/images/initialization/icon_right.png'>";
				var errorImg = "<img src='/images/initialization/icon_error.png'>";
				for (var i=0;i<msg.length;i++){
					var content = msg[i];
					switch(content.state){
					case 1:	// complete
						html += "<div>" + completeImg + content.msg +"</div>";
						break;
					case 2:	// loading
						html += "<div>" + content.msg + "&nbsp;&nbsp;" + loadingImg +"</div>"
						break;
					case -1:	// error
						html += "<div>" + errorImg + content.msg + "</div>";
						break;
					}
					
				}
				contentBox.innerHTML = html;
				
				if(inProgress && percent != 100){
					getProgress();
				} else if(!inProgress && percent == 100){
					LoadInitializationFinish();
				}
			}
		})
	},1000);
	
}

function LoadInitializationFinish(){
	var initializationListId = Ext.getCmp('initializationListId');
	initializationListId.removeAll();
	initializationListId.add({
		xtype : 'InitializationFinish'
	});
}
 
Ext.define('websure.initialization.view.InitializationFinish', {
 	extend : 'Ext.panel.Panel',
	width : '100%',
	height : "100%",
	border : false,
	alias : 'widget.InitializationFinish',
	id: 'initializationFinish',
    bodyStyle: {
        background: 'url(/images/initialization/bg_welcome.png) no-repeat'
    },
	items :[
	        {
	        	xtype:'panel',
	        	border:false,
	        	width:'100%',
	        	style:'margin-top:200px;',
	        	bodyStyle:'background:none;',
	        	html:"<div class='font_h1'>"+local.init.setupCompleted+"&nbsp;:)</div><div class='font_h22'>"+local.init.operationsExperience+"</div>"
	        },
	        {
	    		xtype:'button',
	    		text:local.init.platform,
	    		width:260,
	    		height:55,
	    		cls:'btn_first',
	    		style:'margin:150px 0 0 352px;',
	    		handler :function(){
					window.location="/login.jsp";    			
	    		}
	    	}
	        ]
 })
 
/*
 * 去除单引和双引符号
 */
function regExpSign(txtValue)
{
    return txtValue.replace(/('+)|("+)/g,"");
}
/*
 * 去除空格
 */
function regExpTrim(txtValue)
{
    return txtValue.replace(/(\s+)/g,"");
}
/*
 * 验证非空 txtObj为验证对象
 */
function validNotNull(txtObj){
	txtObj = regExpSign(txtObj);
	txtObj = regExpTrim(txtObj);
	var flag=/^.+$/.test(txtObj);		
	return flag;
}
/*
 * 验证IP txtObj为验证对象
 */
 function validIp(txtObj){ 
   flag=/^([1-9]|[1-9]\d|1\d{2}|2[0-1]\d|22[0-3])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/.test(txtObj);  
   return flag;
 }
/*
 *  验证用户名称复杂度
 */
 function validUserNameorPwd(txtObj){ 
   //flag=/^([\u4e00-\u9fa5]{2,8})|(\w{4,15}[a-z0-9])(? <!\d{4,16})$/.test(txtObj);  
//   flag = /^[a-zA-Z0-9\u4e00-\u9fa5][a-zA-Z0-9_\u4E00-\u9FA5]{7,15}$/.test(txtObj)
   flag = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}$/.test(txtObj)
   return flag;
}
/*
 * 验证电子邮件 txtObj为验证对象
 */
 function validEmail(txtObj){
//	var regExp = /^[a-zA-Z0-9][a-zA-Z0-9_]{0,15}@[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    var regExp = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/;
    var flag = regExp.test(txtObj);  
    return flag;
}

/*
 * 验证管理员密码
 */
function checkUserPwd(){
	var systemPwdStrength_value = Ext.getCmp("systemPwdStrength").checked;
	var serverConfigManagerMode_value = Ext.getCmp("serverConfigManagerMode").checked;//获取是否使用三员

	var adminPwd_value 			= Ext.getCmp("adminPwd").getValue();
	var adminConfirmPwd_value  	= Ext.getCmp("adminConfirmPwd").getValue();
	var adminEmail_value  		= Ext.getCmp("adminEmail").getValue();
	 
	var auditorPwd_value  		= Ext.getCmp("auditorPwd").getValue();
	var auditorConfirmPwd_value = Ext.getCmp("auditorConfirmPwd").getValue();
	var auditorEmail_value  	= Ext.getCmp("auditorEmail").getValue();
	 
	var securityPwd_value  		= Ext.getCmp("securityPwd").getValue();
	var securityConfirmPwd_value = Ext.getCmp("securityConfirmPwd").getValue();
	var securityEmail_value  	= Ext.getCmp("securityEmail").getValue();
	
	if(systemPwdStrength_value){//启用密码强度
		if(!validUserNameorPwd(adminPwd_value)){
			Ext.Msg.alert(local.window.tip,'admin'+local.init.passwordStrength);
			return false;
		}
		if(adminPwd_value != adminConfirmPwd_value){
			Ext.Msg.alert(local.window.tip,'admin'+local.init.twoPassnoMatch);
			return false;
		}
		if(adminPwd_value.length > 25){
			Ext.Msg.alert(local.window.tip,'admin'+local.init.passwordLength);
			return false;
		}
		
		if(!validNotNull(adminEmail_value)){
			Ext.Msg.alert(local.window.tip,'admin'+local.init.emailNoNull);
			return false;
		}
		
		//admin email
		if(validNotNull(adminEmail_value) && !validEmail(adminEmail_value)){
			Ext.Msg.alert(local.window.tip,'admin'+local.init.emailFormatError);
			return false;
		}
		if(serverConfigManagerMode_value){
			if(!validUserNameorPwd(auditorPwd_value)){
				Ext.Msg.alert(local.window.tip,'auditor'+local.init.passwordStrength);
				return false;
			}
			if(auditorPwd_value != auditorConfirmPwd_value){
				Ext.Msg.alert(local.window.tip,'auditor'+local.init.twoPassnoMatch);
				return false;
			}
			
			if(auditorPwd_value.length > 25){
				Ext.Msg.alert(local.window.tip,'auditor'+local.init.passwordLength);
				return false;
			}
			
			if(!validNotNull(auditorEmail_value)){
				Ext.Msg.alert(local.window.tip,'auditor'+local.init.emailNoNull);
				return false;
			}
			
			//auditor email
			if(validNotNull(auditorEmail_value) && !validEmail(auditorEmail_value)){
				Ext.Msg.alert(local.window.tip,'auditor'+local.init.emailFormatError);
				return false;
			}
			
			if(!validUserNameorPwd(securityPwd_value)){
				Ext.Msg.alert(local.window.tip,'security'+local.init.passwordStrength);
				return false;
			}
			if(securityPwd_value != securityConfirmPwd_value){
				Ext.Msg.alert(local.window.tip,'security'+local.init.twoPassnoMatch);
				return false;
			}
			if(securityPwd_value.length > 25){
				Ext.Msg.alert(local.window.tip,'security'+local.init.passwordLength);
				return false;
			}
			
			if(!validNotNull(securityEmail_value)){
				Ext.Msg.alert(local.window.tip,'security'+local.init.emailNoNull);
				return false;
			}
			
			//security email
			if(validNotNull(securityEmail_value) && !validEmail(securityEmail_value)){
				Ext.Msg.alert(local.window.tip,'security'+local.init.emailFormatError);
				return false;
			}
		}
		return true;
	}else{
		//admin pwd
		if(!validNotNull(adminPwd_value)){
			Ext.Msg.alert(local.window.tip,'admin'+local.init.passNoNll);
			return false;
		}
		if(validNotNull(adminPwd_value) || validNotNull(adminConfirmPwd_value)){
			if(adminPwd_value != adminConfirmPwd_value){
				Ext.Msg.alert(local.window.tip,'admin'+local.init.twoPassnoMatch);
				return false;
			}
		}
		
		if(adminPwd_value.length > 25){
			Ext.Msg.alert(local.window.tip,'admin'+local.init.passwordLength);
			return false;
		}
		
		if(!validNotNull(adminEmail_value)){
			Ext.Msg.alert(local.window.tip,'admin'+local.init.emailNoNull);
			return false;
		}
		
		//admin email
		if(validNotNull(adminEmail_value) && !validEmail(adminEmail_value)){
			Ext.Msg.alert(local.window.tip,'admin'+local.init.emailFormatError);
			return false;
		}
		if(serverConfigManagerMode_value){
			//auditor pwd
			if(!validNotNull(auditorPwd_value)){
				Ext.Msg.alert(local.window.tip,'auditor'+local.init.passNoNll);
				return false;
			}
			if(validNotNull(auditorPwd_value) || validNotNull(auditorConfirmPwd_value)){
				if(auditorPwd_value != auditorConfirmPwd_value){
					Ext.Msg.alert(local.window.tip,'auditor'+local.init.twoPassnoMatch);
					return false;
				}
			}
			
			if(auditorPwd_value.length > 25){
				Ext.Msg.alert(local.window.tip,'auditor'+local.init.passwordLength);
				return false;
			}
			
			if(!validNotNull(auditorEmail_value)){
				Ext.Msg.alert(local.window.tip,'auditor'+local.init.emailNoNull);
				return false;
			}
			
			//auditor email
			if(validNotNull(auditorEmail_value) && !validEmail(auditorEmail_value)){
				Ext.Msg.alert(local.window.tip,'auditor'+local.init.emailFormatError);
				return false;
			}
			//security Pwd
			if(!validNotNull(securityPwd_value)){
				Ext.Msg.alert(local.window.tip,'security'+local.init.passNoNll);
				return false;
			}
			if(validNotNull(securityPwd_value) || validNotNull(securityConfirmPwd_value)){
				if(securityPwd_value != securityConfirmPwd_value){
					Ext.Msg.alert(local.window.tip,'security'+local.init.twoPassnoMatch);
					return false;
				}
			}
			
			if(securityPwd_value.length > 25){
				Ext.Msg.alert(local.window.tip,'security'+local.init.passwordLength);
				return false;
			}
			
			if(!validNotNull(securityEmail_value)){
				Ext.Msg.alert(local.window.tip,'security'+local.init.emailNoNull);
				return false;
			}
			
			//security email
			if(validNotNull(securityEmail_value) && !validEmail(securityEmail_value)){
				Ext.Msg.alert(local.window.tip,'security'+local.init.emailFormatError);
				return false;
			}
		}
	}
	return true;
}

/*
 * 验证网络配置
 */
function checkMedia(){
	var LanIp_value = Ext.getCmp("LanIp").getValue();
	var NetIp_value = Ext.getCmp("NetIp").getValue();
	
	if(!validNotNull(LanIp_value)){
		Ext.Msg.alert(local.window.tip,local.init.addressnoempty);
		return false;
	}
	if(validNotNull(LanIp_value) && !validIp(LanIp_value)){
		Ext.Msg.alert(local.window.tip,local.init.addressFormatError);
		return false;
	}
	//check netip
	if(!validNotNull(NetIp_value)){
		Ext.Msg.alert(local.window.tip,local.init.IPaddressempty);
		return false;
	}
	if(validNotNull(NetIp_value) && !validIp(NetIp_value)){
		Ext.Msg.alert(local.window.tip,local.init.AddressError);
		return false;
	}
	return true;
}

/*
 * getVaule
 */
var userPwd,userEmail,auditorPwd,auditorEmail,securityPwd,securityEmail;
var LanIp,NetIp,systemPwdStrength,isPwdCheck,systemPwdType,serverConfigManagerMode;
function getUserAndNetWorkValue(){
	systemPwdStrength = Ext.getCmp("systemPwdStrength").checked;
	serverConfigManagerMode = Ext.getCmp("serverConfigManagerMode").checked;//获取是否使用三员
	userPwd  = Ext.getCmp("adminPwd").getValue();
	userEmail = Ext.getCmp("adminEmail").getValue();
	
	auditorPwd  = Ext.getCmp("auditorPwd").getValue();
	auditorEmail = Ext.getCmp("auditorEmail").getValue();
	
	securityPwd  = Ext.getCmp("securityPwd").getValue();
	securityEmail = Ext.getCmp("securityEmail").getValue();

	LanIp = Ext.getCmp("LanIp").getValue();
	NetIp = Ext.getCmp("NetIp").getValue();
}