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
* [@lindorm-io/koa-jwt](https://www.npmjs.com/package/@lindorm-io/koa-jwt)
* [@lindorm-io/winston](https://www.npmjs.com/package/@lindorm-io/winston)

## Usage

### Token Issuer Middleware
```typescript
koaApp.addMiddleware(tokenIssuerMiddleware({
  issuer: "https://authentication.service", // used for token validation
}));
```

### Token Validation Middleware
```typescript
const middleware = tokenValidationMiddleware({
  issuer: "https://authorization.service", // REQURIED | uri | used for token validation
  key: "tokenKey", // OPTIONAL | string | used to set validated token on context (ctx.token.tokenKey)
  maxAge: "10 minutes", // OPTIONAL | string | used in JWT validation
  type: "access", // REQUIRED | string | token type
})

router.use(middleware(
  "request.body.tokenName", // REQUIRED | path | used to find token 
  {
    nonce: "entity.authorizationSession.nonce", // OPTIONAL | path | used in JWT validation
    scopes: "entity.refreshSession.scopes", // OPTIONAL | path | used in JWT validation
    subject: "entity.refreshSession.accountId", // OPTIONAL | path | used in JWT validation
    optional: false, // OPTIONAL | boolean | determines if middleware should throw when token is missing
  }
));
```
