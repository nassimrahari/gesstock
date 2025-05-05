

#Installation 
install node js

npm install -g nodemon

npm install prisma --save-dev
npm install @prisma/client

npx prisma migrate dev --name init

npx prisma generate


nodemon app.js or node app.js