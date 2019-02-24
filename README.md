# shoppinglist

## Tests

Unit test:

```
npm run test-dev
```

e2e:
```
npm run e22
```

## e2e test headless

In e2e/protractor.conf.js:

```
capabilities: {
  chromeOptions: {
    args: [ "--headless" ]
  },
  'browserName': 'chrome'
},
```