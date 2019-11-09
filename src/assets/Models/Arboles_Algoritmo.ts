export class Arboles_Algoritmo{
  public nodes;
  public tableA;
  public tableR;
  public size;
  constructor()
  constructor(nodes?){
    this.nodes = nodes||[];
    this.tableA = [];
    this.tableR = [];
    this.size = null;
  }

  genTable(m){
  	var table = [];
  	for(var i = 0; i <= m; i++){
  		var row = [];
  		for(var j = 0; j <= m; j++){
  			row.push(0.000);
  		}
  		table.push(row);
  	}
  	return table;
  }

  sortNodes(){
  	return this.nodes.sort(function(a, b) {
      a = a.key.toLowerCase();
      b = b.key.toLowerCase();
      return (a < b) ? -1 : (a > b) ? 1 : 0;
  	});
  }

  isEmpty(){
    if(this.nodes == [] && this.tableA == [] && this.tableR == [] && this.size == null){
      return true;
    }
    return false;
  }

  calc(){
    this.sortNodes();
    this.tableA = this.genTable(this.nodes.length);
    this.tableR = this.genTable(this.nodes.length);
  	for(var gap = 1; gap < this.tableA.length; gap++){
  		for(var i = 0; i < this.tableA.length; i++){
  			if(i+gap < this.tableA.length){
  				var a = 0;
          var kobjets = [];
  				if(gap === 1){
  					a = this.nodes[i].p;
            kobjets.push({k:i+1,p:this.nodes[i].p});
  				}
  				else{
  					var ks = [];
            kobjets = [];
  					for(var k = i; k < i+gap; k++){
  						var a = parseFloat(this.tableA[i][k]) + parseFloat(this.tableA[k+1][i+gap]);
  						var p = 0;
  						for(var k1 = i; k1 < i+gap; k1++){
  							p += this.nodes[k1].p;
  						}
  						ks.push(a+p);
              kobjets.push({k:k+1,p:a+p});
  					}
  					a = Math.min.apply(Math, ks);
  				}
          this.tableR[i][i+gap] = kobjets.find(e => e.p == a).k;
  				this.tableA[i][i+gap] = a.toFixed(2);
  			}
  		}

  	}
  }

}
