const config = {
    production: 'https://api.trusona.net',
    uat: 'https://api.staging.trusona.net'
  }

class Environment{

    static getEnvironment(env){    
          return config[env] || config.production
    }
}

module.exports = Environment