/////////////////////////////게임용 캔버스 관련 설정///////////////////////////////////////////
// var GAME_STATE_READY = 0; // 준비
// var GAME_STATE_GAME = 1;  // 게임 중
// var GAME_STATE_OVER = 2;  // 게임 오버

// 게임 상태값을 저장하는 변수
//var GameState = GAME_STATE_READY; // 초깃값은 준비 상태

//게임 진행시 필요한 이벤트 선언
window.addEventListener("load",drawScreen, false);
window.addEventListener("keydown",onkeyDown, false);
window.addEventListener("keyup",onkeyUp, false);

//제일 처음 페이지 load 여부
var ls_first_load_yn = "Y";

//필요한 이벤트 객체 선언
var strKeyEventType = "None";
var strKeyEventValue = "None";

//게임 캠퍼스
var theCanvas = document.getElementById("GameCanvas");

//전체 화면 크기에 맞추기(화면 가로/세로)
var ls_width = window.innerWidth;
var ls_height = window.innerHeight;	        	//터치 드래그시 상단 주소창 숨기기위해 높이값 더줌.
// var ls_width = document.innerWidth;
// var ls_height = document.innerHeight;	        	//터치 드래그시 상단 주소창 숨기기위해 높이값 더줌.

var docV = document.documentElement;

//윈도우 리사이징 호출
window.addEventListener("resize",  fit_resize);

//게임 로드시 켐퍼스 리사이징 조정
fitToContainer(theCanvas);

//게임 진행 컨텍스트(게임 오브젝트(플레이어 및 적) 진행  + 컨트롤 + 스코어)
var Context = theCanvas.getContext("2d");
//게임 상태 컨텍스트(게임 상태 표시 : 시작, 진행, 멈춤, 종료 메세지)
var Context2 = theCanvas.getContext("2d");
//게임배경 컨텍스트(게임 배경(우주 및 콜로니))
var Context3 = theCanvas.getContext("2d");

//게임 화면 경계
var minX = theCanvas.offsetLeft;
var maxX = theCanvas.clientWidth - minX;
var minY = theCanvas.offsetTop;
var maxY = theCanvas.clientHeight - minY;


/////////////////////////////////////////게임 컨트롤 관련 설정//////////////////////////////////////////
//캔버스 엘리먼트로 게임 컨트롤 버튼 변경 => 둠객체사용시 화면 확대 축소됨 에 따른 불편 생김(기존 조종 컨트롤 돔객체는 hidden 처리)
//키입력 저장 array
var isKeyDown = [];
var isKeyCode = null;

var directonUp = null;
var directonDown = null;
var directonLeft = null;
var directonRight = null;
var directonUpLeft = null;
var directonUpRight = null;
var directonDownLeft = null;
var directonDownRight = null;
var directonMiddle = null;

var button01 = null;
var button02 = null;

directonUp = new Path2D();
directonUp.fillStyle = "rgb(242, 255, 0)";
directonUp.rect(minX + 120, maxY - 330, 100, 140);

directonLeft = new Path2D();
directonLeft.fillStyle = "rgb(242, 255, 0)";
directonLeft.rect(minX + 10, maxY - 220, 140, 100);

directonRight = new Path2D();
directonRight.fillStyle = "rgb(242, 255, 0)";
directonRight.rect(minX + 190, maxY - 220, 140, 100);

directonDown = new Path2D();
directonDown.fillStyle = "rgb(242, 255, 0)";
directonDown.rect(minX + 120, maxY - 150, 100, 140);

directonUpLeft = new Path2D();
directonUpLeft.fillStyle = "rgb(242, 255, 0)";
directonUpLeft.rect(minX + 40, maxY - 300, 80, 80);

directonUpRight = new Path2D();
directonUpRight.fillStyle = "rgb(242, 255, 0)";
directonUpRight.rect(minX + 220, maxY - 300, 80, 80);

directonDownLeft = new Path2D();
directonDownLeft.fillStyle = "rgb(242, 255, 0)";
directonDownLeft.rect(minX + 40, maxY - 120, 80, 80);

directonDownRight = new Path2D();
directonDownRight.fillStyle = "rgb(242, 255, 0)";
directonDownRight.rect(minX + 220, maxY - 120, 80, 80);

directonMiddle = new Path2D();
directonMiddle.fillStyle = "rgb(242, 255, 0)";
directonMiddle.arc(minX + 170, maxY - 170, 18, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)

button01 = new Path2D();
button01.fillStyle = "rgb(242, 255, 0)";
//button01.arc(maxX - 250, maxY - 180, 80, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)
button01.arc(maxX - 250, maxY - 180, 100, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)

button02 = new Path2D();
button02.fillStyle = "rgb(242, 255, 0)";
//button02.arc(maxX - 80, maxY - 180, 80, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)
button02.arc(maxX - 80, maxY - 180, 70, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)

/////////////////////////////////////////게임 관련 상태 설정 시작////////////////////////////////////////
//초기 게임 상태
var init_status = 1;  //1:Start,   2:ing,  3:Pause
//기본 게임 프래임
var ini_gameFrame = 60;  //60프레임
//진행시간(=거리)
var init_gameTime = 0;
var gameTime = 0;
//화면 타이머 id
var init_Timer_Id = 0;  //var Timer_Id = setInterval(drawScreen, 1000/gameFrame); <= 재일 처음 시작시에는 움지기지 않는다.
var Timer_Id = 0;
//게임 배경의 진행 시점(목적지)
var init_cityEnd_size = 100;       //게임 진행 방향 타겟 사이즈
var init_cityEnd_x = 0;            //게임 진행 방향 타겟 x좌표
var init_cityEnd_y = 0;            //게임 진행 방향 타겟 y좌표
var init_Pdistance = 0;            //게임 진행 방향 타겟에서 플레이어까지 거리(플레이어 원근 설정을 위해)
var init_Edistance = 0;            //게임 진행 방향 타켓에서 적까지의 거리

//게임 계속 or 종료 버튼
var button_play = null;
button_play = new Path2D();
button_play.fillStyle = "rgb(242, 255, 0)";
button_play.rect(ls_width/2 - 300, ls_height/2 - 250 , 300, 150);
var button_end = null;
button_end = new Path2D();
button_end.fillStyle = "rgb(242, 255, 0)";
button_end.rect(ls_width/2 + 10, ls_height/2 - 250 , 300, 150);

//초기설정 게임 변수에 저장
var gameFrame = ini_gameFrame;
var cityEnd_size = init_cityEnd_size;
var cityEnd_x = init_cityEnd_x;
var cityEnd_y = init_cityEnd_y;
var Pdistance = init_Pdistance;
var Edistance = init_Edistance;

//좌우측 상하단선 백그라운드 거리
var back_distance = 0;
var back_distance2 = 0;

///////////////////////////////////배경 초기 설정//////////////////////////////////////////////////////////
//무공간(투명)이미지
var noneImage = new Image();
noneImage.src = "./img/none.png";
noneImage.addEventListener("load",drawScreen, false);

//게임 배경(우주) 이미지
var backgroundImage = new Image();
backgroundImage.src = "./img/background01.png";
backgroundImage.addEventListener("load",drawScreen, false);

//게임 배경(도로) 이미지
var cityImage = new Image();
cityImage.src = "./img/city01.png";
cityImage.addEventListener("load",drawScreen, false);

var city01Image = new Image();
city01Image.src = "./img/city01.png";
city01Image.addEventListener("load",drawScreen, false);

var city02Image = new Image();
city02Image.src = "./img/city02.png";
city02Image.addEventListener("load",drawScreen, false);

var city03Image = new Image();
city03Image.src = "./img/city03.png";
city03Image.addEventListener("load",drawScreen, false);

var cityEndImage = new Image();
cityEndImage.src = "./img/cityEnd.png";
cityEndImage.addEventListener("load",drawScreen, false);

//땅
var groundImage = new Image();
groundImage.src = "./img/ground.png";
groundImage.addEventListener("load",drawScreen, false);

//강
var riverImage = new Image();
riverImage.src = "./img/river.png";
riverImage.addEventListener("load",drawScreen, false);

///////////////////////////////////플레이어 초기 설정///////////////////////////////////////////////////////
var playerImage = new Image();
playerImage.src = "./img/player.png";
//playerImage.src = "player29.png";
playerImage.addEventListener("load",drawScreen, false);

var player = new Image();
player.src = "./img/player.png";
//playerImage.src = "player29.png";
player.addEventListener("load",drawScreen, false);

var player_90 = new Image();
player_90.src = "./img/player_90.png";
player_90.addEventListener("load",drawScreen, false);

var player_135 = new Image();
player_135.src = "./img/player_135.png";
player_135.addEventListener("load",drawScreen, false);

var player_180 = new Image();
player_180.src = "./img/player_180.png";
player_180.addEventListener("load",drawScreen, false);

var player_270 = new Image();
player_270.src = "./img/player_270.png";
player_270.addEventListener("load",drawScreen, false);

var player_360 = new Image();
player_360.src = "./img/player_360.png";
player_360.addEventListener("load",drawScreen, false);

var player_45 = new Image();
player_45.src = "./img/player_45.png";
player_45.addEventListener("load",drawScreen, false);

var player_warp = new Image();
player_warp.src = "./img/player_warp.png";
player_warp.addEventListener("load",drawScreen, false);

//폭파이미지01
var explosionImage01 = new Image();
explosionImage01.src = "./img/explosion01.png";
explosionImage01.addEventListener("load",drawScreen, false);

//엔진이미지01
var enginImage01 = new Image();
enginImage01.src = "./img/engin01.png";
enginImage01.addEventListener("load",drawScreen, false);

//이전 플레이어 진행방향 키값 => 속도변경시 방향키 새로 안눌러두 이전 방향으로 계속해서 진행되도록 하기위해 필요
var wayBefore = 'None;'

//플레이어 초기값( 크기, 위치 및 기본 이동거리, 스피트)
//var ini_player_width = 70;
//var ini_player_height = 45;
var ini_player_width = 130;
var ini_player_height = 200;
//var ini_player_width = 160;   //319
//var ini_player_height = 250;  //503
var ini_playerX = (theCanvas.clientWidth - ini_player_width)/ 2 - theCanvas.offsetLeft; //X좌표
var ini_playerY = theCanvas.clientHeight - 100;  //Y좌표
var ini_player_size = 100;    //플레이어 초기 크기 배율

//플레이어크기
var playerWidth = ini_player_width;
var playerHeight = ini_player_height;
var player_size = ini_player_size;

//플레이어 시작 위치
var playerX = ini_playerX;
var playerY = ini_playerY;

//플레이어 이동 거리
var pmovex = 0;
var pmovey = 0;
var ini_Pspeed = 1;         //플레이어 초기 스피드
var Pspeed = ini_Pspeed;
var before_pspeed = 0;      //이전 스피트(스트드 업버튼 누르면 바로 속도 증가하도록 하기위해)
var ini_player_life = 5;    //플레이어 생명
var player_life = ini_player_life;
var penerge_bar = ini_energe_bar;

//플레이어 공간이동(warp) 거리
var ini_warp_distance = 15;
var warp_distance = ini_warp_distance;

//플레이어 미사일 충돌 여부
var player_collision_yn = 'N';

/////////////////////////////////////////플레이어 레이져 초기 설정///////////////////////////////////////////
var laserImage = new Image();
laserImage.src = "./img/laser01.png";
laserImage.addEventListener("load",drawScreen, false);

//레이져 초기 생성 위치
var laserX = playerX + playerWidth/2;
var laserY = playerY;

//레이져 초기 이동위치 = 생성위치
var lmovex;
var lmovey;

//레이져 초기 크기
var l_size = 1;

//레이져 초기 속도
var lspeed = 1;

