# Select image
FROM node:18

# Set workdir
WORKDIR /usr/src/app

# Copy files, change owner to least privileged
COPY --chown=node:node . .

# Install exact versions, only prod
RUN npm ci --only=production

# Set env, express debug
ENV DEBUG=dockerfile-exercise:*

# Change user to least privileged
USER node

# Run command
CMD npm start