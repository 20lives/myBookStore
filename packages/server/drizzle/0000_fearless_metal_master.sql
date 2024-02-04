CREATE TABLE `books` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(256),
	`description` varchar(8192),
	`author` varchar(256),
	`publication_date` date,
	`genre` enum('Science fiction','Satire','Drama','Action','Romance','Mystery','Horror'),
	CONSTRAINT `books_id` PRIMARY KEY(`id`)
);
