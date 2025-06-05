CREATE TABLE `apiUser` (
	`id` integer PRIMARY KEY NOT NULL,
	`apiUserCustomerName` text NOT NULL,
	`apiUserUsername` text NOT NULL,
	`apiUserTempPassword` text NOT NULL,
	`apiUserPassword` text NOT NULL,
	`orgId` text NOT NULL,
	`apiKey` text NOT NULL,
	`accessToken` text,
	`accessTokenCreatedAt` text,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vehicle` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`color` text,
	`vin` text,
	`manufacturer` text,
	`model` text,
	`year` text,
	`fuelTankSize` text,
	`diplacement` text,
	`notes` text,
	`node` text NOT NULL,
	`nodeName` text NOT NULL,
	`presence` text,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
