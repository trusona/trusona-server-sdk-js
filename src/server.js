import express from 'express'; 

const app = express();
app.get('/', (req, res) => {
    res.send('Hello JD')
});
app.listen(4000, () => {
  console.log('Listening');
});