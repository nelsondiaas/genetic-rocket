class Rocket{
    constructor(x, y, target, obstacle, context){
        this.canvasBackground = {width: 1200, height: 690};
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.force = new Vector(0, 0);
        this.target = target;
        this.obstacle = obstacle;
        this.context = context;
        this.fitness = 0;
        this.success = false;
        this.death = false;
        this.deathInObstacle = false;
        this.width = 30;
        this.height = 35;
        this.indice = 0;
        this.rocketImg = this.instanceImg('../genetic-rocket/src/assets/img/rocket.png');
        this.explosion = this.instanceImg('../genetic-rocket/src/assets/img/explosion.png');
        this.rocketSuccess = this.instanceImg('../genetic-rocket/src/assets/img/sucess.png');
        this.dna = new Dna(50);
    }

    update = () => {
        if (this.position.x + this.width > this.canvasBackground.width         ||
            this.position.x < 0                                                ||
            this.position.y + this.height > this.canvasBackground.height       ||
            this.position.y < 0) {
            this.death= true;
        }

        if (this.position.x + this.width > this.target.position.x               &&
            this.position.x < this.target.position.x + this.target.width        &&
            this.position.y + this.height > this.target.position.y              &&
            this.position.y < this.target.position.y + this.target.height) {
            this.success = true;
        }

        for (let i=0; i < this.obstacle.length; i++) {
            if (this.position.x + this.width > this.obstacle[i].position.x                  &&
                this.position.x < this.obstacle[i].position.x + this.obstacle[i].width      &&
                this.position.y + this.height > this.obstacle[i].position.y                 &&
                this.position.y < this.obstacle[i].position.y + this.obstacle[i].height) {
                this.deathInObstacle = true;
                this.death= true;
            }
        }

        if (!this.death && !this.success) {
            this.position.add(this.velocity);
            this.velocity.add(this.acceleration);
            this.acceleration.set(this.force);
            this.applyForce(this.dna.genes[this.indice]);
        }
    }

    applyForce = (genes) => {
        this.force.set(genes);
    }
    
    findFitness = () => {
        let distance = this.distanceBetweenTwoPoints(this.position, this.target.position);
        this.fitness = Math.pow(1 / distance, 2);

        if (this.success == true){
            this.fitness *= 2;
        }
        
        if (this.deathInObstacle == true){
            this.fitness *= 0.1;
        }
    }

    addNewDna = (dna) => {
        this.dna = dna;
        return this;
    }

    distanceBetweenTwoPoints = (a, b) => {
        return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    }

    instanceImg = (path) => {
        let img = new Image();
        img.src = path;
        return img;
    }

    draw = () => {
        let angle = this.velocity.getAngle();
        this.context.translate(this.position.x + this.width/2, this.position.y + this.height/2);
        this.context.rotate(-angle);
        this.context.drawImage(this.rocketImg, -this.width/2, -this.height/2, this.height, this.width);
        this.handlersStateRocket();
        this.context.rotate(angle);
        this.context.translate(-this.position.x - this.width/2, -this.position.y - this.height/2);
    }

    handlersStateRocket = () => {
        if (this.success) this.context.drawImage(this.rocketSuccess, -this.width/2, -this.height/2, this.height+10, this.width);
        else if (this.death) this.context.drawImage(this.explosion, -this.width/2, -this.height/2, this.height, this.width);
    }

}