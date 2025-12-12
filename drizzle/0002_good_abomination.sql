CREATE TABLE `charge_santries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int,
	`quantity` decimal(10,2),
	`amount` int,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `charge_santries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `charge_santries` ADD CONSTRAINT `charge_santries_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE cascade ON UPDATE no action;