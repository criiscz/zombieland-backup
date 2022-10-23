FROM node:slim

WORKDIR /app
# Add node modules to the path
ENV PATH /app/node_modules/.bin:$PATH

# Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# add app
COPY . ./

CMD ["npm", "run", "dev"]
