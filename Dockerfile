FROM node:18

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code to the working directory
COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["node", "dist/index.js"]
