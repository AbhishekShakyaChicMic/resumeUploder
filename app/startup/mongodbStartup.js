const { URL } = require('../../config')

module.exports = async (mongoose) => {
    try {
        await mongoose.connect(URL);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
    }
}