//레이져 발사 여부
var laser_yn = 'N';

//레이져 각도
var laser_r = 0;
var laser_d = 0;

///////////////////////////////////적 초기 설정////////////////////////////////////////////////////////////////
//적02 이미지
var enemy02Image = new Image();
enemy02Image.src = "./img/enemy02.png";
enemy02Image.addEventListener("load",drawScreen, false);

//적02 건 이미지
var enemy02GunImage = new Image();
enemy02GunImage.src = "./img/missile01.png";
enemy02GunImage.addEventListener("load",drawScreen, false);

//적02 엔진 이미지
var enginImage01 = new Image();
enginImage01.src = "./img/engin01.png";
enginImage01.addEventListener("load",drawScreen, false);

//적02 크기
var enemy02_size = 1;
//적02 스피드
var enemy02_speed = 1; 

//적02 초기 위치
var ini_enemy02x = parseInt(theCanvas.clientWidth / 2  + cityEnd_x) + Math.floor(Math.random() * 10); //시작  x
var ini_enemy02y = parseInt(theCanvas.clientHeight / 4) + Math.floor(Math.random() * 10); //시작 y
//적02 이동위치
var enemy02xx = 0;
var enemy02yy = 0;

//적02 크기
// var ini_enemy02w = 40;
// var ini_enemy02h = 55;
// var ini_enemy02w = 20;
// var ini_enemy02h = 25;
var ini_enemy02w = 40;
var ini_enemy02h = 55;
var enemy02w = ini_enemy02w;
var enemy02h = ini_enemy02h;

//적02 생명
var ini_enemy02_life = 5;
var enemy02_life = ini_enemy02_life;
var ini_energe_bar = ''  // '■□';   //에너지 바
var energe_bar = ''  // '■□';   //에너지 바

//적02 미시일 이미지 및 로드
var missile01Image = new Image();
missile01Image.src = "./img/missile01.png";
missile01Image.addEventListener("load",drawScreen, false);

//적02 미시일 초기 생성 위치
var missile01X = theCanvas.clientWidth / 2  - cityEnd_size/2 + cityEnd_x;
var missile01Y = theCanvas.clientHeight / 5 + cityEnd_size/5;
//적02 미시일 초기 이동위치 = 생성위치
var move_missile01X = missile01X;
var move_missile01Y = missile01Y;
//적02 미시일 초기 크기
var missile01_size = 1;
//적02 미시일 초기 속도
var missile01_speed = 1;
//적02 미시일 초기 방향값
var missile01_Randon = 0;   //적02 미사일 방향값은 랜덤하게
//적02 새로 출몰 간격
var enemy_dealy_time = 1000;

//화면에 나타나는 적02 미시일수(배열)
var missile01Array = new Array();
var missile_index = 0;     //현재 미사일 인덱스
var missile01_cnt = 1;
var ini_max_missile01_cnt = 5;
var max_missile01_cnt = ini_max_missile01_cnt;
var enemy02_collision_yn = "N";

//적02 순번
var enemy02_index = null; 

//적02 폭파중 여부
var enemy02_collision_yn = 'N';

//적02 객체 인스턴스 생성
//적02 초기 출현 갯수
var enemy02_cnt = 1;
var enemy02_array = [];
 
create_enemy02();

//적02 미사일 방향 설정 초기 변수
var missile01_upDown = 1;
var missile01_leftRight = 1;
var missile01_tmp_random = Math.floor(Math.random() * 7)/10;    //플레이어 위치에 따른 미사일 Y축 이동 좌표

// ////////////////// 윈도우 os의 경우 둠 터치버튼 숨기기
// if (navigator.platform.substr(0,3) != "Win" ){

//     //$("#TopCtl").hide();
//     $("#MainCtl").hide();
//     //$("#MainCtl2").hide();

//     $("#startCtl").hide();
//     //$(".directCtl").hide();
//     $("#attackCtl").hide();

// }

////////////////// 게임 화면 터치 버튼 매핑 시작
function addJavascript(jsname) {

	var th = document.getElementsByTagName('head')[0];
	var s = document.createElement('script');

	s.setAttribute('type','text/javascript');
	s.setAttribute('src',jsname);
	th.appendChild(s);

}

////////////////// 게임 시작
function gameStart(as_keycode) {

    ls_first_load_yn = "N";
    //alert("start")
    isKeyDown[as_keycode] = false;

    audio.play();
    audio.currentTime  = 0;

    clearInterval(Timer_Id);

    //게임 변수 초기화
    game_init();

    //플레이어 변수 초기화
    player_init(); 

    //적 생성
    create_enemy02(); 

    status = 2;         //진행

    Timer_Id = setInterval(drawScreen, 1000/gameFrame);   //게임 프레임(gameFrame은  초기 ini_gameFram 설정값)

}


////////////////// 게임 종료
function gameEnd(as_keycode) {
 
    if (as_keycode == 13){

        gameStart(13);

    }else {

        audio.pause();
        //onReady();

        $("#GameCanvas").fadeOut( "slow", function() {

            //window.location = 'end.html';
            location.replace("end.html");

        });

    }
}

////////////////// 화면버튼 이벤트발생시 키코드와  맵핑
function moveDirection(as_keycode) {

isKeyCode = as_keycode;
isKeyDown[as_keycode] = true;

}

////////////////// 화면버튼 이벤트발생 종료시 키코드와  맵핑 제거
function moveDirection2(as_keycode) {

isKeyCode = null;
isKeyDown = [];
isKeyDown[as_keycode] = false;

}

////////////////// 화면 리사이징(캠퍼스 재조정)
function fit_resize(theCanvas){

ls_height = window.innerHeight + 30;      //터치 드래그시 상단 주소창 숨기기위해 높이값 더줌.

window.scrollTo(0,1);

//세로모드 일경우 가로모드로 전환유도 메세지 보여줌.
if (window.matchMedia('(orientation: portrait)').matches) {

    document.getElementById('tot_div').style.visibility = 'hidden';
    document.getElementById('tot_hidden').style.display = 'block';

} else {

    document.getElementById('tot_div').style.visibility = 'visible';
    document.getElementById('tot_hidden').style.display = 'none';

}

////////////////// 게임 캠퍼스 재조정
fitToContainer(theCanvas);
}

////////////////// 게임 캠퍼스 재조정(화면 꽉차게)
function fitToContainer(canvas){

//브라우져 사이즈에 맞게 캠퍼스 확장
$("#tot_div").width(ls_width);
$("#tot_div").height(ls_height);
$("#can_div").width(ls_width);
$("#can_div").height(ls_height);
$("#game_div").width(ls_width);
$("#game_div").height(ls_height);
$("#GameCanvas").width(ls_width);
$("#GameCanvas").height(ls_height );

canvas.style.width='100%';
canvas.style.clientHeight='100%';
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

}

////////////////// 게임 변수 초기화
function game_init(){

    status = init_status;
    gameFrame = ini_gameFrame;
    gameTime = init_gameTime;
    Timer_Id = init_Timer_Id;
    cityEnd_size = init_cityEnd_size;
    cityEnd_x = init_cityEnd_x;
    cityEnd_y = init_cityEnd_y;
    enemy02_size = enemy02_size;
    enemy02_speed = enemy02_speed;

    //enemy02x = parseInt(theCanvas.clientWidth / 2); //시작  x
    //enemy02y = parseInt(theCanvas.clientHeight / 4); //시작 y

    enemy02x = ini_enemy02x;
    enemy02y = ini_enemy02y;

    enemy02xx = enemy02xx;
    enemy02yy = enemy02yy;

    enemy02_life = ini_enemy02_life;

    isKeyCode = null;
    isKeyDown = [];
	strKeyEventValue = "None";
    missile01Array = [];
    missile01_cnt = 1;
    ini_max_missile01_cnt = 5;
    max_missile01_cnt = ini_max_missile01_cnt;
    warp_distance = ini_warp_distance;

    back_distance = 0;
    back_distance2 = 0;
    back_distance3 = 0;
 
    //배경종점으로부터의 플레이어 거리
    Pdistance = init_Pdistance;

    //배경종점으로부터의 적 거리
    Edistance = init_Edistance; 

    //적02 크기
    enemy02w = ini_enemy02w;
    enemy02h = ini_enemy02w;

    //적02 초기 위치
    //enemy02x = parseInt(theCanvas.clientWidth / 2  + cityEnd_x) + (Math.floor(Math.random() * 100))  + (Math.floor(Math.random() * 300)) - (Math.floor(Math.random() * 300)); //시작  x
    //enemy02y = parseInt(theCanvas.clientHeight / 4) + (Math.floor(Math.random() * 300)) - (Math.floor(Math.random() * 300)); //시작 y

    //적02 생명
    ini_enemy02_life = 5;
    enemy02_life = ini_enemy02_life;
    ini_energe_bar = ''  // '■□';   //에너지 바
    energe_bar = ''  // '■□';   //에너지 바 

    //적02 미시일 초기 생성 위치
    missile01X = theCanvas.clientWidth / 2  - cityEnd_size/2 + cityEnd_x;
    missile01Y = theCanvas.clientHeight / 5 + cityEnd_size/5;
    //적02 미시일 초기 이동위치 = 생성위치
    move_missile01X = missile01X;
    move_missile01Y = missile01Y;
    //적02 미시일 초기 크기
    missile01_size = 1;
    //적02 미시일 초기 속도
    missile01_speed = 1;
    //적02 미시일 초기 방향값
    missile01_Randon = 0;   //적02 미사일 방향값은 랜덤하게

    missile01_upDown = 1;
    missile01_leftRight = 1;
    missile01_tmp_random = Math.floor(Math.random() * 7)/10;    //플레이어 위치에 따른 미사일 Y축 좌표

    enemy_dealy_time = 1000;

    //화면에 나타나는 적02 미시일수(배열)
    //missile01Array = [];
    missile01_cnt = 1;
    ini_max_missile01_cnt = 5;
    max_missile01_cnt = ini_max_missile01_cnt;
    enemy02_collision_yn = "N";
    enemy02_index = null;

}

////////////////// 플레이어 변수 초기화
function player_init(){

    //이전 플레이어 진행방향 키값 => 속도변경시 방향키 새로 안눌러두 이전 방향으로 계속해서 진행되도록 하기위해 필요
    wayBefore = 'None;'
    playerWidth = ini_player_width;
    playerHeight = ini_player_height;
    player_size = ini_player_size;
    playerX = ini_playerX;
    playerY = ini_playerY;
    pmovex = 0;
    pmovey = 0;
    Pspeed = ini_Pspeed;
    before_pspeed = 0;
    player_life = ini_player_life;
    playerImage = player;

}

////////////////// 플레이어 경계 이탈 방지
function player_border(){

    ////플레이어 켐퍼스 배경 이탈방지 => 키다운 이벤트에서 선언하면 경계를 빠져나가는 경향이 있어서 스크린 로드에 선언///////
    if (playerX + playerWidth >= maxX){
        playerX = maxX - playerWidth - 1;  //1 은 반동
        pmovex = 0;
    };
    if (playerX <= minX){
        playerX = minX + 1;
        pmovex = 0;
    };
    if (playerY + playerHeight >= maxY ){
        playerY = maxY  - playerHeight - 1;
        pmovey = 0;
    };
    if (playerY <= minY){
        playerY = minY  + 1;
        pmovey = 0;
    };
}

////////////////// 플레이어 거리
function player_didtance(){

    //게임방향타겟(배경 중심점)으로부터의 거리
    Pdistance = Math.sqrt(Math.pow(Math.abs(parseInt(((theCanvas.clientWidth / 2  + cityEnd_x) - playerX))),2) + Math.pow(Math.abs(parseInt(theCanvas.clientHeight / 4 - playerY)),2));

}

