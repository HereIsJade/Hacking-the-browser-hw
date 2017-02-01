var pts = [];
var formSize;
var acceleration;
var acceleration_g;
var batteryLevel;

navigator.getBattery().then(function(battery) {
  function updateAllBatteryInfo(){
    updateLevelInfo();
  }
  updateAllBatteryInfo();

  battery.addEventListener('levelchange', function(){
    updateLevelInfo();
  });
  function updateLevelInfo(){
    batteryLevel=battery.level*100;
  }
});


function setup() {
  createCanvas(displayWidth, displayHeight-80);
  smooth();
  frameRate(30);
  rectMode(CENTER);
  background(0);
  formSize=width/3;
  acceleration_g=createVector(0,0,0);
  acceleration=createVector(0,0,0);
  //batteryLevel=0;
  //console.log("bat="+batteryLevel);

  //rect(width/2,height/2,formSize,formSize);

}

function draw() {
  console.log("bat="+batteryLevel);

  if (acceleration_g.x<=(-4)||acceleration_g.x>=4){
    drawPts(batteryLevel,acceleration_g.x);
  }
  else if (acceleration_g.x<=0.8 && acceleration_g.x>= (-0.8)){
    pts=[];
    background(0);
  }


  for(var i=0;i<pts.length;i++){
    pts[i].update(acceleration_g.x);
    pts[i].display();
    if(i==2){
      console.log("life="+pts[2].lifeSpan);
    }

  }

  for (var i=pts.length-1; i>-1; i--) {
    if (pts[i].dead) {
      pts.splice(i,1);
    }
  }
}

window.addEventListener('devicemotion', function(event) {
  acceleration = event.acceleration;
  acceleration_g = event.accelerationIncludingGravity;
});

function drawPts(batteryLevel,agx){
  var amount;
  if(batteryLevel<30){
    amount=5;
  }
  else{
    amount=floor(map(batteryLevel,30,100,5,55));
  }
  for (var j=0;j<amount;j++) {
    var newP = new Particle(random(width/2-formSize/2,width/2+formSize/2), random(height/2-formSize/2,height/2+formSize/2), j+pts.length, j+pts.length,agx);
    pts.push(newP);
  }
}

function Particle(x, y, xOffset, yOffset,agx){
  this.passedLife=0;
  this.dead=false;
  this.loc = new createVector(x,y);
  var randDegrees = random(360);
  this.vel = new createVector(cos(radians(randDegrees)), sin(radians(randDegrees)));
  if(agx<0){
    this.vel.mult(random(-2,0));//vel negative
  }
  else if (agx>0){
    this.vel.mult(random(2));
  }
  // this.vel.mult(random(-2,0));//vel negative
  this.acc = new createVector(0,0);

  if(y<(height/2+formSize/4) && x>(width/2-formSize/4)){
    this.lifeSpan = random(20+width/30, 110+width/30);// may be noise
  }
  else if(y<height/2 && x<width/2){
    this.lifeSpan = random(20, 80+width/30);// may be noise
  }
  else{
    this.lifeSpan = random(0, 20);// may be noise
  }


  this.decay = random(0.55, 0.65);

  this.xOffset = xOffset;
  this.yOffset = yOffset;

  this.update=function(agx){
    if(this.passedLife>=this.lifeSpan){
      this.dead = true;
    }else{
      this.passedLife=this.passedLife+1;
    }

    this.alpha = (this.lifeSpan-this.passedLife)/this.lifeSpan * 70+50;
    this.acc.set(0,0);

    var rn = (noise((this.loc.x+frameCount+this.xOffset)*0.02, (this.loc.y+frameCount+this.yOffset)*0.02)-0.5)*1.5*PI;

    var mag = noise((this.loc.y+frameCount)*0.01, (this.loc.x+frameCount)*0.01);
    var dir = createVector(cos(rn),sin(rn));
    if(agx<0){
      dir.mult(-1);
    }

    this.acc.add(dir);
    this.acc.mult(mag);
    this.vel.add(this.acc);
    this.vel.mult(this.decay);
    this.vel.limit(5);
    this.loc.add(this.vel);
  }

  this.display = function(){
    strokeWeight(1);
    stroke(255, 255,255,this.alpha);

    point(this.loc.x, this.loc.y);

  }
}
