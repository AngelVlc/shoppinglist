build:
	docker build -t shoppinglist .

console:
	docker run -it -v $(shell pwd):/app --rm shoppinglist bash

build-debug-apk:
	docker run -it -v $(shell pwd):/app --rm shoppinglist ./build-debug-apk.sh