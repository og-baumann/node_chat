const http = require('http');
const fs = require('fs');
const Api = require('./js/api');

const app = http.createServer().listen(8080);

const render_page = (res) => {
    fs.createReadStream('./index.html', (err, data) => {
        if(err) throw err;
        res.writeHead(200, {'Content-Type' : 'text/html'});
    }).pipe(res);
}

const render_json = (obj) => {
    obj.res.setHeader('Content-Type', 'application/json');
    obj.res.write(obj.data);
    obj.res.end();
}

const render_error = (obj) => {
    console.log(obj);
    obj.res.setHeader('Content-Type', 'application/json');
    obj.res.write(obj.data);
    obj.res.end();
}

app.on('request', (req, res) => {
    switch(req.url) {
        case '/' : render_page(res); break;
        case '/send' : Api.get_post(req, res).then(Api.write_db).then(render_json).catch(render_error); break;
        case '/recieve' : Api.get_post(req, res).then(Api.read_db).then(render_json).catch(render_error); break;
        default : 
            res.statusCode = 404;
            res.end();
    }
});

