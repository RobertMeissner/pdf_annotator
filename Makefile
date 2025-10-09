.PHONY: help check format lint type-check dev build clean

check: lint type-check format

format:
	bun run format

lint:
	bun run lint

type-check:
	bun run type-check

dev:
	bun run dev

build:
	bun run build

clean:
	rm -rf dist node_modules/.tmp