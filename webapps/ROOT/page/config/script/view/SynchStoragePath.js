/**
 * author:yangbobin
 * date:2016-8-31
 * desc:介质同步UI
 */
 /**
  * 定义介质同步主页面
  */
Ext.define('acesure.config.view.SynchStoragePath',{
    extend : 'Ext.panel.Panel',
    border : false,
    alias : 'widget.synchStoragePath',
    id : 'synchStoragePath',
    layout : 'vbox',
    items : [{
        width:"100%",
        height : 108,
        style:'background:#fafbfc;border:0;border-bottom:1px solid #e3eaec',
        defaults:{bodyStyle:'background:#fafbfc'},
        padding:'0 25 0 25',
        xtype : 'synchStPathInfoBar'
    },{
       width : "100%",
       flex:1,
       border : false,
       xtype : 'synchStPathInfoGridPanel'
    }]
});

/**
 * 介质同步标题toolbar
 */
Ext.define('acesure.config.view.SynchStPathInfoBar', {
    extend : 'Ext.Toolbar',
    id:'synchStPathInfoBar',
    alias : 'widget.synchStPathInfoBar',
    items : [ {
        xtype : "panel",
        border : false,
        width : 48,
        height : 42,
        html : '<img src="/images/config/media.png"/>'
    }, {
        xtype : "panel",
        width:250,
        border : false,
        html : '<font class="font_h3">'+local.config.synConfig+'</font>'
    }, "->", {
        xtype : 'button',
        text : local.config.creatSyn,
        id : 'addSynchStPath',
        itemId : 'systemconfig_syncmedium_addsyncmedium  ',
        style:'padding-left:26px',
        icon : '/images/common/new_16.png',
        action: 'power'
    }],
	listeners:{
		render : function(v,eOpts){
			//控制页面按钮权限
            POWER_OP.filterEnableWidgetsOfExtjs(v, CURRENT_USER.getSystemPower());
		}
	}
});

/**
 * 介质同步配置表格展示组件
 */
