Ext.define('acesure.emergency.model.NetWorkListModel', {
    extend: 'Ext.data.Model',
    alias:"widget.NetWorkListModel",
    fields: [
             	{name:"index",type:"string"},
		        {name:"name",type:"string"},
		        {name:"ip",type:"string"},
		        {name:"id",type:"string"},
		        {name:"mac",type:"string"},
		        {name:"description",type:"string"},
		        {name:"calId",type:"string"}
    ]
});