FROM node:18-alpine

# Create app directory
WORKDIR /app

#Install app dependencies
COPY package*.json ./

#Building code for production
RUN npm install

#Bundle app source
COPY . .

EXPOSE 7071
CMD ["npm", "start"]