const input = `FetchError: [GET] "/api/getData/product/shtangentsirkul-shtsts-i-150-0-01-elektronnyj-chiz": 403 Forbidden
 at async i (https://chelinstrument.ru/_nuxt/XtNwWmb_.js:4:69481)`;
const stackRegex = /at\s+(?:[\w\s$.()]+(?=\s*\())?\s*\(?([^)]+?):(\d+):(\d+)\s*\)?/g;

console.log("Input length:", input.length);
console.log("Input content:", JSON.stringify(input));

let match;
while ((match = stackRegex.exec(input)) !== null) {
    console.log("Match found!");
    console.log("Full match:", match[0]);
    console.log("URL:", match[1]);
    console.log("Line:", match[2]);
    console.log("Col:", match[3]);
}

if (!input.match(stackRegex)) {
    console.log("No matches found via match()");
}
