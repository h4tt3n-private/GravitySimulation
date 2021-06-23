
var cx = 0;
var cy = 0;

var mx = 0;
var my = 0;

var zoom = 1.0;
var dZoom = 0.01;
var maxZoom = 4.0;
var minZoom = 0.2;

// Gravitational constant
const G = 1000; 

// Timestep, delta-time
var dt = 1 / 60;

//
var canvas = document.getElementById("myCanvas");
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);

document.getElementById("myCanvas").focus();

//
var ctx = canvas.getContext("2d");

var camera = {
    position : { x : 0, y : 0 },
    restPosition : { x : 0, y : 0 },
    deltaPosition: 0,
    zoom: 0.0,
    deltaZoom: 0.0,
    restZoom: 0.0,
    update: function(){  
        
    }
};

const gameKeyState = {
    ArrowUp : false,
    ArrowDown : false,
    ArrowLeft : false,
    ArrowRight : false,
    q : false,
    w : false,
    e : false,
    a : false,
    s : false,
    d : false,
    z : false,
    x : false,
    c : false
}

function keyDown(e){
    
    switch(e.key) {
        case 'q': gameKeyState.q = true; break;
        case 'w': gameKeyState.w = true; break;
        case 'e': gameKeyState.e = true; break;
        case 'a': gameKeyState.a = true; break;
        case 's': gameKeyState.s = true; break;
        case 'd': gameKeyState.d = true; break;
        case 'z': gameKeyState.z = true; break;
        case 'x': gameKeyState.x = true; break;
        case 'c': gameKeyState.c = true; break;
        case 'ArrowUp': gameKeyState.ArrowUp = true; break;
        case 'ArrowDown': gameKeyState.ArrowDown = true; break;
        case 'ArrowLeft': gameKeyState.ArrowLeft = true; break;
        case 'ArrowRight': gameKeyState.ArrowRight = true; break;
    }
};

function keyUp(e){
    
    switch(e.key) {
        case 'q': gameKeyState.q = false; break;
        case 'w': gameKeyState.w = false; break;
        case 'e': gameKeyState.e = false; break;
        case 'a': gameKeyState.a = false; break;
        case 's': gameKeyState.s = false; break;
        case 'd': gameKeyState.d = false; break;
        case 'z': gameKeyState.z = false; break;
        case 'x': gameKeyState.x = false; break;
        case 'c': gameKeyState.c = false; break;
        case 'ArrowUp': gameKeyState.ArrowUp = false; break;
        case 'ArrowDown': gameKeyState.ArrowDown = false; break;
        case 'ArrowLeft': gameKeyState.ArrowLeft = false; break;
        case 'ArrowRight': gameKeyState.ArrowRight = false; break;
    }
};

function rnd(min,max) {
    return Math.random() * (max ? (max-min) : min) + (max ? min : 0) 
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }

function updateCameraZoom(e) {
    
    console.log(e);
    
    if(e.deltaY < 0 ) {
        zoom *= (1.0 + dZoom);
        if(zoom > maxZoom) {zoom = maxZoom}
        if(zoom < minZoom) {zoom = minZoom}
    }

    if(e.deltaY > 0 ) {
        zoom /= (1.0 + dZoom);
        if(zoom > maxZoom) {zoom = maxZoom}
        if(zoom < minZoom) {zoom = minZoom}
    }
  }

  function updateCameraPosition(e) {
    console.log(e);
    mx = e.x;
    my = e.y;
  }

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
//window.addEventListener('wheel', updateCameraZoom)
//window.addEventListener('mousemove', updateCameraPosition)

var spaceship = {
    position : { x : -4000, y : 0 },
    velocity : { x : 0, y : 0 },
    force : { x : 0, y : 0 },
    angle : 0,
    angleVec : { x : 1, y : 0 },
    angularVelocity : 0,
    torque : 0,
    mass : 10,
    radius : 0,
    momentOfInertia : 100.0,
    image : 3
};

var planet = {
    position : { x : 0, y : 0 },
    velocity : { x : 0, y : 0 },
    force : { x : 0, y : 0 },
    angle : 0,
    angleVec : { x : 1, y : 0 },
    angularVelocity : 0.05,
    torque : 0,
    mass : 100000,
    radius : 0,
    momentOfInertia : 100.0,
    image : 2
};

spaceship.radius = ((3 * spaceship.mass / 0.0001)/(4 * Math.PI)) ** (1/3);

planet.radius = ((3 * planet.mass / 0.00001)/(4 * Math.PI)) ** (1/3);

const asteroids = [];

asteroids.push(planet);

for(let i = 0 ; i < 300 ; i++) {

    var asteroid = {
        position : { x : 0, y : 0 },
        velocity : { x : 0, y : 0 },
        force : { x : 0, y : 0 },
        angle : rnd(0, 2 * Math.PI),
        angleVec : { x : 1, y : 0 },
        angularVelocity : rnd(-0.2, 0.2),
        torque : 0,
        mass : rnd(1, 10),
        radius : 0,
        momentOfInertia : 100.0,
        image : getRandomInt(0, 2)
    };

    let dist = rnd(4000, 7000);
    let angle = rnd(0, 2 * Math.PI);
    let px = dist * Math.cos(angle);
    let py = dist * Math.sin(angle);
    let v = Math.sqrt( (G * (asteroid.mass + planet.mass) ) / dist );
    let vx = -Math.sin(angle) * v;
    let vy =  Math.cos(angle) * v;

    asteroid.position.x = px;
    asteroid.position.y = py;

    asteroid.velocity.x = vx;
    asteroid.velocity.y = vy;

    asteroid.radius = ((3 * asteroid.mass / 0.00001)/(4 * Math.PI)) ** (1/3);

    asteroids.push(asteroid);
};

