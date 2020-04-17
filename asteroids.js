// начало проекта 11.04.20
let myCanvas = document.getElementById("my_canvas");
let ctx = myCanvas.getContext("2d");
myCanvas.width = 1024;
myCanvas.height = 768;


const shipSize = 10; //диаметр корабля
const FPS = 20;
const asteroidCircle = false;
const collisionCoaff = 20;
const numberRoids = 1; // количество астероидов
const sizeRoids = 100; // размер астероида
const vertRoids = 30; // максимальное количество граней
const blob = .2; // коэффициент корявости от 0 до 1 
const speedRoids = 3;
const laserMax = 2; // количество лазеров на экране
const laserSpeed = 2;
const laserR = 2;
const laser_r = 200;
const seedsR = 4;
const seedsNumber = 12;
let lives = 3;

let blobs = []; // массив хранящий коэффициент выпуклости каждой грани
let roids = []; // массив для хранения созданных астероидов со всеми параметрами
let seeds = [];
let arrLaser = [];
let explosion_mass = [];
let ship = {
	x: myCanvas.width / 2,
	y: myCanvas.height / 2,
	r: shipSize,
	a: Math.PI,
	speed: 0,
	rotation: 0,
	direction: {
		directionMove: false,
		x: 0,
		y: 0,
	}
}



createAsteroids();
seedsCreate();


setInterval(mainLoop, 1000 / FPS);