////////////////// 적02 거리
function enemy02_didtance(){

    //게임방향타겟(배경 중심점)으로부터의 거리
    this.Edistance = Math.sqrt(Math.pow(Math.abs(parseInt(((theCanvas.clientWidth / 2  + cityEnd_x) - this.enemy02x))),2) + Math.pow(Math.abs(parseInt(theCanvas.clientHeight / 4 - this.enemy02y)),2));

}

////////////////// 플레이어 이동
function player_move(){

    //방향이동(키이벤트보다는 프레임에 설정하는게 더 부드러움.)
    //좌
    if (strKeyEventValue == "ArrowLeft"  || isKeyCode == 37){
        //--pmovex;
        wayBefore = 'L';
        pmovex = pmovex - 0.1 * Pspeed / 2;
        playerImage = player_180;

    }

	//우
    if (strKeyEventValue == "ArrowRight"  || isKeyCode == 39){
        //++pmovex;
        wayBefore = 'R';
        pmovex = pmovex + 0.1 * Pspeed / 2;
        playerImage = player_360;
    }

	//상
    if (strKeyEventValue == "ArrowUp"   || isKeyCode == 38){
        wayBefore = 'U';
        pmovey = pmovey - 0.1 * Pspeed / 2;
        playerImage = player_90;
    }

	//하
    if (strKeyEventValue == "ArrowDown"   || isKeyCode == 40){
        wayBefore = 'D';
        pmovey = pmovey + 0.1 * Pspeed / 2;
        playerImage = player_270;
    }

	//대각선방향 => 상하좌우키 동시 누른것과 같음.
	//좌상
	if (isKeyDown[103] || isKeyCode == 36 ) {
        wayBefore = 'LU';
		pmovex = pmovex - 0.1 * Pspeed/2;
        pmovey = pmovey - 0.1 * Pspeed/2;
        playerImage = player_135;
	}

	//우상
	if (isKeyDown[105] || isKeyCode == 33  ) {
        wayBefore = 'RU';
		pmovex = pmovex + 0.1 * Pspeed/2;
        pmovey = pmovey - 0.1 * Pspeed/2;
        playerImage = player_45;
	}

	//좌하
	if (isKeyDown[97] || isKeyCode == 35 ) {
        wayBefore = 'LD';
		pmovex = pmovex - 0.1 * Pspeed/2;
        pmovey = pmovey + 0.1 * Pspeed/2;
        //playerImage = player;
        playerImage = player_135;
	}

	//우하
	if (isKeyDown[99] || isKeyCode == 34 ) {
        wayBefore = 'RD';
		pmovex = pmovex + 0.1 * Pspeed/2;
        pmovey = pmovey + 0.1 * Pspeed/2;
        //playerImage = player;
        playerImage = player_45;
	}

	//와프(공간 이동)
	if (isKeyDown[17] || isKeyCode == 17) {

        warp_sound.currentTime  = 0;
        warp_sound.play();

        //와프 이미지로 변경
        for (var i=0;i<=warp_distance;i++){

            //공간이동 이미지
            Context.drawImage(player_warp,playerX,playerY,playerWidth + Math.floor(Math.random() * 2),playerHeight + Math.floor(Math.random() * 3))

            //warp_sound.play();   //공간이동시 사운드

            if (wayBefore == "U"){
                playerY = playerY - i;
            }if (wayBefore == "D"){
                playerY = playerY + i;
            }else if (wayBefore == "R"){
                playerX = playerX + i;
            }else if(wayBefore == "L"){
                playerX = playerX - i;
            }else if (wayBefore == "LU"){
                playerX = playerX - i;
                playerY = playerY - i;
            }else if (wayBefore == "RU"){
                playerX = playerX + i;
                playerY = playerY - i;
            }else if(wayBefore == "LD"){
                playerX = playerX - i;
                playerY = playerY + i;
            }else if (wayBefore == "RD"){
                playerX = playerX + i;
                playerY = playerY + i;
            }else {
                //playerY = playerY - i /2;
                playerX = playerX;
                playerY = playerY;
            }

            //playerY = playerY - i;
        }

        isKeyDown = [];
        isKeyCode = null;
        //wayBefore = null;
        //pmovex = 0;
        //pmovey = 0;

	}

    //레이저
	if (isKeyDown[32] || isKeyCode == 32 ) {

        //게임상태가 진행중이 않은(종료 또틑 멈춤) 경우 레이저버튼 클릭시 재시작
		if (status != 2)
		{
            gameStart(13);
		}

        //레이져 변수 초기화
        laser_init();
        laser_yn = 'Y';
        laser_move();
		laser_sound.currentTime  = 0;
        laser_sound.play();
	}

    //브래이크
    if(isKeyCode == 16 || isKeyCode == 12){
        pmovex = 0;
        pmovey = 0;
        playerImage = player;
    }

    //이동좌표에 따른 플레이어 사이즈 조정
    playerX = playerX + pmovex;
    playerY = playerY + pmovey;

    playerWidth = ini_player_width * player_size/100000*Pdistance*0.8
    playerHeight = ini_player_height * player_size/100000*Pdistance*0.8

    //멀리 가도 플레이어 최소크기는 유지
    if (parseInt(playerWidth) <= parseInt(ini_player_width/3)){
        playerWidth = parseInt(ini_player_width/3);
    }
    if (parseInt(playerHeight) <= parseInt(ini_player_height/3)){
        playerHeight = parseInt(ini_player_height/3);
    }

    Context.drawImage(playerImage,playerX,playerY,playerWidth + Math.floor(Math.random() * 2),playerHeight + Math.floor(Math.random() * 3));

    //엔진 부스터 방향
    //전진,좌상,우상
    if (strKeyEventValue == "ArrowUp" || isKeyCode == 38 || isKeyDown[103] || isKeyCode == 36 || isKeyDown[105] || isKeyCode == 33){
        engin01_sound.currentTime  = 2;
        engin01_sound.play();   //엔진 점화 사운드
        Context.drawImage(enginImage01,playerX + playerWidth/2,playerY + playerHeight/30,playerWidth/5 + Math.floor(Math.random() * 3),playerHeight/4 + Math.floor(Math.random() * 4));
        Context.drawImage(enginImage01,playerX + playerWidth/3,playerY + playerHeight/30,playerWidth/5 + Math.floor(Math.random() * 3),playerHeight/4 + Math.floor(Math.random() * 4));
        Context.drawImage(enginImage01,playerX + playerWidth/2,playerY + playerHeight/15,playerWidth/5 + Math.floor(Math.random() * 5),playerHeight/4 + Math.floor(Math.random() * 3));
        Context.drawImage(enginImage01,playerX + playerWidth/3,playerY + playerHeight/15,playerWidth/5 + Math.floor(Math.random() * 6),playerHeight/4 + Math.floor(Math.random() * 5));
    }
    //좌
    if (strKeyEventValue == "ArrowLeft"  || isKeyCode == 37){
        //engin01_sound.currentTime  = 1;
        //engin01_sound.play();
        Context.drawImage(enginImage01,playerX  + playerWidth/9,playerY + playerHeight/8,playerWidth/3 + Math.floor(Math.random() * 3),playerHeight/7 + Math.floor(Math.random() * 2));
        Context.drawImage(enginImage01,playerX + playerWidth/5,playerY + playerHeight/10,playerWidth/2 + Math.floor(Math.random() * 4),playerHeight/8 + Math.floor(Math.random() * 3));
        Context.drawImage(enginImage01,playerX  + playerWidth/8,playerY + playerHeight/6,playerWidth/3 + Math.floor(Math.random() * 3),playerHeight/7 + Math.floor(Math.random() * 2));
        Context.drawImage(enginImage01,playerX + playerWidth/4,playerY + playerHeight/6,playerWidth/2 + Math.floor(Math.random() * 4),playerHeight/8 + Math.floor(Math.random() * 3));
    }
	//우
    if (strKeyEventValue == "ArrowRight"  || isKeyCode == 39){
        //engin01_sound.currentTime  = 1;
        //engin01_sound.play();
        Context.drawImage(enginImage01,playerX  + playerWidth/1.9,playerY + playerHeight/8,playerWidth/3 + Math.floor(Math.random() * 3),playerHeight/7 + Math.floor(Math.random() * 2));
        Context.drawImage(enginImage01,playerX + playerWidth/4,playerY + playerHeight/10,playerWidth/2 + Math.floor(Math.random() * 4),playerHeight/8 + Math.floor(Math.random() * 3));
        Context.drawImage(enginImage01,playerX  + playerWidth/2,playerY + playerHeight/6,playerWidth/3 + Math.floor(Math.random() * 3),playerHeight/7 + Math.floor(Math.random() * 2));
        Context.drawImage(enginImage01,playerX + playerWidth/4,playerY + playerHeight/6,playerWidth/2 + Math.floor(Math.random() * 4),playerHeight/8 + Math.floor(Math.random() * 3));

    }
	// //하
    // if (strKeyEventValue == "ArrowDown"   || isKeyCode == 40){
    //     //engin01_sound.currentTime  = 1;
    //     engin01_sound.play();
    // }
    //플레이어 에너지 표시
    //enemy_energe(player_life);
    player_energe();
    Context.fillText(penerge_bar,playerX,playerY - 10);

}

////////////////// 플레이어 레이져 초기화
function laser_init(){
    laserX = playerX + playerWidth/2;
    laserY = playerY;
    //레이져 초기 이동위치 = 생성위치
    lmovex = laserX;
    lmovey = laserY - 5;
    //레이져 초기 크기
    l_size = 1;
    //레이져 초기 속도
    lspeed = 1;
    //레이져 발사 여부
    laser_yn = 'N';
}

////////////////// 플레이어 레이져 경로
function laser_move(){

    if (laser_yn == 'Y'){

        //ld = Math.floor(Pdistance/10);

        for (i=0;i<=150;i++){

            //플레이어 거리에 따른 레이져 크기 변경
            l_size = 1;
            l_size = l_size*(Pdistance/300);

            /*
            //플레이어 위치에 따른 미사일 방향 변경
            //타켓이 플레이어보다 상단에 있으면 미사일은 상단으로
            if (playerY >= ty + th/2 + theCanvas.clientHeight / 20){
                //l_size = 30;

                //playerImage.src = "player.png";
                playerImage = player;
                //lmovey = lmovey - 1;

            //타켓이 플레이어보다 하단에 있으면 미사일은 상단으로
            }
            if (playerY < ty - th/2 - theCanvas.clientHeight / 15){
                //playerImage.src = "player_180.png";
                playerImage = player_180;
                //l_size = 30;
                //lmovey = lmovey + 1;

            //타켓이 플레이어 우측
            }
            if(playerX >= tx  + tw/2  + theCanvas.clientWidth / 3)
            {
                //playerImage.src = "player_90.png";
                playerImage = player_90;
                //l_size = 5;
                //lmovex = lmovex - 1.5;
            //타켓이 플레이어 좌측
            }
            if (playerX < tx - tw/2 - theCanvas.clientWidth / 3){
                //l_size = 5;


                //playerImage.src = "player_360.png";
                playerImage = player_360;
                //lmovex = lmovex + 1.5;
            }
			*/

            //레이저 버튼 각도에 따라 방향 전환
            //lmovex = lmovex + 1; //(코사인 * 루트(x제곱 + y제곱)
            //lmovey = lmovey + 1; //(사인 * 루트(x제곱 + y제곱)
            //lmovex = 100;
            //lmovey = 100;

            //레이저 버튼 누른 각도의 위치를 라디안값으로 변환한다.
            lmovex = lmovex + Math.cos(laser_d * Math.PI / 180); //(코사인 * 루트(x제곱 + y제곱)
            lmovey = lmovey + Math.sin(laser_d * Math.PI / 180) * - 1; //(사인 * 루트(x제곱 + y제곱)

            Context.drawImage(laserImage,lmovex,lmovey,2,l_size); 
        }
    }
}

