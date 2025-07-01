const express = require('express');
const connectDB = require('./db');
const articleRoutes = require('./routes/articles');
const { processTrends } = require('./services/contentBot');
const cron = require('node-cron');

const app = express();
connectDB();

app.use(express.json());
app.use('/api/articles', articleRoutes);

//Run content bot every 4 hours
cron.schedule('0 */4 * * *', async () => {
    console.log('Running content generation task...');
    processTrends();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
