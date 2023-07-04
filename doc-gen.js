const { removeStopwords } = require("stopword");
const removePunc = require("remove-punctuation");

let documents = [];
const fs = require("fs");
const path = require("path");

const N = 3023;

for (let i = 1; i <= N; i++) {
  const str = path.join(__dirname, "Problems");
  const str1 = path.join(str, `problem_text_${i}.txt`);
  //   console.log(str1);
  const question = fs.readFileSync(str1).toString();
  documents.push(question);
}

let docKeywords = [];

for (let i = 0; i < N; i++) {
  const lines = documents[i].split("\n");
  const curDocWords = [];
  for (let k = 0; k < lines.length; k++) {
    const curLineWords = lines[k].split(" ");
    curLineWords.forEach((e) => {
      e = e.split("\r");
      if (e[0].length) curDocWords.push(e[0]);
    });
  }

  const curDocKeyWords = removeStopwords(curDocWords);
  curDocKeyWords.sort();

  let ConsistentCurDocKeyWords = [];
  for (let k = 0; k < curDocKeyWords.length; k++) {
    curDocKeyWords[k] = curDocKeyWords[k].toLowerCase();
    curDocKeyWords[k] = removePunc(curDocKeyWords[k]);
    if (curDocKeyWords[k] != "")
      ConsistentCurDocKeyWords.push(curDocKeyWords[k]);
  }

  docKeywords.push(ConsistentCurDocKeyWords);
}

// console.log(docKeywords);

let sum = 0;

for (let i = 0; i < docKeywords.length; i++) {
  const length = docKeywords[i].length;
  sum += length;
  fs.appendFileSync("length.txt", length + "\n");
}

let corpusKeyWords = [];
for (let i = 0; i < docKeywords.length; i++) {
  for (let j = 0; j < docKeywords[i].length; j++) {
    if (corpusKeyWords.indexOf(docKeywords[i][j]) == -1) {
      corpusKeyWords.push(docKeywords[i][j]);
    }
  }
}

corpusKeyWords.sort();

for (let i = 0; i < corpusKeyWords.length; i++) {
  fs.appendFileSync("corpusKeyWords.txt", corpusKeyWords[i] + "\n");
}

console.log(corpusKeyWords.length);

let TF = new Array(N);

for (let i = 0; i < N; i++) {
  TF[i] = new Array(corpusKeyWords.length).fill(0);
  let map = new Map();
  docKeywords[i].forEach((key) => {
    map.set(key, 0);
  });

  docKeywords[i].forEach((key) => {
    let cnt = map.get(key);
    cnt++;
    map.set(key, cnt);
  });

  docKeywords[i].forEach((key) => {
    let id = corpusKeyWords.indexOf(key);
    if (id != -1) {
      TF[i][id] = map.get(key);
    }
  });
}

for (let i = 0; i < N; i++) {
  for (let j = 0; j < corpusKeyWords.length; j++) {
    if (TF[i][j] != 0) {
      fs.appendFileSync("TF.txt", i + " " + j + " " + TF[i][j] + "\n");
    }
  }
}

let IDF = new Array(corpusKeyWords.length);

for (let i = 0; i < corpusKeyWords.length; i++) {
  let cnt = 0;
  for (let j = 0; j < N; j++) {
    if (TF[j][i]) cnt++;
  }
  if (cnt) IDF[i] = Math.log((N - cnt + 0.5) / (cnt + 0.5) + 1);
}

IDF.forEach((value) => {
  fs.appendFileSync("IDF.txt", value + "\n");
});

// let TFIDF = new Array(N);

// for (let i = 0; i < N; i++) {
//   TFIDF[i] = new Array(corpusKeyWords.length);
//   for (let j = 0; j < corpusKeyWords.length; j++) {
//     TFIDF[i][j] = TF[i][j] * IDF[j];
//   }
// }

// for (let i = 0; i < N; i++) {
//   for (let j = 0; j < corpusKeyWords.length; j++) {
//     if (TFIDF[i][j] != 0) {
//       fs.appendFileSync("TFIDF.txt", i + " " + j + " " + TFIDF[i][j] + "\n");
//     }
//   }
// }
