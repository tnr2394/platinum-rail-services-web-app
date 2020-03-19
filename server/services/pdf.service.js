const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const path = require('path');
const fs = require('fs-extra');
const moment = require('moment');

// const dataDetails =
// {
//     refresherInduction: "No",
//     newStarter: "No",
//     workingOnNR: "Yes",
//     workingOnTfL: "No",
//     dateOfInduction: "2020-03-19T18:30:00.000Z",
//     sponsorship: {
//         primary: "Yes",
//         subSponsored: "Yes"
//     },
//     checklist: {
//         type1: 'Yes',
//         type2: 'Yes',
//         type3: 'Yes',
//         type4: 'Yes',
//         type5: 'No',
//         type6: 'Yes',
//         type7: 'Yes',
//         type8: 'Yes',
//         type9: 'N/A',
//         type10: 'No',
//         type11: 'Yes',
//         type12: 'Yes',
//     },
//     inductionPackComplete: this.inductionPackComplete,
//     dateAddedToSentinelDatabase: this.dateAddedToSentinelDatabase,
//     candidateName: "Vishal Pankhaniya",
//     dateOfBirth: "2020-03-19T18:30:00.000Z",
//     nationalInsuranceNumber: "1234567899633",
//     candidateAddress: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
//     contactNumber: "7621859675",
//     sentinelNumber: "78963134654898",
//     emailAddress: "vishal.pankhaniya@gmail.com",
//     bankDetails: {
//         accountHolderName: "Vishal Pankhaniya",
//         bankName: "Bank Of Baroda",
//         bankAddress: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
//         accountNumber: "12345678969261",
//         sortCode: "123456789"
//     },
//     cardHolderDeclare: {
//         cardIn1: "demo",
//         cardsign1: "",
//         carddate1: "2020-03-01T18:30:00.000Z",
//         cardIn2: "demo",
//         carddate2: "2020-03-01T18:30:00.000Z"
//     },

//     paymentDetails: {
//         CIS: this.CIS,
//         PAYE: this.PAYE,
//         companyName: this.companyName,
//         companyNo: this.companyNo,
//         companyState: this.companyState,
//         certificateNumber: this.certificateNumber
//     },
// }


// module.exports.generatePdf = generatePdf


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