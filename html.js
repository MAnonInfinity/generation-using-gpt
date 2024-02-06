const pdf2html = require('pdf2html');


async function main() {
  const html = await pdf2html.html('./pdf/addition-subtraction-practice.pdf');
  console.log(html);
}

main();