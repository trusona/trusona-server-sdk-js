class ApiCredentials{

  constructor(token, secret) {
    this.token = token
    this.secret = secret
  }

  getToken(){
    return this.token
  }

  getSecret(){
    return this.secret
  }

  getParsedToken() {
    var parsedToken = null
    var parts = this.token.split('.')

    if (parts.length == 3) {
        var part = parts[1]
        var data = this.addPadding(part);
        
        data = this.replace(data, "_", "/")
        data = this.replace(data, "-", "+")
        
        var decodedData = Buffer.from(data, 'base64')
        parsedToken = JSON.parse(decodedData)
    }else{
        console.log("Invalid token")
    }
    return parsedToken
  }
  
  addPadding(s) {
    var missing = s.length % 4;
    var ret = s;
    for (var i = 0; i < missing; i++) { 
      ret = ret + "="
    }
    return ret
  }

  replace(target, search, replacement) {
    return target.replace(new RegExp(search, 'g'), replacement)
  }
}
module.exports = ApiCredentials