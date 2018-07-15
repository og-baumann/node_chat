const mysql = require('mysql');

const Api = function Api () {}

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'chat'
});

connection.connect((err, data)=>{
    if(err) {
        console.log('Error connecting to DB!');
        throw err;
    } else {
        console.log('Connected to DB.'); 
    }
});

Api.prototype.get_post = (req, res) => {
    let body = '', obj = {res : res, data : null};

    return new Promise((resolve, reject) => {
        req.on('data', (d) => {
            if(body.length >= 1e6) {
                obj.data = JSON.stringify({'Status' : 'Error. POST body too large.'});
                reject(obj);
            } else {
                body += d;
            } 
        });
        req.on('end', () => {
            obj.data = JSON.parse(body);
            resolve(obj);
        });
    });
}

Api.prototype.write_db = (obj) => {
    return new Promise ((resolve, reject) => {
        connection.query('INSERT INTO messages (Name, Message) VALUES (?,?)', [obj.data.name, obj.data.message] ,(err, data) => {
            if(err) {
                obj.data = JSON.stringify({'Status' : 'Error. Problem writing to db.'})
                reject(obj);
            } else {
                obj.data = JSON.stringify({'Status' : 'Success.'});
                resolve(obj);
            }
        });
    });
}

Api.prototype.read_db = (obj) => {
    return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM messages where ID > ?', [obj.data.ID], (err, data) => {
            if(err) {
                obj.data = JSON.stringify({'Status' : 'Error. Problem reading db.'});
                reject(obj);
            } else {
                obj.data = JSON.stringify(data);
                resolve(obj);
            }
        });
    });    
}

module.exports = new Api;