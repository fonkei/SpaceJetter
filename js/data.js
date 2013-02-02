var myCanvas = null;
var myStatusBar = null;
var myFooter = null;
var ctx = null;		// Spiel Canvas
var sctx = null;	// Statusbar Canvas

// width of the canvas
var width = 600; 
var HBWidth = null;
var SBWidth = null; 

// height of the canvas  
var height = 800; 
var HBHeight = null;
var SBHeight = null;

var scale = null;
var audio = null;
// verschiedene Konstanten 

var SKY_COLOR = '#000000';
var RATIO = null;

var currentWidth = null;
var currentHeight = null;
var currStatusHeight = null;
var currFooterHeight = null;

var ua = navigator.userAgent.toLowerCase();
var android = ua.indexOf('android') > -1 ? true : false;
var ios = ( ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1  ) ? true : false;

// Character Codes
var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;
var UP_ARROW = 38;
var DOWN_ARROW = 40;
var SPACE_BAR = 32;
var P_KEY = 80;

var backgroundPic; 
 
var countImagesLoading = 0;

// verschiedene Variablen fuer das Spiel
var enemies = [];
var objects = [];
var bullets = [];
var powerUps = [];

var tankStatus = 420;

// Balloon Variablen
var balloon = null;
var balloonXPosition = 200;
var balloonYPosition = 250;
var balloonDirection = 0;
var balloonVertSpeed = 0;
var balloonHorSpeed = 0;
var balloonFrame = 0;
var heightBarFrame = 3;

// Spaceship Variablen
var spaceship = null;
var spaceshipXPosition = 200;
var spaceshipYPosition = 250;
var spaceshipDirection = 0;
var spaceshipVertSpeed = 0;
var spaceshipHorSpeed = 0;
var spaceshipFrame = 0;
var heightBarFrame = 3;


var sunPosition = -120;
var timer = 0;
var gamePaused = false;
var soundOn = true;
var gameHandle = 0;
var cloudHandle = 0;
var powerUpHandle = 0;
var enemyHandle = 0;



var windSpeed = 0;
var degree = 0;
var flightAttitude = 0;
var maxLvlHeight = 0;
var lvlSpeed = 0;
var bgHeight = 0;
var lvlScore = 0;

var lvlMngr = null;
var prflMngr = null;
var level = null;
var imgMngr = null;
var audioMngr = null;
var maxWindStrenght = 0;
var cloudSprite = null;
var balloonSprite = null;
var enemySprite = new Array();
var powerupSprite = new Array();
var weaponSprite = new Array();
var explosionSprite = new Array();
var tanksprite = null;
var spriteSheet = null;
var bgFrame = 0;
var hasFocus = true;
var isStarted = false;

var keys = {};

var enemyCounter = 0;
var pathCounter = 0;

// Erschuetterung bei Explosion
var shock = false;
var sphereCount = 0;

var currLevel = 0;
var storedLevel = 0;
var lastX = 0;
var maxLevel = 0;

var gnStartTime = 0;
var gbMove = false;
var gbStillTouching = false;

var timeoutId = 0;

var explosionSheet  = null;
var bgSheet 		= null;
var enemySheet 		= null;
var powerUpSheet 	= null;
var weaponSheet 	= null;
var spaceshipSheet 	= null;
var laserSnd 	= null;
var laserSound1	= null;
var laserSound2 = null;
var laserSound3 = null;
var laserSound4 = null;
var laserSound5 = null;

var expSound1	= null;
var expSound2 = null;
var expSound3 = null;
var expSound4 = null;
var expSound5 = null;
var expSound6 = null;
var expSound7 = null;
var expSound8 = null;
var expSound9 = null;

var bangSnd 	= null;

var mouseX = 0;
var mouseY = 0;

var powerUpCount = 0;