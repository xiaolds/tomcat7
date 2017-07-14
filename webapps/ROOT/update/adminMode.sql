/*
SQLyog Ultimate v11.11 (64 bit)
MySQL - 5.1.73-community : Database - websure
*********************************************************************
*/

/*Table structure for table `t_mail_config` */
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `t_mail_config`;

CREATE TABLE `t_mail_config` (
  `mail_config_id` INT(11) NOT NULL AUTO_INCREMENT,
  `mail_config_smtphost` VARCHAR(128) DEFAULT NULL,
  `mail_config_port` INT(11) DEFAULT NULL,
  `mail_config_user` VARCHAR(128) DEFAULT NULL,
  `mail_config_pwd` VARCHAR(128) DEFAULT NULL,
  `mail_config_address` VARCHAR(255) DEFAULT NULL,
  `mail_config_to_addr` VARCHAR(255) DEFAULT NULL,
  `mail_config_create_time` DATETIME DEFAULT NULL,
  `mail_config_update_time` DATETIME DEFAULT NULL,
  PRIMARY KEY (`mail_config_id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

/*Data for the table `t_mail_config` */

INSERT  INTO `t_mail_config`(`mail_config_id`,`mail_config_smtphost`,`mail_config_port`,`mail_config_user`,`mail_config_pwd`,`mail_config_address`,`mail_config_to_addr`,`mail_config_create_time`,`mail_config_update_time`) VALUES (1,'',NULL,'','','',NULL,NULL,NULL);

/*Table structure for table `t_reportlog_config` */
DROP TABLE IF EXISTS `t_reportlog_config`;

CREATE TABLE `t_reportlog_config` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) DEFAULT NULL,
  `is_mail_send` INT(11) DEFAULT NULL,
  `mail_send_month` INT(11) DEFAULT NULL,
  `create_time` DATETIME DEFAULT NULL,
  `update_time` DATETIME DEFAULT NULL,
  `desc` TEXT,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

/*Data for the table `t_reportlog_config` */

INSERT  INTO `t_reportlog_config`(`id`,`user_id`,`is_mail_send`,`mail_send_month`,`create_time`,`update_time`,`desc`) VALUES (1,1,0,0,NULL,NULL,NULL),(2,2,0,0,NULL,NULL,NULL),(3,3,0,0,NULL,NULL,NULL);


/*Table structure for table `t_user_notify_module` */

DROP TABLE IF EXISTS `t_user_notify_module`;

CREATE TABLE `t_user_notify_module` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `module_id` INT(11) DEFAULT NULL,
  `user_id` INT(11) DEFAULT NULL,
  `notify_time` VARCHAR(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `notify_types` VARCHAR(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `desc` VARCHAR(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `t_user_notify_module` */

INSERT  INTO `t_user_notify_module`(`id`,`module_id`,`user_id`,`notify_time`,`notify_types`,`desc`) VALUES (1,1,1,NULL,'msg',NULL),(2,2,1,NULL,'msg',NULL),(3,3,1,NULL,'msg',NULL),(4,4,1,NULL,'msg',NULL),(5,5,1,NULL,'msg',NULL),(6,6,1,NULL,'msg',NULL),(7,1,2,NULL,'msg',NULL),(8,2,2,NULL,'msg',NULL),(9,3,2,NULL,'msg',NULL),(10,4,2,NULL,'msg',NULL),(11,5,2,NULL,'msg',NULL),(12,6,2,NULL,'msg',NULL),(13,1,3,NULL,'msg',NULL),(14,2,3,NULL,'msg',NULL),(15,3,3,NULL,'msg',NULL),(16,4,3,NULL,'msg',NULL),(17,5,3,NULL,'msg',NULL),(18,6,3,NULL,'msg',NULL);


/*Table structure for table `t_notify_module` */

DROP TABLE IF EXISTS `t_notify_module`;

CREATE TABLE `t_notify_module` (
  `module_id` INT(11) NOT NULL AUTO_INCREMENT,
  `module_name` VARCHAR(255) NOT NULL,
  `power_key` VARCHAR(255) NOT NULL,
  `type` INT(11) DEFAULT NULL COMMENT '来源类型：存储节点为1,计算节点为2,设备为3',
  `desc` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`module_id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

/*Data for the table `t_notify_module` */

insert  into `t_notify_module`(`module_id`,`module_name`,`power_key`,`type`,`desc`) values (1,'备份','backup_device_notify',3,'当备份出现异常'),(2,'预警','backup_device_notify',3,'当预警出现异常'),(3,'虚拟机管理','backup_device_notify',3,'当虚拟机出现异常'),(4,'挂载','backup_device_notify',3,'当挂载出现异常'),(5,'存储节点管理','recovery_stonode_notify',1,'当存储节点出现异常或离线'),(6,'计算节点管理','emergency_calnode_notify',2,'当计算节点出现异常或离线');

/*Table structure for table `t_power` */

DROP TABLE IF EXISTS `t_power`;

CREATE TABLE `t_power` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `power_name` VARCHAR(50) DEFAULT NULL,
  `power_text` VARCHAR(100) DEFAULT NULL,
  `power_group_id` INT(11) DEFAULT NULL,
  `power_key` VARCHAR(200) DEFAULT NULL,
  `power_sort` INT(11) DEFAULT NULL,
  `power_remark` VARCHAR(200) DEFAULT NULL,
  `power_model` INT(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_RE_POWER_TYPE_AND_POWER` (`power_group_id`),
  CONSTRAINT `FK_RE_POWER_TYPE_AND_POWER` FOREIGN KEY (`power_group_id`) REFERENCES `t_power_type` (`power_group_id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

/*Data for the table `t_power` */

INSERT  INTO `t_power`(`id`,`power_name`,`power_text`,`power_group_id`,`power_key`,`power_sort`,`power_remark`,`power_model`) VALUES (1,'恢复存储-存储节点-存储节点通知','通知',1,'recovery_stonode_notify',NULL,NULL,NULL),(2,'设置-存储节点-设置','设置存储节点',4,'systemconfig_stonode_config',2,NULL,NULL),(3,'设置-存储节点-设置默认存储介质','设置默认存储介质',4,'systemconfig_stonode_setdefaultvms',1,NULL,NULL),(4,'设置-存储节点-删除存储节点','删除存储节点',4,'systemconfig_stonode_delstorage',2,NULL,NULL),(5,'设置-存储节点-删除存储介质','删除存储介质',4,'systemconfig_stonode_delmedium',3,NULL,NULL),(6,'设置-存储节点-新建','新建存储节点',4,'systemconfig_stonode_add',1,NULL,NULL),(7,'恢复存储-存储节点-创建磁盘','创建磁盘',1,'recovery_stonode_addcustomdisk',1,NULL,NULL),(8,'恢复存储-存储节点-激活挂载','激活挂载',1,'recovery_stonode_invokemount',1,NULL,NULL),(9,'恢复存储-存储节点-设置挂载','设置挂载',1,'recovery_stonode_configmount',2,NULL,NULL),(10,'恢复存储-存储节点-删除挂载','删除挂载',1,'recovery_stonode_delmount',3,NULL,NULL),(11,'恢复存储-存储节点-创建挂载','创建挂载',1,'recovery_stonode_addmount',NULL,NULL,NULL),(12,'恢复存储-存储节点-修改挂载','修改挂载',1,'recovery_stonode_modifymount',NULL,NULL,NULL),(13,'恢复存储-存储节点-卸载挂载','卸载挂载',1,'recovery_stonode_uninstallmount',1,NULL,NULL),(14,'设置-账户管理-新建账户','新建账户',4,'systemconfig_account_add',2,NULL,2),(15,'备份监控-设备-设备通知','通知',3,'backup_device_notify',1,NULL,NULL),(16,'设置-账户管理-查找账户','查找账户',4,'systemconfig_account_search',4,NULL,2),(17,'设置-账户管理-修改账户','修改账户',4,'systemconfig_account_update',1,NULL,2),(18,'设置-账户管理-删除账户','删除账户',4,'systemconfig_account_del',2,NULL,2),(19,'备份预警-设备组-创建设备组','创建设备组',3,'backup_device_creategroup',NULL,NULL,NULL),(20,'备份监控-设备-设备启动','启动',3,'backup_device_start',1,NULL,NULL),(21,'备份监控-设备-设备立即同步','立即同步',3,'backup_device_syncnow',2,NULL,NULL),(22,'备份监控-设备-设备立即快照','立即快照',3,'backup_device_snapshotnow',3,NULL,NULL),(23,'备份监控-设备-设备校验数据','校验数据',3,'backup_device_checkdata',4,NULL,NULL),(24,'备份监控-设备-设备设置初始化','还原设置',3,'backup_device_configinit',5,NULL,NULL),(25,'报表日志-性能报表-导出性能报表','导出性能报表',4,'reportlog_report_performexport',1,NULL,4),(26,'报表日志-故障报表-导出故障报表','导出故障报表',4,'reportlog_report_faultexport',2,NULL,4),(27,'报表日志-系统日志-导出系统日志','导出系统日志',4,'reportlog_log_sysexport',1,NULL,4),(28,'报表日志-运维日志-导出运维日志','导出运维日志',4,'reportlog_log_opexport',2,NULL,4),(29,'报表日志-备份日志-导出备份日志','导出备份日志',4,'reportlog_log_backupexport',3,NULL,4),(30,'报表日志-预警日志-导出预警日志','导出预警日志',4,'reportlog_log_warnexport',4,NULL,4),(31,'应急演练-计算节点-计算节点通知','通知',2,'emergency_calnode_notify',NULL,NULL,NULL),(32,'设置-计算节点-删除计算节点','删除计算节点',4,'systemconfig_calnode_delcalnode',2,NULL,NULL),(33,'设置-许可证授权-在线激活','在线激活',4,'systemconfig_license_activeonline',1,NULL,5),(34,'设置-许可证授权-离线激活','离线激活',4,'systemconfig_license_activeoffline',2,NULL,5),(35,'备份监控-设备-设备设置','备份设置',3,'backup_device_config',1,NULL,NULL),(36,'设置-计算节点-设置计算节点','设置计算节点',4,'systemconfig_calnode_config',2,NULL,NULL),(37,'系统设置-角色管理-新建角色','新建角色',4,'systemconfig_role_add',1,NULL,NULL),(38,'设置-角色管理-修改角色','修改角色',4,'systemconfig_role_modify',2,NULL,NULL),(39,'设置-角色管理-删除角色','删除角色',4,'systemconfig_role_delete',3,NULL,NULL),(40,'设置-角色管理-查询角色','查询角色',4,'systemconfig_role_search',4,NULL,NULL),(41,'报表日志-备份报表-导出备份报表','导出备份报表',4,'reportlog_report_backupexport',3,NULL,4),(42,'报表日志-恢复存储日志-导出恢复存储日志','导出恢复存储日志',4,'reportlog_log_recoveryexport',5,NULL,4),(43,'报表日志-应急日志-导出应急日志','导出应急日志',4,'reportlog_report_emergencyexport',6,NULL,4),(44,'设置-系统设置-设置系统安全','设置系统安全',4,'systemconfig_system_configsafety',NULL,NULL,NULL),(45,'设置-系统设置-设置日志管理','设置日志管理',4,'systemconfig_system_configlog',NULL,NULL,NULL),(46,'设置-系统设置-设置数据库备份','设置数据库备份',4,'systemconfig_system_configdbbackup',NULL,NULL,NULL),(47,'设置-系统设置-导入数据库','导入数据库',4,'systemconfig_system_importdb',NULL,NULL,NULL),(48,'设置-系统设置-导出数据库','导出数据库',4,'systemconfig_system_exportdb',NULL,NULL,NULL),(49,'设置-角色管理-分配权限','分配权限',4,'systemconfig_role_grantpower',NULL,NULL,NULL),(51,'设置-输出设置-邮件通知设置','邮件通知设置',4,'systemconfig_output_mailnotifyconfig',NULL,NULL,NULL),(52,'设置-输出设置-短信通知设置','短信通知设置',4,'systemconfig_output_smsnotifyconfig',NULL,NULL,NULL),(53,'恢复存储-存储节点-删除磁盘','删除磁盘',1,'recovery_stonode_deltempdisk',NULL,NULL,NULL),(54,'备份监控-设备-停止','停止',3,'backup_device_stop',NULL,NULL,NULL),(55,'应急演练-计算节点-启动虚拟机','启动虚拟机',2,'emergency_calnode_statrvm',NULL,NULL,NULL),(56,'应急演练-计算节点-停止虚拟机','停止虚拟机',2,'emergency_calnode_stopvm',NULL,NULL,NULL),(57,'应急演练-计算节点-删除虚拟机','删除虚拟机',2,'emergency_calnode_delvm',NULL,NULL,NULL),(58,'应急演练-计算节点-应急设置','应急设置',2,'emergency_calnode_emergencyconfig',NULL,NULL,NULL),(59,'应急演练-计算节点-演练设置','演练设置',2,'emergency_calnode_drillconfig',NULL,NULL,NULL),(60,'备份监控-设备-设置双机','设置双机',3,'backup_device_configdual',NULL,NULL,NULL),(61,'备份监控-设备-附加任务类型','附加任务',3,'backup_device_addtasktype',NULL,NULL,NULL),(62,'备份监控-设备-设备描述','设备描述',3,'backup_device_describe',NULL,NULL,NULL),(63,'备份监控-设备-添加维护日志','添加维护日志',3,'backup_device_addmaintenancelog',NULL,NULL,NULL),(64,'备份监控-设备-删除设备组','删除设备组',3,'backup_device_delgroup',NULL,NULL,NULL),(65,'备份监控-设备-取消双机','取消双机',3,'backup_device_canceldual',NULL,NULL,NULL),(66,'应急演练-计算节点-修改应急类型','修改应急类型',2,'emergency_calnode_modifyemergencytype',NULL,NULL,NULL),(67,'应急演练-计算节点-修改应急主机CPU','修改应急主机CPU',2,'emergency_calnode_modifyvmcpu',NULL,NULL,NULL),(68,'应急演练-计算节点-修改应急主机内存','修改应急主机内存',2,'emergency_calnode_modifyvmmemory',NULL,NULL,NULL),(69,'应急演练-计算节点-修改应急主机网卡驱动','修改应急主机网卡驱动',2,'emergency_calnode_modifyvmnetdriver',NULL,NULL,NULL),(70,'应急演练-计算节点-修改应急主机硬盘类型','修改应急主机硬盘类型',2,'emergency_calnode_modifyvmdisktype',NULL,NULL,NULL),(71,'应急演练-计算节点-修改应急主机显卡类型','修改应急主机显卡类型',2,'emergency_calnode_modifyvmvideotype',NULL,NULL,NULL),(72,'应急演练-计算节点-新增应急主机网卡','新增应急主机网卡',2,'emergency_calnode_addvmnetwork',NULL,NULL,NULL),(73,'应急演练-计算节点-修改应急主机网卡','修改应急主机网卡',2,'emergency_calnode_modifyvmnetwork',NULL,NULL,NULL),(74,'应急演练-计算节点-删除应急主机网卡','删除应急主机网卡',2,'emergency_calnode_delvmnetwork',NULL,NULL,NULL),(75,'应急演练-计算节点-新增应急主机本地磁盘','新增应急主机本地磁盘',2,'emergency_calnode_addvmlocaldisk',NULL,NULL,NULL),(76,'应急演练-计算节点-新增应急主机远程磁盘','新增应急主机远程磁盘',2,'emergency_calnode_addvmremotedisk',NULL,NULL,NULL),(77,'应急演练-计算节点-删除应急主机磁盘','删除应急主机磁盘',2,'emergency_calnode_delvmdisk',NULL,NULL,NULL),(78,'应急演练-计算节点-访问应急主机','访问应急主机',2,'emergency_calnode_visitvm',NULL,NULL,NULL),(79,'备份预警-设备-预警设置','预警设置',3,'backup_device_warningconfig',NULL,NULL,NULL),(80,'备份预警-设备-启动性能监控','启动性能监控',3,'backup_device_startperformmonitor',NULL,NULL,NULL),(81,'备份预警-设备-停止性能监控','停止性能监控',3,'backup_device_stopperformmonitor',NULL,NULL,NULL),(82,'备份预警-设备-启动模拟监控','启动模拟监控',3,'backup_device_startsimulatemonitor',NULL,NULL,NULL),(83,'备份预警-设备-停止模拟监控','停止模拟监控',3,'backup_device_stopsimulatemonitor',NULL,NULL,NULL),(84,'备份监控-设备组-重命名','重命名设备组',3,'backup_device_renamegroup ',NULL,NULL,NULL),(85,'报表日志-报表-查看性能报表','查看性能报表',4,'reportlog_report_viewperform',NULL,NULL,NULL),(86,'报表日志-报表-查看故障报表','查看故障报表',4,'reportlog_report_viewfault',NULL,NULL,NULL),(87,'报表日志-报表-查看备份报表','查看备份报表',4,'reportlog_report_viewbackup',NULL,NULL,NULL),(88,'报表日志-日志-查看系统日志','查看系统日志',4,'reportlog_log_viewsystem',NULL,NULL,NULL),(89,'报表日志-日志-查看运维日志','查看运维日志',4,'reportlog_log_viewoperation',NULL,NULL,NULL),(90,'报表日志-日志-查看备份日志','查看备份日志',4,'reportlog_log_viewbackup',NULL,NULL,NULL),(91,'报表日志-日志-查看恢复存储日志','查看恢复存储日志',4,'reportlog_log_viewrecovery',NULL,NULL,NULL),(92,'报表日志-日志-查看应急日志','查看应急日志',4,'reportlog_log_viewemergency',NULL,NULL,NULL),(93,'报表日志-日志-查看预警日志','查看预警日志',4,'reportlog_log_viewwarning',NULL,NULL,NULL),(94,'应急演练-应急-快速接管','快速接管',2,'emergency_urgent_takeoverfast',NULL,NULL,NULL),(95,'应急演练-演练-快速演练','快速演练',2,'emergency_drill_trainfast',NULL,NULL,NULL),(96,'配置-账户管理-绑定设备','绑定设备',4,'systemconfig_account_bindmachine',NULL,NULL,NULL),(97,'配置-管理平台设置-介质空间预警设置','介质空间预警设置',4,'systemconfig_system_editvmswarning',NULL,NULL,NULL),(98,'报表日志-日志-查看数据库备份日志','查看数据库备份日志',4,'reportlog_log_viewbackupdb',NULL,NULL,NULL),(99,'报表日志-数据库备份日志-导出数据库备份日志','导出数据库备份日志',4,'reportlog_log_backupdbexport',5,NULL,NULL),(100,'应急演练-应急-自动接管','自动接管',2,'emergency_urgent_takeoverauto',NULL,NULL,NULL),(101,'设置-介质同步-新增介质同步','新增介质同步',4,'systemconfig_syncmedium_addsyncmedium',NULL,NULL,NULL),(102,'设置-介质同步-启动介质同步','启动介质同步',4,'systemconfig_syncmedium_startsyncmedium',NULL,NULL,NULL),(103,'设置-介质同步-停止介质同步','停止介质同步',4,'systemconfig_syncmedium_stopsyncmedium',NULL,NULL,NULL),(104,'设置-介质同步-删除介质同步','删除介质同步',4,'systemconfig_syncmedium_delsyncmedium',NULL,NULL,NULL),(105,'备份预警-设备-停止预警','停止预警',3,'backup_device_stopwarning',NULL,NULL,NULL),(106,'备份预警-设备-启动预警','启动预警',3,'backup_device_startwarning',NULL,NULL,NULL),(107,'集群详情-备份策略','集群备份策略',3,'backup_device_cluster_backup_config',NULL,NULL,NULL),(108,'集群配置按钮-集群基础配置','集群基础配置',3,'backup_device_cluster_basic_config',NULL,NULL,NULL),(109,'集群配置按钮-集群备份配置','集群备份配置',3,'backup_device_cluster_backup_config',NULL,NULL,NULL),(110,'集群操作菜单-启动','集群启动',3,'backup_device_cluster_backup_start',NULL,NULL,NULL),(111,'集群操作菜单-停止','集群停止',3,'backup_device_cluster_backup_stop',NULL,NULL,NULL),(112,'集群操作菜单-立即同步','集群立即同步',3,'backup_device_cluster_backup_imediasync',NULL,NULL,NULL),(113,'集群操作菜单-立即快照','集群立即快照',3,'backup_device_cluster_backup_imediasnap',NULL,NULL,NULL),(114,'集群操作菜单-校验数据','集群校验数据',3,'backup_device_cluster_backup_checkdata',NULL,NULL,NULL),(115,'集群操作菜单-备份初始化','集群备份初始化',3,'backup_device_cluster_backup_configinit',NULL,NULL,NULL),(116,'备份配置-设备-申请授权','申请设备授权',3,'backup_device_apply_auth',NULL,NULL,NULL),(117,'备份配置-设备-撤销授权','撤销设备授权',3,'backup_device_repeal_auth',NULL,NULL,NULL),(118,'应急演练-集群应急-集群应急设置','集群应急设置',2,'emergency_cluster_emergencyconfig',NULL,NULL,NULL),(119,'应急演练-集群演练-集群演练设置','集群演练设置',2,'emergency_cluster_drillconfig',NULL,NULL,NULL),(120,'恢复存储-挂载配置-集群挂载配置','集群挂载配置',1,'recovery_cluster_configmount',NULL,NULL,NULL),(121,'报表日志-报表-查看备份报表','查看集群日志',4,'reportlog_log_viewcluster',NULL,NULL,NULL);



/*Table structure for table `t_power_type` */

DROP TABLE IF EXISTS `t_power_type`;

CREATE TABLE `t_power_type` (
  `power_group_id` INT(11) NOT NULL AUTO_INCREMENT,
  `power_group_name` VARCHAR(100) DEFAULT NULL,
  `power_group_remark` VARCHAR(225) DEFAULT NULL,
  `power_create_time` DATETIME DEFAULT NULL,
  `power_updata_time` DATETIME DEFAULT NULL,
  PRIMARY KEY (`power_group_id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

/*Data for the table `t_power_type` */

insert  into `t_power_type`(`power_group_id`,`power_group_name`,`power_group_remark`,`power_create_time`,`power_updata_time`) values (1,'恢复存储权限',NULL,NULL,NULL),(2,'应急演练权限',NULL,NULL,NULL),(3,'备份预警权限',NULL,NULL,NULL),(4,'系统权限',NULL,NULL,NULL);

/*Table structure for table `t_role` */

DROP TABLE IF EXISTS `t_role`;

CREATE TABLE `t_role` (
  `role_id` INT(11) NOT NULL AUTO_INCREMENT,
  `role_name` VARCHAR(255) DEFAULT NULL,
  `power_str` TEXT,
  `create_time` DATETIME DEFAULT NULL,
  `update_time` DATETIME DEFAULT NULL,
  `remark` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

/*Data for the table `t_role` */

INSERT  INTO `t_role`(`role_id`,`role_name`,`power_str`,`create_time`,`update_time`,`remark`) VALUES (1,'admin','{\"Power\":[{\"Stonode\":[{\"PowerStoId\":1},{\"PowerStoId\":7},{\"PowerStoId\":8},{\"PowerStoId\":9},{\"PowerStoId\":10},{\"PowerStoId\":11},{\"PowerStoId\":12},{\"PowerStoId\":13},{\"PowerStoId\":53}]},{\"Calnode\":[{\"PowerCalId\":31},{\"PowerCalId\":55},{\"PowerCalId\":56},{\"PowerCalId\":57},{\"PowerCalId\":58},{\"PowerCalId\":59},{\"PowerCalId\":66},{\"PowerCalId\":67},{\"PowerCalId\":68},{\"PowerCalId\":69},{\"PowerCalId\":70},{\"PowerCalId\":71},{\"PowerCalId\":72},{\"PowerCalId\":73},{\"PowerCalId\":74},{\"PowerCalId\":75},{\"PowerCalId\":76},{\"PowerCalId\":77},{\"PowerCalId\":78},{\"PowerCalId\":94},{\"PowerCalId\":95},{\"PowerCalId\":100}]},{\"Device\":[{\"PowerDevId\":15},{\"PowerDevId\":19},{\"PowerDevId\":20},{\"PowerDevId\":21},{\"PowerDevId\":22},{\"PowerDevId\":23},{\"PowerDevId\":24},{\"PowerDevId\":35},{\"PowerDevId\":54},{\"PowerDevId\":60},{\"PowerDevId\":61},{\"PowerDevId\":62},{\"PowerDevId\":63},{\"PowerDevId\":64},{\"PowerDevId\":65},{\"PowerDevId\":79},{\"PowerDevId\":80},{\"PowerDevId\":81},{\"PowerDevId\":82},{\"PowerDevId\":83},{\"PowerDevId\":84},{\"PowerDevId\":105},{\"PowerDevId\":106}]},{\"System\":[{\"PowerSysId\":25},{\"PowerSysId\":26},{\"PowerSysId\":27},{\"PowerSysId\":28},{\"PowerSysId\":29},{\"PowerSysId\":30},{\"PowerSysId\":41},{\"PowerSysId\":42},{\"PowerSysId\":43},{\"PowerSysId\":85},{\"PowerSysId\":86},{\"PowerSysId\":87},{\"PowerSysId\":88},{\"PowerSysId\":89},{\"PowerSysId\":90},{\"PowerSysId\":91},{\"PowerSysId\":92},{\"PowerSysId\":93},{\"PowerSysId\":98},{\"PowerSysId\":99},{\"PowerSysId\":2},{\"PowerSysId\":3},{\"PowerSysId\":4},{\"PowerSysId\":5},{\"PowerSysId\":6},{\"PowerSysId\":14},{\"PowerSysId\":16},{\"PowerSysId\":17},{\"PowerSysId\":18},{\"PowerSysId\":32},{\"PowerSysId\":33},{\"PowerSysId\":34},{\"PowerSysId\":36},{\"PowerSysId\":37},{\"PowerSysId\":38},{\"PowerSysId\":39},{\"PowerSysId\":40},{\"PowerSysId\":44},{\"PowerSysId\":45},{\"PowerSysId\":46},{\"PowerSysId\":47},{\"PowerSysId\":48},{\"PowerSysId\":49},{\"PowerSysId\":51},{\"PowerSysId\":52},{\"PowerSysId\":96},{\"PowerSysId\":97},{\"PowerSysId\":101},{\"PowerSysId\":102},{\"PowerSysId\":103},{\"PowerSysId\":104},{\"PowerSysId\":105},{\"PowerSysId\":106},{\"PowerSysId\":107},{\"PowerSysId\":108},{\"PowerSysId\":109},{\"PowerSysId\":110},{\"PowerSysId\":111},{\"PowerSysId\":112},{\"PowerSysId\":113},{\"PowerSysId\":114},{\"PowerSysId\":115},{\"PowerSysId\":116},{\"PowerSysId\":117},{\"PowerSysId\":118},{\"PowerSysId\":119},{\"PowerSysId\":120},{\"PowerSysId\":121}]}]}',NULL,NULL,'系统管理员'),(2,'auditor','{\"Power\": [{\"Stonode\": []},{\"Calnode\": []},{\"Device\": []},{\"System\": []},{\"Other\": []}]}',NULL,NULL,'审计管理员'),(3,'security','{\"Power\": [{\"Stonode\": []},{\"Calnode\": []},{\"Device\": []},{\"System\": []},{\"Other\": []}]}',NULL,NULL,'安全管理员'),(4,'初始角色','{\"Power\":[{\"Stonode\":[{\"PowerStoId\":1},{\"PowerStoId\":7},{\"PowerStoId\":8},{\"PowerStoId\":9},{\"PowerStoId\":10},{\"PowerStoId\":11},{\"PowerStoId\":12},{\"PowerStoId\":13},{\"PowerStoId\":53},{\"PowerStoId\":120}]},{\"Calnode\":[{\"PowerCalId\":31},{\"PowerCalId\":55},{\"PowerCalId\":56},{\"PowerCalId\":57},{\"PowerCalId\":58},{\"PowerCalId\":59},{\"PowerCalId\":66},{\"PowerCalId\":67},{\"PowerCalId\":68},{\"PowerCalId\":69},{\"PowerCalId\":70},{\"PowerCalId\":71},{\"PowerCalId\":72},{\"PowerCalId\":73},{\"PowerCalId\":74},{\"PowerCalId\":75},{\"PowerCalId\":76},{\"PowerCalId\":77},{\"PowerCalId\":78},{\"PowerCalId\":94},{\"PowerCalId\":95},{\"PowerCalId\":100},{\"PowerCalId\":118},{\"PowerCalId\":119}]},{\"Device\":[{\"PowerDevId\":15},{\"PowerDevId\":19},{\"PowerDevId\":20},{\"PowerDevId\":21},{\"PowerDevId\":22},{\"PowerDevId\":23},{\"PowerDevId\":24},{\"PowerDevId\":35},{\"PowerDevId\":54},{\"PowerDevId\":60},{\"PowerDevId\":61},{\"PowerDevId\":62},{\"PowerDevId\":63},{\"PowerDevId\":64},{\"PowerDevId\":65},{\"PowerDevId\":79},{\"PowerDevId\":80},{\"PowerDevId\":81},{\"PowerDevId\":82},{\"PowerDevId\":83},{\"PowerDevId\":84},{\"PowerDevId\":105},{\"PowerDevId\":106},{\"PowerDevId\":108},{\"PowerDevId\":109},{\"PowerDevId\":110},{\"PowerDevId\":111},{\"PowerDevId\":112},{\"PowerDevId\":113},{\"PowerDevId\":114},{\"PowerDevId\":115},{\"PowerDevId\":116},{\"PowerDevId\":117}]},{\"System\":[{\"PowerSysId\":25},{\"PowerSysId\":26},{\"PowerSysId\":27},{\"PowerSysId\":28},{\"PowerSysId\":29},{\"PowerSysId\":30},{\"PowerSysId\":41},{\"PowerSysId\":42},{\"PowerSysId\":43},{\"PowerSysId\":85},{\"PowerSysId\":86},{\"PowerSysId\":87},{\"PowerSysId\":88},{\"PowerSysId\":89},{\"PowerSysId\":90},{\"PowerSysId\":91},{\"PowerSysId\":92},{\"PowerSysId\":93},{\"PowerSysId\":98},{\"PowerSysId\":99},{\"PowerSysId\":121},{\"PowerSysId\":2},{\"PowerSysId\":3},{\"PowerSysId\":4},{\"PowerSysId\":5},{\"PowerSysId\":6},{\"PowerSysId\":14},{\"PowerSysId\":16},{\"PowerSysId\":17},{\"PowerSysId\":18},{\"PowerSysId\":32},{\"PowerSysId\":33},{\"PowerSysId\":34},{\"PowerSysId\":36},{\"PowerSysId\":37},{\"PowerSysId\":38},{\"PowerSysId\":39},{\"PowerSysId\":40},{\"PowerSysId\":44},{\"PowerSysId\":45},{\"PowerSysId\":46},{\"PowerSysId\":47},{\"PowerSysId\":48},{\"PowerSysId\":49},{\"PowerSysId\":51},{\"PowerSysId\":52},{\"PowerSysId\":96},{\"PowerSysId\":97},{\"PowerSysId\":101},{\"PowerSysId\":102},{\"PowerSysId\":103},{\"PowerSysId\":104}]}]}',NULL,'2017-04-07 17:30:57','权限为空的初始化角色'),(5,'设备管理员','{\"Power\":[{\"Stonode\":[]},{\"Calnode\":[]},{\"Device\":[{\"PowerDevId\":15},{\"PowerDevId\":19},{\"PowerDevId\":20},{\"PowerDevId\":21},{\"PowerDevId\":22},{\"PowerDevId\":23},{\"PowerDevId\":24},{\"PowerDevId\":35},{\"PowerDevId\":54},{\"PowerDevId\":60},{\"PowerDevId\":61},{\"PowerDevId\":62},{\"PowerDevId\":63},{\"PowerDevId\":64},{\"PowerDevId\":65},{\"PowerDevId\":79},{\"PowerDevId\":80},{\"PowerDevId\":81},{\"PowerDevId\":82},{\"PowerDevId\":83},{\"PowerDevId\":84},{\"PowerDevId\":105},{\"PowerDevId\":106},{\"PowerDevId\":108},{\"PowerDevId\":109},{\"PowerDevId\":110},{\"PowerDevId\":111},{\"PowerDevId\":112},{\"PowerDevId\":113},{\"PowerDevId\":114},{\"PowerDevId\":115},{\"PowerDevId\":116},{\"PowerDevId\":117}]},{\"System\":[{\"PowerSysId\":29},{\"PowerSysId\":30},{\"PowerSysId\":41},{\"PowerSysId\":87},{\"PowerSysId\":90},{\"PowerSysId\":93}]}]}',NULL,'2017-04-07 17:32:20','设备相关操作权限的管理员'),(6,'存储管理员','{\"Power\":[{\"Stonode\":[{\"PowerStoId\":1},{\"PowerStoId\":7},{\"PowerStoId\":8},{\"PowerStoId\":9},{\"PowerStoId\":10},{\"PowerStoId\":11},{\"PowerStoId\":12},{\"PowerStoId\":13},{\"PowerStoId\":53},{\"PowerStoId\":120}]},{\"Calnode\":[]},{\"Device\":[]},{\"System\":[{\"PowerSysId\":42},{\"PowerSysId\":91},{\"PowerSysId\":2},{\"PowerSysId\":3},{\"PowerSysId\":4},{\"PowerSysId\":5},{\"PowerSysId\":6},{\"PowerSysId\":97},{\"PowerSysId\":101},{\"PowerSysId\":102},{\"PowerSysId\":103},{\"PowerSysId\":104}]}]}',NULL,'2017-04-07 17:33:10','存储相关操作权限的管理员'),(7,'应急管理员','{\"Power\":[{\"Stonode\":[]},{\"Calnode\":[{\"PowerCalId\":31},{\"PowerCalId\":55},{\"PowerCalId\":56},{\"PowerCalId\":57},{\"PowerCalId\":58},{\"PowerCalId\":59},{\"PowerCalId\":66},{\"PowerCalId\":67},{\"PowerCalId\":68},{\"PowerCalId\":69},{\"PowerCalId\":70},{\"PowerCalId\":71},{\"PowerCalId\":72},{\"PowerCalId\":73},{\"PowerCalId\":74},{\"PowerCalId\":75},{\"PowerCalId\":76},{\"PowerCalId\":77},{\"PowerCalId\":78},{\"PowerCalId\":94},{\"PowerCalId\":95},{\"PowerCalId\":100},{\"PowerCalId\":118},{\"PowerCalId\":119}]},{\"Device\":[]},{\"System\":[{\"PowerSysId\":43},{\"PowerSysId\":92},{\"PowerSysId\":32},{\"PowerSysId\":36}]}]}',NULL,'2017-04-07 17:33:16','应急相关操作权限的管理员'),(8,'运维管理员','{\"Power\":[{\"Stonode\":[{\"PowerStoId\":1},{\"PowerStoId\":7},{\"PowerStoId\":8},{\"PowerStoId\":9},{\"PowerStoId\":10},{\"PowerStoId\":11},{\"PowerStoId\":12},{\"PowerStoId\":13},{\"PowerStoId\":53},{\"PowerStoId\":120}]},{\"Calnode\":[{\"PowerCalId\":31},{\"PowerCalId\":55},{\"PowerCalId\":56},{\"PowerCalId\":57},{\"PowerCalId\":58},{\"PowerCalId\":59},{\"PowerCalId\":66},{\"PowerCalId\":67},{\"PowerCalId\":68},{\"PowerCalId\":69},{\"PowerCalId\":70},{\"PowerCalId\":71},{\"PowerCalId\":72},{\"PowerCalId\":73},{\"PowerCalId\":74},{\"PowerCalId\":75},{\"PowerCalId\":76},{\"PowerCalId\":77},{\"PowerCalId\":78},{\"PowerCalId\":94},{\"PowerCalId\":95},{\"PowerCalId\":100},{\"PowerCalId\":118},{\"PowerCalId\":119}]},{\"Device\":[{\"PowerDevId\":15},{\"PowerDevId\":19},{\"PowerDevId\":20},{\"PowerDevId\":21},{\"PowerDevId\":22},{\"PowerDevId\":23},{\"PowerDevId\":24},{\"PowerDevId\":35},{\"PowerDevId\":54},{\"PowerDevId\":60},{\"PowerDevId\":61},{\"PowerDevId\":62},{\"PowerDevId\":63},{\"PowerDevId\":64},{\"PowerDevId\":65},{\"PowerDevId\":79},{\"PowerDevId\":80},{\"PowerDevId\":81},{\"PowerDevId\":82},{\"PowerDevId\":83},{\"PowerDevId\":84},{\"PowerDevId\":105},{\"PowerDevId\":106},{\"PowerDevId\":108},{\"PowerDevId\":109},{\"PowerDevId\":110},{\"PowerDevId\":111},{\"PowerDevId\":112},{\"PowerDevId\":113},{\"PowerDevId\":114},{\"PowerDevId\":115},{\"PowerDevId\":116},{\"PowerDevId\":117}]},{\"System\":[{\"PowerSysId\":25},{\"PowerSysId\":26},{\"PowerSysId\":27},{\"PowerSysId\":28},{\"PowerSysId\":29},{\"PowerSysId\":30},{\"PowerSysId\":41},{\"PowerSysId\":42},{\"PowerSysId\":43},{\"PowerSysId\":85},{\"PowerSysId\":86},{\"PowerSysId\":87},{\"PowerSysId\":88},{\"PowerSysId\":89},{\"PowerSysId\":90},{\"PowerSysId\":91},{\"PowerSysId\":92},{\"PowerSysId\":93},{\"PowerSysId\":98},{\"PowerSysId\":99},{\"PowerSysId\":121},{\"PowerSysId\":2},{\"PowerSysId\":3},{\"PowerSysId\":4},{\"PowerSysId\":5},{\"PowerSysId\":6},{\"PowerSysId\":14},{\"PowerSysId\":16},{\"PowerSysId\":17},{\"PowerSysId\":18},{\"PowerSysId\":32},{\"PowerSysId\":33},{\"PowerSysId\":34},{\"PowerSysId\":36},{\"PowerSysId\":37},{\"PowerSysId\":38},{\"PowerSysId\":39},{\"PowerSysId\":40},{\"PowerSysId\":44},{\"PowerSysId\":45},{\"PowerSysId\":46},{\"PowerSysId\":47},{\"PowerSysId\":48},{\"PowerSysId\":49},{\"PowerSysId\":51},{\"PowerSysId\":52},{\"PowerSysId\":96},{\"PowerSysId\":97},{\"PowerSysId\":101},{\"PowerSysId\":102},{\"PowerSysId\":103},{\"PowerSysId\":104}]}]}',NULL,'2017-04-07 17:31:27','设备、存储节点、计算节点和系统配置等相关操作权限的管理员');



DROP TABLE IF EXISTS `t_lcs`;

CREATE TABLE `t_lcs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lcs_flag` varchar(300) NOT NULL,
  `lcs_emergency` varchar(300) DEFAULT NULL,
  `lcs_emulation` varchar(300) DEFAULT NULL,
  `lcs_backup` varchar(300) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `desc` varchar(300) DEFAULT NULL,
  `remark` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `t_menu`;

CREATE TABLE `t_menu` (
  `menu_id` int(11) NOT NULL AUTO_INCREMENT,
  `page_id` varchar(150) DEFAULT NULL,
  `menu_name` varchar(150) DEFAULT NULL,
  `class_style` varchar(100) DEFAULT NULL,
  `menu_icon` varchar(200) DEFAULT NULL,
  `menu_url` varchar(300) DEFAULT NULL,
  `parent_id` int(11) DEFAULT '-1',
  `sort` int(11) DEFAULT '1',
  `is_show` int(11) DEFAULT '0',
  `menu_type` int(11) DEFAULT NULL,
  `menu_level` int(11) DEFAULT '1',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `desc` varchar(300) DEFAULT NULL,
  `remark` varchar(300) DEFAULT NULL,
  `remark1` varchar(300) DEFAULT NULL,
  `remark2` varchar(300) DEFAULT NULL,
  `remark3` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`menu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

/*Data for the table `t_menu` */

INSERT  INTO `t_menu`(`menu_id`,`page_id`,`menu_name`,`class_style`,`menu_icon`,`menu_url`,`parent_id`,`sort`,`is_show`,`menu_type`,`menu_level`,`create_time`,`update_time`,`desc`,`remark`,`remark1`,`remark2`,`remark3`) VALUES (1,'tree_savenode',' 存储节点',NULL,'/images/config/tree_savenode.png',NULL,-1,1,1,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'tree_calnode',' 计算节点',NULL,'/images/config/tree_calnode.png',NULL,-1,2,1,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'tree_account',' 账户管理',NULL,'/images/config/tree_account.png',NULL,-1,4,1,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,'tree_role',' 角色管理',NULL,'/images/config/tree_role.png',NULL,-1,5,1,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,'tree_output',' 通知设置',NULL,'/images/config/tree_output.png',NULL,-1,6,1,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,'tree_systerm',' 管理平台设置',NULL,'/images/config/tree_config.png',NULL,-1,7,1,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,'tree_license',' 许可证授权',NULL,'/images/config/tree_license.png',NULL,-1,8,1,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,'sel_bac','备份·预警','ta',NULL,'/page/backup/index.jsp',-1,1,1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,'sel_mon','应急·演练','ta',NULL,'/page/emergency/index.jsp',-1,2,1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,'sel_sto','恢复·存储','ta',NULL,'/page/recovery/index.jsp',-1,3,1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,'sel_log','报表·日志','ta',NULL,'/page/log/index.jsp',-1,4,1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,'sel_sys','设置','ta',NULL,'/page/config/index.jsp',-1,5,1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,'systemLogReportId','统计报表','no-icon',NULL,NULL,-1,1,1,3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,'reportlog_report_viewperform','性能报表',NULL,'/images/log/report_system.png',NULL,13,1,1,3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,'reportlog_report_viewfault','故障报表',NULL,'/images/log/report_fault.png',NULL,13,2,1,3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,'reportlog_report_viewbackup','备份报表',NULL,'/images/log/report_all.png',NULL,13,3,1,3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,'sysLogId','日志','no-icon',NULL,NULL,-1,2,1,3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,'functionLogId','功能日志',NULL,'/images/log/log_system.png',NULL,17,1,1,3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,'reportlog_log_viewsystem','系统日志',NULL,'/images/log/log_system.png',NULL,17,2,1,3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,'reportlog_log_viewoperation','运维日志',NULL,'/images/log/log_client.png',NULL,17,3,1,3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,'reportlog_log_viewbackup','备份日志',NULL,'/images/log/log_emergency.png',NULL,18,1,1,3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(22,'reportlog_log_viewwarning','预警日志',NULL,'/images/log/log_warn.png',NULL,18,2,1,3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(23,'reportlog_log_viewemergency','应急日志',NULL,'/images/log/log_emergency.png',NULL,18,3,1,3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24,'reportlog_log_viewrecovery','恢复存储日志',NULL,'/images/log/log_emergency.png',NULL,18,4,1,3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(25,'reportlog_log_viewbackupdb','数据库备份日志',NULL,'/images/log/log_emergency.png',NULL,18,3,1,3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(26,'tree_synch',' 介质同步',NULL,'/images/config/tree_media.png',NULL,-1,3,1,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(27,'tree_about',' 关于',NULL,'/images/config/icon_about.png',NULL,-1,9,1,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(28,'reportlog_log_viewcluster','集群日志',NULL,'/images/log/log_emergency.png',NULL,18,5,1,3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL);


/*Table structure for table `t_server_config` */

DROP TABLE IF EXISTS `t_server_config`;

CREATE TABLE `t_server_config` (
  `server_config_id` int(11) NOT NULL AUTO_INCREMENT,
  `server_config_init_flag` int(11) DEFAULT NULL,
  `server_config_is_start_login_erro_limit` int(50) DEFAULT NULL,
  `server_config_erro_login_count` int(11) DEFAULT NULL,
  `server_config_erro_date_time` int(11) DEFAULT NULL,
  `server_config_is_start_ip_limit` int(11) DEFAULT NULL,
  `server_config_limit_ip` varchar(255) DEFAULT NULL,
  `server_config_pwd_is_expired` int(11) DEFAULT NULL COMMENT '1：永远不过 2：永远不过 ',
  `server_config_pwd_is_expired_date_time` int(11) DEFAULT NULL,
  `server_config_is_pwd_check` int(11) DEFAULT NULL,
  `server_config_pwd_strength` int(50) DEFAULT NULL COMMENT '0：不使用长度验证 大于6才算是启动',
  `server_config_pwd_check_type` int(11) DEFAULT NULL,
  `server_config_lock_backupset_dir` int(50) DEFAULT NULL COMMENT '1:不锁定 2：锁定',
  `server_config_is_start_email_report` int(11) DEFAULT NULL COMMENT '1:启动 2：停止',
  `server_config_mail_id` int(11) DEFAULT NULL,
  `server_config_is_start_sms_report` int(11) DEFAULT NULL COMMENT '1:启动 2：停止',
  `server_config_sms_id` int(11) DEFAULT NULL,
  `server_config_system_version` varchar(128) DEFAULT NULL,
  `server_config_vnc_proxy` int(11) DEFAULT NULL,
  `server_config_create_time` datetime DEFAULT NULL COMMENT '安装时间',
  `server_config_update_time` datetime DEFAULT NULL,
  `server_config_server_lan_ip` varchar(255) DEFAULT NULL,
  `server_config_server_net_ip` varchar(255) DEFAULT NULL,
  `server_config_web_port` int(11) DEFAULT NULL,
  `server_config_msg_port` int(11) DEFAULT NULL,
  `server_config_report_content` varchar(11) DEFAULT NULL,
  `server_config_report_plan_type` int(11) DEFAULT NULL,
  `server_config_report_day` int(11) DEFAULT NULL,
  `server_config_report_time` time DEFAULT NULL,
  `server_config_email_warning` int(11) DEFAULT NULL,
  `server_config_warning_storage` int(11) DEFAULT NULL,
  `server_config_warning_diskclone_server` int(11) DEFAULT NULL,
  `server_config_is_start_auto_clean_log` int(11) DEFAULT NULL,
  `server_config_auto_clean_system_log` int(11) DEFAULT NULL,
  `server_config_auto_clean_function_log` int(11) DEFAULT NULL,
  `server_config_auto_clean_operation_log` int(11) DEFAULT NULL,
  `server_config_last_export_time` datetime DEFAULT NULL,
  `server_config_file_port` int(11) DEFAULT '4306',
  `server_config_broadcast_port` int(11) DEFAULT '4307',
  `server_config_is_start_db_backup` int(11) DEFAULT NULL,
  `server_config_db_backup_path` varchar(255) DEFAULT NULL,
  `server_config_manager_mode` int(11) DEFAULT NULL,
  `server_config_remark` varchar(255) DEFAULT NULL,
  `server_config_reserver1` varchar(255) DEFAULT NULL,
  `server_config_reserver2` varchar(255) DEFAULT NULL,
  `server_config_reserver3` varchar(255) DEFAULT NULL,
  `server_config_reserver4` varchar(255) DEFAULT NULL,
  `server_config_reserver5` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`server_config_id`),
  KEY `FK_RE_CONFIG_AND_SMS` (`server_config_sms_id`),
  KEY `FK_RE_SERVER_AND_MAIL` (`server_config_mail_id`),
  CONSTRAINT `FK_RE_CONFIG_AND_SMS` FOREIGN KEY (`server_config_sms_id`) REFERENCES `t_sms_config` (`sms_config_id`),
  CONSTRAINT `FK_RE_SERVER_AND_MAIL` FOREIGN KEY (`server_config_mail_id`) REFERENCES `t_mail_config` (`mail_config_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='系统配置表';

/*Data for the table `t_server_config` */

insert  into `t_server_config`(`server_config_id`,`server_config_init_flag`,`server_config_is_start_login_erro_limit`,`server_config_erro_login_count`,`server_config_erro_date_time`,`server_config_is_start_ip_limit`,`server_config_limit_ip`,`server_config_pwd_is_expired`,`server_config_pwd_is_expired_date_time`,`server_config_is_pwd_check`,`server_config_pwd_strength`,`server_config_pwd_check_type`,`server_config_lock_backupset_dir`,`server_config_is_start_email_report`,`server_config_mail_id`,`server_config_is_start_sms_report`,`server_config_sms_id`,`server_config_system_version`,`server_config_vnc_proxy`,`server_config_create_time`,`server_config_update_time`,`server_config_server_lan_ip`,`server_config_server_net_ip`,`server_config_web_port`,`server_config_msg_port`,`server_config_report_content`,`server_config_report_plan_type`,`server_config_report_day`,`server_config_report_time`,`server_config_email_warning`,`server_config_warning_storage`,`server_config_warning_diskclone_server`,`server_config_is_start_auto_clean_log`,`server_config_auto_clean_system_log`,`server_config_auto_clean_function_log`,`server_config_auto_clean_operation_log`,`server_config_last_export_time`,`server_config_file_port`,`server_config_broadcast_port`,`server_config_is_start_db_backup`,`server_config_db_backup_path`,`server_config_manager_mode`,`server_config_remark`,`server_config_reserver1`,`server_config_reserver2`,`server_config_reserver3`,`server_config_reserver4`,`server_config_reserver5`) values (1,0,0,0,0,0,'',0,0,0,0,0,NULL,0,1,0,1,'6.0',NULL,now(),NULL,NULL,NULL,9980,4305,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0,0,0,NULL,4306,4307,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL);

/*Table structure for table `t_sms_config` */

DROP TABLE IF EXISTS `t_sms_config`;

CREATE TABLE `t_sms_config` (
  `sms_config_id` INT(11) NOT NULL AUTO_INCREMENT,
  `sms_config_phone` VARCHAR(255) DEFAULT NULL,
  `sms_config_com` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`sms_config_id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

/*Data for the table `t_sms_config` */

INSERT  INTO `t_sms_config`(`sms_config_id`,`sms_config_phone`,`sms_config_com`) VALUES (1,NULL,NULL);

/*Table structure for table `t_user` */

DROP TABLE IF EXISTS `t_user`;

CREATE TABLE `t_user` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_del_mark` INT(11) DEFAULT NULL,
  `user_name` VARCHAR(50) DEFAULT NULL,
  `user_pwd` VARCHAR(50) DEFAULT NULL,
  `user_state` INT(11) DEFAULT NULL,
  `user_login_type` INT(11) DEFAULT NULL,
  `user_reg_date_time` DATETIME DEFAULT NULL,
  `user_update_date_time` DATETIME DEFAULT NULL,
  `user_login_ip` VARCHAR(50) DEFAULT NULL,
  `user_login_date_time` DATETIME DEFAULT NULL,
  `user_lock_date_time` DATETIME DEFAULT NULL,
  `user_login_error_count` INT(11) DEFAULT NULL,
  `user_email` VARCHAR(255) DEFAULT NULL,
  `user_phone` VARCHAR(255) DEFAULT NULL,
  `user_remark` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

/*Data for the table `t_user` */

INSERT  INTO `t_user`(`user_id`,`user_del_mark`,`user_name`,`user_pwd`,`user_state`,`user_login_type`,`user_reg_date_time`,`user_update_date_time`,`user_login_ip`,`user_login_date_time`,`user_lock_date_time`,`user_login_error_count`,`user_email`,`user_phone`,`user_remark`) VALUES (1,0,'admin','A0643B817E080202D46F3A0EE4DF1553',1,0,NULL,NULL,'0:0:0:0:0:0:0:1','2016-07-27 15:06:18',NULL,0,'','',NULL),(2,0,'auditor','A0643B817E080202D46F3A0EE4DF1553',1,0,NULL,NULL,NULL,NULL,NULL,0,'','',NULL),(3,0,'security','A0643B817E080202D46F3A0EE4DF1553',1,0,NULL,NULL,NULL,NULL,NULL,0,'','',NULL);

/*Table structure for table `t_user_and_group` */

DROP TABLE IF EXISTS `t_user_and_group`;

CREATE TABLE `t_user_and_group` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `device_id` INT(11) DEFAULT NULL,
  `user_id` INT(11) NOT NULL,
  `type` INT(11) DEFAULT NULL,
  `power_group_ids` VARCHAR(255) DEFAULT NULL,
  `power_cal_ids` VARCHAR(255) DEFAULT NULL,
  `power_sto_ids` VARCHAR(255) DEFAULT NULL,
  `remark` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`,`user_id`),
  KEY `FK_user_userdevice` (`user_id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

/*Data for the table `t_user_and_group` */

INSERT  INTO `t_user_and_group`(`id`,`device_id`,`user_id`,`type`,`power_group_ids`,`power_cal_ids`,`power_sto_ids`,`remark`) VALUES (1,NULL,1,7,'[]','[]','[]',NULL),(2,NULL,2,7,'[]','[]','[]',NULL),(3,NULL,3,7,'[]','[]','[]',NULL);

/*Table structure for table `t_user_role` */

DROP TABLE IF EXISTS `t_user_role`;

CREATE TABLE `t_user_role` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `role_id` INT(11) NOT NULL,
  `type` INT(11) DEFAULT NULL,
  `remark` VARCHAR(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`,`user_id`,`role_id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `t_user_role` */

INSERT  INTO `t_user_role`(`id`,`user_id`,`role_id`,`type`,`remark`) VALUES (1,1,1,NULL,NULL),(2,2,2,NULL,NULL),(3,3,3,NULL,NULL);
SET FOREIGN_KEY_CHECKS=1;
