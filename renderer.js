import fs from "fs";

function mergeValues(text, content) {
  for (let [index, value] of text.entries()) {
    content = content.replace("{{" + index + "}}", value)
  }
  return content;
}

function template(templateName, text, response) {
  let fileContent = fs.readFileSync(`./templates/${templateName}.html`, { encoding: "utf8" });
  fileContent = mergeValues(text, fileContent);

  response.write(fileContent);
}

export default { template };
