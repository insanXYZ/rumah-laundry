ALTER TABLE `charge_santries` RENAME COLUMN `status` TO `payed`;--> statement-breakpoint
ALTER TABLE `charge_santries` MODIFY COLUMN `payed` boolean;--> statement-breakpoint
ALTER TABLE `charge_santries` MODIFY COLUMN `payed` boolean DEFAULT false;