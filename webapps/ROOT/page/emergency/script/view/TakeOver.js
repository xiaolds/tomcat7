//全局变量
//保存前一个数据集Id
var emPreLiId=null;
//保存当前数据集ID
var emLiId=null;
//上一个dl
var emPreEmDlId=null;
//当次Dl
var emDlId=null;
//serverName
var SERVERANME=null;
var AYTHORIZEEMERGENCY=null;
var CLUSTERIDENTITY = null;
var DEVICEID=null;
/**
* 应急管理，快照一览页面标题显示
* auth:wangshaodong
*/
Ext.define("acesure.recovery.view.EmergencyTopPanel",{
	extend : 'Ext.panel.Panel',
	alias : 'widget.EmergencyTopPanel',
	id : 'emergencyTopPanelId',
	bodyStyle: 'background:#fafbfc;',
	width : '100%',
	height : 108,
	border:false,
	style:'border:0;border-bottom:1px solid #d1dade',
	layout : 'hbox',
	items :[{
		xtype: "panel",
		width:400,
		itemId:"emergencyDisPlayId",
		border : false,
		padding:'25',
		bodyStyle: 'background:#fafbfc;',
		html: "<div><img style='display:block;float:left' src='/images/backup/pc_big_online_one.png'></img><div style='float:left;margin-left:4px;'><font class='font_h3'>"+local.emergency.hosComputer+"</font></br>192.168.1.110</div></div>"						 
	},{
		xtype: 'label',
		itemId:'emergencySysInfoId',
		//width:300,
		border:false,	
		padding:25,
		style:'color:#999;',
		html : local.systemInfo+':windows Service 2008<br/>'+local.version+':5.0.00.00015'
	},{
		flex:1,
		padding:30,
		border:false,	
		bodyStyle: 'background:#fafbfc;'
	},
	{
		xtype : 'button',
		id : 'fastEmergencyConfigId',
		border:false,
		height : 35,
		margin:"36 30 0 0",
		cls : 'btn_big',
		style : 'padding-left:22px;background:#0aa;border-color:#099;float:right',
		icon : '/images/common/set.png',
		text : local.emergency.preconfiguredFast,
		listeners:{
			afterrender:function(){
				var flag = JSON.stringify(CURRENT_USER.getEmergencyPower()).indexOf("emergency_urgent_takeoverauto");
				if(flag<0){
					Ext.getCmp("fastEmergencyConfigId").setDisabled(true);
					return;
				}
			}
		},
		handler:function(me,e){
			getVmModelInfoForUpdate(deviceId,type);
 	    }
	},{
		xtype: "panel",
		id:'emergencyBackId',
		border:false,
		width:56,
		html: "<div class='shrink' onclick='fadeout();'><img src='/images/backup/shrink.png' /></div>"
	}
	]

});

/**
 * 定义时间轴，根据一天之内的快照个数动态变化。
 * auth:wangshaodong
 */
