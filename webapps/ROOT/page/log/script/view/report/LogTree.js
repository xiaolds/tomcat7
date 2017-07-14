/*
 * 日志模块 列表树
 */
Ext.define('acesure.view.report.LogTree', {
	extend: 'Ext.tree.Panel',
    alias : 'widget.logTree',
    id : 'logTreeId',
    store: 'report.LogTreeStore',
    cls:'bgcolor',
    border:false,
    bodyBorder:false,
    bodyStyle:'background:#f5f8fa',
    padding:'14 10 10 12',
    useArrows : true,//使用箭头
    rootVisible: false
});
