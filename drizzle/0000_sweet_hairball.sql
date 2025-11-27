CREATE TABLE `Admin` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`username` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` enum('admin','superadmin') NOT NULL DEFAULT 'admin',
	CONSTRAINT `Admin_id` PRIMARY KEY(`id`),
	CONSTRAINT `Admin_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `Bill` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`status` varchar(255) NOT NULL,
	`total` float NOT NULL,
	`orderId` int NOT NULL,
	`storeId` int,
	CONSTRAINT `Bill_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`detail` text,
	`storeId` int NOT NULL,
	CONSTRAINT `Category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Discount` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(255) NOT NULL,
	`expiredAt` datetime NOT NULL,
	`maxCount` int,
	`startTime` datetime,
	`endTime` datetime,
	`isActive` boolean NOT NULL DEFAULT true,
	`storeId` int NOT NULL,
	CONSTRAINT `Discount_id` PRIMARY KEY(`id`),
	CONSTRAINT `Discount_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `Menu` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`price` float NOT NULL,
	`detail` text,
	`discount` float,
	`netPrice` float NOT NULL,
	`categoryId` int NOT NULL,
	`storeId` int NOT NULL,
	`menuTypeId` int,
	`imageUrl` text,
	CONSTRAINT `Menu_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `MenuType` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`storeId` int NOT NULL,
	CONSTRAINT `MenuType_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `OrderUser` (
	`id` int AUTO_INCREMENT NOT NULL,
	`menuId` int NOT NULL,
	`quantity` int NOT NULL,
	`orderId` int NOT NULL,
	CONSTRAINT `OrderUser_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Order` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tableId` int NOT NULL,
	`orderUserId` int,
	`openTime` datetime NOT NULL,
	`closeTime` datetime,
	`subtotal` float,
	`total` float,
	`discountId` int,
	`status` varchar(255),
	`billId` int,
	CONSTRAINT `Order_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `RefreshToken` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(255) NOT NULL,
	`staff_id` int NOT NULL,
	`expires_at` datetime NOT NULL,
	CONSTRAINT `RefreshToken_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Staff` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(191) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` varchar(191) NOT NULL,
	CONSTRAINT `Staff_id` PRIMARY KEY(`id`),
	CONSTRAINT `Staff_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `Store` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` varchar(255),
	`vat` float,
	`serviceCharge` float,
	`createAt` timestamp NOT NULL DEFAULT (now()),
	`adminId` int NOT NULL,
	CONSTRAINT `Store_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `TableType` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameType` varchar(255) NOT NULL,
	`minSeat` int NOT NULL,
	`maxSeat` int NOT NULL,
	`storeId` int NOT NULL,
	CONSTRAINT `TableType_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Table` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tableName` varchar(255),
	`zone` varchar(255),
	`zoneId` int,
	`tableTypeId` int NOT NULL,
	`storeId` int NOT NULL,
	`statusTable` enum('available','in_use','call_staff','pay_bill') DEFAULT 'available',
	CONSTRAINT `Table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Zone` (
	`id` int AUTO_INCREMENT NOT NULL,
	`zoneName` varchar(255) NOT NULL,
	`storeId` int NOT NULL,
	CONSTRAINT `Zone_id` PRIMARY KEY(`id`)
);
