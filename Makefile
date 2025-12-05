dev:
	bun run dev

driz-push:
	bunx drizzle-kit push

driz-generate:
	bunx drizzle-kit generate

driz-migrate:
	bunx drizzle-kit migrate

seed:
	bun run src/db/seed/admin.ts