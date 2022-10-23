build:
	docker build -t shoppinglist .

console:
	docker run -it -v $(shell pwd):/app --rm shoppinglist bash