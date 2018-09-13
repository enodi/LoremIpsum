import queryString from "querystring";
import url from "url";
import renderer from "./renderer";
import Generator from "./generator";

const commonHeaders = { 'Content-Type': 'text/html' };

function home(request, response) {
  if (request.url === "/") {
    if (request.method.toLowerCase() === "get") {
      response.writeHead(200, commonHeaders);
      renderer.template("header", [], response);
      renderer.template("body", [], response);
      renderer.template("footer", [], response);
      response.end();
    } else {
      request.on("data", postData => {
        let query = queryString.parse(postData.toString());
        response.writeHead(303, { "Location": `/&${query.optradio}=${query.length}&start-with-lorem=1` });
        response.end();
      })
    }
  }
}

function generateText(request, response) {
  if (request.url !== "/") {
    response.writeHead(200, commonHeaders);
    renderer.template("header", [], response);

    const urlPath = url.parse(request.url, true);
    const urlParts = urlPath.href.split("&");
    let value = '';
    if (urlParts[1]) {
      value = urlParts[1].split("=");
      let loremIpsum = new Generator(`&${value[0]}=${value[1]}&start-with-lorem=1`);
      loremIpsum.on("end", dummyText => {
        if (value[0] === "sentences") {
          const sentences = dummyText.toString().split(".");
          renderer.template("text", sentences, response);
          renderer.template("footer", [], response);
          response.end();
        } else {
          renderer.template("text", dummyText, response);
          renderer.template("footer", [], response);
          response.end();
        }
      });
      loremIpsum.on("error", error => {
        renderer.template("error", [], response);
        renderer.template("footer", [], response);
        response.end();
      });
    }
  }
}

export default {
  home,
  generateText
};
