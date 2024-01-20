FROM node:18

WORKDIR /usr/src/app

COPY . .

# ENV REACT_APP_BACKEND_URL=http://localhost:3000

RUN npm install

CMD ["npm", "run", "dev"]

