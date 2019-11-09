# TypeScript/Express API Server

REST API Server using NodeJS, Express, TypeScript and MongoDB.

## Install Dependencies

```sh
npm install
```

## Run Server

### Run in development mode

```sh
npm run watch
```

### Run in production mode

```sh
npm run lint
npm run build
npm run test
npm start
```

## Development in Docker container

### Using docker-compose

```sh
docker-compose up --build
```

### Without docker-compose

#### Build

```sh
docker build \
  -f dev.Dockerfile \
  -t api-server.dev \
  .
```

#### Run

```sh
docker run \
  -it
  --rm \
  --name api-server \
  --network=host \
  --add-host=database:127.0.0.1 \
  --publish 3000:3000 \
  --volume /app/node_modules \
  --volume $(pwd):/app \
  api-server.dev
```

## Production Docker

### Build

```sh
docker build -t api-server .
```

### Run Example

```sh
docker run \
  --rm \
  --name api-server \
  --env NODE_ENV=production \
  --env NODE_APP_NAME='API Server' \
  --env NODE_PORT=3000 \
  --env NODE_ALLOW_CORS=false \
  --env MONGO_URI='127.0.0.1' \
  api-server
```
