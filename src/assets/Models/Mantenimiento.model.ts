export class Mantenimiento{
  public Anno: number;
  public Mantenimiento: number;
  public Costo: number;

  constructor(año: number, mantenimiento: number, costo: number){
    this.Anno = año;
    this.Mantenimiento = mantenimiento;
    this.Costo = costo;
  }
}
