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
var DEVICEID=null;
/**
* 应急管理，快照一览页面标题显示
* auth:wangshaodong
*/
Ext.define("acesure.recovery.view.ClusterTopPanel",{
	extend : 'Ext.panel.Panel',
	alias : 'widget.ClusterTopPanel',
	id : 'ClusterTopPanelId',
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
		html: "<div><img style='display:block;float:left' src='/images/backup/pc_big_add.png'></img><div style='float:left;margin-left:4px;'><font class='font_h3'>"+local.emergency.hosComputer+"</font></br>192.168.1.110</div></div>"						 
	},
	{
		flex:1,
		padding:30,
		border:false,	
		bodyStyle: 'background:#fafbfc;'
	},
	{
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
Ext.define("acesure.recovery.view.ClusterSnapShotInfo",{
	extend:"Ext.panel.Panel",
	alias:"widget.ClusterSnapShotInfo",
	id:"ClusterSnapShotInfoId",
	border : false,
	height:350,
	width:'100%',
	style:'border-bottom:1px solid #d1dade;',
	html:'',
	viewConfig : {forceFit : false},
	bodyStyle:"overflow-x:auto;padding:20px",
	listeners:{

	}
});

/**
 * 集群共享磁盘展示treePanel
 */
Ext.define('acesure.recovery.view.ClusterShareDiskTree', {
            extend : 'Ext.tree.TreePanel',
            alias : 'widget.clusterShareDiskTree',
            hideHeaders:true,
            useArrows : true,
            border : false,
            rootVisible : false,    // 不可见根
            setRootNode: function() {
                if (this.getStore().autoLoad) {
                    this.callParent(arguments);
                }
            },    //设置Store AutoLoad:false
            initComponent : function() {
                var self = this;
                var treeStore = Ext.create('acesure.emergency.store.ClusterShareDiskTreeStore');
                Ext.applyIf(self, {
                            store : treeStore,
                            columns : [{
                                        xtype : 'treecolumn',
                                        header : '磁盘名称',
                                        flex:1,
                                        dataIndex : 'text'
                                    }]
                        });
                self.callParent(arguments);
            }
});

/**
* 应急管理，快照一览页，设备硬盘信息显示
* auth:wangshaodong
*/
Ext.define("acesure.recovery.view.ClusterHardWareInfo",{
	extend:"Ext.panel.Panel",
	alias:"widget.ClusterHardWareInfo",
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
            id:"clusterShareDiskTitle",
            width:'100%',
            html: '<div style="padding:20px;"><span class="font_t">'+local.backup.diskInfoGridInfo+'</span></div>'
        },
        { 
            border:false,
            width:'100%',
            xtype:'clusterShareDiskTree',  //集群共享磁盘信息展示
            id:"clusterShareDiskTree",
            rootVisible: false
        }
		]
	}],
	listeners:{
		afterrender:function(){
			//var vmimgHardDiskInfoId=Ext.getCmp("emergencyVmimgHardDiskInfoId");
			Ext.Ajax.request({
				 url:'/emergency/toclusterVmimg!getSharedVmimgDetailInfo.action',
  			   params:{groupId:deviceId}, 
				success: function(resp,opts) {
					var updateStr="";
					var hardDiskInfo=null;
					if(null!=resp.responseText){
						returnJson= JSON.parse(resp.responseText).info;
						//hardDiskInfo=returnJson.detail;
						var minTime=returnJson.minTime;
						var dataCount=returnJson.dataCount;
						var vmimgCount=returnJson.vmimgCount;
						var periodStr = null;
						if(minTime == null){
							minTime = new Date().Format("yyyy-MM-dd HH:mm:ss");  
							periodStr='<div class="list_grid"><span>'+local.backup.snapPeriod+'</span>'+minTime+'-'+local.toNow+'</div>';
						}else{
							periodStr='<div class="list_grid"><span>'+local.backup.snapPeriod+'</span>'+minTime+'-'+local.toNow+'</div>';
						}
						if(dataCount == null){
							periodStr=periodStr+'<div class="list_grid"><span >'+local.backup.snapPeriodCount+'</span>'+local.produce+"0"+local.recovery.dataAll+"0	"+local.recovery.dataNum+'</div>';
						}else{
							periodStr=periodStr+'<div class="list_grid"><span >'+local.backup.snapPeriodCount+'</span>'+local.produce+dataCount+local.recovery.dataAll+vmimgCount+local.recovery.dataNum+'</div>';
						}
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
Ext.define("acesure.emergency.view.ClusterVmimgView",{
	extend:"Ext.panel.Panel",
	config:{
		deviceId:"",
		deviceName:"",
		uuid:"",
		sysInfo:"",
		version:"",
		authorizeEmergency:"",
		deviceType:""
	},
	alias:"widget.ClusterVmimgView",
	id:"ClusterVmimgViewId",
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
	    	   xtype:"ClusterTopPanel"
	       },
	       {
	    	   xtype : 'label',
	    	   id : 'ClusterStartDateId',
	    	   html : "",
	    	   width : '90%'
	       }, 
	       {
	    	   xtype:"ClusterSnapShotInfo"
	       },
	       {
	    	   xtype:"ClusterHardWareInfo"
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
	    		   var mountTopPanel=Ext.getCmp("ClusterTopPanelId");
	    		   var disPlay=mountTopPanel.getComponent("emergencyDisPlayId");
	    		   var sysInfoPanel=mountTopPanel.getComponent("emergencySysInfoId");
	    		   var startDateId=Ext.getCmp("ClusterStartDateId");
	    		   var snapShotInfo=Ext.getCmp("ClusterSnapShotInfoId");
	    		   
	    		   disPlay.update('<div><img style="display:block;float:left" src="/images/backup/master_big.png"></img><div style="float:left;margin-left:4px;"><font class="font_h3">'+deviceName+'</font></br>'+ip+'</div></div>'	);
	    		   //查询所有该设备对应的快照合
	    		   Ext.Ajax.request({
	    			  // url:'/recovery/mountAction!showDataCollection.action',
	    			   url:'/emergency/toclusterVmimg!showSharedDiskDataCollection.action',
	    			   params:{groupId:deviceId}, 
	    			   success: function(resp,opts) {
	    				   //挂载页面快照合显示
	    				   var snapInfo=createDataCollection(resp.responseText);
	    				   snapShotInfo.update(snapInfo);
	    				   //mouseInDl();	    
	    				   //更新左上角开始时间
	    				   if(JSON.parse(resp.responseText).setInfo.length>0){
	    					   //var startTime="<font style='margin:20px 0 0 20px' class='font_t'>"+$(".frame li:first span")[0].innerHTML+ "</font>";
	    					   var startTime="<font style='margin:20px 0 0 20px' class='font_t'>"+local.emergency.sharedDiskSnapInfo+"</font>";
	    					   startDateId.update(startTime);
	    				   }
	    				   //最后一个数据集ID
	    				   var diskCloneId=$(".frame li:last dl").attr("id");
	    				   //alert(diskCloneId);
	    				   //初始化时展开最后一个数据集
	    				   expandLastClusterDataCollection(diskCloneId);
	    				   //展示最后一个数据集的共享磁盘信息
                           refreshShareDiskInfo(diskCloneId);
	    			   },
	    			   failure: function(resp,opts) {
	    			   }
	    		   });
	    	   }
	       },
	       initComponent:function(){
	    	   var me=this;
	    	   deviceId=this.deviceId;
	    	   deviceName=this.deviceName;
	    	   uuid=this.uuid;
	    	   version=this.version;
	    	   sysInfo=this.sysInfo;
	    	   type=this.type;
	    	   //ip=this.ip;
	    	   ip = this.ip+local.emergency.title2;
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
 * 
 * TODO
* 应急管理，快照一览页面，数据集上鼠标单击事件
* auth:wangshaodong
*/
$("#ClusterSnapShotInfoId dl.close").live("click",function(){
	var frameW=$("#ClusterSnapShotInfoId").width()-50;
	var OldW=$(".frame").width();
	if(OldW>frameW){
		OldW=frameW;
	}
	//快照显示格式
	var diskCloneID=$(this).attr("id");
	//刷新当前数据集的共享磁盘信息
    refreshShareDiskInfo(diskCloneID);
	Ext.Ajax.request({
		url:'/emergency/toclusterVmimg!getSharedVmimgCollection.action',
		params:{diskCloneId:diskCloneID}, 
		success: function(resp,opts) {
			$('#'+diskCloneID+" div").remove();
			if(resp.responseText.trim().length==0){
				return ;
			}
			$('#'+diskCloneID).append(function(index, html){
				return createClusterVmimgCollection(resp.responseText,diskCloneID);
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
				if(mountOrEm == 'c'){
					var params = $(this).attr("id").split('-');
					document.getElementById($(this).attr("id")).innerHTML="<img class='over hander' src='/images/recovery/mount/beenCluster.png' onclick=showInfoWin(event,\""+params[1]+"-"+params[2]+"\")></img>";
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
* auth:zhangjiachen
*/
function expandLastClusterDataCollection(diskClone){
	var OldW=$(".frame").width();
	//快照显示格式
	var w=100*$(".frame li").length;
	var maxW=(OldW>w?OldW:w);
	$(".frame").width(maxW);
	var diskCloneID=diskClone;
	Ext.Ajax.request({
		url:'/emergency/toclusterVmimg!getSharedVmimgCollection.action',
		params:{diskCloneId:diskCloneID}, 
		success: function(resp,opts) {
			$('#'+diskCloneID +' div').remove();
			
			if(resp.responseText.trim().length==0){
				return ;
			}
			$('#'+diskCloneID).append(function(index, html){
				return createClusterVmimgCollection(resp.responseText,diskCloneID);
			});
			var json=JSON.parse(resp.responseText);
			var onLine=null;
			onLine=json.onLine;

			if(onLine==1){
				//onLine ==1 为实时点now
    			var diskCloneLast=$(".frame li:last dl div:first dd");
                diskCloneLast.addClass("last_snap");
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
				if(mountOrEm == 'c'){
					var params = $(this).attr("id").split('-');
					document.getElementById($(this).attr("id")).innerHTML="<img class='over hander' src='/images/recovery/mount/beenCluster.png' onclick=showInfoWin(event,\""+params[1]+"-"+params[2]+"\")></img>";
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

//
///**
//* 应急管理，快照一览页面，快照集上鼠标单击事件
//* auth:zhangjiachen
//*/
$("#ClusterSnapShotInfoId .frame dl dd").live("click",function(){
	var snapSetId = $(this).attr("id");
	ddId = snapSetId.split("-")[0];//点击单个快照,diskCloneId发生变化
	if($(this).attr("class")=="last_snap"){
		return;
	}
	var menus = new Ext.menu.Menu(
			{
				items:[{
					//接管
					text:local.emergency.emergencyConfig,
					icon:"/images/emergency/menu01.png",
					iconCls :'iconWidth',
					itemId:'emergency_cluster_emergencyconfig',
					listeners : {
						click : function(){
							configNewVmMachine(snapSetId,3);
						}
					}
				},{
					//演练
					text:local.emergency.rehearseCon,
					icon:"/images/emergency/menu02.png",
					iconCls :'iconWidth',
					itemId:'emergency_cluster_drillconfig',
					listeners : {
						click : function(){
							configNewVmMachine(snapSetId,4);
						}
					}
				}]
			}
	);
	menus.showAt(MouseXY());
	POWER_OP.filterEnableMenuOfExtjs(menus, CURRENT_USER.getEmergencyPower());
});	


function createClusterVmimgCollection(data,diskCloneId){
	var vmimgInfo=null;
	var snapInfo='';
	var timeFlag = null;
	if(data){
		//后台传过来的json格式字符串转化为json字符串。
		vmimgInfo= JSON.parse(data).snapShotInfo;
		timeFlag=(vmimgInfo[vmimgInfo.length-1].showTime.split('-'))[2];
		for(i=vmimgInfo.length-1;i>=0;i--){
			var setId=vmimgInfo[i].setId;
			var detailTime=vmimgInfo[i].detailTime;
			var showTime=vmimgInfo[i].showTime;
			var flag = vmimgInfo[i].flag;
			snapInfo=snapInfo+'<div style=\"float:right;\">';
			
			var nTimeFlag = (showTime.split('-'))[2];
			//按天，分隔快照集
			if(nTimeFlag != timeFlag){
				timeFlag = nTimeFlag;
				snapInfo=snapInfo+'<span class="snap_time">'+ (showTime.split('-'))[1]+'-'+ (showTime.split('-'))[2]+'<i>	</i></span>';
			}
			
			snapInfo=snapInfo+'<dd id='+diskCloneId+"-"+setId+"-"+i+'><span class="snap_time_wrap">'+local.recovery.snapTime+local.colon+detailTime+'</span></dd>';
			//显示此快照点已经被挂载图标
			if(flag == 1){
				snapInfo=snapInfo+'<span class="snap_nt_wrap"><div id='+'cluster-'+diskCloneId+'-'+setId+'></div>';
			}
			snapInfo=snapInfo+'</div>';
		}
	}
	return snapInfo;
}

/**
 * 展示某个集群下的应急或挂载列表窗口
 */
function showInfoWin(e,params){
	 e = e||window.event;    //兼容ie chrome firefox
     var clusPostion=$(e.target).offset();    //当前点击的位置
	 var diskCloneId = params.split('-')[0];
	 var setId = params.split('-')[1];
	 Ext.Ajax.request({
        url:'/emergency/toclusterVmimg!getSnapDetails.action',
        params:{
            masterDiskCloneId:diskCloneId,
            setId:setId
        }, 
        success: function(resp,opts) {
        	var details = Ext.JSON.decode(resp.responseText);
        	//遍历动态插入虚拟机列表
            var vmList = details.emergencyDetails;
            var vmListHTML= "";
            vmListHTML += '<div class="font_top">'+local.emergency.VriM+'</div>'
                       +  '<dl class="snap_wrap">';
            for(var i = 0;i < vmList.length;i++){
                vmListHTML += '<dd onclick=stepEmergencyList("'+vmList[i].emergencyName+'")><i class="icon_snap"></i>'
                           +  '<span>'+local.recovery.virtualName+local.colon+vmList[i].emergencyName + '</br>'+local.emergency.emergencyTime + vmList[i].emergencyTime + '</span>'
                           +  '</dd>';
            }
            vmListHTML += '<div class="clearfloat"></div></dl>';
        	
        	//遍历动态插入挂载记录列表
        	var mountList = details.mountDetails;
        	var mountListHTML= "";
        	mountListHTML += '<div class="font_top">'+local.mount+'</div>'
                          +  '<dl class="snap_wrap snap_mount_wrap">';
        	for(var i = 0;i < mountList.length;i++){
        		mountListHTML += '<dd onclick=stepMountList("'+mountList[i].mountId+'")><i class="icon_mount_snap"></i>'
        		              +  '<span>'+local.emergency.mountName+mountList[i].mountName+'</br>'+local.emergency.mountTime+mountList[i].mountTime+'</span>'
        		              +  '</dd>';
        	}
        	mountListHTML +=  '<div class="clearfloat"></div></dl>';        	
        	
        	var clusterVmimgUseInfo = Ext.getCmp('clusterVmimgUseInfo');
            if(clusterVmimgUseInfo){
                 clusterVmimgUseInfo.destroy();
            }
            var infoWin = Ext.create('acesure.recovery.view.ClusterVmimgUseInfo');
        	
        	var vmPanel = infoWin.query("[itemId='vmList']")[0];
            vmPanel.update(vmListHTML);  //更新页面信息
        	var mountPanel = infoWin.query("[itemId='mountList']")[0];
        	mountPanel.update(mountListHTML);  //更新页面信息
        	//infoWin.show();
        	infoWin.showAt(clusPostion.left+50,clusPostion.top+20);
        	//判断dd的位置，如果靠右，里面的hover信息改变位置
            var win=$("#clusterVmimgUseInfo");
            var dd= $("#clusterVmimgUseInfo dd");
            var winY=win.position().left;
            var winX=win.position().top;
            if(dd){
                dd.each(function(){
                    var y=$(this).position().left;
                    //console.info(y);
                    if(y>180){
                        if(y<250){
                            $(this).find("span").css("left",'-100') ;
                        }else{
                            $(this).find("span").css("right",0);
                        }
                    }
                });
            }
        },
        failure: function(resp,opts) {
        	Ext.Msg.alert(local.window.tip,local.emergency.getClusterVmFailure);
        }
	 });
}

/**
 * 根据挂载记录ID跳转至恢复存储挂载记录列表页面
 */
function stepMountList(mountId){
	var href = document.getElementById("sel_sto").href;  //恢复存储主页面链接
    window.open(href+"?mountId="+mountId,"_self");
}

/**
 * 集群中的快照使用信息展示窗口
 */
Ext.define('acesure.recovery.view.ClusterVmimgUseInfo', {
    extend : 'Ext.window.Window',
    alias : 'widget.clusterVmimgUseInfo',
    id : 'clusterVmimgUseInfo',
    width:400,
    bodyStyle:"background-color:#FFFFFF",
    title:local.emergency.winClusterSnapInfo,
    border:false,
    plain: true,
    //header: false,
    //closable: false,
    draggable: false,
    frame:false,
    resizable :false,
    layout:'vbox',
    items:[{
                    xtype:'panel',
                    width:'100%',
                    bodyPadding:"20 10 10 20",
                    style:'overflow:visible',
                    bodyStyle:'overflow:visible',
                    itemId:'vmList',
                    border:false,
                    autoHeight:true,
                    html:local.emergency.VriM
                },{
                    xtype:'panel',
                    itemId:'mountList',
                    width:'100%',
                    autoHeight:true,
                    bodyPadding:"0 20 40 20",
                    bodyStyle:'overflow:visible',
                    border:false,
                    html:local.mount
                }]
});

Ext.define("acesure.emergency.view.clusterAuthorizeEmergencyWindow", {
	extend : 'Ext.window.Window',
	title: local.emergency.authEmerWinTitle, 
	draggable: true,
	height: 380,		
	width: 400,
	id:'clusterAuthorizeEmergencyWindow',
	layout: "vbox",
	border:false,
	modal: true, 
	resizable: false,
	items : [{
		xtype:"fieldset",
		title:local.emergency.authType,
		margin:"10 10 0 10",
		width: '100%',
		padding:"0 10 10 10",
		items : {
			xtype:'radiogroup',
			id:'authorizedEmergencyType',
			width: '100%',
			columns: 2,
			items:[
			       {padding:"6 0 0 40",boxLabel:local.recovery.takeOver ,name:'emergency',inputValue:1 },
			       {padding:"6 0 0 30",boxLabel:local.recovery.rehearse ,name:'emergency',inputValue:2 }
			       ]     
			}
	},{
		xtype:"fieldset",
		title:local.emergency.authDevNumInfo,
		margin:"20 10 0 10",
		width:"100%",
		padding:"0 10 10 10",
		listeners:{
			afterrender:function(v){
				showEmergencyLicenseSize(v);
			}
		}
	},{
		xtype:"fieldset",
		title:local.explain,
		margin:"20 10 0 10",
		padding:"0 10 10 10",
		width: '100%',
		html:"<font color='red'>"+local.emergency.authDevNumInfoExplain+"</span>"
	}],
	buttons : [{
		text :local.btn.save,
		cls:"btn_focus",
		handler : function(v) {
			var vmType= Ext.getCmp("authorizedEmergencyType").getChecked()[0].inputValue;
			var deviceId=v.up('window').deviceId;
			var snapSetId=v.up('window').snapSetId;
			var addEmeType;
			var addEmuType;
			if(vmType==1){
				addEmeType=1;
			}else {
				addEmeType=0;
			};
			if(vmType==2){
				addEmuType=2;
			}else {
				addEmuType=0;
			}
			Ext.Ajax.request({
				url:'/emergency/tovmManager!addDeviceEmergencyLicense.action',
				params:{
					"deviceId":deviceId,
					"takeover":addEmeType,
					"emulation":addEmuType
				},
				timeout: 100000, 
				success: function(resp,opts) {
					var vmResponse=JSON.parse(resp.responseText);
					var vmResponse=JSON.parse(resp.responseText);
					var msgCode=vmResponse[0].msgCode;
					var msgContent=vmResponse[0].msgContent;
					//>30000异常，=30000正常
					if(msgCode>30000){
						Ext.websure.MsgError(msgCode,msgContent);
						v.up('window').close();
						return false;
					}else{
						if(addEmeType == 1){
							configNewVmMachine(snapSetId,3,deviceId);
						}else if(addEmuType == 2){
							configNewVmMachine(snapSetId,4,deviceId);
						}
						v.up('window').close();
					}
					//刷新左侧树
					Ext.getCmp('grobleTreePanel').getStore().reload();
				},
				failure: function(resp,opts) {
					Ext.MessageBox.alert(local.window.tip,local.emergency.devSetHostError);
				}
			});
		}
	},{
		text : local.btn.cancle,
		handler : function(v) {
			v.up('window').close();
		}
	}]
});

/**
 * 刷新共享磁盘信息
 */
function refreshShareDiskInfo(diskCloneId){
	var treeStore = Ext.getCmp('clusterShareDiskTree').getStore();
    treeStore.load({
                params : {
                    'diskCloneId' : diskCloneId
                }
    });
}

function expandClusterCurrentDataCollection(diskClone){
	var OldW=$(".frame").width();
	//快照显示格式
	var w=100*$(".frame li").length;
	var maxW=(OldW>w?OldW:w);
	$(".frame").width(maxW);
	var diskCloneID=diskClone;
	Ext.Ajax.request({
		url:'/emergency/toclusterVmimg!getSharedVmimgCollection.action',
		params:{diskCloneId:diskCloneID}, 
		success: function(resp,opts) {
			$('#'+diskCloneID+" div").remove();
			
			if(resp.responseText.trim().length==0){
				return ;
			}
			$('#'+diskCloneID).append(function(index, html){
				return createClusterVmimgCollection(resp.responseText,diskCloneID);
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
				if(mountOrEm == 'c'){
					var params = $(this).attr("id").split('-');
					document.getElementById($(this).attr("id")).innerHTML="<img class='over hander' src='/images/recovery/mount/beenCluster.png' onclick=showInfoWin(event,\""+params[1]+"-"+params[2]+"\")></img>";
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
			
			
			var json=JSON.parse(resp.responseText);
			var onLine=null;
			onLine=json.onLine;
			if(onLine==1){
				//onLine ==1 为实时点now
    			var diskCloneLast=$(".frame li:last dl div:first dd");
                diskCloneLast.addClass("last_snap");
			}
			
		},    
		failure: function(resp,opts) {

		}
	});
}