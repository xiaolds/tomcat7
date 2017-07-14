/**
 * author:yangbobin
 * desc:消息通知详细信息
 * date:2016-4-25
 */
 Ext.define('acesure.msgcenter.view.NotifyInfo',{
     extend : 'Ext.panel.Panel',
     alias : 'widget.notifyInfo',
     id : 'notifyInfo',
     padding:20,
     border:false,
     style:"border:1px solid #D1DADE;border-left:none;",
     layout : 'vbox',    //垂直布局
     items : [{
     	        itemId : 'infoTitle',    //消息标题
     	        layout : 'hbox',
     	        height:70,
     	        width:"100%",
     	        border:false,
     	        style:"border-bottom:1px solid #eee",
     	        items : [{
 	                        itemId :'stateIcon',    //警告、异常 图标
                            width : 70,
                            height:70,
                            border:false,
                            html : ''
     	                },{
     	                    itemId : 'title',
     	                    flex:1,
     	                    height:70,
     	        	        border:false,
     	                    //警告状态引用样式 info_title_orange 异常状态引用样式 info_title_red
     	                    html : ""
     	                }]
             },{
     	        itemId : 'baseInfo',    //消息基本信息
     	        border:false,
     	        width:"100%",
     	        padding:'17 0 10 0',
     	        style:"border-bottom:1px solid #eee",
     	        html:local.msg.clickShow
             },{
             	itemId : 'detailInfo',    //消息详细内容
             	border:false,
     	        width:"100%",
     	        padding:'10 0 10 0',
             	html:""
             }
          ]
 });