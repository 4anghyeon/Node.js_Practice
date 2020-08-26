// 모듈을 추출합니다.
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

// 데이터베이스와 연결합니다.
var client = mysql.createConnection({
    user: 'root',
    password: '1234',
    database: 'Company'
});

// 웹 서버를 생성합니다.
var app = express();
app.use(express.static('public')); //public폴더 등록
app.use(bodyParser.urlencoded({
    extended: false
}));
// app.use(app.router);

//상품 목록
app.get('/products', function (request, response) {
    // 데이터베이스 요청을 수행합니다.
    client.query('SELECT * FROM products', function (error, data) {
        response.send(data);
    });
});

app.get('/products/:id', function (request, response) {
    // 변수를 선언합니다.
    var id = Number(request.params.id);

    // 데이터베이스 요청을 수행합니다.
    client.query('SELECT * FROM products WHERE id=?', [
        id
    ], function (error, data) {
        response.send(data);
    })
});

app.post('/products', function (request, response) {
    // 변수를 선언합니다.
    var body = request.body;

    // 데이터베이스 요청을 수행합니다.
    client.query('INSERT INTO products (name, modelnumber, series) VALUES(?,?,?)', [
        body.name, body.modelnumber, body.series
    ], function (error, data) {
        response.send(data);
    });
});

app.delete('/products/:id', function (request, response) {
    // 변수를 선언합니다.
    var id = Number(request.params.id);
    console.log("id는"+id);

    // 데이터베이스 요청을 수행합니다.
    client.query('DELETE FROM products WHERE id=?', [
        id
    ], function (error, data) {
        if(error){
            console.log(error);
        }
        response.send(data);
    });
});

app.put('/products/:id', function (request, response) {
    // 변수를 선언합니다.
    // var id = Number(request.params.id);
    // var name = request.params.name;
    // var modelnumber = request.params.modelnumber;
    // var series = request.params.series;
    var query = 'UPDATE products SET '
    var body = request.body;

    // 쿼리를 생성합니다.
    if (body.name) query += 'name="' + body.name + '", ';
    if (body.modelnumber) query += 'modelnumber="' + body.modelnumber + '", ';
    if (body.series) query += 'series="' + body.series + '" ';
    query += 'where id='+body.id;

    // 데이터베이스 요청을 수행합니다.
    console.log(query);
    client.query(query, function (error, data) {
        response.send(data);
    });
});

//서버 실행
app.listen(52273, function () {
    console.log('Server Running at http://127.0.0.1:52273');
});