import fs from "fs";
import cheerio from "cheerio";

function mergeValues(text, content) {
  if (text.length === 0) return content;
  const $ = cheerio.load(content);
  for (let value of text) {
    $("#output").append("<p>" + value + "</p>");
  }
  content = $.html();
  return content;
}

function template(templateName, text, response) {
  let fileContent = fs.readFileSync(`./templates/${templateName}.html`, { encoding: "utf8" });
  fileContent = mergeValues(text, fileContent);

  response.write(fileContent);
}

export default { template };