asteroids.push(spaceship);


const images = [];

var img1 = new Image();
img1.src = 'img/asteroid01.png';

var img2 = new Image();
img2.src = 'img/asteroid02.png';

var img3 = new Image();
img3.src = 'img/asteroid03.png';

var img4 = new Image();
img4.src = 'img/cartoon-rocket.png';

images.push(img1);
images.push(img2);
images.push(img3);
images.push(img4);

function drawBalls() {

    ctx.resetTransform();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let i = 0 ; i < asteroids.length ; i++) {
        
        var img = images[asteroids[i].image];

        ctx.setTransform(1, 0, 0, 1, (asteroids[i].position.x - cx) * zoom + canvas.width/2, (asteroids[i].position.y - cy) * zoom + canvas.height/2);
        ctx.beginPath();
        ctx.arc(0, 0, asteroids[i].radius * zoom, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD22";
        ctx.fill();
        ctx.closePath();
    }

    for(let i = 0 ; i < asteroids.length-1 ; i++) {
        
        var img = images[asteroids[i].image];
        ctx.setTransform(1, 0, 0, 1, (asteroids[i].position.x - cx) * zoom + canvas.width/2, (asteroids[i].position.y - cy) * zoom + canvas.height/2);
        ctx.rotate(asteroids[i].angle + 0.25 * 2 * Math.PI);
        ctx.drawImage(img, -asteroids[i].radius * zoom, -asteroids[i].radius * zoom, asteroids[i].radius*2 * zoom, asteroids[i].radius*2 * zoom);
    }

    var img = images[spaceship.image];
    ctx.setTransform(1, 0, 0, 1, (spaceship.position.x - cx) * zoom + canvas.width/2, (spaceship.position.y - cy) * zoom + canvas.height/2);
    ctx.rotate(spaceship.angle + 0.25 * 2 * Math.PI);
    ctx.drawImage(img, -spaceship.radius * zoom, -spaceship.radius*2 * zoom, spaceship.radius*2 * zoom, spaceship.radius*4 * zoom);

    ctx.resetTransform();

    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(zoom, 50, 50);
}

//
function mainLoop() {

    if (gameKeyState.a == true) {spaceship.angle -= 0.04; spaceship.angleVec.x = Math.cos(spaceship.angle ); spaceship.angleVec.y = Math.sin(spaceship.angle );}
    if (gameKeyState.d == true) {spaceship.angle += 0.04; spaceship.angleVec.x = Math.cos(spaceship.angle ); spaceship.angleVec.y = Math.sin(spaceship.angle ); }
    if (gameKeyState.w == true) {spaceship.force.x += 1000 * spaceship.angleVec.x; spaceship.force.y += 1000 * spaceship.angleVec.y;}
    if (gameKeyState.s == true) { }

    update();

    cx = spaceship.position.x
    cy = spaceship.position.y

    if(gameKeyState.ArrowUp)    {cy -= (screen.height/4) / zoom}
    if(gameKeyState.ArrowDown)  {cy += (screen.height/4) / zoom}
    if(gameKeyState.ArrowLeft)  {cx -= (screen.width/4)  / zoom}
    if(gameKeyState.ArrowRight) {cx += (screen.width/4)  / zoom}
    if(gameKeyState.q) { zoom /= (1.0 + dZoom); if(zoom > maxZoom) {zoom = maxZoom}; if(zoom < minZoom) {zoom = minZoom} }
    if(gameKeyState.e) { zoom *= (1.0 + dZoom); if(zoom > maxZoom) {zoom = maxZoom}; if(zoom < minZoom) {zoom = minZoom} }

    //cx = spaceship.position.x + (mx - screen.width/2) / zoom;
    //cy = spaceship.position.y + (my - screen.height/2) / zoom;

    requestAnimationFrame(drawBalls);
}

function update()
{

    for(let i = 0 ; i < asteroids.length-1 ; i++) {

        for(let j = i+1 ; j < asteroids.length ; j++ ) {

            let rx = asteroids[j].position.x - asteroids[i].position.x;
            let ry = asteroids[j].position.y - asteroids[i].position.y;

            let rSum = asteroids[i].radius + asteroids[j].radius;

            //if ((Math.abs(rx) < rSum) || (Math.abs(ry) < rSum) ) { continue; }

            let r2 = rx*rx+ry*ry;

            if (r2 < rSum*rSum) { continue; }

            let r = Math.sqrt(r2);
            let f = G * (asteroids[i].mass * asteroids[j].mass) / r2;

            asteroids[i].force.x += f * (rx / r);
            asteroids[i].force.y += f * (ry / r);

            asteroids[j].force.x -= f * (rx / r);
            asteroids[j].force.y -= f * (ry / r);
        };
    };

    for(let i = 0 ; i < asteroids.length ; i++) {

        //
        asteroids[i].velocity.x += asteroids[i].force.x / asteroids[i].mass * dt;
        asteroids[i].velocity.y += asteroids[i].force.y / asteroids[i].mass * dt;

        asteroids[i].position.x += asteroids[i].velocity.x * dt;
        asteroids[i].position.y += asteroids[i].velocity.y * dt;

        asteroids[i].force.x = 0;
        asteroids[i].force.y = 0;

        //
        asteroids[i].angularVelocity += asteroids[i].torque / asteroids[i].momentOfInertia * dt;

        asteroids[i].angle += asteroids[i].angularVelocity * dt;

        //asteroids[i].angleVec.x = Math.cos(asteroids[i].angle ); 
        //asteroids[i].angleVec.y = Math.sin(asteroids[i].angle );

        asteroids[i].torque = 0;

    };

}

// run loop
setInterval(mainLoop, 10);