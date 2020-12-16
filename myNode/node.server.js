var http = require('http');

http.createServer(function(request,response){ 
    response.end("Hello Node <- response.end");
    console.log("서버 실행중")
}).listen(8088 , function(){

    // /response.end("Server is Stared");

    console.log("서버 시작")
})