Ext.define('acesure.emergency.store.VmCPUStore', {
	extend:"Ext.data.ArrayStore",	
    alias:"widget.vmCPUStore",
    fields:[ 'value','name'],
    data : [],
    listeners: {
    	'load':function( store, records,  successful,  opts){
    		var data=[];
    		var vmCpuView=Ext.getCmp("updateVmCPUWindow");
    	
    		if(typeof(vmCpuView) == "undefined") return; //解决store load bug
    		var capaInfo=getComputeNodeCapaInfo(vmCpuView.computeNoteId);
    		var logicCpu=capaInfo.logicCpukernel;
    		var cpuArray=new Array();
    		for(i=1;i<=logicCpu;i++){
    			cpuArray[i-1]='['+i+','+'\''+i+'\''+']';
    		}
    		/*switch (capaInfo.logicCpukernel) {
			case 1: data=[1,'1']; break;
			case 2: data=[[1,'1'],[2,'2']]; break;
			case 4: data=[[1,'1'],[2,'2'],[4,'4']]; break;
			case 8: data=[[1,'1'],[2,'2'],[4,'4'],[6,'6'],[8,'8']]; break;
			case 16: data=[[1,'1'],[2,'2'],[4,'4'],[6,'6'],[8,'8'],[16,'16']]; break;
			case 32: data=[[1,'1'],[2,'2'],[4,'4'],[6,'6'],[8,'8'],[16,'16'],[32,'32']]; break;
			default:
				data=[[1,'1'],[2,'2'],[4,'4']];
				break;
			}*/
    		data='['+cpuArray.toString()+']';
    		store.loadData(eval(data));
    	}
    }//,
  // autoLoad: true //很关键
});