Ext.define("acesure.recovery.view.EmergencySnapShotInfo",{
	extend:"Ext.panel.Panel",
	alias:"widget.EmergencySnapShotInfo",
	id:"emergencySnapShotInfoId",
	border : false,
	height:400,
	width:'100%',
	style:'border-bottom:1px solid #d1dade;',
	html:'',
	viewConfig : {forceFit : false},
	bodyStyle:"overflow-x:auto;padding:20px",
	listeners:{

	}
});
/**
* 应急管理，快照一览页，设备硬盘信息显示
* auth:wangshaodong
*/
Ext.define("acesure.recovery.view.EmergencyHardWareInfo",{
	extend:"Ext.panel.Panel",
	alias:"widget.EmergencyHardWareInfo",
	width : '100%',
	//height : 250,
	border : false,
	items:[{
		xtype : 'label',
		html : "<font class='font_t' style='margin:20px;margin-bottom:0;'>"+local.systemInfo+"</font>",
		width:"100%"
	},{
		xtype:"panel",
		width:"100%",
		border:false,
		style:'margin-top:20px;border-top:1px solid #d6d8da;',
		layout:'vbox',
		items: [{
			border:false,
			style:'border-bottom:1px solid #d6d8da',
			id:"emergencySnapShotPeriodId",
			width:'100%',
			html: ''
		},
		{ 
			border:false,
			width:'100%',
			id:"emergencyVmimgHardDiskInfoId",
			html:local.emergency.putPicture
		}
		]
	}],
	listeners:{
		afterrender:function(){
			//集群设备禁用快速接管设置
			if(CLUSTERIDENTITY){
				Ext.getCmp("fastEmergencyConfigId").setDisabled(true);
			}
			var vmimgHardDiskInfoId=Ext.getCmp("emergencyVmimgHardDiskInfoId");
			Ext.Ajax.request({
				url:'/recovery/mountAction!getVmimgDetailInfo.action',
				params:{deviceTreeId:deviceId}, 
				success: function(resp,opts) {
					var updateStr="";
					var hardDiskInfo=null;
					if(null!=resp.responseText){
						returnJson= JSON.parse(resp.responseText);
						hardDiskInfo=returnJson.detail;
						var minTime=returnJson.minTime;
						var dataCount=returnJson.dataCount;
						var vmimgCount=returnJson.vmimgCount;
						updateStr=updateStr+'<div style="padding:20px;border-bottom:1px solid #D6D8DA"><span class="font_t">'+local.backup.diskInfoGridInfo+'</span></div>';
						for(i=0;i<hardDiskInfo.length;i++){
							var checkLvm=hardDiskInfo[i].checkLvm;
							if(checkLvm==1){
								updateStr=updateStr+'<div class="list_grid2">'+'<span>['+'LVM'+local.comma+local.capacity+local.colon+hardDiskInfo[i].diskCapacity+']</span>';
							}else{
								updateStr=updateStr+'<div class="list_grid2">'+'<span>['+local.disk+local.colon+hardDiskInfo[i].diskIndex+local.comma+local.capacity+local.colon+hardDiskInfo[i].diskCapacity+']</span>';
							}
							
							var partInfo=hardDiskInfo[i].parInfo;
							if(null!=partInfo){
								var newStr="";
								for(j=0;j<partInfo.length;j++){
									newStr=newStr+'&nbsp;&nbsp;&nbsp;'+partInfo[j].lettr+':'+partInfo[j].partten+','+local.capacity+local.colon+partInfo[j].parSize;
								}
								updateStr=updateStr+"<label title='"+newStr+"'>"+newStr+"</label>";
							}
							updateStr=updateStr+'</div>';
						}
						vmimgHardDiskInfoId.update(updateStr);
						var periodStr='<div class="list_grid"><span>'+local.backup.snapPeriod+'</span>'+minTime+'-'+local.toNow+'</div>';
						periodStr=periodStr+'<div class="list_grid"><span >'+local.backup.snapPeriodCount+'</span>'+local.produce+dataCount+local.recovery.dataAll+vmimgCount+local.recovery.dataNum+'</div>';
						snapShotPeriodId.update(periodStr);
					}
				},
				failure: function(resp,opts) {

				}
			});
			var snapShotPeriodId=Ext.getCmp("emergencySnapShotPeriodId");
			var startTime='2015-01-05';
			var vmimgCount=$(".frame li dd").length;
			var dataCount=$(".frame li").length;
			var snapShotPeriodStr='<div class="list_grid">';
			snapShotPeriodStr=snapShotPeriodStr+'<span>'+local.backup.snapPeriod+'</span>';
			snapShotPeriodStr=snapShotPeriodStr+startTime+local.ripple+local.toNow+'</div>';
			snapShotPeriodStr=snapShotPeriodStr+'<div class="list_grid"><span >'+local.backup.snapPeriodCount+'</span>';
			snapShotPeriodStr=snapShotPeriodStr+local.produce+dataCount+local.recovery.dataAll+'</div>';
			snapShotPeriodId.update(snapShotPeriodStr);
			
		}
	}
});
/**
* 应急管理，快照一览页面标题显示，快照集时间轴显示
* auth:wangshaodong
*/
Ext.define("acesure.emergency.view.TakeOver",{
	extend:"Ext.panel.Panel",
	config:{
		clusterIdentity:"",
		deviceId:"",
		deviceName:"",
		uuid:"",
		sysInfo:"",
		version:"",
		authorizeEmergency:"",
		deviceType:""
	},
	alias:"widget.TakeOver",
	id:"takeOverId",
	height:720,
	width:"100%",
	border:false,
	overflowX:'auto',
	overflowY:'auto',
	viewConfig:{  
		loadMask:true  
	}, 
	items:[
	       {
	    	   xtype:"EmergencyTopPanel"
	       },
	       {
	    	   xtype : 'label',
	    	   id : 'emergencyStartDateId',
	    	   html : "",
	    	   width : '90%'
	       }, 
	       {
	    	   xtype:"EmergencySnapShotInfo"
	       },
	       {
	    	   xtype:"EmergencyHardWareInfo"
	       }
	       ],
	       listeners:{
	    	   afterrender:function(){
	    		 //保存前一个数据集Id
	    		  emPreLiId=null;
	    		   //保存当前数据集ID
	    		   emLiId=null;
	    		   //上一个dl
	    		   emPreEmDlId=null;
	    		   //当次Dl
	    		   emDlId=null;
	    		   //挂载页面头部显示
	    		   var mountTopPanel=Ext.getCmp("emergencyTopPanelId");
	    		   var disPlay=mountTopPanel.getComponent("emergencyDisPlayId");
	    		   var sysInfoPanel=mountTopPanel.getComponent("emergencySysInfoId");
	    		   var startDateId=Ext.getCmp("emergencyStartDateId");
	    		   var snapShotInfo=Ext.getCmp("emergencySnapShotInfoId");
	    		   
	    		   if(deviceType==1){//物理设备
	    			   if(deviceState==2){
	    				   disPlay.update('<div><img style="display:block;float:left" src="/images/backup/pc_big_offline_one.png"></img><div style="float:left;margin-left:4px;"><font class="font_h3">'+deviceName+'</font></br>'+ip+'</div></div>'	);
	    			   }else{
	    				   disPlay.update('<div><img style="display:block;float:left" src="/images/backup/pc_big_online_one.png"></img><div style="float:left;margin-left:4px;"><font class="font_h3">'+deviceName+'</font></br>'+ip+'</div></div>'	);
	    			   }
	    		   }else if(deviceType==2){//虚拟设备
	    			   if(deviceState==2){
			    		   disPlay.update('<div><img style="display:block;float:left" src="/images/backup/vm_pc_big_offline_one.png"></img><div style="float:left;margin-left:4px;"><font class="font_h3">'+deviceName+'</font></br>'+ip+'</div></div>'	);
		    		   }else{
			    		   disPlay.update('<div><img style="display:block;float:left" src="/images/backup/vm_pc_big_online_one.png"></img><div style="float:left;margin-left:4px;"><font class="font_h3">'+deviceName+'</font></br>'+ip+'</div></div>'	);
		    		   }
	    		   }else{//手动添加设备
	    			   if(deviceState==2){
			    		   disPlay.update('<div><img style="display:block;float:left" src="/images/backup/pc_big_add.png"></img><div style="float:left;margin-left:4px;"><font class="font_h3">'+deviceName+'</font></br>'+ip+'</div></div>'	);
		    		   }else{
			    		   disPlay.update('<div><img style="display:block;float:left" src="/images/backup/pc_big_add.png"></img><div style="float:left;margin-left:4px;"><font class="font_h3">'+deviceName+'</font></br>'+ip+'</div></div>'	);
		    		   }
	    		   }
	    		   
	    		   
	    		   sysInfoPanel.update(local.systemInfo+local.colon+sysInfo+'<br/>'+local.version+local.colon+version+''); 

	    		   //查询所有该设备对应的快照合
	    		   Ext.Ajax.request({
	    			   url:'/recovery/mountAction!showDataCollection.action',
	    			   params:{deviceTreeId:deviceId}, 
	    			   success: function(resp,opts) {
	    				   //挂载页面快照合显示
	    				   var snapInfo=createDataCollection(resp.responseText);
	    				   snapShotInfo.update(snapInfo);
	    				   //mouseInDl();	    

	    				   //更新左上角开始时间
	    				   if(JSON.parse(resp.responseText).setInfo.length>0){
	    					   //var startTime="<font style='margin:20px 0 0 20px' class='font_t'>"+$(".frame li:first span")[0].innerHTML+ "</font>";
	    					   var startTime="<font style='margin:20px 0 0 20px' class='font_t'>"+local.emergency.snapInfo+"</font>";
	    					   startDateId.update(startTime);
	    				   }


	    				   //最后一个数据集ID
	    				   var diskCloneId=$(".frame li:last dl").attr("id");
	    				   //初始化时展开最后一个数据集
	    				   expandLastDataCollection(diskCloneId);

	    			   },
	    			   failure: function(resp,opts) {
	    			   }
	    		   });
	    	   }

	       },
	       initComponent:function(){
	    	   var me=this;
	    	   CLUSTERIDENTITY = this.clusterIdentity;
	    	   deviceId=this.deviceId;
	    	   deviceName=this.deviceName;
	    	   uuid=this.uuid;
	    	   version=this.version;
	    	   sysInfo=this.sysInfo;
	    	   type=this.type;
	    	   ip=this.ip;
	    	   deviceState=this.deviceState;
	    	   AYTHORIZEEMERGENCY=this.authorizeEmergency;
	    	   DEVICEID=this.deviceId;
	    	   deviceType=this.deviceType;
	    	   SERVERANME=null;
	    	   Ext.apply(this,{

	    	   });
	    	   this.callParent();
	       }

});


