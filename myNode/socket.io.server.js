var http = require("http");
var fs = require('fs');   //File System 함수를 node js에 가져오는 방법은 require('fs'); 이다. 출처: https://dydals5678.tistory.com/96 [아빠개발자의 노트]
//var socketio = require("socket.io");  ==> 이와같이하면 socketio 모듈을 직접 핸들하게 되고, 에러가 발생한다. 아래에 var socketio = require("socket.io")(server); 로 변경

//노드 웹서버 실행
var server = http.createServer(
    function(request, response){

        var url = "/nodejs.html";

        //response.end('<b>Hello NodeJs WebServer</b>&nbsp;<button onclick="location.href=./nodejs.html">Click</button>');
        response.end(fs.readFileSync(__dirname + url));   //첫패이지 라우팅
    }
); 

//노드 서버 실행
server.listen(9892, function(){
    console.log('NodeJS Server Start port:9892'); 
}) 

//socketio모듈을 인스턴스화 하여 핸들해야한다
var socketio = require("socket.io")(server); //참조url: https://stackoverflow.com/questions/41623528/io-on-is-not-a-function

socketio.on("connection", function(socket)
{
    console.log('Socket Client Connected 크크크')
})

 