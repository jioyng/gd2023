window.addEventListener("load", noPageLoaded, false);

function onPageLoaded(){
    var socket = io.connection("http://127.0.0.1:8088");
}