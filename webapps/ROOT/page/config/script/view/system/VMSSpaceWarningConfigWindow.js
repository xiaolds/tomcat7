/**
 * author:yangbobin
 * date:2016-10-18
 * desc:存储介质空间不足预警 阈值配置窗口
 */
Ext.define('acesure.config.view.system.VMSSpaceWarningConfigWindow', {
    extend : 'Ext.window.Window',
    alias : 'widget.vmsSpaceThreshold',
    id : 'vmsSpaceThreshold',
    width:350,
    title:local.config.vmsSWarningMaxWin,
    border:false,
    resizable:false,
    buttonAlign:"right",
    modal:true,
    
    initComponent : function(){
        var me = this;
                
        Ext.applyIf(me, {
            items : [{
                  xtype: 'form',
                  id:'warningStorageCfg',
                  layout:"form",
                  border:false,
                  bodyBorder:false,
                  padding:10,
                  defaultType: 'textfield',
                  items:[{
                        xtype:'fieldset',
                        title: local.basicInfo,
                        collapsible: false,
                        autoHeight:true,
                        layout:"hbox",
                        padding:"0 0 10 10",
                        items:[{
                            id:'warningStorage',
                            xtype:'numberfield',
                            msgTarget:'side',
                            lableWidth:80,
                            width:'100%',
                            allowDecimals:false,
                            value:80,//默认阈值为80
                            minValue:50,
                            maxValue:99,
                            name:'warningStorage',
                            fieldLabel:local.config.vmsSWarningaValue,
                            allowBlank: false
                        }, {
                            xtype : 'label',
                            text : '%',
                            flex:1,
                            margin : '0 0 0 5'
                            }]
                },{
                    xtype:'fieldset',               
                    title: local.explain,
                    autoHeight:true,
                    collapsed: false,
                    defaultType: 'textfield',
                    html:local.config.vmsSWarningExplain
                }]
            }
                
            ],                        
            buttons : [{
                        text:local.btn.save,
                        cls:"btn_focus",
                        id:'thresholdSaveBtn'
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