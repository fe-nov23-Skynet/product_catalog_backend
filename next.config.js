/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Установите заголовки CORS для маршрутов API
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Разрешить запросы от любого источника
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE', // Разрешенные методы
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Authorization,Content-Type', // Разрешенные заголовки
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true', // Разрешить отправлять куки
          },
        ],
      },
    ];
  },
};