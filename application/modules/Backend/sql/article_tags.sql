
CREATE TABLE `article_tags` (
  `id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `keyword_id` int(11) NOT NULL DEFAULT '0',
  `created_by` int(11) DEFAULT '0',
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


ALTER TABLE `article_tags` ADD PRIMARY KEY (`id`);
ALTER TABLE `article_tags` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;