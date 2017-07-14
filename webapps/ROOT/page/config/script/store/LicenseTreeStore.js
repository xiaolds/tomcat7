Ext.define('acesure.config.store.LicenseTreeStore', {
	extend : 'Ext.data.TreeStore',
	model : 'acesure.config.model.LicenseTreeModel',
	storeId: 'licenseTreeStore',
	proxy : {
		type : 'ajax',
		url:'/config/toLicenseAction!showLicenseProductsTree.action',
		reader : {
			type : 'json',
			root: 'children'
		}
	},
	autoLoad: true
});