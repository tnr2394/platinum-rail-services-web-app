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
        const content = await compile('pdf-template', dataDetails);

        await page.setContent(content);
        await page.emulateMedia('screen');
        const buffer = await page.pdf({
            path: 'test.pdf',
            format: 'A4',
            printBackground: true,
            displayHeaderFooter: true,
            margin: {
                top: '100px',
                bottom: '100px',
                right: '20px',
                left: '20px'
            },
        });

        console.log('Pdf Generated', buffer);
        await browser.close();

        return buffer;

    } catch (e) {
        console.log('Error:', e);
    }

}

module.exports.pdfGenerate = pdfGenerate;


