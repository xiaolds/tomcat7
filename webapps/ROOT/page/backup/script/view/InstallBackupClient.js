/**
 * author:yangbobin
 * date:2017-5-18
 * desc:批量安装客户端页面
 */
Ext.define("websure.backup.view.InstallBackupClient", {
    extend : 'Ext.window.Window',
    title : '客户端安装',
    draggable : false,
    width:400,
    height:600,
    closable : true,
    id : 'installBackupClient',
    modal : true,
    resizable : false,
    items:[
    	{
    	    height:'80%',
            xtype:'clientInfoList'
        },{
            xtype:'button',
            border:false,
            cls:'ie8 btn_pad_left',
            textAlign :'left',
            style : 'background:none;margin-top: 20px;',
            html:'<span class="btn_text_underline">'+'新增客户端'+'</span>',
            handler : function() {
            	//新增客户端配置信息
            	var addClientInfoWin = Ext.create('websure.backup.view.ClientInfoWin').show();
            }
    }],
    buttons : [
               {
                text:'安装',
                cls:"btn_focus",
                id:'install',
                handler : function() {
                    alert('TODO:安装客户端...');
                }
              },{
                text : local.btn.cancle,
                handler : function() {
                    this.up('window').close();
                }}
               
            ]
});

//
var store = Ext.create("Ext.data.Store", {
        model: "websure.backup.model.ClientInfoModel",
        data: [
             /*{clientIP:'192.168.1.1',clientUName:'admin',clientPsd:'123'},
             {clientIP:'192.168.1.2',clientUName:'admin',clientPsd:'123'}*/
        ]
    });

/**
 * 客户端信息列表
 */
Ext.define('websure.backup.view.ClientInfoList', {
	extend : 'Ext.grid.Panel',
    alias : 'widget.clientInfoList',
    id : 'clientInfoList',
    width:'100%',
    enableColumnResize:false,
    //store:'ClientInfoListStore',  //TODO store
    store:store,
    columns:[
         { header: '客户端IP', menuDisabled:true,width:'30%',dataIndex: 'clientIP'},
         { header: '用户名', menuDisabled:true,width:'30%',dataIndex: 'clientUName'},
         { header: '客户端密码', menuDisabled:true,dataIndex: 'clientPsd',hidden:true},
         {
            menuDisabled:true,
            xtype : 'actioncolumn',
            flex:1,
            text : local.emergency.gridHander,
            dataIndex : 'id',
            tdCls : 'action',
            menuText : local.emergency.gridHander,    //viewConfig,列的显示值
            flex:1,
            items : [{
                action : 'edit',
                align: 'center',
                icon : '/images/common/edit.png',
                tooltip : local.btn.modify,
                handler : editAction
            },
            {
                icon : '',
                tooltip : ''
            },
            {
                action : 'delete',
                align: 'center',
                icon : '/images/common/delete.png',
                tooltip : local.btn.delete0,
                handler :delAction
            }]
        }
    ]
});

/**
 * 单个客户端信息填写窗口
 */
Ext.define("websure.backup.view.ClientInfoWin", {
    extend : 'Ext.window.Window',
    title : '客户端信息',
    draggable : false,
    height : 300,
    width : 400,
    closable : true,
    modal : true,
    resizable : false,
    layout: 'border',
    id:'clientInfoWin',
    items:[{
        xtype:'form',
        id:'clientInfoForm',
        region:'center',
        border:false,
        items:[{
            xtype :'textfield',
            itemId:'clientIP',
            fieldLabel: '客户端IP',  
            name: 'client.clientIP',
            allowBlank : false
        },{
            xtype :'textfield',
            itemId:'clientUName',
            fieldLabel: '用户名',  
            name: 'client.clientUName',
            allowBlank : false
        },{
            xtype :'textfield',
            itemId:'clientPsd',
            fieldLabel: '密码',  
            inputType: 'password',
            name: 'client.clientPsd',
            allowBlank : false
        }]
    }],
    buttons : [
               {
                text:'验证',
                id:'valid',
                handler:validClientInfo
              },{
                text : '保存',
                id:'saveClientInfo',
                disabled:true,
                handler:saveClientInfo
              }
            ]
});

/**
 * 验证客户端信息
 */
function validClientInfo(){
	
	//验证客户端信息的正确性
	/*Ext.getCmp('clientInfoForm').getForm().submit({
                    url : '/backup/toclientAction!validClientInfo.action',
                    success : function(form, action) {
                        var obj = action.result;
                        var validFlag = obj.validFlag;
                        if(!validFlag){
                        	alert(obj.msgContent);
                        }else{
                        	alert('客户端信息验证通过');
                        	//验证通过，启用保存按钮
                        	Ext.getCmp('saveClientInfo').enable();
                        }
                    },
                    failure : function() {
                        Ext.websure.MsgError("WF-30004",'error');
                    }
                });*/
	alert('valid');
	Ext.getCmp('saveClientInfo').enable();
	
	
}

/**
 * 保存单个客户端信息
 */
function saveClientInfo(me){
	//新增客户端配置信息放置在Store 缓存  TODO:获取信息
	var clientInfoWin = me.up('window');
	
	var clientIP = clientInfoWin.query("textfield[itemId='clientIP']")[0].getValue();;  //IP
	var clientUName = clientInfoWin.query("textfield[itemId='clientUName']")[0].getValue();;  //用户名
	var clientPsd = clientInfoWin.query("textfield[itemId='clientPsd']")[0].getValue();;  //客户端密码
	
	var clientInfo = Ext.create('websure.backup.model.ClientInfoModel', {
                        clientIP   : clientIP,
                        clientUName : clientUName,
                        clientPsd  : clientPsd
                    });
	
	Ext.getCmp('clientInfoList').getStore().add(clientInfo);
	
	//关闭窗口
	clientInfoWin.close();
}

/**
 * 客户端信息编辑
 */
function editAction(grid,rowIndex, colIndex,node, e, record, rowEl){
	alert('edit');
}

/**
 * 客户端信息删除
 */
function delAction(grid,rowIndex, colIndex,node, e, record, rowEl){
	alert('del');
}