const fs = require("fs");
const keywordsstr = fs.readFileSync("corpusKeyWords.txt").toString();
const keywords = keywordsstr.split("\n");
module.exports = keywords;
