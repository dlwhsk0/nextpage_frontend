/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  images: {
    domains: [
      'nextpage-bucket.s3.ap-northeast-2.amazonaws.com',
      'oaidalleapiprodscus.blob.core.windows.net',
      'bucketnextpage.s3.ap-northeast-2.amazonaws.com',
    ],
    loader: 'default',

    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'nextpage-bucket.s3.ap-northeast-2.amazonaws.com',
    //     port: '',
    //     pathname: '/image/**',
    //   },
    // ],
  },
  async rewrites() {
    return [
      {
        source: '/:path*', // 들어오는 요청 경로 패턴
        destination: 'http://localhost:8080/:path*', // 라우팅하려는 경로
      },
      {
        source: '/scenario/[rootId]',
        destination: '/scenario?rootId=:rootId',
      },
    ]
  },
  // trailingSlash: true,
}

https: module.exports = nextConfig
