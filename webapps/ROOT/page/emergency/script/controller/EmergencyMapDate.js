var NET_TOPOLOGY_LINKS=null;  //虚拟机网卡桥接

function EmergencyMapDate(){
	//URL
	this.EmergencyMapURL=function(action,method){
	    return Ext.String.format("/emergency/{0}!{1}.action",action,method); 
	};
	this.COMPUTENODECAPAINFO=null;
	this.VM_MANAGER_INFO=null;
   this.hardWarePanelHtml=function(obj){
	   //演练模式下无法修改网卡
	   var netWorkHtml=obj.vmType==1?"<div class='bot_list'><span><i class='vm_icon vm_icon_net'></i>"+local.emergency.nicDriver+"</span>{6}<a name='emergency_calnode_modifyvmnetdriver' href='javascript:void(0)' onclick='uptateVmNicView({0},{7})' >"+local.btn.modify+"</a></div>":
    	   "<div class='bot_list'><span><i class='vm_icon vm_icon_net'></i>"+local.emergency.nicDriver+"</span>{6}</div>";
	   var hardWareHTML=
		   								"<div class='bot_list'><span><i class='vm_icon vm_icon_type'></i>"+local.emergency.hostType+"</span>{1}<a name='emergency_calnode_modifyemergencytype' href='javascript:void(0)'  onclick='uptateVmTypeView({0},{2})' >"+local.btn.modify+"</a></div>"+
				                       "<div class='bot_list'><span><i class='vm_icon vm_icon_sys'></i>"+local.emergency.operatingSystem+"</span>{3}</div>" +
				                       "<div class='bot_list'><span><i class='vm_icon vm_icon_cpu'></i>CPU</span>{4}"+local.emergency.core+"<a name='emergency_calnode_modifyvmcpu' href='javascript:void(0)' onclick='uptateVmCpuView({0},{4},{12})' >"+local.btn.modify+"</a></div>" +
				                       "<div class='bot_list'><span><i class='vm_icon vm_icon_mem'></i>"+local.memory+"</span>{5}MB<a name='emergency_calnode_modifyvmmemory' href='javascript:void(0)' onclick='uptateVmMemoryView({0},{5})' >"+local.btn.modify+"</a></div>"+
				                       netWorkHtml+
				                       "<div class='bot_list'><span><i class='vm_icon vm_icon_disk'></i>"+local.emergency.diskDriver+"</span>{8}<a name='emergency_calnode_modifyvmdisktype' href='javascript:void(0)' onclick='uptateVmHardDiskTypeView({0},{9})' >"+local.btn.modify+"</a></div>"+
				                       "<div class='bot_list'><span><i class='vm_icon vm_icon_gpu'></i>"+local.emergency.GPUType+"</span>{10}<a name='emergency_calnode_modifyvmvideotype' href='javascript:void(0)' onclick='uptateVmGraphicsView({0},{11})' >"+local.btn.modify+"</a></div>"+
				                       "<div class='bot_list'><span><i class='vm_icon vm_icon_cd'></i>"+local.CDRom+"</span>CD/DVD(IDE)</div>"+
				                       "<div class='bot_list'><span><i class='vm_icon vm_icon_usb'></i>"+local.USB+"</span>present</div>";
	   
        return Ext.String.format(hardWareHTML,
								        		obj.id, //虚拟机ID
								        		this.VM_TYPE[obj.vmType][1], // 虚拟机类型显示
								        		obj.vmType, //虚拟机类型                            
								        		this.VM_SYSTEM_TYPE[obj.vmSystemType][1], // 系统类型显示
								        		obj.vmCpuKernel, //CPU核数
								        		obj.vmMemory,//内存
								        		this.VM_NIC[obj.nicDriverType][1],//网卡驱动显示
								        		obj.nicDriverType,//网卡驱动
								        		this.VM_HARD_DISK_TYPE[obj.vmDiskType][1],//硬盘类型
								        		obj.vmDiskType,
								        		this.VM_GRAPHICS_TYPE[obj.vmDisplayType][1],
								        		obj.vmDisplayType,
								        		obj.computeNoteId
        		                              );           
   };
   this.netWorkPanelHtml=function(obj,vmId,virType,nodeId,virState){
	   var content="";
	   var netCount=obj.length;
	   if(0==obj.length){
		   var vmInfo=this.VM_MANAGER_INFO;
		   if(vmInfo.vmType==1){
			   content="<td colspan=4 class='table1_empty'>"+local.emergency.unSetNTInfo+"</td>";
		   }else if(vmInfo.vmType==2){
			   content="<td colspan=4 class='table1_empty'>"+local.emergency.VmDrillNoNeedSetNTInfo+"</td>";
		   }
	   }else{	   
	   var val_temp="<tr><td>{0}</td><td><i class='vm_icon vm_icon_net'></i>{1}</td><td>{2}</td>" +
		   		                 "<td class='operate'>"+
		   		                 //"<a href='javascript:void(0)' onclick='addVmNicConfigView({3})'>新增</a> |"+
		   		                 "<a name='emergency_calnode_modifyvmnetwork' class='removeOnClickEvent' href='javascript:void(0)' onclick='updateVmNicConfigView({3},{4},{5},{6},\"{7}\","+virState+")'>"+local.btn.modify+"</a> | " +
		   		                 "<a name='emergency_calnode_delvmnetwork' class='removeOnClickEvent' href='javascript:void(0)' onclick='deleteVmNicConfigView({3},{4},{5},"+netCount+","+virState+")'>"+local.btn.delete0+"</a></td></tr>";
		   for(var i=0;i<obj.length;i++){
			   var netWork= obj[i];//参数 vmId,vmNicId,vmNicIndex,vmNodeNicId,vmDeviceNicName,nodeId
			   var compute="";
			   var computeId=netWork.computeNodesNic.computeId;
			   if(computeId==0){
				   compute=local.unconfig;
			   }else{
				   compute=netWork.computeNodesNic.computeNicName+"["+netWork.computeNodesNic.computeNicIp+"]";
			   }
			   content+=Ext.String.format(val_temp, 
					                                      //netWork.vmNicIndex,  //虚拟网卡索引
					                                      i,
					                                      netWork.deviceNic.deviceNicMac+"["+netWork.deviceNic.deviceNicIp+"]", //设备网卡
					                                      compute,//计算节点网卡
					                                      netWork.vmId,
					                                      netWork.vmNicId,
					                                      netWork.vmNicIndex,
					                                      netWork.computeNicId,
					                                      netWork.deviceNic.deviceNicMac+"["+netWork.deviceNic.deviceNicIp+"]"
					                                      );
		        }
	   }
	   var netWorkHtml=null;
	   if(this.VM_MANAGER_INFO.vmType==2){
		   netWorkHtml="<table class='table1'>"+
		   "<tr><th>"+local.emergency.rowNum+"</th><th>"+local.emergency.NTDev+"</th><th>"+local.emergency.calnodeNT+"</th><th>"+local.emergency.gridHander+"</th></tr>"+
										     content+
										"</table>";
	   }else{
		   netWorkHtml="<table class='table1 '>"+
		   "<tr><th>"+local.emergency.rowNum+"</th><th>"+local.emergency.NTDev+"</th><th>"+local.emergency.calnodeNT+"</th><th>"+local.emergency.gridHander+"</th></tr>"+
										     content+
										"</table>"+
										"<div class='new deleteForAu' ><a name='emergency_calnode_addvmnetwork' class='removeOnClickEvent' href='javascript:void(0)' onclick='addVmNicConfigView("+vmId+","+virState+");'>+"+local.emergency.addVmNT+"</a></div>";
	   }
	   
     return netWorkHtml;
   };
   
   this.attachmentPanelHTML=function(obj,vmId){
	   var content="";
	   if(null==obj||0==obj.length){
		   content="<td colspan=4 class='table1_empty'>"+'没有 USB 设备'+"</td>";
	   }else{
		   var val_temp="<tr><td><i class='vm_icon vm_icon_disk'></i>{0}</td><td>{1}</td><td class='attachmentId' hidden>{2}</td><td class='operate'>" 
			   +"<a  class='removeOnClickEvent' href='javascript:void(0)' onclick='showAddVmAttachment({2},\"{1}\", 2)'>"
			   +local.btn.modify+" </a>| " 
			   +"<a class='removeOnClickEvent' href='javascript:void(0)' onclick='deleteVmAttachment(this)' information='{1}' id='{2}'>"
			   +local.btn.delete0+"</a></td></tr>";
		   for(var i=0;i<obj.length;i++){
			   var mes= obj[i];
			   var name = 'USB 控制器';
			   var details = mes.information;
			   var tag = /*vmId+','+*/mes.id;
			   content+=Ext.String.format(val_temp,name,details,tag);
		   }
	   };
	   var virtualMesHtml=
		   "<table class='table1'>"
		   +"<tr><th>"+'硬件类型名称'
		   +"</th><th>"+'详细信息'
		   +"</th><th>"+'操作'
		   +"</th></tr>"+content+"</table>"
		   +"<div class='new' href='#'  >" 
		   +"<a name='emergency_calnode_addvmlocaldisk' class='removeOnClickEvent' href='javascript:void(0)' onclick='showAddVmAttachment(0,12,1);' >"
		   +'+增加其他设备'+"</a></div>";
	   return virtualMesHtml;
   };
   
   /**
    * getAllAttachmentList: 获取计算节点对应的所有附件
    * @param vmId: String --> 虚拟机ID
    * @param comobox: extjs 
    * 
    */
   this.getAllAttachmentList = function(vmId, combobox){
	   Ext.Ajax.request({
			method : 'post',
//			url : "/emergency/tovmManager!getAttachmentListByVmManagerID.action",//TODO
			url : "/emergency/tovmManager!getAllAttachmentList.action",//TODO
			params : {
				'vmManager.id' : vmId
			},
			async:false,
			timeout: 10000,//10秒
			success : function(response, options) {
				var obj = JSON.parse(response.responseText);
				if(!obj.result){
					Ext.websure.MsgError("ERROR", obj.msg);
				}
				
				var box = combobox;
			   var states = Ext.create('Ext.data.Store', {
				    fields: ['id', 'information'],
				    data : obj.content
				});
				box.bindStore(states);
			},
			failure : function() {
				Ext.websure.MsgError("ERROR","获取计算节点附件失败");
			}
		});
   }
   
   this.virtualMesPanelHtml=function(obj,vmId,virState){
	   //console.log(emergencyMapDate.VM_MANAGER_INFO.vmState);
	   var content="";
	   if(null==obj||0==obj.length){
		   content="<td colspan=4 class='table1_empty'>"+local.emergency.unSetDisk+"</td>";
	   }else{
		   var val_temp="<tr><td><i class='vm_icon vm_icon_disk'></i>{0}</td><td>{1}</td><td>{2}</td><td class='operate'><a name='emergency_calnode_delvmdisk' class='removeOnClickEvent' href='javascript:void(0);' onclick='deleteHardDiskRecord({3}"+","+vmId+","+virState+");'>删除</a></td></tr>";
		   for(var i=0;i<obj.length;i++){
			   var mes= obj[i];
			   var diskIndex= local.emergency.VmDisk+mes.hardDiskindex;
			   var diskFilePath=mes.storageSymbol+"->"+"<a title="+mes.vmimgFilePath+">"+mes.vmimgFilePath.substring(0,13)+"...</a>";
			   var isOS=mes.haveOs;
			   var vmimgId=mes.vmimgId;
			   content+=Ext.String.format(val_temp, 
					                                      diskIndex,
					                                      diskFilePath, 
					                                      isOS==2?local.null0:local.have,
					                                      vmimgId
					                                      );
		   }
	   };
	   
	   var virtualMesHtml="<table class='table1'>"+
	   "<tr><th>"+local.emergency.disk+"</th><th>"+local.emergency.diskPath+"</th><th>"+local.emergency.operatingSystem+"</th><th>"+local.emergency.gridHander+"</th></tr>"+
								     content+
								"</table>"+
								"<div class='new' href='#'  ><a name='emergency_calnode_addvmlocaldisk' class='removeOnClickEvent' href='javascript:void(0)' onclick='AddLocalVirHardDiskInfo("+virState+");' >+"+local.emergency.addLocalDisk+"</a></div><div class='new' ><a name='emergency_calnode_addvmremotedisk' class='removeOnClickEvent' href='javascript:void(0)' onclick='AddRemoteVirHardDiskInfo("+vmId+","+virState+");'>+"+local.emergency.addRemoteDisk+"</a></div>";
	   return virtualMesHtml;
   };
   
   //系统定义数据
   
   //虚拟机类型 1.接管 2.演练  3.策略 4.模版（待定）5 自定义
   this.VM_TYPE=[['0',local.emergency.undefine],['1',local.emergency.takeover],['2',local.emergency.rehearse],['3',local.emergency.strategy],['4',local.emergency.template],['5',local.emergency.define]];
   //网卡驱动
   this.VM_NIC=[['0','e1000'],['1','e1000'],['2','HW'],['3','virtio']/*,['4','ne2k_pci'],['5','pcnet']*/];
   //应急主机网卡模式
   this.VM_NET_MODEL = [ ['0','Bridged'],['1','NAT'],['2','Host-only'],['3','Custom'] ];
   //硬盘驱动 
   this.VM_HARD_DISK_TYPE=[ ['0','IDE'],['1','SATA'],['2','SATA'],['3','SD'],['4','VirtIO'],['5','Virtl0 SCSI'] ];
   //显卡类型
   this.VM_GRAPHICS_TYPE=[ ['0','Cirrus'],['2','Default'],['3','VGA'],['4','VGA'],['5','VMVGA'],['6','Xen'] ];
   
   //虚拟机系统类型定义
   this.VM_SYSTEM_TYPE = [
                 		['0','Windows x86'],
			 ['1','Windows x64'],
			 ['2','Windows NT 4'],
			 ['3','Windows 2000 x86'],
			 ['4','Windows 2000 IA64'],
			 ['5','Windows XP x86'],
			 ['6','Windows XP x64'],
			 ['7','Windows Server 2003 x86'],
			 ['8','Windows Server 2003 x64'],
			 ['9','Windows Vista x86'],
			 ['10','Windows Vista x64'],
			 ['11','Windows Server 2008 x86'],
			 ['12','Windows Server 2008 x64'],
			 ['13','Windows 7 x86'],
			 ['14','Windows 7 x64'],
			 ['15','Windows Server 2008 R2 x86'],
			 ['16','Windows Server 2008 R2 x64'],
			 ['17','Windows 8 x86'],
			 ['18','Windows 8 x64'],
			 ['19','Windows Server 2012 x86'],
			 ['20','Windows Server 2012 x64'],
			 ['21','Windows 8.1 x86'],
			 ['22','Windows 8.1 x64'],
			 ['23','Windows Server 2012 R2 x86'],
             ['24','Windows Server 2012 R2 x64'],
             ['25','Windows 10 x86'],
			 ['26','Windows 10 x64'],
			 ['27','Windows Server 2016 x86'],
			 ['28','Windows Server 2016 x64'],
			 ['29',''],
			 ['30',''],
			 ['31',''],
			 ['32','Linux'],
             ['33','Linux x64'],
             ['34','Redhat Linux 4'],
             ['35','Redhat Linux 4 x64'],
             ['36','Redhat Linux 5'],
             ['37','Redhat Linux 5 x64'],
             ['38','Redhat Linux 6'],
             ['39','Redhat Linux 6 x64'],
             ['40','CentOS Linux'],
             ['41','CentOS Linux x64'],
             ['42','Debian Linux 4'],
             ['43','Debian Linux 4 x64'],
             ['44','Debian Linux 5'],
             ['45','Debian Linux 5 x64'],
             ['46','Debian Linux 6'],
             ['47','Debian Linux 6 x64'],
             ['48','Debian Linux 7 x64'],
             ['49','Debian Linux 7 x64'],
             ['50','FreeBSD Linux'],
             ['51','FreeBSD Linux x64'],
             ['52','Oracle Linux'],
             ['53','Oracle Linux x64'],
             ['54','Suse Linux'],
             ['55','Suse Linux x64'],
             ['56','Suse Linux 10'],
             ['57','Suse Linux 10 x64'],
             ['58','Suse Linux 11'],
             ['59','Suse Linux 11 x64'],
             ['60','Suse Linux 12'],
             ['61','Suse Linux 12 x64'],
             ['62','Ubuntu Linux'],
             ['63','Ubuntu Linux x64'],
             ['64','Asianux Linux 2'],
             ['65','Asianux Linux 2 x64'],
             ['66','Asianux Linux 3'],
             ['67','Asianux Linux 3 x64'],
             ['68','Asianux Linux 4 '],
             ['69','Asianux Linux 4 x64'],
             ['70','Redflag Linux 4'],
             ['71','Redflag Linux 4 x64'],
             ['72','Redflag Linux 5'],
             ['73','Redflag Linux 5 x64'],
             ['74','Redflag Linux 6'],
             ['75','Redflag Linux 6 x64'],
             ['76','Redflag Linux 6 x64'],
             ['77','Kylin Linux x64'],
             ['78','Fedora Linux'],
             ['79','Fedora Linux x64'],
             ['80','Other 2.4x kernel Linux'],
             ['81','Other 2.4x kernel Linux x64'],
             ['82','Other 2.6x kernel Linux'],
             ['83','Other 2.6x kernel Linux x64'],
             ['84','Other 3.x kernel Linux'],
             ['85','Other 3.x kernel Linux x64'],
             ['86','Redhat Linux 7 x64'],
             ['87','CentOS Linux 4 x64'],
             ['88','CentOS Linux 5'],
             ['89','CentOS Linux 5 x64'],
             ['90','CentOS Linux 6'],
             ['91','CentOS Linux 6 x64'],
             ['92','CentOS Linux 7 x64']
                 		];
                 	
}
 var emergencyMapDate=new EmergencyMapDate();
 var WINDOW_VNC = null;