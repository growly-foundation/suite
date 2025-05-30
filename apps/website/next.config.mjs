import withTM from 'next-transpile-modules';

// const workspaceDependencies = ['@getgrowly/ui', '@getgrowly/suite'];
const workspaceDependencies = [];

/** @type {import('next').NextConfig} */
const nextConfig = withTM(workspaceDependencies)({
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // webpack: (config) => {
  //   // This fixes the CSS loader issue
  //   config.module.rules.push({
  //     test: /\.css$/,
  //     use: ['style-loader', 'css-loader', 'postcss-loader'],
  //   });
  //   return config;
  // },
});

export default nextConfig;
