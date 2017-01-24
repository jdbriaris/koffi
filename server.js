var express = require('express');
var server = express();

var path = process.argv[2];
if (path === undefined) {
    throw {
        name: 'Server Error',
        message: 'server requires path to index.html'
    }
}

server.use('', express.static(__dirname + path));
server.get('/*', function (req, res) {
    res.sendFile('index.html', { root: __dirname + path});
});

var port = process.env.PORT || 8080;
server.listen(port, function () {
    console.log('Development server listening on port ' + port);
});
