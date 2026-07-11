ALTER TABLE `members` ADD `gender` enum('masculino','feminino','outro');--> statement-breakpoint
ALTER TABLE `members` ADD `maritalStatus` enum('solteiro','casado','divorciado','viuvo');--> statement-breakpoint
ALTER TABLE `members` ADD `marriageDate` varchar(10);--> statement-breakpoint
ALTER TABLE `members` ADD `rg` varchar(20);--> statement-breakpoint
ALTER TABLE `members` ADD `cpf` varchar(14);--> statement-breakpoint
ALTER TABLE `members` ADD `specialNeeds` text;--> statement-breakpoint
ALTER TABLE `members` ADD `isBaptized` enum('sim','nao') DEFAULT 'nao';--> statement-breakpoint
ALTER TABLE `members` ADD `baptismDate` varchar(10);--> statement-breakpoint
ALTER TABLE `members` ADD `isPastor` enum('sim','nao') DEFAULT 'nao';--> statement-breakpoint
ALTER TABLE `members` ADD `isLeader` enum('sim','nao') DEFAULT 'nao';--> statement-breakpoint
ALTER TABLE `members` ADD `spiritualFeeling` varchar(255);--> statement-breakpoint
ALTER TABLE `members` ADD `groups` text;--> statement-breakpoint
ALTER TABLE `members` ADD `trails` text;