Leaderboard
CREATE TABLE `mockbest_examination`.`leaderboard` (
  `name` VARCHAR(200) NOT NULL,
  `profile_picture` VARCHAR(200) NULL,
  `score` INT NULL,
  `subject` VARCHAR(45) NULL,
  `location` VARCHAR(45) NULL,
  PRIMARY KEY (`name`));

Exams
CREATE TABLE `mockbest_examination`.`exams` (
  `examid` VARCHAR(200) NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `description` VARCHAR(2000) NULL,
  `cover_image` VARCHAR(200) NULL,
  `tags` JSON NULL,
  `time` INT NOT NULL,
  `questions` JSON NOT NULL,
  `answers` JSON NOT NULL,
  `package_required` INT NOT NULL DEFAULT 0,
  `payment_data` JSON NULL,
  `proctored` TINYINT NOT NULL DEFAULT 0,
  `test_type` INT NOT NULL DEFAULT 0,
  `recommended_package` VARCHAR(45) NULL,
  `recommended_page` JSON NULL,
  PRIMARY KEY (`examid`));
  ALTER TABLE `mockbest_examination`.`exams` 
ALTER TABLE `mockbest_examination`.`exams` 
CHANGE COLUMN `test_type` `test_type` INT NOT NULL DEFAULT '0' AFTER `package_required`,
CHANGE COLUMN `proctored` `proctored` INT NOT NULL DEFAULT '0' AFTER `test_type`,
CHANGE COLUMN `description` `description` TEXT NULL DEFAULT NULL ,
CHANGE COLUMN `tags` `tags` TEXT NULL DEFAULT NULL ,
CHANGE COLUMN `questions` `questions` LONGTEXT NOT NULL ,
CHANGE COLUMN `answers` `answers` LONGTEXT NOT NULL ,
CHANGE COLUMN `payment_data` `payment_data` MEDIUMTEXT NULL DEFAULT NULL ,
CHANGE COLUMN `recommended_page` `recommended_page_url` VARCHAR(50) NULL DEFAULT NULL ;
ALTER TABLE `mockbest_examination`.`exams` 
ADD COLUMN `topic` VARCHAR(45) NOT NULL AFTER `recommended_page_url`;
