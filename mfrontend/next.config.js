module.exports = {
    // todo: выключил - на требует установить sharp, а на сервере он почему-то не устанавливается
    // todo: ⚠ For production Image Optimization with Next.js, the optional 'sharp' package is strongly recommended. Run 'npm i sharp', and Next.js will use it automatically for Image Optimization.
    // output: 'standalone',
    webpack: (config) => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        };

        config.module.rules.push({
            test: /\.(graphql|gql)/,
            exclude: /node_modules/,
            loader: "graphql-tag/loader"
        });

        return config;
    },
}
