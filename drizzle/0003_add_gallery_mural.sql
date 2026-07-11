CREATE TABLE `galleryPhotos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`imageUrl` text NOT NULL,
	`photoDate` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `galleryPhotos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `muralPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`youtubeUrl` text,
	`content` text,
	`pdfUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `muralPosts_id` PRIMARY KEY(`id`)
);