function mainLoop() {	
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);	
	
	collision();
	laserCollision();
	seedsCollect();
	//RoidVsRoidCollision();
	shipLives();

	
	// рисуем корабль
	ctx.strokeStyle = 'white';
	ctx.lineWidth = 2;
	ctx.beginPath();
	//ctx.arc(ship.x, ship.y, ship.r, 0, ship.a*2, true);
	ctx.moveTo(
		ship.x - Math.cos(ship.rotation*(ship.a/180))*ship.r,
		ship.y - Math.sin(ship.rotation*(ship.a/180))*ship.r
		);
	ctx.lineTo(
		ship.x - Math.cos((ship.rotation+120)*(ship.a/180))*ship.r,
		ship.y - Math.sin((ship.rotation+120)*(ship.a/180))*ship.r
		);
	 ctx.lineTo(
		ship.x - Math.cos((ship.rotation+240)*(ship.a/180))*ship.r,
		ship.y - Math.sin((ship.rotation+240)*(ship.a/180))*ship.r
		);
	ctx.closePath();
	ctx.stroke();	
	ctx.clearRect(
		ship.x - ship.r / 5 / 2 - Math.cos(ship.rotation*(ship.a/180))*ship.r/2,
		ship.y - ship.r / 5 / 2 - Math.sin(ship.rotation*(ship.a/180))*ship.r/2,
		ship.r / 5, ship.r / 5);

	// рисуем огонь
	if (ship.direction.directionMove){
		ctx.strokeStyle = 'yellow';
		ctx.lineWidth = 4;
		ctx.fillStyle = "red";
		ctx.beginPath();
		//ctx.arc(ship.x, ship.y, ship.r, 0, ship.a*2, true);
		ctx.moveTo(
			ship.x + Math.cos((ship.rotation)*(ship.a/180))*ship.r*2,
			ship.y + Math.sin((ship.rotation)*(ship.a/180))*ship.r*2
			);
		ctx.lineTo(
			ship.x - Math.cos((ship.rotation+160)*(ship.a/180))*ship.r,
			ship.y - Math.sin((ship.rotation+160)*(ship.a/180))*ship.r
			);
		 ctx.lineTo(
			ship.x - Math.cos((ship.rotation+200)*(ship.a/180))*ship.r,
			ship.y - Math.sin((ship.rotation+200)*(ship.a/180))*ship.r
			);
		ctx.closePath();
		ctx.stroke();	
		ctx.fill();
	}	

	ship.rotation += ship.speed // поворот корабля с определенной скоростью

	if (ship.x > myCanvas.width){ship.x = 0;} //выход за границы экрана
	if (ship.y > myCanvas.height){ship.y = 0;}
	if (ship.x < 0){ship.x = myCanvas.width;}
	if (ship.y < 0){ship.y = myCanvas.height;}

		ship.x -= ship.direction.x;	//движение корабля
		ship.y -= ship.direction.y;
	if (ship.direction.directionMove){
		ship.x -= Math.cos(ship.rotation*(ship.a/180));
		ship.y -= Math.sin(ship.rotation*(ship.a/180));
	}

	// рисуем астероид
	ctx.strokeStyle = 'grey';	
	ctx.lineWidth = 2;
	let x, y, r, a, vert;
	for (let i = 0; i < roids.length; i++) { // создаем нужное количество астероидов
		x = roids[i].x; // присваиваем переменным параметры астероида (для удобного их использования)
		y = roids[i].y;
		r = roids[i].r;
		a = roids[i].a;
		b = roids[i].b;
		vert = roids[i].vert;
		ctx.beginPath();
		asteroidCircle == true ? ctx.arc(x, y, roids[i].r, 0, Math.PI*2, true) : false;
		ctx.moveTo(
			x + r * b[0] * Math.cos(a),
			y + r * b[0] * Math.sin(a)
			);
		for (let j = 0; j < vert; j++) {
			ctx.lineTo(						
				x + r * b[j+1]* Math.cos(a + j * Math.PI * 2 / vert),
				y + r * b[j+1]* Math.sin(a + j * Math.PI * 2 / vert)
			);
		}
		ctx.closePath();
		ctx.stroke();	

		roids[i].x += roids[i].xv; // движение астероидов
		roids[i].y += roids[i].yv;
		if (roids[i].x > myCanvas.width+roids[i].r){roids[i].x = 0-roids[i].r;} //выход за границы экрана
		if (roids[i].y > myCanvas.height+roids[i].r){roids[i].y = 0-roids[i].r;}
		if (roids[i].x < 0-roids[i].r){roids[i].x = myCanvas.width+roids[i].r;}
		if (roids[i].y < 0-roids[i].r){roids[i].y = myCanvas.height+roids[i].r;}
	}
	// рисуем лазер
	for ( let i = 0; i < arrLaser.length; i++){
		ctx.fillStyle = 'orange';
		ctx.beginPath();
		ctx.arc(arrLaser[i].x, arrLaser[i].y, laserR, 0, Math.PI*2, false);
		ctx.fill();
	}
	// двигаем лазер	
	for ( let i = 0; i < arrLaser.length; i++){
		if ((Math.sqrt((ship.x - arrLaser[i].x)**2 + (ship.y - arrLaser[i].y)**2)) < laser_r){
			arrLaser[i].x -= arrLaser[i].xv;
			arrLaser[i].y -= arrLaser[i].yv;
		}else {arrLaser.splice(i, 1);}						
	}
			// рисуем семечки
	for ( i = 0; i < seeds.length; i++){
		ctx.fillStyle = 'olive';
		ctx.lineWidth = 2;
		ctx.beginPath();
		if (seeds[i] != 0){
			ctx.arc(seeds[i][0], seeds[i][1], seedsR, 0, ship.a*2, true);
		}
		ctx.fill();
		ctx.stroke();
	//	ctx.strokeStyle = 'grey';
	}
		// рисуем жизни
	for (i = 0; i < lives; i++){	
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 2;
		ctx.beginPath();
		//ctx.arc(30+22*i, 30, 10, 0,Math.PI*2, true);
		ctx.moveTo(
			30+22*i - Math.cos(90*(Math.PI/180))*10,
			30 - Math.sin(90*(Math.PI/180))*10
			);
		ctx.lineTo(
			30+22*i - Math.cos(210*(Math.PI/180))*10,
			30 - Math.sin(210*(Math.PI/180))*10
			);
		 ctx.lineTo(
			30+22*i - Math.cos(330*(Math.PI/180))*10,
			30 - Math.sin(330*(Math.PI/180))*10
			);
		ctx.closePath();
		ctx.stroke();	
	}	

}
function seedsCreate(){
	for ( i = 0; i < seedsNumber; i++){				
		seeds.push([Math.floor(Math.random() * myCanvas.width),
					Math.floor(Math.random() * myCanvas.height)]);
	}
}
function seedsCollect(){		
	for (let i = 0; i < seeds.length; i++){
		if (Math.sqrt((ship.x - seeds[i][0])**2 + (ship.y - seeds[i][1])**2) < ship.r){
			seeds.splice(i, 1);			
			lives++;
			//if (seeds.length < 1){console.log('конец');}
		}
	}	
}

