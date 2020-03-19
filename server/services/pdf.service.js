const pdf = require('html-pdf');
const options = { format: 'Letter' };


const puppeteer = require('puppeteer');

const hbs = require('handlebars');
const path = require('path');
const fs = require('fs-extra');

const dataDetails = {
    name: 'vishal'
}


// module.exports.generatePdf = generatePdf


const compile = async function (templeName, data) {

    const filePath = path.join(process.cwd(), 'views', `${templeName}.hbs`);

    console.log('File Path:', filePath);
    const html = await fs.readFile(filePath, 'utf-8');

    return hbs.compile(html)(data);

};

// (async function () {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();

//         const content = await compile('pdf-template', dataDetails);

//         await page.setContent(content);
//         await page.emulateMedia('screen');
//         await page.pdf({
//             path: 'test.pdf',
//             format: 'A4',
//             printBackground: true
//         });

//         console.log('Pdf Generated');
//         await browser.close();
//         process.exit();

//     } catch (e) {
//         console.log('Error:', e);
//     }

// })();


// generatePdf()