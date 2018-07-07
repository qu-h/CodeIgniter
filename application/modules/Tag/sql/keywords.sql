
CREATE TABLE `keywords` (
  `id` int(11) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `group_id` int(11) DEFAULT '0',
  `word` varchar(250) CHARACTER SET utf8 NOT NULL,
  `alias` varchar(255) NOT NULL,
  `rate` tinyint(2) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` int(11) DEFAULT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `keywords` ADD PRIMARY KEY (`id`);

ALTER TABLE `keywords` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;