function collision() {
	for (let i = 0; i < roids.length; i++){
		if ((Math.sqrt((ship.x - roids[i].x)**2 + (ship.y - roids[i].y)**2)) < roids[i].r-ship.r/(Math.sqrt(roids[i].r)/(roids[i].r)*collisionCoaff)){	
			explosion_mass;		
			ship.x = myCanvas.width / 2 //Math.random() * myCanvas.width;
			ship.y = myCanvas.height / 2 //Math.random() * myCanvas.width;	
			ship.direction.x = 0;
			ship.direction.y = 0;	
			//телепортируем астероид подальше от центра
			let x_min = Math.random() * ((myCanvas.width / 2) - roids[i].r);
			let x_max = Math.random() * (myCanvas.width - ((myCanvas.width / 2) - roids[i].r)) + ((myCanvas.width / 2) - roids[i].r);
			let y_min = Math.random() * ((myCanvas.height / 2) - roids[i].r);
			let y_max = Math.random() * (myCanvas.height - ((myCanvas.height / 2) - roids[i].r)) + ((myCanvas.height / 2) - roids[i].r);
			roids[i].x = (Math.random() < 0.5 ? x_min : x_max);
			roids[i].y = (Math.random() < 0.5 ? y_min : y_max);			 
			//отнимаем одну жизнь
			lives--;
			explosion_mass = [];
			for (let i = 0; i < 200; i++){
				explosion_mass.push(explosion());
			}	
		}		
	}		
}

function RoidVsRoidCollision() {
	for (let i = 0; i < roids.length; i++){
		for (let j = 0; j < roids.length; j++){
			if (i != j){
			if ((Math.sqrt((roids[i].x - roids[j].x)**2 + (roids[i].y - roids[j].y)**2)) < roids[j].r*2){				
				// roids[i].x -= roids[j].xv;// очень странная реакция
				// roids[i].y -= roids[j].yv;
				// roids[j].x -= roids[i].xv;
				// roids[j].y -= roids[i].yv;
				//roids[i].xv = -roids[i].xv;
				//roids[i].yv = -roids[i].yv;
				roids[i].xv = roids[j].xv * (Math.random() < 0.005 ? 1 : -1); // более менее нормальная коллизия
				roids[i].yv = roids[j].yv * (Math.random() < 0.005 ? 1 : -1);

				//roids[i].x = 0;
				//roids[i].y = 0;
			}
			}
		}
	}		
}
function laserCollision() {
	for (let i = 0; i < roids.length; i++){
		for ( let j = 0; j < arrLaser.length; j++){
			if ((Math.sqrt((arrLaser[j].x - roids[i].x)**2 + (arrLaser[j].y - roids[i].y)**2)) < roids[i].r){					
				arrLaser.splice(j, 1);
				if (roids[i].r >= sizeRoids / 4){					
					roids.push(newAsteroid(roids[i].x, roids[i].y, blobs, roids[i].r/2));
					roids.push(newAsteroid(roids[i].x, roids[i].y, blobs, roids[i].r/2));
					// roids[roids.length-1].xv = roids[roids.length-1].xv *2; // увеличиваем скорость маленьких астероидов
					// roids[roids.length-1].yv = roids[roids.length-1].yv *2;
					// roids[roids.length-2].xv = roids[roids.length-1].xv *2;
					// roids[roids.length-2].yv = roids[roids.length-1].yv *2;
					roids.splice(i, 1);
				}else {roids.splice(i, 1);}
			}
		}		
	}
}	

