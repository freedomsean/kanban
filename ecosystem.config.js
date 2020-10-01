module.exports = {
  apps: [
    {
      name: 'server',
      script: './dist/app.js',
      autorestart: true,
      watch: false,
      instances: 0
    }
  ]
};