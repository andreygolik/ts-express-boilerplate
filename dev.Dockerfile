FROM node:10
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i -g nodemon
RUN npm install
COPY tsconfig.json LICENSE.txt ./
# COPY ./copyStaticAssets.ts ./
# COPY ./src/ ./src/
ENV NODE_ENV=development

CMD ["npm", "run", "watch"]
