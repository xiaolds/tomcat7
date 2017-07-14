var isAceSureView=false;    //flag为true,默认显示acesure表格视图，flag为false,显示epm视图
Ext.define(		
	'acesure.config.view.license.LicenseConfigPanel',
	{
		extend : 'Ext.panel.Panel',
		alias : 'widget.licenseConfigPanel',
		border : false,
		layout:"vbox",
		items : [
				{
					xtype : 'toolbar',
					width:"100%",
					height : 108,
					padding : '0 25 0 25',
					style : 'background:#fafbfc;border:0;border-bottom:1px solid #e3eaec',
					defaults : {
						bodyStyle : 'background:#fafbfc'
					},
					items : [
							{
								xtype : "panel",
								border : false,
								html : '<img src="/images/config/license.png"/ style="width:48px;height:42px">'
							},
							{
								xtype : "panel",
								border : false,
								html : "<font class='font_h3'>"
										+ local.config.authorise
										+ "</font>"
							},
							'->',
							{
								xtype : 'button',
								id : 'productActiveOnBtn',
								itemId : 'systemconfig_license_activeonline',
								text : local.config.activeWayOnline
							},
							{
								xtype : 'button',
								id : 'productActiveOffBtn',
								itemId : 'systemconfig_license_activeoffline',
								text : local.config.activeWayOffline
							} ]
				},
				{
					xtype : 'licenseTreePanel',/*'licenseGridPanel',*/
					flex:1,
					width:"100%",
					border : false
				},
				{
					xtype : 'toolbar',
					height : 70,
					width:"100%",
					padding : '0 25 0 25',
					style : 'background:#fafbfc;border:0;border-top:1px solid #d1dade;border-bottom:1px solid #EEF2F4',
					defaults : {
						style : 'background:#fafbfc;'
					},
					items : [
							{
								xtype : "panel",
								border : false,
								width : 35,
								height : 31,
								bodyStyle:"background:none",
								html : '<img src="/images/config/info.png"/>'
							},
							{
								xtype : "panel",
								border : false,
								bodyStyle:"background:none",
								html : '<font class="font_h4">'
										+ local.btn.detailInfo
										+ '</font>'
							},'->',{
                                xtype : 'button',
                                text:'切换视图',
                                id:'switchViewBtnId',
                                hidden:true,
                                style : 'padding-left:22px;border-color:#099;',
                                icon : '/images/common/list.png',
                                handler:function(){
                                    if(isAceSureView){
                                        Ext.getCmp("licensePreviewPanelId").show();
                                        Ext.getCmp("licensePreviewDefaultPanelId").hide();
                                        isAceSureView=false;
                                    }
                                    else{
                                        Ext.getCmp("licensePreviewPanelId").hide();
                                        Ext.getCmp("licensePreviewDefaultPanelId").show();
                                        isAceSureView=true;
                                    }
                                }
                            } ]
				}, {
				    xtype:'licensePreviewPanel',
				    id:'licensePreviewPanelId',
				    overflowY:"auto",
                    hidden:true,
				    flex:3.4,
				    width:'100%'
				},{
				    id:'licensePreviewDefaultPanelId',
				    border:false,
					layout:"hbox",
					flex:3.4,
					overflowY:"auto",
					width:"100%",
					items:[
					       {
					xtype : 'propertygrid',
					hideHeaders : true,
					border : false,
					flex:1,
					nameColumnWidth:200,
					id : 'licensePropertyGridLeft',
					sortableColumns : false,
					sourceConfig : {
						uuid : {
							displayName : local.config.productUuid
						},
						type : {
							displayName : local.config.productType,
							renderer : function(v) {
								return v == 0 ? local.config.basicPro : local.config.basicPro;
							}
						},
						regday : {
							displayName : local.config.registerTime
						},
						version : {
							displayName : local.config.versionType,
							renderer : function(v) {
								return v == 0 ? local.config.version : local.config.trial;
							}
						},
						remainday : {
							displayName : local.config.remainDays
						},
						desc : {
							displayName : local.btn.detailInfo
						},						
						compute_node_num : {
							displayName : local.config.calnode,
							renderer : function(v) {
								return showLicenseEachValue(v, 1);
								//return -1 == v ? '无限制' : v;
							}
						},
						run_vm_total : {
							displayName : "运行中虚拟机总个数",
							renderer : function(v) {
								return showLicenseEachValue(v, 1);
								//return -1 == v ? '无限制' : v;
							}
						},						
						emergency_run_vm_num : {
							displayName : local.config.emerRunVMNum,
							renderer : function(v) {
								return showLicenseEachValue(v, 1);
								//return -1 == v ? '无限制' : v;
							}
						},
						emulation_run_vm_num: {
							displayName : local.config.emuRunVMNum,
							renderer : function(v) {
								return showLicenseEachValue(v, 1);
								//return -1 == v ? '无限制' : v;
							}
						},
						emergency_cpu_num: {
							displayName : local.config.emerCPUNum,
							renderer : function(v) {
								return showLicenseEachValue(v, 1);
								//return -1 == v ? '无限制' : v;
							}
						},
						emergency_memory_size : {
							displayName : local.config.emerVMMem,
							renderer : function(v) {
								return showLicenseEachValue(v, 1);
								//return -1 == v ? '无限制' : v;
							}
						},
						enable_auto_emergency_function : {
							displayName : local.config.autoEmerEnable,
							renderer : function(v) {
								return showLicenseEachValue(v, 0);
								//return v ? '开启' : '关闭';
							}
						},
						storage_node_num : {
							displayName : local.config.stornode,
							renderer : function(v) {
								return showLicenseEachValue(v, 1);
								//return -1 == v ? '无限制' : v;
							}
						},
						enable_create_empty_disk : {
							displayName : local.config.emptyDiskEnable,
							renderer : function(v) {
								return showLicenseEachValue(v, 0);
								//return v ? '开启' : '关闭';
							}
						},
						/*enable_advantage_moving : {
							displayName : '高级迁移模式',
							renderer : function(v) {
								return v ? '开启' : '关闭';
							}
						},*/
						total_backup_capicity : {
							displayName :local.config.backupCapicityLimit,
							renderer : function(v) {
								return showLicenseEachValue(v, 1);
								//return -1 == v ? '无限制' : v;
							}
						},
						enable_little_backup : {
                            displayName :'小颗粒备份',
                            renderer : function(v) {
                                return showLicenseEachValue(v, 0);
                                //return v ? '开启' : '关闭';
                            }
                        },
						emergency_client_num : {
							displayName : local.config.emerClientNum,
							renderer : function(v) {
								return showLicenseEachValue(v, 1);
								//return -1 == v ? '无限制' : v;
							}
						},
						emulation_client_num : {
							displayName : local.config.emuClientNum,
							renderer : function(v) {
								return showLicenseEachValue(v, 1);
								//return -1 == v ? '无限制' : v;
							}
						},
						enable_fc_mount : {
							displayName : local.config.FCMount,
							renderer : function(v) {
								return showLicenseEachValue(v, 0);
								//return v ? '开启' : '关闭';
							}
						},				
						enable_lan_free_backup : {
							displayName :local.config.lanFreeEnable,
							renderer : function(v) {
								return showLicenseEachValue(v, 0);
								//return v ? '开启' : '关闭';
							}
						},                
                        enable_cluster_backup : {
                            displayName :'集群备份',
                            renderer : function(v) {
                                return showLicenseEachValue(v, 0);
                                //return v ? '开启' : '关闭';
                            }
                        }
					},
					listeners : {
						beforeedit : {
							fn : function() {
								return false;
							}
						}
					}
				},{
					xtype : 'propertygrid',	// TODO
					hideHeaders : true,
					border : false,
					//height:"100%",
					flex:1,
					nameColumnWidth:200,
					id : 'licensePropertyGridRight',
					sortableColumns : false,
					sourceConfig : {
						lcs_day_num : {
							displayName : local.config.authDay,
							renderer : function(v) {
								return showLicenseEachValue(v, 1);
								//return -1 == v ? '永久' : v;
							}
						},								
						/*enable_advantage_emergency : {
							displayName : '高级测试演练模式',
							renderer : function(v) {
								return v ? '开启' : '关闭';
							}
						},*/
						totalNum : {
							//displayName : local.config.physicalNum,	// TODO
							displayName : "客户端授权总点数",	// TODO
							renderer : function(v) {
								return showLicenseEachValue(v, 1);
								//return -1 == v ? '无限制' : v;
							}
						},
						usedPhysicalNum : {
                            displayName : '客户端(物理机)已授权个数',
                            renderer : function(v) {
                                return showLicenseEachValue(v, 1);
                                //return -1 == v ? '无限制' : v;
                            }
                        },
                        usedVirtualNum : {
							//displayName : local.config.VMNum,
							displayName : "客户端(虚拟机)已授权个数",
							renderer : function(v) {
								return showLicenseEachValue(v, 1);
								//return -1 == v ? '无限制' : v;
							}
						},
						totalLeftNum : {
                            displayName : '剩余授权点数',
                            renderer : function(v) {
                            	console.debug("剩余授权点数", v);
                            	if(v < 0){
                            		return '<span class="color_green_margin">无限制</span>';
                            	}
                            	var phyNum = Math.floor(v / 2);	//物理点数
                            	var virNum = v;
                            	return phyNum + " 个物理机 或 " + virNum + " 个虚拟机";
                                //return showLicenseEachValue(v, 1);
                                //return -1 == v ? '无限制' : v;
                            }
                        },
                        client_changed_number : {
                            displayName : '客户端授权变更次数',
                            renderer : function(v) {
                                return showLicenseEachValue(v, 1);
                                //return -1 == v ? '无限制' : v;
                            }
                        },
                        client_change_left_num : {
                            displayName : '客户端授权变更剩余次数',
                            renderer : function(v) {
                                return showLicenseEachValue(v, 1);
                                //return -1 == v ? '无限制' : v;
                            }
                        },
						backup_db_client_num : {
							displayName : local.config.dbBackupClientNum,
							renderer : function(v) {
								return showLicenseEachValue(v, 1);
								//return -1 == v ? '无限制' : v;
							}
						},
						max_snap_num : {
							displayName : local.config.maxSnapNum,
							renderer : function(v) {
								return showLicenseEachValue(v, 1);
								//return -1 == v ? '无限制' : v;
							}
						},
						max_snap_data_set_num : {
							displayName : local.config.maxSnapDataNum,
							renderer : function(v) {
								return showLicenseEachValue(v, 1);
								//return -1 == v ? '无限制' : v;
							}
						},	
						/*master_slave_model : {
							displayName : "主备双机模式点数",
							renderer : function(v) {
								return showLicenseEachValue(v, 1);
								//return -1 == v ? '无限制' : v;
							}
						},	
						double_master_model : {
							displayName : "双主模式点数",
							renderer : function(v) {
								return showLicenseEachValue(v, 1);
								//return -1 == v ? '无限制' : v;
							}
						},	
						multi_master_mode : {
							displayName : "集群(多主)模式点数",
							renderer : function(v) {
								return showLicenseEachValue(v, 1);
								//return -1 == v ? '无限制' : v;
							}
						},*/	
						enable_disaster_toletance : {
							displayName : local.config.disasterTolerance,
							renderer : function(v) {
								return showLicenseEachValue(v, 0);
								//return v ? '开启' : '关闭';
							}
						},
						enable_monitor : {
							displayName : local.config.monitorEnable,
							renderer : function(v) {
								return showLicenseEachValue(v, 0);
								//return v ? '开启' : '关闭';
							}
						},
						enable_monitor_system : {
							displayName : local.config.basicSysMonitorEnable,
							renderer : function(v) {
								return showLicenseEachValue(v, 0);
								//return v ? '开启' : '关闭';
							}
						},
						enable_monitor_web : {
							displayName : local.config.URLMonitorEnable,
							renderer : function(v) {
								return showLicenseEachValue(v, 0);
								//return v ? '开启' : '关闭';
							}
						},
						enable_monitor_db : {
							displayName : local.config.DBMonitorEnable,
							renderer : function(v) {
								return showLicenseEachValue(v, 0);
								//return v ? '开启' : '关闭';
							}
						},
						enable_monitor_user_defined_script : {
							displayName : local.config.defineScriptMonitorEnable,
							renderer : function(v) {
								return showLicenseEachValue(v, 0);
								//return v ? '开启' : '关闭';
							}
						}
					},
					listeners : {
						beforeedit : {
							fn : function() {
								return false;
							}
						}
					}
				}]
				}],
				listeners:{
					render: function(v, eOpts){
						POWER_OP.filterEnableWidgetsOfExtjs(v, CURRENT_USER.getSystemPower());
					}
				}

	});