Ext.define('acesure.config.view.SynchStPathInfoGridPanel',{
    extend : 'Ext.grid.GridPanel',
    alias : 'widget.synchStPathInfoGridPanel',
    id : 'synchStPathInfoGridPanel',
    initComponent : function(){
    	var me = this;
    	Ext.applyIf(me,{
    	       store : 'SynchStoragePathStore',
    	       columns : [{
    	           dataIndex : 'id',
    	           hidden : true
    	       },{
    	           xtype : 'rownumberer',
    	           header : local.config.rowNum,
                   align : 'center',
                   width:'5%'
    	       },{
    	           header :local.config.sourceVMS,
    	           dataIndex : 'src',
    	           width:'15%'
    	       },{
    	           header : local.config.targetVMS,
                   dataIndex : 'dest',
                   width:'15%'
    	       },{
    	           header : local.config.synPlan,
    	           dataIndex : 'planDay_show',
    	           width:'25%'
    	       },{
    	           header : local.config.runTimeArea,
    	           dataIndex : 'timeArea',
    	           width : '15%'
    	       },{
    	           header : local.config.backupTimeRate,
    	           dataIndex : 'interval',
    	           width : '10%'
    	       },{
    	           header : local.btn.operate,
    	           flex : 1,
    	           renderer : function(value,cellmeta,record,rowIndex,columnIndex,store){
    	           	   var synchId = record.data['id'];
    	           	   var status=record.data['status'];
    	           	   var startOper;
    	           	   var stopOper;
    	           	   var delOper;
    	           	   if(status==0){
        	           	   startOper = "<a href='javascript:void(0);' name= 'systemconfig_syncmedium_startsyncmedium' onclick='startSyncStorage("+synchId+");'  style='text-decoration:none;color:#00ACAE'>启动</a>&nbsp;&nbsp;";
                           stopOper = "<a href='javascript:void(0);' name= 'systemconfig_syncmedium_stopsyncmedium'  style='text-decoration:none;color:#CCC'>停止</a>&nbsp;&nbsp;";
                           delOper = "<a href='javascript:void(0);' name= 'systemconfig_syncmedium_delsyncmedium' onclick='delSynchSet("+synchId+");' style='text-decoration:none;color:#00ACAE'>"+local.btn.delete0+"</a>&nbsp;&nbsp;";
    	           	   }else{
        	           	   startOper = "<a href='javascript:void(0);' name= 'systemconfig_syncmedium_startsyncmedium' style='text-decoration:none;color:#CCC'>启动</a>&nbsp;&nbsp;";
                           stopOper = "<a href='javascript:void(0);' name= 'systemconfig_syncmedium_stopsyncmedium' onclick='stopSyncStorage("+synchId+");' style='text-decoration:none;color:#00ACAE'>停止</a>&nbsp;&nbsp;";
                           delOper = "<a href='javascript:void(0); ' name= 'systemconfig_syncmedium_delsyncmedium' style='text-decoration:none;color:#CCC'>"+local.btn.delete0+"</a>&nbsp;&nbsp;";
    	           	   }
    	           	   return '<div>'+startOper+stopOper+delOper+'</div>';
    	           }
    	           
    	       }],
    	       dockedItems: [{                                 
                                xtype: 'pagingtoolbar',
                                store: 'SynchStoragePathStore',  
                                dock: 'bottom', 
                                emptyMsg: local.toobarEmptyMsg,
                                displayInfo: true,
                                displayMsg: local.toolbarDisplayMsg,
                                beforePageText: local.toolbarBeforePageText,
                                afterPageText: local.toolbarAfterPageText,
                                listeners:{
                                    change: function(v, data, eOpts){
                                        if(data==null){
                                            v.moveFirst();
                                        }   
                                        POWER_OP.filterEnableDomsInGridpanelColumnOfExtjs(v.up('panel'), CURRENT_USER.getSystemPower());
                                    }
                                }
                            }]
    	});
    	me.callParent(arguments);
    },
	listeners:{
		afterrender:function(v){
			POWER_OP.filterEnableDomsInGridpanelColumnOfExtjs(v,CURRENT_USER.getSystemPower());
		}
	}
});

/**
 * 新增介质同步Windos
 */