function createAsteroids() {
	roids = []; //обнуляем массив колличества астероидов

	let x, y;
	for (let i = 0; i < numberRoids; i++) { // создаем координаты всех астероидов		
		do {
			x = Math.floor(Math.random() * myCanvas.width);
			y = Math.floor(Math.random() * myCanvas.height);			
		} while ((Math.sqrt((ship.x - x)**2 + (ship.y - y)**2)) < sizeRoids*2); //только если их центр находится от центра корабля на расстоянии
			blobs = []; // обнуляем массив корявости
			for (let j = 0; j < vertRoids; j++) { // загружаем в массив данные о выпуклостях
			blobs.push(Math.random() * blob * 2 + 1 - blob);
			}
		roids.push(newAsteroid(x, y, blobs, sizeRoids)); // загружаем астероиды в массив с созданными координатами

	}
}

function newAsteroid(x, y, b, r) {
	let roid = { // объект содержащий все параметры астероида
		x: x,
		y: y,
		xv: Math.random()*speedRoids*(Math.random() < 0.5 ? 1 : -1),
		yv: Math.random()*speedRoids*(Math.random() < 0.5 ? 1 : -1),
		r: r, //r = Math.random() * (r - 100) + 100, //случайный размер астероида в заданных пределах
		a: Math.random()* Math.PI * 2,
		vert: Math.random() * vertRoids+4,
		b: b, //это массив с кожффициентами к каждой грани (blobs)
	}
	return roid;
}

function createLaser(){
	if (arrLaser.length <= laserMax){
		let speedCoeffLaser = Math.sqrt((ship.direction.x)**2 + (ship.direction.y)**2);
		if (speedCoeffLaser < laserSpeed*4){speedCoeffLaser = laserSpeed*4}
		arrLaser.push({
			x: ship.x - Math.cos(ship.rotation*(ship.a/180))*ship.r,
			y: ship.y - Math.sin(ship.rotation*(ship.a/180))*ship.r,
			xv: Math.cos(ship.rotation*(ship.a/180))*Math.abs(speedCoeffLaser*laserSpeed),
			yv: Math.sin(ship.rotation*(ship.a/180))*Math.abs(speedCoeffLaser*laserSpeed),
		});	
			
	}	
}
function shipLives(){
	if (roids.length < 1){
		alert('больше не осталось');
	}
	if (lives < 0){
		seeds = [];
		createAsteroids();
		seedsCreate();
		lives = 3;
		alert('это конец');
	}
}

function explosion(){
	ctx.fillStyle = 'red';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(ship.x, ship.y, ship.r*2, 0, ship.a*2, true);
	ctx.fill();
	ctx.stroke();
}


function KeyDown(event) {
	switch(event.keyCode) {
		case 32:
			createLaser();
			
			break;
		case 37:
			ship.speed = -FPS/1.5;
			break;
		case 38:
			ship.direction.directionMove = true;		
			ship.direction.x += Math.cos(ship.rotation*(ship.a/180));
			ship.direction.y += Math.sin(ship.rotation*(ship.a/180));			
			break;
		case 39:
			ship.speed = FPS/1.5;
			break;
		case 40:
			break;
	}
}

function KeyUp(event) {
	switch(event.keyCode) {
		case 32:
			arrLaser.length > laserMax ? arrLaser.shift() : true;			
			break;
		case 37:
			ship.speed = 0;
			break;
		case 38:
			ship.direction.directionMove = false;
			break;
		case 39:
			ship.speed = 0;
			break;
	}
}

document.addEventListener('keydown', KeyDown);
document.addEventListener('keyup', KeyUp);
