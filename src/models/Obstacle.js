class Obstacle{
    constructor(x, y, width, height, context){
        this.position = new Vector(x, y);
        this.context = context;
        this.width = width;
        this.height = height;
    }
    
    draw = () => {
        this.context.fillStyle = 'red';
        this.context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}