//use regex

// const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:[0-9]+)?(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
// const checkUrlRegex = (...urls) => urls.map(url => urlRegex.test(url));

//use npm package

//urlRegex.test(testURL);
// const { isUrl } = require('check-valid-url');
// const checkUrl = (...urls) => {
//     return urls.map((url) => {
//         const validate = isUrl(url);
//         if (validate) return true;
//         else return false;
//     })
// }
// const ans = checkUrl('http://www.raju.com/javascript/');
// console.log(ans);


//use js function

//const checkUrls = (...urls) => !urls.find((url) => !(url.startsWith('https://') || url.startsWith('http://')))

const checkUrls = (...urls) =>
    !urls.find((url) => {
        try {
            new URL(url);
            return false;
        } catch (_) {
            return true;
        }
    });

const ans = checkUrls(
    'http://www.raju.com/javascript/',
    'httpw://www.raju.com/javascript/',
    'http://www.raju.com/javascript/'
);

console.log(ans);