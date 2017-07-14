Ext.define("acesure.emergency.model.VirManHardDiskModel",{
	extend:"Ext.data.Model",
	alias:"widget.virManHardDiskModel",
	fields:[
	        {name:"id"},
	        {name:"diskIndex"},
	        {name:"diskFilePath"},
	        {name:"isOS"},
	        {name:"vmimgId"}
	        
	]
});