CREATE TABLE `User` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lineId` varchar(255) NOT NULL,
	CONSTRAINT `User_id` PRIMARY KEY(`id`),
	CONSTRAINT `User_lineId_unique` UNIQUE(`lineId`)
);
--> statement-breakpoint
ALTER TABLE `OrderUser` ADD `note` text;--> statement-breakpoint
ALTER TABLE `OrderUser` ADD `lineId` varchar(255);