////////////////// 적02 객체 생성
////////////////// 적02 1th
function create_enemy02(index){
 
    //this.enemy02_index = index;
    //적02의 인덱스가 없는경우 전체 새로 생성.
    if (index == null || index == ""  || index == undefined){
        //alert("1")
        for (var i=0;i<=enemy02_cnt;i++){

            enemy02_array[i] = new enemy02_init(i);
            //enemy02.enemy02_index = i;
            enemy02_array[i].missile01_create();
            enemy02_array[i].missile01_init();
        }
    //인덱스가 기존에 있는거나 추가된경우 해당 인덱스건에 대하여만 새로 생성.
    }else {
 
        enemy02_array[index] = new enemy02_init(index);
        //enemy02.enemy02_index = i;
        enemy02_array[index].missile01_create();
        enemy02_array[index].missile01_init();

    }
    
 } 

////////////////// 적02 초기화
function enemy02_init(index){

    //객체내에서 사용되는 모든 참조객체(변수,이미지,배열,함수등을 모두 생성자 함수에 넣어준다.)
    //참조 개체내에서의 this.propoerty는 해당 생성자함수(클래스)의 현재실행객체의 property를 가리킨다.
    //참조 객체체 외에서의 propoerty는 생성자(클래스)명.property 식으로 가져온다.
    this.enemy02_array = enemy02_array;
    this.create_enemy02 = create_enemy02;
    //this.create_enemy02 = create_enemy02;
    //this.create_enemy03 = create_enemy03;

    this.enemy02Image = new Image();
    this.enemy02Image = enemy02Image;
    this.enemy02Image.src = "./img/enemy02.png";

    this.enemy02GunImage = new Image();
    this.enemy02GunImage = enemy02GunImage;
    this.enemy02GunImage.src = "./img/missile01.png";

    this.enginImage01 = new Image();
    this.enginImage01 = enginImage01;
    this.enginImage01.src = "./img/engin01.png";

    this.noneImage = new Image();
    this.noneImage = noneImage;
    this.noneImage.src = "./img/none.png";

    //폭파이미지01
    this.explosionImage01 = new Image();
    this.explosionImage01 = explosionImage01;
    this.explosionImage01.src = "./img/explosion01.png";


    //적02 미시일 이미지 및 로드
    this.missile01Image = new Image();
    this.missile01Image = missile01Image;
    this.missile01Image.src = "./img/missile01.png";

    //적02 미사일 이동 간격
    this.missile01_upDown = missile01_upDown;
    this.missile01_leftRight = missile01_leftRight;
    this.missile01_tmp_random = missile01_tmp_random;


    //적02 레이져 폭파중 여부
    this.enemy02_collision_yn = 'N';

    //적02 출현 지연시간
    this.enemy_dealy_time = enemy_dealy_time;

    //적02 초기 위치
    //this.enemy02x = parseInt(theCanvas.clientWidth / 2  + cityEnd_x) + (Math.floor(Math.random() * 10))  + (Math.floor(Math.random() * 30)) - (Math.floor(Math.random() * 300)); //시작  x
    //this.enemy02y = parseInt(theCanvas.clientHeight / 4) + (Math.floor(Math.random() * 100)) - (Math.floor(Math.random() * 100)); //시작 y
    this.enemy02x = ini_enemy02x  + (Math.floor(Math.random() * 100)) - (Math.floor(Math.random() * 100));
    this.enemy02y = ini_enemy02y  + (Math.floor(Math.random() * 50)) - (Math.floor(Math.random() * 50));

    
    //적02 초기 크기
    this.enemy02w = ini_enemy02w + Math.floor(Math.random() * 3);
    this.enemy02h = ini_enemy02h + Math.floor(Math.random() * 4);
    //ld = 0;

    //적02 크기(배율)
    this.enemy02_size =  Math.floor(Math.random() * 3);
    //적02 스피드
    this.enemy02_speed =  Math.floor(Math.random() * 3);
    //적02 x축 이동 위치
    this.enemy02xx = Math.floor(Math.random() * 2);
    //적02 x축 이동 위치
    this.enemy02yy = Math.floor(Math.random() * 2);

    //적02 생명
    this.enemy02_life = ini_enemy02_life;
    this.energe_bar = ini_energe_bar;
    this.enemy_energe = enemy_energe;
    this.enemy02_move = enemy02_move;


    //타겟에서 적까지 거리
    this.Edistance = Edistance;    


    //적02 미사일 발사수는 랜덤하게
    this.missile01_cnt = Math.floor(Math.random() * 5) + 1;
    this.max_missile01_cnt = max_missile01_cnt;

    //적02 미사일 발사 시작 위치
    this.missile01X = this.enemy02x;
    this.missile01Y = this.enemy02y;

    this.missile01Array = missile01Array;
    //this.missile01Array  = [];

    //적02 미사일 객체(배열) 생성
    this.missile01_create = missile01_create;
    //this.missile01_create(); 
    
    this.missile01_size = missile01_size;

    this.missile01_speed = missile01_speed;

    this.missile01_Randon = missile01_Randon;

    //적02 미사일 객체(배열) 초기화
    this.missile01_init = missile01_init;
    //this.missile01_init();

    this.missile01_move = missile01_move;
    this.missile_index = missile_index;
    //missile01_move();

    //적02 
    this.enemy02_index = index;

    //적02 충돌
    this.enemy02_collision = enemy02_collision;

    //플레이어 레이져
    this.laser_move = laser_move;

    //플레이어 충돌
    this.player_collision = player_collision; 

    //배경종점에서 적까지 거리
    this.enemy02_didtance = enemy02_didtance;


 
}

////////////////// 적02 폭파(레이져 충돌)
function enemy02_collision(){ 

    //적02 위치
    //this.enemy02x = this.missile01X;
    //this.enemy02y = this.missile01Y; 
    
    //적02 크기
    this.enemy02w = ini_enemy02w;
    this.enemy02h = ini_enemy02h;

    //레이져 크기
    l_size = 1;
    l_size = 100;  //사이즈가 1이면 적이 잘 않맞는다. 
 
    //적02 레이져 폭파중 여부
    if (this.enemy02_collision_yn == 'Y') return;                  //적이 폭파되고 새로출현할깨까지 않보이는경우 수행하지 않는다.

    //레이져와 적 X좌표 충돌시
    if (parseInt(lmovex) <= (parseInt(this.enemy02x) + parseInt(this.enemy02w)) && ((parseInt(lmovex) + parseInt(l_size)) >= parseInt(this.enemy02x))){
        
        //레이져와 적 Y좌표 충돌시
        if ((parseInt(lmovey) <= (parseInt(this.enemy02y)  + parseInt(this.enemy02h)) ) && ((parseInt(lmovey)  + parseInt(l_size)) >= parseInt(this.enemy02y)   )){
          
             //충돌시 carsh 효과 이미지로
             Context.drawImage(this.explosionImage01,this.enemy02x-Math.floor(Math.random()*20),this.enemy02y+Math.floor(Math.random()*20),20,10);
             Context.drawImage(this.explosionImage01,this.enemy02x+Math.floor(Math.random()*20),this.enemy02y+Math.floor(Math.random()*10),10,10);
             Context.drawImage(this.explosionImage01,this.enemy02x+Math.floor(Math.random()*20),this.enemy02y-Math.floor(Math.random()*30),20,10);
             crash01_sound.currentTime = 0;
             crash01_sound.play(); 
             
             laser_init();

             //적 파괴되면 새로운 타겟 등장
             if (this.enemy02_life == 1){

                //타겟 새로 생성
                //enemy02_init();
                explosion_sound.play();
                explosion_sound.currentTime  = 0;
                this.missile01Array = [];
                this.energe_bar = '';

                //콜로니 밖 우주 배경그려주기(투명도 적용)
                Context.save();

                Context.globalAlpha = 0.8;

                Context.drawImage(backgroundImage,0, 0 ,theCanvas.clientWidth + Math.floor(Math.random() * 3) ,theCanvas.clientHeight);
                //적이 강할수록 i를 높게한다.(i = 점수)
                for (var i=0;i<=ini_enemy02_life*10*(this.enemy02h/20);i++){

                    Context.drawImage(this.explosionImage01,this.enemy02x-Math.floor(Math.random()*30),this.enemy02y+Math.floor(Math.random()*40),100 - i,100 - i);
                    Context.drawImage(this.explosionImage01,this.enemy02x+Math.floor(Math.random()*60),this.enemy02y+Math.floor(Math.random()*50),20 - i,20 - i);
                    Context.drawImage(this.explosionImage01,this.enemy02x-Math.floor(Math.random()*30),this.enemy02y+Math.floor(Math.random()*40),100 - i,100 - i);
                    Context.drawImage(this.explosionImage01,this.enemy02x+Math.floor(Math.random()*60),this.enemy02y+Math.floor(Math.random()*50),20 + i,20 + i);

                    //Context.fillText("Score : " + gameTime,theCanvas.clientWidth - 250,50);

                }

                //적의 생명 * 10 만큼 보너스 스코어
                Context.font = '100px Arial';
                Context.fillText( " + " + ini_enemy02_life * 10,this.enemy02x,this.enemy02y-10);
                //alert(this.enemy02x + "," +  this.enemy02y)
                gameTime = parseInt(gameTime) + ini_enemy02_life*10;

                //타겟 새로 출현 시간.
                this.enemy_dealy_time = parseInt((Math.floor(Math.random()*5) + 1)) * 1000;

                Context.restore(); 

                //폭파되면 새로 출현할때까지 이미지 않보이게
                this.enemy02Image = this.noneImage;
                this.enemy02GunImage = this.noneImage;
                this.enginImage01 = this.noneImage;
  
                //적02 레이져 폭파중 여부
                this.enemy02_collision_yn = 'Y';
                
                //폭파후 적02 출현
                setTimeout(this.create_enemy02,this.enemy_dealy_time,this.enemy02_index);   //넘겨줄 인수는 지연시간 뒤에다가 넘겨준다.                 

             }

             //적 에너지 차감
             this.enemy02_life = this.enemy02_life - 1;
       
             //적 에너지를 다시 그려준다.
             this.enemy_energe();

        }
    }

}

////////////////// 플레이어 에너지 표시
function player_energe(){

    Context.font = '10px Arial';

    penerge_bar = '';

    for(var i = 1;i<=player_life;i++){
        penerge_bar += '■';
    }

    return penerge_bar;
}

////////////////// 적02 에너지 표시
function enemy_energe(){

    Context.font = '10px Arial';

    this.energe_bar = '';

    for (var i=1;i<=this.enemy02_life;i++){
        this.energe_bar += '■';
    }

    return this.energe_bar;
}

