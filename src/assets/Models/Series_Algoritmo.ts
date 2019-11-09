export class Series_Algoritmo{
  public teamA: string;
  public teamB: string;
  public ph: number;
  public pr: number;
  public qr: number;
  public qh: number;
  public games:number;
  public format = [];
  private table: number[][];

  constructor(teamA: string, teamB: string,  ph: number,  pr: number, games:number){
    this.teamA = teamA;
    this.teamB = teamB;
    this.ph = ph;
    this.pr = pr;
    this.qr = 100;
    this.qh = 100;
    this.games = games;
  }

  update(){
    this.ph = +(this.ph/100).toFixed(4);
    this.pr = +(this.pr/100).toFixed(4);
    this.qr = +(1 - this.ph).toFixed(4);
    this.qh = +(1 - this.pr).toFixed(4);
  }

  public calculate(){
    this.genTable0(Math.floor(this.games/2)+1);
    for(var i = 1; i < this.table.length; i++){
  		for(var j = 1; j < this.table.length; j++){
  			var game = this.format.length - ((i-1)+(j-1))-1;
        if(this.format[game].state){
          this.table[i][j] = +this.clacProb(this.pr,this.qh,+this.table[i-1][j],+this.table[i][j-1]).toFixed(4);
  			}
  			else{
  				this.table[i][j] = +this.clacProb(this.ph,this.qr,this.table[i-1][j],this.table[i][j-1]).toFixed(4);
  			}
  		}
  	}
  }

  private clacProb(p: number, q: number, p1: number, p2: number){
	   return p*p1 + q*p2;
  }

  private genTable0(m){
  	this.table = [];
  	for(var i = 0; i <= m; i++){
  		var row = [];
  		for(var j = 0; j <= m; j++){
  			var num: number;
  			if(i === 0 && j > 0){
  				num = 1.000;
  			}
  			else{
  				num = 0.0000;
  			}
  			row.push(+num.toFixed(4));
  		}
  		this.table.push(row);
  	}
  }

  public getTable(){
    return this.table;
  }

  public isEmpty(){
    if(this.teamA === null || this.teamB === null || this.ph === null || this.pr === null || this.games === null){
      return true;
    }
    return false;
  }

}
