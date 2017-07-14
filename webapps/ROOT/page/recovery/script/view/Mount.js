//全局变量
//保存前一个数据集Id
var preLiId=null;
//保存当前数据集ID
var liId=null;
//上一个dl
var preDlId=null;
//当次Dl
var dlId=null;
var MOUNTNAME=null;
//集群设备标志
var CLUSTERIDENTITY = null;

//标志，是否为集群挂载  ==1 集群挂载，==2 普通设备挂载
var ISCLUSTERMOUNT=null;

Ext.define("acesure.recovery.view.MountTopPanel",{
	extend : 'Ext.panel.Panel',
	alias : 'widget.MountTopPanel',
	id : 'MountTopPanelId',
	bodyStyle: 'background:#fafbfc;',
	//width : '100%',
	height : 108,
	border:false,
	style:'border:0;border-bottom:1px solid #d1dade',
	layout : 'hbox',
	items :[{
		xtype: "panel",
		width:400,
		itemId:"disPlayId",
		border : false,
		padding:'25',
		bodyStyle: 'background:#fafbfc;',
		html: "<div><img style='display:block;float:left' src='/images/backup/pc_big_online_one.png'></img><div style='float:left;margin-left:4px;'><font class='font_h3'>"+local.recovery.hosComputer+"</font></br>192.168.1.110</div></div>"						 
	},{
		xtype: 'label',
		itemId:'sysInfoId',
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
	},{
		xtype: "panel",
		id:'mountBackId',
		border:false,
		width:56,
		html: "<div class='shrink' onclick='fadeout();'><img src='/images/backup/shrink.png'/></div>"
	}
	]

});

/**
 * 定义时间轴，根据一天之内的快照个数动态变化。
 * auth:wangshaodong
 */
Ext.define("acesure.recovery.view.SnapShotInfo",{
	extend:"Ext.panel.Panel",
	alias:"widget.SnapShotInfo",
	id:"SnapShotInfoId",
	border : false,
	height:350,
	width:'100%',
	style:'border-bottom:1px solid #d1dade;',
	//padding:'0 20 20 20',
	html:'',
	viewConfig : {forceFit : false},
	bodyStyle:"overflow-x:auto;padding:20px;",
	listeners:{

	}
});

Ext.define("acesure.recovery.view.HardWareInfo",{
	extend:"Ext.panel.Panel",
	alias:"widget.HardWareInfo",
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
			id:"snapShotPeriodId",
			width:'100%',
			html: ''
		},
		{ 
			border:false,
			width:'100%',
			id:"vmimgHardDiskInfoId",
			html: ''
		}
		]
	}],
	listeners:{
		afterrender:function(){
			var vmimgHardDiskInfoId=Ext.getCmp("vmimgHardDiskInfoId");
			var snapShotPeriodId=Ext.getCmp("snapShotPeriodId");
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
						updateStr=updateStr+'<div style="padding:20px;border-bottom:1px solid #D6D8DA"><span class="font_t">'+local.recovery.diskInfo+'</span></div>';
						for(i=0;i<hardDiskInfo.length;i++){
							var checkLvm=hardDiskInfo[i].checkLvm;
							if(checkLvm==1){
								updateStr=updateStr+'<div class="list_grid2">'+'<span>['+'LVM'+local.comma+local.capacity+local.colon+hardDiskInfo[i].diskCapacity+']</span>';
							}else{
								updateStr=updateStr+'<div class="list_grid2">'+'<span>['+local.disk+local.colon+hardDiskInfo[i].diskIndex+local.comma+local.capacity+local.colon+hardDiskInfo[i].diskCapacity+']</span>';
							}
							//updateStr=updateStr+'<div class="list_grid2">'+'<span>['+local.disk+':'+hardDiskInfo[i].diskIndex+','+local.capacity+':'+hardDiskInfo[i].diskCapacity+']</span>';
							var partInfo=hardDiskInfo[i].parInfo;
							if(null!=partInfo){
								var newStr="";
								for(j=0;j<partInfo.length;j++){
									newStr=newStr+'&nbsp;&nbsp;&nbsp;'+partInfo[j].lettr+':'+partInfo[j].partten+','+local.capacity+':'+partInfo[j].parSize;
								}
								updateStr=updateStr+"<label title='"+newStr+"'>"+newStr+"</label>";
							}
							updateStr=updateStr+'</div>';
						}
						vmimgHardDiskInfoId.update(updateStr);
						var time;
						if(""==minTime){
							time=local.recovery.noSnapshot;
						}else{
							time=minTime+"-"+local.toNow;
						}
						var periodStr='<div class="list_grid"><span>'+local.recovery.snapPeriod+'</span>'+time+'</div>';
						periodStr=periodStr+'<div class="list_grid"><span >'+local.recovery.snapCount+'</span>'+local.produce+dataCount+local.recovery.dataAll+vmimgCount+local.recovery.dataNum+'</div>';
						snapShotPeriodId.update(periodStr);
					}
					
				},
				failure: function(resp,opts) {
				}
			});
			var snapShotPeriodId=Ext.getCmp("snapShotPeriodId");
			var startTime='2015-01-05';
			var vmimgCount=$(".frame li dd").length;
			var dataCount=$(".frame li").length;
			var snapShotPeriodStr='<div class="list_grid">';
			snapShotPeriodStr=snapShotPeriodStr+'<span>'+local.recovery.snapPeriod+'</span>';
			snapShotPeriodStr=snapShotPeriodStr+startTime+local.ripple+local.toNow+'</div>';
			snapShotPeriodStr=snapShotPeriodStr+'<div class="list_grid"><span >'+local.recovery.snapCount+'</span>';
			snapShotPeriodStr=snapShotPeriodStr+local.produce+dataCount+local.recovery.dataAll2+'</div>';
			snapShotPeriodId.update(snapShotPeriodStr);
			
		}
	}
});