////////////////// 적02 이동
function enemy02_move(){  

    //적(enemy02) 왔다같다 이동
    if (parseInt(gameTime/(200*Pspeed)) % 5 == 0){
        this.enemy02x = this.enemy02x + this.enemy02xx;
        this.enemy02y = this.enemy02y + this.enemy02yy;

        //this.enemy02_size = this.enemy02_size + 0.01; 

    }else if (parseInt(gameTime/(200*Pspeed)) % 4 == 0){
        this.enemy02x = this.enemy02x - this.enemy02xx * this.enemy02_speed;
        this.enemy02y = this.enemy02y - this.enemy02yy * this.enemy02_speed;

        //this.enemy02_size = this.enemy02_size - 0.01; 

    }else if (parseInt(gameTime/(200*Pspeed)) % 5 == 0){
        this.enemy02x = this.enemy02x + this.enemy02xx;
        this.enemy02y = this.enemy02y + this.enemy02yy * this.enemy02_speed;


        //this.enemy02_size = this.enemy02_size + 0.01;

    }else if (parseInt(gameTime/(200*Pspeed)) % 6 == 0){
        this.enemy02x = this.enemy02x - this.enemy02xx * this.enemy02_speed;
        this.enemy02y = this.enemy02y - this.enemy02yy;  

        //this.enemy02_size = this.enemy02_size;

    }else if (parseInt(gameTime/(200*Pspeed)) % 1 == 0){

        this.enemy02x = this.enemy02x + this.enemy02xx;
        this.enemy02y = this.enemy02y - this.enemy02yy;
 
        //this.enemy02_size = this.enemy02_size - 0.01;

    }else {
        this.enemy02xx = 0;
        this.enemy02yy = 0; 

        this.enemy02x = cityEnd_x;
        this.enemy02y = cityEnd_y;

        //this.enemy02_size = this.enemy02_size + 0.01;
         
    }

    this.enemy02_didtance(); 
 
    this.Edistance = parseInt(this.Edistance)/100;
    console.log("this.Edistance",this.Edistance);

    this.enemy02_size = this.enemy02_size * this.Edistance * 0.5;
    //배경종점(목적지) 이동좌표에 따른 적 사이즈 조정 
    this.enemy02w = this.enemy02w * this.enemy02_size;
    this.enemy02h = this.enemy02h * this.enemy02_size; 

    //console.log(this.enemy02w,this.enemy02h)

    //적 크기 배율은 1 ~ 5를 넘지 못한다.
    if (this.enemy02_size >= 3){this.enemy02_size = 3};
    if (this.enemy02_size <= 1){this.enemy02_size = 1};

    //적 크기(적은 움직이면서 점점 커지거나 작아진다.)
    this.enemy02w = this.enemy02w * this.enemy02_size;
    this.enemy02h = this.enemy02h * this.enemy02_size;   

    //적이 게임 경게 밖으로 나가지 못하다록 한다.
    if (this.enemy02x > maxX - 30){
        this.enemy02xx = 0;
        this.enemy02x = this.enemy02x - Math.floor(Math.random() * 2); 
    }

    if (this.enemy02x < minX + 30){
        this.enemy02xx = 0;
        this.enemy02x = this.enemy02x + Math.floor(Math.random() * 2); 
    }    

    if (this.enemy02y > maxY - 30){        
        this.enemy02yy = 0;
        this.enemy02y = this.enemy02y + Math.floor(Math.random() * 2); 
    }

    if (this.enemy02y < minY + 30){        
        this.enemy02yy = 0;
        this.enemy02y = this.enemy02y + Math.floor(Math.random() * 2); 
    }    


    //적(enemy02)) 이미지     
    //적 미사일 초기 위치
    this.missile01X = this.enemy02x;
    this.missile01Y = this.enemy02y;

    //적02의 크기는 플레이어의 크기보다 커질수는 없다.
    if (this.enemy02w >= playerWidth * 0.8){
        this.enemy02w = playerWidth  * 0.8;
        this.enemy02h = playerHeight  * 0.8;
    }; 

    
    //적이 너무 작은경우(멀리있는경우) 오른쪽 엔진은 그려주지 않는다.(엔지하나가 몸체박으로 삐져나와 이상함.)
    if ( this.enemy02w >= ini_enemy02w*0.8){        
        Context.drawImage(this.enginImage01,this.enemy02x - this.enemy02w/4 + Math.floor(Math.random() * 6),this.enemy02y + this.enemy02h/8,Math.floor(Math.random() * 3) +  this.enemy02w/3,Math.floor(Math.random() * 4) +  this.enemy02h/3);    
    }
    if ( this.enemy02w >= ini_enemy02w*0.5){      
        Context.drawImage(this.enginImage01,this.enemy02x - 10 - this.enemy02w/4 - Math.floor(Math.random() * 8),this.enemy02y + this.enemy02h/8,Math.floor(Math.random() * 4) +  this.enemy02w/3,Math.floor(Math.random() * 4) +  this.enemy02h/3);  
    } 
    Context.drawImage(this.enemy02Image,this.enemy02x - 40, this.enemy02y ,this.enemy02w,this.enemy02h);
    //적이 너무 작은경우(멀리있는경우) 총은 그려주지 않는다.(총이 몸체박으로 삐져나와 이상함.)
    if ( this.enemy02w >= ini_enemy02w*0.5){          
        Context.drawImage(this.enemy02GunImage,this.enemy02x + this.enemy02w/30, this.enemy02y + this.enemy02h/10 ,Math.floor(Math.random() * 6) + this.enemy02w/40,Math.floor(Math.random() * 5 + this.enemy02w/40));
        Context.drawImage(this.enemy02GunImage,this.enemy02x + this.enemy02w/37, this.enemy02y + this.enemy02h/10 ,Math.floor(Math.random() * 6) + this.enemy02w/30,Math.floor(Math.random() * 5 + this.enemy02w/30));
    }

    //적 에너지 표시 
    this.enemy_energe();
     
    //Context.fillText(this.enemy02_index + this.energe_bar,this.enemy02x  - 40 + Math.floor(Math.random() * 3), this.enemy02y - 10);
    Context.fillText(this.energe_bar,this.enemy02x  - 40 + Math.floor(Math.random() * 3), this.enemy02y - 10);
 
    //적02 충돌 함수 => 충돌함수는 drawScreen()이 아닌 enemy02_move 안에서 호출한다.(this가 계속 따라가도록)
    this.enemy02_collision();
    
}

