.PHONY: release

all: scihub_linker.xpi
clean: ; -rm -f scihub_linker.xpi

version=$(shell grep -o '"version"\s*:\s*"\S*"' manifest.json | sed -e 's/.*"\([0-9].*\)".*/\1/')

scihub_linker.xpi: dev/include-manifest $(shell find $(shell cat dev/include-manifest) -type f 2>/dev/null)
	rm -f "$@" "$@".tmp
	zip -q -r "$@".tmp . -i@dev/include-manifest
	mv "$@".tmp "$@"

dist/scihub_linker-${version}-tb.xpi: scihub_linker.xpi
	mkdir -p "`dirname $@`"
	mv scihub_linker.xpi "$@"

release: dist/scihub_linker-${version}-tb.xpi

## Requires the Node 'addons-linter' package is installed
## npm install -g addons-linter
## Note: this will produce a lot of "UNSUPPORTED_API" and "MANIFEST_PERMISSIONS"
## warnings because the addons-linter assumes vanilla firefox target.
lint:
	addons-linter .

# unit_test: $(shell find $(shell cat dev/include-manifest) 2>/dev/null)
# 	@node test/run_tests.js 2>&1 \
# 		| sed -e '/^+ TEST'/s//"`printf '\033[32m+ TEST\033[0m'`"'/' \
# 		| sed -e '/^- TEST'/s//"`printf '\033[31m- TEST\033[0m'`"'/' \
# 		| sed -e 's/All \([0-9]*\) tests are passing!'/"`printf '\033[1m\033[32m'`"'All \1 tests are passing!'"`printf '\033[0m'`"/ \
# 		| sed -e 's/\([0-9]*\/[0-9]*\) tests failed.'/"`printf '\033[1m\033[31m'`"'\1 tests failed.'"`printf '\033[0m'`"/

test: lint unit_test
