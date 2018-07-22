import express from 'express'; 


var request = require('request');

var dateFormat = require('dateformat');


// const app = express();
// app.get('/', (req, res) => {
//     res.send('Hello JD')
// });
// app.listen(4000, () => {
//   console.log('Listening');
// });

 
var options = {
  url: 'https://api.staging.trusona.net/api/v2/user_devices',
  method: 'POST',
  body: {
      'id': '',
      'userIdentifier': '',
      'deviceIdentifier': '',
      'active' : false,
  },
  headers: {
    'User-Agent': 'TrusonaServerSdk/1.0',
    'Date' : getDate(),
    'Authorization' : getSignature()
  }
};
 

function getSignature(){
  const expectedSignature = "YTgwNDgzNGRjNTA0YjBkYWJmNmFlMzU0MjJiNmRmYTRjNjk5NTQxMDk3MGFkN2YzZjlmZTYyMjdlMTlkNjc4Zg=="
    const secret = "7f1dd753b6fa473d07c99b56d43bd5da3cd928487d5022e1810fab96c70945b01ad2603585542d33a1383b1f14b5880373474ff40c76a38df19052cefeb3a3eb"

    const signatureGenerator = new HmacSignatureGenerator();
    const hmacMessage = new MockHmacMessage();

    return signatureGenerator.getSignature(hmacMessage, secret);
}

function getDate(){
  var now = new Date();
  return dateFormat(now, "GMT, dd MMM YYYY  HH:mm:ss Z");
}

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    console.log(info.stargazers_count + " Stars");
    console.log(info.forks_count + " Forks");
  }
}
 
request.post(options, callback);