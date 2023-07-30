const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect DB
connectDB();

//Init MIddleware
app.use(express.json({ extended: false }));
app.get('/', (req, res) => res.send('API Running'));

// Define Routers

app.use('/api/auth', require('./routers/api/auth'));
app.use('/api/posts', require('./routers/api/posts'));
app.use('/api/profile', require('./routers/api/profile'));
app.use('/api/users', require('./routers/api/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
