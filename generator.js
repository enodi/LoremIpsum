import { EventEmitter } from "events";
import https from "https";
import http from "http";
import util from "util";

function Generator(url) {
  EventEmitter.call(this);
  let textEmitter = this;

  let request = https.get(`https://baconipsum.com/api/?type=meat-and-filler/${url}`, response => {
    let body = "";
    if (response.statusCode !== 200) {
      request.abort();
      textEmitter.emit(
        "error",
        new Error(`There was an error generating dummy text. (${http.STATUS_CODES[response.statusCode]})`)
      );
    }
    response.on('data', chunk => {
      body += chunk;
      textEmitter.emit("data", chunk);
    });

    response.on('end', () => {
      if (response.statusCode === 200) {
        try {
          let text = JSON.parse(body);
          textEmitter.emit("end", text);
        } catch (error) {
          textEmitter.emit("error", error);
        }
      }
    }).on("error", error => {
      textEmitter.emit("error", error);
    });
  });
}

util.inherits(Generator, EventEmitter);

export default Generator;