Ext.define('acesure.config.view.SynchStPathAddWin',{
    extend : 'Ext.window.Window',
    alias : 'widget.synchStPathAddWin',
    id : 'synchStPathAddWin',
    resizable : false,
    draggable:false,
    width : 650,
    height : 540,
    border : false,
    title : local.config.creatSyn,
    modal : true,
    items : [{
        width:"100%",
        height:300,
        xtype:'panel',
        padding:20,
        border : false,
        layout:'hbox',
        items:[{
        	flex:1,
        	height:"100%",
            xtype:'panel',
            border:false,
            layout:'vbox',
            items:[{
            	xtype:'label',
            	width:"100%",
            	height:25,
                html:local.config.sourceVMS
            },{
            	flex:1,
            	width:'100%',
                xtype:'sourceStoragePathTree',
                listeners : {
					afterrender:function(){
						Ext.getCmp("sourceStoragePathTree").store.setProxy({  
				            type : 'ajax',
					        url : '/config/toSynchStPath!getSourceStoPath.action',
					        reader : {
					            type : 'json',
					            root: 'children'
					        }
				        });
						Ext.getCmp("sourceStoragePathTree").store.load();
					},
		        checkchange:function(node, checked,obj){
		            var checkedNodes = this.getChecked();
//			   				alert(node.get('id'));
				    for(var i=0;i<checkedNodes.length;i++){
		                  var n = checkedNodes[i];
		                  if(node.get("id") != n.get("id")){
		                      n.set("checked" , false);
		                  }
		               }
		    	}
            }
        }
        ]},{
        	xtype:"label",
        	width:30,
        	height:"100%",
        	padding:"130 0 0 5",
        	border:false,
            html:'>>'
        },{
        	flex:1,
        	height:"100%",
            xtype:'panel',
            layout:'vbox',
            border:false,
            items:[{
                xtype:'label',
                width:"100%",
                height:25,
                html:local.config.targetVMS
            },{
                flex:1,
                width:'100%',
                xtype:'targetStoragePathTree',
                listeners : {
					afterrender:function(){
						Ext.getCmp("targetStoragePathTree").store.setProxy({  
				             type : 'ajax',
					        url : '/config/toSynchStPath!getTargetStoPath.action',
					        reader : {
					            type : 'json',
					            root: 'children'
					        }
				        })
						Ext.getCmp("targetStoragePathTree").store.load();
					},
			        checkchange:function(node, checked,obj){
			            var checkedNodes = this.getChecked();
					    for(var i=0;i<checkedNodes.length;i++){
			                  var n = checkedNodes[i];
			                  if(node.get("id") != n.get("id")){
			                      n.set("checked" , false);
			                  }
			               }
			    	}
            	}
            }]
        }]
    },{
        xtype:'fieldset',
        title: local.config.synPlan,
        margin:"-10 20 10 20",
        id:'planDay',
        collapsible: false,
        autoHeight:true,
        height : 60,
        labelWidth:80,
        hidden:true,
        items:[{
                xtype: 'textfield',
                id: 'synchId',
                hidden: true
            },{
                xtype:'panel',
                layout: 'column',
                border:false,
                items:[
                    {
                        columnWidth:.14,
                        layout: 'form',
                        border:false,
                        labelWidth:1,
                        items:{xtype:'checkbox',value : 1,id:'Sunday',boxLabel:local.sun}
                    },{
                        columnWidth:.14,
                        layout: 'form',
                        border:false,
                        labelWidth:1,
                        items:{xtype:'checkbox',value : 2,id:'Monday',boxLabel:local.mon}
                    },{
                        columnWidth:.14,
                        layout: 'form',
                        border:false,
                        labelWidth:1,
                        items:{xtype:'checkbox',value : 4,id:'Tuesday',boxLabel:local.tue}
                    },{
                        columnWidth:.14,
                        layout: 'form',
                        border:false,
                        labelWidth:1,
                        items:{xtype:'checkbox',value : 8,id:'Wednesday',boxLabel:local.wed}
                    },{
                        columnWidth:.14,
                        layout: 'form',
                        border:false,
                        labelWidth:1,
                        items:{xtype:'checkbox',value : 16,id:'Thursday',boxLabel:local.thu}
                    },{
                        columnWidth:.14,
                        layout: 'form',
                        border:false,
                        labelWidth:1,
                        items:{xtype:'checkbox',value : 32,id:'Friday',boxLabel:local.fri}
                    },{
                        columnWidth:.14,
                        layout: 'form',
                        border:false,
                        labelWidth:1,
                        items:{xtype:'checkbox',value : 64,id:'Saturday',boxLabel:local.sat}
                    }
                ]
            }
        ]
    },{
        xtype:'fieldset',
        title: local.config.runTimeArea,
        id:'timeArea',
        margin:"0 20 20 20",
        collapsible: false,
        autoHeight:true,
        labelWidth:30,
        height : 60,
        items:[{
                xtype:'panel',
                layout: 'column',
                border:false,
                items:[{width:"50%",editable:false,xtype:'timefield',labelWidth:80,fieldLabel:local.config.beginTime,increment:5,id:'beginTime',format:'H:i',value:'00:00'},
                       {width:"50%",editable:false,xtype:'timefield',labelWidth:80,fieldLabel:local.config.overTime,increment:5,id:'endTime',format:'H:i',value:'23:45'}
                      ]
        }]
    }, {
 	   width:600,
       margin:"0 20 20 20",
	   border:false,
	   layout:'column',
	   items:[{
			xtype:'displayfield',
			id:'interval_time_display',
			checked : true,
			value : local.config.synTimeRate+"&nbsp;"
		},{
			xtype:'textfield',
			id:'intervalTime',
			fieldLabel:'',
			value:'5',
			width:50,
			editable:false
		},{
			xtype:'combo',
			editable : false,
			id:'intervalType',
			width:50,
			margin:'0 0 0 4',
			valueField: 'ID', 
			displayField: 'NAME',
			mode: 'local', 
			triggerAction: 'all',
			store:new Ext.data.SimpleStore({
				fields: ['ID', 'NAME'],
				data: [[1,local.m], [2,local.hour], [3,local.day]]
			}),
			 listeners: {
					afterRender: function(combo) {
					combo.setValue(1);//同时下拉框会将与name为firstValue值对应的 text显示
					}  
				}
		}]
   }],
    buttons : [ {
                text : local.btn.save,
                cls:"btn_focus",
                id : 'synchStPathAdd',
                handler:function(){
						var sou = Ext.getCmp('sourceStoragePathTree').getChecked();
//				        console.log("源介质长度"+sou.length);
				        if(0 == sou.length){
				        	Ext.MessageBox.alert(local.window.tip,local.config.chooseSyn);
				        	return;
				        }/*else{
				        	console.log("源介质"+sou[0].data.text);
				        }*/
				        
				        var tar = Ext.getCmp('targetStoragePathTree').getChecked();
//				        console.log("目标介质长度"+tar.length);
				        if(0 == tar.length){
				        	Ext.MessageBox.alert(local.window.tip,local.config.chooseTargetSyn);
				        	return;
				        }/*else{
				        	console.log("目标介质"+tar[0].data.text);
				        }*/
				        
				        if(sou[0].data.text == tar[0].data.text){
				        	Ext.MessageBox.alert(local.window.tip,local.config.synNoOneVms);
				        	return;
				        }
				        
				        if(tar[0].raw.size<sou[0].raw.size){
				        	Ext.MessageBox.alert(local.window.tip,local.config.synSizeTip);
				        	return;
				        }
				        
				        var souSto = sou[0].data.text.split(":")[0];
				        var tarSto = tar[0].data.text.split(":")[0];
				        
				       //同步时间
				        var Sunday_checked = Ext.getCmp("Sunday").checked;
				        var Monday_checked = Ext.getCmp("Monday").checked;
				        var Tuesday_checked = Ext.getCmp("Tuesday").checked;
				        var Wednesday_checked = Ext.getCmp("Wednesday").checked;
				        var Thursday_checked = Ext.getCmp("Thursday").checked;
				        var Friday_checked = Ext.getCmp("Friday").checked;
				        var Saturday_checked = Ext.getCmp("Saturday").checked;
				       /* if(!Sunday_checked && !Monday_checked && !Tuesday_checked && !Wednesday_checked && !Thursday_checked && !Friday_checked && !Saturday_checked){
								Ext.MessageBox.alert(local.window.tip,local.config.synChooseTimeTip);
								return;
						}*/
						
						var weekDays = 0;
						//var weekDayArray = new Array(0,0,0,0,0,0,0);
						
						if(Sunday_checked) {
							//weekDayArray[0]= 1;
							weekDays += 1;
						}
						if(Monday_checked) {
							//weekDayArray[1]= 1;
							weekDays += 2;
						}
						if(Tuesday_checked) {
							//weekDayArray[2]= 1;
							weekDays += 4;
						}
						if(Wednesday_checked) {
							//weekDayArray[3]= 1;
							weekDays += 8;
						}
						if(Thursday_checked) {
							//weekDayArray[4]= 1;
							weekDays += 16;
							
						}
						if(Friday_checked) {
							//weekDayArray[5]= 1;
							weekDays += 32;
						}
						if(Saturday_checked) {
							//weekDayArray[6]= 1;
							weekDays += 64;
						}
					//运行时间范围
					var startTime = Ext.getCmp("beginTime").getValue();
					var endTime = Ext.getCmp("endTime").getValue();
					if(startTime>=endTime){
						Ext.MessageBox.alert(local.window.tip,"开始时间要小于结束时间！");
						return;
					}
					//间隔时间
					var intervalTimesrc = Ext.getCmp("intervalTime").getValue();
					var intervalTypesrc = Ext.getCmp("intervalType").getValue();
					if("" == intervalTimesrc){
						Ext.MessageBox.alert(local.window.tip,local.config.timeRateIn);
						return;
					}else {
						if(intervalTimesrc<=0||!(parseInt(intervalTimesrc)==intervalTimesrc)){
							Ext.MessageBox.alert(local.window.tip,"同步间隔时间非法！");
							return false;
						}else{
							if(intervalTypesrc==1&&intervalTimesrc>60){
								Ext.MessageBox.alert(local.window.tip,"最大间隔时间为60分");
								return false;
							}else if(intervalTypesrc==2&&intervalTimesrc>24){
								Ext.MessageBox.alert(local.window.tip,"最大间隔时间为24小时");
								return false;
							}else if(intervalTypesrc==3&&intervalTimesrc>365){
								Ext.MessageBox.alert(local.window.tip,"最大间隔时间为365天");
								return false;
							}
						}
					
					}
					
					Ext.Ajax.request({
								
											url : '/config/toSynchStPath!saveSynchStorageStrategy.action',
											params : {
												"synchStoragePath.src" : souSto,
												"synchStoragePath.dest" : tarSto,
												"synchStoragePath.planDay":weekDays,
												//"synchStoragePath.planWeeks":weekDayArray,
												"synchStoragePath.planTime":startTime,
												"synchStoragePath.planEndTime":endTime,
												"synchStoragePath.intervalTime":intervalTimesrc,
												"synchStoragePath.intervalType":intervalTypesrc
											},
											timeout:100000,
											success : function(response, options) {
												var obj = Ext.decode(response.responseText);
												var code = obj.msgCode;
												var content = obj.msgContent;
												if(MSG_NORMAL==code){
													Ext.websure.MsgTip.msg(local.window.tip, content, true);
													Ext.getCmp("synchStPathAddWin").destroy();
													Ext.getCmp("synchStPathInfoGridPanel").getStore().load();
												}else{
													Ext.websure.MsgError(code, content);
												}
											},
											failure : function() {
												Ext.websure.MsgError("WF-30086",local.config.saveSynFailure);
											}
							});
                }
            }, {
                text : local.btn.cancle,
                handler : function() {
                    this.up('window').close();
                }
            } ]
});

/**
 * 源同步介质 树形选择组件面板
 */
Ext.define('acesure.config.view.SourceStoragePathTree',{
    extend:'Ext.tree.Panel',
    alias:'widget.sourceStoragePathTree',
    id:'sourceStoragePathTree', 
    useArrows:true,
    cls:"icon_radio",    //复选框改为单选框
    rootVisible:false,// 不可见根
    sortable:false,
    onlyLeafCheckable: true,
    checkModel:"single",
    store:"SourceStoragePathTreeStore",
    loadMask : {
        msg : local.loading
    },
    listeners:{
        checkchange:function(node, checked,obj){
                //todo:
        	}
    }
    
});

/**
 * 目标同步介质 树形选择组件面板
 */
Ext.define('acesure.config.view.TargetStoragePathTree',{
    extend:'Ext.tree.Panel',
    alias:'widget.targetStoragePathTree',
    id:'targetStoragePathTree',
    useArrows:true,
    cls:"icon_radio",    //复选框改为单选框
    rootVisible:false,// 不可见根
    sortable:false,
    onlyLeafCheckable: true,
    checkModel:"single",
    store:"TargetStoragePathTreeStore",
    loadMask : {
        msg : local.loading
    }
});

