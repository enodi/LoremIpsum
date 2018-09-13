import http from 'http';
import router from "./router";

const port = 3000;

const server = http.createServer((request, response) => {
  return new Promise((resolve, reject) => {
    router.home(request, response);
    resolve(true);
  }).then(() => router.generateText(request, response));
});

server.listen(process.env.PORT || port, () => {
  console.log(`Server running at localhost:${port}/`);
});
