# Run server
yarn run ts-node ./samples/server.ts

# Run client
yarn run webpack
cp build/socket.js* samples/
cd samples && npx http-server