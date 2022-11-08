class Enemy {
  constructor(
    public x: number,
    public y: number,
    public speed: number,
    public hp: number,
    public maxHp: number,
    public id: number,
    public name: string,
    public isDead: boolean
  ) {}
}

export { Enemy };
