FROM node:20

WORKDIR /usr/src/app

COPY . .

ENV MONGODB_URI=mongodb+srv://numberone:mon12345go@cluster0.knmh4.mongodb.net/puhelinluettelo?retryWrites=true&w=majority

RUN npm install

CMD ["npm", "start"]