/**
* 应急管理，快照一览页面，数据集上鼠标单击事件
* auth:wangshaodong
*/
$("#emergencySnapShotInfoId dl.close").live("click",function(){
	var frameW=$("#emergencySnapShotInfoId").width()-50;
	var OldW=$(".frame").width();
	if(OldW>frameW){
		OldW=frameW;
	}
	//快照显示格式
	var diskCloneID=$(this).attr("id");
	Ext.Ajax.request({
		url:'/recovery/mountAction!showVmimgCollection.action',
		params:{diskCloneId:diskCloneID}, 
		success: function(resp,opts) {
			$('#'+diskCloneID+" div").remove();
			
			if(resp.responseText.trim().length==0){
				return ;
			}
			$('#'+diskCloneID).append(function(index, html){
				return createVmimgCollection(resp.responseText,diskCloneID);
			});

			//dl里面没有快照的时候
			if($('#'+diskCloneID).children().length==0){
				if($(".frame li:last dl").children().length==0){
					$(".frame dl").removeClass("snapNull").addClass("close");
					$('#'+diskCloneID).removeClass("close").addClass("snapNull");
					$(".frame li:last dl").addClass("snapNull");
				}
				else{
					$(".frame dl").removeClass("snapNull").addClass("close");
					$('#'+diskCloneID).removeClass("close").addClass("snapNull");}
			}
			//有一个或多个快照时
			//如果数据集下存在被挂载的快照，则数据集显示挂载图标
			var dataCollection=$('#'+diskCloneID).next("div");
			if(dataCollection.length>0){
				dataCollection[0].innerHTML="";
			}

			ddId=$('#'+diskCloneID).attr("id");
			emLiId=$('#'+diskCloneID).parent().attr("id");
			
			emDlId=$('#'+diskCloneID).attr("id");

			//首次点击时Li 设置
			if(emPreLiId==null){
				emPreLiId=emLiId;
			}
			if(emPreEmDlId==null){
				emPreEmDlId=emDlId;
			}
			$(".frame dl").addClass("close","slow");

			//切换数据集
			if(emPreLiId!=emLiId){
				var lastSnapId=$(".frame li:last").attr("id");

				//切换数据集删除上一个数据集中快照显示挂载的图标
				
				var preIdList=$("#"+emPreLiId+" dl div div");
				
				if(emPreLiId!=lastSnapId){
				preIdList.each(function(index, element) {
					document.getElementById($(this).attr("id")).innerHTML="";
				});

				//切换数据集显示先前数据集的挂载图标
				var preDateCon=$("#"+emPreEmDlId).next("div");
				if(preDateCon.length>0){
					preDateCon[0].innerHTML="<img class='over' src='/images/recovery/mount/over.png'></img>";
				}}
			}
			//正常加载已经挂载的数据
			var IdList=$("#"+emLiId+" dl div div");
			IdList.each(function(index, element) {
				var mountOrEm=$(this).attr("id").substring(0,1);
				if(mountOrEm=="m"){
					document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/beenMount.png'></img>";
				}else if(mountOrEm=="u"){
					document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/beenUnMount.png'></img>";
				}else{
					var emergencyName=$(this).parent("span").find("span.mountname_span_text").text();
					if(mountOrEm=="e"){  //被应急
                        document.getElementById($(this).attr("id")).innerHTML="<img class='over hander' src='/images/recovery/mount/beenEmergency.png' onclick=stepEmergencyList(\""+emergencyName+"\")></img>";
                    }else if(mountOrEm=="o"){  //小颗粒创建虚拟机中
                        document.getElementById($(this).attr("id")).innerHTML="<img class='over hander' src='/images/recovery/mount/onmerge.gif' onclick=stepEmergencyList(\""+emergencyName+"\")></img>";
                    }else if(mountOrEm=="f"){  //小颗粒创建虚拟机失败
                        document.getElementById($(this).attr("id")).innerHTML="<img class='over hander' src='/images/recovery/mount/failmerge.png' onclick=stepEmergencyList(\""+emergencyName+"\")></img>";
                    }else if(mountOrEm=="s"){  //小颗粒创建虚拟机成功
                        document.getElementById($(this).attr("id")).innerHTML="<img class='over hander' src='/images/recovery/mount/successmerge.png' onclick=stepEmergencyList(\""+emergencyName+"\")></img>";
                    }
				}
				//自动接管图标
				if(mountOrEm=="a"){
                    document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/autoEmergency.png'></img>";
                }
				
			});
			
			$('#'+diskCloneID).removeClass("close");
			$(".frame li:last dl").removeClass("close");
			emPreLiId=emLiId;
			emPreEmDlId=emDlId;
			
			var w2=52*$('#'+diskCloneID).find('dd').length;
			var wLast=52*$(".frame li:last dl dd").length;
			var w=92*$(".frame li").length;
			var maxW=(OldW>(w2+w+wLast)?OldW:(w2+w+wLast));
			$(".frame").width(maxW);
			
		},    
		failure: function(resp,opts) {

		}
	});
});
/**
* 应急管理，快照一览页面，默认显示最后一个数据集
* auth:wangshaodong
*/
function expandLastDataCollection(diskClone){
	var OldW=$(".frame").width();
	//快照显示格式
	var w=100*$(".frame li").length;
	var maxW=(OldW>w?OldW:w);
	$(".frame").width(maxW);
	var diskCloneID=diskClone;
	Ext.Ajax.request({
		url:'/recovery/mountAction!showVmimgCollection.action',
		params:{diskCloneId:diskCloneID}, 
		success: function(resp,opts) {
			$('#'+diskCloneID +' div').remove();
			
			if(resp.responseText.trim().length==0){
				return ;
			}
			$('#'+diskCloneID).append(function(index, html){
				return createVmimgCollection(resp.responseText,diskCloneID);
			});
			var json=JSON.parse(resp.responseText);
			var onLine=null;
			onLine=json.onLine;
			var diskCloneLast=$(".frame li:last dl div:first dd");
			diskCloneLast.removeAttr("style");
			diskCloneLast.addClass("last_snap");
			if(onLine==1){
				var diskCloneLast=$(".frame li:last dl div:first dd");
				diskCloneLast.addClass("j-lastSnap");
			}
			//dl里面没有快照的时候
			if($('#'+diskCloneID).children().length==0){
   				$(".frame dl").removeClass("snapNull").addClass("close");
				$('#'+diskCloneID).removeClass("close").addClass("snapNull");
			}
			//有一个或多个快照时
			//如果数据集下存在被挂载的快照，则数据集显示挂载图标
			var dataCollection=$('#'+diskCloneID).next("div");
			if(dataCollection.length>0){
				dataCollection[0].innerHTML="";
			}
			
			ddId=$('#'+diskCloneID).attr("id");
			emLiId=$('#'+diskCloneID).parent().attr("id");
			emDlId=$('#'+diskCloneID).attr("id");
			//首次点击时Li 设置
			if(emPreLiId==null){
				emPreLiId=emLiId;
			}
			if(emPreEmDlId==null){
				emPreEmDlId=emDlId;
			}
			$(".frame dl").addClass("close","slow");
			
			//切换数据集
			if(emPreLiId!=emLiId){

				//切换数据集删除上一个数据集中快照显示挂载的图标
				var preIdList=$("#"+emPreLiId+" dl div div");
				preIdList.each(function(index, element) {
					document.getElementById($(this).attr("id")).innerHTML="";
				});

				//切换数据集显示先前数据集的挂载图标
				var preDateCon=$("#"+emPreEmDlId).next("div");
				if(preDateCon.length>0){
					preDateCon[0].innerHTML="<img class='over' src='/images/recovery/mount/over.png'></img>";
				}
			}
			
			//正常加载已经挂载，或则应急的数据
			var IdList=$("#"+emLiId+" dl div div");
			IdList.each(function(index, element) {
				var mountOrEm=$(this).attr("id").substring(0,1);
				if(mountOrEm=="m"){
					document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/beenMount.png'></img>";
				}else if(mountOrEm=="u"){
					document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/beenUnMount.png'></img>";
				}else{
					var emergencyName=$(this).parent("span").find("span.mountname_span_text").text();
                    if(mountOrEm=="e"){  //被应急
                        document.getElementById($(this).attr("id")).innerHTML="<img class='over hander' src='/images/recovery/mount/beenEmergency.png' onclick=stepEmergencyList(\""+emergencyName+"\")></img>";
                    }else if(mountOrEm=="o"){  //小颗粒创建虚拟机进行中
                        document.getElementById($(this).attr("id")).innerHTML="<img class='over hander' src='/images/recovery/mount/onmerge.gif' onclick=stepEmergencyList(\""+emergencyName+"\")></img>";
                    }else if(mountOrEm=="f"){  //小颗粒创建虚拟机失败
                        document.getElementById($(this).attr("id")).innerHTML="<img class='over hander' src='/images/recovery/mount/failmerge.png' onclick=stepEmergencyList(\""+emergencyName+"\")></img>";
                    }else if(mountOrEm=="s"){  //小颗粒创建虚拟机成功
                        document.getElementById($(this).attr("id")).innerHTML="<img class='over hander' src='/images/recovery/mount/successmerge.png' onclick=stepEmergencyList(\""+emergencyName+"\")></img>";
                    }
				}
				
				//自动接管图标
                if(mountOrEm=="a"){
                    document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/autoEmergency.png'></img>";
                }
				
			});
				
			$('#'+diskCloneID).removeClass("close");
			emPreLiId=emLiId;
			emPreEmDlId=emDlId;
			var w2=52*$('#'+diskCloneID).find('dd').length;
			var w=100*$(".frame li").length;
			var maxW=(OldW>(w2+w)?OldW:(w2+w));
			$(".frame").width(maxW);
		},    
		failure: function(resp,opts) {
		}
	});
}
/**
* 应急管理，快照一览页面，配置完接管演练之后，展示当前的快照
* auth:wangshaodong
*/
function expandCurrentDataCollection(diskClone){
	var OldW=$(".frame").width();
	//快照显示格式
	var w=100*$(".frame li").length;
	var maxW=(OldW>w?OldW:w);
	$(".frame").width(maxW);
	var diskCloneID=diskClone;
	Ext.Ajax.request({
		url:'/recovery/mountAction!showVmimgCollection.action',
		params:{diskCloneId:diskCloneID}, 
		success: function(resp,opts) {
			$('#'+diskCloneID +' div').remove();
			
			if(resp.responseText.trim().length==0){
				return ;
			}
			$('#'+diskCloneID).append(function(index, html){
				return createVmimgCollection(resp.responseText,diskCloneID);
			});
			var json=JSON.parse(resp.responseText);
			var onLine=null;
			onLine=json.onLine;
			var diskCloneLast=$(".frame li:last dl div:first dd");
			diskCloneLast.removeAttr("style");
			diskCloneLast.addClass("last_snap");
			if(onLine==1){
				var diskCloneLast=$(".frame li:last dl div:first dd");
				diskCloneLast.addClass("j-lastSnap");
			}
			//dl里面没有快照的时候
			if($('#'+diskCloneID).children().length==0){
   				$(".frame dl").removeClass("snapNull").addClass("close");
				$('#'+diskCloneID).removeClass("close").addClass("snapNull");
			}
			//有一个或多个快照时
			//如果数据集下存在被挂载的快照，则数据集显示挂载图标
			var dataCollection=$('#'+diskCloneID).next("div");
			if(dataCollection.length>0){
				dataCollection[0].innerHTML="";
			}
			
			ddId=$('#'+diskCloneID).attr("id");
			emLiId=$('#'+diskCloneID).parent().attr("id");
			emDlId=$('#'+diskCloneID).attr("id");
			//首次点击时Li 设置
			if(emPreLiId==null){
				emPreLiId=emLiId;
			}
			if(emPreEmDlId==null){
				emPreEmDlId=emDlId;
			}
			//$(".frame dl").addClass("close","slow");
			
			//切换数据集
			if(emPreLiId!=emLiId){

				//切换数据集删除上一个数据集中快照显示挂载的图标
				var preIdList=$("#"+emPreLiId+" dl div div");
				preIdList.each(function(index, element) {
					document.getElementById($(this).attr("id")).innerHTML="";
				});

				//切换数据集显示先前数据集的挂载图标
				var preDateCon=$("#"+emPreEmDlId).next("div");
				if(preDateCon.length>0){
					preDateCon[0].innerHTML="<img class='over' src='/images/recovery/mount/over.png'></img>";
				}
			}
			
			//正常加载已经挂载，或则应急的数据
			var IdList=$("#"+emLiId+" dl div div");
			IdList.each(function(index, element) {
				var mountOrEm=$(this).attr("id").substring(0,1);
				if(mountOrEm=="m"){
					document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/beenMount.png'></img>";
				}else if(mountOrEm=="u"){
					document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/beenUnMount.png'></img>";
				}else{
					var emergencyName=$(this).parent("span").find("span.mountname_span_text").text();
					if(mountOrEm=="e"){  //被应急
                        document.getElementById($(this).attr("id")).innerHTML="<img class='over hander' src='/images/recovery/mount/beenEmergency.png' onclick=stepEmergencyList(\""+emergencyName+"\")></img>";
                    }else if(mountOrEm=="o"){  //小颗粒创建虚拟机进行中
                        document.getElementById($(this).attr("id")).innerHTML="<img class='over hander' src='/images/recovery/mount/onmerge.gif' onclick=stepEmergencyList(\""+emergencyName+"\")></img>";
                    }else if(mountOrEm=="f"){  //小颗粒创建虚拟机失败
                        document.getElementById($(this).attr("id")).innerHTML="<img class='over hander' src='/images/recovery/mount/failmerge.png' onclick=stepEmergencyList(\""+emergencyName+"\")></img>";
                    }else if(mountOrEm=="s"){  //小颗粒创建虚拟机成功
                        document.getElementById($(this).attr("id")).innerHTML="<img class='over hander' src='/images/recovery/mount/successmerge.png' onclick=stepEmergencyList(\""+emergencyName+"\")></img>";
                    }
				}
				
				//自动接管图标
                if(mountOrEm=="a"){
                    document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/autoEmergency.png'></img>";
                }
				
			});
				
			//$('#'+diskCloneID).removeClass("close");

			   
			emPreLiId=emLiId;
			emPreEmDlId=emDlId;
			var w2=52*$('#'+diskCloneID).find('dd').length;
			var w=100*$(".frame li").length;
			var maxW=(OldW>(w2+w)?OldW:(w2+w));
			$(".frame").width(maxW);
		},    
		failure: function(resp,opts) {
		}
	});
}
/**
* 应急管理，快照一览页面，显示快照集
* auth:wangshaodong
*/
function createVmimgCollection(data,diskCloneId){
	var vmimgInfo=null;
	var snapInfo='';
	var timeFlag = null;
	var pointFlag = null;
	if(data){
		//后台传过来的json格式字符串转化为json字符串。
		vmimgInfo= JSON.parse(data).snapShotInfo;
		timeFlag=(vmimgInfo[vmimgInfo.length-1].showTime.split('-'))[2];
		for(i=vmimgInfo.length-1;i>=0;i--){
			var setId=vmimgInfo[i].setId;
			var mount=vmimgInfo[i].mount;
			var emergency=vmimgInfo[i].emergency;
			var detailTime=vmimgInfo[i].detailTime;
			var showTime=vmimgInfo[i].showTime;
			var mountName=vmimgInfo[i].mountName;
			var mountTime=vmimgInfo[i].mountTime;
			var emergencyName=vmimgInfo[i].emergencyName;
			var emergencyData=vmimgInfo[i].emergencyData;
			var mergeStatus=vmimgInfo[i].mergeStatus;
			var autoVirSet=vmimgInfo[i].autoVirSet;
			var flag = vmimgInfo[i].flag;//标识是否是小颗粒产生的快照
			
			if(pointFlag == null&& flag != null){
				pointFlag = Ext.decode(flag).isOrNo;
			}
			snapInfo=snapInfo+'<div style=\"float:right;\">';
			
			var nTimeFlag = (showTime.split('-'))[2];
			//按天，分隔快照集
			if(nTimeFlag != timeFlag){
				timeFlag = nTimeFlag;
				snapInfo=snapInfo+'<span class="snap_time">'+ (showTime.split('-'))[1]+'-'+ (showTime.split('-'))[2]+'<i>	</i></span>';
			}
//			//三个快照中显示一个时间刻度
//			if((i+1)%3==0){
//				if((i+1)!=vmimgInfo.length){
//					snapInfo=snapInfo+'<span class="snap_time">'+showTime+'<i></i></span>';
//				}
//			}
			if(pointFlag == "yes"){
				snapInfo=snapInfo+'<dd style="background:url('+"/images/recovery/mount/snapShotExpendGranule.png"+')" id='+diskCloneId+"-"+setId+"-"+i+'><span class="snap_time_wrap">'+local.recovery.snapTime+local.colon+detailTime+'</span></dd>';
			}else{
				snapInfo=snapInfo+'<dd id='+diskCloneId+"-"+setId+"-"+i+'><span class="snap_time_wrap">'+local.recovery.snapTime+local.colon+detailTime+'</span></dd>';
			}
			
			//显示此快照点已经被挂载图标
			if(mount==1&&emergency!=1){
				snapInfo=snapInfo+'<span class="snap_nt_wrap"><div id='+'umount'+diskCloneId+'umount'+i+'></div>'
				+'<span class="snap_nt">已卸载</span></span>';
			}
			if(mount==2){
				snapInfo=snapInfo+'<span class="snap_nt_wrap"><div id='+'mount'+diskCloneId+'mount'+i+'></div>'+
				'<span class="snap_nt">'+local.recovery.mountName+local.colon+mountName+';&nbsp;&nbsp;'+local.recovery.mountTime+local.colon+mountTime+'</span>'+
				'<span class="mountname_span_text">'+mountName+'</span></span>';
			}
			//显示此快照点已经被应急图标
			if(emergency==1){
				//普通虚拟机
				if(mergeStatus==0){
					 snapInfo=snapInfo+'<span class="snap_nt_wrap"><div id='+'emergency'+diskCloneId+'emergency'+i+'></div>'+
                     '<span class="snap_nt">'+local.recovery.virtualName+local.colon+emergencyName+';&nbsp;&nbsp;'+local.backup.creatTime+local.colon+emergencyData+'</span>'+
                     '<span class="mountname_span_text">'+emergencyName+'</span></span>';
				}
				//小颗粒虚拟机  mergeStatus  1，合并中，2，合并失败，3.合并完成'
				else{
					if(mergeStatus==1){
						snapInfo=snapInfo+'<span class="snap_nt_wrap"><div id='+'onmerge'+diskCloneId+'emergency'+i+'></div>'+
                        '<span class="snap_nt">'+local.recovery.virtualName+local.colon+emergencyName+';&nbsp;&nbsp;'+local.backup.creatTime+local.colon+emergencyData+'</span>'+
                        '<span class="mountname_span_text">'+emergencyName+'</span></span>';
					}else if(mergeStatus==2){
						snapInfo=snapInfo+'<span class="snap_nt_wrap"><div id='+'failmerge'+diskCloneId+'emergency'+i+'></div>'+
                        '<span class="snap_nt">'+local.recovery.virtualName+local.colon+emergencyName+';&nbsp;&nbsp;'+local.backup.creatTime+local.colon+emergencyData+'</span>'+
                        '<span class="mountname_span_text">'+emergencyName+'</span></span>';
					}else{
						snapInfo=snapInfo+'<span class="snap_nt_wrap"><div id='+'successmerge'+diskCloneId+'emergency'+i+'></div>'+
                        '<span class="snap_nt">'+local.recovery.virtualName+local.colon+emergencyName+';&nbsp;&nbsp;'+local.backup.creatTime+local.colon+emergencyData+'</span>'+
                        '<span class="mountname_span_text">'+emergencyName+'</span></span>';
					}
					
				}
			}
			//显示此快照被用于自动接管
			if(autoVirSet==1){
			         snapInfo=snapInfo+'<span class="snap_nt_wrap"><div id='+'autoEmergency'+diskCloneId+'emergency'+i+'></div>'+
                     '<span class="snap_nt">'+local.emergency.autoTakeoverSuccess+'&nbsp;&nbsp;</span>'+
                     '</span>';
			}
			snapInfo=snapInfo+'</div>';
		}
	}
	return snapInfo;
}
/**
* 应急管理，快照一览页面，显示数据集
* auth:wangshaodong
*/
function createDataCollection(data){

	var diskCloneList=null;
	//后台传过来的json格式字符串转化为json字符串。
	diskCloneList= JSON.parse(data).setInfo;
	var snapInfo='<ul class="frame">';
	if(!(diskCloneList.length==0)){
		//数据集长度
		var dataCollection=0;
		//时间轴
		if(null!=diskCloneList){
			dataCollection=diskCloneList.length;
			for(i=0;i<dataCollection;i++){
				var diskCloneId=diskCloneList[i].diskCloneId;
				var createTime=diskCloneList[i].createTime;
				var showMount=diskCloneList[i].showMount;
				var dataCount=diskCloneList[i].dataCount;
				//判断是否是最后一个数据集
				snapInfo=snapInfo+'<li id='+diskCloneId+"-"+i+'>'+'<span >'+createTime+'</span>'+'<i>'+dataCount+'</i>';
				snapInfo=snapInfo+'<dl  class="close" id='+diskCloneId+'><span class="snap_time_wrap">'+local.recovery.dataNums+'</span>';
				snapInfo=snapInfo+'</dl>';
				//数据集下显示挂载图标
				if(showMount==1){
					snapInfo=snapInfo+'<div class="mount_over_hover"  id='+diskCloneId+'-'+i+'+mount'+'>'+"<img class='over' src='/images/recovery/mount/over.png'></img><span  class='snap_time_wrap'>"+local.emergency.napshotSet+"</span>"+'</div>';
				}
			};
		}
	}else{
		snapInfo=snapInfo+'<div class="photo_null"></div>';
	}
	snapInfo=snapInfo+'</ul>';
	return snapInfo;
}

