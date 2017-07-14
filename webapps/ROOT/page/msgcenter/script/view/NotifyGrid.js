/**
 * author:yangbobin
 * desc:消息通知表格
 * date:2016-4-25
 */
 Ext.define('acesure.msgcenter.view.NotifyGrid',{
     extend : 'Ext.grid.Panel',
     alias : 'widget.notifyGrid',
     id : 'notifyGrid',
     store : 'NotifyListStore',
     border:false,
     style:"border:1px solid #D1DADE;border-top:none;border-right:none;border-bottom:none;",
     height : 300,
     columns : [
                 {header :local.msg.noticeId,dataIndex : 'notifyId' ,hidden:true,menuDisabled: true},    //消息ID
                 {header : '',dataIndex : 'notifyState',width:30,menuDisabled:true,
                    renderer:function(v){
                                if(v==1){
                                    return '<image src="/images/msgcenter/normal_16.png"/>';
                                }else if(v==2){
                                    return '<image src="/images/msgcenter/error_16.png"/>';
                                }else if(v==3){
                                	return '<image src="/images/msgcenter/warning_16.png"/>';
                                }
                 }},    //消息状态1.正常 2.故障 3.警告
                 {header :local.msg.theTitle,dataIndex : 'title',width:200,menuDisabled:true,
                    renderer:function(v, cellMeta, record, rowIndex, columnIndex, store){
                    	        var isRead = record.data['isRead'];  //==1 未读 ==2已读
                    	        if(isRead==1){
                        	        return '<font style="color:#00aaaa;">'+v+'</font>';
                    	        }else{
                    	        	return '<font style="color:#aaa;">'+v+'</font>';
                    	        }
                    },
                    listeners: {
                        click:function(self,td,item){
                        	td.getElementsByTagName("font")[0].style.color = "#aaa";
                        }
                    }
                 },    //消息内容
                 {header :local.log.gridTime,dataIndex : 'notifyTime',flex :1,menuDisabled:true,
                    renderer: function(value) {
                 	      		 var notifyDate = value.split(' ')[0];    //消息产生的日期
                 	      		 return notifyDate;
                 }}    //消息产生时间
               ],
     listeners : {
         /*afterrender : function(){
              Ext.getCmp("notifyGrid").store.load();
         }*/
    },
    //底部分页待处理
    dockedItems: [{
        id: 'notifyPage',
        xtype: 'pagingtoolbar',
        store: 'NotifyListStore',
        dock: 'bottom',    //分页 位置
        emptyMsg: '',
        displayInfo: false,
        displayMsg: '',
        beforePageText: '',
        afterPageText: '/{0}'
    }]
 });