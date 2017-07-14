
Ext.define('websure.backup.store.ImitateStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.imitateStore',
    model: 'websure.backup.model.ImitateModel',
    proxy:{
        type:'ajax',
        url : '/backup/tomonitorAction!findServerWarningConfigBydeviceId.action',
		reader: {
            type: 'json',
            root: 'detail'
        }
    },
    listeners:{
    	load:function(){
        	// 检测 模拟监控中的条数，如果为0，保存按钮无法点按
        	var grid = Ext.getCmp("imitateGrid");
        	if(typeof grid === "undefined") {
        		return ;
        	}
        	var dataCount = Ext.getCmp("imitateGrid").getStore().getTotalCount();
        	if (0 == dataCount) {
        		// 置灰保存按钮
        		Ext.getCmp("minitorSaveButton").setDisabled(true);
        	} else {
        		// 置亮保存按钮
        		Ext.getCmp("minitorSaveButton").setDisabled(false);
        	}
        }
    }
    
});