/**
* 应急管理，快照一览页面，快照集上鼠标单击事件
* auth:wangshaodong
*/
//var dd=$(".frame dl dd");
$("#emergencySnapShotInfoId .frame dl dd").live("click",function(){
	//集群不显示菜单
	if(CLUSTERIDENTITY){
		return;
	}
	
	var snapSetId = $(this).attr("id");
	ddId = snapSetId.split("-")[0];//点击单个快照,diskCloneId发生变化
	
	ddId = snapSetId.split("-")[0];//点击单个快照,diskCloneId发生变化
	
	if($(this).attr("class")=="last_snap j-lastSnap"){
		return;
	}
	var imgSrc=$(this).next(".snap_nt_wrap").find("img.over").attr("src");
	if(imgSrc=="/images/recovery/mount/beenEmergency.png"){
		return;
	}
	if(imgSrc=="/images/recovery/mount/beenMount.png"){
		return;
	}
	if(imgSrc=="/images/recovery/mount/onmerge.gif"){
        return;
    }
    if(imgSrc=="/images/recovery/mount/failmerge.png"){
        return;
    }
    if(imgSrc=="/images/recovery/mount/successmerge.png"){
        return;
    }    
    
	var menus = new Ext.menu.Menu(
			{
				items:[{
					text:local.emergency.emergencyConfig,
					icon:"/images/emergency/menu01.png",
					iconCls :'iconWidth',
					itemId:'emergency_calnode_emergencyconfig',
					listeners : {
						click : function(){
							configNewVmMachine(snapSetId,1,0,AYTHORIZEEMERGENCY);
//							if(AYTHORIZEEMERGENCY==1){//授权接管
//								configNewVmMachine(snapSetId,1);
//							}else if(AYTHORIZEEMERGENCY==2){
//								updateLicenseEmergency(DEVICEID);
//							}else{
//								Ext.MessageBox.confirm(local.window.tip,
//										local.emergency.deviceNoAuthConfirm,
//										function(btn){
//									if(btn=='yes'){
//										setEmergencyDevice(DEVICEID,2,1,snapSetId);//设备ID，快照选择，接管，快照集Id
//									}
//								});
//							}
						}
					}
				},{
					text:local.emergency.rehearseCon,
					icon:"/images/emergency/menu02.png",
					iconCls :'iconWidth',
					itemId:'emergency_calnode_drillconfig',
					listeners : {
						click : function(){
							configNewVmMachine(snapSetId,2,0,AYTHORIZEEMERGENCY);
//							if(AYTHORIZEEMERGENCY!=1&&AYTHORIZEEMERGENCY!=2){
//								Ext.MessageBox.confirm(local.window.tip,
//										local.emergency.deviceNoAuthConfirm,
//										function(btn){
//									if(btn=='yes'){
//										setEmergencyDevice(DEVICEID,2,2,snapSetId);//设备ID，快照选择，演练，快照集Id
//									}
//								});
//								
//							}else{
//								configNewVmMachine(snapSetId,2);
//							}
						}
					}
				},{
					text:local.emergency.quickOver,
					icon:"/images/emergency/menu03.png",
					itemId:'emergency_urgent_takeoverfast',
					iconCls :'iconWidth',
					listeners : {
						click : function(){
							if(AYTHORIZEEMERGENCY==1){//授权接管
								fastConfigNewVmMachine(deviceId,1,snapSetId);
							}else if(AYTHORIZEEMERGENCY==2){
								updateLicenseEmergency(DEVICEID);
							}else{
								Ext.MessageBox.confirm(local.window.tip,
										local.emergency.deviceNoAuthConfirm,
										function(btn){
									if(btn=='yes'){
										setEmergencyDevice(DEVICEID,2,3,snapSetId);//设备ID，快照选择,快速接管，快照集ID
									}
								});
							}
						}
					}
				},{
					text:local.emergency.quickDrill,
					icon:"/images/emergency/menu04.png",
					itemId:'emergency_drill_trainfast',
					iconCls :'iconWidth',
					//itemId:'emergency_calnode_emergencyconfig',
					listeners : {
						click : function(){
							if(AYTHORIZEEMERGENCY!=1&&AYTHORIZEEMERGENCY!=2){//TODO未配置授权
								Ext.MessageBox.confirm(local.window.tip,
										local.emergency.deviceNoAuthConfirm,
										function(btn){
									if(btn=='yes'){
										setEmergencyDevice(DEVICEID,2,4,snapSetId);//设备ID，快照选择,快速演练，快照集ID
									}
								});
							}else{
								fastConfigNewVmMachine(deviceId,2,snapSetId);
							}
						}
					}
				}]
			}
	);
	menus.showAt(MouseXY());
	POWER_OP.filterEnableMenuOfExtjs(menus, CURRENT_USER.getEmergencyPower());
//	//集群显示但禁用菜单
//	if(CLUSTERIDENTITY){
//		menus.setDisabled(true);
//	}
});	

/**
* 鼠标指针显示位置事件
* auth:wangshaodong
*/
function MouseXY(){
	e = Ext.EventObject;
	return [e.browserEvent.clientX,e.browserEvent.clientY];
	//return e.getPoint();
}
