module.exports = {
  apps: [
    {
      name: 'pintarlabs-store-backend',
      script: './server/src/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        JWT_SECRET: 'pintarlabs_secret_key_2026_super_secure'
      }
    }
  ]
};
