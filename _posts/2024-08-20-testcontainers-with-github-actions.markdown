---
layout: post
title: '[node] Testcontainers with github actions'
date: 2024-08-20 00:00:00 +0100
---

I tried running testcontainers on github actions, the trick to running them was increasing the default timeout for your tests.
Github has out of the box support for docker, there is a delay with startup though, so you need to account for that.
I thought this was a hack, but the official testcontainers repo uses this approach as well.

```json
{
  // jest config
  "testEnvironment": "node",
  "preset": "ts-jest",
  "testTimeout": 60000
}
```

## About testcontainers

In case you're wondering what testcontainers are; it's a library that provides lightweight containers for your tests.
It allows you to easily set up dependencies, so you can run your tests against in a "real" environment.
You can E2E test a CRUD backend with a real database, or test against an actual message queue.
It adds a lot of reliability since the dependencies are very close to the real deal, and it makes E2E/integration test set up a breeze.

Here's an example test using nestjs with drizzle as an ORM:

```typescript
import request from 'supertest';
import { runMigrations } from '@db/migrate';
import { schema } from '@db/schema';
import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import { INestApplication } from '@nestjs/common';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql/build/postgresql-container';
import { UserModule } from '../src/user/user.module';

describe('users e2e', () => {
  let app: INestApplication;
  let postgresContainer: StartedPostgreSqlContainer;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start();
    
    // add DATABASE_URL to env so we can use it for our migrations
    process.env.DATABASE_URL = postgresContainer.getConnectionUri();

    const moduleFixture = await Test.createTestingModule({
      imports: [
          DrizzlePostgresModule.registerAsync({
              tag: 'DB',
              useFactory() {
                  return {
                      postgres: {
                          url: postgresContainer.getConnectionUri(),
                      },
                      config: { schema },
                  };
              },
          }),
          UserModule
      ],
    }).compile();
    
    // this also runs a seed method for testdata in non dev environments  
    await runMigrations();
    
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await postgresContainer.stop();
  });

  it('Get users', () => {
    // Run actual http request against server with postgres database 
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect([
        { id: 1, name: 'Marijn' },
      ]);
  });
});
```