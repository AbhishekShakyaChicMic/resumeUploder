const axios = require('axios');
const fs = require('fs');
const path = require('path');

const uploadFilefromUrl = async (url, localDir) => {
    const fileName = path.basename(new URL(url).pathname);
    const localStorageUrl = path.join(localDir, Date.now()+fileName);

    const write = fs.createWriteStream(localStorageUrl);

    const response = await axios({
        method: "GET",
        url: url,
        responseType: "stream"
    });

    response.data.pipe(write);

    return new Promise((resolve, reject) => {
        write.on('finish', () => {
            fs.readFile(localStorageUrl, (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve({ buffer: data, fileName });
            });
        });
        write.on('error', reject);
    });
};

module.exports = uploadFilefromUrl;
