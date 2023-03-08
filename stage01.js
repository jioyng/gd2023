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
//더블클릭시
//window.addEventListener("dblclick",onDblkeyDown, false);
 
//제일 처음 페이지 load 여부
var first_load_yn = "Y";

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
Context
var docV = document.documentElement;

//윈도우 리사이징 호출BtnaimX
//window.addEventListener("resize",  fit_resize);

//게임 로드시 켐퍼스 리사이징 조정
fitToContainer(theCanvas);

//게임 진행 및 상태 컨텍스트(게임 오브젝트(플레이어 및 적) : 진행  + 컨트롤 + 스코어,게임 상태 표시 : 시작, 진행, 멈춤, 종료 메세지)
var Context = theCanvas.getContext("2d");
//게임 컨트롤(방향키 및 공격버튼)
var Context2 = theCanvas.getContext("2d");
//게임배경 컨텍스트(게임 콜로니 내부)
var Context3 = theCanvas.getContext("2d");
//게임 표적
var Context4 = theCanvas.getContext("2d");
//게임배경 컨텍스트(게임 콜리니 외부)
var Context5 = theCanvas.getContext("2d");
//게임스킬 컨텍스트
var Context6 = theCanvas.getContext("2d");
var xxAim = 0;
var yyAim = 0;

//게임 화면 경계
var minX = theCanvas.offsetLeft;
var maxX = theCanvas.clientWidth - minX;
var minY = theCanvas.offsetTop;
var maxY = theCanvas.clientHeight - minY;
var add_borderX = 0;
var add_borderY = 0;

//백그라운드 사이즈 
var backgroundWidth = theCanvas.clientWidth; 
var backgroundHeight = theCanvas.clientHeight;  
var backgroundX = 0; 
var backgroundY = 0;  
var backgroundAngle = 0;

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
var directionDblTime = 0;
var isBfKeyCode = null;

var button01 = null;
var button02 = null;
var button03 = null;
var button04 = null;

//컨트롤 진하게 옵션 색상
var ls_CColor = localStorage.getItem('control_color');

//DEV 모드 옵션 색상
var ls_DColor = localStorage.getItem('dev_color'); 

// //전체화면
// var ls_TColor = localStorage.getItem('total_color');
// if (ls_TColor == "yellow"){
//     toggleFullScreen();
// }

//목소리 재생 옵션 색상
var ls_VColor = localStorage.getItem('voice_color');


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
directonMiddle.arc(minX + 170, maxY - 170, 50, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)

//메인공격버튼
button01 = new Path2D();
button01.fillStyle = "rgb(242, 255, 0)";
//button01.arc(maxX - 250, maxY - 180, 80, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)
button01.arc(maxX - 100, maxY - 180, 100, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)

//와프버튼
button02 = new Path2D();
button02.fillStyle = "rgb(242, 255, 0)";
//button02.arc(maxX - 80, maxY - 180, 80, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)
button02.arc(maxX - 265, maxY - 180, 65, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)
 
//스킬변경버튼
button03 = new Path2D();
button03.fillStyle = "rgb(242, 255, 0)";
//button02.arc(maxX - 80, maxY - 180, 80, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)
button03.arc(maxX - 212, maxY - 62, 65, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)

//기본스킬(sword)
button04 = new Path2D();
button04.fillStyle = "rgb(242, 255, 0)";
//button02.arc(maxX - 80, maxY - 180, 80, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)
button04.arc(maxX - 215, maxY - 300, 65, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)



/////////////////////////////////////////게임 관련 상태 설정 시작////////////////////////////////////////
//초기 게임 상태
var ini_status = 1;  //1:Start,   2:ing,  3:Pause
//기본 게임 프래임
var ini_gameFrame = 45 + parseInt(Math.random()*15);  //60프레임
//진행시간(=거리)
var init_gameTime = 0;
//var gameTime = 5000;
var gameTime = 0;
var init_gameScore = 0;
var gameScore = 0;
//화면 타이머 id
var init_Timer_Id = 0;  //var Timer_Id = setInterval(drawScreen, 1000/gameFrame); <= 재일 처음 시작시에는 움지기지 않는다.
var Timer_Id = 0;
//게임 배경의 진행 시점(목적지)
//var init_cityEnd_size = 100;       //게임 진행 방향 타겟 사이즈
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

var button_continue = null;
button_continue = new Path2D();
button_continue.fillStyle = "rgb(242, 255, 0)";
button_continue.rect(ls_width/2 - 250, ls_height - ls_height/4 - 60 , 500, 150);


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
backgroundImage.src = "./img/background04.png";
backgroundImage.addEventListener("load",drawScreen, false);

var backgroundImage2 = new Image();
backgroundImage2.src = "./img/background04.png";
backgroundImage2.addEventListener("load",drawScreen, false);

var backgroundImage3 = new Image();
backgroundImage3.src = "./img/background05.png";
backgroundImage3.addEventListener("load",drawScreen, false);

var backgroundImage4 = new Image();
backgroundImage4.src = "./img/background03.png";
backgroundImage4.addEventListener("load",drawScreen, false);

backgroundImage=backgroundImage2;
//게임 배경(도로) 이미지
var cityImage = new Image();
cityImage.src = "./img/city01.png";
cityImage.addEventListener("load",drawScreen, false);

//var city00Image = new Image();
//city00Image.src = "./img/city10.png";
//city00Image.src = "./img/city0" + String(parseInt(Math.random()*9) + 1) + ".png";
//city00Image.addEventListener("load",drawScreen, false); 

var city01Image = new Image();
city01Image.src = "./img/city01.png";
city01Image.addEventListener("load",drawScreen, false);

var city02Image = new Image();
city02Image.src = "./img/city02.png";
city02Image.addEventListener("load",drawScreen, false);

var city03Image = new Image();
city03Image.src = "./img/city03.png";
city03Image.addEventListener("load",drawScreen, false);

var city04Image = new Image();
city04Image.src = "./img/city04.png";
city04Image.addEventListener("load",drawScreen, false);

var city05Image = new Image();
city05Image.src = "./img/city05.png";
city05Image.addEventListener("load",drawScreen, false);

var city06Image = new Image();
city06Image.src = "./img/city06.png";
city06Image.addEventListener("load",drawScreen, false);

var city07Image = new Image();
city07Image.src = "./img/city07.png";
city07Image.addEventListener("load",drawScreen, false);

var city08Image = new Image();
city08Image.src = "./img/city08.png";
city08Image.addEventListener("load",drawScreen, false);

var city09Image = new Image();
city09Image.src = "./img/city09.png";
city09Image.addEventListener("load",drawScreen, false);

var city10Image = new Image();
city10Image.src = "./img/city10.png";
city10Image.addEventListener("load",drawScreen, false);

var city01Image_day = new Image();
city01Image_day.src = "./img/city01_day.png";
city01Image_day.addEventListener("load",drawScreen, false);

var city02Image_day = new Image();
city02Image_day.src = "./img/city02_day.png";
city02Image_day.addEventListener("load",drawScreen, false);

var city03Image_day = new Image();
city03Image_day.src = "./img/city03_day.png";
city03Image_day.addEventListener("load",drawScreen, false);

var city04Image_day = new Image();
city04Image_day.src = "./img/city04_day.png";
city04Image_day.addEventListener("load",drawScreen, false);

var city05Image_day = new Image();
city05Image_day.src = "./img/city05_day.png";
city05Image_day.addEventListener("load",drawScreen, false);

var city06Image_day = new Image();
city06Image_day.src = "./img/city06_day.png";
city06Image_day.addEventListener("load",drawScreen, false);

var city07Image_day = new Image();
city07Image_day.src = "./img/city07_day.png";
city07Image_day.addEventListener("load",drawScreen, false);

var city08Image_day = new Image();
city08Image_day.src = "./img/city08_day.png";
city08Image_day.addEventListener("load",drawScreen, false);

var city09Image_day = new Image();
city09Image_day.src = "./img/city09_day.png";
city09Image_day.addEventListener("load",drawScreen, false);

var city10Image_day = new Image();
city10Image_day.src = "./img/city10_day.png";
city10Image_day.addEventListener("load",drawScreen, false);

//추가1
var city11Image = new Image();
city11Image.src = "./img/city01.png";
city11Image.addEventListener("load",drawScreen, false);

var city12Image = new Image();
city12Image.src = "./img/city02.png";
city12Image.addEventListener("load",drawScreen, false);

var city13Image = new Image();
city13Image.src = "./img/city03.png";
city13Image.addEventListener("load",drawScreen, false);

var city14Image = new Image();
city14Image.src = "./img/city04.png";
city14Image.addEventListener("load",drawScreen, false);

var city15Image = new Image();
city15Image.src = "./img/city05.png";
city15Image.addEventListener("load",drawScreen, false);

var city16Image = new Image();
city16Image.src = "./img/city06.png";
city16Image.addEventListener("load",drawScreen, false);

var city17Image = new Image();
city17Image.src = "./img/city07.png";
city17Image.addEventListener("load",drawScreen, false);

var city18Image = new Image();
city18Image.src = "./img/city08.png";
city18Image.addEventListener("load",drawScreen, false);

var city19Image = new Image();
city19Image.src = "./img/city09.png";
city19Image.addEventListener("load",drawScreen, false);

var city20Image = new Image();
city20Image.src = "./img/city10.png";
city20Image.addEventListener("load",drawScreen, false); 


//추가2
var city21Image = new Image();
city21Image.src = "./img/city08.png";
city21Image.addEventListener("load",drawScreen, false);

var city22Image = new Image();
city22Image.src = "./img/city08.png";
city22Image.addEventListener("load",drawScreen, false);

var city23Image = new Image();
city23Image.src = "./img/city04.png";
city23Image.addEventListener("load",drawScreen, false);

var city24Image = new Image();
city24Image.src = "./img/city04.png";
city24Image.addEventListener("load",drawScreen, false);

var city25Image = new Image();
city25Image.src = "./img/city07.png";
city25Image.addEventListener("load",drawScreen, false);

var city26Image = new Image();
city26Image.src = "./img/city05.png";
city26Image.addEventListener("load",drawScreen, false);

var city27Image = new Image();
city27Image.src = "./img/city06.png";
city27Image.addEventListener("load",drawScreen, false);

var city28Image = new Image();
city28Image.src = "./img/city10.png";
city28Image.addEventListener("load",drawScreen, false);

var city29Image = new Image();
city29Image.src = "./img/city09.png";
city29Image.addEventListener("load",drawScreen, false);

var city30Image = new Image();
city30Image.src = "./img/city10.png";
city30Image.addEventListener("load",drawScreen, false);

///////////////// 추가끝 
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

//플레이어 와프이미지
var player_warp = new Image();
player_warp.src = "./img/player_warp.png";
player_warp.addEventListener("load",drawScreen, false);

var warp = new Image();
warp.src = "./img/player_warp.png";
warp.addEventListener("load",drawScreen, false);

//플레이어 쉴드이미지
var player_shield = new Image();
player_shield.src = "./img/player_shield.png";
player_shield.addEventListener("load",drawScreen, false);

//폭파이미지01
var explosionImage01 = new Image(); 
explosionImage01.src = "./img/explosion01.png";
explosionImage01.addEventListener("load",drawScreen, false);

//엔진이미지
var player_enginImage = new Image();
player_enginImage.src = "./img/engin.png";
player_enginImage.addEventListener("load",drawScreen, false);

// enginImage = enginImage;
// enginImage.src = enginImage.src;

//플레이어 스킬이미지
var playerSkillImage = new Image();
playerSkillImage.src = "./img/none.png"; 
playerSkillImage.addEventListener("load",drawScreen, false);

//플레이어 스킬0이미지
var playerSword_Image = new Image();
//playerSword_Image.src = "./img/noneImage.png"; 
playerSword_Image.src = "./img/none.png"; 
playerSword_Image.addEventListener("load",drawScreen, false);

var playerSword_StopImage = new Image();
playerSword_StopImage.src = "./img/player_skill00.png"; 
playerSword_StopImage.addEventListener("load",drawScreen, false);

var playerSword_UpImage = new Image();
playerSword_UpImage.src = "./img/player_skill00_up.png"; 
playerSword_UpImage.addEventListener("load",drawScreen, false);

var playerSword_RightImage = new Image();
playerSword_RightImage.src = "./img/player_skill00_right.png"; 
playerSword_RightImage.addEventListener("load",drawScreen, false);

var playerSword_LeftImage = new Image();
playerSword_LeftImage.src = "./img/player_skill00_left.png"; 
playerSword_LeftImage.addEventListener("load",drawScreen, false);

var playerSword_DownImage = new Image();
playerSword_DownImage.src = "./img/player_skill00_down.png"; 
playerSword_DownImage.addEventListener("load",drawScreen, false);

//플레이어 스킬1이미지
var playerSkill_01Image = new Image();
playerSkill_01Image.src = "./img/player_skill01_down.png"; 
playerSkill_01Image.addEventListener("load",drawScreen, false);

//플레이어 스킬2이미지
var playerSkill_02Image = new Image();
playerSkill_02Image.src = "./img/player_skill02_up.png"; 
playerSkill_02Image.addEventListener("load",drawScreen, false);

var playerSkill_02UpImage = new Image();
playerSkill_02UpImage.src = "./img/player_skill02_up.png"; 
playerSkill_02UpImage.addEventListener("load",drawScreen, false);

var playerSkill_02RightImage = new Image();
playerSkill_02RightImage.src = "./img/player_skill02_right.png"; 
playerSkill_02RightImage.addEventListener("load",drawScreen, false);

var playerSkill_02DownImage = new Image();
playerSkill_02DownImage.src = "./img/player_skill02_down.png"; 
playerSkill_02DownImage.addEventListener("load",drawScreen, false);

var playerSkill_02LeftImage = new Image();
playerSkill_02LeftImage.src = "./img/player_skill02_left.png"; 
playerSkill_02LeftImage.addEventListener("load",drawScreen, false);

//플레이어 스킬3이미지
var playerSkill_03Image = new Image();
playerSkill_03Image.src = "./img/player_skill03.png"; 
playerSkill_03Image.addEventListener("load",drawScreen, false);

//플레이어 스킬3tmp이미지
var playerSkill_03TmpImage = new Image();
playerSkill_03TmpImage.src = "./img/player_skill03tmp.png"; 
playerSkill_03TmpImage.addEventListener("load",drawScreen, false); 

//플레이어 스킬3tmp2이미지
var playerSkill_03Tmp2Image = new Image();
playerSkill_03Tmp2Image.src = "./img/player_skill03tmp.png"; 
playerSkill_03Tmp2Image.addEventListener("load",drawScreen, false);

//플레이어 스킬4이미지
var playerSkill_04Image = new Image();
playerSkill_04Image.src = "./img/player_skill01.png"; 
playerSkill_04Image.addEventListener("load",drawScreen, false);

//플레이어 스킬5이미지
var playerSkill_05Image = new Image();
playerSkill_05Image.src = "./img/player_skill03.png"; 
playerSkill_05Image.addEventListener("load",drawScreen, false);

//이전 플레이어 진행방향 키값 => 속도변경시 방향키 새로 안눌러두 이전 방향으로 계속해서 진행되도록 하기위해 필요
var wayBefore = null;
var wayBefore2 = null;
//플레이어 초기값( 크기, 위치 및 기본 이동거리, 스피트)
//var ini_player_width = 70;
//var ini_player_height = 45;
// var ini_player_width = 140;
// var ini_player_height = 150;
//var ini_player_width = 160;   //319
//var ini_player_height = 250;  //503
// var ini_player_width = 140;
// var ini_player_height = 180;
var ini_player_width = 160;
var ini_player_height = 160;
// var ini_playerX = (theCanvas.clientWidth - ini_player_width)/ 2 - theCanvas.offsetLeft; //X좌표
// var ini_playerY = theCanvas.clientHeight - 100;  //Y좌표
var ini_player_size = 5000;    //플레이어 초기 크기 배율

//플레이어크기
var playerWidth = ini_player_width;
var playerHeight = ini_player_height;
var player_size = ini_player_size;

//var ini_playerX = (theCanvas.clientWidth - ini_player_width)/ 2 - theCanvas.offsetLeft; //X좌표
var ini_playerX = (theCanvas.clientWidth - ini_player_width)/ 2; //X좌표
var ini_playerY = theCanvas.clientHeight - 100;  //Y좌표

//플레이어 시작 위치
var playerX = ini_playerX;
var playerY = ini_playerY;

//플레이어 이동 거리
var pmovex = 0;
var pmovey = 0;
var ini_Pspeed = 2;         //플레이어 초기 스피드
var Pspeed = ini_Pspeed;
var before_pspeed = 10;      //이전 스피트(스트드 업버튼 누르면 바로 속도 증가하도록 하기위해)
var ini_player_life = 5;    //플레이어 생명
var player_life = ini_player_life;
var penerge_bar = ini_energe_bar;

var ini_player_cnt = 3;    //초기 플레이어 갯수(보너스)
var player_cnt = ini_player_cnt;

//플레이어 공간이동(warp) 거리
var ini_warp_distance = 10;
var warp_distance = ini_warp_distance;

//플레이어 미사일 충돌 여부
var player_collision_yn = 'N';

//보너스 발생 전후 여부
var bonus_cnt = 1;


//플레이어 무적시간
var ini_ready_time = 200;
var ready_time = ini_ready_time;

/////////////////////////////////////////플레이어 레이져 초기 설정///////////////////////////////////////////
var laserImage = new Image();
laserImage.src = "./img/laser01.png";
laserImage.addEventListener("load",drawScreen, false);

var laser = new Image();
laser.src = "./img/laser01.png";
laser.addEventListener("load",drawScreen, false);

var laser01 = new Image();
laser01.src = "./img/bullet01.png";
laser01.addEventListener("load",drawScreen, false);


var laser02 = new Image();
laser02.src = "./img/engin01.png";
laser02.addEventListener("load",drawScreen, false);

//적02 미시일 이미지 및 로드
var millsile = new Image();
millsile.src = "./img/missile01.png";
millsile.addEventListener("load",drawScreen, false);

//검(sword) 초기 생성 위치
var smovex = playerX + playerWidth/2;
var smovey = playerY;

//검 초기 크기
var s_height = 100;
var s_width = 100;

//레이져 초기 생성 위치
var laserX = playerX + playerWidth/2;
var laserY = playerY;

//레이져 초기 이동위치 = 생성위치
var lmovex;
var lmovey; 
var lmovex2;
var lmovey2;
var lmovex3;
var lmovey3;
var lmovex4;
var lmovey4;

//레이져 초기 크기
var l_height = 1;
var l_width = 2;

//레이져 초기 속도
var lspeed = 1;

//레이져 발사 여부
var laser_yn = 'N';

//레이져 각도
var laser_r = 0;
var laser_d = 0;


//폭멸탄 충전 : 마우스(버튼클릭) 유지시간.
var laser_charge_start_time = 0,  laser_charge_total_time = 0;

//초기 공격 스킬
var sword_yn = 'N';
var ini_skill = 1;
var skill = ini_skill;
var tmp_skill = skill;

//초기 웨폰 파워 => enemy_type == 4
var ini_power = 1;
var power = ini_power;
var tmp_power = power;

///////////////////////////////////전함01 초기 설정////////////////////////////////////////////////////////////////
//전함01 이미지
var ship01_Image = new Image();
    ship01_Image.src = "./img/ship01.png";
    ship01_Image.addEventListener("load",drawScreen, false);
//var enemyGunImage = new Image();
//var weapponImage = new Image();

//전함01 이동좌표
var ini_ship01x = maxX;
var ini_ship01y = maxY/5;
var ship01x = ini_ship01x;
var ship01y = ini_ship01y/5;

///////////////////////////////////적 초기 설정////////////////////////////////////////////////////////////////
//적 이미지/////////////////////////////////////////
var enemyImage = new Image();
    enemyImage.src = "./img/enemy01.png";

var enemyGunImage = new Image();

var weapponImage = new Image();

var enginImage = new Image();

//적01 이미지///////////////////////////////////////
var enemy01Image = new Image();
enemy01Image.src = "./img/enemy01.png";
enemy01Image.addEventListener("load",drawScreen, false);

//적01 건 이미지
var enemy01GunImage = new Image();
enemy01GunImage.src = "./img/bullet01.png";
enemy01GunImage.addEventListener("load",drawScreen, false);

//적01 총알 이미지 및 로드
var weappon01Image = new Image();
weappon01Image.src = "./img/bullet01.png";
weappon01Image.addEventListener("load",drawScreen, false);

//적01 엔진 이미지
var engin01Image = new Image();
engin01Image.src = "./img/engin01.png";
engin01Image.addEventListener("load",drawScreen, false);

//적02 이미지///////////////////////////////////////
var enemy02Image = new Image();
enemy02Image.src = "./img/enemy02.png";
enemy02Image.addEventListener("load",drawScreen, false);

//적02 건 이미지
var enemy02GunImage = new Image();
enemy02GunImage.src = "./img/missile01.png";
enemy02GunImage.addEventListener("load",drawScreen, false);

//적02 미시일 이미지 및 로드
var weappon02Image = new Image();
weappon02Image.src = "./img/missile01.png";
weappon02Image.addEventListener("load",drawScreen, false);

//적02 엔진 이미지
var engin02Image = new Image();
engin02Image.src = "./img/engin02.png";
engin02Image.addEventListener("load",drawScreen, false); 

//적03 이미지///////////////////////////////////////
var enemy03Image = new Image();
enemy03Image.src = "./img/enemy03.png";
enemy03Image.addEventListener("load",drawScreen, false);

var enemy03_01Image = new Image();
enemy03_01Image.src = "./img/enemy03_01.png";
enemy03_01Image.addEventListener("load",drawScreen, false);

//적03 건 이미지
var enemy03GunImage = new Image();
enemy03GunImage.src = "./img/missile03.png";
enemy03GunImage.addEventListener("load",drawScreen, false);

//적03 미시일 이미지 및 로드
var weappon03Image = new Image();
weappon03Image.src = "./img/missile03.png";
weappon03Image.addEventListener("load",drawScreen, false);

//적03 엔진 이미지
var engin03Image = new Image();
engin03Image.src = "./img/engin03.png";
engin03Image.addEventListener("load",drawScreen, false); 

//적04 이미지///////////////////////////////////////
var enemy04Image = new Image();
enemy04Image.src = "./img/enemy04.png";
enemy04Image.addEventListener("load",drawScreen, false); 

//적04 건 이미지
var enemy04GunImage = new Image();
enemy04GunImage.src = "./img/laser02.png";
enemy04GunImage.addEventListener("load",drawScreen, false);

//적04 미시일 이미지 및 로드
var weappon04Image = new Image();
weappon04Image.src = "./img/laser01.png";
weappon04Image.addEventListener("load",drawScreen, false);

//적04 엔진 이미지
var engin04Image = new Image();
engin04Image.src = "./img/engin04.png";
engin04Image.addEventListener("load",drawScreen, false); 

//적05 이미지///////////////////////////////////////
var enemy05Image = new Image();
enemy05Image.src = "./img/enemy05.png";
enemy05Image.addEventListener("load",drawScreen, false);

//적05 건 이미지
var enemy05GunImage = new Image();
enemy05GunImage.src = "./img/missile01.png";
enemy05GunImage.addEventListener("load",drawScreen, false);

//적05 미시일 이미지 및 로드
var weappon05Image = new Image();
weappon05Image.src = "./img/missile01.png";
weappon05Image.addEventListener("load",drawScreen, false);

//적05 엔진 이미지
var engin05Image = new Image();
engin05Image.src = "./img/engin05.png";
engin05Image.addEventListener("load",drawScreen, false); 

//적06 이미지///////////////////////////////////////
var enemy06Image = new Image();
enemy06Image.src = "./img/enemy06.png";
enemy06Image.addEventListener("load",drawScreen, false); 

//적06 건 이미지
var enemy06GunImage = new Image();
enemy06GunImage.src = "./img/bullet01.png";
enemy06GunImage.addEventListener("load",drawScreen, false);

//적06 미시일 이미지 및 로드
var weappon06Image = new Image();
weappon06Image.src = "./img/missile01.png";
weappon06Image.addEventListener("load",drawScreen, false);

//적06 엔진 이미지
var engin06Image = new Image();
engin06Image.src = "./img/engin06.png";
engin06Image.addEventListener("load",drawScreen, false);

//적07 이미지///////////////////////////////////////
var enemy07Image = new Image();
enemy07Image.src = "./img/enemy07.png";
enemy07Image.addEventListener("load",drawScreen, false); 

//적07 건 이미지
var enemy07GunImage = new Image();
enemy07GunImage.src = "./img/bullet01.png";
enemy07GunImage.addEventListener("load",drawScreen, false);

//적07 미시일 이미지 및 로드
var weappon07Image = new Image();
weappon07Image.src = "./img/missile01.png";
weappon07Image.addEventListener("load",drawScreen, false);

//적07 엔진 이미지
var engin07Image = new Image();
engin07Image.src = "./img/engin07.png";
engin07Image.addEventListener("load",drawScreen, false);


//적08 이미지///////////////////////////////////////
var enemy08Image = new Image();
enemy08Image.src = "./img/enemy08.png";
enemy08Image.addEventListener("load",drawScreen, false); 

//적08 건 이미지
var enemy08GunImage = new Image();
enemy08GunImage.src = "./img/bullet02.png";
enemy08GunImage.addEventListener("load",drawScreen, false);

//적08 미시일 이미지 및 로드
var weappon08Image = new Image();
weappon08Image.src = "./img/bullet02.png";
weappon08Image.addEventListener("load",drawScreen, false);

//적08 엔진 이미지
var engin08Image = new Image();
engin08Image.src = "./img/engin08.png";
engin08Image.addEventListener("load",drawScreen, false);


//적 크기
var enemy_size = 1;

//적 스피드
var enemy_speed = 1;

//적 초기 위치
//var ini_enemyx = parseInt(theCanvas.clientWidth / 2  + cityEnd_x) + Math.floor(Math.random() * 100) - Math.floor(Math.random() * 100); //시작  x
//var ini_enemyy = parseInt(theCanvas.clientHeight / 4 + cityEnd_y) + Math.floor(Math.random() * 50) - Math.floor(Math.random() * 30); //시작 y
var ini_enemyx = parseInt(theCanvas.clientWidth / 2  + cityEnd_x) + Math.floor(Math.random() * 30) - Math.floor(Math.random() * 20); //시작  x
var ini_enemyy = parseInt(theCanvas.clientHeight / 4 + cityEnd_y) + Math.floor(Math.random() * 50) - Math.floor(Math.random() * 30); //시작 y

//적 이동위치
var enemyxx = 0;
var enemyyy = 0;

//적 크기
// var ini_enemyw = 40;
// var ini_enemyh = 55;
// var ini_enemyw = 20;
// var ini_enemyh = 25;
// var ini_enemyw = 42;
// var ini_enemyh = 55;
var ini_enemyw = 42;
var ini_enemyh = 50;

//var ini_enemyw = 60;
//var ini_enemyh = 80;
var enemyw = ini_enemyw;
var enemyh = ini_enemyh;

//적 생명
var ini_enemy_life = 0;
var enemy_life = ini_enemy_life;
var ini_energe_bar = ''  // '■□';   //에너지 바
var energe_bar = ''  // '■□';   //에너지 바

//적 미시일 초기 생성 위치
var weapponX = theCanvas.clientWidth / 2  - cityEnd_size/2 + cityEnd_x;
var weapponY = theCanvas.clientHeight / 5 + cityEnd_size/5;

//적 미시일 초기 이동위치 = 생성위치
var move_weapponX = weapponX;
var move_weapponY = weapponY;

//적 미시일 초기 크기
var weappon_size = 1;

//적 미시일 초기 속도
var weappon_speed = 1;

//적 미시일 초기 방향값
var weappon_Randon = 0;   //적 미사일 방향값은 랜덤하게

//적 새로 출몰 간격
var enemy_dealy_time = 1000;

//화면에 나타나는 적 미시일수(배열)
var weapponArray = new Array();
var weappon_index = 0;     //현재 미사일 인덱스
var weappon_cnt = 1;
var ini_max_weappon_cnt = 6;
var max_weappon_cnt = ini_max_weappon_cnt;
var enemy_collision_yn = "N";

//적 (고유)순번
var enemy_index = null;

//적 타입
var enemy_type = 1;

//적 폭파중 여부
var enemy_collision_yn = 'N';

//적 객체 인스턴스 생성
//적 초기 출현 갯수
var enemy_cnt = 0;
var enemy_array = [];

//create_enemy();

//적 미사일 방향 설정 초기 변수
var weappon_upDown = 1;
var weappon_leftRight = 1;
var weappon_tmp_random = Math.floor(Math.random() * 7)/10;    //플레이어 위치에 따른 미사일 Y축 이동 좌표
//첫번째 보스 
var enemy_boss_01_status = 0;   //적 보스 상태(0:대기, 1:출몰, 2:파괴)
var enemy_boss_01_index = 0;   //적 보스 고유번호
var enemy_boss_01_yn = 'N';    //보스 여부
//두번째 보스
var enemy_boss_02_status = 0;   //적 보스 상태(0:대기, 1:출몰, 2:파괴)
var enemy_boss_02_index = 0;   //적 보스 고유번호
var enemy_boss_02_yn = 'N';    //보스 여부
//적 경계 진입 여부
var enemy_border_over_yn = 'N';

//////////////////// Save_Load_Game 설정값
// gameTime = 4000;
// ini_player_size = 140;
// enemy_boss_01_status = 2;


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
 
    //최초 페이지 로드 여부
    //first_load_yn = "N";

    //키코드 널
    isKeyDown[as_keycode] = false;

    //게임시작사운드
    //start_sound.play(); 

    //게임 변수 초기화
    game_init();

    //사운드 초기화
    audio.play();
    //audio.currentTime  = 0;

    //플레이어 변수 초기화
    player_init();

    //적 생성
    create_enemy();

    //진행 상태
    status = 2;

    //타이머 초기화
    clearInterval(Timer_Id);

    Timer_Id = setInterval(drawScreen, 1000/gameFrame);   //게임 프레임(gameFrame은  초기 ini_gameFram 설정값)

    // //목소리 재생모드일경우만 실행
    // if (parseInt(gameTime) <= 100){ 
    //     if (ls_VColor == "yellow") vstart_sound.play();
    // }

    
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

    Context5.drawImage(backgroundImage, backgroundX, backgroundY,backgroundWidth,backgroundHeight); 

    first_load_yn = "N";  //머지? 이러게하니 잘되네...

    //플레이어 초기화
    player_init();

    //게임 초기화(플레이어 갯수(보너스)가 더이상 없는경우만 수행한다.)
    if (parseInt(player_cnt) > 0){
        return;
    }

    //게임 제일 처음 로드 여부
    first_load_yn = "N";

    //오디오 처음부터
    audio.currentTime  = 0;

    status = ini_status;
    gameFrame = ini_gameFrame;
    gameTime = init_gameTime;
    gameScore = init_gameScore;
    Timer_Id = init_Timer_Id;
    cityEnd_size = init_cityEnd_size;
    cityEnd_x = init_cityEnd_x;
    cityEnd_y = init_cityEnd_y;
    enemy_size = enemy_size;
    enemy_speed = enemy_speed;

    //남은 플레이어 갯수(보너스)
    //ini_player_cnt = 0;
    player_cnt = ini_player_cnt;

    //enemyx = parseInt(theCanvas.clientWidth / 2); //시작  x
    //enemyy = parseInt(theCanvas.clientHeight / 4); //시작 y 
 
    enemy_boss_01_status = 0;   //적 보스 상태(0:대기, 1:출몰, 2:파괴)
    enemy_boss_01_index = 0;   //적 보스 고유번호
    enemy_boss_01_yn = 'N';    //보스 여부

    enemy_boss_02_status = 0;   //적 보스 상태(0:대기, 1:출몰, 2:파괴)
    enemy_boss_02_index = 0;   //적 보스 고유번호
    enemy_boss_02_yn = 'N';    //보스 여부

    //전함01 초기화
    ship01x = ini_ship01x;
    ship01y = ini_ship01y;

    //보너스 발생 여부
    bonus_cnt = 1;

    //공격스킬
    skill = 1;
    sword_yn = 'N'; 

    //적 생명
    ini_enemy_life = 5;
    enemy_life = ini_enemy_life;
    ini_energe_bar = ''  // '■□';   //에너지 바
    energe_bar = ''  // '■□';   //에너지 바

    //적 미시일 초기 생성 위치
    weapponX = theCanvas.clientWidth / 2  - cityEnd_size/2 + cityEnd_x;
    weapponY = theCanvas.clientHeight / 5 + cityEnd_size/5;

    //적 미시일 초기 이동위치 = 생성위치
    move_weapponX = weapponX;
    move_weapponY = weapponY;

    //적 미시일 초기 크기
    weappon_size = 1;

    //적 미시일 초기 속도
    weappon_speed = 1;

    //적 미시일 초기 방향값
     weappon_Randon = 0;   //적 미사일 방향값은 랜덤하게

    //적 새로 출몰 간격
    enemy_dealy_time = 1000;

    //화면에 나타나는 적 미시일수(배열)

    enemy_type = 1;
    enemy_cnt = 0;
    enemy_array = [];

    enemyx = ini_enemyx;
    enemyy = ini_enemyy;

    enemyxx = enemyxx;
    enemyyy = enemyyy;

    enemy_life = ini_enemy_life;

    isKeyCode = null;
    isKeyDown = [];
	strKeyEventValue = "None";
    weapponArray = [];
    weappon_cnt = 1;
    ini_max_weappon_cnt = 8;
    max_weappon_cnt = ini_max_weappon_cnt;
    warp_distance = ini_warp_distance;

    back_distance = 0;
    back_distance2 = 0;
    back_distance3 = 0;

    //배경종점으로부터의 플레이어 거리
    Pdistance = init_Pdistance;

    //배경종점으로부터의 적 거리
    Edistance = init_Edistance;

    //적 타입
    enemy_type = 1;
 

    //적 크기
    enemyw = ini_enemyw;
    enemyh = ini_enemyw;

    //적 초기 위치
    //enemyx = parseInt(theCanvas.clientWidth / 2  + cityEnd_x) + (Math.floor(Math.random() * 100))  + (Math.floor(Math.random() * 300)) - (Math.floor(Math.random() * 300)); //시작  x
    //enemyy = parseInt(theCanvas.clientHeight / 4) + (Math.floor(Math.random() * 300)) - (Math.floor(Math.random() * 300)); //시작 y

    //적 생명
    ini_enemy_life = 5;
    enemy_life = ini_enemy_life;
    ini_energe_bar = ''  // '■□';   //에너지 바
    energe_bar = ''  // '■□';   //에너지 바

    //적 미시일 초기 생성 위치
    weapponX = theCanvas.clientWidth / 2  - cityEnd_size/2 + cityEnd_x;
    weapponY = theCanvas.clientHeight / 5 + cityEnd_size/5;
    //적 미시일 초기 이동위치 = 생성위치
    move_weapponX = weapponX;
    move_weapponY = weapponY;


    weappon_upDown = 1;
    weappon_leftRight = 1;
    weappon_tmp_random = Math.floor(Math.random() * 5)/10;    //플레이어 위치에 따른 미사일 Y축 좌표

    enemy_dealy_time = 1000;

    //화면에 나타나는 적 미시일수(배열)
    //weapponArray = [];
    weappon_cnt = 1;
    //ini_max_weappon_cnt = 5;
    max_weappon_cnt = ini_max_weappon_cnt;
    enemy_collision_yn = "N";
    enemy_index = null;

    //적 경계 진입 여부
    enemy_border_over_yn = 'N';

    //방향키코드 초기화
    isKeyCode = null;
    isBfKeyCode = null;

    //배경 최기화
    backgroundWidth = theCanvas.clientWidth; 
    backgroundHeight = theCanvas.clientHeight;  
    backgroundX = 0; 
    backgroundY = 0;   
    backgroundAngle = 0;
    Context3.restore();

    //폭멸탄 변수 초기화 
    timmer_sound.pause();
    laser_charge_total_time = 0;
    laser_charge_start_time  = gameTime;  

}

