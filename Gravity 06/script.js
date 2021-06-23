

// Gravitational constant
const G = 1000; 

// Timestep, delta-time
const dt = 1 / 60;

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
    deltaPosition: 0.1,
    zoom: 0.0,
    maxZoom : 10,
    minZoom : 0.1,
    deltaZoom: 0.1,
    zoomSpeed: 0.02,
    restZoom: 1.0,
    input : function(){

        if(gameKeyState.ArrowUp)    {this.restPosition.y -= (screen.height/4) / this.zoom}
        if(gameKeyState.ArrowDown)  {this.restPosition.y += (screen.height/4) / this.zoom}
        if(gameKeyState.ArrowLeft)  {this.restPosition.x -= (screen.width/4)  / this.zoom}
        if(gameKeyState.ArrowRight) {this.restPosition.x += (screen.width/4)  / this.zoom}
        if(gameKeyState.q) { this.restZoom /= (1.0 + this.zoomSpeed); if(this.restZoom < this.minZoom) {this.restZoom = this.minZoom} };
        if(gameKeyState.e) { this.restZoom *= (1.0 + this.zoomSpeed); if(this.restZoom > this.maxZoom) {this.restZoom = this.maxZoom} }; 
    },
    update: function(){  
        
        let zoomDiff = this.restZoom - this.zoom;
        this.zoom += zoomDiff * this.deltaZoom;

        let positionDiffX = this.restPosition.x - this.position.x;
        let positionDiffY = this.restPosition.y - this.position.y;
        this.position.x += positionDiffX * this.deltaPosition;
        this.position.y += positionDiffY * this.deltaPosition;
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

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

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

const objects = [];

objects.push(planet);

for(let i = 0 ; i < 300 ; i++) {

    var asteroid = {
        position : { x : 0, y : 0 },
        velocity : { x : 0, y : 0 },
        force : { x : 0, y : 0 },
        angle : rnd(0, 2 * Math.PI),
        angleVec : { x : 1, y : 0 },
        angularVelocity : rnd(-0.2, 0.2),
        torque : 0,
        mass : rnd(1, 20),
        radius : 0,
        momentOfInertia : 100.0,
        image : getRandomInt(0, 2)
    };

    let dist = rnd(6000, 12000);
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

    objects.push(asteroid);
};

objects.push(spaceship);


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

function renderObjects() {

    // clear screen
    ctx.resetTransform();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // hitbox
    for(let i = 0 ; i < objects.length ; i++) {
        
        var img = images[objects[i].image];

        ctx.setTransform(1, 0, 0, 1, (objects[i].position.x - camera.position.x) * camera.zoom + canvas.width/2, (objects[i].position.y - camera.position.y) * camera.zoom + canvas.height/2);
        ctx.beginPath();
        ctx.arc(0, 0, objects[i].radius * camera.zoom, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD22";
        ctx.fill();
        ctx.closePath();
    }

    // objects
    for(let i = 0 ; i < objects.length-1 ; i++) {
        
        var img = images[objects[i].image];
        var x = (objects[i].position.x - camera.position.x) * camera.zoom + canvas.width/2;
        var y = (objects[i].position.y - camera.position.y) * camera.zoom + canvas.height/2;
        ctx.setTransform(1, 0, 0, 1, x, y);
        ctx.rotate(objects[i].angle + 0.25 * 2 * Math.PI);
        ctx.drawImage(img, -objects[i].radius * camera.zoom, -objects[i].radius * camera.zoom, objects[i].radius*2 * camera.zoom, objects[i].radius*2 * camera.zoom);
    }

    // ship
    var img = images[spaceship.image];
    var x = (spaceship.position.x - camera.position.x) * camera.zoom + canvas.width/2;
    var y = (spaceship.position.y - camera.position.y) * camera.zoom + canvas.height/2;
    ctx.setTransform(1, 0, 0, 1, x, y);
    ctx.rotate(spaceship.angle + 0.25 * 2 * Math.PI);
    ctx.drawImage(img, -spaceship.radius * camera.zoom, -spaceship.radius*2 * camera.zoom, spaceship.radius*2 * camera.zoom, spaceship.radius*4 * camera.zoom);

    // text
    ctx.resetTransform();
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(camera.zoom, 50, 50);
}

//
function mainLoop() {

    if (gameKeyState.a == true) {spaceship.angle -= 0.04; spaceship.angleVec.x = Math.cos(spaceship.angle ); spaceship.angleVec.y = Math.sin(spaceship.angle );}
    if (gameKeyState.d == true) {spaceship.angle += 0.04; spaceship.angleVec.x = Math.cos(spaceship.angle ); spaceship.angleVec.y = Math.sin(spaceship.angle ); }
    if (gameKeyState.w == true) {spaceship.force.x += 1000 * spaceship.angleVec.x; spaceship.force.y += 1000 * spaceship.angleVec.y;}
    if (gameKeyState.s == true) { }

    calculateGravity();
    updateState();

    camera.restPosition.x = spaceship.position.x
    camera.restPosition.y = spaceship.position.y
    
    camera.input();
    camera.update();

    //cx = spaceship.position.x + (mx - screen.width/2) / zoom;
    //cy = spaceship.position.y + (my - screen.height/2) / zoom;

    requestAnimationFrame(renderObjects);
}

function calculateGravity()
{
    for(let i = 0 ; i < objects.length-1 ; i++) {

        for(let j = i+1 ; j < objects.length ; j++ ) {

            // distance vector
            let rx = objects[j].position.x - objects[i].position.x;
            let ry = objects[j].position.y - objects[i].position.y;

            let rSum = objects[i].radius + objects[j].radius;

            //if ((Math.abs(rx) < rSum) || (Math.abs(ry) < rSum) ) { continue; }

            // distance squared
            let r2 = rx*rx+ry*ry;

            if (r2 < rSum*rSum) { continue; }

            // distance scalar
            let r = Math.sqrt(r2);

            // force scalar
            let f = G * (objects[i].mass * objects[j].mass) / r2;

            // force  vector
            let fx = f * rx / r;
            let fy = f * ry / r;

            // apply force
            objects[i].force.x += fx;
            objects[i].force.y += fy;

            objects[j].force.x -= fx;
            objects[j].force.y -= fy;
        };
    };
}

function updateState() {

    for(let i = 0 ; i < objects.length ; i++) {

        //
        objects[i].velocity.x += objects[i].force.x / objects[i].mass * dt;
        objects[i].velocity.y += objects[i].force.y / objects[i].mass * dt;

        objects[i].position.x += objects[i].velocity.x * dt;
        objects[i].position.y += objects[i].velocity.y * dt;

        objects[i].force.x = 0;
        objects[i].force.y = 0;

        //
        objects[i].angularVelocity += objects[i].torque / objects[i].momentOfInertia * dt;

        objects[i].angle += objects[i].angularVelocity * dt;

        //objects[i].angleVec.x = Math.cos(objects[i].angle ); 
        //objects[i].angleVec.y = Math.sin(objects[i].angle );

        objects[i].torque = 0;
    };
}

// run loop
setInterval(mainLoop, 10);