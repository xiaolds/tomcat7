/**
 * Description:恢复存储，挂载数据列表
 * @auth:WangShaoDong
 */


Ext.Loader.setConfig({ enabled: true });
Ext.Loader.setPath('Ext.ux', '/page/ux');
Ext.require([
 'Ext.ux.grid.FiltersFeature'//必不可少的

]);


Ext.define('acesure.recovery.view.MountList', {
	extend : 'Ext.grid.GridPanel',
	alias : 'widget.mountList',
	overflowY:'auto',
	id:"mountListId",
	store:"MountListStore",
	sortableColumns: false, 
	enableColumnHide : false,
	enableColumnResize:false,
	initComponent : function() { // 初始化组件函数
	    var encode = false;
	   // var local1 = true;

		var filters = {
		        ftype: 'filters',
		        encode: encode, // json encode the filter query
		        local: true,   // defaults to false (remote filtering)
		        menuFilterText:local.recovery.stoSelec
		    };
		this.features=filters;
		
		this.columns = [
				{
					header : local.recovery.mountName,
					dataIndex : 'mountName',
					hideable:false,
					menuDisabled:true,
					sortable:true,
					flex:1,
					renderer : function(value, cellmeta, record, rowIndex, columnIndex) {
						
	        			var isOnline=record.data.mountState;//获取是否在线信息
	        			var mountType=record.data.mountType;//获取挂载类型
	        			var vmType=record.data.vmType;
	        			if(isOnline ==7){
	        				return "<img src='/images/recovery/mount_on.png' />&nbsp;&nbsp;"+value;
	        			}else{
	        				return "<img src='/images/recovery/mount.png' />&nbsp;&nbsp;"+value;
	        			}
	        		}
				},
				{
					header : '',
					dataIndex : 'deviceId',//设备ID
					hidden:true
				},
				{
					header : local.recovery.gridIP,
					dataIndex : 'sourceDeviceIp',//目标设备IP
					menuDisabled:true,
					sortable:true,
					width:230,
					renderer : function(value, cellmeta, record, rowIndex, columnIndex, store) {
						if(value==""){
							return ;
						}else{
							return "<a title='"+local.recovery.information+"' href='javascript:void(0);' style='color:#00aaaa;'onclick='stepIntoMountSnapShot("+record.data["sourceDeviceId"]+")'>"+value+"</a>"; 
						}
					}
				},
				{
					header :local.recovery.targetDeviceIP,
					dataIndex : 'mountDestDeviceIp',//目标设备IP
					menuDisabled:true,
					sortable:true,
					 width:150,
					renderer : function(value, cellmeta, record, rowIndex, columnIndex) {
	        			var mountType=record.data.mountType;
	        			if(mountType ==""){
	        				return "..."; 
	        			}else{
	        				return value;
	        			}
					}
				},
				
				{
					header : local.type,
					dataIndex : 'mountType',
					menuDisabled:true,
					tdCls:"font_color_999",
					sortable:true,
					flex:1,
					renderer : function(value, cellmeta, record, rowIndex, columnIndex) {
						var vmType=record.data.vmType;
						if(vmType=='4'||vmType=='5'){
							if(vmType == '4'){
								return local.recovery.diskEmpty;
							}else {
								return local.recovery.VD;
							}
						}else{
							if (value == '1') {
								return local.recovery.mountGrid;
							} else if (value == '2') {
								return local.recovery.ISCSIMount;
							} else{
								return local.recovery.FCMount;
							}
						}
					}
				},
				{
					header : local.recovery.nodeSave,
					dataIndex : 'storageName',
					//menuDisabled:true,
					//enableColumnHide:false,
					sortable:true,
					lockable: true,
					flex:1,
					filter: {
		                type: 'list'
		            },
					renderer : function(value, cellmeta, record, rowIndex, columnIndex) {
						if(record.get("storageState")==1){
		        			 return "<img class='imgPositon' src='/images/recovery/onLine.png'  />&nbsp&nbsp"+
 		        			 "<a title='"+local.recovery.clickInformation+"' href='javascript:void(0);' style='color:#00aaaa;'onclick='stepIntoStorage(\""+value+"\")'>"+value+"</a>";
		        		 }else{
		        			 return "<img class='imgPositon' src='/images/recovery/offLine.png' />&nbsp&nbsp"+
		        			 "<a title='"+local.recovery.clickInformation+"' href='javascript:void(0);' style='color:#00aaaa;'onclick='stepIntoStorage(\""+value+"\")'>"+value+"</a>";
		        		 }
					}
				},
				{
					header : local.recovery.mountState,
					dataIndex : 'mountState',
					menuDisabled:true,
					sortable:true,
					width:100,
					renderer : function(value, cellmeta, record, rowIndex, columnIndex) {
						
						var vmType=record.data.vmType;
						if(vmType=='4'||vmType=='5'){
							if (value == '1'||value == '2') {
								return "<img src='/images/common/orange.png'/>&nbsp;<span style='font-weight:bold;color:#ffab5e'>"+local.unconfig+"</span>";
							}else if(value == '3'||value == '4'||value == '6'||value == '8'){
								return "<img src='/images/common/gray.png'/>&nbsp;<span style='font-weight:bold;color:#ccc'>"+local.recovery.mountStateNot+"</span>";
							}else if(value == '7'||value == '5'){
								return "<img src='/images/common/green.png'/>&nbsp;<span style='font-weight:bold;color:#2db200'>"+local.recovery.mountStateYes+"</span>";
							}else{
								return "<img src='/images/common/red.png'/>&nbsp;<span style='font-weight:bold;color:red'>"+local.recovery.mountStateFailure+"</span>";
							}
						}else{
							if (value == '1'||value == '2'||value == '3'||value == '4'||value == '6'||value == '8') {
								return "<img src='/images/common/gray.png'/>&nbsp;<span style='font-weight:bold;color:#ccc'>"+local.recovery.mountStateNot+"</span>";
							}
							else if(value == '5'||value == '7'){
								return "<img src='/images/common/green.png'/>&nbsp;<span style='font-weight:bold;color:#2db200'>"+local.recovery.mountStateYes+"</span>";
							}else{
								return "<img src='/images/common/red.png'/>&nbsp;<span style='font-weight:bold;color:red'>"+local.recovery.mountStateFailure+"</span>";
							}
						}
					}
				},
				{

					header : local.recovery.mountUsedRecord,//'磁盘使用记录',
					dataIndex : 'mountRemark',
					menuDisabled:true,
					flex:1,
					renderer : function(value, cellmeta, record, rowIndex, columnIndex) {
							return '<font color="#888888" title='+value+'>'+value+'</font>';
					}
				},{
					header : local.btn.operate,
					dataIndex : 'mountId',
					menuDisabled:true,
					sortable: false,
					 width:150,
					renderer: function (value, cellmeta, record, rowIndex, columnIndex) {  
							var mountId = value;//获取id
							var deviceId=record.data.deviceId;
							if(""==deviceId){
								deviceId="-1";
							};
							var diskId=record.data.diskId;
							if(""==diskId){
								diskId="-1";
							};
							var type=record.data.sysType;
							if(""==type){
								type="-1";
							};
							var vmId=record.data.vmId;
							if(""==vmId){
								vmId="-1";
							};
							var parId=record.data.parId;
							if(""==parId){
								parId="-1";
							};
							var mountTypeWin=record.data.mountType;
							if(""==mountTypeWin){
								mountTypeWin="-1";
							};
							var mountPowerWin=record.data.mountPower;
							if(""==mountPowerWin){
								mountPowerWin="-1";
							};
							var mountLetterWin=record.data.mountLetter;
							if(""==mountLetterWin){
								mountLetterWin="-1";
							};
							var mountState=record.data.mountState;
							var mountName=record.data.mountName;
							var vmType=record.data.vmType;
							//console.log(mountId+','+deviceId+','+diskId+','+type+','+vmId+','+parId+','+mountTypeWin+','+mountPowerWin+','+mountLetterWin+','+mountState);
							var config={"diskId":diskId,"type":type,"vmId":vmId,"parId":parId,"deviceId":deviceId,"mountTypeWin":mountTypeWin,"mountId":mountId,"mountState":mountState,"mountName":mountName};
							//"+diskId+","+type+","+vmId+","+parId+","+deviceId+","+mountTypeWin+","+mountId+","+mountState+",\""+mountName+"\"
							var operateStr ="";
							//激活操作，页面显示
							var active="<a class='icon_wrap' title="+local.btn.active+" name='recovery_stonode_invokemount' href='javascript:void(0);' onclick='actMountNode("+mountId+","+deviceId+");' style='text-decoration:none;'><i class='icon_active'></i></a> ";
							//卸载操作页面显示
							var uninstall="<a class='icon_wrap' title="+local.btn.uninstall+" name='recovery_stonode_uninstallmount' href='javascript:void(0);' onclick='delMountNode("+mountId+",1);' style='text-decoration:none;'><i class='icon_unistall'></i></a> ";
							//更新操作页面显示
							var update="&nbsp; <a title="+local.btn.mountConfig+" name='recovery_stonode_modifymount' href='javascript:void(0);' onclick='cfgMountNode("+diskId+","+type+","+vmId+","+parId+","+deviceId+","+mountTypeWin+","+mountId+","+mountState+",\""+mountName+"\",\""+mountLetterWin+"\");' style='text-decoration:none;'><i class='icon_set'></i></a>";
							//更新回滚页面显示
							var unUpdate="&nbsp; <a href='javascript:void(0));' style='cursor:default'><i class='icon_setGray'></i></a>";
							//删除记录页面显示 
							var deleteRecord="&nbsp; <a title="+local.recovery.deleteMount+" name='recovery_stonode_delmount' href='javascript:void(0);' onclick='delMountNode("+mountId+",2);' style='text-decoration:none;'><i class='icon_delete'></i></a>";
							//初始化新磁盘 
							var initializeRecord="&nbsp; <a title="+local.recovery.Initialize+" name='recovery_stonode_delmount' href='javascript:void(0);' onclick='delMountNode("+mountId+",3);' style='text-decoration:none;'><i class='icon_mountInit'></i></a>";
							//删除回滚页面显示
							var unDeleteRecord="&nbsp; <a href='javascript:void(0);'  style='cursor:default'><i class='icon_deleteGray'></i></a>";
							//新磁盘页面显示
							var newMount="<a title="+local.recovery.creatMount+" name='recovery_stonode_addmount' href='javascript:void(0);' onclick='newMountConfig("+mountId+","+vmId+");' style='text-decoration:none;'><i class='icon_creatMount'></i></a> ";
							//挂载类型为新磁盘 ，挂载状态未未挂载，卸载空白盘成功，卸载设备成功。
							if((vmType=="4"||vmType=="5")&&(mountState=="1"||mountState=="2"||mountState=="4")){
								operateStr = newMount+deleteRecord;
							}else if((vmType=="4"||vmType=="5")&&(mountState=="3"||mountState=="6")){
								operateStr = active+update+initializeRecord;
							}else{
								if(mountState==7||mountState==5){//挂载成功
									operateStr=uninstall+unUpdate+unDeleteRecord;
								}else{
									operateStr = active+update+deleteRecord;
								}
							}
		        	        return "<div >" + operateStr + "</div>";  
		        	      }
				}  ];
		this.callParent(arguments);
	},
	listeners:{
		afterrender:function(v){

  		  if(MOUNTNAME){
  			  me=this;
  			  var storeList=this.store.load({callback:function(records, operation, success){
  				  var record = null;
  				  for(i=0;i<records.length;i++){
  					  tRecord=records[i];
  					  if(MOUNTNAME==tRecord.get("mountName")){
  						  record=tRecord;
  					  }
  				  };
  				  if(record){
  					  me.getSelectionModel().select(record);
  				  }
  				findMountCount();
  				POWER_OP.filterEnableDomsInGridpanelColumnOfExtjs(v,CURRENT_USER.getRecoveryPower());
  			  }});
  		  }else{
  			  this.store.load({
  				  callback:function(records, operation, success){
  					  if(records.length>0){
  						POWER_OP.filterEnableDomsInGridpanelColumnOfExtjs(v,CURRENT_USER.getRecoveryPower());
  					  }
  					findMountCount();
  					POWER_OP.filterEnableDomsInGridpanelColumnOfExtjs(v,CURRENT_USER.getRecoveryPower());
  				  }
  			  });
  		  }	        			
		}
	}
});