////////////////// 게임 배경 화면
function game_background(){

    //시간이 흐름에 따라 게임 타겟 방향 좌표 이동
    gameTime++;         //시간 증가
    back_distance = back_distance + Pspeed*5;    //백그라운드 라인이 밖으로 나가면 다시 초기화(플레이어 속도만큼 더 빨리 진행)

	//back_distance = back_distance + 0.1;

    if (back_distance >= 800){
        back_distance = 0;
    }

    if (parseInt(gameTime/800 % 9) == 0){
        cityEnd_x = cityEnd_x + 0.2;
        cityEnd_y = cityEnd_y + 0.1;
    }else if (parseInt(gameTime/500 % 9) == 1){
        cityEnd_x = cityEnd_x - 0.5;
        cityEnd_y = cityEnd_y - 0.2;
    }else if (parseInt(gameTime/500 % 9) == 2){
        cityEnd_x = cityEnd_x + 0.5;
        cityEnd_y = cityEnd_y + 0.3;
    }else if (parseInt(gameTime/500 % 9) == 3){
        cityEnd_x = cityEnd_x + 0.1
        cityEnd_y = cityEnd_y - 0.2
    }else if (parseInt(gameTime/500 % 9) == 4){
        cityEnd_x = cityEnd_x - 0.6;
        cityEnd_y = cityEnd_y - 0.4;
    }else if (parseInt(gameTime/500 % 9) == 5){
        cityEnd_x = cityEnd_x + 0.7;
        cityEnd_y = cityEnd_y + 0.4;
    }else if (parseInt(gameTime/500 % 9) == 6){
        cityEnd_x = cityEnd_x - 0.4;
        cityEnd_y = cityEnd_y - 0.2;
    }else if (parseInt(gameTime/500 % 9) == 7){
        cityEnd_x = cityEnd_x + 0.3;
        cityEnd_y = cityEnd_y + 0.3;
    }else if (parseInt(gameTime/500 % 9) == 8){
        cityEnd_x = cityEnd_x - 0.2;
        cityEnd_y = cityEnd_y - 0.1;
    }else {
        cityEnd_x = cityEnd_x + 0.1
        cityEnd_y = cityEnd_y + 0.2
    }

    Context.globalAlpha = 0.5;

    //콜로니 밖 우주 배경그려주기(투명도 적용)
    Context.save();

    if (parseInt(gameTime/(1000*Pspeed)) % 3 == 0){
        Context.globalAlpha = 0.4;
    }else if (parseInt(gameTime/(1000*Pspeed)) % 3 == 1){
        Context.globalAlpha = 0.3;
    }else {
        Context.globalAlpha = 0.2;
    }

    Context.drawImage(backgroundImage,0, 0 ,theCanvas.clientWidth + Math.floor(Math.random() * 3) ,theCanvas.clientHeight);

    //콜로니끝
    Context3.drawImage(cityEndImage,theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30 , theCanvas.clientHeight / 4 + cityEnd_y - 50 +  Math.floor(Math.random() * 3) ,  120 ,120 );

    Context.restore();

    //게임 배경 (벽)그려주기   =? 원근 효과
    //=> 게임방향목표좌표(전체화면넓이/2 + cityEnd_x, 전체화면 Y 높이/4)에서부터 시작하여 각 모서리 양끝으로 선을그려준다.(원근표현)
    Context3.globalAlpha = "0.4"

    //중앙상단선
    Context3.beginPath();
    //Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size/2 + cityEnd_x +  Math.floor(Math.random() * 5) , theCanvas.clientHeight / 4 - 100);
	Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30 + ((theCanvas.clientWidth / 2  + cityEnd_x + 30) - (theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30))/2 , theCanvas.clientHeight / 4 - 100 + cityEnd_y);
    Context3.lineTo(theCanvas.clientWidth / 2  +  Math.floor(Math.random() * 10), 0);
    Context3.strokeStyle = "#grey";; //선 색상
    Context3.stroke();

    //좌측상단선
    // Context3.beginPath();
    // Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30 , theCanvas.clientHeight / 4 - 80 + cityEnd_y);
    // Context3.lineTo(400, 0);
    // Context3.strokeStyle = "#grey";; //선 색상
    // Context3.stroke();

    for (var i=0;i<4;i++){
        Context3.beginPath();
        Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x , theCanvas.clientHeight / 4 - 80 + cityEnd_y);
        Context3.lineTo(400 - 30 * i, 0);
        Context3.strokeStyle = "#grey";; //선 색상
        Context3.stroke();
    }

    //좌중앙
    Context3.beginPath();
    Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 50 , theCanvas.clientHeight / 4 - 20 + cityEnd_y);
    Context3.lineTo(0, theCanvas.clientHeight/6   +  Math.floor(Math.random() * 10));
    //Context3.strokeStyle = "#f0f0f0";; //선 색상
    Context3.strokeStyle = "grey";; //선 색상
    Context3.stroke();

    //좌측하단선
    // Context3.beginPath();
    // Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30 , theCanvas.clientHeight / 4 + 50 + cityEnd_y);
    // Context3.lineTo(-300, theCanvas.clientHeight);
    // //Context3.strokeStyle = "#f0f0f0";; //선 색상
    // Context3.strokeStyle = "grey";; //선 색상
    // Context3.stroke();

    for (var i=0;i<4;i++){
        Context3.beginPath();
        Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x , theCanvas.clientHeight / 4 + 50 + cityEnd_y);
        Context3.lineTo(-300 -  i, theCanvas.clientHeight + 30 * i);
        //Context3.strokeStyle = "#f0f0f0";; //선 색상
        Context3.strokeStyle = "grey";; //선 색상
        Context3.stroke();
    }



    //우측상단선
    // Context3.beginPath();
    // Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x + 30, theCanvas.clientHeight / 4 - 80 + cityEnd_y);
    // Context3.lineTo(theCanvas.clientWidth - 400, 0 );
    // Context3.strokeStyle = "#grey";; //선 색상
    // Context3.stroke();

    for (var i=0;i<4;i++){
        Context3.beginPath();
        Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x, theCanvas.clientHeight / 4 - 80 + cityEnd_y);
        Context3.lineTo(theCanvas.clientWidth - 400 + 30 * i, 0);
        Context3.strokeStyle = "#grey";; //선 색상
        Context3.stroke();
    }

    //우중앙
    Context3.beginPath();
    Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x + 50, theCanvas.clientHeight / 4 - 20 + cityEnd_y);
    Context3.lineTo(theCanvas.clientWidth,  theCanvas.clientHeight / 4 - 50 +  Math.floor(Math.random() * 10));
    Context3.strokeStyle = "#grey";; //선 색상
    Context3.stroke(); 

    //우측하단선
    // Context3.beginPath();
    // Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x  + 30, theCanvas.clientHeight / 4  + 50 + cityEnd_y);   //타겟 시작 좌표
    // Context3.lineTo(theCanvas.clientWidth, theCanvas.clientHeight - 150);  //배경 선(타겟으로부터 화면우측하단끝)
    // Context3.strokeStyle = "#grey";; //선 색상
    // Context3.stroke();

    for (var i=0;i<4;i++){
        Context3.beginPath();
        Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x - 10, theCanvas.clientHeight / 4  + 50 + cityEnd_y);   //타겟 시작 좌표
        Context3.lineTo(theCanvas.clientWidth, theCanvas.clientHeight - i * 20 );  //배경 선(타겟으로부터 화면우측하단끝)
        Context3.strokeStyle = "#grey";; //선 색상
        Context3.stroke();
    }


    

    //루프를 많이 돌리수록 두께가 두꺼워지네
    //for (i=0;i<=100;i++){
		back_distance2 = back_distance2 + Pspeed*100;

		if (back_distance2 >= 1000){
				back_distance2 = 0;
        }
        
        if (parseInt(gameTime/2000) % 2 == 0){
            Context3.fillStyle = 'yellow'; // 채우기 색 지정
        }else {
            Context3.fillStyle = 'skyblue'; // 채우기 색 지정
        } 

        Context3.globalAlpha = "0.5"
        Context3.strokeStyle = "balck";

        //메인원1
        Context3.beginPath();
        //Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 - 10 , back_distance2, 0, Math.PI * 2);
        Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4   + cityEnd_y, 50 + back_distance, 0, Math.PI * 2);
        Context3.stroke();

        Context3.beginPath();
        //Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 - 10 , back_distance2, 0, Math.PI * 2);
        Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 + 5  + cityEnd_y, 55 + back_distance + Math.floor(Math.random() * 2) + 1, 0, Math.PI * 2);
        Context3.stroke();

        //메인원2
        Context3.beginPath();
        Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 + 5 , 80 +  back_distance2 + cityEnd_y, 0, Math.PI * 2);
        Context3.stroke();
 
        // Context3.beginPath();
        // Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 + Math.floor(Math.random() * 1) + 1 ,85 + back_distance2 + cityEnd_y, 0, Math.PI * 2);
        // Context3.stroke();
    //}

    //코로니 배경 건물
    //for (var i = 0; i < 1; i++){

        //삼각형(지면 안개)
        Context3.beginPath();
        Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 + 20 + cityEnd_y);
        Context3.lineTo(-200  , theCanvas.clientHeight);
        Context3.lineTo( theCanvas.clientWidth  , theCanvas.clientHeight);

        Context3.closePath();
        Context3.fillStyle="skyblack";
        Context3.globalAlpha = "0.08"
        Context3.fill();

        //console.log("t",parseInt(gameTime/200) % 3);

        if (parseInt(gameTime/1000) % 2 == 0){
            cityImage = city01Image;
        }else {
            cityImage = city02Image;
        }

        k = 0; //조명 간격

        for (var j = 0; j < 800; j++){

            var random01 = Math.floor(Math.random() * 2) + 1;
            var random02 = Math.floor(Math.random() * 5) + 1;
            var random03 = Math.floor(Math.random() * 10) + 1;
            var random04 = Math.floor(Math.random() * 15) + 1;
            var random05 = Math.floor(Math.random() * 20) + 1;
            var random06 = Math.floor(Math.random() * 30) + 1;

            Context3.fillStyle = 'fdf5e6'; // 채우기 색 지정
            Context3.globalAlpha = "0.5"
            Context3.strokeStyle = "balck";

            //건물 이미지
            Context3.globalAlpha = "0.2"
            if (parseInt(gameTime/(600-Pspeed*100)) % 3 == 0){
                Context3.drawImage(groundImage,theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,  20 + theCanvas.clientHeight / 4  + j + random05  + cityEnd_y, 1 * random01 + j*3 - (cityEnd_x/200*j) ,20 * random03)
            }else if(parseInt(gameTime/(600-Pspeed*100)) % 3 == 1){
                Context3.drawImage(riverImage,theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,  20 + theCanvas.clientHeight / 4  + j + random05  + cityEnd_y, 1 * random01 + j*3 - (cityEnd_x/200*j) ,20 * random03)
            }else {
                Context3.drawImage(city03Image,theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,  20 + theCanvas.clientHeight / 4  + j + random05 + cityEnd_y , 1 * random01 + j*3 - (cityEnd_x/200*j) ,20 * random03)
            }

            Context3.globalAlpha = "0.6"

            if (parseInt(gameTime/(800-Pspeed*100)) % 3 == 0){
                Context3.drawImage(cityImage,theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,  20 + theCanvas.clientHeight / 4  + j + random05 + cityEnd_y , 1 * random01 + j*3 - (cityEnd_x/200*j) ,20 * random03)
            }else if(parseInt(gameTime/(800-Pspeed*100)) % 2 == 0){
                Context3.drawImage(cityImage,theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j - 10,  20 + theCanvas.clientHeight / 3  + j + random05 + cityEnd_y , 1 * random01 + j*3 - (cityEnd_x/200*j) ,20 * random03)
            }else {
                Context3.drawImage(cityImage,theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.2 - 10,  20 + theCanvas.clientHeight / 3  + j + random01 + cityEnd_y , 1 * random01 + j*2 - (cityEnd_x/200*j) ,20 * random03)
            }

            //상단 선 및 좌우 측 벽 조명
            Context3.fillStyle = 'yellow'; // 채우기 색 지정
            Context3.globalAlpha = "0.01"
            Context3.strokeStyle = "balck";

            Context3.beginPath();
            Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 - 25  - Math.floor(Math.random() * 5)  + cityEnd_y, 40 - random01, 0, Math.PI * 2);
            Context3.stroke();

            Context3.fillStyle = 'black'; // 채우기 색 지정
            Context3.globalAlpha = "0.03"
            Context3.strokeStyle = "balck";

			Context3.beginPath();
			Context3.globalAlpha = "0.01"
			Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 + 2 - random05 + cityEnd_y , 100 - Math.floor(Math.random() * 5) , 0, Math.PI * 2);
			Context3.stroke();

			Context3.beginPath();
			Context3.globalAlpha = "0.03"
			Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 + 20 - random05 + cityEnd_y , 100 - Math.floor(Math.random() * 5) , 0, Math.PI * 2);
			Context3.stroke();

            k = k + 50;  //조명 간격
            //우측중단선 조명
            Context3.fillRect(theCanvas.clientWidth / 2  + cityEnd_x + k , theCanvas.clientHeight / 4 - 30 + cityEnd_y  , 5 + k/100 , 10  + k/20);

            //중앙 통로 끝
            Context3.fillRect(theCanvas.clientWidth / 2  - cityEnd_size/2 + cityEnd_x  - 40  , theCanvas.clientHeight / 4 - 50 + cityEnd_y  , 40 + k/20   , 60  );

            //좌측 중단 조명
            Context3.fillRect(theCanvas.clientWidth / 2  + cityEnd_x - k , theCanvas.clientHeight / 4 - 30 , 5 + k/100 + cityEnd_y , 5  + k/20);

            j = j + (10*random03);     //건물 상하 조밀도
        }
    //}

    //투명도 원상태로
    Context3.fillStyle = '#ffffff';
    Context3.globalAlpha = "1"
    Context3.strokeStyle = "ffffff";
}


////////////////// 게임 상태 표시
function game_status(){

    Context2.font = '30px Arial';
    Context2.font = '100px Arial';

    if (status == 1){
        Context2.fillText("Ready", (theCanvas.clientWidth - ini_player_width) / 2 - theCanvas.offsetLeft - 100, theCanvas.clientHeight / 2 - theCanvas.offsetTop);
        clearInterval(Timer_Id);
        return;
    }else if (status == 3){
        Context2.fillText("Pause", (theCanvas.clientWidth - ini_player_width) / 2 - theCanvas.offsetLeft - 100, theCanvas.clientHeight / 2 - theCanvas.offsetTop);
        clearInterval(Timer_Id);
        return;
    }else if (status == 4){
        Context2.fillText("Game Over", (theCanvas.clientWidth - ini_player_width) / 2 - theCanvas.offsetLeft - 200, theCanvas.clientHeight / 2 - theCanvas.offsetTop);
        clearInterval(Timer_Id);
        return;
    }

}

////////////////// 캔버스 컨트롤(게임 프래임 진행시 호출하여 생성)
function gameControl() {

    //윈도우의 경우 캔버스 컨트롤을 보여주지않는다.
	if (navigator.platform.substr(0,3) == "Win" ){
        return;
    }

    Context.globalAlpha = 0.5;

    Context.stroke(directonUp);
    Context.stroke(directonLeft);
    Context.stroke(directonRight);
    Context.stroke(directonDown);
    Context.stroke(directonUpLeft);
    Context.stroke(directonUpRight);
    Context.stroke(directonDownLeft);
    Context.stroke(directonDownRight);
    Context.stroke(directonMiddle);

    Context.stroke(button01);
    Context.stroke(button02); 

} 

//////////////////마우스 클릭시 이벤트 메핑
GameCanvas.addEventListener('mousedown', function(event) {

    //event.preventDefault();

    //모바일인경우 게임진행시에는 리턴
    //if (status == 2){
        if (navigator.platform.substr(0,3) != "Win" ){
            return;
        }
    //}

    //마우스 왼쪽 버튼 클릭
    if (event.button == 0){
        isKeyCode = 32;

        x = event.clientX;
        y = event.clientY;

        laser_radian(x,y);
    }

    //마우스 오른쪽 버튼 클릭
    if (event.button == 2){
        isKeyCode = 17;
    }

    //게인 진행중이 아닐때 마우스로 화면 클릭시 다시,종료 버튼 보여줌
    gameRetryExitButton();

  });

  GameCanvas.addEventListener('mouseup', function(event) {

    //event.preventDefault();

    //모바일인경우 게임진행시에는 리턴
    //if (status == 2){
        if (navigator.platform.substr(0,3) != "Win" ){
            return;
        }
    //}

    //마우스 왼쪽 버튼 클릭
    if (event.button == 0){
        isKeyCode = null;

        x = event.clientX;
        y = event.clientY;

        laser_radian(x,y);
    }

    //마우스 오른쪽 버튼 클릭
    if (event.button == 2){
        isKeyCode = null;
    }
  });


  GameCanvas.oncontextmenu = function () {
    return false;
  };

 ///////////////// 게임 재시도 or 나가기 버튼 보여주기
 function gameRetryExitButton(){
    if (status != 2)
    {
        //재일 처음 페이지 로드시에는 바로 시작
        if (ls_first_load_yn == "Y"){

            gameStart(13);

        }else {
            //gameEnd(27);
            //게임 재시도 or 나가기
            Context2.stroke(button_play);
            Context2.stroke(button_end);
            //Context2.fillRect(ls_width/2 - 250, ls_height/2 - 250 , 250, 150);
            Context2.fillText("Retry",ls_width/2 - 160, ls_height/2 - 140);
            Context2.fillText("Exit",ls_width/2 + 120, ls_height/2 - 140);

            isKeyDown = [];
            isKeyCode = null;

        }
    }
 }
