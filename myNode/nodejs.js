window.addEventListener("load", onPageLoaded, false);

 function onPageLoaded(){
 
    
     var socket = io.connect("http://127.0.0.1:8088");

     socket.on("getusername",function(name){
         alert("내이름은"+name);
     });
 }