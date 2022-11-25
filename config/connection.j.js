const mongoose = require("mongoose");
module.exports.conn = () => {
    mongoose
        .connect("mongodb://localhost/bcrypt") //mongoose.connect(process.env.DB_URL)//tester
        .then(() => {
            console.log("connected to mongodb");
        })
        .catch((e) => {
            console.log(e);
        });
};


