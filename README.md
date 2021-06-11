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
}));
```

### Token Validation Middleware
```typescript
koaApp.addMiddleware(tokenValidationMiddleware({
  audience: "multi_factor",
  issuer: "https://authentication.service/", // used for token validation
  key: "tokenKey", // used to set validated token on context (ctx.token.tokenKey)
  path: "tokenPath", // used to find token on request body (ctx.request.body.tokenPath)
  optional: false, // used if token is not necessary, but optional
}));
```
