
CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `ordering` int(3) NOT NULL DEFAULT '0',
  `type` char(50) COLLATE utf8_bin DEFAULT 'category',
  `parent` int(11) DEFAULT '0',
  `name` varchar(255) COLLATE utf8_bin NOT NULL,
  `alias` varchar(255) COLLATE utf8_bin NOT NULL,
  `summary` text COLLATE utf8_bin NOT NULL,
  `description` text COLLATE utf8_bin NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `version` int(11) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

ALTER TABLE `category` ADD PRIMARY KEY (`id`), ADD KEY `id` (`id`);
ALTER TABLE `category` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


CREATE TABLE `category_map` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `target_table` varchar(100) NOT NULL,
  `target_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `category_map` ADD PRIMARY KEY (`id`);
ALTER TABLE `category_map` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


COMMIT;