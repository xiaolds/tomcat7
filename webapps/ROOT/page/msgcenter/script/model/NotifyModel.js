/**
 * author:yangbobin
 * desc:消息中心-通知数据模型
 * date:2016-4-25
 */
 Ext.define('acesure.msgcenter.model.NotifyModel',{
 	 extend : 'Ext.data.Model',
 	 fields : [ {name : 'notifyId',type : 'int'},
 	            {name : 'title',type : 'string'},
 	 		    {name : 'notifyType',type : 'int'},     //通知类型 1.系统类 2.用户类
 	 		    {name : 'notifySource',type : 'string'},
 	 		    {name : 'notifyState',type : 'int'},    //1.正常 2.故障 3.警告
 	 		    {name : 'content',type : 'string'},
 	 		    {name : 'notifyTime', type: 'string'},    //格式 : yyyy-MM-dd HH:mm:ss
 	 		    {name : 'isRead',type : 'int'},    // 1.未读 2.已读
 	 		    {name : 'moduleType',type : 'int',
                 convert:function(val){
         	 		    	if(val == 1){
         	 		    		return local.msg.backup;
         	 		    	}else if(val == 2){
         	 		    		return local.msg.warning;
         	 		    	}else if(val == 3){
         	 		    		return local.msg.Vm;
         	 		    	}else if(val == 4){
         	 		    		return local.msg.mount;
         	 		    	}else if(val == 5){
         	 		    		return local.msg.storageNode;
         	 		    	}else if(val == 6){
         	 		    		return local.msg.calNode;
         	 		    	}
                                     	 		    
 	 		    }},
 	 		    {name : 'sourceId',type : 'int'},
 	 		    {name : 'remark',type : 'string'}
 	 		  ]
 });