Ext.define("acesure.recovery.view.Mount",{
	extend:"Ext.panel.Panel",
	config:{
		clusterIdentity:"",
		deviceId:"",
		deviceName:"",
		uuid:"",
		sysInfo:"",
		version:"",
		type:"",
		ip:"",
		deviceType:""
	},
	alias:"widget.Mount",
	id:"MountId",
	//height:720,
	//width:"100%",
	border:false,
	//overflowX:'auto',
	overflowY:'auto',
	viewConfig:{  
		loadMask:true 
	}, 
	items:[
	       {
	    	   xtype:"MountTopPanel"
	       },
	       {
	    	   xtype : 'label',
	    	   id : 'startDateId',
	    	   html : "",
	    	   width : '90%'
	       }, 
	       {
	    	   xtype:"SnapShotInfo"
	       },
	       {
	    	   xtype:"HardWareInfo"
	       }
	       ],
	       listeners:{
	    	   afterrender:function(){
	    		   //保存前一个数据集Id
	    		   preLiId=null;
	    		   //保存当前数据集ID
	    		   liId=null;
	    		   //上一个dl
	    		   preDlId=null;
	    		   //当次Dl
	    		   dlId=null;
	    		   
	    		   //挂载页面头部显示
	    		   var mountTopPanel=Ext.getCmp("MountTopPanelId");
	    		   var disPlay=mountTopPanel.getComponent("disPlayId");
	    		   var sysInfoPanel=mountTopPanel.getComponent("sysInfoId");
	    		   var startDateId=Ext.getCmp("startDateId");
	    		   var snapShotInfo=Ext.getCmp("SnapShotInfoId");
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
	    		   //查询所有该设备对应的快照集合
	    		   Ext.Ajax.request({
	    			   url:'/recovery/mountAction!showDataCollection.action',
	    			   params:{deviceTreeId:deviceId}, 
	    			   success: function(resp,opts) {
	    				   
	    				   //更新初始化页面数据集显示信息
	    				   var snapInfo=createDataCollection(resp.responseText);
	    				   snapShotInfo.update(snapInfo);
	    				   
	    				   //鼠标放在数据集下面显示的信息
	    				   mouseInDl();
	    				   
	    				   //更新显示克隆开始时间
	    				   if(JSON.parse(resp.responseText).setInfo.length>0){
	    					   var startTime="<font style='margin:20px 0 0 20px' class='font_t'>快照信息</font>";
		    				   startDateId.update(startTime);
	    				   }
	    				   
	    				   //初始化时展开最后一个数据集
	    				   var diskCloneId=$(".frame li:last dl").attr("id");
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
	    	   deviceType=this.deviceType;
	    	   Ext.apply(this,{
	    	   });
	    	   this.callParent();          
	       }

});

/**
 * 
 * @param data
 * @returns {String}
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
				snapInfo=snapInfo+'<dl class="close" id='+diskCloneId+'><span class="snap_time_wrap">'+local.recovery.dataNums+'</span>';
				snapInfo=snapInfo+'</dl>';
				//数据集下显示存在被挂载或则被应急的图标
				if(showMount==1){
					snapInfo=snapInfo+'<div class="mount_over_hover"  id='+diskCloneId+'-'+i+'+mount'+'>'+"<img class='over' src='/images/recovery/mount/over.png'></img><span class='snap_time_wrap'>数据集中有被应急/挂载的快照</span>"+'</div>';
				}
				snapInfo=snapInfo+'</li>';
			};
		}
	}
	else{
		snapInfo=snapInfo+'<div class="photo_null"></div>';
	}
	snapInfo=snapInfo+'</ul>';
	return snapInfo;
}
//展示最后一个快照点
function expandLastDataCollection(diskClone){
	var OldW=$(".frame").width();
	//快照集显示格式
	var w=100*$(".frame li").length;
	var maxW=(OldW>w?OldW:w);
	$(".frame").width(maxW);
	var diskCloneID=diskClone;
	Ext.Ajax.request({
		url:'/recovery/mountAction!showVmimgCollection.action',
		params:{diskCloneId:diskCloneID}, 
		success: function(resp,opts) {
			$('#'+diskCloneID +' div').remove();
			//创建数据集下对应的快照集
			if(resp.responseText.trim().length==0){
				return ;
			}
			var vmimgStr=createVmimgCollection(resp.responseText,diskCloneID);
			$('#'+diskCloneID).append(function(index, html){
				return vmimgStr;
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
			//mouseInDd();
			//dl里面没有快照的时候
			if($('#'+diskCloneID).children().length==0){
   				$(".frame dl").removeClass("snapNull").addClass("close");
				$('#'+diskCloneID).removeClass("close").addClass("snapNull");
				
			};
			//清除数据下的挂载或应急图标
			var dataCollection=$('#'+diskCloneID).next("div");
			if(dataCollection.length>0){
				dataCollection[0].innerHTML="";
			};
			
			ddId=$('#'+diskCloneID).attr("id");
			liId=$('#'+diskCloneID).parent().attr("id");
			dlId=$('#'+diskCloneID).attr("id");
			//首次点击时Li 设置
			if(preLiId==null){
				preLiId=liId;
			}
			if(preDlId==null){
				preDlId=dlId;
			}
			$(".frame dl").addClass("close");

			//切换数据集
			if(preLiId!=liId){

				//切换数据集删除上一个数据集中快照集显示挂载的图标
				var preIdList=$("#"+preLiId+" dl div div");
				preIdList.each(function(index, element) {
					document.getElementById($(this).attr("id")).innerHTML="";
				});

				//切换数据集显示先前数据集的挂载图标
				var preDateCon=$("#"+preDlId).next("div");
				if(preDateCon.length>0){
					preDateCon[0].innerHTML="<img class='over' src='/images/recovery/mount/over.png'></img>";
				};
			}
			//正常加载已经挂载的数据
			var IdList=$("#"+liId+" dl div div");
			IdList.each(function(index, element) {
				var mountOrEm=$(this).attr("id").substring(0,1);
				
				if(mountOrEm=="m"){
					var mountName=$(this).parent("span").find("span.mountname_span_text").text();
					document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/beenMount.png' onclick=stepMountList(\""+mountName+"\")></img>";
				}else if(mountOrEm=="u"){
					document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/beenUnMount.png'></img>";
				}else{
					if(mountOrEm=="e"){  //被应急
					    document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/beenEmergency.png'></img>";
                    }else if(mountOrEm=="o"){  //小颗粒创建虚拟机进行中
                        document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/onmerge.gif'></img>";
                    }else if(mountOrEm=="f"){  //小颗粒创建虚拟机失败
                        document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/failmerge.png'></img>";
                    }else if(mountOrEm=="s"){  //小颗粒创建虚拟机成功
                        document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/successmerge.png'></img>";
                    }
				}
			});
				
			$('#'+diskCloneID).removeClass("close");
			preLiId=liId;
			preDlId=dlId;
			var w2=52*$('#'+diskCloneID).find('dd').length;
			var w=100*$(".frame li").length;
			var maxW=(OldW>(w2+w)?OldW:(w2+w));
			$(".frame").width(maxW);
		},    
		failure: function(resp,opts) {
		}
	});
}
//展示当前快照点
function expandCurrentDataCollection(diskClone){
	var OldW=$(".frame").width();
	//快照集显示格式
	var w=100*$(".frame li").length;
	var maxW=(OldW>w?OldW:w);
	$(".frame").width(maxW);
	var diskCloneID=diskClone;
	Ext.Ajax.request({
		url:'/recovery/mountAction!showVmimgCollection.action',
		params:{diskCloneId:diskCloneID}, 
		success: function(resp,opts) {
			$('#'+diskCloneID +' div').remove();
			//创建数据集下对应的快照集
			if(resp.responseText.trim().length==0){
				return ;
			}
			var vmimgStr=createVmimgCollection(resp.responseText,diskCloneID);
			$('#'+diskCloneID).append(function(index, html){
				return vmimgStr;
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
			//mouseInDd();
			//dl里面没有快照的时候
			if($('#'+diskCloneID).children().length==0){
   				$(".frame dl").removeClass("snapNull").addClass("close");
				$('#'+diskCloneID).removeClass("close").addClass("snapNull");
				
			};
			//清除数据下的挂载或应急图标
			var dataCollection=$('#'+diskCloneID).next("div");
			if(dataCollection.length>0){
				dataCollection[0].innerHTML="";
			};
			
			ddId=$('#'+diskCloneID).attr("id");
			liId=$('#'+diskCloneID).parent().attr("id");
			dlId=$('#'+diskCloneID).attr("id");
			//首次点击时Li 设置
			if(preLiId==null){
				preLiId=liId;
			}
			if(preDlId==null){
				preDlId=dlId;
			}

			//切换数据集
			if(preLiId!=liId){

				//切换数据集删除上一个数据集中快照集显示挂载的图标
				var preIdList=$("#"+preLiId+" dl div div");
				preIdList.each(function(index, element) {
					document.getElementById($(this).attr("id")).innerHTML="";
				});

				//切换数据集显示先前数据集的挂载图标
				var preDateCon=$("#"+preDlId).next("div");
				if(preDateCon.length>0){
					preDateCon[0].innerHTML="<img class='over' src='/images/recovery/mount/over.png'></img>";
				};
			}
			//正常加载已经挂载的数据
			var IdList=$("#"+liId+" dl div div");
			IdList.each(function(index, element) {
				var mountOrEm=$(this).attr("id").substring(0,1);
				
				if(mountOrEm=="m"){
					var mountName=$(this).parent("span").find("span.mountname_span_text").text();
					document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/beenMount.png' onclick=stepMountList(\""+mountName+"\")></img>";
				}else if(mountOrEm=="u"){
					document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/beenUnMount.png'></img>";
				}else{
					if(mountOrEm=="e"){  //被应急
                        document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/beenEmergency.png'></img>";
                    }else if(mountOrEm=="o"){  //小颗粒创建虚拟机进行中
                        document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/onmerge.gif'></img>";
                    }else if(mountOrEm=="f"){  //小颗粒创建虚拟机失败
                        document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/failmerge.png'></img>";
                    }else if(mountOrEm=="s"){  //小颗粒创建虚拟机成功
                        document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/successmerge.png'></img>";
                    }
				}
			});
			preLiId=liId;
			preDlId=dlId;
			var w2=52*$('#'+diskCloneID).find('dd').length;
			var w=100*$(".frame li").length;
			var maxW=(OldW>(w2+w)?OldW:(w2+w));
			$(".frame").width(maxW);
		},    
		failure: function(resp,opts) {
		}
	});
}

$("#SnapShotInfoId dl.close").live("click",function(){
	var frameW=$("#SnapShotInfoId").width()-50;
	var OldW=$(".frame").width();
	if(OldW>frameW){
		OldW=frameW;
	}
	//快照集显示格式
/*	var OldW=$(".frame").width();
	var w=100*$(".frame li").length;
	var maxW=(OldW>w?OldW:w);
	$(".frame").width(maxW);*/
	var diskCloneID=$(this).attr("id");
	Ext.Ajax.request({
		url:'/recovery/mountAction!showVmimgCollection.action',
		params:{diskCloneId:diskCloneID},
		success: function(resp,opts) {
			$('#'+diskCloneID+" div").remove();
			if(resp.responseText.trim().length==0){
				return ;
			}
			var vmimgStr=createVmimgCollection(resp.responseText,diskCloneID);
			$('#'+diskCloneID).append(function(index, html){
				return vmimgStr;
			});
			var json=JSON.parse(resp.responseText);
			var onLine=null;
			onLine=json.onLine;
			if(onLine==1){
				var diskCloneLast=$(".frame li:last dl div:first dd");
				diskCloneLast.addClass("j-lastSnap");
			}
			//mouseInDd();
			//dl里面没有快照的时候
			if($('#'+diskCloneID).children().length==0){
				if($(".frame li:last dl").children().length==0){
					$(".frame dl").removeClass("snapNull").addClass("close");
   					$('#'+diskCloneID).removeClass("close").addClass("snapNull");
   					$(".frame li:last dl").addClass("snapNull");
				}else{
	   				$(".frame dl").removeClass("snapNull").addClass("close");
					$('#'+diskCloneID).removeClass("close").addClass("snapNull");
				}
			}
			
			//有一个或多个快照时
			//如果数据集下存在被挂载的快照，则数据集显示挂载图标
			var dataCollection=$('#'+diskCloneID).next("div");
			if(dataCollection.length>0){
				dataCollection[0].innerHTML="";
			}
			
			ddId=$('#'+diskCloneID).attr("id");
			liId=$('#'+diskCloneID).parent().attr("id");
			dlId=$('#'+diskCloneID).attr("id");
			
			//首次点击时Li 设置
			if(preLiId==null){
				preLiId=liId;
			}
			if(preDlId==null){
				preDlId=dlId;
			}
			$(".frame dl").addClass("close");
			
			//切换数据集
			if(preLiId!=liId){
				var lastSnapId=$(".frame li:last").attr("id");
					//切换数据集删除上一个数据集中快照集显示挂载的图标
				var preIdList=$("#"+preLiId+" dl div div");
				if(preLiId!=lastSnapId){
					preIdList.each(function(index, element) {
						
						document.getElementById($(this).attr("id")).innerHTML="";
					});
					
					//切换数据集显示先前数据集的挂载图标
					var preDateCon=$("#"+preDlId).next("div");
					if(preDateCon.length>0){
						preDateCon[0].innerHTML="<img class='over' src='/images/recovery/mount/over.png'></img>";
					}}
			}
			//正常加载已经挂载的数据
			var IdList=$("#"+liId+" dl div div");
			IdList.each(function(index, element) {
					var mountOrEm=$(this).attr("id").substring(0,1);
					if(mountOrEm=="m"){
						var mountName=$(this).parent("span").find(".mountname_span_text").text();
						document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/beenMount.png' onclick=stepMountList(\""+mountName+"\")></img>";
					}else if(mountOrEm=="u"){
						document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/beenUnMount.png'></img>";
					}else{
						if(mountOrEm=="e"){  //被应急
                            document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/beenEmergency.png'></img>";
                        }else if(mountOrEm=="o"){  //小颗粒创建虚拟机进行中
                            document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/onmerge.gif'></img>";
                        }else if(mountOrEm=="f"){  //小颗粒创建虚拟机失败
                            document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/failmerge.png'></img>";
                        }else if(mountOrEm=="s"){  //小颗粒创建虚拟机成功
                            document.getElementById($(this).attr("id")).innerHTML="<img class='over' src='/images/recovery/mount/successmerge.png'></img>";
                        }
					}
				});	
			
			$('#'+diskCloneID).removeClass("close");
			$(".frame li:last dl").removeClass("close");
			
			preLiId=liId;
			preDlId=dlId;
			
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


//显示数据集信息
function createVmimgCollection(data,diskCloneId,onLine){
	var vmimgInfo=null;
	var snapInfo='';
	var timeFlag = null;
	var pointFlag = null;
	//var onLine=null;
	if(data){
		//后台传过来的json格式字符串转化为json字符串。
		var json=JSON.parse(data);
		vmimgInfo=json .snapShotInfo;
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
//			//三个快照集中显示一个时间刻度
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
				+'<span class="snap_nt">'+local.btn.unloaded+'</span></span>';
			}
			if(mount==2){
				snapInfo=snapInfo+'<span class="snap_nt_wrap"><div id='+'mount'+diskCloneId+'mount'+i+'></div>'
				+'<span class="snap_nt">'+local.recovery.mountName+local.colon+mountName+';&nbsp;&nbsp;'+local.recovery.mountTime+local.colon+mountTime+'</span>'
				+'<span class="mountname_span_text">'+mountName+'</span></span>';
			}
			//显示此快照点已经被应急图标
			if(emergency==1){
                //普通虚拟机
                if(mergeStatus==0){
                     snapInfo=snapInfo+'<span class="snap_nt_wrap"><div id='+'emergency'+diskCloneId+'emergency'+i+'></div>'
                     +'<span class="snap_nt">'+local.recovery.virtualName+local.colon+emergencyName+';&nbsp;&nbsp;'+local.recovery.creatTime+emergencyData+'</span></span>';
                }
                //小颗粒虚拟机  mergeStatus  1，合并中，2，合并失败，3.合并完成'
                else{
                    if(mergeStatus==1){
                        snapInfo=snapInfo+'<span class="snap_nt_wrap"><div id='+'onmerge'+diskCloneId+'emergency'+i+'></div>'
                        +'<span class="snap_nt">'+local.recovery.virtualName+local.colon+emergencyName+';&nbsp;&nbsp;'+local.recovery.creatTime+emergencyData+'</span></span>';
                    }else if(mergeStatus==2){
                        snapInfo=snapInfo+'<span class="snap_nt_wrap"><div id='+'failmerge'+diskCloneId+'emergency'+i+'></div>'
                        +'<span class="snap_nt">'+local.recovery.virtualName+local.colon+emergencyName+';&nbsp;&nbsp;'+local.recovery.creatTime+emergencyData+'</span></span>';
                    }else{
                        snapInfo=snapInfo+'<span class="snap_nt_wrap"><div id='+'successmerge'+diskCloneId+'emergency'+i+'></div>'
                        +'<span class="snap_nt">'+local.recovery.virtualName+local.colon+emergencyName+';&nbsp;&nbsp;'+local.recovery.creatTime+emergencyData+'</span></span>';        
                    }
                    
                }
			}
			snapInfo=snapInfo+'</div>';
		}
	}
	return snapInfo;
}

$("#SnapShotInfoId .frame dl dd").live("click",function(){
	//集群不显示菜单
	if(CLUSTERIDENTITY){
		return;
	}

	var snapSetId = $(this).attr("id");
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
    var menus = null;  //挂载配置菜单
    //普通设备挂载配置菜单
	var generalMountMenu = new Ext.menu.Menu({
				items:[{
					text:local.btn.mountConfig,
					icon:"/images/recovery/mount/guazai.png",
					iconCls :'iconWidth',
					itemId:'recovery_stonode_configmount',
					listeners : {
						click : function(){
							
							Ext.Ajax.request({
								url:'/recovery/mountAction!hasOs.action',
								params:{setId:snapSetId},
								timeout: 100000, 
								success: function(resp,opts) {
									if(null!=resp.responseText){
										var returnJson=resp.responseText;
										var emergencyOrNo=returnJson.split('-')[1];
										var mountOrNo=returnJson.split('-')[2];
										if(emergencyOrNo>0){
											Ext.MessageBox.alert(local.window.tip,local.recovery.emeryConfiged);
											return false;
										}
										if(mountOrNo>0){
											Ext.MessageBox.alert(local.window.tip,local.recovery.mountConfiged);
											return false;
										}
											
										var configMountWin=Ext.create("acesure.recovery.view.MountWinShow",{
											ddIds:ddId,
											deviceIdWin:deviceId,
											typeWin:type,
											snapSetIdWin:snapSetId

										});
										configMountWin.show();
										
									}
								},
								failure: function(resp,opts) {

								}
							});
						}
					}
				}]
			}
	);
	//集群挂载配置菜单
	var clusterMountMenu = new Ext.menu.Menu({
                items:[{
                    text:'集群挂载配置',
                    icon:"/images/recovery/mount/guazai.png",
                    iconCls :'iconWidth',
                    itemId:'recovery_cluster_configmount',
                    listeners : {
                        click : function(){
                        	//集群挂载配置窗口
                        	var clusterMountWin=Ext.create("acesure.recovery.view.ClusterMountConfigWin",{
                                                 ddIds:1,
                                                 deviceIdWin:1,
                                                 typeWin:1,
                                                 snapSetIdWin:1

                                        });
                            clusterMountWin.show();
                        	
                        }
                    }
                }]
            }
	
	);
	if(ISCLUSTERMOUNT==1){
		menus = clusterMountMenu;
	}else{
		menus = generalMountMenu;
	}
	
	menus.showAt(MouseXY());
	POWER_OP.filterEnableMenuOfExtjs(menus, CURRENT_USER.getRecoveryPower());
	
//	//如果属于集群设备,不能进行挂载操作
//	if(CLUSTERIDENTITY){
//		menus.setDisabled(true);
//    }
});	
function stepMountList(data){
	
	
	//关闭弹窗
    var clusterVmimgUseInfo = Ext.getCmp('clusterVmimgUseInfo');
    if(clusterVmimgUseInfo){
                 clusterVmimgUseInfo.destroy();
    }
    
/*	var mount=Ext.getCmp("MountId");
	mount.destroy();
*/	MOUNTNAME=data;
	var contentPanel = Ext.getCmp('recoveryContentPanel');
	contentPanel.removeAll();
	contentPanel.add({
		xtype : 'recovery',
		itemId : 'recoveryPanel'
	});
	/*mountList=Ext.getCmp("mountListId");
	mountStore=mountList.getStore();
	mountStore.load({
		callback: function(records, operation, success) {
			if(data){
				var record = null;
				for(i=0;i<records.length;i++){
					tRecord=records[i];
					if(data==tRecord.get("mountName")){
						record=tRecord;
					}
				};
				if(record){
					mountList.getSelectionModel().select(record);
				}
				
			}
		 }
	});
	contentPanel.doLayout();*/
	
}

function mouseInDd(){
/*	$(".frame dd").hover(function(){
		var spanId=$(this).attr("id");
		Ext.create('Ext.tip.ToolTip', {
			anchorOffset: 45,   
			padding:10,
			trackMouse: true ,    
			dismissDelay:0,
			target:spanId,
			html: '<div><span>快照时间:'+$("#"+spanId+" span")[0].innerHTML+'</span></div>'
		});
	});*/
/*	$(".frame dd").next("div").hover(function(){
		var spanDivId=$(this).attr("id");
		var mountOrEm=$(this).attr("id").substring(0,1);
		var text=$(this).next("span").text();
		Ext.create('Ext.tip.ToolTip', {
			anchorOffset: 45,   
			padding:10,
			trackMouse: true ,    
			dismissDelay:0,
			target:spanDivId,
			html:'<div><span>'+text+'</span></div>'
		});
	});*/
}

function mouseInDl(){
/*	$(".frame dl").next("div").hover(function(){
		var snapMountPngDiv=$(this).attr("id");
		Ext.create('Ext.tip.ToolTip', {
			anchorOffset: 45,   
			padding:10,
			trackMouse: true ,    
			dismissDelay:0,
			target:snapMountPngDiv,
			html: '<div><span>点击数据集查看快照信息</span></div>'
		});
	});*/
}




function MouseXY(){
	e = Ext.EventObject;
	return [e.browserEvent.clientX,e.browserEvent.clientY];
}

function fadeout() {
	var contentPanel = Ext.getCmp('recoveryContentPanel');
	contentPanel.removeAll();
	contentPanel.add({
		xtype : 'recovery',
		itemId : 'recoveryPanel'
	});
	contentPanel.doLayout();

} 