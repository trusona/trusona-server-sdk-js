const dateFormat = require('dateformat');

class DateUtils{
    getDate() {
        var now = new Date();
        return dateFormat(now, "GMT, dd MMM YYYY  HH:mm:ss Z");
      }
}

module.exports = DateUtils