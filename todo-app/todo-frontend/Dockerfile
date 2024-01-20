FROM node:18

WORKDIR /usr/src/app

COPY . .

ENV REACT_APP_BACKEND_URL=http://localhost:8080/api 

RUN npm ci

RUN CI=true npm run test

RUN npm run build

RUN npm install -g serve

CMD ["serve", "build"]