////////////////// 플레이어 변수 초기화
function player_init(){
 
     
    //이전 플레이어 진행방향 키값 => 속도변경시 방향키 새로 안눌러두 이전 방향으로 계속해서 진행되도록 하기위해 필요
    wayBefore = null;
    wayBefore2 = null;
    playerWidth = ini_player_width;
    playerHeight = ini_player_height;
    player_size = ini_player_size;
    playerX = ini_playerX;
    playerY = ini_playerY;
    pmovex = 0;
    pmovey = 0;
    Pspeed = ini_Pspeed;
    before_pspeed = 10;
    player_life = ini_player_life;
    playerImage = player;
    playerSword_Image = noneImage;
    playerSkillImage = playerSkill_01Image;
    laserImage = laser;
    player_warp = warp;

    //폭멸탄 변수 초기화 
    timmer_sound.pause();
    laser_charge_total_time = 0;
    laser_charge_start_time  = gameTime;  
    //l_width = 2;  
    //skill = 1;
    //laser_charge_start_time = gameTime;
    //player_cnt = ini_player_cnt;
    //enginImage = enginImage;
    //enginImage.src = enginImage.src;
    power = 1;
    //무적시간
    ready_time = ini_ready_time;
    //조준관역 좌표도 기본으로
    xxAim = 0;
    yyAim = 0;
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

////////////////// 적 거리
function enemy_didtance(){

    //게임방향타겟(배경 중심점)으로부터의 거리
    this.Edistance = Math.sqrt(Math.pow(Math.abs(parseInt(((theCanvas.clientWidth / 2  + cityEnd_x) - this.enemyx))),2) + Math.pow(Math.abs(parseInt(theCanvas.clientHeight / 4 - this.enemyy)),2));

}

////////////////// 플레이어 이동
var angle=0;
function player_move(){ 

    //플레이어 초기 시작시 잠시만 무적 모드
    ready_time--;
    directionDblTime++;

    if (directionDblTime < 100 && isKeyCode == isBfKeyCode && isBfKeyCode != null){ 
        //console.log("isBfKeyCode + ',' + directionDblTime:", isBfKeyCode + ',' + directionDblTime);
        directionDblTime = 0;
        isBfKeyCode = null;

        laser_yn = 'N';
        sword_yn = 'N';
        
    }

    if (ready_time > 0 ){ 
        warp_sound.currentTime  = 0;
        warp_sound.play();
        playerImage = player_shield; 
        player_collision_yn = 'Y'; 
        wayBefore = null;
        wayBefore2 = null;
        isKeyDown = [];
        isKeyCode = null;  
        
        laser_yn = 'N';
        sword_yn = 'N';
    }else { 
        playerImage = player;
        player_collision_yn = 'N'; 
    }

    //플레이어가 움직이면 필살기 충전은 초기환된다.
    //laser_charge_total_time = 0;
    //laser_charge_start_time = gameTime;
    //+ power/50000;
    //방향이동(키이벤트보다는 프레임에 설정하는게 더 부드러움.)
	//대각선방향 => 상하좌우키 동시 누른것과 같음.
	//좌상
	if (isKeyDown[103] || isKeyCode == 36 ) {
        wayBefore = 'LU';
		//pmovex = pmovex - 0.1 * Pspeed/2;
        //pmovey = pmovey - 0.1 * Pspeed/2;
        pmovex = pmovex - Pspeed;
        pmovey = pmovey - Pspeed;        
        playerImage = player_135;
	}else

	//우상
	if (isKeyDown[105] || isKeyCode == 33  ) {
        wayBefore = 'RU';
		//pmovex = pmovex + 0.1 * Pspeed/2;
        //pmovey = pmovey - 0.1 * Pspeed/2;
        pmovex = pmovex + Pspeed;
        pmovey = pmovey - Pspeed;
        playerImage = player_45;
	}else

	//좌하
	if (isKeyDown[97] || isKeyCode == 35 ) {
        wayBefore = 'LD';
		//pmovex = pmovex - 0.1 * Pspeed/2;
        //pmovey = pmovey + 0.1 * Pspeed/2;
        pmovex = pmovex - Pspeed;
        pmovey = pmovey + Pspeed;
        //playerImage = player;
        playerImage = player_135;
	}else

	//우하
	if (isKeyDown[99] || isKeyCode == 34 ) {
        wayBefore = 'RD';
		//pmovex = pmovex + 0.1 * Pspeed/2;
        //pmovey = pmovey + 0.1 * Pspeed/2;
		pmovex = pmovex + Pspeed;
        pmovey = pmovey + Pspeed;        
        //playerImage = player;
        playerImage = player_45;
	}else { 
        //87/65/83/68
        //좌
        if (strKeyEventValue == "ArrowLeft"  || isKeyCode == 37 || isKeyDown[65] || isKeyCode == 65){
            //--pmovex;
            wayBefore = 'L'; 
            strKeyEventValue = "ArrowLeft";
            //pmovex = pmovex - 0.1 * Pspeed / 2;
            pmovex = pmovex - Pspeed;
            playerImage = player_180;

        }

        //우
        if (strKeyEventValue == "ArrowRight"  || isKeyCode == 39 || isKeyDown[68] || isKeyCode == 68){
            //++pmovex;
            wayBefore = 'R';
            strKeyEventValue = "ArrowRight";
            //pmovex = pmovex + 0.1 * Pspeed / 2;
            pmovex = pmovex + Pspeed;
            playerImage = player_360; 
        }

        //상
        if (strKeyEventValue == "ArrowUp"   || isKeyCode == 38 || isKeyDown[87] || isKeyCode == 87){
            wayBefore = 'U';
            strKeyEventValue = "ArrowUp";
            //pmovey = pmovey - 0.1 * Pspeed / 2;
            pmovey = pmovey - Pspeed;
            playerImage = player_90;
        }

        //하
        if (strKeyEventValue == "ArrowDown"   || isKeyCode == 40 || isKeyDown[83] || isKeyCode == 83){
            wayBefore = 'D';
            strKeyEventValue = "ArrowDown";
            //pmovey = pmovey + 0.1 * Pspeed / 2;
            pmovey = pmovey + Pspeed;
            playerImage = player_270;
        }

        //이전키코드
        if(isKeyCode) isBfKeyCode = isKeyCode;
        
        //이전 방향키 
        if(wayBefore) wayBefore2 = wayBefore;
    }

	//와프(공간 이동)
	//if (isKeyDown[17] || isKeyCode == 17) {
    if (isKeyDown[16] || isKeyCode == 16) {

        //alert(wayBefore + "," + wayBefore2);
        
        warp_sound.currentTime  = 0;
        warp_sound.play();

        //조준관역 좌표도 기본으로
        xxAim = 0;
        yyAim = 0;   
        
        //와프 이미지로 변경
        for (var i=0;i<=warp_distance + power/100;i++){

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

            isKeyDown = [];
            isKeyCode = null;            
        }

       isKeyDown = [];
       isKeyCode = null;
       wayBefore = null;
       //if (!(wayBefore)) wayBefore = wayBefore2;

        //wayBefore = null;
        pmovex = 0;
        pmovey = 0;

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

        //공격 스킬구분에 따른 공격 레이져 초기변수(레이져 스킬인 1인경우만 레이져 사운드 재생)
        // if (skill == 0){
        //     sword_sound.currentTime  = 0.2;
        //     sword_sound.play(); 
        // }else 

        if (skill == 1){
            shootgun_sound.currentTime  = 0.2;
            shootgun_sound.play(); 
        }else if (skill == 2){
            laser_sound.currentTime  = 0;
            laser_sound.play();
        }else if (skill == 3){
            laser_charge_total_time = 0;
            laser_charge_start_time  = gameTime;  
            //폭탄 장착 소리 추가
            timmer_sound.currentTime  = 0.8;
            timmer_sound.play();
        }else if (skill == 4){
            laser_charge_total_time = 0;
            laser_charge_start_time  = gameTime;  
            warp_sound.play();
        }else if (skill == 5){
            
            // if(laser_charge_total_time > 0) return;
            // if(l_width < 32) return;
 
            missile_sound.currentTime  = 0.8;
            missile_sound.play();
        }

        isKeyDown = [];
        isKeyCode = null;   
	}

    //스킬체인지
    //if(isKeyCode == 16 || isKeyCode == 12){
    if(isKeyCode == 67){
        pmovex = 0;
        pmovey = 0;
        playerImage = player;
    }

    //이동좌표에 따른 플레이어 사이즈 조정
    playerX = playerX + pmovex;
    playerY = playerY + pmovey;

    // playerWidth = ini_player_width * player_size/100000*Pdistance*0.8
    // playerHeight = ini_player_height * player_size/100000*Pdistance*0.8
    // playerWidth = ini_player_width * player_size/100000*Pdistance*0.6;
    // playerHeight = ini_player_height * player_size/100000*Pdistance*0.6;
    playerWidth = ini_player_width * player_size/100000*Pdistance*0.4;
    playerHeight = ini_player_height * player_size/100000*Pdistance*0.4;
    
    //멀리 가도 플레이어 최소크기는 유지
    if (parseInt(playerWidth) <= parseInt(ini_player_width/3)){
        playerWidth = parseInt(ini_player_width/3);
    }
    if (parseInt(playerHeight) <= parseInt(ini_player_height/3)){
        playerHeight = parseInt(ini_player_height/3);
    } 

    if (skill == 1){   
        if(!(playerSkillImage.src == playerSkill_01Image.src || playerSkillImage.src == noneImage.src)){
            // for(var k=0;k<=playerY-10;k++){
            //     Context.drawImage(playerSkillImage,playerX+10,k,playerWidth/2,playerHeight/2); 
            // }
            playerSkillImage = playerSkill_01Image;  
            for(var k=theCanvas.clientHeight;k>=playerY-10;k--){  
                Context6.drawImage(playerSkillImage,playerX+k/6,k,playerWidth/2-k/4,playerHeight/2); 
            }            
        }
     
        Context6.drawImage(playerSkillImage,playerX+10,playerY-10,playerWidth/1.2,playerHeight/2); 
    }

    if (skill == 2){ 
        if (!(playerSkillImage.src == playerSkill_02Image.src ||
              playerSkillImage.src == playerSkill_02UpImage.src ||
              playerSkillImage.src == playerSkill_02LeftImage.src ||
              playerSkillImage.src == playerSkill_02DownImage.src ||
              playerSkillImage.src == playerSkill_02RightImage.src || 
              playerSkillImage.src == noneImage.src)
        ){      
              playerSkillImage = playerSkill_02Image; 
              for(var k=theCanvas.clientHeight;k>=playerY-10;k--){  
                Context.drawImage(playerSkillImage,playerX+k/6,k,playerWidth/2+k/4,playerHeight/2); 
              }   
        }        
        
        if(135 <= parseInt(laser_d) && parseInt(laser_d) < 225){
            playerSkillImage = playerSkill_02LeftImage; 
        Context6.drawImage(playerSkillImage,playerX-15,playerY-25,playerWidth*1.8 + Math.floor(Math.random() * 5 + 1),playerHeight*1.5 + Math.floor(Math.random() * 5 + 1));
        }else if(225 <= parseInt(laser_d) && parseInt(laser_d) < 315){
            playerSkillImage = playerSkill_02DownImage; 
        Context6.drawImage(playerSkillImage,playerX-20,playerY-20,playerWidth*1.8 + Math.floor(Math.random() * 15 + 1),playerHeight*1.5 + Math.floor(Math.random() * 10 + 1));
        }else if(315 <= parseInt(laser_d) && parseInt(laser_d) < 360){
            playerSkillImage = playerSkill_02RightImage; 
        Context6.drawImage(playerSkillImage,playerX-22,playerY-22,playerWidth*1.8 + Math.floor(Math.random() * 10 + 1),playerHeight*1.5 + Math.floor(Math.random() * 15 + 1));
        }else {
            playerSkillImage = playerSkill_02UpImage; 
            Context6.drawImage(playerSkillImage,playerX-20,playerY-25,playerWidth*1.8 + Math.floor(Math.random() * 20 + 1),playerHeight*1.5 + Math.floor(Math.random() * 15 + 1));
        } 
    } 

    if (skill == 3){   
       
        //alert(playerSkillImage.src+","+playerSkill_03Image.src+","+playerSkill_03TmpImage.src)
        if(!(playerSkillImage.src == playerSkill_03Image.src || playerSkillImage.src == noneImage.src)){
            playerSkillImage = playerSkill_03Image;    
            for(var k=theCanvas.clientHeight;k>=playerY-10;k--){  
                Context6.drawImage(playerSkillImage,playerX+k/6,k,playerWidth/2-k/4,playerHeight/2); 
            }       
      
        }     
    
        Context6.drawImage(playerSkillImage,playerX-10,playerY-25,playerWidth*1.4,playerHeight*0.6);    
       
    }

    if (skill == 4){   
        
        if(!(playerSkillImage.src == playerSkill_04Image.src || playerSkillImage.src == noneImage.src)){
            playerSkillImage = playerSkill_04Image;    
            for(var k=theCanvas.clientHeight;k>=playerY-10;k--){  
                Context6.drawImage(playerSkillImage,playerX+k/6,k,playerWidth/2-k/4,playerHeight/2); 
            }       
      
        }     
    
        Context6.drawImage(playerSkillImage,playerX-10,playerY-25,playerWidth*1.4,playerHeight*0.6);    
       
    }    


    if (skill == 5){   
        if(!(playerSkillImage.src == playerSkill_05Image.src || playerSkillImage.src == noneImage.src)){
            playerSkillImage = playerSkill_05Image;    
            for(var k=theCanvas.clientHeight;k>=playerY-10;k--){  
                Context6.drawImage(playerSkillImage,playerX+k/6,k,playerWidth/2-k/4,playerHeight/2); 
            }       
      
        }     
    
        Context6.drawImage(playerSkillImage,playerX-4,playerY+2,playerWidth*1.5,playerHeight*0.6);   
    }

    Context.drawImage(playerImage,playerX,playerY,playerWidth + Math.floor(Math.random() * 2),playerHeight + Math.floor(Math.random() * 3));
  
    //엔진 부스터 방향
    //전진,좌상,우상
    if (strKeyEventValue == "ArrowUp" || isKeyCode == 38 || isKeyDown[103] || isKeyCode == 36 || isKeyCode == 87 || isKeyDown[105] || isKeyCode == 33){
        // engin01_sound.currentTime  = 2;
        // engin01_sound.play();   //엔진 점화 사운드
        Context.drawImage(player_enginImage,playerX + playerWidth/2,playerY + playerHeight/30,playerWidth/5 + Math.floor(Math.random() * 3),playerHeight/4 + Math.floor(Math.random() * 4));
        Context.drawImage(player_enginImage,playerX + playerWidth/3,playerY + playerHeight/30,playerWidth/5 + Math.floor(Math.random() * 3),playerHeight/4 + Math.floor(Math.random() * 4));
        Context.drawImage(player_enginImage,playerX + playerWidth/2,playerY + playerHeight/15,playerWidth/5 + Math.floor(Math.random() * 5),playerHeight/4 + Math.floor(Math.random() * 3));
        Context.drawImage(player_enginImage,playerX + playerWidth/3,playerY + playerHeight/15,playerWidth/5 + Math.floor(Math.random() * 6),playerHeight/4 + Math.floor(Math.random() * 5));
    }
    //좌
    if (strKeyEventValue == "ArrowLeft"  || isKeyCode == 37  || isKeyDown[65] || isKeyCode == 65){
        //engin01_sound.currentTime  = 1;
        //engin01_sound.play();
        Context.drawImage(player_enginImage,playerX  + playerWidth/9,playerY + playerHeight/8,playerWidth/3 + Math.floor(Math.random() * 3),playerHeight/7 + Math.floor(Math.random() * 2));
        Context.drawImage(player_enginImage,playerX + playerWidth/5,playerY + playerHeight/10,playerWidth/2 + Math.floor(Math.random() * 4),playerHeight/8 + Math.floor(Math.random() * 3));
        Context.drawImage(player_enginImage,playerX  + playerWidth/8,playerY + playerHeight/6,playerWidth/3 + Math.floor(Math.random() * 3),playerHeight/7 + Math.floor(Math.random() * 2));
        Context.drawImage(player_enginImage,playerX + playerWidth/4,playerY + playerHeight/6,playerWidth/2 + Math.floor(Math.random() * 4),playerHeight/8 + Math.floor(Math.random() * 3));
    }
	//우
    if (strKeyEventValue == "ArrowRight"  || isKeyCode == 39 || isKeyDown[68] || isKeyCode == 68){
        //engin01_sound.currentTime  = 1;
        //engin01_sound.play();
        Context.drawImage(player_enginImage,playerX  + playerWidth/1.9,playerY + playerHeight/8,playerWidth/3 + Math.floor(Math.random() * 3),playerHeight/7 + Math.floor(Math.random() * 2));
        Context.drawImage(player_enginImage,playerX + playerWidth/4,playerY + playerHeight/10,playerWidth/2 + Math.floor(Math.random() * 4),playerHeight/8 + Math.floor(Math.random() * 3));
        Context.drawImage(player_enginImage,playerX  + playerWidth/2,playerY + playerHeight/6,playerWidth/3 + Math.floor(Math.random() * 3),playerHeight/7 + Math.floor(Math.random() * 2));
        Context.drawImage(player_enginImage,playerX + playerWidth/4,playerY + playerHeight/6,playerWidth/2 + Math.floor(Math.random() * 4),playerHeight/8 + Math.floor(Math.random() * 3));

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
    lmovex2 = laserX - 15;
    lmovey2 = laserY - 15;
    lmovex3 = laserX + 15;
    lmovey3 = laserY - 15;
    lmovex4 = laserX - 15;
    lmovey4 = laserY + 15;

    //레이져 초기 크기
    l_height = 1;
    l_width = 2; 

    //레이져 초기 속도
    lspeed = 1;
    //레이져 발사 여부
    laser_yn = 'N'; 
             
    //레이져 초기화
    laser_charge_total_time = 0;      
    laser_charge_start_time  = gameTime;
    l_width = 2;   
    
    // //조준관역 좌표도 기본으로
    // xxAim = 0;
    // yyAim = 0; 

    // smovex = playerX + playerWidth/2;
    // smovey = playerY;  
    // sword_yn = 'N'; 

}


////////////////// 플레이어 검 공격
function sword_move(){    
    if (sword_yn == 'Y'){
        laser_yn = 'N'; 
        //sword_yn = 'Y'; 
        //조준관역 좌표도 기본으로
        xxAim = 0;
        yyAim = 0; 
    
        smovex = playerX + playerWidth/2;
        smovey = playerY;   
        //laser_init(); 

        //lmovey = 0;
        //lmovey = 0;
        tmp_skill = null; 
        sword_sound.currentTime  = 0.2;
        sword_sound.play(); 

        if (isKeyCode == 39 || isKeyCode == 68 || isKeyCode == 37 || isKeyCode == 65){
            //기합소리01
            shout03_sound.currentTime  = 0.3;
            shout03_sound.play(); 
       }else {
            //기합소리02
            shout02_sound.currentTime  = 0.5;
            shout02_sound.play(); 
            //기합소리01
            //shout01_sound.currentTime  = 0.2;
            //shout01_sound.play();             
       } 

        // s_width = 100;  
        // s_height = 100;
        s_width = playerWidth*1.6;  
        s_height = playerHeight*1.6;  
        
        //playerSword_Image=noneImage;

        for (var i=0;i<=4;i++){   
                
                //87/65/83/68  
                //우
                if (isKeyCode == 39 || isKeyCode == 68){
                playerSword_Image=playerSword_RightImage;
                Context.drawImage(playerSword_Image,smovex-- - 10,smovey - 40,s_width--,s_height--);  
                //lmovex = smovex;
                //lmovey = smovey - 40;
                //좌
                }else
                if (isKeyCode == 37 || isKeyCode == 65){
                playerSword_Image=playerSword_LeftImage;
                Context.drawImage(playerSword_Image,smovex++ - 80,smovey - 40,s_width--,s_height--);  
                //lmovex = smovex - 90;
                //lmovey = smovey - 40;
                //하
                }else
                if (isKeyCode == 40 || isKeyCode == 83){
                playerSword_Image=playerSword_DownImage;
                Context.drawImage(playerSword_Image,smovex - 45,smovey--,s_width--,s_height--);  
                //lmovex = smovex - 45;
                //lmovey = smovey + 10;
                //상
                }else
                if (isKeyCode == 38 || isKeyCode == 87){
                //lmovex = smovex - 45;
                //lmovey = smovey - 80;
                playerSword_Image=playerSword_UpImage;
                Context.drawImage(playerSword_Image  ,smovex - 45,--smovey - 60,s_width--,s_height--);  
                }else {
                    //lmovex = smovex - 45;
                    //lmovey = smovey - 80;
                    playerSword_Image=playerSword_StopImage;
                    Context.drawImage(playerSword_Image  ,smovex - 36,--smovey - 24,s_width--*0.8,s_height--*0.6);   
                    //wayBefore = "";
                } 
                 
        }  

        sword_yn = 'N'; 
    }

}
////////////////// 플레이어 레이져 경로  
targetX = 0;
targetY = 0;
function laser_move(){ 

    //폭멸탄은 총알이 적을 관통(폭파)해도 계속 진행된다.
    if (laser_yn == 'Y' || skill == 3 ){

        //ld = Math.floor(Pdistance/10); 
       if (skill == 1){  
            laserImage = laser01;
            //console.log("laser_r + "," + laser_d->",laser_r + "," + laser_d);

            if (wayBefore=='L'){
                xxAim = xxAim - 6; 
            }else if (wayBefore=='R'){
                xxAim = xxAim + 6;
            }else if (wayBefore=='U'){
                yyAim = yyAim - 6; 
            }else if (wayBefore=='D'){
                yyAim = yyAim + 6;
            }else if (wayBefore=='LU') {
                xxAim = xxAim - 6;
                yyAim = yyAim - 6;
            }else if (wayBefore=='RU') {
                xxAim = xxAim + 6;
                yyAim = yyAim - 6;
            }else if (wayBefore=='LD') {
                xxAim = xxAim - 6;
                yyAim = yyAim + 6;
            }else if (wayBefore=='RD') {
                xxAim = xxAim + 6;
                yyAim = yyAim + 6;
            }else {
                xxAim = 0;
                yyAim = 0;
            }              

            //console.log("xx,yy->",xx+","+yy);
            //표적이 보여진다.
            Context4.beginPath();
            Context4.globalAlpha = 0.3;
            Context4.arc(theCanvas.clientWidth / 2 + xxAim  , theCanvas.clientHeight / 4 + yyAim, 80/4 + playerHeight/4, 0, Math.PI * 2);
            Context4.globalAlpha = 0.4
            Context4.arc(theCanvas.clientWidth / 2 + xxAim  , theCanvas.clientHeight / 4 + yyAim, 40/6 + playerHeight/5, 0, Math.PI * 2);
            Context4.globalAlpha = 0.5;
            Context4.arc(theCanvas.clientWidth / 2 + xxAim  , theCanvas.clientHeight / 4 + yyAim, 5, 0, Math.PI * 2);
            Context4.lineWidth = "1"; 
            // Context4.strokeStyle = "#008000";
            // Context4.fillStyle = "#008000";
            Context4.strokeStyle = "white";
            Context4.fillStyle = "white";
            Context4.stroke();  

            //표적이 경계밖으로 나가려고 하면
            if((theCanvas.clientWidth / 2 + xxAim) > maxX){
                xxAim = xxAim - 20;
                //yyAim = 0;
            } 
            if((theCanvas.clientWidth / 2 + xxAim) < 0){
                xxAim = xxAim + 20;
                //yyAim = 0;
            }  
            if(( theCanvas.clientHeight / 4 + yyAim) > maxY){
                //xxAim = 0;
                yyAim = yyAim - 20;
            }             
            if(( theCanvas.clientHeight / 4 + yyAim) < 0){
                //xxAim = 0;
                yyAim = yyAim + 20;
            }                       

            Context4.globalAlpha = 0.9;
            //ld = Math.floor(Pdistance/10);
            //l_height = 100;
            l_width = 8;
            l_height = 8; 
            
            //플레이어 미사일이 발사되고 시간이 경과되면 크기가 작아진다.
            l_width = l_width - laser_charge_total_time/2;
            l_height = l_height -  laser_charge_total_time/2; 
            if(l_width<0){
                l_width=0;
                l_height=0;
                laserImage=noneImage
            } 

            for (var i=0;i<=100;i++){ 

                //표적이 플레이어보다 상단에 있으면 총알은 상단으로
                if ((playerY + playerHeight/2) >=  theCanvas.clientHeight/4 + yyAim){   
                    lmovey = lmovey - ((playerY + playerHeight/2) - theCanvas.clientHeight/4 - yyAim)/400;  
                }else { 
                //하단에 있으면
                    lmovey = lmovey + (theCanvas.clientHeight/4 + yyAim - (playerY - playerHeight/2))/400;               
                } 

                //표적이 플레이어보다 좌측에 있으면 총알은 좌측으로
                if((playerX + playerWidth/2) >=  (theCanvas.clientWidth/2 + xxAim)){ 
                    lmovex = lmovex  + (theCanvas.clientWidth/2 + xxAim - (playerX + playerWidth/2))/400; 
                }else { 
                //우측에 있으면
                    lmovex = lmovex - ((playerX - playerWidth/2) - theCanvas.clientWidth/2 - xxAim)/400;
                } 
                                
                //표적과 플레이어가 수직일경우
                if((playerX + playerWidth/2) > theCanvas.clientWidth / 2 + xxAim - 60 && (playerX + playerWidth/2) < theCanvas.clientWidth / 2 + xxAim + 60 ){
                    //타켓이 플레이어보다 상단에 있으면 총알은 상단으로
                    if ((playerY + playerHeight/2) >=  theCanvas.clientHeight/4 + yyAim){   
                        lmovey = lmovey - ((playerY + playerHeight/2) - theCanvas.clientHeight/4 - yyAim)/400;  
                    }else { 
                        lmovey = lmovey + (theCanvas.clientHeight/4 + yyAim - (playerY - playerHeight/2))/400;               
                    } 

                    //타켓이 플레이어보다 좌측에 있으면 총알은 좌측으로
                    if((playerX + playerWidth/2) >=  (theCanvas.clientWidth/2 + xxAim)){ 
                        lmovex = lmovex  + (theCanvas.clientWidth/2 + xxAim - (playerX + playerWidth/2))/400; 
                    }else { 
                        lmovex = lmovex - ((playerX - playerWidth/2) - theCanvas.clientWidth/2 - xxAim)/400;
                    } 

                    if ((playerY + playerHeight/2) >= (theCanvas.clientHeight/4 + yyAim) && (lmovey <= theCanvas.clientHeight/4 + yyAim)){
                        l_width = l_width - 0.001;
                        l_height = l_height - 0.001;  
                        return; 
                    }

                    if ((playerY + playerHeight/2) <= (theCanvas.clientHeight/4 + yyAim) && (lmovey >= theCanvas.clientHeight/4 + yyAim)){
                        l_width = l_width - 0.001;
                        l_height = l_height - 0.001;  
                        return; 
                    }  
                    //alert(lmovex+","+lmovey+","+l_height) 
                    Context.drawImage(laserImage,lmovex,lmovey,l_width,l_height); 
                    //Context4.lineWidth = "0.5"
                    continue;
                } 
                
                //표적에 들어오면 총알이 작아진다. 
                if (((playerX + playerWidth/2) >= theCanvas.clientWidth/2 + xxAim - 40 && playerX <= theCanvas.clientWidth/2 + xxAim + 40 )) 
                {    
                    //console.log("l");
                    l_width = l_width - 0.01;
                    l_height = l_height - 0.01;   
                    
                    if ((playerY + playerHeight/2) >= (theCanvas.clientHeight/4 + yyAim) && (lmovey <= theCanvas.clientHeight/4 + yyAim)){
                        l_width = l_width - 0.02;
                        l_height = l_height - 0.02;  
                        return; 
                    }

                    if ((playerY + playerHeight/2) <= (theCanvas.clientHeight/4 + yyAim) && (lmovey >= theCanvas.clientHeight/4 + yyAim)){
                        l_width = l_width - 0.02;
                        l_height = l_height - 0.02;  
                        return; 
                    }     
                    if(l_width<0){
                        l_width=0;
                        l_height=0;
                        laserImage=noneImage
                    } 
                    Context.drawImage(laserImage,lmovex,lmovey,l_width,l_height);
                    return;
                } 
                
                if ((lmovex >= theCanvas.clientWidth/2 + xxAim - 40 && lmovex <= theCanvas.clientWidth/2 + xxAim + 40 )) 
                {    
                    l_width = l_width - 0.02;
                    l_height = l_height - 0.02;  
                    if(l_width<0){
                        l_width=0;
                        l_height=0;
                        laserImage=noneImage
                    } 
                    Context.drawImage(laserImage,lmovex,lmovey,l_width,l_height);   
                    return;
                }

                //표적에 들어오면 총알을 작아진다.
                if (((playerY + playerHeight/2) <= theCanvas.clientHeight/4 + yyAim - 40 && (playerY + playerHeight/2) >= theCanvas.clientHeight/4 + yyAim + 40 )) 
                { 
                    l_width = l_width - 0.02;
                    l_height = l_height - 0.02;
                    if(l_width<0){
                        l_width=0;
                        l_height=0;
                        laserImage=noneImage
                    } 
                    Context.drawImage(laserImage,lmovex,lmovey,l_width,l_height);   
                    return;   
                }
                if (lmovey <= theCanvas.clientHeight/4 + yyAim - 40 && lmovey >= theCanvas.clientHeight/4 + yyAim + 40 )
                {
                    //alert(l_width + "," +l_height );
                    //l_width = 0;
                    //l_height = 0;
                    l_width = l_width - 0.02;
                    l_height = l_height - 0.02; 
                    if(l_width<0){
                        l_width=0;
                        l_height=0;
                        laserImage=noneImage
                    } 
                    Context.drawImage(laserImage,lmovex,lmovey,l_width,l_height);  
                    return;
                }          

                //표적과 플레이어가 수평일경우
                if ((playerY - playerHeight/2) >= (theCanvas.clientHeight/4 + yyAim) && (lmovey <= theCanvas.clientHeight/4 + yyAim)){
                    l_width = l_width - 0.02;
                    l_height = l_height - 0.02; 
                    if(l_width<0){
                        l_width=0;
                        l_height=0;
                        laserImage=noneImage
                    }  
                    Context.drawImage(laserImage,lmovex,lmovey,l_width,l_height);  
                    return; 
                }

                if ((playerY - playerHeight/2) <= (theCanvas.clientHeight/4 + yyAim) && (lmovey >= theCanvas.clientHeight/4 + yyAim)){
                    l_width = l_width - 0.02;
                    l_height = l_height - 0.02;  
                    if(l_width<0){
                        l_width=0;
                        l_height=0;
                        laserImage=noneImage
                    } 
                    Context.drawImage(laserImage,lmovex,lmovey,l_width,l_height);  
                    return; 
                }  

 
                //alert(lmovex+","+lmovey+","+l_height) 
                Context.drawImage(laserImage,lmovex,lmovey,l_width,l_height); 
                //Context4.lineWidth = "0.5"
            }    
        //레이져  
        }else if (skill == 2){  
            laserImage = laser;
 
            Context4.beginPath();
            Context4.moveTo(lmovex, lmovey + 60 - laser_charge_total_time*2);
            Context4.lineTo(lmovex - 40 + laser_charge_total_time*4, lmovey - 40 + laser_charge_total_time*4);
            Context4.lineTo(lmovex + 40 - laser_charge_total_time*4, lmovey - 40 + laser_charge_total_time*4);
            Context4.closePath();
            Context4.strokeStyle = "white";; //선 색상 
            Context4.stroke();

            Context4.beginPath();
            Context4.moveTo(lmovex2, lmovey2 + 60 - laser_charge_total_time*2);
            Context4.lineTo(lmovex2 - 40 + laser_charge_total_time*4, lmovey2 - 40 + laser_charge_total_time*4);
            Context4.lineTo(lmovex2 + 40 - laser_charge_total_time*4, lmovey2 - 40 + laser_charge_total_time*4);
            Context4.closePath();
            Context4.strokeStyle = "white";; //선 색상 
            Context4.stroke();     
            
            Context4.beginPath();
            Context4.moveTo(lmovex3, lmovey3 + 60 - laser_charge_total_time*2);
            Context4.lineTo(lmovex3 - 40 + laser_charge_total_time*4, lmovey3 - 40 + laser_charge_total_time*4);
            Context4.lineTo(lmovex3 + 40 - laser_charge_total_time*4, lmovey3 - 40 + laser_charge_total_time*4);
            Context4.closePath();
            Context4.strokeStyle = "white";; //선 색상 
            Context4.stroke(); 
            
            Context4.beginPath();
            Context4.moveTo(lmovex4, lmovey4 + 60 - laser_charge_total_time*2);
            Context4.lineTo(lmovex4 - 40 + laser_charge_total_time*4, lmovey4 - 40 + laser_charge_total_time*4);
            Context4.lineTo(lmovex4 + 40 - laser_charge_total_time*4, lmovey4 - 40 + laser_charge_total_time*4);
            Context4.closePath();
            Context4.strokeStyle = "white";; //선 색상 
            Context4.stroke();             
          
            for (var i=0;i<=(Math.floor(Math.random()*50) + 100);i++){   
                    //플레이어 거리에 따른 레이져 크기 변경
                    l_height = 1 + power/1000;
                    l_height = l_height*(Pdistance/200); 
 
                    //공격 버튼 누른 각도의 위치를 라디안값으로 변환한다.
                    lmovex = lmovex + Math.cos(laser_d * Math.PI / 180); //(코사인 * 루트(x제곱 + y제곱)
                    lmovey = lmovey + Math.sin(laser_d * Math.PI / 180) * - 1; //(사인 * 루트(x제곱 + y제곱)
         
                    Context.drawImage( laserImage,lmovex,lmovey--,l_width,l_height);        
            }  

            for (var i=0;i<=(Math.floor(Math.random()*50) + 100);i++){   
                //플레이어 거리에 따른 레이져 크기 변경
                l_height = 1 + power/1000;
                l_height = l_height*(Pdistance/200); 

                //공격 버튼 누른 각도의 위치를 라디안값으로 변환한다.
                lmovex2 = lmovex2 + Math.cos(laser_d * Math.PI / 180); //(코사인 * 루트(x제곱 + y제곱)
                lmovey2 = lmovey2 + Math.sin(laser_d * Math.PI / 180) * - 1; //(사인 * 루트(x제곱 + y제곱)
     
                Context.drawImage( laserImage,lmovex2 -- +10,lmovey2,l_width,l_height);        
            }  
            
            for (var i=0;i<=(Math.floor(Math.random()*50) + 100);i++){   
                //플레이어 거리에 따른 레이져 크기 변경
                l_height = 1 + power/1000;
                l_height = l_height*(Pdistance/200); 

                //공격 버튼 누른 각도의 위치를 라디안값으로 변환한다.
                lmovex3 = lmovex3 + Math.cos(laser_d * Math.PI / 180); //(코사인 * 루트(x제곱 + y제곱)
                lmovey3 = lmovey3 + Math.sin(laser_d * Math.PI / 180) * - 1; //(사인 * 루트(x제곱 + y제곱)
     
                Context.drawImage( laserImage,lmovex3-- +20,lmovey3-- +30,l_width,l_height);        
            }   
            
              for (var i=0;i<=(Math.floor(Math.random()*50) + 100);i++){   
                //플레이어 거리에 따른 레이져 크기 변경
                l_height = 1 + power/1000;
                l_height = l_height*(Pdistance/200); 

                //공격 버튼 누른 각도의 위치를 라디안값으로 변환한다.
                lmovex4 = lmovex4 + Math.cos(laser_d * Math.PI / 180); //(코사인 * 루트(x제곱 + y제곱)
                lmovey4 = lmovey4 + Math.sin(laser_d * Math.PI / 180) * - 1; //(사인 * 루트(x제곱 + y제곱)
     
                Context.drawImage( laserImage,lmovex4+40,lmovey4+40,l_width,l_height);        
            }                
        //폭멸탄
        }else if (skill == 3){  
            laserImage = laser02;
            //if (80 <= laser_charge_total_time && laser_charge_total_time <= 100){     //시간이 되면 자동 폭파  
            //60fps시 충전시간은 * 2  
            
            if (80 * (ini_gameFrame/30) <= laser_charge_total_time && laser_charge_total_time <= 100 * (ini_gameFrame/30)){     //시간이 되면 자동 폭파                    
                laser_yn='Y'; 
                for (var i=0;i<10;i++){  
                    explosion_sound.play();
                    explosion_sound.currentTime  = 0;
                    l_width = (playerWidth*playerHeight)/160;   
                    l_height = (playerWidth*playerHeight)/160; 
                    l_width=l_width + i - Math.floor(Math.random()*150);
                    l_height=l_height + i - Math.floor(Math.random()*150);
                    playerSkill_03TmpImage = noneImage; 
                    Context.drawImage(explosionImage01,lmovex+Math.floor(Math.random()*40),lmovey+Math.floor(Math.random()*40),l_width,l_height); 
                    Context.drawImage(laserImage,lmovex+Math.floor(Math.random()*40),lmovey+Math.floor(Math.random()*40),l_width,l_height);
                    Context.drawImage(laserImage,lmovex-Math.floor(Math.random()*40),lmovey-Math.floor(Math.random()*40),playerWidth*0.8,playerHeight*0.6); 
                 }   
            }  
        //이온포
        }else if (skill == 4){  
            laserImage = laser02; 


            if (15 <= laser_charge_total_time && laser_charge_total_time <= 30){     //충전이 되면 자동 발사  
                //이온포의 크기는 플레이어의 1/3 크기만큼 
                // l_width = (playerWidth*playerHeight)/240 + Math.floor(Math.random()*50);
                // l_height = (playerWidth*playerHeight)/240 + Math.floor(Math.random()*50);   
                
                l_width = playerWidth/2 + Math.floor(Math.random()*50);
                l_height = playerWidth/3 + Math.floor(Math.random()*50);  

                                            
                //플레이어 미사일이 발사되고 시간이 경과되면 크기가 작아진다.
                l_width = l_width - laser_charge_total_time/12;
                l_height = l_height -  laser_charge_total_time/12; 
                if(l_width<0){
                    l_width=0;
                    l_height=0;
                    laserImage=noneImage
                } 
                
                for (var i=0;i<100;i++){ 

                    l_width = l_width - 0.1;
                    l_height = l_height - 0.2;

                    //최소 크기는 유지
                    if (l_width <= 40) l_width = 40; 
                    if (l_height <= 20) l_height = 20;


                    //공격 버튼 누른 각도의 위치를 라디안값으로 변환한다.
                    lmovex = lmovex + Math.cos(laser_d * Math.PI / 180); //(코사인 * 루트(x제곱 + y제곱)
                    lmovey = lmovey + Math.sin(laser_d * Math.PI / 180) * - 1; //(사인 * 루트(x제곱 + y제곱) 

                    //Context.drawImage(laserImage,lmovex,lmovey,l_height,l_height - i/8);  
                    Context.drawImage(laserImage,lmovex-20,lmovey-40,l_width*(Pdistance/600),l_height*(Pdistance/600));
                    Context.drawImage(laserImage,lmovex-10,lmovey-20,l_width*(Pdistance/600),l_height*(Pdistance/600));
                }  

            }   
        //플레이어미사일
        }else if (skill == 5){ 

            //이전 미사일 크기가 0보다 작을경우만 새로 발사가능
            //if(!(laserImage.src == noneImage.src)) return;
            //alert(l_width)
            //if(l_width > 2) return;
            laserImage = enemy03GunImage;
            //laserImage = weappon02Image;
            //console.log("laser_r + "," + laser_d->",laser_r + "," + laser_d);

            if (wayBefore=='L'){
                xxAim = xxAim - 6; 
            }else if (wayBefore=='R'){
                xxAim = xxAim + 6;
            }else if (wayBefore=='U'){
                yyAim = yyAim - 6; 
            }else if (wayBefore=='D'){
                yyAim = yyAim + 6;
            }else if (wayBefore=='LU') {
                xxAim = xxAim - 6;
                yyAim = yyAim - 4;
            }else if (wayBefore=='RU') {
                xxAim = xxAim + 4;
                yyAim = yyAim - 6;
            }else if (wayBefore=='LD') {
                xxAim = xxAim - 4;
                yyAim = yyAim + 4;
            }else if (wayBefore=='RD') {
                xxAim = xxAim + 6;
                yyAim = yyAim + 6;
            }else {
                // xxAim = 0;
                // yyAim = 0;
                xxAim = 0;
                yyAim--;
            }     

           
            
            //공격 버튼 누른 각도의 위치를 라디안값으로 변환한다.
            lmovex = lmovex + Math.cos(laser_d * Math.PI / 180); //(코사인 * 루트(x제곱 + y제곱)
            lmovey = lmovey + Math.sin(laser_d * Math.PI / 180) * - 1; //(사인 * 루트(x제곱 + y제곱)
            //공격 버튼 누른 각도의 위치를 라디안값으로 변환한다.
            lmovex2 = lmovex2 + Math.cos(laser_d * Math.PI / 180); //(코사인 * 루트(x제곱 + y제곱)
            lmovey2 = lmovey2 + Math.sin(laser_d * Math.PI / 180) * - 1; //(사인 * 루트(x제곱 + y제곱)        
        
            //표적 좌표
            targetX = playerX + playerWidth/2 + xxAim;
            targetY = playerY - 100 + yyAim;   

            //표적이 보여진다.
            // Context4.beginPath();
            // Context4.globalAlpha = 0.3;
            // Context4.arc(lmovex  , lmovey, 80/4 + playerHeight/4 - laser_charge_total_time/60, 0, Math.PI * 2);
            // Context4.globalAlpha = 0.4
            // Context4.arc(lmovex2  , lmovey2, 40/6 + playerHeight/5 - laser_charge_total_time/60, 0, Math.PI * 2);
            // Context4.globalAlpha = 0.5;
            // Context4.arc(lmovex3 , lmovey3, 5, 0, Math.PI * 2);
            // Context4.globalAlpha = 0.6;
            // Context4.arc(lmovex4 , lmovey4, 5, 0, Math.PI * 2);                    
            // Context4.lineWidth = "1"; 
            // // Context4.strokeStyle = "#008000";
            // // Context4.fillStyle = "#008000";
            // Context4.strokeStyle = "white";
            // Context4.fillStyle = "white";
            // Context4.stroke();   
               
            //표적 좌표
            Context4.beginPath();
            Context4.moveTo(lmovex, lmovey);
            Context4.lineTo(lmovex - 20, lmovey - 20 + laser_charge_total_time/4);
            Context4.lineTo(lmovex + 20, lmovey - 20 + laser_charge_total_time/4);
            Context4.closePath();
            Context4.strokeStyle = "white";; //선 색상 
            Context4.stroke();

            Context4.beginPath();
            Context4.moveTo(lmovex2, lmovey2);
            Context4.lineTo(lmovex2 - 20, lmovey2 - 20 + laser_charge_total_time/3);
            Context4.lineTo(lmovex2 + 20, lmovey2 - 20 + laser_charge_total_time/3);
            Context4.closePath();
            Context4.strokeStyle = "white";; //선 색상 
            Context4.stroke();

            Context4.beginPath();
            Context4.moveTo(lmovex3, lmovey3);
            Context4.lineTo(lmovex3 - 20, lmovey3 - 20 + laser_charge_total_time/4);
            Context4.lineTo(lmovex3 + 20, lmovey3 - 20 + laser_charge_total_time/4);
            Context4.closePath();
            Context4.strokeStyle = "white";; //선 색상 
            Context4.stroke();
            
            Context4.beginPath();
            Context4.moveTo(lmovex4, lmovey4);
            Context4.lineTo(lmovex4 - 20, lmovey4 - 20 + laser_charge_total_time/3);
            Context4.lineTo(lmovex4 + 20, lmovey4 - 20 + laser_charge_total_time/3);
            Context4.closePath();
            Context4.strokeStyle = "white";; //선 색상 
            Context4.stroke();            
            //표적이 경계밖으로 나가려고 하면
            if((targetX) > maxX){
                xxAim = xxAim - 20;
                //yyAim = 0;
            } 
            if((targetX) < 0){
                xxAim = xxAim + 20;
                //yyAim = 0;
            }  
            if((targetY) > maxY){
                //xxAim = 0;
                yyAim = yyAim - 20;
            }             
            if((targetY) < 0){
                //xxAim = 0;
                yyAim = yyAim + 20;
            }          
            Context4.globalAlpha = 0.9;
            //ld = Math.floor(Pdistance/10);
            //l_height = 100;
            l_width = 36;
            l_height = 36; 
            
            for (var i=0;i<=30;i++){ 

                //표적이 플레이어보다 상단에 있으면 총알은 상단으로
                if ((playerY + playerHeight/2) >= targetY){   
                    lmovey = lmovey - ((playerY + playerHeight/2) - targetY)/1000;   
                }
                 
                //표적이 플레이어보다 하단에 있으면
                if ((playerY + playerHeight/2) < targetY){  
                    lmovey = lmovey + (targetY - (playerY + playerHeight/2))/680;                 
                }

                //표적이 플레이어보다 좌측에 있으면 총알은 좌측으로  
                if((playerX + playerWidth/2) >= targetX){ 
                    lmovex = lmovex  + (targetX - (playerX + playerWidth/2))/800;  
                } 

                //표적이 플레이어보다 우측에 있으면
                if((playerX + playerWidth/2) < targetX){ 
                    lmovex = lmovex - ((playerX - playerWidth/2) - targetX)/800; 
                } 

                //l_width = l_width - 0.1;
                //l_height = l_height - 0.1;                       
                l_width = l_width - laser_charge_total_time/200;
                l_height = l_height - laser_charge_total_time/200;   

                if(l_width <= 0){ 
                    laserImage = noneImage; 
                }                  
            }   

            Context.drawImage(laserImage,lmovex,lmovey,l_width,l_height);  
         
            //플레이어미사일2   
            l_width = 34;
            l_height = 36;   
            for (var i=0;i<=24;i++){ 

                //표적이 플레이어보다 상단에 있으면 총알은 상단으로
                if ((playerY + playerHeight/2) >= targetY){   
                    lmovey2 = lmovey2 - ((playerY + playerHeight/2) - targetY)/1000;   
                }
                
                //표적이 플레이어보다 하단에 있으면
                if ((playerY + playerHeight/2) < targetY){  
                    lmovey2 = lmovey2 + (targetY - (playerY + playerHeight/2))/680;                 
                }

                //표적이 플레이어보다 좌측에 있으면 총알은 좌측으로  
                if((playerX + playerWidth/2) >= targetX){ 
                    lmovex2 = lmovex2  + (targetX - (playerX + playerWidth/2))/800;  
                } 

                //표적이 플레이어보다 우측에 있으면
                if((playerX + playerWidth/2) < targetX){ 
                    lmovex2 = lmovex2 - ((playerX - playerWidth/2) - targetX)/800; 
                } 

                //l_width = l_width - 0.1;
                //l_height = l_height - 0.1;                       
                l_width = l_width - laser_charge_total_time/160;
                l_height = l_height - laser_charge_total_time/160; 
                
                if(l_width <= 0){ 
                    laserImage = noneImage; 
                }                  
            } 
          
            Context.drawImage(laserImage,lmovex2,lmovey2,l_width,l_height);   
            laserImage = weappon02Image;
            //플레이어미사일3   
            l_width = 38;
            l_height = 34;  
            for (var i=0;i<=28;i++){ 

                //표적이 플레이어보다 상단에 있으면 총알은 상단으로
                if ((playerY + playerHeight/2) >= targetY){   
                    lmovey3 = lmovey3 - ((playerY + playerHeight/2) - targetY)/1000;   
                }
                
                //표적이 플레이어보다 하단에 있으면
                if ((playerY + playerHeight/2) < targetY){  
                    lmovey3 = lmovey3 + (targetY - (playerY + playerHeight/2))/680;                 
                }

                //표적이 플레이어보다 좌측에 있으면 총알은 좌측으로  
                if((playerX + playerWidth/2) >= targetX){ 
                    lmovex3 = lmovex3  + (targetX - (playerX + playerWidth/2))/800;  
                } 

                //표적이 플레이어보다 우측에 있으면
                if((playerX + playerWidth/2) < targetX){ 
                    lmovex3 = lmovex3 - ((playerX - playerWidth/2) - targetX)/800; 
                } 

                //l_width = l_width - 0.1;
                //l_height = l_height - 0.1;                       
                l_width = l_width - laser_charge_total_time/140;
                l_height = l_height - laser_charge_total_time/140;  

                if(l_width <= 0){ 
                    laserImage = noneImage; 
                }                  
            }    
            
            Context.drawImage(laserImage,lmovex3,lmovey3,l_width,l_height); 

            //플레이어미사일4    
            l_width = 32;
            l_height = 34;  
            for (var i=0;i<=26;i++){ 

                //표적이 플레이어보다 상단에 있으면 총알은 상단으로
                if ((playerY + playerHeight/2) >= targetY){   
                    lmovey4 = lmovey4 - ((playerY + playerHeight/2) - targetY)/1000;   
                }
                
                //표적이 플레이어보다 하단에 있으면
                if ((playerY + playerHeight/2) < targetY){  
                    lmovey4 = lmovey4 + (targetY - (playerY + playerHeight/2))/680;                 
                }

                //표적이 플레이어보다 좌측에 있으면 총알은 좌측으로  
                if((playerX + playerWidth/2) >= targetX){ 
                    lmovex4 = lmovex4  + (targetX - (playerX + playerWidth/2))/800;  
                } 

                //표적이 플레이어보다 우측에 있으면
                if((playerX + playerWidth/2) < targetX){ 
                    lmovex4 = lmovex4 - ((playerX - playerWidth/2) - targetX)/800; 
                } 

                //l_width = l_width - 0.1;
                //l_height = l_height - 0.1;                       
                l_width = l_width - laser_charge_total_time/180;
                l_height = l_height - laser_charge_total_time/180;  

                if(l_width <= 0){ 
                    laserImage = noneImage; 
                }                
            }            
            
            Context.drawImage(laserImage,lmovex4,lmovey4,l_width,l_height); 
         
        }
        
    }
}

////////////////// 적 객체 생성
////////////////// 적 1th
function create_enemy(index){
    //보스 출현중에는 수행하지 않는다.
    if (enemy_boss_02_status == 1) {
        //alert("두번째 보스 생성(enemy_boss_02_status):"+enemy_boss_02_status)
        enemy_cnt = 0; 
    }else { 
        //this.enemy_index = index;
        //적의 인덱스가 없는경우 전체 새로 생성.
        if (index == null || index == ""  || index == undefined){
            //alert("1")
            for (var i=0;i<=enemy_cnt;i++){

                enemy_array[i] = new enemy_init(i);
                //enemy.enemy_index = i;
                enemy_array[i].weappon_create();
                enemy_array[i].weappon_init();
            }
        //인덱스가 기존에 있는거나 추가된경우 해당 인덱스건에 대하여만 새로 생성.
        }else {

            enemy_array[index] = new enemy_init(index);
            //enemy.enemy_index = i;
            enemy_array[index].weappon_create();
            enemy_array[index].weappon_init();

        }
    } 
    
    
    if (enemy_boss_01_status == 1) {
        
        //보스 출현시 총알의 시작위치는 보스 출현 위치
        //enemy_array[enemy_boss_01_index] = new enemy_init(i);
        //enemy.enemy_index = i;
 
        //enemy_array[enemy_boss_01_index].weappon_create();
        //enemy_array[enemy_boss_01_index].weappon_init();
        enemy_cnt = 0;
        //return;
    }else { 
        //this.enemy_index = index;
        //적의 인덱스가 없는경우 전체 새로 생성.
        //if (index == null || index == ""  || index == undefined){
        if (!(index)){    
            //alert("1")
            for (var i=0;i<=enemy_cnt;i++){

                enemy_array[i] = new enemy_init(i);
                //enemy.enemy_index = i;
                enemy_array[i].weappon_create();
                enemy_array[i].weappon_init();
            }
        //인덱스가 기존에 있는거나 추가된경우 해당 인덱스건에 대하여만 새로 생성.
        }else {

            enemy_array[index] = new enemy_init(index);
            //enemy.enemy_index = i;
            enemy_array[index].weappon_create();
            enemy_array[index].weappon_init();

        }
    }
 }

////////////////// 적 초기화
function enemy_init(index){

    //객체내에서 사용되는 모든 참조객체(변수,이미지,배열,함수등을 모두 생성자 함수에 넣어준다.)
    //참조 개체내에서의 this.propoerty는 해당 생성자함수(클래스)의 현재실행객체의 property를 가리킨다.
    //참조 객체체 외에서의 propoerty는 생성자(클래스)명.property 식으로 가져온다.
    this.enemy_array = enemy_array;
    this.create_enemy = create_enemy;
    //this.create_enemy = create_enemy;
    //this.create_enemy03 = create_enemy03;

    //this.enemy02Image = new Image();
    //this.enemy02Image.src = enemy02Image.src;

    //적 고유 index
    this.enemy_index = index;
 
    //두번째 보스 출현시간  
    //if(gameTime > 1000 && enemy_boss_01_status == 2 && enemy_boss_02_status == 0){
    if(gameTime > 2600 && enemy_boss_02_status == 0){
 
        //딱 한번만 수행
        enemy_boss_02_status = 1;
        
        //보스 index 중복 방지
        if (enemy_boss_01_index == enemy_boss_02_index){
            enemy_boss_02_index = enemy_boss_01_index + 1;
        }else {
            enemy_boss_02_index = index;
        }

        this.enemy_type = 3;    
        
        //목소리 재생모드일경우만 실행  
        if (ls_VColor == "yellow") {
            crash01_sound.currentTime = 4;
            vboss_sound.play();
            //대화
            Context.globalAlpha = 1;
            Context.font  = "30px Arial";  
            Context.fillStyle = '#ffffff';
            Context.fillText("저녁석이 보스인가?",ls_width/2 - ls_width/10,50);             
        } 
        
        //alert("두번째 보스 출현(enemy_boss_02_status):"+enemy_boss_02_status )
    //첫번째 보스 출현시간    
    }else if(gameTime > 2550 && enemy_boss_01_status == 0){

        
        enemy_boss_01_status = 1; 
        enemy_boss_01_index = index;
        this.enemy_type = 3;   
        
        //목소리 재생모드일경우만 실행  
        if (ls_VColor == "yellow") {
            crash01_sound.currentTime = 4;
            vboss_sound.play();
            //대화
            Context.globalAlpha = 1;
            Context.font  = "30px Arial";  
            Context.fillStyle = '#ffffff';
            Context.fillText("저녁석이 보스인가?",ls_width/2 - ls_width/10,50);
            //Context.fill(); 
        }  
    }else { 
        
        if(gameTime < 1000){
            //ini_player_size--;
                //player_size = 200;
            this.enemy_type = 4;
        }else {
            //적 고유 index에 따른 적 타입 변경
            if ((this.enemy_index + 1) <= 2){
                this.enemy_type = 1;

            }else {   

                if (this.enemy_index % 2 == 0){
                    this.enemy_type = 2;
                }else {
                    this.enemy_type = 1;
                }
            } 
        }
            
    }

    if (this.enemy_type == 3){
        enemy_boss_01_status==1?this.enemy_boss_01_yn ='Y':this.enemy_boss_01_yn='N';    //보스 여부
        enemy_boss_02_status==1?this.enemy_boss_02_yn ='Y':this.enemy_boss_02_yn='N';    //보스 여부
        //this.enemy_boss_01_yn = 'Y';    //보스 여부 
        //this.enemy_boss_02_yn = 'Y';    //보스 여부   
    }
    
//     else { 
//         this.enemy_boss_01_yn = 'N';    //보스 여부 
//         this.enemy_boss_02_yn = 'N';    //보스 여부   
//    }
 
    
    //이미 첫번째 보스가 출현하여 한번 폭파된경우는 생성되지 않게 한다. 
    if(enemy_boss_01_status >= 2){ 
        enemy_boss_01_status = 2;
        //enemy_boss_01_status = 0; 
        enemy_boss_01_index = 0; 
        //this.enemy_boss_01_yn = 'N';

        //this.enemy_type = Math.floor(Math.random() * 3) + 1;
        //적 04, 06출현
        if (parseInt(gameTime/100 % 4) == 0){
            this.enemy_type = 4;
        }else if (parseInt(gameTime/100 % 4) == 1){
            this.enemy_type = 6; 
        }else if (parseInt(gameTime/100 % 4) == 2){
            this.enemy_type = 7; 
        }else {
            this.enemy_type = 8; 
        } 

        //밑에 전함도 나타난다. 
    } 

    //이미 두번째 보스가 출현하여 한번 폭파된경우는 생성되지 않게 한다. 
    if(enemy_boss_02_status >= 2){ 
        enemy_boss_02_status = 2;
        //enemy_boss_01_status = 0; 
        enemy_boss_02_index = 0; 
        //this.enemy_boss_02_yn = 'N';

        //this.enemy_type = Math.floor(Math.random() * 3) + 1;
        //적 04, 06출현
        if (parseInt(gameTime/100 % 4) == 0){
            this.enemy_type = 1;
        }else if (parseInt(gameTime/100 % 4) == 1){
            this.enemy_type = 2; 
        }else if (parseInt(gameTime/100 % 4) == 2){
            this.enemy_type = 7; 
        }else {
            this.enemy_type = 8; 
        } 

        //밑에 전함도 나타난다. 
    }     

    //무(없음)이미지
    //this.noneImage = new Image();
    this.noneImage = noneImage;
    //this.noneImage.src = noneImage.src;

    //폭파이미지01
    //this.explosionImage01 = new Image();
    this.explosionImage01 = explosionImage01;
    //this.explosionImage01.src = explosionImage01.src;

    //적 미사일 이동 간격
    this.weappon_upDown = weappon_upDown;
    this.weappon_leftRight = weappon_leftRight;
    this.weappon_tmp_random = weappon_tmp_random;

    //적 레이져 폭파중 여부
    this.enemy_collision_yn = 'N';

    //적 출현 지연시간
    this.enemy_dealy_time = enemy_dealy_time;

    //적 초기 위치
    //this.enemyx = parseInt(theCanvas.clientWidth / 2  + cityEnd_x) + (Math.floor(Math.random() * 10))  + (Math.floor(Math.random() * 30)) - (Math.floor(Math.random() * 300)); //시작  x
    //this.enemyy = parseInt(theCanvas.clientHeight / 4) + (Math.floor(Math.random() * 100)) - (Math.floor(Math.random() * 100)); //시작 y
    //this.enemyx = ini_enemyx  + (Math.floor(Math.random() * 100)) - (Math.floor(Math.random() * 100));
    //this.enemyy = ini_enemyy  + (Math.floor(Math.random() * 100)) - (Math.floor(Math.random() * 100));

    this.enemyx = ini_enemyx  + (Math.floor(Math.random() * 10)) - (Math.floor(Math.random() * 10));
    this.enemyy = ini_enemyy  + (Math.floor(Math.random() * 10)) - (Math.floor(Math.random() * 10));

    //적 크기(배율)
    this.enemy_size =  Math.floor(Math.random() * 3);
    //적 스피드
    this.enemy_speed =  Math.floor(Math.random() * 2);
    //적 x축 이동 위치
    this.enemyxx = Math.floor(Math.random() * 4);
    //적 x축 이동 위치
    this.enemyyy = Math.floor(Math.random() * 4);

    //적 생명
    this.ini_enemy_life = ini_enemy_life;   //초기값
    //this.enemy_life = this.ini_enemy_life;
    this.energe_bar = ini_energe_bar;
    this.enemy_energe = enemy_energe;
    this.enemy_move = enemy_move;

    //타겟에서 적까지 거리
    this.Edistance = Edistance;

    //적 미사일 발사 시작 위치
    this.weapponX = this.enemyx;
    this.weapponY = this.enemyy;

    this.weapponArray = weapponArray;
    //this.weapponArray  = [];

    //적 미사일 객체(배열) 생성
    this.weappon_create = weappon_create;
    //this.weappon_create();

    //적 미사일 난수
    this.weappon_Randon = weappon_Randon;

    //적 미사일 객체(배열) 초기화
    this.weappon_init = weappon_init;
    //this.weappon_init();

    this.weappon_move = weappon_move;
    this.weappon_index = weappon_index;
    //weappon_move();

    //적 충돌
    this.enemy_collision = enemy_collision;

    //플레이어 레이져
    //this.laser_move = laser_move;

    //플레이어 검(sword)
    //this.sword_move = sword_move;    

    //플레이어 충돌
    this.player_collision = player_collision;

    //배경종점에서 적까지 거리
    this.enemy_didtance = enemy_didtance; 

    //적 타입에 따른 특성(모양,속도,무기등 변경) 
    if (this.enemy_type == 8){

        //적 이미지
        this.enemyImage = enemy08Image;
        //this.enemyImage.src = enemy08Image.src;

        //적 무기 이미지
        this.enemyGunImage = enemy08GunImage;
        //this.enemyGunImage.src = enemy08GunImage.src

        //적 엔진 이미지
        this.enginImage = engin08Image;
        //this.enginImage.src = engin08Image.src;

        //적 미시일 이미지 및 로드
        this.weapponImage = weappon08Image;
        //this.weapponImage.src = weappon08Image.src;

        //적 초기 위치
        // this.enemyx = theCanvas.clientWidth - (Math.floor(Math.random() * 50) - 50); //시작  x
        // this.enemyy = theCanvas.clientHeight/(Math.floor(Math.random() * 2) + 2); //시작  y

        //적 초기 크기
        this.enemyw = ini_enemyw/6 + Math.floor(Math.random() * 3);
        this.enemyh = ini_enemyh/6 + Math.floor(Math.random() * 4);

        //적 미사일 크기
        this.weappon_size = weappon_size;

        //적 미사일 속도
        this.weappon_speed = weappon_speed;

        //적 동시 미사일 발사수는 랜덤하게
        this.weappon_cnt = Math.floor(Math.random() * 5) + 5;
        this.max_weappon_cnt = 4;

        this.ini_enemy_life = 10;
        this.enemy_life = this.ini_enemy_life;        

    }else if (this.enemy_type == 7){

        //적 이미지
        this.enemyImage = enemy07Image;
        this.enemyImage.src = enemy07Image.src;

        //적 무기 이미지
        this.enemyGunImage = enemy01GunImage;
        this.enemyGunImage.src = enemy01GunImage.src

        //적 엔진 이미지
        this.enginImage = engin07Image;
        //this.enginImage.src = engin07Image.src;

        //적 미시일 이미지 및 로드
        this.weapponImage = weappon01Image;
        //this.weapponImage.src = weappon01Image.src;

        //적 초기 위치
        // this.enemyx = theCanvas.clientWidth - (Math.floor(Math.random() * 50) - 50); //시작  x
        // this.enemyy = theCanvas.clientHeight/(Math.floor(Math.random() * 2) + 2); //시작  y

        //적 초기 크기
        this.enemyw = ini_enemyw/6 + Math.floor(Math.random() * 3);
        this.enemyh = ini_enemyh/6 + Math.floor(Math.random() * 4);

        //적 미사일 크기
        this.weappon_size = weappon_size;

        //적 미사일 속도
        this.weappon_speed = weappon_speed;

        //적 동시 미사일 발사수는 랜덤하게
        this.weappon_cnt = Math.floor(Math.random() * 5) + 5;
        this.max_weappon_cnt = 4;

        this.ini_enemy_life = 10;
        this.enemy_life = this.ini_enemy_life;        

    }else if (this.enemy_type == 6){

        //적 이미지
        this.enemyImage = enemy06Image;
        //this.enemyImage.src = enemy06Image.src;

        //적 무기 이미지
        this.enemyGunImage = enemy01GunImage;
        //this.enemyGunImage.src = enemy01GunImage.src

        //적 엔진 이미지
        this.enginImage = engin06Image;
        //this.enginImage.src = engin06Image.src;

        //적 미시일 이미지 및 로드
        this.weapponImage = weappon01Image;
        //this.weapponImage.src = weappon01Image.src;

        //적 초기 위치
        this.enemyx = theCanvas.clientWidth - (Math.floor(Math.random() * 50) - 50); //시작  x
        this.enemyy = theCanvas.clientHeight/(Math.floor(Math.random() * 2) + 2); //시작  y

        //적 초기 크기
        this.enemyw = ini_enemyw/6 + Math.floor(Math.random() * 3);
        this.enemyh = ini_enemyh/6 + Math.floor(Math.random() * 4);

        //적 미사일 크기
        this.weappon_size = weappon_size;

        //적 미사일 속도
        this.weappon_speed = weappon_speed;

        //적 동시 미사일 발사수는 랜덤하게
        this.weappon_cnt = Math.floor(Math.random() * 5) + 5;
        this.max_weappon_cnt = 4;

        this.ini_enemy_life = 5;
        this.enemy_life = this.ini_enemy_life;        

    }else if (this.enemy_type == 5){

        // this.enemyx = parseInt(theCanvas.clientWidth / 2  + cityEnd_x) + Math.floor(Math.random() * 100) - Math.floor(Math.random() * 100); //시작  x
        // this.enemyy = parseInt(theCanvas.clientHeight / 4 + cityEnd_y) + Math.floor(Math.random() * 50) - Math.floor(Math.random() * 30); //시작 y

        //this.enemyx = parseInt(theCanvas.clientWidth / 2  + cityEnd_x) + Math.floor(Math.random() * 100) - Math.floor(Math.random() * 100); //시작  x
        //this.enemyy = parseInt(theCanvas.clientHeight / 4 + cityEnd_y) + Math.floor(Math.random() * 50) - Math.floor(Math.random() * 30); //시작 y
        //this.enemyy = parseInt(theCanvas.clientHeight / 4 + cityEnd_y) + Math.floor(Math.random() * 50) - Math.floor(Math.random() * 30); //시작 y
        //this.enemyy = parseInt(theCanvas.clientHeight - 100);

        //this.enemyx = parseInt(playerX) + Math.floor(Math.random() * 500) - Math.floor(Math.random() * 500); //시작  x
        this.enemyx = theCanvas.clientWidth/2 - 200; //시작  x
        this.enemyy = theCanvas.clientHeight + 40;

        //적 이미지
        this.enemyImage = enemy05Image;
        //this.enemyImage.src = enemy05Image.src;

        //적 무기 이미지
        this.enemyGunImage = enemy05GunImage;
        //this.enemyGunImage.src = enemy05GunImage.src

        //적 엔진 이미지
        this.enginImage = engin05Image;
        //this.enginImage.src = engin05Image.src;

        //적 미시일 이미지 및 로드
        this.weapponImage = weappon05Image;
        //this.weapponImage.src = weappon05Image.src;
 
        // ini_enemyw = 200/2;
        // ini_enemyh = 150/2;
        // this.enemyw = ini_enemyw * 4 + Math.floor(Math.random() * 6);
        // this.enemyh = ini_enemyh * 2 + Math.floor(Math.random() * 3);
        this.enemyw = playerWidth*20 + Math.floor(Math.random() * 2);
        this.enemyh = playerHeight*20 + Math.floor(Math.random() * 1);

        //적 미사일 크기
        this.weappon_size = weappon_size;

        //적 미사일 속도
        this.weappon_speed = weappon_speed + 0.1;

        //적 동시 미사일 발사수는 랜덤하게
        this.weappon_cnt = Math.floor(Math.random() * 5) + 5;
        this.max_weappon_cnt = 10; 

        this.ini_enemy_life = 200;
        this.enemy_life = this.ini_enemy_life;

        this.energe_bar = ini_energe_bar;
        this.enemy_energe = enemy_energe;
        this.enemy_move = enemy_move;

        this.weapponX = this.enemyx;
        this.weapponY = this.enemyy;     
     
    //적 타입에 따른 특성(모양,속도,무기등 변경) 
    }else if (this.enemy_type == 4){

        // this.enemyx = parseInt(theCanvas.clientWidth / 2  + cityEnd_x) + Math.floor(Math.random() * 100) - Math.floor(Math.random() * 100); //시작  x
        // this.enemyy = parseInt(theCanvas.clientHeight / 4 + cityEnd_y) + Math.floor(Math.random() * 50) - Math.floor(Math.random() * 30); //시작 y

        //this.enemyx = parseInt(theCanvas.clientWidth / 2  + cityEnd_x) + Math.floor(Math.random() * 100) - Math.floor(Math.random() * 100); //시작  x
        //this.enemyy = parseInt(theCanvas.clientHeight / 4 + cityEnd_y) + Math.floor(Math.random() * 50) - Math.floor(Math.random() * 30); //시작 y
        //this.enemyy = parseInt(theCanvas.clientHeight / 4 + cityEnd_y) + Math.floor(Math.random() * 50) - Math.floor(Math.random() * 30); //시작 y
        //this.enemyy = parseInt(theCanvas.clientHeight - 100);

        //this.enemyx = parseInt(playerX) + Math.floor(Math.random() * 500) - Math.floor(Math.random() * 500); //시작  x
        this.enemyx = Math.floor(Math.random() * theCanvas.clientWidth) - 40; //시작  x
        this.enemyy = theCanvas.clientHeight + 40;

        //적 이미지
        this.enemyImage = enemy04Image;
        this.enemyImage.src = enemy04Image.src;

        //적 무기 이미지
        this.enemyGunImage = enemy01GunImage;
        this.enemyGunImage.src = enemy01GunImage.src

        //적 엔진 이미지
        this.enginImage = engin04Image;
        //this.enginImage.src = engin04Image.src;

        //적 미시일 이미지 및 로드
        this.weapponImage = weappon04Image;
        //this.weapponImage.src = weappon04Image.src;
 
        // ini_enemyw = 200/2;
        // ini_enemyh = 150/2;
        // this.enemyw = ini_enemyw * 4 + Math.floor(Math.random() * 6);
        // this.enemyh = ini_enemyh * 2 + Math.floor(Math.random() * 3);
        this.enemyw = playerHeight*2 + Math.floor(Math.random() * 2);
        this.enemyh = playerWidth*1.6 + Math.floor(Math.random() * 1);

        //적 미사일 크기
        this.weappon_size = weappon_size;

        //적 미사일 속도
        this.weappon_speed = weappon_speed + 0.1;

        //적 동시 미사일 발사수는 랜덤하게
        this.weappon_cnt = Math.floor(Math.random() * 6) + 6;
        this.max_weappon_cnt = 12; 

        this.ini_enemy_life = 1;
        this.enemy_life = this.ini_enemy_life;

        this.energe_bar = ini_energe_bar;
        this.enemy_energe = enemy_energe;
        this.enemy_move = enemy_move;

        this.weapponX = this.enemyx;
        this.weapponY = this.enemyy;    

    //보스 특징
    }else if (this.enemy_type == 3){
 
    //this.Edistance = Math.sqrt(Math.pow(Math.abs(parseInt(((theCanvas.clientWidth / 2  + cityEnd_x) - this.enemyx))),2) + Math.pow(Math.abs(parseInt(theCanvas.clientHeight / 4 - this.enemyy)),2));
 
        //보스 초기 출현 좌표
        //ini_enemyx = parseInt(theCanvas.clientWidth / 2  + cityEnd_x) + Math.floor(Math.random() * 100) - Math.floor(Math.random() * 100); //시작  x
        //ini_enemyy = parseInt(theCanvas.clientHeight / 4 + cityEnd_y) + Math.floor(Math.random() * 50) - Math.floor(Math.random() * 30); //시작 y
        //this.enemyx = ini_enemyx; //시작 x
        //this.enemyy = ini_enemyy; //시작 y
        this.enemyx = parseInt(theCanvas.clientWidth / 2  + cityEnd_x) + Math.floor(Math.random() * 100) - Math.floor(Math.random() * 100); //시작  x
        this.enemyy = parseInt(theCanvas.clientHeight / 4 + cityEnd_y) + Math.floor(Math.random() * 50) - Math.floor(Math.random() * 30); //시작 y

        //적 이미지
        this.enemyImage = enemy03Image;
        //this.enemyImage.src = enemy03Image.src;

        //적 무기 이미지
        this.enemyGunImage = enemy03GunImage;
        //this.enemyGunImage.src = enemy03GunImage.src

        //적 엔진 이미지
        this.enginImage = engin03Image;
        //this.enginImage.src = engin03Image.src;

        //적 미시일 이미지 및 로드
        this.weapponImage = weappon03Image;
        //this.weapponImage.src = weappon03Image.src;

        //보스 초기 크기
        //ini_enemyw = 200/2;
        //ini_enemyh = 150/2;
        this.enemyw = ini_enemyw/4 + Math.floor(Math.random() * 2);
        this.enemyh = ini_enemyh/8 + Math.floor(Math.random() * 1);
  
        //적 미사일 크기
        this.weappon_size = weappon_size;

        //적 미사일 속도
        this.weappon_speed = weappon_speed * 0.3 + 0.1;

        //적 동시 미사일 발사수는 랜덤하게
        this.weappon_cnt = Math.floor(Math.random() * 10) + 20;
        //this.max_weappon_cnt = 30;
        this.max_weappon_cnt = 20; 

        this.ini_enemy_life = 100;
        this.enemy_life = this.ini_enemy_life;

        this.energe_bar = ini_energe_bar;
        this.enemy_energe = enemy_energe;
        this.enemy_move = enemy_move;
        
    }else if (this.enemy_type == 2){

        //적 이미지
        this.enemyImage = enemy02Image;
        //this.enemyImage.src = enemy02Image.src;

        //적 무기 이미지
        this.enemyGunImage = enemy02GunImage;
        //this.enemyGunImage.src = enemy02GunImage.src

        //적 엔진 이미지
        this.enginImage = engin02Image;
        //this.enginImage.src = engin02Image.src;

        //적 미시일 이미지 및 로드
        this.weapponImage = weappon02Image;
        //this.weapponImage.src = weappon02Image.src;

        //적 초기 크기
        this.enemyw = ini_enemyw/6 + Math.floor(Math.random() * 3);
        this.enemyh = ini_enemyh/6 + Math.floor(Math.random() * 4);

        //적 미사일 크기
        this.weappon_size = weappon_size;

        //적 미사일 속도
        this.weappon_speed = weappon_speed;

        //적 동시 미사일 발사수는 랜덤하게
        this.weappon_cnt = Math.floor(Math.random() * 4) + 4;
        this.max_weappon_cnt = 6;

        this.ini_enemy_life = 5;
        this.enemy_life = this.ini_enemy_life;        

    }else { 
         
        //적 이미지
        this.enemyImage = enemy01Image;
        //this.enemyImage.src = enemy01Image.src;

        //적 무기 이미지
        this.enemyGunImage = enemy01GunImage;
        //this.enemyGunImage.src = enemy01GunImage.src

        //적 엔진 이미지
        this.enginImage = engin01Image;
        //this.enginImage.src = engin01Image.src;

        //적 미시일 이미지 및 로드
        this.weapponImage = weappon01Image;
        //this.weapponImage.src = weappon01Image.src;

        //적 초기 크기
        this.enemyw = ini_enemyw/8 + Math.floor(Math.random() * 3);
        this.enemyh = ini_enemyh/8 + Math.floor(Math.random() * 4);

        //적 미사일 크기
        this.weappon_size = weappon_size;

        //적 미사일 속도
        this.weappon_speed = weappon_speed;

        //적 동시  발사수는 랜덤하게
        this.weappon_cnt = Math.floor(Math.random() * 4) + 4;
        this.max_weappon_cnt = 8;

        this.ini_enemy_life = 5;
        this.enemy_life = this.ini_enemy_life;        
    }
}

////////////////// 적 충돌(레이져 폭파)
function enemy_collision(){

    //적 위치
    //this.enemyx = this.weapponX;
    //this.enemyy = this.weapponY;

    if (this.enemy_type == 4){
        if (this.enemyh >= playerHeight){
            this.enemy_collision_yn = 'Y';
        }else {
            this.enemy_collision_yn = 'N';
        }        
    }else {
        this.enemyw = ini_enemyw; 
        this.enemyh = ini_enemyh;
    }

    //레이져 크기
    //l_height = 1;
    //l_height = 100;  //사이즈가 1이면 적이 잘 않맞는다.

    //적 레이져 폭파중 여부
    if (this.enemy_collision_yn == 'Y') return;                  //적이 폭파되고 새로출현할때까지 않보이는경우 수행하지 않는다.

    //레이져와 적 X좌표 충돌시
// console.log("laser_yn:"+laser_yn);
// console.log("skill:"+skill);
// console.log("sword_yn:"+sword_yn); 
// 적과 플레이어의 거리가 너무 멀면 sword 공격 안되도록 보완.
    if ((l_width > 0 && l_height > 0 && 
         laser_yn=='Y' && 
         (parseInt(lmovex) <= (parseInt(this.enemyx) + parseInt(this.enemyw)*1.4) && ((parseInt(lmovex) + parseInt(l_width)) >= parseInt(this.enemyx) - parseInt(this.enemyw)*1.4)) ||
         (parseInt(lmovex2) <= (parseInt(this.enemyx) + parseInt(this.enemyw)*1.4) && ((parseInt(lmovex2) + parseInt(l_width)) >= parseInt(this.enemyx) - parseInt(this.enemyw)*1.4)) ||
         (parseInt(lmovex3) <= (parseInt(this.enemyx) + parseInt(this.enemyw)*1.4) && ((parseInt(lmovex3) + parseInt(l_width)) >= parseInt(this.enemyx) - parseInt(this.enemyw)*1.4)) ||
         (parseInt(lmovex4) <= (parseInt(this.enemyx) + parseInt(this.enemyw)*1.4) && ((parseInt(lmovex4) + parseInt(l_width)) >= parseInt(this.enemyx) - parseInt(this.enemyw)*1.4))
         ) ||
        (parseInt(this.enemyw)*0.8 <= playerWidth  && playerSword_Image.src != noneImage.src && (parseInt(smovex) <= (parseInt(this.enemyx) + parseInt(this.enemyw)*1.4) && ((parseInt(smovex) + parseInt(s_width)) >= parseInt(this.enemyx) - parseInt(this.enemyw)/1.4)))){

        //레이져와 적 Y좌표 충돌시
        if ((laser_yn=='Y' && 
            (parseInt(lmovey) <= (parseInt(this.enemyy)  + parseInt(this.enemyh)*1.4) ) && ((parseInt(lmovey)  + parseInt(l_height)) >= parseInt(this.enemyy)) ||
            (parseInt(lmovey2) <= (parseInt(this.enemyy)  + parseInt(this.enemyh)*1.4) ) && ((parseInt(lmovey2)  + parseInt(l_height)) >= parseInt(this.enemyy)) ||
            (parseInt(lmovey3) <= (parseInt(this.enemyy)  + parseInt(this.enemyh)*1.4) ) && ((parseInt(lmovey3)  + parseInt(l_height)) >= parseInt(this.enemyy)) ||
            (parseInt(lmovey4) <= (parseInt(this.enemyy)  + parseInt(this.enemyh)*1.4) ) && ((parseInt(lmovey4)  + parseInt(l_height)) >= parseInt(this.enemyy)) 
            ) || 
            (parseInt(this.enemyh)*0.8 <= playerHeight && playerSword_Image.src != noneImage.src && (parseInt(smovey) <= (parseInt(this.enemyy)  + parseInt(this.enemyh)*1.4) ) && ((parseInt(smovey)  + parseInt(s_height)) >= parseInt(this.enemyy)))){
              
             //충돌시 carsh 효과 이미지로
             Context.drawImage(this.explosionImage01,this.enemyx-Math.floor(Math.random()*20),this.enemyy+Math.floor(Math.random()*20),20,10);
             Context.drawImage(this.explosionImage01,this.enemyx+Math.floor(Math.random()*20),this.enemyy+Math.floor(Math.random()*10),10,10);
             Context.drawImage(this.explosionImage01,this.enemyx+Math.floor(Math.random()*20),this.enemyy-Math.floor(Math.random()*30),20,10);

             //적 총알 충돌 사운드는 좀 짧게
             crash01_sound.currentTime = 0;
             crash01_sound.play(); 

            //적 에너지 차감 
            if (laser_yn == 'Y'){
                if (skill == 1){ 
                    this.enemy_life = this.enemy_life - 1;              
                }else if (skill == 2){
                    this.enemy_life = this.enemy_life - 0.5;            
                }else if (skill == 3){
                    this.enemy_life = this.enemy_life - 20;  
                }else if (skill == 4){
                    this.enemy_life = this.enemy_life - 10;  
                }else if (skill == 5){
                    this.enemy_life = this.enemy_life - 10;  
                }  
            }else { 
                
                //기본스킬일때는 0.6씩 차감 
                if(playerSword_Image.src != noneImage.src) { 
               
                    this.enemy_life = this.enemy_life - 0.6;    
                }
            }

             //적 에너지를 다시 그려준다.
             this.enemy_energe(); 

             //폭멸탄가 3이 아닐때만 스킬초기화 => 초기화 안하면 총알이 적을 관통해도 계속 진행된다.
             if (skill != 3){  
                 laser_init();
             }else {
                //playerSkill_03TmpImage = noneImage; 
                laser_yn=='N'; 
                //laser_charge_total_time = 0;
                //laser_charge_start_time  = gameTime; 
             }

             sword_yn == 'N';
             playerSword_Image = noneImage;


             //적 파괴되면 새로운 타겟 등장
             if (this.enemy_life <= 0){

                //enemy_type == 4 인 적이 10개씩 파괴 될때마다 무기 레벨up!
                if (this.enemy_type == 4){
                   //power++;        
                   //스피드증가
                   //Pspeed = Pspeed + power/100;
                } 

                //타겟 새로 생성
                //enemy_init();
                explosion_sound.play();
                explosion_sound.currentTime  = 0;
                //this.weapponArray = [];     //적 폭파되도 발생된 총알은 사라지지 않도록 한다.
                this.weapponArray = [];     //적 폭파시 총알도 사라지도록 변경.
                this.energe_bar = '';

                //콜로니 밖 우주 배경그려주기(투명도 적용)
                Context3.save();

                Context3.globalAlpha = 0.9;
                
                //적폭파시 배경 잠깐 번쩍이게..
                //Context.drawImage(backgroundImage,0, 0 ,theCanvas.clientWidth + Math.floor(Math.random() * 3) ,theCanvas.clientHeight);
                //Context.drawImage(backgroundImage,gameTime/20 * -1,  gameTime/20 * -1 ,theCanvas.clientWidth + gameTime/20,theCanvas.clientHeight + gameTime/20);
                
                //적이 강할수록 i를 높게한다.(i = 점수)
                for (var i=0;i<=this.ini_enemy_life*10*(this.enemyh/20);i++){
            
                    Context.drawImage(this.explosionImage01,this.enemyx-Math.floor(Math.random()*30),this.enemyy+Math.floor(Math.random()*40),100 - i,100 - i);
                    Context.drawImage(this.explosionImage01,this.enemyx+Math.floor(Math.random()*60),this.enemyy+Math.floor(Math.random()*50),20 - i,20 - i);
                    Context.drawImage(this.explosionImage01,this.enemyx-Math.floor(Math.random()*30),this.enemyy+Math.floor(Math.random()*40),100 - i,100 - i);
                    Context.drawImage(this.explosionImage01,this.enemyx+Math.floor(Math.random()*60),this.enemyy+Math.floor(Math.random()*50),20 + i,20 + i);

                    if (enemy_type == 3){

                        Context.drawImage(this.explosionImage01,this.enemyx-Math.floor(Math.random()*30),this.enemyy+Math.floor(Math.random()*40),100 - i,100 - i);
                        Context.drawImage(this.explosionImage01,this.enemyx+Math.floor(Math.random()*60),this.enemyy+Math.floor(Math.random()*50),20 - i,20 - i);
                        Context.drawImage(this.explosionImage01,this.enemyx-Math.floor(Math.random()*30),this.enemyy+Math.floor(Math.random()*40),100 - i,100 - i);
                        Context.drawImage(this.explosionImage01,this.enemyx+Math.floor(Math.random()*60),this.enemyy+Math.floor(Math.random()*50),20 + i,20 + i);
                        Context.drawImage(this.explosionImage01,this.enemyx-Math.floor(Math.random()*30),this.enemyy+Math.floor(Math.random()*60),100 - i,100 - i);
                        Context.drawImage(this.explosionImage01,this.enemyx+Math.floor(Math.random()*60),this.enemyy+Math.floor(Math.random()*70),20 - i,20 - i);
                        Context.drawImage(this.explosionImage01,this.enemyx-Math.floor(Math.random()*30),this.enemyy+Math.floor(Math.random()*80),100 - i,100 - i);
                        Context.drawImage(this.explosionImage01,this.enemyx+Math.floor(Math.random()*60),this.enemyy+Math.floor(Math.random()*60),20 + i,20 + i);

                    }
                    //Context.fillText("Score : " + gameTime,theCanvas.clientWidth - 250,50);
                }

                //적의 생명 * 10 만큼 보너스 스코어
                Context.font = '100px Arial';
                Context.fillText( " + " + this.ini_enemy_life * 10,this.enemyx,this.enemyy-10);
                //alert(this.enemyx + "," +  this.enemyy)
                gameScore = parseInt(gameScore) + this.ini_enemy_life*10;

                //타겟 새로 출현 시간. 
                //보스가 츨현중에는 적출현시간이 지연된다.
                //if (enemy_boss_01_status != 1) {
                    this.enemy_dealy_time = parseInt((Math.floor(Math.random()*3) + 2)) * 1000;
                //}else { 
                 //   this.enemy_dealy_time = parseInt((Math.floor(Math.random()*3) + 2)) * 10000;
                //}

                Context3.restore();

                //폭파되면 새로 출현할때까지 이미지 않보이게
                this.enemyImage = this.noneImage;
                this.enemyGunImage = this.noneImage;
                this.enginImage = this.noneImage;

                //적 레이져 폭파중 여부
                this.enemy_collision_yn = 'Y';

                //첫번째 보스 폭파
                //적 보스가 파괴되면 계속해서 일반 적들 추가 생성(한번은 초기화)
                //if (this.enemy_boss_01_yn == 'Y'){
                if (this.enemy_type == 3 && enemy_boss_01_status == 1){
                    enemy_boss_01_status = 2;          
                    enemy_boss_01_index = 0;
                    return;
                } 
                //첫번째 보스 출현시에는 일반적들은 안나온다.
                if (enemy_boss_01_status != 1){
                    //폭파후 적 출현
                    setTimeout(this.create_enemy,this.enemy_dealy_time,this.enemy_index);   //넘겨줄 인수는 지연시간 뒤에다가 넘겨준다.
                }
                //두번째 보스 폭파
                //적 보스가 파괴되면 계속해서 일반 적들 추가 생성(한번은 초기화)
                if (this.enemy_type == 3 && enemy_boss_02_status == 1){
                    enemy_boss_02_status = 2;          
                    enemy_boss_02_index = 0;
                    return;
                } 
                //두번째 보스 출현시에는 일반적들은 안나온다.
                //if (enemy_boss_02_status != 1){
                    //폭파후 적 출현
                //    setTimeout(this.create_enemy,this.enemy_dealy_time,this.enemy_index);   //넘겨줄 인수는 지연시간 뒤에다가 넘겨준다.
                //}                
             }

        }

    } 
     
}

////////////////// 플레이어 에너지 표시
function player_energe(){

    Context.font = '10px Arial';
    Context.fillStyle = 'white';

    penerge_bar = '';

    for(var i = 1;i<=player_life;i++){
        penerge_bar += '■';
    }

    return penerge_bar;
}

////////////////// 적 에너지 표시
function enemy_energe(){

    //보스의 경우
    if (this.enemy_type == 3){
        Context.font = '10px Arial';
        Context.fillStyle = 'orange';

        this.energe_bar = '';

        for (var i=1;i<=this.enemy_life;i=i+10){
            this.energe_bar += '■';
        } 

    }else {
        Context.font = '10px Arial';
        Context.fillStyle = 'white';

        this.energe_bar = '';

        for (var i=1;i<=this.enemy_life;i++){
            this.energe_bar += '■';
        }
    } 

    //laser_charge_total_time = 0;
    //laser_charge_start_time  = gameTime;   

    return this.energe_bar;
}


////////////////// 적 이동
function enemy_move(){
//alert(String(gameTime*100).substr(0,2));
//alert(parseInt(String(gameTime*100).substr(0,2)) % 5)

//console.log(String(gameTime).substr(String(gameTime).length-3,1)) 

    this.enemy_didtance();

    this.Edistance = parseInt(this.Edistance)/100;
    //console.log("this.Edistance",this.Edistance);

    //적 다가옴에 따라 크기도 커진다.(원근효과)
    //this.enemy_size = this.enemy_size * this.Edistance * 0.8;
     
    if(this.enemy_type == 4){
        //this.enemy_size = this.enemy_size * this.Edistance;
        //배경종점(목적지) 이동좌표에 따른 적 사이즈 조정
        //this.enemyw = this.enemyw * 0.8;
        //this.enemyh = this.enemyh * 0.4;
    }else {
        this.enemy_size = this.enemy_size * this.Edistance;
        //배경종점(목적지) 이동좌표에 따른 적 사이즈 조정
        this.enemyw = this.enemyw * this.enemy_size;
        this.enemyh = this.enemyh * this.enemy_size;

        //console.log(this.enemyw,this.enemyh)

        //적 크기 배율은 1 ~ 3를 넘지 못한다.
        //if (this.enemy_size >= 3){this.enemy_size = 3};
        if (this.enemy_size <= 1){this.enemy_size = 1};    
    }

    
    //보스의 경우
    if(this.enemy_type == 3){ 
        if (this.enemyw > ini_enemyw * 2){
            this.enemyw =  ini_enemyw * 2;
            //this.enemy_size = this.enemy_size - 1;
            //this.enemy_size = this.enemy_size - (this.Edistance * 0.5);
        } 
        if (this.enemyh > ini_enemyh * 1.5){
            this.enemyh =  ini_enemyh * 1.5;
            //this.enemy_size = this.enemy_size - 1;
            //this.enemy_size = this.enemy_size - (this.Edistance * 0.5);
        }

    }else if(this.enemy_type == 4){ 
            // if (this.enemyw < ini_enemyw / 1.5){
            //     this.enemyw =  ini_enemyw / 1.5;
            //     //this.enemy_size = this.enemy_size - 1;
            //     //this.enemy_size = this.enemy_size - (this.Edistance * 0.5);
            // } 
            // if (this.enemyh < ini_enemyh / 1.5){
            //     this.enemyh =  ini_enemyh / 1.5;
            //     //this.enemy_size = this.enemy_size - 1;
            //     //this.enemy_size = this.enemy_size - (this.Edistance * 0.5);
            // }        
    //일반 적의 경우
    }else {
        if (this.enemyw > ini_enemyw * 1){
            this.enemyw =  ini_enemyw * 1;
            //this.enemy_size = this.enemy_size - 1;
            //this.enemy_size = this.enemy_size - (this.Edistance * 0.5);
        }
        if (this.enemyh > ini_enemyh * 1){
            this.enemyh =  ini_enemyh * 1;
            //this.enemy_size = this.enemy_size - 1;
            //this.enemy_size = this.enemy_size - (this.Edistance * 0.5); 
        } 
    }

    //console.log("String(gameTime).substr(String(gameTime).length-3,1)",String(gameTime).substr(String(gameTime).length-3,1))
    //적(enemy) 왔다같다 이동 
    //적 1은 빠르다
    //if (enemy_border_over_yn != '1N'){
        if (this.enemy_type == 6){ 

            //적 미사일 초기 위치
            this.weapponX = this.enemyx;
            this.weapponY = this.enemyy;

            if (String(gameTime).substr(String(gameTime).length-3,1) == 1){
                //this.enemyy = ls_height/(Math.floor(Math.random() * 4)+1);
                //this.enemy_size = this.enemy_size - Math.floor(Math.random() * 100) - 50; 
            }else if (String(gameTime).substr(String(gameTime).length-3,1) == 2){
                this.enemyy = this.enemyy - 1;
                //this.enemy_size = this.enemy_size + 0.1;
            }else if (String(gameTime).substr(String(gameTime).length-3,1) == 3){
                this.enemyy = this.enemyy - 1;
                //this.enemy_size = this.enemy_size - 0.05;
            }else if (String(gameTime).substr(String(gameTime).length-3,1) == 4){
                this.enemyy = this.enemyy + 1;
                //this.enemy_size = this.enemy_size + 0.1;
            }else if (String(gameTime).substr(String(gameTime).length-3,1) == 5){
                //this.enemyx = this.enemyx + this.enemyxx * (Math.floor(Math.random() * 1)==0?1:-1);    
                this.enemyy = this.enemyy - this.enemyyy * (Math.floor(Math.random() * 1)==0?1:-1);               
            }else if (String(gameTime).substr(String(gameTime).length-3,1) == 6){
                //this.enemyx = this.enemyx + 1;
                this.enemy_size = this.enemy_size - 0.05;
            }else if (String(gameTime).substr(String(gameTime).length-3,1) == 7){
                //this.enemyx = this.enemyx - 1; 
            }else if (String(gameTime).substr(String(gameTime).length-3,1) == 8){
                //this.enemyx = this.enemyx + 0.5;
                this.enemy_size = this.enemy_size + 0.1;
            }else if (String(gameTime).substr(String(gameTime).length-3,1) == 9){
                this.enemyx = this.enemyx - 1; 
            }else {
               this.enemyx = this.enemyx + 0.1;
               this.enemyy = this.enemyy - 0.1; 
            } 

        }else if (this.enemy_type == 4){ 

                //this.enemyx = this.enemyx - this.enemyxx * this.enemy_speed * 2;
                this.enemyy = this.enemyy - 4;
                this.enemy_size = this.enemy_size - 1;
                //alert(this.enemy_size)
                 this.enemyw = this.enemyw - 1;
                 this.enemyh = this.enemyh - 1;
                 //alert(this.enemyw + "," + this.enemyh) 
                 
                //  this.weapponX = this.enemyx;
                //  this.weapponY = 100 +  Math.floor(Math.random() * 100);     
                 
                 //if (this.enemyy <= 20){
                if (this.enemyy <= Math.floor(Math.random() * 20) + 10){
                    this.weappon_create();
                    this.weapponArray = [];
                    this.enemyy = null;
                }      
    
        }else { 

            if (String(gameTime).substr(String(gameTime).length-3,1) == 1){
                    this.enemyy = this.enemyy - 1;
                    this.enemy_size = this.enemy_size - 0.1;
                    this.enemyx = this.enemyx + 0.1;
            }else if (String(gameTime).substr(String(gameTime).length-3,1) == 2){
                this.enemyy = this.enemyy - 1;
                this.enemy_size = this.enemy_size + 0.1;
                this.enemyx = this.enemyx + 0.5;
                this.enemyy = this.enemyy + 0.8;
                //this.enemyy = this.enemyy + Math.sqrt(Math.pow(this.enemxx, 2)+Math.pow(this.enemyy, 2));
            }else if (String(gameTime).substr(String(gameTime).length-3,1) == 3){
                this.enemyy = this.enemyy + 1;
                this.enemy_size = this.enemy_size - 0.05;
            }else if (String(gameTime).substr(String(gameTime).length-3,1) == 4){
                this.enemyy = this.enemyy + 1;
                this.enemy_size = this.enemy_size + 0.1;
                this.enemyx = this.enemyx - 0.3;
                this.enemyy = this.enemyy - 0.3; 
            }else if (String(gameTime).substr(String(gameTime).length-3,1) == 5){
                this.enemyx = this.enemyx + this.enemyxx * (Math.floor(Math.random() * 1)==0?1:-1);    
                this.enemyy = this.enemyy - this.enemyyy * (Math.floor(Math.random() * 1)==0?1:-1);               
            }else if (String(gameTime).substr(String(gameTime).length-3,1) == 6){
                this.enemyx = this.enemyx + 1;
                this.enemy_size = this.enemy_size - 0.05; 
                this.enemyy = this.enemyy - 0.6; 
            }else if (String(gameTime).substr(String(gameTime).length-3,1) == 7){
                this.enemyx = this.enemyx - 1; 
                this.enemyx = this.enemyx + 0.1;
                this.enemyy = this.enemyy - 0.6; 
            }else if (String(gameTime).substr(String(gameTime).length-3,1) == 8){
                this.enemyx = this.enemyx + 0.5;
                this.enemy_size = this.enemy_size + 0.1;
            }else if (String(gameTime).substr(String(gameTime).length-3,1) == 9){
                this.enemyx = this.enemyx - 1; 
            }else {
                this.enemyx = this.enemyx + 0.1;
                this.enemyy = this.enemyy - 0.1; 
            }
                    
            //적(enemy)) 이미지
            //적 미사일 초기 위치
            this.weapponX = this.enemyx;
            this.weapponY = this.enemyy;

        } 
    
    // //적의 크기는 플레이어의 크기보다 커질수는 없다.
    // if (this.enemyw >= playerWidth * 0.6){
    //     this.enemyw = playerWidth  * 0.6;
    //     this.enemyh = playerHeight  * 0.6;
    // }; 
    
    //적이 너무 작은경우(멀리있는경우) 오른쪽 엔진은 그려주지 않는다.(엔지하나가 몸체박으로 삐져나와 이상함.)
    if ( this.enemy_type == 4){

        // this.weapponX = this.enemyx;
        // this.weapponY = 100 +  Math.floor(Math.random() * 100);

        Context.drawImage(this.enemyImage,this.enemyx - 40, this.enemyy ,this.enemyw,this.enemyh);
        
        if ( this.enemyw >= ini_enemyw*2.8){
            Context.drawImage(this.enginImage,this.enemyx + this.enemyw/14 - Math.floor(Math.random() * 2),this.enemyy + this.enemyh - this.enemyh/3,Math.floor(Math.random() * 3) +  this.enemyw/4,Math.floor(Math.random() * 4) +  this.enemyh/3);
        }
        if ( this.enemyw >= ini_enemyw*2.8){
            Context.drawImage(this.enginImage,this.enemyx + this.enemyw/3 - Math.floor(Math.random() * 2),this.enemyy + this.enemyh - this.enemyh/3,Math.floor(Math.random() * 4) +  this.enemyw/4,Math.floor(Math.random() * 4) +  this.enemyh/3);
        }
        
    }else {
        //적엔진 원근감을 위해 기존크기에 *this.Edistance/4
        if ( this.enemyw >= ini_enemyw*0.8){
            Context.drawImage(this.enginImage,this.enemyx - this.enemyw/4 + Math.floor(Math.random() * 6),this.enemyy + this.enemyh/8,(Math.floor(Math.random() * 3) +  this.enemyw/3)*this.Edistance/4,(Math.floor(Math.random() * 4) +  this.enemyh/3)*this.Edistance/4);
        }
        if ( this.enemyw >= ini_enemyw*0.5){
            Context.drawImage(this.enginImage,this.enemyx - 10 - this.enemyw/4 - Math.floor(Math.random() * 8),this.enemyy + this.enemyh/8,(Math.floor(Math.random() * 4) +  this.enemyw/3)*this.Edistance/4,(Math.floor(Math.random() * 4) +  this.enemyh/3)*this.Edistance/4);
        }
 

        //적의 이동 원근효과를 주기위해 크기에 *this.Edistance/5
        Context.drawImage(this.enemyImage,this.enemyx - 40, this.enemyy ,this.enemyw*this.Edistance/5,this.enemyh*this.Edistance/5);
        //적이 너무 작은경우(멀리있는경우) 총은 그려주지 않는다.(총이 몸체박으로 삐져나와 이상함.)
        if ( this.enemyw >= ini_enemyw*0.5){
            Context.drawImage(this.enemyGunImage,this.enemyx + this.enemyw/30, this.enemyy + this.enemyh/10 ,Math.floor(Math.random() * 5) + this.enemyw/40,Math.floor(Math.random() * 5 + this.enemyw/40));
            Context.drawImage(this.enemyGunImage,this.enemyx + this.enemyw/37 - 2, this.enemyy + this.enemyh/10 ,Math.floor(Math.random() * 5) + this.enemyw/30,Math.floor(Math.random() * 5 + this.enemyw/30));
            Context.drawImage(this.enemyGunImage,this.enemyx + this.enemyw/40 - 5, this.enemyy + this.enemyh/10 ,Math.floor(Math.random() * 5) + this.enemyw/30,Math.floor(Math.random() * 5 + this.enemyw/30));
            Context.drawImage(this.enemyGunImage,this.enemyx + this.enemyw/42 - 7, this.enemyy + this.enemyh/10 ,Math.floor(Math.random() * 5) + this.enemyw/30,Math.floor(Math.random() * 5 + this.enemyw/30));
            Context.drawImage(this.enemyGunImage,this.enemyx + this.enemyw/42 - 10, this.enemyy + this.enemyh/10 ,Math.floor(Math.random() * 5) + this.enemyw/30,Math.floor(Math.random() * 5 + this.enemyw/30));
        }        
    }

    //적 에너지 표시
    this.enemy_energe();

    //Context.fillText(this.enemy_index + this.energe_bar,this.enemyx  - 40 + Math.floor(Math.random() * 3), this.enemyy - 10);
    Context.fillText(this.energe_bar,this.enemyx  - 40 + Math.floor(Math.random() * 3), this.enemyy - 10);

    //적 충돌 함수 => 충돌함수는 drawScreen()이 아닌 enemy_move 안에서 호출한다.(this가 계속 따라가도록)
    this.enemy_collision();

    //적 경계 이탈 방지 
    //적이 우측 경계에 붙으면
    if (this.enemyx >= maxX - 50){ 
        this.enemyxx = 0;
        this.enemyx = this.enemyx - Math.floor(Math.random() * 10); 
        //this.enemyy = this.enemyy + Math.floor(Math.random() * 2);
        //this.enemy_size = this.enemy_size - 0.1; 
        enemy_border_over_yn = 'Y'; 
            
        //적이 경계안으로 들어 오면 다시 테크를 update 한다. 
        if (this.enemyx <= maxX/4 ){ 
            enemy_border_over_yn = 'N';
            this.enemyx--;
        } 
    }

    //적이 좌측 경계에 붙으면
    if (this.enemyx <= minX + 20){ 
        this.enemyxx = 0;
        this.enemyx = this.enemyx + Math.floor(Math.random() * 10);
        //this.enemyy = this.enemyy - Math.floor(Math.random() * 2);
        //this.enemy_size = this.enemy_size - 0.1; 
        enemy_border_over_yn = 'Y';

        //적이 경계안으로 들어 오면 다시 테크를 update 한다. 
        if (this.enemyx >= (maxX - maxX/4)){ 
            enemy_border_over_yn = 'N';
            this.enemyx++;
        }         
    }

    //적이 하단 경계에 붙으면
    if (this.enemyy >= maxY - 100){ 
        this.enemyyy = 0;
        //this.enemyx = this.enemyx + Math.floor(Math.random() * 2); 
        this.enemyy = this.enemyy - Math.floor(Math.random() * 10);
        //this.enemy_size = this.enemy_size - 0.1; 
        enemy_border_over_yn = 'Y';

        //적이 경계안으로 들어 오면 다시 테크를 update 한다. 
        if (this.enemyy <= maxY/4 ){ 
            enemy_border_over_yn = 'N';
            this.enemyy++;
        }            
    }

    //적이 상단 경계에 붙으면
    if (this.enemyy < minY + 20){ 
        this.enemyyy = 0;
        //this.enemyx = this.enemyx - Math.floor(Math.random() * 2); 
        this.enemyy = this.enemyy + Math.floor(Math.random() * 10);
        //this.enemy_size = this.enemy_size - 0.1; 
        enemy_border_over_yn = 'Y';

        //적이 경계안으로 들어 오면 다시 테크를 update 한다. 
        if (this.enemyy >= (maxY - maxY/4) ){ 
            enemy_border_over_yn = 'N';
            this.enemyy--;
        }                    
    }  

}

////////////////// 전함01 이동
function ship01_move(){

    //if (gameTime >= 500000){
    if (gameTime < 2000){
        //alert("광선발사")
        //return;
    } 
        //전함01 이동
        if (ini_ship01x > 0){

            ship01x = ship01x - 0.1;
            //ship01x = ship01x/10;

            // Context.drawImage(ship01_Image,ship01x - 20,ship01y,60+gameTime/100,20+gameTime/100)
            // Context.drawImage(ship01_Image,ship01x,ship01y + 50,30+gameTime/100,10+gameTime/100)
            // Context.drawImage(ship01_Image,ship01x + 40,ship01y + 40,65+gameTime/100,15+gameTime/100)
            // Context.drawImage(ship01_Image,ship01x + 30,ship01y + 60,15+gameTime/100,5+gameTime/100)
            // Context.drawImage(ship01_Image,ship01x + 50,ship01y + 45,24+gameTime/100,8+gameTime/51000)
            Context.drawImage(ship01_Image,ship01x - 20,ship01y,60-gameTime/100,20-gameTime/100)
            Context.drawImage(ship01_Image,ship01x,ship01y + 50,30-gameTime/100,10-gameTime/100)
            Context.drawImage(ship01_Image,ship01x + 40,ship01y + 40,65-gameTime/100,15-gameTime/1000)
            Context.drawImage(ship01_Image,ship01x + 30,ship01y + 60,15-gameTime/100,5-gameTime/1000)
            Context.drawImage(ship01_Image,ship01x + 50,ship01y + 45,24-gameTime/100,8-gameTime/1000)

        }
}
////////////////// 게임 배경 화면
function game_background(){

    
    gameTime++;         //시간 증가
    //gameScore++;
    back_distance = back_distance + Pspeed*5;    //백그라운드 라인이 밖으로 나가면 다시 초기화(플레이어 속도만큼 더 빨리 진행)

    //Ready time
	//back_distance = back_distance + 0.1; 
    //if(gameTime > 100 && gameTime < 666){
        if(gameTime > 100){
            if (player_size > 140)
            {
                //시작 사운드
                if (parseInt(gameTime) <= 120){
                    raygun_sound.currentTime  = 2; 
                    raygun_sound.play();
                    playerImage = player_warp;
                //목소리 재생모드일경우만 실행                               
                }else if (parseInt(gameTime) <= 200){ 
                    raygun_sound.play(); 

                    if (ls_VColor == "yellow") {
                        vstart_sound.play();
                        // //대화
                        // Context.globalAlpha = 1;
                        // Context.font  = "30px Arial";  
                        // Context.fillStyle = '#ffffff';
                        // Context.fillText("자! 출발하자.",ls_width/2 - ls_width/10,50);
                    }
                }   

                ini_player_size = ini_player_size - 60;
                player_size = ini_player_size;
                //alert(ls_width)
                //playerX = playerX + parseInt(ls_width)/1800;
                //playerY = playerY + parseInt(ls_height)/100;
                
                playerX = playerX + parseInt(ls_width)*0.001;
                playerY = playerY + parseInt(ls_height)*0.01;

                //enemy_cnt = 8;
                //strKeyEventValue = "ArrowUp";
        
            }else {
                playerImage = player_90;
                player_size = 140; 
                //isKeyCode = "16";
                //strKeyEventValue = "";
                pmovex = 0;
                pmovey = 0;
                
            }
    }else if(gameTime <= 100 && gameTime > 50){    
        playerImage = player;        
    }else {
        playerImage = noneImage;
    }


    if (back_distance >= 1000){
        back_distance = 0;
    }

     //시간이 흐름에 따라 게임 타겟 방향 좌표 자동 이동
    if (parseInt(gameTime/800 % 9) == 0){
        cityEnd_x = cityEnd_x + 0.2*4/2;
        cityEnd_y = cityEnd_y + 0.1*4/2
    }else if (parseInt(gameTime/500 % 9) == 1){
        cityEnd_x = cityEnd_x - 0.5*4/2;
        cityEnd_y = cityEnd_y - 0.2*4/2;
    }else if (parseInt(gameTime/500 % 9) == 2){
        cityEnd_x = cityEnd_x + 0.5*4/2;
        cityEnd_y = cityEnd_y + 0.3*4/2;
    }else if (parseInt(gameTime/500 % 9) == 3){
        cityEnd_x = cityEnd_x + 0.1*4/2;
        cityEnd_y = cityEnd_y - 0.2*4/2;
    }else if (parseInt(gameTime/500 % 9) == 4){
        cityEnd_x = cityEnd_x - 0.6*4/2;
        cityEnd_y = cityEnd_y - 0.4*4/2;
    }else if (parseInt(gameTime/500 % 9) == 5){
        cityEnd_x = cityEnd_x + 0.7*4/2;
        cityEnd_y = cityEnd_y + 0.4*4/2;
    }else if (parseInt(gameTime/500 % 9) == 6){
        cityEnd_x = cityEnd_x - 0.4*4/2;
        cityEnd_y = cityEnd_y - 0.2*4/2;
    }else if (parseInt(gameTime/500 % 9) == 7){
        cityEnd_x = cityEnd_x + 0.3*4/2;
        cityEnd_y = cityEnd_y + 0.3*4/2;
    }else if (parseInt(gameTime/500 % 9) == 8){
        cityEnd_x = cityEnd_x - 0.2*4/2;
        cityEnd_y = cityEnd_y - 0.1*4/2;
    }else {
        cityEnd_x = cityEnd_x + 0.1*4/2;
        cityEnd_y = cityEnd_y + 0.2*4/2;
    }

    cityEnd_size =  cityEnd_size - pmovey/20;
     
    //플레이어 이동에 따른 게임 중심 좌표 이동
    // if (cityEnd_x > ls_width/2){ 
        
    //     cityEnd_x = cityEnd_x + pmovex/2;
    //     //cityEnd_y = cityEnd_y - pmovey/3; 

    // }else {
    //     cityEnd_x = cityEnd_x - pmovex/2;
    //     // if (cityEnd_x < init_cityEnd_x){
    //     //     cityEnd_x = cityEnd_x - pmovex/2;
    //     // }
    // }
 
//     if (cityEnd_y >= ls_height){  
//         //cityEnd_x = cityEnd_x - pmovex/3;
//         cityEnd_y = cityEnd_y + pmovey*2; 
// console.log("x",cityEnd_y)
//     }else {
 
              
/**********       
    //플레이어 이동에 따른 배경 중심좌표 이동
    if (wayBefore == 'R'){
        if (cityEnd_x > -500){
            cityEnd_x = cityEnd_x - 1 - playerX/2000;
        }else {
            cityEnd_x = cityEnd_x;
        }  
    } 

    if (wayBefore == 'L'){ 
        if (cityEnd_x < 500){
            cityEnd_x = cityEnd_x + 1 + playerX/2000;
        }else {
            cityEnd_x = cityEnd_x;
        } 
    }

    if (wayBefore == 'D'){
        if (cityEnd_y < -700){
            cityEnd_y = cityEnd_y;
        }else {
            cityEnd_y = cityEnd_y - 1  - playerY/2000;
        } 
    }
    
    if (wayBefore == 'U'){        
        if (cityEnd_y < ls_height + 600) {
            cityEnd_y = cityEnd_y + 1  + playerY/2000;
        }else {
            cityEnd_y = cityEnd_y;
        } 
    }
        
    if (wayBefore == 'RU'){
        if (cityEnd_x > -500){
            cityEnd_x = cityEnd_x - 1  - playerX/2000;
        }else {
            cityEnd_x = cityEnd_x;
        } 
        if (cityEnd_y < ls_height + 600) {
            cityEnd_y = cityEnd_y + 1 + playerY/2000;
        }else {
            cityEnd_y = cityEnd_y;
        }         
    } 

    if (wayBefore == 'LU'){ 
        if (cityEnd_x < 500){
            cityEnd_x = cityEnd_x + playerX/2000;
        }else {
            cityEnd_x = cityEnd_x;
        } 
        if (cityEnd_y < ls_height + 600) {
            cityEnd_y = cityEnd_y + 1 + playerY/2000;
        }else {
            cityEnd_y = cityEnd_y;
        }              
    }

    if (wayBefore == 'RU'){
        if (cityEnd_x > -500){
            cityEnd_x = cityEnd_x - 1;
        }else {
            cityEnd_x = cityEnd_x;
        } 
        if (cityEnd_y < -700){
            cityEnd_y = cityEnd_y;
        }else {
            cityEnd_y = cityEnd_y - 1;
        }       
    } 

    if (wayBefore == 'LU'){ 
        if (cityEnd_x < 500){
            cityEnd_x = cityEnd_x + 1;
        }else {
            cityEnd_x = cityEnd_x;
        } 
        if (cityEnd_y < -700){
            cityEnd_y = cityEnd_y;
        }else {
            cityEnd_y = cityEnd_y - 1;
        }             
    }   
***********/

    //코로니 바깥배경
    //배경회전 샘플
    // Context5.save();
    // Context5.globalAlpha = 0.8;
    // Context5.translate(theCanvas.clientWidth / 2  + cityEnd_x - 10, theCanvas.clientHeight / 4  + 50 + cityEnd_y);
    // Context5.rotate(backgroundAngle*0.4*Math.PI/180);   
    // Context5.drawImage(backgroundImage, -1*backgroundWidth, -1*backgroundHeight,backgroundWidth*3,backgroundHeight*3);  
    // //if (backgroundAngle>=360) backgroundAngle = 0;
    // Context5.restore(); 
    // backgroundAngle++;  

    //console.log("여기",String(gameTime).substring(String(gameTime).length-4,String(gameTime).length-3) % 5); 

    if (String(gameTime).substring(String(gameTime).length-4,String(gameTime).length-3) % 5 == 0){ 
        //확대
        Context5.globalAlpha = 0.8;
        backgroundX = backgroundX - 1;
        backgroundY = backgroundY - 1;        
        backgroundWidth = backgroundWidth + 1.5;
        backgroundHeight = backgroundHeight + 1.5;   
        Context5.drawImage(backgroundImage,backgroundX,backgroundY ,backgroundWidth,backgroundHeight); 
        backgroundAngle=0;
    }else if (String(gameTime).substring(String(gameTime).length-4,String(gameTime).length-3) % 5 == 1){
        //회전하면서 확대
        Context5.globalAlpha = 0.6;        
        backgroundX = backgroundX - 1;
        backgroundY = backgroundY - 1;
        backgroundWidth = backgroundWidth + 2;
        backgroundHeight = backgroundHeight + 2.5;  
        Context5.save(); 
        Context5.rotate(-1*backgroundAngle/6*Math.PI/180);   
        Context5.drawImage(backgroundImage,backgroundX,backgroundY ,backgroundWidth,backgroundHeight); 
        Context5.restore(); 
        backgroundAngle++;  
    }else if (String(gameTime).substring(String(gameTime).length-4,String(gameTime).length-3) % 5 == 2){
        //축소
        Context5.globalAlpha = 0.7;
        backgroundX = backgroundX + 1;
        backgroundY = backgroundY + 1;            
        backgroundWidth = backgroundWidth - 2.5;
        backgroundHeight = backgroundHeight - 2.5;  
        //Context5.save();  
        Context5.drawImage(backgroundImage,backgroundX,backgroundY ,backgroundWidth,backgroundHeight); 
        //Context5.restore(); 
        backgroundAngle=0;
    }else if (String(gameTime).substring(String(gameTime).length-4,String(gameTime).length-3) % 5 == 3){ 
        //회전하면서 확대
        Context5.globalAlpha = 0.6;        
        backgroundX = backgroundX + 1;
        backgroundY = backgroundY - 1.5;
        backgroundWidth = backgroundWidth + 3.5;
        backgroundHeight = backgroundHeight + 3;  
        Context5.save(); 
        Context5.rotate(backgroundAngle/20*Math.PI/180);   
        Context5.drawImage(backgroundImage,backgroundX,backgroundY ,backgroundWidth,backgroundHeight); 
        Context5.restore(); 
        backgroundAngle++;   
    }else {  
        if (String(gameTime).substring(String(gameTime).length-3,String(gameTime).length-2) >=9 ){ 
                //원본
                if (String(gameTime).substring(String(gameTime).length-4,String(gameTime).length-3) % 3 == 0){ 
                    backgroundImage=backgroundImage2;
                }else if (String(gameTime).substring(String(gameTime).length-4,String(gameTime).length-3) % 3 == 1){ 
                    backgroundImage=backgroundImage4; 
                }else {
                    backgroundImage=backgroundImage3;
                }
                Context5.globalAlpha = 0.7;
                backgroundX = 0;
                backgroundY = 0;            
                backgroundWidth = theCanvas.clientWidth;
                backgroundHeight = theCanvas.clientHeight;   
                Context5.drawImage(backgroundImage,backgroundX,backgroundY ,backgroundWidth,backgroundHeight); 
                backgroundAngle=0;
        }else {
                //배경회전 샘플
                Context5.save();
                Context5.globalAlpha = 0.8;
                backgroundWidth = theCanvas.clientWidth;
                backgroundHeight = theCanvas.clientHeight; 
                Context5.translate(backgroundWidth/2, backgroundHeight/2);
                Context5.rotate((backgroundAngle*backgroundAngle/800)*Math.PI/180);  
                //돌리기시작할때 이미지를 키운다. 
                //Context5.drawImage(backgroundImage, -1*theCanvas.clientWidth, -1*theCanvas.clientHeight,theCanvas.clientWidth*3-backgroundAngle/100,theCanvas.clientHeight*3-backgroundAngle/100);  
                Context5.drawImage(backgroundImage, -1*backgroundWidth, -1*backgroundHeight,backgroundWidth*3-backgroundAngle/15,backgroundHeight*3-backgroundAngle/15);  
                //if (backgroundAngle>=360) backgroundAngle = 0;
                Context5.restore(); 
                backgroundAngle++;  
        }
    } 

    //콜로니끝
    //콜로니 끝 근처는 어둡다.
    Context3.beginPath();
    Context3.arc(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + 50 ,theCanvas.clientHeight / 4 + cityEnd_y +  Math.floor(Math.random() * 3) ,100 +  Math.floor(Math.random() * 5) ,0,2*Math.PI);

    if (Math.floor(Math.random() * 2) == 2){
        Context3.stroke();        //원 테두리
        //Context3.fillStyle = 'gray';
    }else{
        Context3.fillStyle = 'black';
    }

    Context3.fillStyle = 'black';
    Context3.fill();

    //콜로니끝2
    //콜로니 끝 근처는 어둡다.
    Context3.beginPath();
    Context3.arc(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + 50 ,theCanvas.clientHeight / 4 + cityEnd_y +  Math.floor(Math.random() * 3) ,200 +  Math.floor(Math.random() * 5) ,0,2*Math.PI);

    if (Math.floor(Math.random() * 2) == 2){
        Context3.stroke();        //원 테두리
        //Context3.fillStyle = 'gray';
    }else{
        Context3.fillStyle = 'black';
    }

    Context3.fillStyle = 'black';
    Context3.fill();

    //콜로니끝3
    //콜로니 끝 근처는 어둡다.
    Context3.beginPath();
    Context3.arc(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + 50 ,theCanvas.clientHeight / 4 + cityEnd_y +  Math.floor(Math.random() * 3) ,500 +  Math.floor(Math.random() * 5) ,0,2*Math.PI);

    if (Math.floor(Math.random() * 2) == 2){
        Context3.stroke();        //원 테두리
        //Context3.fillStyle = 'gray';
    }else{
        Context3.fillStyle = 'black';
    }

    //Context3.fillStyle = 'black';
    Context3.fill();

    //Context3.drawImage(cityEndImage,theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x , theCanvas.clientHeight / 4 + cityEnd_y - 50 +  Math.floor(Math.random() * 3) ,  90 ,60 );
    //Context3.drawImage(cityEndImage,theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + 20 , theCanvas.clientHeight / 4 + cityEnd_y - 40 +  Math.floor(Math.random() * 3) ,  60 ,40 );
    //Context3.drawImage(cityEndImage,theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + 35 , theCanvas.clientHeight / 4 + cityEnd_y - 10 +  Math.floor(Math.random() * 3) ,  25 ,30 );
    Context3.drawImage(noneImage,theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + 35 , theCanvas.clientHeight / 4 + cityEnd_y - 10 +  Math.floor(Math.random() * 3) ,  200 ,100 );

    Context3.restore();

    //게임 배경 (벽)그려주기   =? 원근 효과
    //=> 게임방향목표좌표(전체화면넓이/2 + cityEnd_x, 전체화면 Y 높이/4)에서부터 시작하여 각 모서리 양끝으로 선을그려준다.(원근표현)
    Context3.globalAlpha = 0.3 * Math.floor(Math.random() * 4) + parseInt(playerY/1000);
    //console.log("playerY/100",playerY/100);

    if (enemy_boss_01_status == 1){
        Context3.globalAlpha = 0.3 * Math.floor(Math.random() * 2) + parseInt(playerY/1000);
    }

    if (enemy_boss_02_status == 1){
        Context3.globalAlpha = 0.4 * Math.floor(Math.random() * 2) + parseInt(playerY/1000);
    }
    //for (var i=1;i<=5;i++){

    //중앙상단선
    for (var i=0;i<=10;i++){

        Context3.beginPath();
        //Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size/2 + cityEnd_x +  Math.floor(Math.random() * 5) , theCanvas.clientHeight / 4 - 100);
        Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30 + ((theCanvas.clientWidth / 2  + cityEnd_x + 30) - (theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30))/2 , theCanvas.clientHeight / 4 - 50 + cityEnd_y);
        Context3.lineTo(theCanvas.clientWidth / 2  +  Math.floor(Math.random() * 10) + cityEnd_x, 0);
        Context3.strokeStyle = "grey";; //선 색상
        Context3.lineWidth = 2;
        Context3.stroke();
        //}

        //중앙상단에서 좌측 상단선 까지
        Context3.beginPath();
        //Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size/2 + cityEnd_x +  Math.floor(Math.random() * 5) , theCanvas.clientHeight / 4 - 100);
        Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30 + ((theCanvas.clientWidth / 2  + cityEnd_x + 30) - (theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30))/2 ,  theCanvas.clientHeight / 4 - 50 + cityEnd_y - i * 100);
        Context3.lineTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + 20 - i * 100 , theCanvas.clientHeight / 4 - 50 - i*10 + cityEnd_y + playerY/100);
        Context3.strokeStyle = "grey";; //선 색상
        Context3.lineWidth = 1;
        Context3.stroke();

        //중앙상단에서 우측 상단선 까지
        Context3.beginPath();
        //Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size/2 + cityEnd_x +  Math.floor(Math.random() * 5) , theCanvas.clientHeight / 4 - 100);
        Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30 + ((theCanvas.clientWidth / 2  + cityEnd_x + 30) - (theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30))/2 ,  theCanvas.clientHeight / 4 - 50 + cityEnd_y - i * 100);
        Context3.lineTo(theCanvas.clientWidth / 2  + cityEnd_x + i - 20  + i * 100, theCanvas.clientHeight / 4 - 50 - i*10  + cityEnd_y + playerY/100);
        Context3.strokeStyle = "grey";; //선 색상
        Context3.lineWidth = 1;
        Context3.stroke();

    }

    //좌측상단선
    // Context3.beginPath();
    // Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30 , theCanvas.clientHeight / 4 - 80 + cityEnd_y);
    // Context3.lineTo(400, 0);
    // Context3.strokeStyle = "grey";; //선 색상
    // Context3.stroke();

    for (var i=0;i<=10;i++){

        Context3.beginPath();
        Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - i + 20 , theCanvas.clientHeight / 4 - 40 + i*2 + cityEnd_y);
        Context3.lineTo(200 - 200 * i, 0);
        Context3.strokeStyle = "grey"; //선 색상
        Context3.lineWidth = 2;
        Context3.stroke();
    }

    // //좌중앙
    // Context3.beginPath();
    // Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 15 , theCanvas.clientHeight / 4 + cityEnd_y);
    // Context3.lineTo(0, theCanvas.clientHeight/6   +  Math.floor(Math.random() * 10));
    // //Context3.strokeStyle = "#f0f0f0";; //선 색상
    // Context3.strokeStyle = "grey";; //선 색상
    // Context3.stroke();

    //좌측하단선
    // Context3.beginPath();
    // Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30 , theCanvas.clientHeight / 4 + 50 + cityEnd_y);
    // Context3.lineTo(-300, theCanvas.clientHeight);
    // //Context3.strokeStyle = "#f0f0f0";; //선 색상
    // Context3.strokeStyle = "grey";; //선 색상
    // Context3.stroke();

    for (var i=0;i<5;i++){
        Context3.beginPath();
        Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x , theCanvas.clientHeight / 4 + 50 + cityEnd_y);
        Context3.lineTo(-300 -  i * 40, theCanvas.clientHeight - 40 * i);
        //Context3.strokeStyle = "#f0f0f0";; //선 색상
        Context3.strokeStyle = "grey";; //선 색상
        Context3.lineWidth = 1;
        Context3.stroke();
    }

    //우측상단선
    // Context3.beginPath();
    // Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x + 30, theCanvas.clientHeight / 4 - 80 + cityEnd_y);
    // Context3.lineTo(theCanvas.clientWidth - 400, 0 );
    // Context3.strokeStyle = "grey";; //선 색상
    // Context3.stroke();

    for (var i=0;i<=10;i++){
        Context3.beginPath();
        Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x + i - 20, theCanvas.clientHeight / 4 - 40 + i*2 + cityEnd_y);
        Context3.lineTo(theCanvas.clientWidth - 200 + 200 * i, 0);
        Context3.strokeStyle = "grey";; //선 색상
        Context3.lineWidth = 2;
        Context3.stroke();
    }

    // //우중앙
    // Context3.beginPath();
    // Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x + 15, theCanvas.clientHeight / 4 + cityEnd_y);
    // Context3.lineTo(theCanvas.clientWidth,  theCanvas.clientHeight / 4 - 50 +  Math.floor(Math.random() * 10));
    // Context3.strokeStyle = "grey";; //선 색상
    // Context3.stroke();

    //우측하단선
    // Context3.beginPath();
    // Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x  + 30, theCanvas.clientHeight / 4  + 50 + cityEnd_y);   //타겟 시작 좌표
    // Context3.lineTo(theCanvas.clientWidth, theCanvas.clientHeight - 150);  //배경 선(타겟으로부터 화면우측하단끝)
    // Context3.strokeStyle = "grey";; //선 색상
    // Context3.stroke();

    for (var i=0;i<5;i++){
        Context3.beginPath();
        Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x - 10, theCanvas.clientHeight / 4  + 50 + cityEnd_y);   //타겟 시작 좌표
        Context3.lineTo(theCanvas.clientWidth, theCanvas.clientHeight - i * 40 - theCanvas.clientHeight/10);  //배경 선(타겟으로부터 화면우측하단끝)
        Context3.strokeStyle = "grey"; //선 색상
        Context3.lineWidth = 2;
        Context3.stroke();
    }

    //루프를 많이 돌리수록 두께가 두꺼워지네
    //for (i=0;i<=100;i++){
		back_distance2 = back_distance2 + Pspeed*100;

		if (back_distance2 >= 1000){
				back_distance2 = 0;
        }

        // if (parseInt(gameTime/666) % 2 == 0){
        //     Context3.fillStyle = 'darkyellow'; // 채우기 색 지정
        // }else {
        //     Context3.fillStyle = 'skyblue'; // 채우기 색 지정
        // }

        //Context3.globalAlpha = "0.4"
        //Context3.strokeStyle = "balck";

        //메인원1
        //for(var i=0;i<=4;i++){
        for(var i=0;i<=15 - playerY/100;i++){


            // Context3.beginPath();
            // //Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 - 10 , back_distance2, 0, Math.PI * 2);
            // //Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 5   + cityEnd_y, 70 + back_distance   - cityEnd_size + cityEnd_x, 0, Math.PI * 2);
            // Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 5   + cityEnd_y, 70 + back_distance2, 0, Math.PI * 2);
            // Context3.stroke();

            // Context3.beginPath();
            // //Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 - 10 , back_distance2, 0, Math.PI * 2);
            // //Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 5 + 1 * i  + cityEnd_y, 55 + 5 * i + back_distance + Math.floor(Math.random() * 2) + 1 - cityEnd_size + cityEnd_x, 0, Math.PI * 2);
            // Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 5 + 1 * i  + cityEnd_y,  55 + 5 * i + back_distance2, 0, Math.PI * 2);
            // Context3.lineWidth = i;
            // //Context3.lineWidth = 2;
            // Context3.stroke();


            // //중앙상단에서 좌측하단 기둥
            // Context3.beginPath();
            // Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30 + ((theCanvas.clientWidth / 2  + cityEnd_x + 30) - (theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30))/2 ,  theCanvas.clientHeight / 4 - 50 + cityEnd_y - i * 100);
            // Context3.lineTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 + 1 * i  + cityEnd_y, 55 + 5 * i + back_distance + Math.floor(Math.random() * 2) + 1, 0 , theCanvas.clientHeight / 4 - 50 + i*10 + cityEnd_y);
            // Context3.strokeStyle = "grey";; //선 색상
            // Context3.lineWidth = 2;
            // Context3.stroke();

            if(i%2==0){
                //중앙 기둥 시작 마디
                Context3.beginPath();
                Context3.arc(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + ((theCanvas.clientWidth / 2  + cityEnd_x + 30) - (theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30))/2 + back_distance/10, theCanvas.clientHeight / 4 - 50  - back_distance, i*3, 0,Math.PI * 2);
                Context3.lineWidth = i - 2;
                Context3.stroke();

                //중앙 기둥 시작 마디
                Context3.beginPath();
                Context3.arc(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + ((theCanvas.clientWidth / 2  + cityEnd_x + 30) - (theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30))/2 + back_distance/10, theCanvas.clientHeight / 4  - back_distance, i*2, 0,Math.PI * 1);
                Context3.lineWidth = i - 3;
                Context3.stroke();                
            }

            //중앙상단에서 좌측하단 기둥
            if (String(gameTime).substring(String(gameTime).length-4,String(gameTime).length-3) % 2 == 0){             
                Context3.beginPath();
                Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + ((theCanvas.clientWidth / 2  + cityEnd_x + 30) - (theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30))/2 + back_distance/10, theCanvas.clientHeight / 4 - 50  - back_distance) ;
                Context3.lineTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 - 2*i - back_distance, theCanvas.clientHeight / 10 - i + back_distance/2 + cityEnd_y - i);
                Context3.strokeStyle = "grey";; //선 색상
                Context3.lineWidth = i;
                Context3.stroke();
            }


            //중앙상단에서 좌측하단 기둥
            if (String(gameTime).substring(String(gameTime).length-3,String(gameTime).length-2) % 2 == 0){              
                //좌측 기둥 끝 마디
                Context3.beginPath();
                Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 - 2*i - back_distance, theCanvas.clientHeight / 10 - i + back_distance/2 + cityEnd_y - i, i , 0,Math.PI * 2);
                //Context3.fillRect(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 - 40 - back_distance, theCanvas.clientHeight / 4 - 100 + back_distance/2 + cityEnd_y , 20 , 5);
                //Context3.fillRect(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 - 40 - back_distance, theCanvas.clientHeight / 4 - 100 + back_distance/2 + cityEnd_y , 5 , 20);
                Context3.lineWidth = 2;
                Context3.stroke();

                //좌측 기둥 끝 마디에서 하늘까지
                Context3.beginPath();
                Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 - 2*i - back_distance, theCanvas.clientHeight / 10 - i + back_distance/2 + cityEnd_y - i);
                Context3.lineTo(theCanvas.clientWidth / 2 - back_distance + cityEnd_x, theCanvas.clientHeight/12 - i  - cityEnd_y );
                Context3.strokeStyle = "grey";; //선 색상
                Context3.lineWidth = i/10;
                Context3.stroke();

            
                //좌측 기둥 끝 마디에서 땅까지
                Context3.beginPath();
                Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 - 2*i - back_distance, theCanvas.clientHeight / 10 - i + back_distance/2 + cityEnd_y - i);
                Context3.lineTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 - 2*i , theCanvas.clientHeight + i  + cityEnd_y + i);
                Context3.strokeStyle = "grey";; //선 색상
                Context3.lineWidth = i/10;
                Context3.stroke();
            }

            if (String(gameTime).substring(String(gameTime).length-4,String(gameTime).length-3) % 2 == 0){ 
                //중앙상단에서 우측하단 기둥
                Context3.beginPath();
                Context3.moveTo(theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x + ((theCanvas.clientWidth / 2  + cityEnd_x + 30) - (theCanvas.clientWidth / 2  - cityEnd_size + cityEnd_x - 30))/2 + back_distance/10, theCanvas.clientHeight / 4 - 50  - back_distance) ;
                Context3.lineTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 + 2*i + back_distance, theCanvas.clientHeight / 10 - i + back_distance/2 + cityEnd_y - i);
                Context3.strokeStyle = "grey";; //선 색상
                Context3.lineWidth = i;
                Context3.stroke();
            }

            //중앙상단에서 좌측하단 기둥
            if (String(gameTime).substring(String(gameTime).length-3,String(gameTime).length-2) % 2 == 0){      
                //우측 기둥 끝 마디
                Context3.beginPath();
                Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 + 2*i + back_distance, theCanvas.clientHeight / 10 - i + back_distance/2 + cityEnd_y - i, i , 0,Math.PI * 2);
                //Context3.fillRect(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 - 40 - back_distance, theCanvas.clientHeight / 4 - 100 + back_distance/2 + cityEnd_y , 20 , 5);
                //Context3.fillRect(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 - 40 - back_distance, theCanvas.clientHeight / 4 - 100 + back_distance/2 + cityEnd_y , 5 , 20);
                Context3.lineWidth = 2;
                Context3.stroke();

                //좌측 기둥 끝 마디에서 하늘까지
                Context3.beginPath();
                Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 + 2*i + back_distance, theCanvas.clientHeight / 10 - i + back_distance/2 + cityEnd_y - i*2);
                Context3.lineTo(theCanvas.clientWidth / 2  + back_distance + cityEnd_x, theCanvas.clientHeight/12 - i  - cityEnd_y );
                Context3.strokeStyle = "grey";; //선 색상
                Context3.lineWidth = i/10;
                Context3.stroke();
                
                //좌측 기둥 끝 마디에서 땅까지
                Context3.beginPath();
                Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 + 2*i + back_distance, theCanvas.clientHeight / 10 - i + back_distance/2 + cityEnd_y - i);
                Context3.lineTo(theCanvas.clientWidth / 2  + cityEnd_x + cityEnd_size/2 + 2*i , theCanvas.clientHeight + i  + cityEnd_y + i);
                Context3.strokeStyle = "grey";; //선 색상
                Context3.lineWidth = i/10;
                Context3.stroke();
            }

        }
        
        //메인원2
        //플레이어의 x,y좌표가 -200이하가 되면 에러가 발생되는 이상현상 해결.
        try {
            if (String(gameTime).substr(String(gameTime).length-3,1) <= 5){
                Context3.beginPath();
                Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 + 5 , 80 +  back_distance2 + cityEnd_y + Math.floor(Math.random() * 2) + 1, 0, Math.PI * 2);
                Context3.lineWidth = i - 2;
                Context3.stroke();
            } 
        } catch (error) {
            
        }

        // Context3.beginPath();
        // Context3.arc(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 + Math.floor(Math.random() * 1) + 1 ,85 + back_distance2 + cityEnd_y, 0, Math.PI * 2);
        // Context3.stroke();
    //}

    //코로니 배경 건물
    //for (var i = 0; i < 1; i++){

        //신기하게 아래 주석처리하면 안개 효과가 짙어지네..
        //삼각형(지붕 안개 효과)
        // Context3.beginPath();
        // Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2   , theCanvas.clientHeight / 4 - 20 + cityEnd_y);
        // Context3.lineTo(360  , 0);
        // Context3.lineTo( theCanvas.clientWidth - 360 , 0);

        // if (parseInt(gameTime/1000) % 5 == 0){
        //      cityImage = city01Image;

        //      Context3.closePath();
        //      Context3.fillStyle="#40608E";
        //      Context3.globalAlpha = 0.1;
        //      Context3.fill();

        //  }else if (parseInt(gameTime/1000) % 5 == 1){
        //       cityImage = city02Image;

        //       Context3.closePath();
        //       Context3.fillStyle="#408E8C";
        //       Context3.globalAlpha = 0.12;
        //       Context3.fill();

        //  }else if (parseInt(gameTime/1000) % 5 == 2){
        //      cityImage = city02Image;

        //      Context3.closePath();
        //      Context3.fillStyle="#9EA46B";
        //      Context3.globalAlpha = 0.14;
        //      Context3.fill();

        //  }else if (parseInt(gameTime/1000) % 5 == 3){
        //       cityImage = city02Image;

        //       Context3.closePath();
        //       Context3.fillStyle="#091413";
        //       Context3.globalAlpha = 0.16;
        //       Context3.fill();

        //   }else {
        //      cityImage = city02Image;

        //      Context3.closePath();
        //      Context3.fillStyle="#8E9695";
        //      Context3.globalAlpha = 0.1;
        //      Context3.fill();

        //  } 


        // //삼각형(지면 안개 효과)
        //  Context3.beginPath();
        //  Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 , theCanvas.clientHeight / 4  + cityEnd_y);
        //  Context3.lineTo(-200 - cityEnd_x, theCanvas.clientHeight - theCanvas.clientHeight/30);
        //  Context3.lineWidth = 1;
        //  Context3.lineTo( theCanvas.clientWidth + 200 + cityEnd_x + cityEnd_y, theCanvas.clientHeight - theCanvas.clientHeight/50 + cityEnd_x + cityEnd_y);

        Context3.beginPath();
        Context3.moveTo(theCanvas.clientWidth / 2  + cityEnd_x - cityEnd_size/2 , theCanvas.clientHeight / 4  + cityEnd_y);
        Context3.lineTo(-1*playerY - cityEnd_x, theCanvas.clientHeight - theCanvas.clientHeight/30);
        Context3.lineWidth = 1;
        Context3.lineTo( theCanvas.clientWidth + playerY + cityEnd_x + cityEnd_y, theCanvas.clientHeight);    

        //console.log("t",parseInt(gameTime/200) % 3);

         if (parseInt(gameTime/666) % 3 == 0){
        //    // cityImage = city01Image;

            Context3.closePath();
            Context3.fillStyle="#40608E";
            Context3.globalAlpha = 0.5;
            Context3.fill();
        }else if (parseInt(gameTime/666) % 3 == 1){
            // cityImage = city02Image;

             Context3.closePath();
             Context3.fillStyle="#408E8C";
             Context3.globalAlpha = 0.3;
             Context3.fill();
        }else {
            // cityImage = city02Image;

             Context3.closePath();
             Context3.fillStyle="#40608E";
             Context3.globalAlpha = 0.4;
             Context3.fill();
        } 

        var random01 = Math.floor(Math.random() * 2) + 1;
        var random02 = Math.floor(Math.random() * 5) + 1;
        var random03 = Math.floor(Math.random() * 10) + 1;
        var random04 = Math.floor(Math.random() * 15) + 1;
        var random05 = Math.floor(Math.random() * 20) + 1;
        var random06 = Math.floor(Math.random() * 30) + 1;  

        //지면 전체 맵
        // var cityImage1 = city01Image;
        // var cityImage2 = city02Image;
        // var cityImage3 = city03Image;
        // var cityImage4 = city04Image;
        // var cityImage5 = city05Image;
        // var cityImage6 = city06Image;
        // var cityImage7 = city07Image;
        // var cityImage8 = city08Image;
        // var cityImage9 = city09Image;

        //var tmp_str = String(parseInt(gameTime/10)); //분모가 작을수로 배경속도가 빨라진다.
        //console.log("cityEnd_y/100",10+parseInt(cityEnd_y/100));
        var tmp_str = String(parseInt(gameTime/(10+parseInt(cityEnd_y/100))));
        //var tmp_str = String(parseInt(gameTime/10));
        var tmp_num = tmp_str.substr(tmp_str.length-1);
        //console.log("tesT",str2);
         
        //시간에 따른 지면 맵 변경(1초마다 한단계씩 밀리도록 한다.)
        //if (gameTime > 5000){
        if (parseInt(gameTime/666) % 2 == 0){
            city01Image = city01Image_day;
            city02Image = city02Image_day;
            city03Image = city03Image_day;
            city04Image = city04Image_day;
            city05Image = city05Image_day;
            city06Image = city06Image_day;
            city07Image = city07Image_day;
            city08Image = city08Image_day;
            city09Image = city09Image_day;
            city10Image = city10Image_day;
        } 
        
        if(tmp_num == 0){
            cityImage1 = city09Image;
            cityImage2 = city01Image;
            cityImage3 = city02Image;
            cityImage4 = city03Image;
            cityImage5 = city04Image;
            cityImage6 = city05Image;
            cityImage7 = city06Image;
            cityImage8 = city07Image;
            cityImage9 = city08Image; 
        }

        if(tmp_num == 1){
            cityImage1 = city08Image;
            cityImage2 = city09Image;
            cityImage3 = city01Image;
            cityImage4 = city02Image;
            cityImage5 = city03Image;
            cityImage6 = city04Image;
            cityImage7 = city05Image;
            cityImage8 = city06Image;
            cityImage9 = city07Image; 
        }    
        
        if(tmp_num == 2){
            cityImage1 = city07Image;
            cityImage2 = city08Image;
            cityImage3 = city09Image;
            cityImage4 = city01Image;
            cityImage5 = city02Image;
            cityImage6 = city03Image;
            cityImage7 = city04Image;
            cityImage8 = city05Image;
            cityImage9 = city06Image; 
        }        

        if(tmp_num == 3){
            cityImage1 = city06Image;
            cityImage2 = city07Image;
            cityImage3 = city08Image;
            cityImage4 = city09Image;
            cityImage5 = city01Image;
            cityImage6 = city02Image;
            cityImage7 = city03Image;
            cityImage8 = city04Image;
            cityImage9 = city05Image; 
        }

        if(tmp_num == 4){
            cityImage1 = city05Image;
            cityImage2 = city06Image;
            cityImage3 = city07Image;
            cityImage4 = city08Image;
            cityImage5 = city09Image;
            cityImage6 = city01Image;
            cityImage7 = city02Image;
            cityImage8 = city03Image;
            cityImage9 = city04Image; 
        }        

        if(tmp_num == 5){
            cityImage1 = city04Image;
            cityImage2 = city05Image;
            cityImage3 = city06Image;
            cityImage4 = city07Image;
            cityImage5 = city08Image;
            cityImage6 = city09Image;
            cityImage7 = city01Image;
            cityImage8 = city02Image;
            cityImage9 = city03Image; 
        }

        if(tmp_num == 6){
            cityImage1 = city03Image;
            cityImage2 = city04Image;
            cityImage3 = city05Image;
            cityImage4 = city06Image;
            cityImage5 = city07Image;
            cityImage6 = city08Image;
            cityImage7 = city09Image;
            cityImage8 = city01Image;
            cityImage9 = city02Image; 
        }        

        if(tmp_num == 7){
            cityImage1 = city02Image;
            cityImage2 = city03Image;
            cityImage3 = city04Image;
            cityImage4 = city05Image;
            cityImage5 = city06Image;
            cityImage6 = city07Image;
            cityImage7 = city08Image;
            cityImage8 = city09Image;
            cityImage9 = city01Image; 
        }

        if(tmp_num == 8){
            cityImage1 = city01Image;
            cityImage2 = city02Image;
            cityImage3 = city03Image;
            cityImage4 = city04Image;
            cityImage5 = city05Image;
            cityImage6 = city06Image;
            cityImage7 = city07Image;
            cityImage8 = city08Image;
            cityImage9 = city09Image; 
        }  

        //주기적으로 건물 위치도 변경해준다. 
        if (parseInt(gameTime/200) % 2 == 0){
            city01Image = city11Image;
            city02Image = city12Image;
            city03Image = city13Image;
            city04Image = city14Image;
            city05Image = city15Image;
            city06Image = city16Image;
            city07Image = city17Image;
            city08Image = city18Image;
            city09Image = city19Image;
            city09Image = city20Image;
        }else {
 
            city01Image = city21Image;
            city02Image = city22Image;
            city03Image = city23Image;
            city04Image = city24Image;
            city05Image = city25Image;
            city06Image = city26Image;
            city07Image = city27Image;
            city08Image = city28Image;
            city09Image = city29Image;
            city09Image = city30Image;
        }
        
            // //지면 건물
            // //중심 마지막쪽은 플레이어의 좌표에따라 약간씩 변형된다.   
            // for (var j = 10/(parseInt(playerY/60)==0?1:parseInt(playerY/60)); j < 10; j){  
        
            //     //지면 땅
            //     Context3.globalAlpha = 0.6; 
            //     Context3.drawImage(eval("cityImage1"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 + (100 - playerX/7)/10 + 5,  15 + theCanvas.clientHeight / 6  + j   + cityEnd_y, j*4 - (200 - playerX/7)/10,60* random01 + 100 );
                
            //     j = j + (2*random01);     //건물 상하 조밀도
            //     //j = j + 60;
            // }         

            // for (var j = 10 ; j < 100;j){  
        
            //     //지면 땅
            //     Context3.globalAlpha = 0.4; 
            //     Context3.drawImage(eval("cityImage2"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2,  20 + theCanvas.clientHeight / 5.2  + j  + cityEnd_y, random01 + j*4 ,10 * random02 + 80)
    
            //     //j = j + (6*random02);     //건물 상하 조밀도 
                
            //     j = j + 12;
            // }     
            
            // for (var j = 100 ; j < 200;j){  
        
            //     //지면 땅
            //     Context3.globalAlpha = 0.4 
            //     Context3.drawImage(eval("cityImage3"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2,  20 + theCanvas.clientHeight / 5.6  + j   + cityEnd_y, random01 + j*4 ,100)
    
            //     //j = j + (6*random03);     //건물 상하 조밀도
            //     j = j + 20;     //건물 상하 조밀도

            //     //지붕 건물 반사
            //     Context3.globalAlpha = 0.02; 
            //     Context3.drawImage(eval("cityImage3"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random05  + cityEnd_y,  random01 + j*3 ,10 * random03 + 80)
                        
            //     //지붕 땅 반사
            //     Context3.globalAlpha = 0.04; 
            //     Context3.drawImage(eval("cityImage3"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random05  + cityEnd_y,  random01 + j*3 ,100)

            // }       
            

            // for (var j = 200 ; j < 300;j){  
        
            //     //지면 땅
            //     Context3.globalAlpha = 0.6; 
            //     Context3.drawImage(eval("cityImage4"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - parseInt(ls_width/2 - playerX)/20,  20 + theCanvas.clientHeight / 6  + j + random01  + cityEnd_y,  random01 + j*4 - parseInt(ls_width/2 - playerX)/20 ,10 * random01 + 80)
    
            //     j = j + (20*random01);     //건물 상하 조밀도
              
            //     //지붕 건물 반사
            //     Context3.globalAlpha = 0.02; 
            //     Context3.drawImage(eval("cityImage4"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*3 + playerX/5 ,10 * random02 + 80)
                        
            //     //지붕 땅 반사
            //     Context3.globalAlpha = 0.04; 
            //     Context3.drawImage(eval("cityImage4"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*4 ,10 * random01 + 80)
                
            // }   
            
            // for (var j = 300 ; j < 400;j){  
        
            //     //지면 땅
            //     Context3.globalAlpha = 0.8; 
            //     Context3.drawImage(eval("cityImage5"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - parseInt(ls_width/2 - playerX)/18,  20 + theCanvas.clientHeight / 6  + j + random01  + cityEnd_y,   random01 + j*4 - parseInt(ls_width/2 - playerX)/18 ,10 * random01 + 100 - playerX/60)    

            //     //지붕 건물 반사
            //     Context3.globalAlpha = 0.01; 
            //     Context3.drawImage(eval("cityImage5"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*3 + playerX/5 ,10 * random02 + 80)
                        
            //     //지붕 땅 반사
            //     Context3.globalAlpha = 0.03; 
            //     Context3.drawImage(eval("cityImage5"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*4 ,10 * random01 + 80)
                
            //     //j = j + (10*random05);     //건물 상하 조밀도
            //     j = j + 20*random01;     //건물 상하 조밀도
            // }    
            
            // for (var j = 400 ; j < 600;j){  
        
            //     //지면 땅
            //     Context3.globalAlpha = 0.9; 
            //     Context3.drawImage(eval("cityImage6"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - parseInt(ls_width/2 - playerX)/12,  20 + theCanvas.clientHeight / 6  + j  + cityEnd_y ,  random01 + j*4  - parseInt(ls_width/2 - playerX)/12 ,150 )
    
            //     //지붕 건물 반사
            //     Context3.globalAlpha = 0.01; 
            //     Context3.drawImage(eval("cityImage6"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*3 + playerX/5 ,10 * random02 + 80)
                        
            //     //지붕 땅 반사
            //     Context3.globalAlpha = 0.02; 
            //     Context3.drawImage(eval("cityImage6"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*4 ,10 * random01 + 80)
                                
            //     j = j + 30*random01;     //건물 상하 조밀도 
            //     //j = j + 40*random01;     //건물 상하 조밀도

            // }  

            // for (var j = 600 ; j < 800;j){  
        
            //     //지면 땅
            //     Context3.globalAlpha = 0.7; 
            //     Context3.drawImage(eval("cityImage7"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2,  20 + theCanvas.clientHeight / 6  + j   + cityEnd_y , j*4 ,180 )
    
            //     //지붕 건물 반사
            //     Context3.globalAlpha = 0.01; 
            //     Context3.drawImage(eval("cityImage7"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*3 + playerX/5 ,10 * random02 + 80)
                        
            //     //지붕 땅 반사
            //     Context3.globalAlpha = 0.01; 
            //     Context3.drawImage(eval("cityImage7"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*4 ,10 * random01 + 80)
                                
            //     j = j + 35*random03;     //건물 상하 조밀도 
            //     //j = j + 40*random01;     //건물 상하 조밀도

            // }  

            
            // for (var j = 800 ; j < 1000;j){  
        
            //     //지면 땅
            //     Context3.globalAlpha = 0.8; 
            //     Context3.drawImage(eval("cityImage8"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2,  20 + theCanvas.clientHeight / 8  + j + cityEnd_y ,  j*4 ,200 )
    
            //     j = j + 40*random02;     //건물 상하 조밀도 
            //     //j = j + 40*random01;     //건물 상하 조밀도

 
            // }  


            // for (var j = 1000 ; j < 1200;j){  
        
            //     //지면 땅
            //     Context3.globalAlpha = 0.9; 
            //     Context3.drawImage(eval("cityImage9"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2,  20 + theCanvas.clientHeight / 8  + j + cityEnd_y ,  j*4 ,300 )
    
            //     j = j + 45*random01;     //건물 상하 조밀도 
            //     //j = j + 40*random01;     //건물 상하 조밀도

 
            // }  

            //지면 건물
            //중심 마지막쪽은 플레이어의 좌표에따라 약간씩 변형된다.   
            for (var j = 10/(parseInt(playerY/60)==0?1:parseInt(playerY/60)); j < 2; j){  
        
                //지면 땅
                Context3.globalAlpha = 0.5; 
                Context3.drawImage(eval("cityImage1"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2,  30 + theCanvas.clientHeight / 6  + j   + cityEnd_y, j*4,60* random01 + 100 );
                
                j = j + (2*random01);     //건물 상하 조밀도
                //j = j + 60;

 
                //지붕 건물 반사
                Context3.globalAlpha = 0.02; 
                Context3.drawImage(eval("cityImage1"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*3 ,10 * random02 + 80)
                        
                //지붕 땅 반사
                Context3.globalAlpha = 0.03; 
                Context3.drawImage(eval("cityImage1"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*4 ,10 * random01 + 80)
            
            }    

            for (var j = 20 ; j < 60;j){  
        
                //지면 땅
                Context3.globalAlpha = 0.6; 
                Context3.drawImage(eval("cityImage2"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2,  20 + theCanvas.clientHeight / 5.2  + j  + cityEnd_y, random01 + j*4 ,random02 + j + 10)
    
                //j = j + (6*random02);     //건물 상하 조밀도 
                
                j = j + 12;

                //지붕 건물 반사
                Context3.globalAlpha = 0.01; 
                Context3.drawImage(eval("cityImage2"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*3 ,10 * random02 + 80)
                        
                //지붕 땅 반사
                Context3.globalAlpha = 0.02; 
                Context3.drawImage(eval("cityImage2"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*4 ,10 * random01 + 80)                
            }     
        
            for (var j = 40 ; j < 42;j){  
        
                //지면 땅
                Context3.globalAlpha = 0.6; 
                Context3.drawImage(eval("cityImage3"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*3,  20 + theCanvas.clientHeight / 4.4  + j  + cityEnd_y, random01 + j*6 ,40)
    
                //j = j + (6*random02);     //건물 상하 조밀도 
                
                j = j + 16;

                //지붕 건물 반사
                Context3.globalAlpha = 0.01*3; 
                Context3.drawImage(eval("cityImage3"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*3 ,10 * random02 + 80)
                        
                //지붕 땅 반사
                Context3.globalAlpha = 0.02*3; 
                Context3.drawImage(eval("cityImage3"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*4 ,10 * random01 + 80)                
            }   

            for (var j = 100 ; j < 102;j){  
        
                //지면 땅
                Context3.globalAlpha = 0.6; 
                Context3.drawImage(eval("cityImage4"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.6 - parseInt(ls_width/2)/28,  20 + theCanvas.clientHeight / 6  + j + random01  + cityEnd_y,  random01 + j*4 - parseInt(ls_width/2)/10 + 10,1 * random01 + 30)
    
                j = j + (10*random01);     //건물 상하 조밀도 
 
                //지붕 건물 반사
                Context3.globalAlpha = 0.01*3; 
                Context3.drawImage(eval("cityImage4"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*3,10 * random02 + 80)
                        
                //지붕 땅 반사
                Context3.globalAlpha = 0.02*3; 
                Context3.drawImage(eval("cityImage4"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*4 ,10 * random01 + 80)
                
            }   
  
            for (var j = 120 ; j < 122;j){  
        
                //지면 땅
                Context3.globalAlpha = 0.7; 
                Context3.drawImage(eval("cityImage5"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - parseInt(ls_width/2)/30,  20 + theCanvas.clientHeight / 6  + j + random01  + cityEnd_y,  random01 + j*4 - parseInt(ls_width/2)/26 ,4 * random01 + 34)
    
                j = j + (20*random01);     //건물 상하 조밀도 
 
                //지붕 건물 반사
                Context3.globalAlpha = 0.01*3; 
                Context3.drawImage(eval("cityImage5"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*3,10 * random02 + 80)
                        
                //지붕 땅 반사
                Context3.globalAlpha = 0.02*3; 
                Context3.drawImage(eval("cityImage5"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*4 ,10 * random01 + 80)

            }    

            for (var j = 154 ; j < 156;j){  
        
                //지면 땅
                Context3.globalAlpha = 0.8; 
                Context3.drawImage(eval("cityImage5"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - parseInt(ls_width/2)/30,  20 + theCanvas.clientHeight / 6  + j + random01  + cityEnd_y,  random01 + j*4 - parseInt(ls_width/2)/50 ,4 * random01 + 36)
    
                j = j + (20*random01);     //건물 상하 조밀도 

                //지붕 건물 반사
                Context3.globalAlpha = 0.01*2; 
                Context3.drawImage(eval("cityImage5"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*3,10 * random02 + 80)
                        
                //지붕 땅 반사
                Context3.globalAlpha = 0.02*2; 
                Context3.drawImage(eval("cityImage5"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*4 ,10 * random01 + 80)                
            }   

            for (var j = 190 ; j < 192;j){  
        
                //지면 땅
                Context3.globalAlpha = 0.9; 
                Context3.drawImage(eval("cityImage6"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - parseInt(ls_width/2)/20,  20 + theCanvas.clientHeight / 6  + j + random01  + cityEnd_y,  random01 + j*4 - parseInt(ls_width/2)/80 ,5 * random01 + 80)
    
                j = j + (20*random01);     //건물 상하 조밀도
              
                //지붕 건물 반사
                Context3.globalAlpha = 0.02*2; 
                Context3.drawImage(eval("cityImage6"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*3 ,10 * random02 + 80)
                        
                //지붕 땅 반사
                Context3.globalAlpha = 0.04*2; 
                Context3.drawImage(eval("cityImage6"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*4 ,10 * random01 + 80)
            }   
            
            for (var j = 240 ; j < 242;j){  
        
                //지면 땅
                Context3.globalAlpha = 0.8; 
                Context3.drawImage(eval("cityImage7"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - parseInt(ls_width/2)/18,  20 + theCanvas.clientHeight / 6  + j + random01  + cityEnd_y,   random01 + j*4 - parseInt(ls_width/2)/18 ,6 * random01 + 80)    

                //지붕 건물 반사
                Context3.globalAlpha = 0.01*2; 
                Context3.drawImage(eval("cityImage7"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*3 ,10 * random02 + 80)
                        
                //지붕 땅 반사
                Context3.globalAlpha = 0.03*2; 
                Context3.drawImage(eval("cityImage7"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*4 ,10 * random01 + 80)
                
                //j = j + (10*random05);     //건물 상하 조밀도
                j = j + 20*random01;     //건물 상하 조밀도
            }    

            for (var j = 300 ; j < 302;j){  
        
                //지면 땅
                Context3.globalAlpha = 0.8; 
                Context3.drawImage(eval("cityImage7"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - parseInt(ls_width/2)/18,  20 + theCanvas.clientHeight / 6  + j + random01  + cityEnd_y,   random01 + j*4 - parseInt(ls_width/2)/18 ,6 * random01 + 86)    

                //지붕 건물 반사
                Context3.globalAlpha = 0.01*2; 
                Context3.drawImage(eval("cityImage7"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*3 ,10 * random02 + 80)
                        
                //지붕 땅 반사
                Context3.globalAlpha = 0.03*2; 
                Context3.drawImage(eval("cityImage7"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*4 ,10 * random01 + 80)
                
                //j = j + (10*random05);     //건물 상하 조밀도
                j = j + 20*random01;     //건물 상하 조밀도
            }    
            
            for (var j = 340 ; j < 344;j){  
        
                //지면 땅
                Context3.globalAlpha = 0.9; 
                Context3.drawImage(eval("cityImage8"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - parseInt(ls_width/2)/12,  20 + theCanvas.clientHeight / 6  + j  + cityEnd_y ,  random01 + j*4  - parseInt(ls_width/2)/12 ,100 );

                //지붕 건물 반사
                Context3.globalAlpha = 0.01*2; 
                Context3.drawImage(eval("cityImage8"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*3 ,10 * random02 + 80)
                        
                //지붕 땅 반사
                Context3.globalAlpha = 0.02*2; 
                Context3.drawImage(eval("cityImage8"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*4 ,10 * random01 + 80)
                                
                j = j + 30*random01;     //건물 상하 조밀도 
                //j = j + 40*random01;     //건물 상하 조밀도

            }  

            for (var j = 400 ; j < 410;j){  
        
                //지면 땅
                Context3.globalAlpha = 0.9; 
                Context3.drawImage(eval("cityImage8"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - parseInt(ls_width/2)/12,  20 + theCanvas.clientHeight / 6  + j  + cityEnd_y ,  random01 + j*4  - parseInt(ls_width/2)/12 ,80 );

                //지붕 건물 반사
                Context3.globalAlpha = 0.01; 
                Context3.drawImage(eval("cityImage8"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*3 ,10 * random02 + 80)
                        
                //지붕 땅 반사
                Context3.globalAlpha = 0.02; 
                Context3.drawImage(eval("cityImage8"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*4 ,10 * random01 + 80)
                                
                j = j + 30*random01;     //건물 상하 조밀도 
                //j = j + 40*random01;     //건물 상하 조밀도

            }              

            for (var j = 450 ; j < 476;j){  
        
                //지면 땅
                Context3.globalAlpha = 0.7; 
                Context3.drawImage(eval("cityImage8"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2,  20 + theCanvas.clientHeight / 6  + j   + cityEnd_y , j*4 ,160 )
    
                //지붕 건물 반사
                Context3.globalAlpha = 0.01; 
                Context3.drawImage(eval("cityImage8"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*3 ,10 * random02 + 80)
                        
                //지붕 땅 반사
                Context3.globalAlpha = 0.02; 
                Context3.drawImage(eval("cityImage8"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*4 ,10 * random01 + 80)
                                
                j = j + 35*random03;     //건물 상하 조밀도 
                //j = j + 40*random01;     //건물 상하 조밀도

            }  
            
            for (var j = 600 ; j < 608;j){  
        
                //지면 땅
                Context3.globalAlpha = 0.8; 
                Context3.drawImage(eval("cityImage9"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2,  20 + theCanvas.clientHeight / 8  + j + cityEnd_y ,  j*4 ,200 )
    
                j = j + 40*random02;     //건물 상하 조밀도 
                //j = j + 40*random01;     //건물 상하 조밀도
                //지붕 건물 반사
                Context3.globalAlpha = 0.01; 
                Context3.drawImage(eval("cityImage9"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*3 ,10 * random02 + 80)
                        
                //지붕 땅 반사
                Context3.globalAlpha = 0.02; 
                Context3.drawImage(eval("cityImage9"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*4 ,10 * random01 + 80)
            }  

            for (var j = 800 ; j < 808;j){  
        
                //지면 땅
                Context3.globalAlpha = 0.9; 
                Context3.drawImage(eval("cityImage9"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2,  20 + theCanvas.clientHeight / 8  + j + cityEnd_y ,  j*4 ,300 )
    
                j = j + 45*random01;     //건물 상하 조밀도 
                //j = j + 40*random01;     //건물 상하 조밀도
                //지붕 건물 반사
                Context3.globalAlpha = 0.01; 
                Context3.drawImage(eval("cityImage9"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*3  ,10 * random02 + 80)
                        
                //지붕 땅 반사
                Context3.globalAlpha = 0.02; 
                Context3.drawImage(eval("cityImage9"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*1.5 - 10,theCanvas.clientHeight / 10  - j - random01  + cityEnd_y,  random01 + j*4 ,10 * random01 + 80)
 
            }  

            for (var j = 1000 ; j < 1010;j){  
        
                //지면 땅
                Context3.globalAlpha = 0.9; 
                Context3.drawImage(eval("cityImage9"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2,  20 + theCanvas.clientHeight / 8  + j + cityEnd_y ,  j*4 ,300 )
    
                j = j + 45*random01;     //건물 상하 조밀도 
                //j = j + 40*random01;     //건물 상하 조밀도

 
            }              

            for (var j = 1300 ; j < 1302;j){  
        
                //지면 땅
                Context3.globalAlpha = 0.9; 
                Context3.drawImage(eval("cityImage9"),theCanvas.clientWidth / 2  - parseInt(cityEnd_size/2) + cityEnd_x - j*2,  20 + theCanvas.clientHeight / 8  + j + cityEnd_y ,  j*4 ,300 )
    
                j = j + 45*random01;     //건물 상하 조밀도 
                //j = j + 40*random01;     //건물 상하 조밀도

 
            }   

    //첫번째 보스가 파괴되고 나면 아래에서 전함이 나온다.
    if (enemy_boss_01_status == 2){

        Context3.globalAlpha = 1;

        if (l >= 500){

            m = m + 0.2;

            if (m<=300){
                Context3.drawImage(enemy05Image,600 - l + m,(theCanvas.clientHeight + 20) -l  + m,  1600 - l  + m ,800 - l  + Math.random()*2);
            }else {
                m = 0;
                l = -200;
            };

        }else {
            l = l + 0.6;
            Context3.drawImage(enemy05Image,600 - l,(theCanvas.clientHeight + 20) -l,  1600 - l ,800 - l   + Math.random()*2);
        } 
        
    }


     //두번째 보스가 파괴되고 나면 아래에서 전함이 나온다.
     if (enemy_boss_02_status == 2){

        Context3.globalAlpha = 1;

        if (l >= 500){

            m = m + 0.2;

            if (m<=300){
                Context3.drawImage(enemy05Image,600 - l + m,(theCanvas.clientHeight + 20) -l  + m,  1600 - l  + m ,800 - l  + Math.random()*2);
            }else {
                m = 0;
                l = -200;
            };

        }else {
            l = l + 0.6;
            Context3.drawImage(enemy05Image,600 - l,(theCanvas.clientHeight + 20) -l,  1600 - l ,800 - l   + Math.random()*2);
        } 
        
    }   
            
    //투명도 원상태로
    Context3.fillStyle = '#ffffff';
    Context3.globalAlpha = 0.8;
    Context3.strokeStyle = "ffffff";  
    
}

var l = 0;
var m = 0;  
var k = 0;
var ls_next_yn = 'N';

////////////////// 게임 상태 표시
function game_status(){
    
    Context.globalAlpha = 1;
    Context.font = '30px Arial';
    Context.font = '100px Arial';
    Context.fillStyle = "#ffffff";

    if (status == 1){
        //Context.fillText("Ready", (theCanvas.clientWidth - ini_player_width) / 2 - theCanvas.offsetLeft - 100, theCanvas.clientHeight / 2 - theCanvas.offsetTop);
        clearInterval(Timer_Id);
        return;
    }else if (status == 3){
        Context.fillText("Pause", (theCanvas.clientWidth - ini_player_width) / 2 - theCanvas.offsetLeft - 100, theCanvas.clientHeight / 2 - theCanvas.offsetTop);
        clearInterval(Timer_Id);
        return;
    }else if (status == 4){
        Context.fillText("Game Over", (theCanvas.clientWidth - ini_player_width) / 2 - theCanvas.offsetLeft - 200, theCanvas.clientHeight / 2 - theCanvas.offsetTop);
        clearInterval(Timer_Id);
        return;
    }
}

////////////////// 캔버스 컨트롤(게임 프래임 진행시 호출하여 생성)
function gameControl() {

    
    //Context2.globalAlpha = 0.3;

    //윈도우의 경우 캔버스 컨트롤을 보여주지않는다.
	if (navigator.platform.substr(0,3) == "Win" ){
        Context2.globalAlpha = 0;
    }


    //색상값이 white가 아닌경우 테두리랑 투명도, 색상 변경.
    if (ls_CColor == 'red'){
        //Context2.globalAlpha = 1;
        Context2.globalAlpha = 0.8;
        Context2.lineWidth = "1";
        //Context2.strokeStyle = ls_CColor;
        //Context2.fillStyle = ls_CColor;
        Context2.strokeStyle = "#ffffff";
        Context2.fillStyle = "#ffffff";
    }

    Context2.stroke(directonUp);
    Context2.stroke(directonLeft);
    Context2.stroke(directonRight);
    Context2.stroke(directonDown);
    Context2.stroke(directonUpLeft);
    Context2.stroke(directonUpRight);
    Context2.stroke(directonDownLeft);
    Context2.stroke(directonDownRight);
    Context2.stroke(directonMiddle);

    Context2.stroke(button01);
    Context2.stroke(button02);
    Context2.stroke(button03);
    Context2.stroke(button04);
        
} 
var  ls_height2 = window.innerHeight; 

function fit_fullsize(){
    //event.preventDefault(); 
    //윈도우의 경우 캔버스 컨트롤을 보여주지않는다.
    //if (navigator.platform.substr(0,3) == "Win" && ls_height != ls_height2){
    if (ls_height != ls_height2){
        ls_height = window.innerHeight;      
        ls_width = window.innerWidth;   
    
        ////////////////// 게임 캠퍼스 재조정
        //toggleFullScreen(); 
        fitToContainer(theCanvas); 
        ls_height2 = window.innerHeight;
         
        //게임 화면 경계
        minX = theCanvas.offsetLeft;
        maxX = theCanvas.clientWidth - minX;
        minY = theCanvas.offsetTop;
        maxY = theCanvas.clientHeight - minY;
         
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
 
        button03 = new Path2D();
        button03.fillStyle = "rgb(242, 255, 0)";
        //button02.arc(maxX - 80, maxY - 180, 80, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)
        button03.arc(maxX - 140, maxY - 310, 70, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)
 

        button04 = new Path2D();
        button04.fillStyle = "rgb(242, 255, 0)";
        //button02.arc(maxX - 80, maxY - 180, 80, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)
        button04.arc(maxX - 140, maxY - 410, 70, 0, 2*Math.PI, true);    //arc(x, y, radius, startAngle, endAngle, anticlockwise)
 
    } 
}
//////////////////마우스 클릭시 이벤트 메핑
GameCanvas.addEventListener('mousedown', function(event) { 

    //event.preventDefault(); 
    //윈도우의 경우 캔버스 컨트롤을 보여주지않는다.
    fit_fullsize();

    //모바일인경우 게임진행시에는 리턴
    if (status == 2){
        if (navigator.platform.substr(0,3) != "Win" ){
            return;
        }
    } 
    
    //마우스 왼쪽 버튼 클릭(down)
    if (event.button == 0){

        isKeyCode = 32; 
 
        //공격 스킬구분에 따른 공격 레이져 초기변수 
        if (skill == 1){    
            laser_charge_total_time = 0;
            laser_charge_start_time  = gameTime;     
            l_width = 10; 
        }else if (skill == 2){          
            laser_charge_total_time = 0;      
            laser_charge_start_time  = gameTime;             
            l_width = 1;              
        }else { 
            laser_charge_total_time = 0;
            laser_charge_start_time  = gameTime;            
            l_width = 2;   
            //warp_sound.currentTime  = 0;
            //warp_sound.play();         
        } 

        x = event.clientX;
        y = event.clientY;

        laser_radian(x,y);     
    }

    //스킬체이지
    if (event.button == 1){

        //폭멸탄 사운드 
        //appear_sound.currentTime = 2;
        //appear_sound.play();  
        // tmp_skill = skill;
        // ++skill;
        skill_change(); 
        //(skill == 1)?skill=2:skill=1;
    }

    //마우스 오른쪽 버튼 클릭
    if (event.button == 2){

        isKeyCode = 16; 

    }

    //플레이어(보너스)가 남아있는경우 자동 재시작
    //게인 진행중이 아닐때 마우스로 화면 클릭시 재시도,종료 버튼 보여줌
    if (first_load_yn == "Y"){
        gameStart(13);
    }else {
        gameRetryExitButton();
    }

  });

  
  //마우스휠
  GameCanvas.addEventListener('mousewheel', function(event) {  
        //event.preventDefault(); 
        //모바일인경우 게임진행시에는 리턴
        if (status == 2){
            if (navigator.platform.substr(0,3) != "Win" ){
                return;
            }
        } 
    
        //if (event.wheelDelta) delta = event.wheelDelta / 120; /* IE/Chrome/Opera */
        //else if (event.detail) delta = -event.detail/3; /* Mozilla case */
     
        //isKeyCode = 90; 
        sword_yn = 'Y';
        //sword_move(); 
        //sword_yn = 'N';
  }); 

  GameCanvas.addEventListener('mouseup', function(event) { 

    //event.preventDefault(); 
    //모바일인경우 게임진행시에는 리턴
    if (status == 2){
        if (navigator.platform.substr(0,3) != "Win" ){
            return;
        }
    } 

    //마우스 왼쪽 버튼 떼기(up)
    if (event.button == 0){
        isKeyCode = null;

        x = event.clientX;
        y = event.clientY;

        laser_radian(x,y); 

    }

    //마우스 오른쪽 버튼 떼기
    if (event.button == 2){
        isKeyCode = null;
    } 

  }); 

  GameCanvas.oncontextmenu = function () {
    return false;
  };

 ///////////////// 게임 재시도 or 나가기 버튼 보여주기
 function gameRetryExitButton(){ 

    if (!(status == 2 || status == 3))
    { 
         playerImage = noneImage;
         laserImage = noneImage;
         player_warp =  noneImage;
         Context.drawImage(explosionImage01,playerX-Math.floor(Math.random()*40),playerY+Math.floor(Math.random()*40),35,25);
         Context.drawImage(explosionImage01,playerX-10,playerY - 15,60*(Pdistance/500)*playerHeight/50,30*(Pdistance/500)*playerWidth/10);
         Context.drawImage(explosionImage01,playerX+Math.floor(Math.random()*10),playerY-Math.floor(Math.random()*60),120,115);

         playerImage = explosionImage01;
         player_warp = explosionImage01;

        //alert(player_cnt);
        //제일 처음 페이지 로드시에는 바로 시작
        //if (first_load_yn == "Y" && parseInt(player_cnt) > 0){
        if (first_load_yn == "Y"){

            gameStart(13); 

        }else { 

            Context.font = '50px Arial';
            //gameEnd(27);
            //게임 재시도 or 나가기
            Context.stroke(button_play);
            Context.stroke(button_end);
            //Context.fillRect(ls_width/2 - 250, ls_height/2 - 250 , 250, 150);
            Context.fillText("Retry",ls_width/2 - 160, ls_height/2 - 140);
            Context.fillText("Exit",ls_width/2 + 120, ls_height/2 - 140);

            //개발모드일경우만 이어서 플레이 가능
            if (ls_DColor == "green"){
                Context.fillText("Continue",ls_width/2 - 200 + 120, ls_height - ls_height/4);
                Context.stroke(button_continue);
            }

            isKeyDown = [];
            isKeyCode = null; 

        }
    }

    return;
 }


////////////////////공격 스킬 체인지 함수
function skill_change(){  
    laser_init();
    //폭탄장착도중 스킬변경시 소리및 변수초기화 
    timmer_sound.pause();
    laser_charge_total_time = 0;
    laser_charge_start_time  = gameTime; 

    //스킬변경시 약간의 텀(tmp_skill에 skill이 먼저 완전히 저장되고 나중에 비교되기위해서)
    //setTimeout(skill_change2,500);  
    if (skill_change2() == "Y"){
        if(tmp_skill != skill){
            if (skill > 5){ 
                //skill = 0;
                skill = 1;
            }    
        }  
        tmp_skill = null;
        //skill_change2() = "N";
    }; 

    //목소리 재생모드일경우만 실행 
    if (ls_VColor == "yellow"){
        vskill_sound.play();  
    }   
}
 

function skill_change2(){ 
    //폭탄장착도중 스킬변경시 소리및 변수초기화 
    timmer_sound.pause();
    laser_charge_total_time = 0;
    laser_charge_start_time  = gameTime;    
    //mount_sound.currentTime;
    mount_sound.play(); 

    ++skill;
 
    // if(tmp_skill != skill){
    //     if (skill >= 3){
    //         skill = 1;
    //     }   
    // }  
    //목소리 재생모드일경우만 실행 
    if (ls_VColor == "yellow"){
        vskill_sound.play();
        //대화
        Context.globalAlpha = 1;
        Context.font  = "30px Arial";  
        Context.fillStyle = '#ffffff'; 
        //대화 내용 텀 길게 표시
        tmp_time = gameTime + 10;
        Tmp_Id = setInterval(tmp_text , 1/1000); 
    } 

    return "Y";
}

var tmp_time = 0;
function tmp_text(){ 
    if(gameTime <= tmp_time){ 
        Context.fillText("스킬 변경 완료.",ls_width/2 - ls_width/10,50);
    }else {
        clearInterval(Tmp_Id);
    }
}

////////////////// 돔(doom)의 이벤트에 매핑(전역 키코드를 변경하여 프래임 진행시 방향 전환)
function clickCanvas(event, as_gb) {
 
	//if (status != 2)
	//{
		//gameStart(13);
    //}

    //플레이어(보너스)가 남아있는경우 자동 재시작
    //게인 진행중이 아닐때 마우스로 화면 클릭시 재시도,종료 버튼 보여줌
    if (first_load_yn == "Y"){
        gameStart(13);
    }else {
        //alert("touch")
        gameRetryExitButton();
    } 

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
		Context.stroke(directonUp);    //키 입력 반응체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 down
	if(Context.isPointInPath(directonDown, x,  y)) {
		//wayBefore = 'D';
		//pmovey = pmovey + 0.1 * Pspeed/5;
		//strKeyEventValue = "ArrowDown";
		isKeyCode = 40;
        strKeyEventValue = "ArrowDown";
        wayBefore = 'D';
		Context.stroke(directonDown); //키 입력 반응체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 left
	if(Context.isPointInPath(directonLeft, x,  y)) {
		//wayBefore = 'L';
		//pmovex = pmovex - 0.1 * Pspeed/5;
		//strKeyEventValue = "ArrowLeft";
		isKeyCode = 37;
        strKeyEventValue = "ArrowLeft";
        wayBefore = 'L';
		Context.stroke(directonLeft);  //키 입력 반응체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 right
	if(Context.isPointInPath(directonRight, x,  y)) {
		//wayBefore = 'R';
		//pmovex = pmovex + 0.1 * Pspeed/5;
		//strKeyEventValue = "ArrowRight";
		isKeyCode = 39;
        strKeyEventValue = "ArrowRight";
        wayBefore = 'R';
		Context.stroke(directonRight);  //키 입력 반응체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 upLeft
	if(Context.isPointInPath(directonUpLeft, x,  y)) {
		isKeyCode = 36;
        wayBefore = 'LU';
		Context.stroke(directonUpLeft);    //키 입력 반응체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 UpRight
	if(Context.isPointInPath(directonUpRight, x,  y)) {
		isKeyCode = 33;
		//strKeyEventValue = "RU";
        wayBefore = 'RU';
		Context.stroke(directonUpRight);  //키 입력 반응체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
    }

    //방향 downLeft
	if(Context.isPointInPath(directonDownLeft, x,  y)) {
		isKeyCode = 35;
		//strKeyEventValue = "LD";
        wayBefore = 'LD';
		Context.stroke(directonDownLeft); //키 입력 반응체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 downRight
	if(Context.isPointInPath(directonDownRight, x,  y)) {
		isKeyCode = 34;
		//strKeyEventValue = "RD";
        wayBefore = 'RD';
		Context.stroke(directonDownRight);  //키 입력 반응체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
	}

    //방향 중앙 정지
	if(Context.isPointInPath(directonMiddle, x,  y)) {
		isKeyCode = "81";
        strKeyEventValue = "";
        pmovex = 0;
        pmovey = 0;
		Context.stroke(directonMiddle);  //키 입력 반응체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
    } 
 
    //레이져 버튼 터치
    //레이져 발사currentTime
    //var laser_touch_time = 0; 
	if(Context.isPointInPath(button01, x,  y)) {

		Context.stroke(button01);    //키 입력 반입체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여) 

        BtnaimX = x;
        BtnaimY = y;

        //공격 스킬구분에 따른 공격 사운드및 레이져 초기변수
        if (skill == 1){ 
            shootgun_sound.currentTime  = 0.2;
            shootgun_sound.play();   
        }else if (skill == 2){   
            laser_sound.currentTime  = 0;
            laser_sound.play();    
        }else if (skill == 3){
            laser_charge_total_time = 0;
            laser_charge_start_time  = gameTime;   
            //폭탄 장착 소리 추가
            timmer_sound.currentTime  = 0.8;
            timmer_sound.play(); 
        }else if (skill == 4){

            laser_charge_total_time = 0;
            laser_charge_start_time  = gameTime;         

            warp_sound.currentTime  = 0;
            warp_sound.play();       
        }else if (skill == 5){   
            
            // if(laser_charge_total_time > 0) return;
            // if(l_width < 32) return;


            missile_sound.currentTime  = 0.8;
            missile_sound.play();  
        }
        
		Context.fillText("*",x, y); 

        laser_radian(x,y); 

		//레이져 변수 초기화
		 laser_init();
		 laser_yn = 'Y';
		 //laser_move(); 

	}

    //warp(공간 이동)
	if(as_gb == 1 && Context.isPointInPath(button02, x,  y)) {  

		Context.stroke(button02);   //키 입력 반응체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)

        warp_sound.currentTime  = 0;
        warp_sound.play();

        //조준관역 좌표도 기본으로
        xxAim = 0;
        yyAim = 0;  

		//isKeyCode = 17;
		//Warp 이미지로 변경
		for (var i=0;i<=warp_distance;i++){

			Context.drawImage(player_warp,playerX,playerY,playerWidth + Math.floor(Math.random() * 2),playerHeight + Math.floor(Math.random() * 3))

			//warp_sound.play();

			// if (isKeyCode == 38 || wayBefore == "U"){
			// 	playerY = playerY - i;
			// }else if (isKeyCode == 40 || wayBefore == "D"){
			// 	playerY = playerY + i;
			// }else if (isKeyCode == 39 || wayBefore == "R"){
			// 	playerX = playerX + i;
			// }else if(isKeyCode == 37 || wayBefore == "L"){
			// 	playerX = playerX - i;
            // }else if (isKeyCode == 36 || wayBefore == "LU"){
            //     playerX = playerX - i;
            //     playerY = playerY - i;
            // }else if (isKeyCode == 33 || wayBefore == "RU"){
            //     playerX = playerX + i;
            //     playerY = playerY - i;
            // }else if(isKeyCode == 35 || wayBefore == "LD"){
            //     playerX = playerX - i;
            //     playerY = playerY + i;
            // }else if (isKeyCode == 34 || wayBefore == "RD"){
            //     playerX = playerX + i;
            //     playerY = playerY + i;
            // }else {
			// 	playerX = playerX;
			// 	playerY = playerY;
			// 	wayBefore = "";
			// }
            //playerY = playerY - i;


			if (isKeyCode == 38 || isKeyDown[87] || isKeyCode == 87){
				playerY = playerY - i;
			}else if (isKeyCode == 40 || isKeyDown[83] || isKeyCode == 83){
				playerY = playerY + i;
			}else if (isKeyCode == 39 || isKeyDown[68] || isKeyCode == 68){
				playerX = playerX + i;
			}else if(isKeyCode == 37 || isKeyDown[65] || isKeyCode == 65){
				playerX = playerX - i;
            }else if (isKeyCode == 36){
                playerX = playerX - i;
                playerY = playerY - i;
            }else if (isKeyCode == 33){
                playerX = playerX + i;
                playerY = playerY - i;
            }else if(isKeyCode == 35){
                playerX = playerX - i;
                playerY = playerY + i;
            }else if (isKeyCode == 34){
                playerX = playerX + i;
                playerY = playerY + i;          
            }else {
				playerX = playerX;
				playerY = playerY;
				wayBefore = null;
			}            
		}

		isKeyDown = [];
        isKeyCode = null;

    } 

    //스킬체인지
    if(Context.isPointInPath(button03, x,  y)) { 

        //폭멸탄 사운드 
        //appear_sound.currentTime = 2;
        //appear_sound.play(); 

        // tmp_skill = skill;
        // ++skill;
        //alert("test")
        //alert(as_gb);

        //캔버스를 클릭했을때만 호출한다. 자꾸 움직이거나 하니깐 찰나에 또 바뀜
        if(as_gb == 1)
        skill_change(); 
    }


    //기본공격(sword)
    if(Context.isPointInPath(button04, x,  y)) {  
        sword_yn = 'Y';
        //sword_move();  
    }
    
    if(status != 2){
        //게임 계속
        if(Context.isPointInPath(button_play, x,  y)) {
            isKeyCode = 13;
            //strKeyEventValue = "LD";
            Context.stroke(button_play); //키 입력 반응체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
            gameEnd(isKeyCode);
            isKeyDown = [];
            isKeyCode = null;
        }

        //게임 종료
        if(Context.isPointInPath(button_end, x,  y)) {
            isKeyCode = 27;
            //strKeyEventValue = "RD";
            Context.stroke(button_end);  //키 입력 반응체감을 위해 눌렀을때 잠깐 객체 세로 그려준다.(투명도 0으로하여)
            gameEnd(isKeyCode);
            isKeyDown = [];
            isKeyCode = null;
        }

        //개발모드일경우만 이어서 플레이 가능
        if (ls_DColor == "green"){
             //게임 계속 
            if(Context.isPointInPath(button_continue, x,  y)) {  
                if(player_cnt <= 1) player_cnt = 1;
                isKeyCode = 13;
                gameStart(isKeyCode);
            }
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
		    laser_r = Math.atan2((maxY - 180 - y),(maxX - 100 - x) * -1);
        } 

		if (laser_r < 0)
		 laser_r += Math.PI * 2;
		laser_d = laser_r*180/Math.PI;
		while (laser_d < 0)
         laser_d += 360;

}

////////////////// 적 미사일 생성
function weappon_create(){
    //weapponArray = [];
    //console.log("this.weapponArray.length",this.weapponArray.length);
    if (this.weapponArray.length >= this.max_weappon_cnt){
        this.weapponArray = [];
    }
    //동시 나타나는  미사일수
    this.weapponArray.push({bx:this.weapponX, by:this.weapponY, bmx:this.move_weapponX, bmy:this.move_weapponY, bsize:this.weappon_size, bspeed:this.weappon_speed, bdirection:this.weappon_Randon});
}

////////////////// 적 미사일 변수 초기화(미사일의 시작점 위치 지정)
function weappon_init(){

     //console.log("this.weapponArray[i]",this.weapponArray)
     this.weappon_size = 1;
     player_collision_yn = 'N';
     //weapponX = weapponX - 40;

    //적 총알 사운드
    if (this.enemy_type == 3 && (enemy_boss_01_status == 1 || enemy_boss_01_status == 2)){  

        if ((this.enemy_life < 70 && this.enemy_life > 45) || (this.enemy_life < 15 && this.enemy_life > 5)){
            //  shootgun_sound.currentTime  = 0;
            //  shootgun_sound.play();   //보스 무기 사운드  
             shootgun_sound.currentTime  = 0.22;
             shootgun_sound.play();   //보스 무기 사운드 
             //shootgun_sound.currentTime  = 5; 
        }else {
            // shootgun_sound.currentTime  = 0;
            // shootgun_sound.play();   //보스 무기 사운드   
            beam_sound.currentTime  = 0;
            beam_sound.play();   //보스 무기 사운드              
        }   
     
    }else {

        // shootgun_sound.currentTime  = 0;
        // shootgun_sound.play();   //보스 무기 사운드  
        beam_sound.currentTime  = 0;
        beam_sound.play();   //보스 무기 사운드        
    }  

    for(var i = 0; i < this.weapponArray.length; i++){

        this.weapponArray[i].bx = this.weapponX;
        this.weapponArray[i].by = this.weapponY;
        this.weapponArray[i].bmx = this.weapponX;
        this.weapponArray[i].bmy = this.weapponY;
        this.weapponArray[i].bsize = this.weappon_size;
        this.weapponArray[i].bspeed  = this.weappon_speed;

        if (Math.floor(Math.random() * 2) == 0){
            this.weapponArray[i].bdirection =   Math.floor(Math.random() * 10) * 1;   //미사일의 방향은 랜덤하게 생성 => 미사일 방향 오른쪽 으로
        }else if (Math.floor(Math.random() * 2) == 1){
            this.weapponArray[i].bdirection =   Math.floor(Math.random() * 10) * -1;   //미사일의 방향은 랜덤하게 생성 => 미사일 방향 왼쪽 으로
        } 
    }
}

////////////////// 적 미사일 경로
function weappon_move(){

   //this.weappon_size = this.weappon_size + 0.1;               //미사일 크기
   //this.weappon_size = this.weappon_size + enemy_size/10;                //미사일 크기
//    var tmp_random = Math.floor(Math.random()) + 1;
//    console.log("tmp_random",tmp_random);
      
    // if (this.enemy_type == 3){           
    //     if (this.weapponArray){
    //          //보스가 공격시에는 날개를 편다. 
    //          this.enemyImage = enemy03Image; 
    //     }else {
    //         //보스가 미공격시에는 날개를 접는다. 
    //         this.enemyImage = enemy03_01Image;  
    //     } 
    // }

    for(var i = 0; i < this.weapponArray.length; i++){

        this.weappon_index = i;

        if (this.enemy_type == 8){   
 
                //이상하게도 여기서 이미지를 새로 변경하면 화면 랜더링이 빨리진다.
                // this.weapponImage = laserImage;
                // this.weapponImage.src = laserImage.src;
                // this.weapponImage = weappon01Image;
                // this.weapponImage.src = weappon01Image.src;
                
                this.weappon_size = this.weappon_size + 4;
                this.weappon_speed = 2;

                this.weapponArray[i].bsize = this.weappon_size + 4;
                this.weapponArray[i].bmy = this.weapponArray[i].bmy + this.weappon_speed + 10; //<= 총알 속도의 핵심(his.weappon_upDown / 4).
                for (z=0;z<4;z++){ 
                    Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*(Math.floor(Math.random()*2) + 2),this.weapponArray[i].bmy,this.weapponArray[i].bsize/200  - this.weapponArray[i].bmy / 200 + z/2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100 + z/2);
                }  

        }

        if (this.enemy_type == 7){     //적 타입이 1인경우만 레이져

            //레이져
            add_borderX = theCanvas.clientWidth;  //총알이 리셋되는 경계를 늘려주는 변수(총알이 밖으로 나가면 전체가 초기화 되는 현상때문에)
            add_borderY = theCanvas.clientHeight;  //총알이 리셋되는 경계를 늘려주는 변수(총알이 밖으로 나가면 전체가 초기화 되는 현상때문에)

            //일반총알 특징, 작다, 빠르다
            //총알인경우 플레이어 위치와 상관없이 위.아래(y축)으로만 진행한다.
            //this.weappon_size = this.weappon_size + this.enemy_size/20;
            //this.weappon_size = this.weappon_size + 1;
            this.weappon_size = this.weappon_size + 0.1;
 

            //미사일 화면 이탈시 또는 미사일이 너무 커지면
            if (this.weapponArray[i].bsize >= 50){
               
                this.weapponArray[i].bsize = this.weapponArray[i].bsize - 1;
                this.weappon_size = this.weappon_size - 0.1;
                
            } 
  

            //레이져가 플레이어보다 커지면
            if (this.weapponArray[i].bsize >= playerHeight/4){
              
                this.weapponArray[i].bsize = this.weapponArray[i].bsize - 1;
                this.weappon_size = this.weappon_size - 0.1;
            }            

            //총알 반은 위로 반은 아래로향한다.
            if (this.weappon_index%4 == 0){
                this.weappon_upDown = 1;
                this.weappon_leftRight =  1 * (Math.floor(Math.random() * 1)==0?1:-1);
            }else if (this.weappon_index%4 == 1){
                this.weappon_upDown = -1;
                this.weappon_leftRight =  1 * (Math.floor(Math.random() * 1)==0?1:-1);
            }else if (this.weappon_index%4 == 2){
                this.weappon_leftRight = -1 - (Math.floor(Math.random() * 1) + 1);
                this.weappon_upDown = this.weappon_tmp_random * (Math.floor(Math.random() * 1)==0?1:-1);
            }else {
                this.weappon_leftRight = 1 + (Math.floor(Math.random() * 1) + 1);
                this.weappon_upDown = this.weappon_tmp_random * (Math.floor(Math.random() * 1)==0?1:-1);
            }

            this.weapponArray[i].bmx =  this.weapponArray[i].bmx + this.weapponArray[i].bdirection * this.weappon_leftRight;
            this.weapponArray[i].bsize = this.weappon_size;
            this.weapponArray[i].bmy = this.weapponArray[i].bmy + this.weapponArray[i].bsize * this.weappon_upDown / (Math.floor(Math.random()*1) + 2); //<= 총알 속도의 핵심(his.weappon_upDown / 4).
            this.weapponArray[i].bmy  = this.weapponArray[i].bmy  * this.weapponArray[i].bspeed; 
            
            // for (z=0;z<10;z++){
                 
            //     Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*2,this.weapponArray[i].bmy + z*2,this.weapponArray[i].bsize/5  + this.weapponArray[i].bmy / 200,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100);
            // }

            //총알이 적보다 아래로 향할때
            if (this.enemyy   < this.weapponArray[i].bmy){
                //우측방향
                if (this.enemyx < this.weapponArray[i].bmx){ 
                    for (z=0;z<10;z++){
                        Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*2,this.weapponArray[i].bmy + z*2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 - this.weapponArray[i].bmy / 100);
                    }  
                
                }
                
                //좌측방향
                if (this.enemyx  > this.weapponArray[i].bmx){ 
                //총알이 적보다 좌측 아래로 향할때                 
                    for (z=0;z<10;z++){
                        Context.drawImage(this.weapponImage,this.weapponArray[i].bmx - z*2,this.weapponArray[i].bmy + z*2,this.weapponArray[i].bsize/2  + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 - this.weapponArray[i].bmy / 100);
                    }
                }
            }
            //총알이 적보다 위 향할때
            else if (this.enemyy + this.enemyh > this.weapponArray[i].bmy){
                //우측방향
                if (this.enemyx  + this.enemyw < this.weapponArray[i].bmx){ 
                 for (z=0;z<5;z++){
                     Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*2,this.weapponArray[i].bmy - z*2,this.weapponArray[i].bsize/2  + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 200);
                 }

                }
                //좌측방향
                if (this.enemyx  + this.enemyw > this.weapponArray[i].bmx){ 
                //총알이 적보다 좌측 아래로 향할때                 
                 for (z=0;z<5;z++){
                     Context.drawImage(this.weapponImage,this.weapponArray[i].bmx - z*2,this.weapponArray[i].bmy - z*2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 - this.weapponArray[i].bmy / 200);
                 }
                }
            }else {
                //그외  
                for (z=0;z<5;z++){
                    Context.drawImage(this.weapponImage,this.weapponArray[i].bmx,this.weapponArray[i].bmy,this.weapponArray[i].bsize/4 + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100);      
                }
            } 

             
        }

        if (this.enemy_type == 6){     //적 타입이 6인경우 좌.우에서 레이져 발사.

            //레이져 특징 : 좌우에서 발사
            this.weappon_size = this.weappon_size + 0.4;


            //미사일 화면 이탈시 또는 미사일이 너무 커지면
            if (this.weapponArray[i].bsize >= 100){
                this.weapponArray[i].bsize = this.weapponArray[i].bsize - 1;
                this.weappon_size = this.weappon_size - 0.1;
            }


            //미사일이 플레이어보다 커지면
            if (this.weapponArray[i].bsize >= playerHeight/2){
                this.weapponArray[i].bsize = this.weapponArray[i].bsize - 1;
                this.weappon_size = this.weappon_size - 0.1;
            }     
            
            //2.좌우로 흔들린다.
            // this.weapponArray[i].bmx = this.weapponArray[i].bmx + Math.floor(Math.random()*10) - Math.floor(Math.random()*10);
            // this.weapponArray[i].bmy = this.weapponArray[i].bmy + Math.floor(Math.random()*2) - Math.floor(Math.random()*3);
            //3.속도가 빠르다.
            this.weappon_speed = 1;

            //4.플레이어 위치에 따른 미사일 방향 변경된다.
            if (playerY >= this.enemyy + this.enemyh/2 + theCanvas.clientHeight / 6){
                this.weappon_upDown = 1;
                //console.log('1')
            }else if (playerY <=  this.enemyy - this.enemyh/2 - theCanvas.clientHeight / 6){
                this.weappon_upDown = -1;
                //console.log('2')
            }else if (playerX <=  this.enemyx + this.enemyw/2 - theCanvas.clientWidth / 3){
                this.weappon_leftRight = -1;
                this.weappon_upDown = this.weappon_tmp_random;
                //console.log('3')
            }else if (playerX >=  this.enemyx - this.enemyw/2 - theCanvas.clientWidth / 3){
                this.weappon_leftRight = 1;
                this.weappon_upDown = this.weappon_tmp_random;
                //console.log('4')
            }


            this.weapponArray[i].bmx =  this.weapponArray[i].bmx + this.weapponArray[i].bdirection * this.weappon_leftRight;
            this.weapponArray[i].bsize = this.weappon_size;
            this.weapponArray[i].bmy = this.weapponArray[i].bmy + this.weapponArray[i].bsize * this.weappon_upDown / (Math.floor(Math.random()*1) + 2); //<= 총알 속도의 핵심(his.weappon_upDown / 4).
            //this.weapponArray[i].bmy  = this.weapponArray[i].bmy  * this.weapponArray[i].bspeed; 
            //Context.drawImage(this.weapponImage,this.weapponArray[i].bmx,this.weapponArray[i].bmy,this.weapponArray[i].bsize/10  + this.weapponArray[i].bmy / 100,this.weapponArray[i].bsize / 5 + this.weapponArray[i].bmy / 50);
            

            if (this.enemyxx > this.weapponArray[i].bmx){
                for (z=0;z<5;z++){ 
                    Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*(Math.floor(Math.random()*2) + 2),this.weapponArray[i].bmy,this.weapponArray[i].bsize/5  + this.weapponArray[i].bmy / 200 + z/2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100 + z/2);
                }
            }else {
                for (z=0;z<5;z++){ 
                    Context.drawImage(this.weapponImage,this.weapponArray[i].bmx - z*(Math.floor(Math.random()*2) + 2),this.weapponArray[i].bmy,this.weapponArray[i].bsize/5  + this.weapponArray[i].bmy / 200 + z/2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100 + z/2);
                } 
            }

        } 

        if (this.enemy_type == 4){   

            //if (this.weappon_index%4==0){ 
            if (gameTime <= 2000){ 
                // this.weapponImage = laserImage;
                // this.weapponImage.src = laserImage.src;
                //this.weapponImage = weappon01Image;
                //this.weapponImage.src = weappon01Image.src;
                
                this.weappon_size = this.weappon_size - 4;
                this.weappon_speed = 2;

                this.weapponArray[i].bsize = this.weappon_size - 4;
                this.weapponArray[i].bmy = this.weapponArray[i].bmy - this.weappon_speed - 10; //<= 총알 속도의 핵심(his.weappon_upDown / 4).
                for (z=0;z<4;z++){ 
                    Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*(Math.floor(Math.random()*2) + 2),this.weapponArray[i].bmy,this.weapponArray[i].bsize/200  - this.weapponArray[i].bmy / 200 + z/2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100 + z/2);
                } 
                return;
             
            }else {

                //this.weapponImage = weappon03Image;
                //this.weapponImage.src = weappon03Image.src;
                
                //유도 미사일 특징
                //1.크기가 크다. 느리다
                //this.weappon_size = this.weappon_size + this.enemy_size/10;
                this.weappon_size = this.weappon_size + 0.2;


                //미사일 화면 이탈시 또는 미사일이 너무 커지면
                if (this.weapponArray[i].bsize >= 60){
                    this.weapponArray[i].bsize = this.weapponArray[i].bsize - 1;
                    this.weappon_size = this.weappon_size - 0.1;
                }


                //미사일이 플레이어보다 커지면
                if (this.weapponArray[i].bsize >= playerHeight/2){
                    this.weapponArray[i].bsize = this.weapponArray[i].bsize - 1;
                    this.weappon_size = this.weappon_size - 0.1;
                }     
                
                //2.좌우로 흔들린다.
                this.weapponArray[i].bmx = this.weapponArray[i].bmx + Math.floor(Math.random()*10) - Math.floor(Math.random()*20);
                this.weapponArray[i].bmy = this.weapponArray[i].bmy + Math.floor(Math.random()*2) - Math.floor(Math.random()*5);
                //3.속도가 느리다.
                this.weappon_speed = 1;

                //4.플레이어 위치에 따른 미사일 방향 변경된다.
                if (playerY >= this.enemyy + this.enemyh/2){
                    this.weappon_upDown = 1;
                    //console.log('1')
                }else if (playerY <=  this.enemyy - this.enemyh/2){
                    this.weappon_upDown = -1;
                    //console.log('2')
                }else if (playerX <=  this.enemyx + this.enemyw/2 - theCanvas.clientWidth / 3){
                    this.weappon_leftRight = -1;
                    this.weappon_upDown = this.weappon_tmp_random;
                    //console.log('3')
                }else if (playerX >=  this.enemyx - this.enemyw/2 - theCanvas.clientWidth / 3){
                    this.weappon_leftRight = 1;
                    this.weappon_upDown = this.weappon_tmp_random;
                    //console.log('4')
                }


                this.weapponArray[i].bmx =  this.weapponArray[i].bmx + this.weapponArray[i].bdirection * this.weappon_leftRight;
                this.weapponArray[i].bsize = this.weappon_size;
                this.weapponArray[i].bmy = this.weapponArray[i].bmy + this.weapponArray[i].bsize * this.weappon_upDown / (Math.floor(Math.random()*1) + 2); //<= 총알 속도의 핵심(his.weappon_upDown / 4).
                //this.weapponArray[i].bmy  = this.weapponArray[i].bmy  * this.weapponArray[i].bspeed; 
                //Context.drawImage(this.weapponImage,this.weapponArray[i].bmx,this.weapponArray[i].bmy,this.weapponArray[i].bsize/10  + this.weapponArray[i].bmy / 100,this.weapponArray[i].bsize / 5 + this.weapponArray[i].bmy / 50);
                

                if (this.enemyxx > this.weapponArray[i].bmx){
                    for (z=0;z<5;z++){ 
                        Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*(Math.floor(Math.random()*2) + 2),this.weapponArray[i].bmy,this.weapponArray[i].bsize/5  + this.weapponArray[i].bmy / 200 + z/2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100 + z/2);
                    }
                }else {
                    for (z=0;z<5;z++){ 
                        Context.drawImage(this.weapponImage,this.weapponArray[i].bmx - z*(Math.floor(Math.random()*2) + 2),this.weapponArray[i].bmy,this.weapponArray[i].bsize/5  + this.weapponArray[i].bmy / 200 + z/2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100 + z/2);
                    } 
                }
            }

        } 

        //보스 총알 : 보스의 무기는 미사일과 레이져
        //if (this.enemy_type == 3){     //적 타입이 2인경우만 유도탄
        if (this.enemy_type == 3){     //적 타입이 2인경우만 유도탄
            //console.log("this.enemy_life",this.enemy_life)   

            if (this.enemy_life >= 70){

                this.weapponImage = weappon03Image;
                //유도 미사일 특징
                //1.크기가 크다. 느리다
                //this.weappon_size = this.weappon_size + this.enemy_size/10;
                this.weappon_size = this.weappon_size + 0.2;


                //미사일 화면 이탈시 또는 미사일이 너무 커지면
                if (this.weapponArray[i].bsize >= 60){
                    this.weapponArray[i].bsize = this.weapponArray[i].bsize - 1;
                    this.weappon_size = this.weappon_size - 0.1;
                }


                //미사일이 플레이어보다 커지면
                if (this.weapponArray[i].bsize >= playerHeight/3){
                    this.weapponArray[i].bsize = this.weapponArray[i].bsize - 1;
                    this.weappon_size = this.weappon_size - 0.1;
                }     
                
                //2.좌우로 흔들린다.
                this.weapponArray[i].bmx = this.weapponArray[i].bmx + Math.floor(Math.random()*10) - Math.floor(Math.random()*15);
                this.weapponArray[i].bmy = this.weapponArray[i].bmy + Math.floor(Math.random()*2) - Math.floor(Math.random()*8);
                //3.속도가 느리다.
                this.weappon_speed = 1/4;

                //4.플레이어 위치에 따른 미사일 방향 변경된다.
                if (playerY >= this.enemyy + this.enemyh/2 + theCanvas.clientHeight / 6){
                    this.weappon_upDown = 1;
                    //console.log('1')
                }else if (playerY <=  this.enemyy - this.enemyh/2 - theCanvas.clientHeight / 6){
                    this.weappon_upDown = -1;
                    //console.log('2')
                }else if (playerX <=  this.enemyx + this.enemyw/2 - theCanvas.clientWidth / 3){
                    this.weappon_leftRight = -1;
                    this.weappon_upDown = this.weappon_tmp_random;
                    //console.log('3')
                }else if (playerX >=  this.enemyx - this.enemyw/2 - theCanvas.clientWidth / 3){
                    this.weappon_leftRight = 1;
                    this.weappon_upDown = this.weappon_tmp_random;
                    //console.log('4')
                }


                this.weapponArray[i].bmx =  this.weapponArray[i].bmx + this.weapponArray[i].bdirection * this.weappon_leftRight;
                this.weapponArray[i].bsize = this.weappon_size - 1;
                this.weapponArray[i].bmy = this.weapponArray[i].bmy + this.weapponArray[i].bsize * this.weappon_upDown / (Math.floor(Math.random()*1) + 4); //<= 유도미사일 속도의 핵심(his.weappon_upDown / 4).
                //this.weapponArray[i].bmy  = this.weapponArray[i].bmy  * this.weapponArray[i].bspeed; 
                //Context.drawImage(this.weapponImage,this.weapponArray[i].bmx,this.weapponArray[i].bmy,this.weapponArray[i].bsize/10  + this.weapponArray[i].bmy / 100,this.weapponArray[i].bsize / 5 + this.weapponArray[i].bmy / 50);
                

                if (this.enemyxx > this.weapponArray[i].bmx){
                    for (z=0;z<5;z++){ 
                        Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*(Math.floor(Math.random()*2) + 2),this.weapponArray[i].bmy,this.weapponArray[i].bsize/5  + this.weapponArray[i].bmy / 200 + z/2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100 + z/2);
                    }
                }else {
                    for (z=0;z<5;z++){ 
                        Context.drawImage(this.weapponImage,this.weapponArray[i].bmx - z*(Math.floor(Math.random()*2) + 2),this.weapponArray[i].bmy,this.weapponArray[i].bsize/5  + this.weapponArray[i].bmy / 200 + z/2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100 + z/2);
                    } 
                }

            }else if (this.enemy_life >= 40){
             
                //보스가 날개를 접는다. 
                this.enemyImage = enemy03_01Image; 

                this.weapponImage = weappon01Image;
                // shootgun_sound.currentTime  = 0;
                // shootgun_sound.play();   //보스 무기 사운드 
                // shootgun_sound.currentTime  = 0;

                add_borderX = theCanvas.clientWidth;  //총알이 리셋되는 경계를 늘려주는 변수(총알이 밖으로 나가면 전체가 초기화 되는 현상때문에)
                add_borderY = theCanvas.clientHeight;  //총알이 리셋되는 경계를 늘려주는 변수(총알이 밖으로 나가면 전체가 초기화 되는 현상때문에)
    
                //일반총알 특징, 작다, 빠르다
                //총알인경우 플레이어 위치와 상관없이 위.아래(y축)으로만 진행한다.
                //this.weappon_size = this.weappon_size + this.enemy_size/20;
                //this.weappon_size = this.weappon_size + 1;
                this.weappon_size = this.weappon_size + 0.2;  

                //미사일 화면 이탈시 또는 미사일이 너무 커지면
                if (this.weapponArray[i].bsize >= 100){
                
                    // this.weapponArray[i].bsize = this.weapponArray[i].bsize + 1;
                    // this.weappon_size = this.weappon_size  + 1;
                    this.weappon_init();
                } 
    

                //레이져가 플레이어보다 커지면
                if (this.weapponArray[i].bsize >= playerHeight/2){
                
                    // this.weapponArray[i].bsize = this.weapponArray[i].bsize + 1;
                    // this.weappon_size = this.weappon_size + 1;
                    this.weappon_init();
                }              
    
                // //총알 반은 위로 반은 아래로향한다.
                // if (this.weappon_index%4 == 0){
                //     this.weappon_upDown = 1;
                //     this.weappon_leftRight =  1 * (Math.floor(Math.random() * 1)==0?1:-1);
                // }else if (this.weappon_index%4 == 1){
                //     this.weappon_upDown = -1;
                //     this.weappon_leftRight =  1 * (Math.floor(Math.random() * 1)==0?1:-1);
                // }else if (this.weappon_index%4 == 2){
                //     this.weappon_leftRight = -1 - (Math.floor(Math.random() * 1) + 1);
                //     this.weappon_upDown = this.weappon_tmp_random * (Math.floor(Math.random() * 1)==0?1:-1);
                // }else {
                //     this.weappon_leftRight = 1 + (Math.floor(Math.random() * 1) + 1);
                //     this.weappon_upDown = this.weappon_tmp_random * (Math.floor(Math.random() * 1)==0?1:-1);
                // }
    
                this.weapponArray[i].bmx =  this.weapponArray[i].bmx + this.weapponArray[i].bdirection * this.weappon_leftRight * 2;
                this.weapponArray[i].bsize = this.weappon_size + 0.2;
                this.weapponArray[i].bmy = this.weapponArray[i].bmy + this.weapponArray[i].bsize * this.weappon_upDown / (Math.floor(Math.random()*1) + 2); //<= 총알 속도의 핵심(his.weappon_upDown / 4).
                //this.weapponArray[i].bmy  = this.weapponArray[i].bmy  * this.weapponArray[i].bspeed* 2; 
                
                // for (z=0;z<10;z++){
                     
                //     Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*2,this.weapponArray[i].bmy + z*2,this.weapponArray[i].bsize/5  + this.weapponArray[i].bmy / 200,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100);
                // }
    

                //플레이어의 위치에 따라 적이 유리한 공격위치를 점유하도록 한다.
                if(playerX > this.enemyx){
                    this.enemyx = this.enemyx + 0.1 + Math.floor(Math.random()*2)/10;
                    this.enemyy = this.enemyy - 0.02;
                }else {
                    this.enemyx = this.enemyx - 0.1 - Math.floor(Math.random()*2)/10;
                    this.enemyy = this.enemyy + 0.02
                }

                if(playerY < this.enemyy){
                    this.enemyx = this.enemyx + 0.02;
                    this.enemyy = this.enemyy - 0.1;
                }else {
                    this.enemyx = this.enemyx - 0.02;
                    this.enemyy = this.enemyy + 0.04;
                }

                //총알이 적보다 아래로 향할때
                if (this.enemyy   < this.weapponArray[i].bmy){
                    //우측방향
                    if (this.enemyx < this.weapponArray[i].bmx){ 
                        for (z=0;z<8;z++){
                            Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*2,this.weapponArray[i].bmy + z*2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 - this.weapponArray[i].bmy / 100);
                        }  
                    
                    }
                    
                    //좌측방향
                    if (this.enemyx  > this.weapponArray[i].bmx){ 
                    //총알이 적보다 좌측 아래로 향할때                 
                        for (z=0;z<8;z++){
                            Context.drawImage(this.weapponImage,this.weapponArray[i].bmx - z*2,this.weapponArray[i].bmy + z*2,this.weapponArray[i].bsize/2  + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 - this.weapponArray[i].bmy / 100);
                        }
                    }
                }
                //총알이 적보다 위 향할때
                else if (this.enemyy + this.enemyh > this.weapponArray[i].bmy){
                    //우측방향
                    if (this.enemyx  + this.enemyw < this.weapponArray[i].bmx){ 
                     for (z=0;z<10;z++){
                         Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*2,this.weapponArray[i].bmy - z*2,this.weapponArray[i].bsize/2  + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 200);
                     }
    
                    }
                    //좌측방향
                    if (this.enemyx  + this.enemyw > this.weapponArray[i].bmx){ 
                    //총알이 적보다 좌측 아래로 향할때                 
                     for (z=0;z<8;z++){
                         Context.drawImage(this.weapponImage,this.weapponArray[i].bmx - z*2,this.weapponArray[i].bmy - z*2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 - this.weapponArray[i].bmy / 200);
                     }
                    }
                }else {
                    //그외  
                    for (z=0;z<8;z++){
                        Context.drawImage(this.weapponImage,this.weapponArray[i].bmx,this.weapponArray[i].bmy,this.weapponArray[i].bsize/4 + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100);      
                    }
                }   
            }else if (this.enemy_life >= 30){
                //보스가 날개를 편다. 
                this.enemyImage = enemy03Image; 
                this.weapponImage = weappon02Image;
                //유도 미사일 특징
                //1.크기가 크다. 느리다
                //this.weappon_size = this.weappon_size + this.enemy_size/10;
                this.weappon_size = this.weappon_size + 0.3;


                //미사일 화면 이탈시 또는 미사일이 너무 커지면
                if (this.weapponArray[i].bsize >= 100){
                    this.weapponArray[i].bsize = this.weapponArray[i].bsize - 1;
                    this.weappon_size = this.weappon_size - 0.1;
                }


                //미사일이 플레이어보다 커지면
                if (this.weapponArray[i].bsize >= playerHeight/2){
                    this.weapponArray[i].bsize = this.weapponArray[i].bsize - 1;
                    this.weappon_size = this.weappon_size - 0.1;
                }     
                
                //2.좌우로 흔들린다.
                this.weapponArray[i].bmx = this.weapponArray[i].bmx + Math.floor(Math.random()*12) - Math.floor(Math.random()*18);
                this.weapponArray[i].bmy = this.weapponArray[i].bmy + Math.floor(Math.random()*6) - Math.floor(Math.random()*14);
                //3.속도가 느리다.
                this.weappon_speed = 1/2;

                //4.플레이어 위치에 따른 미사일 방향 변경된다.
                if (playerY >= this.enemyy + this.enemyh/2 + theCanvas.clientHeight / 6){
                    this.weappon_upDown = 1;
                    //console.log('1')
                }else if (playerY <=  this.enemyy - this.enemyh/2 - theCanvas.clientHeight / 6){
                    this.weappon_upDown = -1;
                    //console.log('2')
                }else if (playerX <=  this.enemyx + this.enemyw/2 - theCanvas.clientWidth / 3){
                    this.weappon_leftRight = -1;
                    this.weappon_upDown = this.weappon_tmp_random;
                    //console.log('3')
                }else if (playerX >=  this.enemyx - this.enemyw/2 - theCanvas.clientWidth / 3){
                    this.weappon_leftRight = 1;
                    this.weappon_upDown = this.weappon_tmp_random;
                    //console.log('4')
                }


                this.weapponArray[i].bmx =  this.weapponArray[i].bmx + this.weapponArray[i].bdirection * this.weappon_leftRight;
                this.weapponArray[i].bsize = this.weappon_size;
                this.weapponArray[i].bmy = this.weapponArray[i].bmy + this.weapponArray[i].bsize * this.weappon_upDown / (Math.floor(Math.random()*1) + 2); //<= 총알 속도의 핵심(his.weappon_upDown / 4).
                //this.weapponArray[i].bmy  = this.weapponArray[i].bmy  * this.weapponArray[i].bspeed; 
                //Context.drawImage(this.weapponImage,this.weapponArray[i].bmx,this.weapponArray[i].bmy,this.weapponArray[i].bsize/10  + this.weapponArray[i].bmy / 100,this.weapponArray[i].bsize / 5 + this.weapponArray[i].bmy / 50);
                

                if (this.enemyxx > this.weapponArray[i].bmx){
                    for (z=0;z<10;z++){ 
                        Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*(Math.floor(Math.random()*2) + 2),this.weapponArray[i].bmy,this.weapponArray[i].bsize/5  + this.weapponArray[i].bmy / 200 + z/2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100 + z/2);
                    }
                }else {
                    for (z=0;z<10;z++){ 
                        Context.drawImage(this.weapponImage,this.weapponArray[i].bmx - z*(Math.floor(Math.random()*2) + 2),this.weapponArray[i].bmy,this.weapponArray[i].bsize/5  + this.weapponArray[i].bmy / 200 + z/2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100 + z/2);
                    } 
                }

            }else if (this.enemy_life >= 15){

                //보스가 날개를 접는다. 
                this.enemyImage = enemy03_01Image; 
                // beam_sound.currentTime  = 0;
                // beam_sound.play();   //보스 무기 사운드   

                //적의 속도가 빨라진다.
                // this.enemyxx=this.enemyxx*1.5;
                // this.enemyyy=this.enemyyy*1.5;
                
                if (i%2 == 0){

                    this.weapponImage = weappon03Image;
                    //유도 미사일 특징
                    //1.크기가 크다. 느리다
                    //this.weappon_size = this.weappon_size + this.enemy_size/10;
                    this.weappon_size = this.weappon_size + 0.3;
    
                    //미사일 화면 이탈시 또는 미사일이 너무 커지면
                    if (this.weapponArray[i].bsize >= 100){
                        this.weapponArray[i].bsize = this.weapponArray[i].bsize - 1;
                        this.weappon_size = this.weappon_size - 1;
                        //this.weappon_init();
                    }
    
    
                    //미사일이 플레이어보다 커지면
                    if (this.weapponArray[i].bsize >= playerHeight/2){
                        this.weapponArray[i].bsize = this.weapponArray[i].bsize - 1;
                        this.weappon_size = this.weappon_size - 1;
                        //this.weappon_init();
                    }     
                    
                    //2.좌우로 흔들린다.
                    this.weapponArray[i].bmx = this.weapponArray[i].bmx + Math.floor(Math.random()*10) - Math.floor(Math.random()*15);
                    this.weapponArray[i].bmy = this.weapponArray[i].bmy + Math.floor(Math.random()*2) - Math.floor(Math.random()*8);
                    //3.속도가 느리다.
                    this.weappon_speed = 1/2;
    
                    //4.플레이어 위치에 따른 미사일 방향 변경된다.
                    if (playerY >= this.enemyy + this.enemyh/2 + theCanvas.clientHeight / 6){
                        this.weappon_upDown = 1;
                        //console.log('1')
                    }else if (playerY <=  this.enemyy - this.enemyh/2 - theCanvas.clientHeight / 6){
                        this.weappon_upDown = -1;
                        //console.log('2')
                    }else if (playerX <=  this.enemyx + this.enemyw/2 - theCanvas.clientWidth / 3){
                        this.weappon_leftRight = -1;
                        this.weappon_upDown = this.weappon_tmp_random;
                        //console.log('3')
                    }else if (playerX >=  this.enemyx - this.enemyw/2 - theCanvas.clientWidth / 3){
                        this.weappon_leftRight = 1;
                        this.weappon_upDown = this.weappon_tmp_random;
                        //console.log('4')
                    } 
    
                    this.weapponArray[i].bmx =  this.weapponArray[i].bmx + this.weapponArray[i].bdirection * this.weappon_leftRight;
                    this.weapponArray[i].bsize = this.weappon_size;
                    this.weapponArray[i].bmy = this.weapponArray[i].bmy + this.weapponArray[i].bsize * this.weappon_upDown / (Math.floor(Math.random()*1) + 2); //<= 총알 속도의 핵심(his.weappon_upDown / 4).
                    //this.weapponArray[i].bmy  = this.weapponArray[i].bmy  * this.weapponArray[i].bspeed; 
                    //Context.drawImage(this.weapponImage,this.weapponArray[i].bmx,this.weapponArray[i].bmy,this.weapponArray[i].bsize/10  + this.weapponArray[i].bmy / 100,this.weapponArray[i].bsize / 5 + this.weapponArray[i].bmy / 50);
                    
    
                    if (this.enemyxx > this.weapponArray[i].bmx){
                        for (z=0;z<20;z++){ 
                            Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*(Math.floor(Math.random()*2) + 2),this.weapponArray[i].bmy,this.weapponArray[i].bsize/5  + this.weapponArray[i].bmy / 200 + z/2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100 + z/2);
                        }
                    }else {
                        for (z=0;z<20;z++){ 
                            Context.drawImage(this.weapponImage,this.weapponArray[i].bmx - z*(Math.floor(Math.random()*2) + 2),this.weapponArray[i].bmy,this.weapponArray[i].bsize/5  + this.weapponArray[i].bmy / 200 + z/2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100 + z/2);
                        } 
                    }
                }else {                
                    this.weapponImage = weappon01Image;
                    //레이져
                    add_borderX = theCanvas.clientWidth;  //총알이 리셋되는 경계를 늘려주는 변수(총알이 밖으로 나가면 전체가 초기화 되는 현상때문에)
                    add_borderY = theCanvas.clientHeight;  //총알이 리셋되는 경계를 늘려주는 변수(총알이 밖으로 나가면 전체가 초기화 되는 현상때문에)

                    //일반총알 특징, 작다, 빠르다
                    //총알인경우 플레이어 위치와 상관없이 위.아래(y축)으로만 진행한다.
                    //this.weappon_size = this.weappon_size + this.enemy_size/20;
                    //this.weappon_size = this.weappon_size + 1;
                    this.weappon_size = this.weappon_size + 0.3;
        

                    //미사일 화면 이탈시 또는 미사일이 너무 커지면
                    if (this.weapponArray[i].bsize >= 100){
                    
                        // this.weapponArray[i].bsize = this.weapponArray[i].bsize + 1;
                        // this.weappon_size = this.weappon_size  + 1;
                        this.weappon_init();
                    } 
        

                    //레이져가 플레이어보다 커지면
                    if (this.weapponArray[i].bsize >= playerHeight){
                    
                        // this.weapponArray[i].bsize = this.weapponArray[i].bsize + 1;
                        // this.weappon_size = this.weappon_size + 1;
                        this.weappon_init();
                    }            

                    //총알 반은 위로 반은 아래로향한다.
                    if (this.weappon_index%4 == 0){
                        this.weappon_upDown = 1;
                        this.weappon_leftRight =  1 * (Math.floor(Math.random() * 1)==0?1:-1);
                    }else if (this.weappon_index%4 == 1){
                        this.weappon_upDown = -1;
                        this.weappon_leftRight =  1 * (Math.floor(Math.random() * 1)==0?1:-1);
                    }else if (this.weappon_index%4 == 2){
                        this.weappon_leftRight = -1 - (Math.floor(Math.random() * 1) + 1);
                        this.weappon_upDown = this.weappon_tmp_random * (Math.floor(Math.random() * 1)==0?1:-1);
                    }else {
                        this.weappon_leftRight = 1 + (Math.floor(Math.random() * 1) + 1);
                        this.weappon_upDown = this.weappon_tmp_random * (Math.floor(Math.random() * 1)==0?1:-1);
                    }

                    this.weapponArray[i].bmx =  this.weapponArray[i].bmx + this.weapponArray[i].bdirection * this.weappon_leftRight;
                    this.weapponArray[i].bsize = this.weappon_size;
                    this.weapponArray[i].bmy = this.weapponArray[i].bmy + this.weapponArray[i].bsize * this.weappon_upDown / (Math.floor(Math.random()*1) + 2); //<= 총알 속도의 핵심(his.weappon_upDown / 4).
                    this.weapponArray[i].bmy  = this.weapponArray[i].bmy  * this.weapponArray[i].bspeed; 
                    
                    // for (z=0;z<10;z++){
                        
                    //     Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*2,this.weapponArray[i].bmy + z*2,this.weapponArray[i].bsize/5  + this.weapponArray[i].bmy / 200,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100);
                    // }

                    //총알이 적보다 아래로 향할때
                    if (this.enemyy   < this.weapponArray[i].bmy){
                        //우측방향
                        if (this.enemyx < this.weapponArray[i].bmx){ 
                            for (z=0;z<20;z++){
                                Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*2,this.weapponArray[i].bmy + z*2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 - this.weapponArray[i].bmy / 100);
                            }  
                        
                        }
                        
                        //좌측방향
                        if (this.enemyx  > this.weapponArray[i].bmx){ 
                        //총알이 적보다 좌측 아래로 향할때                 
                            for (z=0;z<20;z++){
                                Context.drawImage(this.weapponImage,this.weapponArray[i].bmx - z*2,this.weapponArray[i].bmy + z*2,this.weapponArray[i].bsize/2  + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 - this.weapponArray[i].bmy / 100);
                            }
                        }
                    }
                    //총알이 적보다 위 향할때
                    else if (this.enemyy + this.enemyh > this.weapponArray[i].bmy){
                        //우측방향
                        if (this.enemyx  + this.enemyw < this.weapponArray[i].bmx){ 
                        for (z=0;z<20;z++){
                            Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*2,this.weapponArray[i].bmy - z*2,this.weapponArray[i].bsize/2  + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 200);
                        }

                        }
                        //좌측방향
                        if (this.enemyx  + this.enemyw > this.weapponArray[i].bmx){ 
                        //총알이 적보다 좌측 아래로 향할때                 
                        for (z=0;z<20;z++){
                            Context.drawImage(this.weapponImage,this.weapponArray[i].bmx - z*2,this.weapponArray[i].bmy - z*2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 - this.weapponArray[i].bmy / 200);
                        }
                        }
                    }else {
                        //그외  
                        for (z=0;z<5;z++){
                            Context.drawImage(this.weapponImage,this.weapponArray[i].bmx,this.weapponArray[i].bmy,this.weapponArray[i].bsize/4 + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100);      
                        }
                    } 
                } 

            }else {
                
                this.weapponImage = weappon01Image;  
                // shootgun_sound.currentTime  = 0;
                // shootgun_sound.play();   //보스 무기 사운드 
                // shootgun_sound.currentTime  = 0;

                add_borderX = theCanvas.clientWidth;  //총알이 리셋되는 경계를 늘려주는 변수(총알이 밖으로 나가면 전체가 초기화 되는 현상때문에)
                add_borderY = theCanvas.clientHeight;  //총알이 리셋되는 경계를 늘려주는 변수(총알이 밖으로 나가면 전체가 초기화 되는 현상때문에)

                //일반총알 특징, 작다, 빠르다
                //총알인경우 플레이어 위치와 상관없이 위.아래(y축)으로만 진행한다.
                //this.weappon_size = this.weappon_size + this.enemy_size/20;
                //this.weappon_size = this.weappon_size + 1;
                //적 총알의 원근감을 위해 크기에 *this.Edistance/4
                //this.weappon_size = this.weappon_size + 0.2; 
                this.weapponArray[i].bsize = (this.weappon_size + 0.2)*this.Edistance/4; 
                this.weapponArray[i].bspeed = this.weapponArray[i].bspeed*this.Edistance/3; 

                //미사일 화면 이탈시 또는 미사일이 너무 커지면
                if (this.weapponArray[i].bsize >= 100){
                
                    // this.weapponArray[i].bsize = this.weapponArray[i].bsize + 1;
                    // this.weappon_size = this.weappon_size  + 1;
                    this.weappon_init();
                } 


                //레이져가 플레이어보다 커지면
                if (this.weapponArray[i].bsize >= playerHeight/2){
                
                    // this.weapponArray[i].bsize = this.weapponArray[i].bsize + 1;
                    // this.weappon_size = this.weappon_size + 1;
                    this.weappon_init();
                }              

                // //총알 반은 위로 반은 아래로향한다.
                // if (this.weappon_index%4 == 0){
                //     this.weappon_upDown = 1;
                //     this.weappon_leftRight =  1 * (Math.floor(Math.random() * 1)==0?1:-1);
                // }else if (this.weappon_index%4 == 1){
                //     this.weappon_upDown = -1;
                //     this.weappon_leftRight =  1 * (Math.floor(Math.random() * 1)==0?1:-1);
                // }else if (this.weappon_index%4 == 2){
                //     this.weappon_leftRight = -1 - (Math.floor(Math.random() * 1) + 1);
                //     this.weappon_upDown = this.weappon_tmp_random * (Math.floor(Math.random() * 1)==0?1:-1);
                // }else {
                //     this.weappon_leftRight = 1 + (Math.floor(Math.random() * 1) + 1);
                //     this.weappon_upDown = this.weappon_tmp_random * (Math.floor(Math.random() * 1)==0?1:-1);
                // }

                this.weapponArray[i].bmx =  this.weapponArray[i].bmx + this.weapponArray[i].bdirection * this.weappon_leftRight * 2;
                this.weapponArray[i].bsize = this.weappon_size++;
                this.weapponArray[i].bmy = this.weapponArray[i].bmy + this.weapponArray[i].bsize * this.weappon_upDown / (Math.floor(Math.random()*1) + 2); //<= 총알 속도의 핵심(his.weappon_upDown / 4).
                this.weapponArray[i].bmy  = this.weapponArray[i].bmy  * this.weapponArray[i].bspeed * 2; 
                
                // for (z=0;z<10;z++){
                    
                //     Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*2,this.weapponArray[i].bmy + z*2,this.weapponArray[i].bsize/5  + this.weapponArray[i].bmy / 200,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100);
                // }


                //플레이어의 위치에 따라 적이 유리한 공격위치를 점유하도록 한다.
                if(playerX > this.enemyx){
                    this.enemyx = this.enemyx + 0.1 + Math.floor(Math.random()*4)/10;
                    this.enemyy = this.enemyy - 0.02;
                }else {
                    this.enemyx = this.enemyx - 0.1 - Math.floor(Math.random()*4)/10;
                    this.enemyy = this.enemyy + 0.02
                }

                if(playerY < this.enemyy){
                    this.enemyx = this.enemyx + 0.02;
                    this.enemyy = this.enemyy - 0.12;
                }else {
                    this.enemyx = this.enemyx - 0.02;
                    this.enemyy = this.enemyy + 0.04;
                }

                //총알이 적보다 아래로 향할때
                if (this.enemyy   < this.weapponArray[i].bmy){
                    //우측방향
                    if (this.enemyx < this.weapponArray[i].bmx){ 
                        for (z=0;z<12;z++){
                            Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*2,this.weapponArray[i].bmy + z*1.5,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 - this.weapponArray[i].bmy / 100);
                        }  
                    
                    }
                    
                    //좌측방향
                    if (this.enemyx  > this.weapponArray[i].bmx){ 
                    //총알이 적보다 좌측 아래로 향할때                 
                        for (z=0;z<12;z++){
                            Context.drawImage(this.weapponImage,this.weapponArray[i].bmx - z*2,this.weapponArray[i].bmy + z*1.5,this.weapponArray[i].bsize/2  + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 - this.weapponArray[i].bmy / 100);
                        }
                    }
                }
                //총알이 적보다 위 향할때
                else if (this.enemyy + this.enemyh > this.weapponArray[i].bmy){
                    //우측방향
                    if (this.enemyx  + this.enemyw < this.weapponArray[i].bmx){ 
                    for (z=0;z<12;z++){
                        Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*2,this.weapponArray[i].bmy - z*1.5,this.weapponArray[i].bsize/2  + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 200);
                    }

                    }
                    //좌측방향
                    if (this.enemyx  + this.enemyw > this.weapponArray[i].bmx){ 
                    //총알이 적보다 좌측 아래로 향할때                 
                    for (z=0;z<12;z++){
                        Context.drawImage(this.weapponImage,this.weapponArray[i].bmx - z*2,this.weapponArray[i].bmy - z*1.5,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 - this.weapponArray[i].bmy / 200);
                    }
                    }
                }else {
                    //그외  
                    for (z=0;z<12;z++){       
                        Context.drawImage(this.weapponImage,this.weapponArray[i].bmx,this.weapponArray[i].bmy,this.weapponArray[i].bsize/4 + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100);      
                    }
                }   
            }
        }
        
        if (this.enemy_type == 2){     //적 타입이 2인경우만 유도탄

            //유도 미사일 특징
            //1.크기가 크다. 느리다
            //this.weappon_size = this.weappon_size + this.enemy_size/10;
            this.weappon_size = this.weappon_size + 0.2;


            //미사일 화면 이탈시 또는 미사일이 너무 커지면
            if (this.weapponArray[i].bsize >= 100){
                this.weapponArray[i].bsize = this.weapponArray[i].bsize - 1;
                this.weappon_size = this.weappon_size - 0.1;
            }


            //미사일이 플레이어보다 커지면
            if (this.weapponArray[i].bsize >= playerHeight/2){
                this.weapponArray[i].bsize = this.weapponArray[i].bsize - 1;
                this.weappon_size = this.weappon_size - 0.1;
            }     
            
            //2.좌우로 흔들린다.
            this.weapponArray[i].bmx = this.weapponArray[i].bmx + Math.floor(Math.random()*10) - Math.floor(Math.random()*10);
            this.weapponArray[i].bmy = this.weapponArray[i].bmy + Math.floor(Math.random()*2) - Math.floor(Math.random()*3);
            //3.속도가 느리다.
            this.weappon_speed = 1/2;

            //4.플레이어 위치에 따른 미사일 방향 변경된다.
            if (playerY >= this.enemyy + this.enemyh/2 + theCanvas.clientHeight / 6){
                this.weappon_upDown = 1;
                //console.log('1')
            }else if (playerY <=  this.enemyy - this.enemyh/2 - theCanvas.clientHeight / 6){
                this.weappon_upDown = -1;
                //console.log('2')
            }else if (playerX <=  this.enemyx + this.enemyw/2 - theCanvas.clientWidth / 3){
                this.weappon_leftRight = -1;
                this.weappon_upDown = this.weappon_tmp_random;
                //console.log('3')
            }else if (playerX >=  this.enemyx - this.enemyw/2 - theCanvas.clientWidth / 3){
                this.weappon_leftRight = 1;
                this.weappon_upDown = this.weappon_tmp_random;
                //console.log('4')
            }


            this.weapponArray[i].bmx =  this.weapponArray[i].bmx + this.weapponArray[i].bdirection * this.weappon_leftRight;
            this.weapponArray[i].bsize = this.weappon_size;
            this.weapponArray[i].bmy = this.weapponArray[i].bmy + this.weapponArray[i].bsize * this.weappon_upDown / (Math.floor(Math.random()*1) + 2); //<= 총알 속도의 핵심(his.weappon_upDown / 4).
            //this.weapponArray[i].bmy  = this.weapponArray[i].bmy  * this.weapponArray[i].bspeed; 
            //Context.drawImage(this.weapponImage,this.weapponArray[i].bmx,this.weapponArray[i].bmy,this.weapponArray[i].bsize/10  + this.weapponArray[i].bmy / 100,this.weapponArray[i].bsize / 5 + this.weapponArray[i].bmy / 50);
            

            if (this.enemyxx > this.weapponArray[i].bmx){
                for (z=0;z<5;z++){ 
                    Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*(Math.floor(Math.random()*2) + 2),this.weapponArray[i].bmy,this.weapponArray[i].bsize/5  + this.weapponArray[i].bmy / 200 + z/2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100 + z/2);
                }
            }else {
                for (z=0;z<5;z++){ 
                    Context.drawImage(this.weapponImage,this.weapponArray[i].bmx - z*(Math.floor(Math.random()*2) + 2),this.weapponArray[i].bmy,this.weapponArray[i].bsize/5  + this.weapponArray[i].bmy / 200 + z/2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100 + z/2);
                } 
            }

        }
        
        if (this.enemy_type == 1){     //적 타입이 1인경우만 레이져

            //레이져
            add_borderX = theCanvas.clientWidth;  //총알이 리셋되는 경계를 늘려주는 변수(총알이 밖으로 나가면 전체가 초기화 되는 현상때문에)
            add_borderY = theCanvas.clientHeight;  //총알이 리셋되는 경계를 늘려주는 변수(총알이 밖으로 나가면 전체가 초기화 되는 현상때문에)

            //일반총알 특징, 작다, 빠르다
            //총알인경우 플레이어 위치와 상관없이 위.아래(y축)으로만 진행한다.
            //this.weappon_size = this.weappon_size + this.enemy_size/20;
            //this.weappon_size = this.weappon_size + 1;
            this.weappon_size = this.weappon_size + 0.1;
 

            //미사일 화면 이탈시 또는 미사일이 너무 커지면
            if (this.weapponArray[i].bsize >= 50){
               
                this.weapponArray[i].bsize = this.weapponArray[i].bsize - 1;
                this.weappon_size = this.weappon_size - 0.1;
                
            } 
  

            //레이져가 플레이어보다 커지면
            if (this.weapponArray[i].bsize >= playerHeight/3){
              
                this.weapponArray[i].bsize = this.weapponArray[i].bsize - 1;
                this.weappon_size = this.weappon_size - 0.1;
            }            

            //총알 반은 위로 반은 아래로향한다.
            if (this.weappon_index%4 == 0){
                this.weappon_upDown = 1;
                this.weappon_leftRight =  1 * (Math.floor(Math.random() * 1)==0?1:-1);
            }else if (this.weappon_index%4 == 1){
                this.weappon_upDown = -1;
                this.weappon_leftRight =  1 * (Math.floor(Math.random() * 1)==0?1:-1);
            }else if (this.weappon_index%4 == 2){
                this.weappon_leftRight = -1 - (Math.floor(Math.random() * 1) + 1);
                this.weappon_upDown = this.weappon_tmp_random * (Math.floor(Math.random() * 1)==0?1:-1);
            }else {
                this.weappon_leftRight = 1 + (Math.floor(Math.random() * 1) + 1);
                this.weappon_upDown = this.weappon_tmp_random * (Math.floor(Math.random() * 1)==0?1:-1);
            }

            this.weapponArray[i].bmx =  this.weapponArray[i].bmx + this.weapponArray[i].bdirection * this.weappon_leftRight;
            this.weapponArray[i].bsize = this.weappon_size;
            this.weapponArray[i].bmy = this.weapponArray[i].bmy + this.weapponArray[i].bsize * this.weappon_upDown / (Math.floor(Math.random()*1) + 2); //<= 총알 속도의 핵심(his.weappon_upDown / 4).
            this.weapponArray[i].bmy  = this.weapponArray[i].bmy  * this.weapponArray[i].bspeed; 
            
            // for (z=0;z<10;z++){
                 
            //     Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*2,this.weapponArray[i].bmy + z*2,this.weapponArray[i].bsize/5  + this.weapponArray[i].bmy / 200,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100);
            // }

            //총알이 적보다 아래로 향할때
            if (this.enemyy   < this.weapponArray[i].bmy){
                //우측방향
                if (this.enemyx < this.weapponArray[i].bmx){ 
                    for (z=0;z<10;z++){
                        Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*2,this.weapponArray[i].bmy + z*2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 - this.weapponArray[i].bmy / 100);
                    }  
                
                }
                
                //좌측방향
                if (this.enemyx  > this.weapponArray[i].bmx){ 
                //총알이 적보다 좌측 아래로 향할때                 
                    for (z=0;z<10;z++){
                        Context.drawImage(this.weapponImage,this.weapponArray[i].bmx - z*2,this.weapponArray[i].bmy + z*2,this.weapponArray[i].bsize/2  + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 - this.weapponArray[i].bmy / 100);
                    }
                }
            }
            //총알이 적보다 위 향할때
            else if (this.enemyy + this.enemyh > this.weapponArray[i].bmy){
                //우측방향
                if (this.enemyx  + this.enemyw < this.weapponArray[i].bmx){ 
                 for (z=0;z<5;z++){
                     Context.drawImage(this.weapponImage,this.weapponArray[i].bmx + z*2,this.weapponArray[i].bmy - z*2,this.weapponArray[i].bsize/2  + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 200);
                 }

                }
                //좌측방향
                if (this.enemyx  + this.enemyw > this.weapponArray[i].bmx){ 
                //총알이 적보다 좌측 아래로 향할때                 
                 for (z=0;z<5;z++){
                     Context.drawImage(this.weapponImage,this.weapponArray[i].bmx - z*2,this.weapponArray[i].bmy - z*2,this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 - this.weapponArray[i].bmy / 200);
                 }
                }
            }else {
                //그외  
                for (z=0;z<5;z++){
                    Context.drawImage(this.weapponImage,this.weapponArray[i].bmx,this.weapponArray[i].bmy,this.weapponArray[i].bsize/4 + this.weapponArray[i].bmy / 200, this.weapponArray[i].bsize/2 + this.weapponArray[i].bmy / 100);      
                }
            } 

             
        }

        //총알이 너무 커지면... 플레이어보다 커지면(공통)
        if (this.weapponArray[i].bsize >= playerHeight/2){

            this.weapponArray[i].bsize = this.weapponArray[i].bsize - 4;
            this.weappon_size = this.weappon_size - 0.4;
            this.weapponArray[i].bmy = this.weapponArray[i].bmy + 2; //상단을 향하도록 한다.

            // this.weapponArray[i].bsize = 0;
            // this.weappon_size = 0;
        }       

        //플레이어 충돌
        this.player_collision();

       //미사일 화면 이탈시 또는 미사일이 너무 커지면
       //if (weapponArray[i].bmx >= theCanvas.clientWidth  || weapponArray[i].bmx <= 0 ){
       //if ( this.weapponArray[i].bmy >= theCanvas.clientHeight + add_borderX || this.weapponArray[i].bmy + add_borderX <= 0 || this.weapponArray[i].bsize >= 150){
        if(this.enemy_type != 4){
            if ( this.weapponArray[i].bmy >= theCanvas.clientHeight + add_borderX || this.weapponArray[i].bmy + add_borderX <= 0){

                //최대 max_weappon_cnt 개까지만 생성
                if (1 == Math.floor(Math.random()*2)){

                    //this.weappon_cnt = Math.floor(Math.random()*5) + 1;

                    //미사일 객체(배열) 초기화
                    this.weappon_init();
                    //this.weappon_size = 3 * parseInt(Math.floor(gameTime/1500));

                }else {
                    //5초마다 미사일 증가
                    //if (gameTime % 500 == 0){
                        this.weappon_cnt++;

                        if (this.weappon_cnt >= this.max_weappon_cnt){
                            this.weappon_cnt = this.max_weappon_cnt;
                        }

                        this.weappon_create();
                    //}

                    //미사일 객체(배열) 초기화
                    this.weappon_init();
                }

            }
        }
    }
}

//브라우져마다 작동되는 진동 메소드가 다르므로 통합
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate; 
////////////////// 플레이어 폭파(미사일 충돌)
function player_collision(){

    //if ((parseInt(weapponArray[i].bmx) <= parseInt(playerX)  + playerWidth) && (parseInt(weapponArray[i].bmx) + weapponArray[i].bsize >= parseInt(playerX)  )){
        //미사일과 Y좌표 충돌시
        //if ((parseInt(weapponArray[i].bmy) <= parseInt(playerY)  + playerHeight) && (parseInt(weapponArray[i].bmy)  + weapponArray[i].bsize >= parseInt(playerY) )){
    //미사일 출동시 약간의 간극을 약간 스칠경우는 폭파되지않도록 한다.
    var ll_tmpspace = 10;

    //현재 미사일 index
    var i = this.weappon_index;

    if ((parseInt(this.weapponArray[i].bmx) <= parseInt(playerX)  + playerWidth - ll_tmpspace) && (parseInt(this.weapponArray[i].bmx) + this.weapponArray[i].bsize >= parseInt(playerX)  + ll_tmpspace )){
        //미사일과 Y좌표 충돌시
        if ((parseInt(this.weapponArray[i].bmy) <= parseInt(playerY)  + playerHeight - ll_tmpspace) && (parseInt(this.weapponArray[i].bmy)  + this.weapponArray[i].bsize >= parseInt(playerY)  + ll_tmpspace)){
            //console.log("Pdistance",Pdistance)  
                                
                //1초간 진동 
                if (ls_VColor == "yellow"){
                    navigator.vibrate(500); // 진동을 울리게 한다. 1000ms = 1s 이다.
                }

                //충돌시 폭파이미지로 변경
                if (player_life <= 1){  
                    //2초간 진동 
                    if (ls_VColor == "yellow"){                    
                        navigator.vibrate(1000); // 진동을 울리게 한다. 1000ms = 1s 이다.
                    }
                    // explosion_sound.currentTime  = 4;
                    // explosion_sound.play();  
                    Context.drawImage(explosionImage01,playerX-Math.floor(Math.random()*40),playerY+Math.floor(Math.random()*40),35,25);
                    Context.drawImage(explosionImage01,playerX-10,playerY - 15,60*(Pdistance/500)*playerHeight/50,30*(Pdistance/500)*playerWidth/10);
                    Context.drawImage(explosionImage01,playerX+Math.floor(Math.random()*10),playerY-Math.floor(Math.random()*60),120,115);

                    playerImage = explosionImage01;
                    player_warp = explosionImage01;

                    this.energe_bar = '';
                    explosion_sound.play();
                    explosion_sound.currentTime  = 0;

                    explosion_sound.play();
                    audio.pause();
                    //audio.currentTime  = 0;

                    // playerImage = noneImage;
                    // laserImage = noneImage;
                    // player_warp =  noneImage;

                    //콜로니 밖 우주 배경그려주기(투명도 적용)
                    Context3.save();

                    //Context.globalAlpha = 0.8;

                    status = 4;    //게임 END

                    //게임 점수 저장
                    var ls_current_score = gameScore;
                    var ls_current_time = gameTime;
                    localStorage.setItem('current_score',ls_current_score);
                    localStorage.setItem('current_time',ls_current_time);

                    var ls_before_score = localStorage.getItem('before_score');
                    var ls_before_time = localStorage.getItem('before_time'); 

                    if (ls_before_score == null || ls_before_score == ""){
                        ls_before_score = ls_current_score;
                        ls_before_time = ls_current_time;
                        localStorage.setItem('before_score',ls_current_score);
                        localStorage.setItem('before_time',ls_current_time);
                    }

                    //현재 점수가 이전 점수보다 클경우 최고 점수에 저장, 작을경우 이전 점수 저장
                    if (parseInt(ls_current_score) > parseInt(ls_before_score)){
                        localStorage.setItem('best_score',ls_current_score);
                        localStorage.setItem('best_time',ls_current_time);
                    }else {
                        localStorage.setItem('best_score',ls_before_score);
                        localStorage.setItem('best_time',ls_before_time);
                    }

                    // 이전 점수에 베스트 점수를 저장
                    var ls_best_score = localStorage.getItem('best_score');
                        localStorage.setItem('before_score',ls_best_score);
                    var ls_best_time = localStorage.getItem('best_time');
                        localStorage.setItem('before_time',ls_best_time); 

                    //플레이어가 남아있는경우 자동으로 시작
                    player_cnt = parseInt(player_cnt) - 1;

                    if (parseInt(player_cnt) > 0){ 

                        
                        //출현 사운드
                        mount_sound.play();
                        gameStart(13);

                        isKeyDown = [];
                        isKeyCode = null;
                        wayBefore = null;
                        pmovex = 0;
                        pmovey = 0; 


                        // for(var n=0;n<=200;n++){
                        //     //잠시만 와프 이미지
                        //     if(n%2 == 0){
                        //         playerImage = player_warp;
                        //         Context.drawImage(playerImage,playerX,playerY,playerWidth + Math.floor(Math.random() * 2),playerHeight + Math.floor(Math.random() * 3));

                        //     }else {
                        //         playerImage = player;
                        //         Context.drawImage(playerImage,playerX,playerY,playerWidth + Math.floor(Math.random() * 2),playerHeight + Math.floor(Math.random() * 3));

                        //     }
                        //     //잠시만 무적
            
                        //     player_collision_yn = 'Y'; 
                        // } 
                            player_collision_yn = 'N'; 
                            playerImage = player;
                        


                        //목소리 재생모드일경우만 실행  
                        if (ls_VColor == "yellow"){
                            vregret_sound.play();
                            //대화
                            Context.globalAlpha = 1;
                            Context.font  = "30px Arial";  
                            Context.fillStyle = '#ffffff';
                            Context.fillText("크게 한방 먹었군...",ls_width/2 - ls_width/10,50);
                            //Context.fill(); 
                        }                  

                //게임 재시작 or 종료
                }else { 
                     
                    //목소리 재생모드일경우만 실행  
                    if (ls_VColor == "yellow") {
                        //2초간 진동 
                        navigator.vibrate(2000); // 진동을 울리게 한다. 1000ms = 1s 이다.
                        vfinish_sound.play(); 
                        //대화
                        Context.globalAlpha = 1;
                        Context.font  = "30px Arial";  
                        Context.fillStyle = '#ffffff';
                        Context.fillText("이제 다 끝난건가...?",ls_width/2 - ls_width/10,50);
                        //Context.fill();
                    }                         
                    
                    gameRetryExitButton(); 

                }

                return;

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
                    //weapponArray[i] = null;
                    this.weapponArray[i].bx = 0;
                    this.weapponArray[i].by = 0;
                    this.weapponArray[i].bmx = 0;
                    this.weapponArray[i].bmy = 0;
                    this.weapponArray[i].bsize = 0;

                    if (player_life == 2){
                           //목소리 재생모드일경우만 실행  
                           if (ls_VColor == "yellow") {
                               vdanger_sound.play();
                                //대화
                                Context.globalAlpha = 1;
                                Context.font  = "30px Arial";  
                                Context.fillStyle = '#ffffff';
                                Context.fillText("앗! 위험해.",ls_width/2 - ls_width/10,50);
                                //Context.fill();
                            } 
                    }
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
    Context.fillStyle = "#000000";
    Context.fillRect(0,0,theCanvas.clientWidth,theCanvas.clientHeight);
    Context.fillStyle = "#ffffff";
    Context.font = '100px Arial';

    //console.log("gameScore/1000",parseInt(gameScore/1000))
    //플레이어 갯수(보너스)(10000점마다 1개씩 증가)
    //bonus_cnt = Math.floor(gameScore/1000);
    if (gameScore >= 10000 &&  bonus_cnt == Math.floor(gameScore/10000)){

        //if (gameScore%1000 == 0){

            if (player_cnt > 0){
                bonus_sound.play();

                bonus_cnt = bonus_cnt + 1;
                //alert(bonus_cnt)

            }

            player_cnt =  player_cnt + 1;
            //player_cnt =  player_cnt + bonus_cnt;  
       // }
    }

    //게임상태정보표시
    //game_status();

	//게임 컨트롤
    //gameControl();

    //전함01 이동
    ship01_move();


    //게임 배경 화면
	//if (gameTime%2 === 0){
		game_background();
	//} 


    //시작 사운드
    if (parseInt(gameTime) <= 120){
        // raygun_sound.currentTime  = 2; 
        // raygun_sound.play();
        // playerImage = player_warp;
    //목소리 재생모드일경우만 실행                               
    }else if (parseInt(gameTime) <= parseInt(ini_ready_time)){ 
    //    raygun_sound.play(); 

        if (ls_VColor == "yellow") {
    //        vstart_sound.play();
            //대화
            Context.globalAlpha = 1;
            Context.font  = "30px Arial";  
            Context.fillStyle = '#ffffff';
            Context.fillText("자! 출발하자.",ls_width/2 - ls_width/10,50);
        }
    }   

    //플레이어 경계
    player_border();

    //플레이어 거리
    player_didtance(); 

    //스킬 변경
    //skill_change();

    //기본 스킬(sword)  
    //if(sword_yn=='Y') sword_move();  
    sword_move();

    //레이져 방향
    if (skill == 1){ 
        laser_charge_total_time = Math.abs(gameTime - laser_charge_start_time);  
        laser_move();
    }else if (skill == 2){ 
        laser_charge_total_time = Math.abs(gameTime - laser_charge_start_time);  
        laser_move();
    }else if (skill == 3){ 
        //폭탄 타이머 시작
        laser_charge_total_time = Math.abs(gameTime - laser_charge_start_time);  
        laser_yn='N';
        if (10 <= laser_charge_total_time && laser_charge_total_time < 20){   
             playerSkill_03TmpImage = playerSkill_03Tmp2Image;
        }      
       
         //Context6.drawImage(playerSkill_03TmpImage,lmovex-10,lmovey-25,playerWidth*1.4,playerHeight*0.6);  
         Context6.drawImage(playerSkill_03TmpImage,lmovex-10,lmovey-25,playerWidth*0.9,playerHeight*0.6);  
        laser_move();
    }else if (skill == 4){ 
        //이온포 충전 시작
        laser_charge_total_time = Math.abs(gameTime - laser_charge_start_time);   
        //충전시에는 적을 피해입히지않도록 레이져 크기 초기화, 폭파되는 조건에도 크기가 0보다 클때만 진행되도록 한다.
        l_width = 0;
        l_height = 0;
        //l_width = playerWidth/10;
        //l_height = playerHeight/10;
        laserImage = laser02;
        if (5 <= laser_charge_total_time && laser_charge_total_time < 10){  
            
            appear_sound.play(); 

            Context.drawImage(laserImage,playerX + Math.random() * 50,playerY - Math.random() * 25,playerWidth/2 + Math.random() * 10 - 25,laser_charge_total_time/2 + Math.random() * 10 - 25);
            Context.drawImage(laserImage,playerX + Math.random() * 30,playerY - Math.random() * 25,playerWidth/3 + Math.random() * 20 - 25,laser_charge_total_time/2 + Math.random() * 20 - 25);
            Context.drawImage(laserImage,playerX + Math.random() * 50,playerY + Math.random() * 25,playerWidth/5 + Math.random() * 30 - 25,laser_charge_total_time/2 + Math.random() * 30 - 25);
            Context.drawImage(laserImage,playerX + Math.random() * 20,playerY - Math.random() * 25,playerWidth/5 + Math.random() * 50 - 25,laser_charge_total_time/2 + Math.random() * 20 - 25);
            Context.drawImage(laserImage,playerX + Math.random() * 70,playerY + Math.random() * 25,playerWidth/4 + Math.random() * 30 - 25,laser_charge_total_time/2 + Math.random() * 10 - 25);
            Context.drawImage(laserImage,playerX + Math.random() * 80,playerY - Math.random() * 25,playerWidth/1.4 + Math.random() * 20 - 25,laser_charge_total_time/2 + Math.random() * 20 - 25); 
            
        }else if(20 < laser_charge_total_time){
            laser_move(); 
        }       

    }else if (skill == 5){ 
        //플레이어 미사일이 발사된후 시간이 2초 지나면 자동 초기화
        laser_charge_total_time = Math.abs(gameTime - laser_charge_start_time); 
        //console.log(laser_charge_total_time);
        if(laser_charge_total_time > 200){
            laser_init();
            laser_charge_total_time = 0;
            return;
        }
        laser_move();
    }
 
    //적 이동
    try{ 
        //for (var i=0;i<=enemy_array.length - 1;i++){
        for (var i=0;i<enemy_array.length;i++){
            if (enemy_array[i].enemy_index == i){
                enemy_array[i].enemy_move();
            }
        }
    } catch (error) {
        //alert("적이동시 예외적 에러 발생!");
        console.log(error.name,error.message);
    }
 
    //플레이어 이동(플레이어는 맨 마지막에 그려준다. 그래야 다른 적들보다 앞에서 보여진다.)
    player_move();
 
    try{ 
        //적 미사일 이동(적미사일과 충돌시 폭파이미지는 플레이어 뒤에서 그려준다.)
        for (var i=0;i<enemy_array.length;i++){
            if (enemy_array[i].enemy_index == i){
                enemy_array[i].weappon_move();
            }
        }
    } catch (error) {
        //alert("적 미사일 이동시 예외적 에러 발생!")
        console.log(error.name,error.message);
    }
        

    //기본 스킬(sword)
    //if(sword_yn=='Y') sword_move();  

    //5초마다 미사일 더생성
    // if(gameTime % 100 === 0){
    //     console.log("추가",gameTime)
    //     //동시 나타나는  미사일수
    //     for (var i = 0;i<=2; i++){
    //         //weapponArray.push({bx:weapponX, by:weapponY, bmx:move_weapponX, bmy:100, bsize:10, bspeed:20, bdirection:weappon_Randon});
    //     }
    // }

    //10초마다 적 추가생성 => 5초
    //if(gameTime % 500 === 0){
    //랜덤하게


        // //보스 출현중일경우는 생성하지 않는다.
        // for (var i=0;i<=enemy_array.length - 1;i++){
        //     if (enemy_array[i].enemy_boss_01_yn == 'Y'){
        //         enemy_boss_01_status = 1;
        //     }
        // }  

        //목소리 재생모드일경우만 실행 
        if (enemy_array.length == 0 && parseInt(gameTime) > 1000){
            if (ls_VColor == "yellow"){
                vsafe_sound.play();
                //대화
                Context.globalAlpha = 1;
                Context.font  = "30px Arial";  
                Context.fillStyle = '#ffffff';
                Context.fillText("여긴 아무이상도 없는것같아...",ls_width/2 - ls_width/10,50);
                //Context.fill();
            }   
        }

        //목소리 재생모드일경우만 실행 
        if (enemy_cnt == 10){
            if (ls_VColor == "yellow"){
                vbee_sound.play();
                //대화
                Context.globalAlpha = 1;
                Context.font  = "30px Arial";  
                Context.fillStyle = '#ffffff';
                Context.fillText("벌떼같은 녀석들!",ls_width/2 - ls_width/10,50);
                //Context.fill();
            }      
        }

        //목소리 재생모드일경우만 실행 
        if (enemy_cnt == 14){
            if (ls_VColor == "yellow"){
                vangry_sound.play();
                //대화
                Context.globalAlpha = 1;
                Context.font  = "30px Arial";  
                Context.fillStyle = '#ffffff';
                Context.fillText("죽어랏! 괴물들...",ls_width/2 - ls_width/10,50);
                //Context.fill();
            }else {
                // Context.fillText("",ls_width/2 - ls_width/10,50);
                // Context.fill();      
            }                        

        }        

        ////if (enemy_boss_01_status == 0){
            //무슨 의도인지 몰라서 아래 주석 ==> 적 출현 주기
            if(gameTime % ((Math.floor(Math.random() * 3) + 2) * 100) === 0){ 
            //if(gameTime % ((Math.floor(Math.random() * 3) + 2) * 60) === 0){ 

                enemy_cnt = enemy_cnt + 1; 
            
                create_enemy(enemy_cnt); 
            }
        ////} 

    //게임 진행 정보(맨마지막에 그려줘야 게임내 이미지가 덮지않는다.)
    //게임상태정보표시
    game_status();

    //게임 컨트롤
    gameControl();

    // Context.font  = "30px Arial";
    // //Context.fillText("입력된 키값 :" + strKeyEventValue,5,15);
    // //Context.fillText("캔버스 면적 :" + maxX + "," + maxY,5,30);
    // //Context.fillText("입력된 상태 :" + strKeyEventType,5,45);
    // //Context.fillText("입력된 위치 :" + playerX + "," + playerY,5,60);
    // //Context.fillText("면적 :" + maxX + "," + maxY,theCanvas.clientWidth - 100,15);
    // //Context.fillText("FPS :" + gameFrame,theCanvas.clientWidth - 100,30);
    // //Context.fillText("거리 :" + gameTime + "Km",theCanvas.clientWidth - 100,45);
    // //Context.fillText("속도 :" + Pspeed + "Km/s",theCanvas.clientWidth - 100,60);
    // //Context.fillText("타겟 :" + parseInt(Pdistance) + "Km/s",theCanvas.clientWidth - 100,75);
    // //Context.fillText("Score : " + gameTime,theCanvas.clientWidth - 250,50); 
    // Context.globalAlpha = 1;
    // Context.fillStyle = '#ffffff';
    // Context.fillText("Score  : " + (parseInt(gameScore - 50)<=0?0:gameScore),10,50);
    // Context.fillText("Player : " + String((parseInt(player_cnt) - 1<=0?0:parseInt(player_cnt) - 1)),10,100);
    // //Context.fillText("Ctime  : " + laser_charge_total_time,10,150);
    // Context.fillText("Skill     : " + skill,10,150); 
    // //Context.fillText("Power : " + power,10,200); 
    // //Context.fillText("Time  : " + (parseInt(gameTime - 50)<=0?0:gameTime),10,250);    

    Context.font  = "30px Arial";
    Context.globalAlpha = 1;
    Context.fillStyle = '#ffffff';
    if (ls_VColor == "yellow"){
        var skill_text;
        //Context.fillText("점수 : " + (parseInt(gameScore - 200)<=0?0:gameScore),10,50);
        Context.fillText("점수 : " + gameScore,10,50);
        Context.fillText("부활 : " + String((parseInt(player_cnt) - 1<=0?0:parseInt(player_cnt) - 1)),10,100); 
        if(skill==1) skill_text = '레일건';
        if(skill==2) skill_text = '레이져';
        if(skill==3) skill_text = '폭멸탄';
        if(skill==4) skill_text = '이온포';
        if(skill==5) skill_text = '미사일';        
        Context.fillText("무기 : " + skill_text,10,150);  
        //Context.fillText("속도 : " + Pspeed,10,200);  
        Context.fillText("FPS : " + ini_gameFrame,10,200);
        
        //Context.fillText("시간 : " + gameTime,10,200);    
    }else {
        //Context.fillText("Score  : " + (parseInt(gameScore - 200)<=0?0:gameScore),10,50);
        Context.fillText("Score  : " + gameScore,10,50);
        Context.fillText("Player : " + String((parseInt(player_cnt) - 1<=0?0:parseInt(player_cnt) - 1)),10,100); 
        Context.fillText("Skill     : " + skill,10,150);  
        //Context.fillText("Time    : " + gameTime,10,200);
        //Context.fillText("Speed : " + Pspeed,10,200);
        Context.fillText("FPS    : " + ini_gameFrame,10,200);
    }

    if(gameTime<=50){
        Context.font = '100px Arial';
        Context.fillText("Ready", (theCanvas.clientWidth - ini_player_width) / 2 - theCanvas.offsetLeft - 100, theCanvas.clientHeight / 2 - theCanvas.offsetTop);
        Context.font = '30px Arial';
    }
}

////////////////// 키 다운 이벤트 처리(데스크 탑 이용시)
function onkeyDown(e, as_strKeyEventValue){
 
    strKeyEventValue = e.key;
    strKeyEventType = e.type;
    isKeyCode =  e.keyCode; 
    //alert(isKeyCode + ',' + isBfKeyCode);
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

            //적 생성
            create_enemy();

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

            create_enemy();

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

                //적 생성
                create_enemy();

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
 
    //공격스킬 사운드
    if (strKeyEventValue == "Space"  || isKeyCode == 32){ 
        
        //공격 스킬구분에 따른 공격 레이져 초기변수(레이져 스킬인 1인경우만 레이져 사운드 재생)
        if (skill == 1){ 
            //레일건
            shootgun_sound.currentTime  = 0.2;
            shootgun_sound.play();  
        }else if (skill == 2){ 
            //레이져
            laser_sound.currentTime  = 0;
            laser_sound.play();
        }else if (skill == 3){
            laser_charge_total_time = 0;
            laser_charge_start_time  = gameTime;  
            //폭탄 장착 소리 추가
            timmer_sound.currentTime  = 0.8;
            timmer_sound.play();    
        }else if (skill == 4){
            laser_charge_total_time = 0;
            laser_charge_start_time  = gameTime;  
            //이온포
            warp_sound.play();
        }else if (skill == 5){
            //미사일
            // if(laser_charge_total_time > 0) return;
            //if(l_width < 32) return;

            missile_sound.currentTime  = 0.8;
            missile_sound.play(); 
        }

        //레이져 변수 초기화
        laser_init();
        laser_yn = 'Y';
        laser_move();

    } 

    //기본공격(sword) 
    if (isKeyCode == 90 || isKeyCode == 70){    
        sword_yn = 'Y';
        //sword_move(); 
    }     

    //스킬체인지  
    if (isKeyCode == 67 || isKeyCode == 82){   
        skill_change();     
    }  
    
}

////////////////// 키 업 이벤트 처리(데스크 탑 이용시)
function onkeyUp(e){
    //alert(e.keyCode + ","  + wayBefore2);
    //와프키를 누루고 있을때 연속으로 계속 적용되지 않도록 초기화
    if (e.keyCode == 16){  
        // isKeyCode = null;
        // isKeyDown[e.keyCode] = false;

        // strKeyEventValue = e.key;
        // strKeyEventType = e.type;
        // strKeyEventValue = "None";
        //alert(wayBefore + ","  + wayBefore2);
        //isKeyCode = e.keyCode;
        wayBefore = wayBefore2;

        if(wayBefore == 'L'){
            isKeyCode = 37;
        }else if(wayBefore == 'R'){
            isKeyCode = 39;
        }else if(wayBefore == 'U'){
            isKeyCode = 38;
        }else if(wayBefore == 'D'){
            isKeyCode = 40;
        } 
        
    }  
}


////////////////// 키 더블클릭 이벤트 처리(데스크 탑 이용시)
// function onDblkeyDown(e){
//     alert("dbl");
//     isKeyCode == 17;

//     strKeyEventValue = e.key;
//     strKeyEventType = e.type;
//     strKeyEventValue = "None";
// }

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

//전체화면으로 실행하기
function toggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      // if (document.exitFullscreen) {
      //   document.exitFullscreen();
      // } else if (document.msExitFullscreen) {
      //   document.msExitFullscreen();
      // } else if (document.mozCancelFullScreen) {
      //   document.mozCancelFullScreen();
      // } else if (document.webkitExitFullscreen) {
      //   document.webkitExitFullscreen();
      // }
    }
  }