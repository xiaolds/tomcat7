Ext.define('acesure.config.view.SyncStoragePathNoPower',{
    extend : 'Ext.panel.Panel',
    border : false,
    alias : 'widget.syncStoragePathNoPower',
    id : 'syncStoragePathNoPower',
    layout : 'vbox',
    items : [{
        width:"100%",
        height : 108,
        style:'background:#fafbfc;border:0;border-bottom:1px solid #e3eaec',
        defaults:{bodyStyle:'background:#fafbfc'},
        padding:'0 25 0 25',
        xtype : 'noPowerSynchStPathInfoBar'
    },{
       width : "100%",
       flex:1,
       border : false,
       //xtype : 'synchStPathInfoGridPanel'
       html:'介质同步未授权',
       cls:"log_text_wrap"
    }]
});

/**
 * 介质同步标题toolbar
 */
Ext.define('acesure.config.view.NoPowerSynchStPathInfoBar', {
    extend : 'Ext.Toolbar',
    alias : 'widget.noPowerSynchStPathInfoBar',
    items : [ {
        xtype : "panel",
        border : false,
        width : 48,
        height : 42,
        html : '<img src="/images/config/media.png"/>'
    }, {
        xtype : "panel",
        width:250,
        border : false,
        html : '<font class="font_h3">'+local.config.synConfig+'</font>'
    }]
});







