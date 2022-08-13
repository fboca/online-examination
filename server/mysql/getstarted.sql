USE
    mockbest_examination;
CREATE TABLE `examination_platform`.`users`(
    `userid` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(320) NOT NULL,
    `password` VARCHAR(1000) NOT NULL,
    `displayname` VARCHAR(500) NOT NULL,
    `profile_picture` VARCHAR(500) NULL,
    `bio` VARCHAR(500) NULL,
    `location` VARCHAR(500) NULL,
    `package` INT NULL DEFAULT 1,
    `created` DATETIME NOT NULL,
    `last_logged_in` DATETIME NULL,
    `last_updated` DATETIME NULL,
    `newsletter` INT (0),
    PRIMARY KEY ( userid )
);

GRANT ALL PRIVILEGES ON mockbest_examination.* TO 'cpses_mogq2mqo8s'@'localhost';