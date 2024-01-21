FROM node:20

WORKDIR /usr/src/app

COPY . .

ENV REACT_APP_BACKEND_URL=http://localhost:8080

RUN npm ci

RUN npm run build

RUN npm install -g serve

CMD ["serve", "build"]