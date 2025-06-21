# Bookstore Backend

## Dependencies

### System requirements

- PostgreSQL 17
- OpenJDK 21
- A S3 Bucket, we use [SeaWeed](https://github.com/seaweedfs/seaweedfs)

## Quickstart

### Database setup

Create PostgreSQL container

```sh
podman volume create bookstore-db-psql
podman run --rm --detach \
  --volume bookstore-db-psql:/var/lib/postgresql \
  --env POSTGRES_PASSWORD=1 \
  -p 127.0.0.1:5432:5432 \
  postgres:17-alpine3.21
psql -h localhost -p 5432 -U postgres # enter password 1
```

Enter `psql` cli and create the database

```sql
postgres=# CREATE DATABASE bookstoredb;
```

### First migration

After the creation of database, first perform migration.

This will create the initial migration, creating the table and populate books.

```sh
./gradlew clean build
./gradlew flywayMigrate
```

### S3 setup

Follow the instructions on [SeaWeed](https://github.com/seaweedfs/seaweedfs) to install `weed` locally, and run the following command:

```sh
WORKER_DIR=/run/user/1000/s3
mkdir -p "$WORKER_DIR"
weed server \
  -dir="$WORKER_DIR" \
  -master.port=9333 \
  -volume.port=8090 \ # avoid collision
  -filer \
  -filer.port=8888 \
  -s3 \
  -s3.port=8333
```

This won't setup any form of protection, authentication, etc. for the bucket. For testing and development only!

You can also use container if you wish.

### Running the application

```sh
./gradlew bootRun
```

If you want to export the database schema, you can

```sh
./gradlew bootRun --args='--spring.profiles.active=export-schema'
```

The `V1__init` migration is based on this schema.