//切换视图-epm选型视图
Ext.define("acesure.config.view.license.LicensePreviewPanel",{
    extend: 'Ext.Panel',
    border:false,
    height:'100%',
    width:'100%',
    alias:'widget.licensePreviewPanel',
    xtype:'vbox',
    items:[
           {
               xtype:'licensePreviewPaneSoftBasic'
           },
           {
               xtype:'licensePreviewPaneloftAdvanced'
           }
           ]
});

//基础包
Ext.define('acesure.config.view.license.LicensePreviewPaneSoftBasic', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.licensePreviewPaneSoftBasic',
    id:'licenseBasicPackageId',
    title:'基础包',
    border:false,
    bodyBorder:false,
    cls:'header_ccc',
    lcsData:{},	// 自定义	
    defaults: {
        xtype:'panel',
        layout: {
            type: 'hbox',
            align: 'middle'
        },
        width:'100%',
        bodyPadding:10,
        border:false,
        style: 'border-top:1px solid #ccc'
    },
    listeners:{
    	'afterrender':function(eOpts){
    		var lcsData = eOpts.lcsData;
    		// 填入lcs信息
    		// html:'最大vCPU<span class="color_green_margin">8</span>核/台'	// emergency_cpu_num
    		var emergency_cpu_num = Ext.getCmp("emergency_cpu_num_id");
    		emergency_cpu_num.update('最大 vCPU 核数: <span class="color_green_margin">' + handleinfinity(lcsData.emergency_cpu_num) + '</span>');
    		
    		// html:'最大内存<span class="color_green_margin">16</span>GB/台'	// emergency_memory_size
    		var emergency_memory_size = Ext.getCmp("emergency_memory_size_id");
    		
    		if(lcsData.emergency_memory_size < 0) {
    			emergency_memory_size.update('最大内存：<span class="color_green_margin">无限制</span>');
    		} else {
    			emergency_memory_size.update('最大内存<span class="color_green_margin">' + lcsData.emergency_memory_size + '</span>MB');
    		}
    		
    		// html:'最大同时运行应急虚拟机<span class="color_green_margin">2</span>台'	// emergency_run_vm_num
    		var emergency_run_vm_num = Ext.getCmp("emergency_run_vm_num_id");
    		emergency_run_vm_num.update('最大同时运行应急虚拟机<span class="color_green_margin">' + lcsData.emergency_run_vm_num + '</span>台');
    		
            // html:'共授权<span class="color_green_margin">5</span>台，已使用<span class="color_green">2</span>台' // compute_node_num
    		var compute_node_num = Ext.getCmp("compute_node_num_id");
    		if(lcsData.compute_node_num < 0){
    			compute_node_num.update('计算节点<span class="color_green_margin">无限制</span>');
    		} else {
    			compute_node_num.update('共授权<span class="color_green_margin">' + lcsData.compute_node_num + 
        				'</span>台，已使用<span class="color_green_margin">' + lcsData.computeNodeAuthedNum + '</span>台');
    		}
    		
    		
    		// html:'共授权<span class="color_green_margin">5</span>台，已使用<span class="color_green_margin">2</span>台'	// storage_node_num
    		var storage_node_num = Ext.getCmp("storage_node_num_id");
    		if(lcsData.storage_node_num < 0){
    			storage_node_num.update('存储节点<span class="color_green_margin">无限制</span>');
    		} else {
    			storage_node_num.update('共授权<span class="color_green_margin">'+ lcsData.storage_node_num +
        				'</span>台，已使用<span class="color_green_margin">' + lcsData.storageNodeAuthedNum + '</span>台');
    		}
    		
    		//html:'共有备份授权<span class="color_green_margin">2</span>台'	//totalNum 
            var totalNum = Ext.getCmp("totalNumId");
            var usedNum = Ext.getCmp("usedNumId");
            //var usedVirtualNum = Ext.getCmp("usedVirtualNumId");
            var totalLeftNum = Ext.getCmp("totalLeftNumId");
            if(lcsData.totalNum < 0) {
            	totalNum.update('备份授权<span class="color_green_margin">无限制</span>');
            	usedPhysicalNum.update('');
                usedVirtualNum.update('');
                totalLeftNum.update('剩余授权<span class="color_green_margin">无限制</span>');
            } else {
            	totalNum.update('总授权点数：<span class="color_green_margin">' + lcsData.totalNum + '</span>，'
            			+ '可创建<span class="color_green_margin">' + Math.floor(lcsData.totalNum/2) + '</span>台物理机，'
            			+ '<span class="color_green_margin">' + lcsData.totalNum + '</span>台虚拟机');
            	usedNum.update('已使用点数：<span class="color_green_margin">' + (lcsData.usedPhysicalNum * lcsData.usedVirtualNum) + '</span>，'
            			+ '其中有<span class="color_green_margin">' + lcsData.usedPhysicalNum + '</span>台物理机，' 
            			+ '<span class="color_green_margin">' + lcsData.usedVirtualNum + '</span>台虚拟机');
                //usedPhysicalNum.update('已使用物理授权<span class="color_green_margin">' + lcsData.usedPhysicalNum + '</span>台');
                //usedVirtualNum.update('已使用虚拟授权<span class="color_green_margin">' + lcsData.usedVirtualNum + '</span>台');
                totalLeftNum.update('剩余总点数：<span class="color_green_margin">' + lcsData.totalLeftNum + '</span>，' 
                		+ '可创建<span class="color_green_margin">' + Math.floor(lcsData.totalLeftNum/2) + '</span>台物理机，'
                		+ '<span class="color_green_margin">' + lcsData.totalLeftNum + '</span>台虚拟机');
            }
    		
            //html:'授权<span class="color_green_margin">2</span>台，已使用<span class="color_green_margin">2</span>台'	// emergency_client_num 
            var emergency_client_num = Ext.getCmp("emergency_client_num_id");
            if(lcsData.emergency_client_num < 0) {
            	emergency_client_num.update('授权点数:<span class="color_green_margin">无限制</span>');
            } else {
            	emergency_client_num.update('授权<span class="color_green_margin">' + lcsData.emergency_client_num + '</span>台，已使用<span class="color_green_margin">' + lcsData.emergency_client_used_num + '</span>台');
            }
    		
            // html:'授权<span class="color_green_margin">2</span>台，已使用<span class="color_green_margin">2</span>台'	// emulation_client_num
            var emulation_client_num = Ext.getCmp("emulation_client_num_id");
            if(lcsData.emulation_client_num < 0){
            	emulation_client_num.update('授权点数:<span class="color_green_margin">无限制</span>');
            } else {
            	emulation_client_num.update('授权<span class="color_green_margin">' + lcsData.emulation_client_num + '</span>台，已使用<span class="color_green_margin">' + lcsData.emulation_client_used_num + '</span>台');
            }
            
    		this.doLayout();
//    		console.debug("lcsData", eOpts.lcsData );
    	}
    },
    items:[{
               items:[
                      {
                          //第一列加粗标题，如果有多行文字，标题文字后面加</br>
                          xtype:'label',
                          flex:3,
                          cls:'f_bold',
                          html:'主控管理平台'
                      },{
                          //第二列解释文字
                          xtype:'label',
                          flex:2,
                          html:''
                      },{
                          //第三列授权详情,<span class="color_green_margin">1</span>为绿色文字
                          xtype:'fieldcontainer',
                          layout:'vbox',
                          flex:2,
                          items:[
                                 {
                                     xtype:'label',
                                     width:'100%',
                                     html:'管理平台<span class="color_green_margin">启用</span>'
                                 },{
                                     xtype:'label',
                                     width:'100%',
                                     html:'整机备份模块'
                                 },{
                                     xtype:'label',
                                     width:'100%',
                                     html:'应急接管模块'
                                 },{
                                     xtype:'label',
                                     width:'100%',
                                     html:'演练模块'
                                 },{
                                     xtype:'label',
                                     width:'100%',
                                     html:'整机挂载恢复模块'
                                 },{
                                     xtype:'label',
                                     width:'100%',
                                     html:'业务一体化在线迁移模块'
                                 }
                                 ]
                      }
                      ]
           },{
               items:[
                      {
                          xtype:'label',
                          flex:3,
                          cls:'f_bold',
                          html:'应急主机性能'
                      },{
                          xtype:'label',
                          flex:2,
                          html:''
                      },{
                          xtype:'fieldcontainer',
                          layout:'vbox',
                          flex:2,
                          items:[
                                 {
                                     xtype:'label',
                                     width:'100%',
                                     id:'emergency_cpu_num_id',
                                     html:'最大vCPU<span class="color_green_margin">8</span>核/台'	// emergency_cpu_num
                                 },{
                                     xtype:'label',
                                     width:'100%',
                                     id:'emergency_memory_size_id',
                                     html:'最大内存<span class="color_green_margin">16</span>GB/台'	// emergency_memory_size
                                 }
                                 ]
                      }
                      ]
           },{
               items:[
                      {
                          xtype:'label',
                          flex:3,
                          cls:'f_bold',
                          html:'管理平台应急主机'
                      },{
                          xtype:'label',
                          flex:2,
                          html:''
                      },{
                          xtype:'fieldcontainer',
                          layout:'vbox',
                          flex:2,
                          items:[
                                 {
                                     xtype:'label',
                                     width:'100%',
                                     id:'emergency_run_vm_num_id',
                                     html:'最大同时运行应急虚拟机<span class="color_green_margin">2</span>台'	// emergency_run_vm_num
                                 }/*,{
                                     xtype:'label',
                                     width:'100%',
                                     id:'emergency_client_num_id',
                                     html:'最大管理主机数量<span class="color_green_margin">无限制</span>'		// emergency_client_num
                                 }*/
                                 ]
                      }
                      ]
           },{
               items:[
                      {
                          xtype:'label',
                          flex:3,
                          cls:'f_bold',
                          html:'计算节点信息'
                      },{
                          xtype:'label',
                          flex:2,
                          html:''
                      },{
                          xtype:'fieldcontainer',
                          layout:'vbox',
                          flex:2,
                          items:[
                                 {
                                     xtype:'label',
                                     width:'100%',
                                     id:'compute_node_num_id',
                                     html:'共授权<span class="color_green_margin">5</span>台，已使用<span class="color_green">2</span>台' // compute_node_num
                                 }
                                 ]
                      }
                ]
           },{
              items:[
                                 {
                                     xtype:'label',
                                     flex:3,
                                     cls:'f_bold',
                                     html:'存储节点信息'
                                 },{
                                     xtype:'label',
                                     flex:2,
                                     html:''
                                 },{
                                     xtype:'fieldcontainer',
                                     layout:'vbox',
                                     flex:2,
                                     items:[
                                            {
                                                xtype:'label',
                                                width:'100%',
                                                id:'storage_node_num_id',
                                                html:'共授权<span class="color_green_margin">5</span>台，已使用<span class="color_green_margin">2</span>台'	// storage_node_num
                                            }
                                            ]
                                 }
                 ]
           },{
              items:[
                                 {
                                     xtype:'label',
                                     flex:3,
                                     cls:'f_bold',
                                     html:'备份授权信息'
                                 },{
                                     xtype:'label',
                                     flex:2,
                                     html:''
                                 },{
                                     xtype:'fieldcontainer',
                                     layout:'vbox',
                                     flex:2,
                                     items:[{
		                                         xtype:'label',
		                                         width:'100%',
		                                         id:'totalNumId',
		                                         html:'共有备份授权<span class="color_green_margin">2</span>台'	//totalNum 
                                     		},
                                            {
                                                xtype:'label',
                                                width:'100%',
                                                id:'usedNumId',
                                                html:'物理授权<span class="color_green_margin">2</span>台，已使用<span class="color_green_margin">2</span>台'	//usedPhysicalNum 
                                            }/*,{
                                                xtype:'label',
                                                width:'100%',
                                                id:'usedVirtualNumId',
                                                html:'虚拟授权<span class="color_green_margin">2</span>台，已使用<span class="color_green_margin">2</span>台'	// usedVirtualNum 
                                            }*/,{
		                                         xtype:'label',
		                                         width:'100%',
		                                         id:'totalLeftNumId',
		                                         html:'剩余授权点数<span class="color_green_margin">5</span>个物理点，或者 <span class="color_green_margin">5</span>个物理点'	//totalLeftNum 
                                     		}
                                            ]
                                 }
                                 ]
          },{
             items:[
                                 {
                                     xtype:'label',
                                     flex:3,
                                     cls:'f_bold',
                                     html:'应急授权信息'
                                 },{
                                     xtype:'label',
                                     flex:2,
                                     html:''
                                 },{
                                     xtype:'fieldcontainer',
                                     layout:'vbox',
                                     flex:2,
                                     items:[
                                            {
                                                xtype:'label',
                                                width:'100%',
                                                id:'emergency_client_num_id',
                                                html:'授权<span class="color_green_margin">2</span>台，已使用<span class="color_green_margin">2</span>台'	// emergency_client_num 
                                            }
                                            ]
                                 }
                                 ]
          },{
              items:[
                     {
                         xtype:'label',
                         flex:3,
                         cls:'f_bold',
                         html:'演练授权信息'
                     },{
                         xtype:'label',
                         flex:2,
                         html:''
                     },{
                         xtype:'fieldcontainer',
                         layout:'vbox',
                         flex:2,
                         items:[
                                {
                                    xtype:'label',
                                    width:'100%',
                                    id:'emulation_client_num_id',
                                    html:'授权<span class="color_green_margin">2</span>台，已使用<span class="color_green_margin">2</span>台'	// emulation_client_num
                                }
                                ]
                     }
                     ]
          }]
});
//高级模块选购
Ext.define('acesure.config.view.license.LicensePreviewPaneSoftAdvanced', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.licensePreviewPaneloftAdvanced',
    id:'licenseAdvancePackageId',
    title:'高级模块选购',
    border:false,
    bodyBorder:false,
    cls:'header_ccc',
    lcsData:{},	//自定义
    defaults: {
        xtype:'panel',
        layout: {
            type: 'hbox',
            align: 'middle'
        },
        width:'100%',
        bodyPadding:10,
        border:false,
        style: 'border-top:1px solid #ccc'
    },
    listeners:{
    	'afterrender':function(eOpts){
    		var lcsData = eOpts.lcsData;
    		// 填入lcs信息
    		
    		var enableMsg = '<span class="color_green_margin">已开启</span>';
    		var disableMsg = '<span class=""> 未开启 </span>';
    		var tempMsg;
    		
            var enable_cluster_backup = Ext.getCmp('enable_cluster_backup_id');
            tempMsg = lcsData.enable_cluster_backup ? enableMsg : disableMsg;
    		enable_cluster_backup.update(tempMsg);
    		
    		var enable_little_backup = Ext.getCmp('enable_little_backup_id');
            tempMsg = lcsData.enable_little_backup ? enableMsg : disableMsg;
            enable_little_backup.update(tempMsg);
            
            var enable_monitor = Ext.getCmp('enable_monitor_id');
            tempMsg = lcsData.enable_monitor ? enableMsg : disableMsg;
            enable_monitor.update(tempMsg);
            
            var backup_db_client_num = Ext.getCmp('backup_db_client_num_id');
            if(lcsData.backup_db_client_num < 0){
            	// 无限授权
            	backup_db_client_num.update('小型机或 x86 平台点数：<span class="color_green_margin">无限制</span>');
            } else {
            	backup_db_client_num.update('小型机或 x86 平台共<span class="color_green_margin">' + lcsData.backup_db_client_num 
                		+ '</span>台，已使用<span class="color_green_margin">' + lcsData.dbBackupAuthedNum + '</span>台');
            }
            
            
            var emergency_advanced_package = Ext.getCmp('emergency_advanced_package_id');
            tempMsg = lcsData.emergency_cpu_num == -1 ? enableMsg : disableMsg;
            emergency_advanced_package.update(tempMsg);
            	
            var enable_disaster_toletance = Ext.getCmp('enable_disaster_toletance_id');
            tempMsg = lcsData.enable_disaster_toletance ? enableMsg : disableMsg;
            enable_disaster_toletance.update(tempMsg);
    		
    		this.doLayout();
//    		console.debug("lcsData", eOpts.lcsData );
    	}
    },
    items:[
           {
               items:[
                      {
                          xtype:'label',
                          flex:3,
                          cls:'f_bold',
                          html:'双机集群支持模块</br><span>针对双机和集群架构下的应急备份支持，包括主备双机、主主双机、两台以上集群等</span>'
                      },{
                          xtype:'label',
                          flex:2,
                          html:'·主备双机</br>·主主双机/集群</br>·三台及以上集群'
                      },{
                          xtype:'fieldcontainer',
                          layout:'vbox',
                          flex:2,
                          items:[
                                 {
                                     xtype:'label',
                                     width:'100%',
                                     id:'enable_cluster_backup_id',
                                     html:'<span class="color_green_margin">已选购</span>'	// enable_cluster_backup
                                 }
                                 ]
                      }]
           },
           {
               items:[
                      {
                          xtype:'label',
                          flex:3,
                          cls:'f_bold',
                          html:'备份性能套件</br><span>有效提升备份性能和使用体验，满足高要求的备份需求</span>'
                      },{
                          xtype:'label',
                          flex:2,
                          html:'·光纤LAN-Free备份</br>·小颗粒备份与无缝恢复</br>·自主存储LUN空间</br>·最大快照256个'
                      },{
                          xtype:'fieldcontainer',
                          layout:'vbox',
                          flex:2,
                          items:[
                                 {
                                     xtype:'label',
                                     width:'100%',
                                     id:'enable_little_backup_id',
                                     html:' 未开启 '	// enable_little_backup
                                 }
                                 ]
                      }]
           },
           {
               items:[
                      {
                          xtype:'label',
                          flex:3,
                          cls:'f_bold',
                          html:'业务仿真管理套件</br><span>快速的业务重现、以时间轴方式流程化记录测试全过程</span>'
                      },{
                          xtype:'label',
                          flex:2,
                          html:'·业务测试管理</br>·漏洞修复验证管理</br>·更新升级管理</br>·业务培训模拟'
                      },{
                          xtype:'fieldcontainer',
                          layout:'vbox',
                          flex:2,
                          items:[
                                 {
                                     xtype:'label',
                                     width:'100%',
                                     html:'<span class=""> 未开启  </span>'	// 暂未加入，均为 未开启 
                                     }
                                 ]
                      }]
           },
           {
               items:[
                      {
                          xtype:'label',
                          flex:3,
                          cls:'f_bold',
                          html:'监控预警与运营报表套件</br><span>对所保护的业务系统进行全方位监控和预警，可输出指定图表和报表</span>'
                      },{
                          xtype:'label',
                          flex:2,
                          html:''
                      },{
                          xtype:'fieldcontainer',
                          layout:'vbox',
                          flex:2,
                          items:[
                                 {
                                     xtype:'label',
                                     width:'100%',
                                     id:'enable_monitor_id',
                                     html:'<span class="color_green_margin">已选购</span>'	// enable_monitor
                                     }
                                 ]
                      }]
           },
           {
               items:[
                      {
                          xtype:'label',
                          flex:3,
                          cls:'f_bold',
                          html:'全局分级管理平台（GCC）</br><span>可实现跨省市的多层级集中式统一管理</span>'
                      },{
                          xtype:'label',
                          flex:2,
                          html:''
                      },{
                          xtype:'fieldcontainer',
                          layout:'vbox',
                          flex:2,
                          items:[
                                 {
                                     xtype:'label',
                                     width:'100%',
                                     html:'<span class=""> 未开启  </span>'	// 均 未开启 
                                     }
                                 ]
                      }]
           },
           {
               items:[
                      {
                          xtype:'label',
                          flex:3,
                          cls:'f_bold',
                          html:'小型机与数据库复制套件</br><span>对架构特殊的小型机平台进行数据库复制与接管</span>'	
                      },{
                          xtype:'label',
                          flex:2,
                          html:''
                      },{
                          xtype:'fieldcontainer',
                          layout:'vbox',
                          flex:2,
                          items:[
                                 {
                                     xtype:'label',
                                     width:'100%',
                                     id:'backup_db_client_num_id',
                                     html:'小型机平台<span class="color_green_margin">99</span>个'	// backup_db_client_num
                                 }
                                 ]
                      }]
           },
           {
               items:[
                      {
                          xtype:'label',
                          flex:3,
                          cls:'f_bold',
                          html:'应急性能套件</br><span>不限制同时运行的虚机数量，明显提升应急性能，适合高性能的业务接管需求</span>'
                      },{
                          xtype:'label',
                          flex:2,
                          html:'·接管机CPU核数不限</br>·接管机内存不限</br>·最大虚机运行台数不限</br>·自动应急接管'
                      },{
                          xtype:'fieldcontainer',
                          layout:'vbox',
                          flex:2,
                          items:[
                                 {
                                     xtype:'label',
                                     width:'100%',
                                     id:'emergency_advanced_package_id',
                                     html:'<span class="color_green_margin">已选购</span>'	// emergency_cpu_num == -1
                                     }
                                 ]
                      }]
           },
           {
               items:[
                      {
                          xtype:'label',
                          flex:3,
                          cls:'f_bold',
                          html:'异地应用容灾套件</br><span>对数据中心业务系统的异地保护、远程保护提供支持</span>'
                      },{
                          xtype:'label',
                          flex:2,
                          html:''
                      },{
                          xtype:'fieldcontainer',
                          layout:'vbox',
                          flex:2,
                          items:[
                                 {
                                     xtype:'label',
                                     width:'100%',
                                     id:'enable_disaster_toletance_id',
                                     html:'<span class="color_green_margin">已选购</span>'	// enable_disaster_toletance
                                     }
                                 ]
                      }]
           }/*,
           {
               items:[
                      {
                          xtype:'label',
                          flex:3,
                          cls:'f_bold',
                          html:'业务仿真管理套件</br><span>对数据中心进行异地数据备份、远程保护提供支持</span>'
                      },{
                          xtype:'label',
                          flex:2,
                          html:'·数据复制</br>·数据恢复'
                      },{
                          xtype:'fieldcontainer',
                          layout:'vbox',
                          flex:2,
                          items:[
                                 {
                                     xtype:'label',
                                     width:'100%',
                                     html:'<span class="color_green_margin">已选购</span>'
                                     }
                                 ]
                      }]
           },
           {
               items:[
                      {
                          xtype:'label',
                          flex:3,
                          cls:'f_bold',
                          html:'软件型号</br>3280680-998'
                      }]
           }*/
           ]
});

/**
 * 处理无限授权的情况
 * @param num
 */
function handleinfinity(num){
	if(num < 0){
		return "无限制";
	}
	return num;
}