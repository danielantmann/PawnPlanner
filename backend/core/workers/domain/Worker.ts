export class Worker {
  constructor(
    public id: number | null,
    public userId: number,
    public name: string,
    public phone?: string,
    public isActive: boolean = true,
    public maxSimultaneous: number | null | undefined = null
  ) {}
}
