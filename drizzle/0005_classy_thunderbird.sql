ALTER TABLE `charge_santries` DROP FOREIGN KEY `charge_santries_order_id_orders_id_fk`;
--> statement-breakpoint
ALTER TABLE `charge_santries` DROP COLUMN `order_id`;