const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // Указываем, что режим сборки - разработка
    mode: 'development',

    // Определяем точку входа в приложение
    entry: './src/index.js', // Путь к вашему основному файлу JavaScript

    // Определяем куда складывать результат сборки
    output: {
        filename: 'bundle2.js', // Название выходного файла
        path: path.resolve(__dirname, 'dist'), // Папка, куда будет складываться результат
    },

    // Плагины, которые мы используем
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack App', // Название вашего приложения
            template: 'public/index.html', // Путь к вашему шаблону HTML
        }),
    ],

    module: {
        rules: [
            {
                test: /\.js$/, // Правило для файлов .js
                exclude: /node_modules|src\/engine/, // Исключаем node_modules и папку some-excluded-folder
                use: {
                    loader: 'babel-loader',
                    // Дополнительные опции для загрузчика
                },
            },
            {
                test: /\.(png|jpe?g|gif|woff2|woff)$/i,
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            },
            // Остальные правила
        ],
    },


    // Настройки сервера разработки
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 3050,
    },
};
