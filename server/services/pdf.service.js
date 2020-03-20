const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const path = require('path');
const fs = require('fs-extra');
const moment = require('moment');

const compile = async function (templeName, data) {

    const filePath = path.join(process.cwd(), 'views', `${templeName}.hbs`);

    console.log('File Path:', filePath);
    const html = await fs.readFile(filePath, 'utf-8');

    return hbs.compile(html)(data);

};

hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('dateFormat', function (value, format) {
    return moment(value).format(format);
});


async function pdfGenerate(dataDetails) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        console.log('dataDetails', dataDetails);

        const content = await compile('pdf-template', dataDetails);

        await page.setContent(content);
        await page.emulateMedia('screen');
        await page.pdf({
            path: 'test.pdf',
            format: 'A4',
            printBackground: true
        });

        console.log('Pdf Generated');
        await browser.close();
        // process.exit();

    } catch (e) {
        console.log('Error:', e);
    }

}

module.exports.pdfGenerate = pdfGenerate;


// pdfGenerate()