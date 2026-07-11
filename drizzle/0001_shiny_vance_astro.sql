CREATE TABLE `birthdays` (
	`id` int AUTO_INCREMENT NOT NULL,
	`memberId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`birthDate` varchar(10) NOT NULL,
	`celebrated` enum('sim','nao') NOT NULL DEFAULT 'nao',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `birthdays_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `converts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`birthDate` varchar(10),
	`address` text,
	`conversionDate` timestamp NOT NULL DEFAULT (now()),
	`baptismDate` varchar(10),
	`status` enum('novo','em_acompanhamento','batizado','membro') NOT NULL DEFAULT 'novo',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `converts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`birthDate` varchar(10),
	`address` text,
	`status` enum('ativo','inativo','afastado') NOT NULL DEFAULT 'ativo',
	`joinDate` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visitors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`address` text,
	`visitDate` timestamp NOT NULL DEFAULT (now()),
	`interested` enum('sim','nao','talvez') NOT NULL DEFAULT 'talvez',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `visitors_id` PRIMARY KEY(`id`)
);
