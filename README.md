# @lindorm-io/koa-jwt
JWT and JWKS middleware for @lindorm-io/koa applications.

## Installation
```shell script
npm install --save @lindorm-io/koa-jwt
```

### Peer Dependencies
This package has the following peer dependencies: 
* [@lindorm-io/jwt](https://www.npmjs.com/package/@lindorm-io/jwt)
* [@lindorm-io/koa](https://www.npmjs.com/package/@lindorm-io/koa)

## Usage

### JWKS Middleware
```typescript
koaApp.addMiddleware(jwksMiddleware({
  host: "https://authentication.service/",
  logger: winstonLogger,
  path: "/.well-known/jwks.json",
}));
```

### Token Issuer Middleware
```typescript
koaApp.addMiddleware(tokenIssuerMiddleware({
  issuer: "https://authentication.service/",
}));
```

### Bearer Token Middleware
```typescript
koaApp.addMiddleware(bearerTokenMiddleware({
  audience: "access",
  issuer: "https://authentication.service/",
}));
```
