const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONG0_URL)
    .then(() => console.log('Connection established'))
    .catch((err) => console.log('Connection Failed'))
