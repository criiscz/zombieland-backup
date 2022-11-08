class Bullet {
  constructor(
    public x: number,
    public y: number,
    public angle: number,
    public speed: number,
    public damage: number,
    public ownerID: number,
    public id: number
  ) {}

  public update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }
}

export { Bullet };
