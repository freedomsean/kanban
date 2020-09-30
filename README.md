# Kanban board

This is a Kanban board example which is developed by NodeJS and Typescript.

## Development

### Other component

- Postgres
- Fluentd

You can reference the config in `fluentd/fluent.conf`, if you need to setup in the virtual machine.

Please make sure your `.env` match what do you set in the `fluent.conf`.

### Pre-requirement

- install `nodejs` dependency

```
npm i -g yarn
yarn install
```

- install `docker` and `docker-compose`

### Set Env File

touch `.env` in your project directory and make sure you have the following environment variables.

```
# node
NODE_ENV=                   # NODE_ENV can be dev or production
HTTP_SERVER_PORT=           # HTTP server hosting port             

# database
DB_DIALECT=                 # Database type
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_USED_DATABASE=
DB_POOL_MAX_CONNECTION=     # Database connection pool size
DB_SYNC=                    # Always be false when your NODE_ENV is production. If you want to change schema in the production, please find DBA or do it manually.

# jwt
JWT_SECRET=
SALT_ROUNDS=                # NodeJS default is 10
JWT_EXPIRES_IN=             # Could be something like 7d

# fluentd
FLUENTD_HOST=
FLUENTD_PORT=
FLUENTD_TIMEOUT=
FLUENTD_SHARED_KEY=         # This should be same with your config of fluentd which is defined in fluentd/fluent.conf
FLUENTD_TAG=
```


### Testing

Before you run test, please make sure you finish to setup full environment and have `.env`.

You can run `docker-compose up -d` to setup in your local machine.

Finally, you can execute.

```
npm run test
```


### Other script

- Build typescript: `npm run build`
- Lint and fix: `npm run lint`
- Sync database schema: `npm run sync`