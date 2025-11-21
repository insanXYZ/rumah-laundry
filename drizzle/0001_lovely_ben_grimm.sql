CREATE TABLE `santris` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`class` varchar(50) NOT NULL,
	`number_phone` varchar(20) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `santris_id` PRIMARY KEY(`id`)
);
