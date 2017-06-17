var canvas, orbs;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0,0);
    canvas.style("pointer-events","none");
    orbs = [];
    var x = windowWidth/2;
    var y = windowHeight/2;
    var minb = min(windowHeight,windowWidth);
    var rad = 3*minb/8;
    var trt = pow(2,1/12);
    var notes = range(60-24,60+(12*3)+1);
    var rinc = 3*minb/(8*notes.length);
    colorMode(HSB);
    for(var i = 0; i < notes.length; i++){
        var c = color((notes[i]%12)*30,100,100);
        var c = color(0,0,25*(notes[i]%12)/3);
        orbs.push(new Orb(x,y,rad-i*rinc,2000/(i+1),c,midicps(notes[i]),0.1,i));
    }
}

function draw() {
    //clear();
    //noStroke();
    //fill(0,0,0,0.01);
    //rect(0,0,windowWidth,windowHeight);
    for(var i = 0; i < orbs.length; i++){
        orbs[i].step();
    }
    stroke(255);
    strokeWeight(1);
    line(windowWidth/2,0,windowWidth/2,windowHeight/2);
}

function midicps(midi){
    midi -= 69;
    return 440*pow(2,midi/12);
}

function range(a,b=null,step=1){
    if(b==null){
        b = a;
        a = 0;
    }
    var ret = [];
    for(var i = a; i < b; i+=step){
        ret.push(i);
    }
    return ret;
}

class Pluck {
    constructor(freq,amp) {
        this.synth = new p5.TriOsc();
        this.env = new p5.Env();
        this.env.setADSR(0.001,0.2,0.2,0.5);
        this.env.setRange(1,0);
        this.env.mult(amp);
        this.synth.amp(this.env);
        this.synth.freq(freq);
        this.synth.start();
    }

    play(){
        this.env.play(this.synth);
    }
}

class Orb {
    constructor(x,y,rad,fpr,c,freq,amp) {
        this.x = x;
        this.y = y;
        this.rad = rad;
        this.life = 0;
        this.fpr = fpr;
        this.color = c;
        this.pluck = new Pluck(freq,amp);
    }

    get ang(){
        return TWO_PI*this.life/this.fpr;
    }
    get lang(){
        return TWO_PI*(this.life-1)/this.fpr;
    }

    get xpos(){
        return this.x+(this.rad*cos(this.ang-HALF_PI));
    }
    get ypos(){
        return this.y+(this.rad*sin(this.ang-HALF_PI));
    }

    get lxpos(){
        return this.x+(this.rad*cos(this.lang-HALF_PI));
    }
    get lypos(){
        return this.y+(this.rad*sin(this.lang-HALF_PI));
    }

    step() {
        stroke((brightness(this.color)+(50/PI)*this.ang)%100);
        strokeWeight(20);
        line(this.xpos,this.ypos,this.lxpos,this.lypos);
        this.life += 1;
        while(this.life>=this.fpr){
            this.life -= this.fpr;
            this.pluck.play();
        }
    }
}