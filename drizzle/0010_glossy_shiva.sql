ALTER TABLE `inventories` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `inventory_stock` ADD `price` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `inventory_stock` ADD `description` varchar(255);