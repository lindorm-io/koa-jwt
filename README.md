# @lindorm-io/koa-jwt
JWT and JWKS middleware for @lindorm-io/koa applications.

## Installation
```shell script
npm install --save @lindorm-io/koa-jwt
```

### Peer Dependencies
This package has the following peer dependencies: 
* [@lindorm-io/jwt](https://www.npmjs.com/package/@lindorm-io/jwt)
* [@lindorm-io/key-pair](https://www.npmjs.com/package/@lindorm-io/key-pair)
* [@lindorm-io/koa](https://www.npmjs.com/package/@lindorm-io/koa)

## Usage

### Token Issuer Middleware
```typescript
koaApp.addMiddleware(tokenIssuerMiddleware({
  issuer: "https://authentication.service/",
}));
```
