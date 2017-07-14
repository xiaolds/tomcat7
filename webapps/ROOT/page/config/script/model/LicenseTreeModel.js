Ext.define('acesure.config.model.LicenseTreeModel', {
	extend : 'Ext.data.Model',
	fields : [ 
       { name : 'uuid' },
             { name : 'type' },
             { name : 'desc' },            
             { name : 'register' }, 
             { name : 'regday' },
             { name : 'lcsinfo' },
             { name : 'version' },
             { name : 'remainday' },
             { name : 'lcs_day_num' },
             // Compute
             { name : 'compute_node_num' },
             { name : 'run_vm_total' },
             { name : 'emergency_run_vm_num' },
             { name : 'emulation_run_vm_num' },
             { name : 'emergency_cpu_num' },
             { name : 'emergency_memory_size' },
             { name : 'enable_auto_emergency_function' },
             // Storage
             { name : 'storage_node_num' },
             { name : 'total_backup_capicity' },
             { name : 'enable_create_empty_disk' },
             { name : 'enable_advantage_moving' },
             { name : 'enable_little_backup' },
             // Client6.0
             { name : 'emergency_client_num' },
             { name : 'emergency_client_used_num' },
             { name : 'emulation_client_num' },           
             { name : 'emulation_client_used_num' },           
             { name : 'enable_lan_free_backup' },
             { name : 'enable_fc_mount' },
             { name : 'enable_disaster_toletance' },
             { name : 'enable_advantage_emergency' },
             { name : 'physical_num' },
             { name : 'virtual_num' },
             { name : 'max_snap_num' },
             { name : 'max_snap_data_set_num' },
             { name : 'physical_left_num' },
             { name : 'virtual_left_num' },
             { name : 'client_changed_number' },
             { name : 'client_change_left_num' },
             { name : 'totalNum' },
             { name : 'totalLeftNum' },
             { name : 'usedPhysicalNum' },
             { name : 'usedVirtualNum' },	// added by lids on 2017年6月7日10:45:18
             { name : 'computeNodeAuthedNum' },
             { name : 'storageNodeAuthedNum' },
             
             // DB
             { name : 'backup_db_client_num' },
             { name : 'dbBackupAuthedNum' },	// added by lids on 2017年6月7日10:45:18
             // Cluster
             { name : 'enable_cluster_backup' },
             { name : 'master_slave_model' },
             { name : 'double_master_model' },
             { name : 'multi_master_mode' },
             // Monitor
             { name : 'enable_monitor' },
             { name : 'enable_monitor_system' },
             { name : 'enable_monitor_web' },
             { name : 'enable_monitor_db' },
             { name : 'enable_monitor_user_defined_script' }
	  ]
});