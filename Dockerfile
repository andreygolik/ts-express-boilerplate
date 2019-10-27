FROM node:10 as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY ts*.json LICENSE.txt ./
COPY ./copyStaticAssets.ts ./
COPY ./src/ ./src/
RUN npm run build --prod

FROM node:10
WORKDIR /app
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm install --production
COPY --from=builder /app/dist/ ./dist/
ENV NODE_ENV=production
CMD ["node", "dist/server.js"]
