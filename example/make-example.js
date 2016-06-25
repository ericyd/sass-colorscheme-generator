var hogan = require('hogan.js');
var fs = require('fs');
var path = require('path');
var open = require('open');
var sass = require('node-sass');

// set seed color
if (process.argv[2]) {
    var re = /(?:.*'seed'\:)(.*)(?=,)/;
    var settings = fs.readFileSync(path.join(__dirname, 'defaults.scss')).toString();
    settings = settings.replace(settings.match(re)[1], process.argv[2]);
    fs.writeFileSync(path.join(__dirname, 'defaults.scss'), settings);
}

// compile sass
sass.render({
    file: path.join(__dirname, 'example.scss')
}, function(err, result) {
    if (err) throw err;
    fs.writeFile(path.join(__dirname, 'example.css'), result.css.toString(), function(err) {if (err) throw err;});
});

// fill arrays with values for hogan template
var schemes = ['mono', 'complementary', 'triad', 'tetrad', 'analogic'];
schemes.forEach(function(value, index, arr) {arr[index] = {'scheme': value};});

var variants = ['--lightest', '--lighter', '', '--darker', '--darkest'];
variants.forEach(function(value, index, arr) {arr[index] = {'variant': value};});

var colors = ['primary', 'complementary', 'secondary-a', 'secondary-b'];
colors.forEach(function(value, index, arr) {arr[index] = {'color': value};});

var variations = ['pastel', 'soft', 'light', 'hard', 'pale', 'none'];
variations.forEach(function(value, index, arr) {arr[index] = {'variation': value};});

var index;

// compile hogan template and open index.html
fs.readFile(path.join(__dirname, 'templates', 'index.hogan'), function(err, data) {
    if (err) throw err;
    // write rendered result to index.html
    fs.writeFile(path.join(__dirname, 'index.html'),
                hogan.compile(data.toString()).render({
                    'schemes': schemes, 
                    'variation': 'none', 
                    'colors': colors, 
                    'variants': variants,
                    }),
                function(err) {if (err) throw err});
    
    // open index.html in browser
    open(path.join(__dirname, 'index.html'));
});