////////////////// 돔(doom)의 이벤트에 매핑(전역 키코드를 변경하여 프래임 진행시 방향 전환)
function clickCanvas(event, as_gb) {

	//if (status != 2)
	//{
		//gameStart(13);
    //}

    //게인 진행중이 아닐때 마우스로 화면 클릭시 다시,종료 버튼 보여줌
    gameRetryExitButton();

	//as_gb 1: mouseClick, 2: onMouseMove
	var x = event.pageX;
	var y = event.pageY;

    //윈도우의 경우 캔버스 컨트롤을 사용하지 않는다.(게임 진행일때만) => 재시도/종료 버튼클릭 가능하기 위해
	if (navigator.platform.substr(0,3) == "Win" && status == 2){
        return;
    }

    //방향 up
	if(Context.isPointInPath(directonUp, x,  y)) {
		//wayBefore = 'U';
		//pmovey = pmovey - 0.1 * Pspeed/5;
		//strKeyEventValue = "ArrowUp";
		isKeyCode = 38;
        strKeyEventValue = "ArrowUp";
        wayBefore = 'U';
		Context.stroke(directonUp);    //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 down
	if(Context.isPointInPath(directonDown, x,  y)) {
		//wayBefore = 'D';
		//pmovey = pmovey + 0.1 * Pspeed/5;
		//strKeyEventValue = "ArrowDown";
		isKeyCode = 40;
        strKeyEventValue = "ArrowDown";
        wayBefore = 'D';
		Context.stroke(directonDown); //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 left
	if(Context.isPointInPath(directonLeft, x,  y)) {
		//wayBefore = 'L';
		//pmovex = pmovex - 0.1 * Pspeed/5;
		//strKeyEventValue = "ArrowLeft";
		isKeyCode = 37;
        strKeyEventValue = "ArrowLeft";
        wayBefore = 'L';
		Context.stroke(directonLeft);  //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 right
	if(Context.isPointInPath(directonRight, x,  y)) {
		//wayBefore = 'R';
		//pmovex = pmovex + 0.1 * Pspeed/5;
		//strKeyEventValue = "ArrowRight";
		isKeyCode = 39;
        strKeyEventValue = "ArrowRight";
        wayBefore = 'R';
		Context.stroke(directonRight);  //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 upLeft
	if(Context.isPointInPath(directonUpLeft, x,  y)) {
		isKeyCode = 36;
        wayBefore = 'LU';
		Context.stroke(directonUpLeft);    //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 UpRight
	if(Context.isPointInPath(directonUpRight, x,  y)) {
		isKeyCode = 33;
		strKeyEventValue = "RU";
		Context.stroke(directonUpRight);  //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
    }

    //방향 downLeft
	if(Context.isPointInPath(directonDownLeft, x,  y)) {
		isKeyCode = 35;
		strKeyEventValue = "LD";
		Context.stroke(directonDownLeft); //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 downRight
	if(Context.isPointInPath(directonDownRight, x,  y)) {
		isKeyCode = 34;
		strKeyEventValue = "RD";
		Context.stroke(directonDownRight);  //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 중앙 정지
	if(Context.isPointInPath(directonMiddle, x,  y)) {
		isKeyCode = "16";
        strKeyEventValue = "";
        pmovex = 0;
        pmovey = 0;
		Context.stroke(directonMiddle);  //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
    }


    //레이져 발사
	if(Context.isPointInPath(button01, x,  y)) {

		Context.stroke(button01);    //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
        //Context.fillText(Math.round(laser_r),maxX - 250, maxY - 180);
		Context.fillText("*",x, y);
		//Context.fillText((maxX - 250 - x) * -1 ,theCanvas.clientWidth - 250,100);
		//Context.fillText(maxY - 180 - y ,theCanvas.clientWidth - 250,150);

        // //레이저 버튼을 클릭한곳의 각도로 발사되도록 한다.
		// laser_r = Math.atan2((maxY - 180 - y),(maxX - 250 - x) * -1);

		// if (laser_r < 0)
		//  laser_r += Math.PI * 2;
		// laser_d = laser_r*180/Math.PI;
		// while (laser_d < 0)
        //  laser_d += 360;

        laser_radian(x,y);

        //alert("현재 좌표는 " + event.offsetX + "/" + event.offsetY)

		//레이져 변수 초기화
		laser_init();
		laser_yn = 'Y';
		laser_move();
		laser_sound.currentTime  = 0;
		laser_sound.play();

	}

    //warp(공간 이동)
	if(as_gb == 1 && Context.isPointInPath(button02, x,  y)) {

		Context.stroke(button02);   //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)

        warp_sound.currentTime  = 0;
        warp_sound.play();

		//isKeyCode = 17;
		//Warp 이미지로 변경
		for (var i=0;i<=warp_distance;i++){

			Context.drawImage(player_warp,playerX,playerY,playerWidth + Math.floor(Math.random() * 2),playerHeight + Math.floor(Math.random() * 3))

			//warp_sound.play();

			if (isKeyCode == 38 || wayBefore == "U"){
				playerY = playerY - i;
			}else if (isKeyCode == 40 || wayBefore == "D"){
				playerY = playerY + i;
			}else if (isKeyCode == 39 || wayBefore == "R"){
				playerX = playerX + i;
			}else if(isKeyCode == 37 || wayBefore == "L"){
				playerX = playerX - i;
            }else if (isKeyCode == 36 || wayBefore == "LU"){
                playerX = playerX - i;
                playerY = playerY - i;
            }else if (isKeyCode == 33 || wayBefore == "RU"){
                playerX = playerX + i;
                playerY = playerY - i;
            }else if(isKeyCode == 35 || wayBefore == "LD"){
                playerX = playerX - i;
                playerY = playerY + i;
            }else if (isKeyCode == 34 || wayBefore == "RD"){
                playerX = playerX + i;
                playerY = playerY + i;
            }else {
				playerX = playerX;
				playerY = playerY;
				wayBefore = "";
			}
            //playerY = playerY - i;
		}

		isKeyDown = [];
        isKeyCode = null;

    }


    if(status != 2){
        //게임 계속
        if(Context.isPointInPath(button_play, x,  y)) {
            isKeyCode = 13;
            //strKeyEventValue = "LD";
            Context.stroke(button_play); //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
            gameEnd(isKeyCode);
            isKeyDown = [];
            isKeyCode = null;
        }

        //게임 종료
        if(Context.isPointInPath(button_end, x,  y)) {
            isKeyCode = 27;
            //strKeyEventValue = "RD";
            Context.stroke(button_end);  //키 입력 반을체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
            gameEnd(isKeyCode);
            isKeyDown = [];
            isKeyCode = null;
        }
    }

}

////////////////// 플레이어 레이져 각도
function laser_radian(x,y){


        //윈도우에서는 플레이어 기준으로 마우스를 클릭한곳으로 레이져 발사

        if (navigator.platform.substr(0,3) == "Win" ){

            laser_r = Math.atan2((playerY - y),(playerX - x) * -1);

        //레이져 버튼내 중앙 기준 클릭한곳의 각도로 발사되도록 한다.
        }else {
		    laser_r = Math.atan2((maxY - 180 - y),(maxX - 250 - x) * -1);
        }


		if (laser_r < 0)
		 laser_r += Math.PI * 2;
		laser_d = laser_r*180/Math.PI;
		while (laser_d < 0)
         laser_d += 360;

}

////////////////// 적02 미사일 생성
function missile01_create(){
    //missile01Array = [];
    //console.log("this.missile01Array.length",this.missile01Array.length);
    if (this.missile01Array.length >= this.max_missile01_cnt){
        this.missile01Array = [];
    }
    //동시 나타나는  미사일수
    this.missile01Array.push({bx:this.missile01X, by:this.missile01Y, bmx:this.move_missile01X, bmy:this.move_missile01Y, bsize:this.missile01_size, bspeed:this.missile01_speed, bdirection:this.missile01_Randon});
     
}

////////////////// 적02 미사일 변수 초기화(미사일의 시작점 위치 지정)
function missile01_init(){

     //console.log("this.missile01Array[i]",this.missile01Array)
     this.missile01_size = 1;
     player_collision_yn = 'N';
     //missile01X = missile01X - 40;

    for(var i = 0; i < this.missile01Array.length; i++){

        this.missile01Array[i].bx = this.missile01X;
        this.missile01Array[i].by = this.missile01Y;
        this.missile01Array[i].bmx = this.missile01X;
        this.missile01Array[i].bmy = this.missile01Y;
        this.missile01Array[i].bsize = this.missile01_size;
        this.missile01Array[i].bspeed  = this.missile01_speed;                                      //속도는 랜덤하게 1 ~ 3

        if (Math.floor(Math.random() * 2) == 0){
            this.missile01Array[i].bdirection =   Math.floor(Math.random() * 10) * 1;   //미사일의 방향은 랜덤하게 생성 => 미사일 방향 오른쪽 으로
        }else if (Math.floor(Math.random() * 2) == 1){
            this.missile01Array[i].bdirection =   Math.floor(Math.random() * 10) * -1;   //미사일의 방향은 랜덤하게 생성 => 미사일 방향 왼쪽 으로
        }

    }
}

////////////////// 적02 미사일 경로
function missile01_move(){ 
   
   //this.missile01_size = this.missile01_size + 0.1;               //미사일 크기
   this.missile01_size = this.missile01_size + enemy02_size/10;                //미사일 크기
   

    for(var i = 0; i < this.missile01Array.length; i++){

        this.missile_index = i;

        //미사일 이동 좌표
        //플레이어 위치에 따른 미사일 방향 변경
        if (playerY >= this.enemy02y + this.enemy02h/2 + theCanvas.clientHeight / 6){
            this.missile01_upDown = 1;
            //console.log('1')
        }else if (playerY <=  this.enemy02y - this.enemy02h/2 - theCanvas.clientHeight / 6){
            this.missile01_upDown = -1;
            //console.log('2')
        }else if (playerX <=  this.enemy02x + this.enemy02w/2 - theCanvas.clientWidth / 3){
            this.missile01_leftRight = -1;
            this.missile01_upDown = this.missile01_tmp_random;
            //console.log('3')
        }else if (playerX >=  this.enemy02x - this.enemy02w/2 - theCanvas.clientWidth / 3){
            this.missile01_leftRight = 1;
            this.missile01_upDown = this.missile01_tmp_random;
            //console.log('4')
        }

        this.missile01Array[i].bmx =  this.missile01Array[i].bmx + this.missile01Array[i].bdirection * this.missile01_leftRight;
        this.missile01Array[i].bsize = this.missile01_size;
        this.missile01Array[i].bmy = this.missile01Array[i].bmy + this.missile01Array[i].bsize * this.missile01_upDown / 2;
        this.missile01Array[i].bmy  = this.missile01Array[i].bmy  * this.missile01Array[i].bspeed;

        Context.drawImage(this.missile01Image,this.missile01Array[i].bmx,this.missile01Array[i].bmy,this.missile01Array[i].bsize,this.missile01Array[i].bsize);

        //플레이어 충돌
        this.player_collision();

    
       //미사일 화면 이탈시 또는 미사일이 너무 커지면
       //if (missile01Array[i].bmx >= theCanvas.clientWidth  || missile01Array[i].bmx <= 0 ){
        if ( this.missile01Array[i].bmy >= theCanvas.clientHeight || this.missile01Array[i].bmy <= 0 || this.missile01Array[i].bsize >= 100){

            //최대 max_missile01_cnt 개까지만 생성
            if (1 == Math.floor(Math.random()*2)){
 
                this.missile01_cnt = Math.floor(Math.random()*5) + 1;
             
                //미사일 객체(배열) 초기화
                this.missile01_init(); 
                this.missile01_size = 5 * parseInt(Math.floor(gameTime/1500)); 

            }else {
                //5초마다 미사일 증가
                //if (gameTime % 500 == 0){
                    this.missile01_cnt++;

                    if (this.missile01_cnt >= this.max_missile01_cnt){
                        this.missile01_cnt = this.max_missile01_cnt;
                    }

                    this.missile01_create();
                //}

                //미사일 객체(배열) 초기화
                this.missile01_init();
            }
 
        }
      } 
}

////////////////// 플레이어 폭파(미사일 충돌)
function player_collision(){

    //if ((parseInt(missile01Array[i].bmx) <= parseInt(playerX)  + playerWidth) && (parseInt(missile01Array[i].bmx) + missile01Array[i].bsize >= parseInt(playerX)  )){
        //미사일과 Y좌표 충돌시
        //if ((parseInt(missile01Array[i].bmy) <= parseInt(playerY)  + playerHeight) && (parseInt(missile01Array[i].bmy)  + missile01Array[i].bsize >= parseInt(playerY) )){
    //미사일 출동시 약간의 간극을 약간 스칠경우는 폭파되지않도록 한다.
    var ll_tmpspace = 10;

    //현재 미사일 index
    var i = this.missile_index;

    if ((parseInt(this.missile01Array[i].bmx) <= parseInt(playerX)  + playerWidth - ll_tmpspace) && (parseInt(this.missile01Array[i].bmx) + this.missile01Array[i].bsize >= parseInt(playerX)  + ll_tmpspace )){
        //미사일과 Y좌표 충돌시
        if ((parseInt(this.missile01Array[i].bmy) <= parseInt(playerY)  + playerHeight - ll_tmpspace) && (parseInt(this.missile01Array[i].bmy)  + this.missile01Array[i].bsize >= parseInt(playerY)  + ll_tmpspace)){
            //console.log("Pdistance",Pdistance)
            //충돌시 폭파이미지로 변경

            if (player_life <= 1){

                // explosion_sound.currentTime  = 4;
                // explosion_sound.play();
   

                Context.drawImage(explosionImage01,playerX-Math.floor(Math.random()*40),playerY+Math.floor(Math.random()*40),35,25);
                Context.drawImage(explosionImage01,playerX-10,playerY - 15,60*(Pdistance/500)*playerHeight/50,30*(Pdistance/500)*playerWidth/10);
                Context.drawImage(explosionImage01,playerX+Math.floor(Math.random()*10),playerY-Math.floor(Math.random()*60),120,115);

                this.energe_bar = '';
                explosion_sound.play();
                explosion_sound.currentTime  = 0;

                explosion_sound.play();
                audio.pause();
                audio.currentTime  = 0;

                //콜로니 밖 우주 배경그려주기(투명도 적용)
                Context.save();

                Context.globalAlpha = 0.8;

                status = 4;    //게임 END

                //게임 점수 저장
                var ls_current_score = gameTime;
                localStorage.setItem('current_score',ls_current_score);

                var ls_before_score = localStorage.getItem('before_score');
                if (ls_before_score == null || ls_before_score == ""){
                    ls_before_score = ls_current_score;
                    localStorage.setItem('before_score',ls_current_score);
                }

                //현재 점수가 이전 점수보다 클경우 최고 점수에 저장, 작을경우 이전 점수 저장
                if (parseInt(ls_current_score) > parseInt(ls_before_score)){
                    localStorage.setItem('best_score',ls_current_score);
                }else {
                    localStorage.setItem('best_score',ls_before_score);
                }

                // 이전 점수에 베스트 점수를 저장
                var ls_best_score = localStorage.getItem('best_score');
                    localStorage.setItem('before_score',ls_best_score); 

            }else {
                if (player_collision_yn == 'N'){

                    Context.drawImage(explosionImage01,playerX+5,playerY - 10,40*(Pdistance/500)*playerWidth/40,60*(Pdistance/500)*playerHeight/20);
                    Context.drawImage(explosionImage01,playerX-Math.floor(Math.random()*50),playerY+Math.floor(Math.random()*50),50,35);
                    Context.drawImage(explosionImage01,playerX-Math.floor(Math.random()*40),playerY+Math.floor(Math.random()*40),35,25);
                    Context.drawImage(explosionImage01,playerX-10,playerY - 15,60*(Pdistance/500)*playerHeight/50,30*(Pdistance/500)*playerWidth/30);
                    crash02_sound.play();
                    crash02_sound.currentTime  = 0;

                    player_life = player_life - 1;
                    player_collision_yn = 'Y';

                    //플레이어에 맞은 미사일은 않보이게 소멸
                    //missile01Array[i] = null;
                    this.missile01Array[i].bx = 0;
                    this.missile01Array[i].by = 0;
                    this.missile01Array[i].bmx = 0;
                    this.missile01Array[i].bmy = 0;
                    this.missile01Array[i].bsize = 0;
                }
            }
        }
    }
}

////////////////// 화면 로드(게임 프래임 수 만큼)
function drawScreen(){ 

    //게임 진행 컨텍스트(레이어)
    Context.fillStyle = "#000000";
    Context.fillRect(0,0,theCanvas.clientWidth,theCanvas.clientHeight);
    Context.fillStyle = "#ffffff";
    Context.font = '50px Arial';
    //Context.textBaseline = "top";

    //게임 상태(시작,중지,종료) 표시용 컨텍스트
    Context2.fillStyle = "#000000";
    Context2.fillRect(0,0,theCanvas.clientWidth,theCanvas.clientHeight);
    Context2.fillStyle = "#ffffff";
    Context2.font = '100px Arial';

    //게임상태정보표시
    game_status();

	//게임 컨트롤
    gameControl();

    //게임 배경 화면
	//if (gameTime % 2 === 0){
		game_background();
	//}

    //플레이어 경계
    player_border();

    //플레이어 거리
    player_didtance(); 

    //레이져발사
    //if (strKeyEventValue == "Control"  || isKeyCode == 32){
    laser_move();
    //}
 
    //적02 이동 
     for (var i=0;i<=enemy02_array.length - 1;i++){ 
        if (enemy02_array[i].enemy02_index == i){ 
             enemy02_array[i].enemy02_move();
        } 
     }  

    //플레이어 이동(플레이어는 맨 마지막에 그려준다. 그래야 다른 적들보다 앞에서 보여진다.)
    player_move();

    //적02 미사일 이동(적미사일과 충돌시 폭파이미지는 플레이더 뒤에서 그려준다.) 
    for (var i=0;i<=enemy02_array.length - 1;i++){ 
        if (enemy02_array[i].enemy02_index == i){  
             enemy02_array[i].missile01_move();
        } 
     }

    //5초마다 미사일 더생성
    // if(gameTime % 100 === 0){
    //     console.log("추가",gameTime)
    //     //동시 나타나는  미사일수
    //     for (var i = 0;i<=2; i++){
    //         //missile01Array.push({bx:missile01X, by:missile01Y, bmx:move_missile01X, bmy:100, bsize:10, bspeed:20, bdirection:missile01_Randon});
    //     }
    // }

    //10초마다 적 추가생성
    if(gameTime % 1000 === 0){

        //적02 추가 생성
        enemy02_cnt = enemy02_cnt + 1;
        create_enemy02(enemy02_cnt); 

    } 

    //게임 진행 정보(맨마지막에 그려줘야 게임내 이미지가 덮지않는다.)
    Context.font  = "30px Arial";
    //Context.fillText("입력된 키값 :" + strKeyEventValue,5,15);
    //Context.fillText("캔버스 면적 :" + maxX + "," + maxY,5,30);
    //Context.fillText("입력된 상태 :" + strKeyEventType,5,45);
    //Context.fillText("입력된 위치 :" + playerX + "," + playerY,5,60);
    //Context.fillText("면적 :" + maxX + "," + maxY,theCanvas.clientWidth - 100,15);
    //Context.fillText("FPS :" + gameFrame,theCanvas.clientWidth - 100,30);
    //Context.fillText("거리 :" + gameTime + "Km",theCanvas.clientWidth - 100,45);
    //Context.fillText("속도 :" + Pspeed + "Km/s",theCanvas.clientWidth - 100,60);
    //Context.fillText("타겟 :" + parseInt(Pdistance) + "Km/s",theCanvas.clientWidth - 100,75);
    //Context.fillText("Score : " + gameTime,theCanvas.clientWidth - 250,50);
    Context.fillText("Score : " + gameTime,10,50);
}

////////////////// 키 다운 이벤트 처리(데스크 탑 이용시)
function onkeyDown(e, as_strKeyEventValue){

    strKeyEventValue = e.key;
    strKeyEventType = e.type;
    isKeyCode =  e.keyCode;

    //게임 진행 상태
    if (strKeyEventValue == "Enter" || isKeyCode == 13){

        //alert(status+","+Pspeed)
        //상태별 상태값 설정
        if(status == 1){        //시작

            isKeyDown[e.keyCode] = true;

            clearInterval(Timer_Id);

            //게임 변수 초기화
            game_init();

            //플레이어 변수 초기화
            player_init();

            //레이져 변수 초기화
            laser_init(); 

            //적02 생성
            create_enemy02();

            status = 2;         //진행

            Timer_Id = setInterval(drawScreen, 1000/gameFrame);

            audio.play();
            //audio.pause();

        }else if(status == 2){

            status = 3;         //멈춤

            clearInterval(Timer_Id);

            Timer_Id = setInterval(drawScreen, 1000/gameFrame);

            //audio.play();
            audio.pause();

        }else if(status == 4){  //게임오버

            clearInterval(Timer_Id);

            //게임 변수 초기화
            game_init();

            //플레이어 변수 초기화
            player_init();

            //레이져 변수 초기화
            laser_init();
 
            create_enemy02(); 

            //상태값 : 시작
            status = 1;

            Timer_Id = setInterval(drawScreen, 1000/gameFrame);

            //audio.play();
            audio.pause();

        }else {          //계속 진행

            status = 2;  //진행

            Timer_Id = setInterval(drawScreen, 1000/gameFrame);

            audio.play();
            //audio.pause();
        }

    }else if (strKeyEventValue == "Escape" || isKeyCode == 27){
            if (confirm("재시작하시겠습니까")){

                clearInterval(Timer_Id);

                //게임 변수 초기화
                game_init();

                //플레이어 변수 초기화
                player_init();

                //레이져 변수 초기화
                laser_init(); 

                //적02 생성
                create_enemy02();

                //상태값  : 시작
                status = 1;

                Timer_Id = setInterval(drawScreen, 1000/gameFrame);

                audio.play();
                //audio.pause();
            }else {
                //상태값: 그냥 이어서 진행
                status = 2;

                Timer_Id = setInterval(drawScreen, 1000/gameFrame);

                audio.play();
                //audio.pause();
            };

            return;
    }

    //레이져
    if (strKeyEventValue == "Space"  || isKeyCode == 32){

		laser_sound.currentTime  = 0;
        laser_sound.play();

        //레이져 변수 초기화
        laser_init();
        laser_yn = 'Y';
        laser_move();

    }
}

////////////////// 키 업 이벤트 처리(데스크 탑 이용시)
function onkeyUp(e){

    isKeyCode = null;
    isKeyDown[e.keyCode] = false;

    strKeyEventValue = e.key;
    strKeyEventType = e.type;
    strKeyEventValue = "None";

}

//마우스 우클릭, 드래그, 선택 방지
$(document).on("contextmenu dragstart selectstart",function(e){
    return false;
});

//화면 드래그 방지
//$('html, body, totdiv').css({'overflow': 'hidden', 'height': '100%'});
$('#GameCanvas').on('scroll touchmove mousewheel', function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
});