const app = require('express')();
require('dotenv/config');

const PORT = process.env.PORT || 3101;

require('./db/connect');

app.get('/', (req, res) => {
    res.send({
        "soon tm": true
    });
});

app.use('/api/v1', require('./routes/info'));

app.listen(PORT, () => {
    console.log(`\n> App Running on port: ${PORT}.\n`);
});