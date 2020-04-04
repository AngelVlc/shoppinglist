# shoppinglist [![Build Status](https://travis-ci.org/AngelVlc/shoppinglist.svg?branch=master)](https://travis-ci.org/AngelVlc/shoppinglist)

## Development

### Serve

```
> ionic serve
```

### Tests

Unit test:

```
> npm run test-dev
```

e2e:
```
> npm run e2e
```

### Show chrome while e2e testing

Remove headless arg in e2e/protractor.conf.js:

```
capabilities: {
  chromeOptions: {
    args: [ "--headless" ]
  },
  'browserName': 'chrome'
},
```

### Build local

```
> docker build -t shoppinglist .
```

### Upload to google play

1. Change app version in config.xml
2. Push a tag starting with 'v'
