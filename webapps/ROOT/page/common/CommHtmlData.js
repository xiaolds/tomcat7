function calNodeRunLoadHtml(netNode,calNodeId){
	var severHtml="<li key='{6}' onclick='stepEmergencyList(\"{0}\")' class='{5}' title='{4}'>" +
										  //"<span style='display: none'>{3}</span>" +
			                              "<span class='title'>{0}</span>" +
			                              "<span>CPU:{1}</span>" +
			                              "<span>"+local.memory+":{2}</span>"
			                 "</li>" ;
	var clusterHtml="<a key='{5}' onclick='stepEmergencyList(\"{0}\")' class='{4}' title='{3}'>" +
                                            "<span class='title'>{0}</span>" +
                                            "<span>CPU:{1}</span>" +
                                            "<span>"+local.memory+":{2}</span>" +
                                    "</a>" ; 
	var clusterWraperHtml="<li  class='server_cluster cluster_show'>" +
                                                    "<span title='{0}' class='title'>{0}</span>" +
                                                    "{1}"+
                                                "</li>" ; 
	var  nicHtml= "<li key='{4}' class='{2}'>"+
							    "<span></span>"+
							    "<span class='name' title={0}>{0}</span>"+
							    "<span>{1}</span>"+
							    "<div class='vm_hover_bg'><i onclick='showEditVirtualNicWin(\"{3}\")' class='icon_edit_vm'></i><i  onclick='deleteVmNic(\"{3}\")'  class='icon_delete_vm'></i></div>"+
						   "</li>";
	
	 var templateHtml="<div class='line_wrap'>"+
										   "<div class='propery'>"+
										    "<h4>"+local.emergency.gridAbility+"</h4>"+
										    "<ul>{0}" +
										    "     <li class='end' title={1}>{1}</li>" +
										    "</ul>"+
										"</div>"+
										"<div class='web'>"+
										    "<h4>"+local.web+"</h4>"+
										    "<ul>{2}<li class='web_vm_add' onclick='showAddVirtualNicWin()'><i class='icon_add'></i><span>添加虚拟子网</span></li></ul>"+
										    "</div>"+
										    "<div id='line_div'></div>"+
										"</div>";
	 
	 var severHtmlData="";
	 var clusterWrapHtmlData="";
	 //获得计算节点上开启的虚拟机列表[集群中设备的快照产生的虚拟机]
     var clusterVm = netNode.clusterVm;
     for(var i=0;i < clusterVm.length;i++){
         var cluster=clusterVm[i];
         var clusterName=cluster.clusterName;  //集群名称
         var vmList  =cluster.vmManagerList;  //集群下的虚拟机
         var clusterHtmlData="";
         for(var j=0;j<vmList.length;j++){
             var isMaster=vmList[j].isMaster;
             var vmType=vmList[j].vmType==1?local.recovery.takeOver:local.recovery.rehearse;
             var forTitle=local.name+local.colon+vmList[j].vmName+"&#10;"+local.type+local.colon+vmType+"&#10;"+local.pcName+local.colon+vmList[j].deviceName+"&#10;"+local.IP+local.colon+vmList[j].deviceIp;
             var cls=isMaster==1?"server server_master":"server";    //判断是否是master,是则添加server_master的样式
             clusterHtmlData+=Ext.String.format( clusterHtml,
                     vmList[j].vmName,
                     vmList[j].vmCpuKernel+local.core ,
                     converToGB(vmList[j].vmMemory),
                     forTitle,
                     cls,
                     'vm_'+vmList[j].id  //VM keyName :vm_id
             );
         };
         clusterWrapHtmlData+=Ext.String.format( clusterWraperHtml,
                 clusterName,
                 clusterHtmlData
         );
     }
	 
	//获得计算节点上开启的虚拟机列表
	 var vmManagers=netNode.vm;//getVmManagerRunByCptNodeId(calNode.nodeId);
	 for(var i=0;i < vmManagers.length;i++){
		 var vmManager=vmManagers[i];
		 var vmName=vmManager.vmName;
		 var vmType=vmManager.vmType==1?local.recovery.takeOver:local.recovery.rehearse;
		 var forTitle=local.name+local.colon+vmManager.vmName+"&#10;"+local.type+local.colon+vmType+"&#10;"+local.pcName+local.colon+vmManager.deviceName+"&#10;"+local.IP+local.colon+vmManager.deviceIp;
		 var serverClass="server";

		 severHtmlData+=Ext.String.format( severHtml,
				 vmName,
				 vmManager.vmCpuKernel+local.core ,
				 converToGB(vmManager.vmMemory),
				 vmManager.vmName,
				 forTitle,
				 serverClass,
				 'vm_'+vmManager.id  //VM keyName: vm_id
				 
		 );
	 }
	 
	 var nicHtmlData="";
	 //物理网卡
	 var computeNodeNics=netNode.node;//getComputeNodesNicByNodeId(calNode.nodeId);
	 
	 for(var i=0;i < computeNodeNics.length; i++){
		 var computeNodeNic=computeNodeNics[i];
		 var nicCls = "";
		 nicHtmlData+=Ext.String.format(nicHtml,
                                       computeNodeNic.computeNicName,
                                       computeNodeNic.computeNicIp,
                                       nicCls,
                                       computeNodeNic.computeNicId,
                                       'nic_'+computeNodeNic.computeNicId  //物理网卡keyName:nic_id
				                  );
		
	 }
	 
	 //计算节点虚拟虚拟子网
	 var virtualNics = netNode.virNic;  
	 for(var i=0;i < virtualNics.length; i++){
         var virtualNic=virtualNics[i];  //虚拟子网
         var nicCls = "web_vm";
         
         nicHtmlData+=Ext.String.format(nicHtml,
                                       virtualNic.computeVirtualNicName,  //虚拟子网名称
                                       virtualNic.computeVirtualNicGateWay,  //虚拟子网网关
                                       nicCls,
                                       virtualNic.computeVirtualNicId,  //子网ID
                                       'virNet_'+virtualNic.computeVirtualNicId  //子网keyName: virNet_id
                                  );
        
     }
	 	 
	 var capaInfo=getComputeNodeCapaInfo(calNodeId);
	 var memory="";
	 if(typeof(capaInfo.freeMemory) == "undefined"){
		 memory=local.remainMemory+":"+local.notSuccess;
	 }else if(capaInfo.freeMemory<0){
		 memory="";
	 }else{
		 memory=local.remainMemory+":"+converToGB(capaInfo.freeMemory);
	 }
	 return Ext.String.format( templateHtml,
			                                        severHtmlData+clusterWrapHtmlData,
			                                        memory,
			                                        nicHtmlData
			                                      );
}