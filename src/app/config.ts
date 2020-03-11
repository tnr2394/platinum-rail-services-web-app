
// For Local Environment

// const baseUrl = "http://localhost:3000/";


// For Ip Environement

const baseUrl = "http://192.168.1.112:3000/";


// For Live Environment

// const baseUrl = "https://workspace.platinumrailservices.co.uk:3000/"


//For Testing Environment

// const baseUrl = "https://testing.platinumrailservices.co.uk:4000/"

// For Remove Console Logs 

console.log = function () { }

export const config = {
    baseApiUrl: baseUrl,
}
// chris@platinumrailservices.co.uk
// Jackevie18