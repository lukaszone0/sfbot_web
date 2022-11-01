const path = require('path')


module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, 'src/js/index.js'),
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'app.js',
        clean: true,
    }
    
}