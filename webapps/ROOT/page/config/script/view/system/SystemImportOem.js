/**
 * author:yangbobin
 * date:2016-10-18
 * desc:存储介质空间不足预警 阈值配置窗口
 */
Ext.define('acesure.config.view.system.SystemImportOem', {
    extend : 'Ext.window.Window',
    alias : 'widget.systemImportOem',
    id : 'SystemImportOemId',
    width:380,
    title:"系统模版导入",
    border:false,
    resizable:false,
    buttonAlign:"right",
    modal:true,
    
    initComponent : function(){
        var me = this;
                
        Ext.applyIf(me, {
            items : [{
                  xtype: 'form',
                  id:'systemImportOemFormId',
                  layout:"form",
                  border : false,
  				  style:"background:#fff",
  				  fileUpload : true,
  				  labelWidth : 80,
                  items:[{					
					xtype : 'fieldset',
					title : "模版文件",
					collapsible : false,
					margin:"8 8 0 8",
					autoHeight : true,
					items : [{
						xtype : 'filefield',
						width : 346,
						labelWidth:70,
						emptyText : "请选择模版文件.zip",
						fieldLabel : "模版文件",
						name : 'upload',
						buttonText : local.btn.viewFile,
						msgTarget : "under"
					}]
					
				},{
					xtype : 'fieldset',
					margin:"8 20 0 20",
					title : local.explain,
					collapsible : false,
					autoHeight : true,
					padding : 10,
					html : "添加定制化页面模版，改变页面样式。"
				} ]
            }
                
            ],                        
            buttons : [{
                        text:local.btn.save,
                        cls:"btn_focus",
                        id:'systemImportOemFormBtn',
                        handler : function(v) {
                        	var window=v.up('window');
                			var form=window.query('#systemImportOemFormId')[0];
                			var filePath = window.query("fileuploadfield")[0].getValue();
                			//validation
            				if (isNull(filePath)) {
            					Ext.Msg.alert(local.window.tip, "模版不能为空！");
            					btn.enable();
            					return ;
            				}
            				var suffix = filePath.substring(filePath.lastIndexOf(".") + 1);
            				if ("zip" != suffix) {
            					Ext.Msg.alert(local.window.tip, "请上传zip文件！");
            					btn.enable();
            					return ;
            				}
            				
                			form.getForm().submit({					
            					method : 'post',
            					params:{'fileName':filePath},
            					url : '/config/toSystemConfigAction!importOemFile.action',
            					success : function(form, action) {
            						var data=Ext.decode(action.result.detail);
            						showMsg(data);
            						window.close();
            					},
            					failure : function(form, action) {
            						window.close();
            					}
            				});
                		}
                    },{
                        text : local.btn.cancle,
                        handler : function() {                      
                            this.up('window').close();
                        }
                    }
                    ]
        }
    );
        me.callParent(arguments);   
    }
});
function showMsg(data){
	var msgCode=data[0].msgCode;
	var msgContent=data[0].msgContent;
	//>30000异常，=30000正常
	if(msgCode>30000){
		Ext.websure.MsgError(msgCode,msgContent);
		//Ext.MessageBox.alert(local.window.tip,msgCode+":"+msgContent);
	}else{
		Ext.websure.MsgTip.msg(local.window.tip, msgContent,true);
		//Ext.MessageBox.alert(local.window.tip,msgCode+":"+msgContent);
	}
}