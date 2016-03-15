module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/slack_overflow'
  },

  production: {
    client: 'pg',
    connection: 'postgres://canftibofebrtp:lIViDJkzfDUWPdkL4jIW5cnDms@ec2-54-83-56-177.compute-1.amazonaws.com:5432/d9baposi4fo3eo?ssl=true'
  }
};
