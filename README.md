# @lindorm-io/koa-jwt
Token issuer middleware for @lindorm-io/koa applications.

## Installation
```shell script
npm install --save @lindorm-io/koa-jwt
```

### Peer Dependencies
This package has the following peer dependencies: 
* [@lindorm-io/jwt](https://www.npmjs.com/package/@lindorm-io/jwt)
* [@lindorm-io/key-pair](https://www.npmjs.com/package/@lindorm-io/key-pair)
* [@lindorm-io/koa](https://www.npmjs.com/package/@lindorm-io/koa)
* [@lindorm-io/winston](https://www.npmjs.com/package/@lindorm-io/winston)

## Usage

### Token Issuer Middleware
```typescript
koaApp.addMiddleware(tokenIssuerMiddleware({
  issuer: "https://authentication.service/", // used for token validation
  issuerName: "auth", // used to store issuer on context
  keystoreName: "auth", // used to find the keystore on context
}));
```
