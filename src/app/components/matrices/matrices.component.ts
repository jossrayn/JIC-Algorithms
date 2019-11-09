import { Component, OnInit } from '@angular/core';


import { saveAs } from 'file-saver';

@Component({
  selector: 'app-matrices',
  templateUrl: './matrices.component.html',
  styleUrls: ['./matrices.component.css']
})
export class MatricesComponent implements OnInit {

  visibleCantidad:boolean = false;
  visibleConfig:boolean = true;
  visibleResult:boolean = true;
  matrixCounter:number = 0;
  listaMatrices:Array<String>;
  listaTamanos:Array<Array<number>>;
  matrizP:Array<Array<any>>;
  matrizResultado:Array<Array<any>>;
  dim:Array<number>;
  optResult:String = "";


  constructor() { }

  ngOnInit() {
  }

  saveData(){
    this.listaTamanos = new Array();
    var colTemp:String;
    this.dim = new Array();
    var condi = 1;
    if(this.listaMatrices.length > 0){
    for (var i = 0; i < this.matrixCounter; i++){
      const filaM = document.getElementById("fila"+ this.listaMatrices[i]) as HTMLInputElement;
      const columnM = document.getElementById("columna"+ this.listaMatrices[i]) as HTMLInputElement;
      if(i == 0){
        colTemp = columnM.value;
        let temp:Array<number> = new Array();
        temp.push(Number(filaM.value));
        temp.push(Number(columnM.value));
        this.listaTamanos.push(temp);
        this.dim.push(Number(filaM.value));
      }
      else{
        if(filaM.value == colTemp){
          colTemp = columnM.value;
          let temp:Array<number> = new Array();
          temp.push(Number(filaM.value));
          temp.push(Number(columnM.value));
          this.listaTamanos.push(temp);
          if (i < this.matrixCounter - 1){
            this.dim.push(Number(filaM.value));
            
          }
          else{
            this.dim.push(Number(filaM.value));
            this.dim.push(Number(columnM.value));
          }
          
        }
        else{
          filaM.value = "";
          alert("El valor de la fila de la Matriz "+ (i) + " no coincide con el valor de la columna de la Matriz "+(i-1)+".");
          condi = 0;
          break;
        }
      }
    }
  }else{
    condi = 0;      
  }
    if(condi == 1){
      var file = "<?xml version="+'"1.0"'+" encoding="+'"UTF-8"'+"?>";
      file += "\n<multi_matrices>";
      var format = "\n\t<matrices>";
      for(var i = 0; i < this.matrixCounter; i++){
        format += "\n\t\t<matriz>";
        format += "\n\t\t\t<nombre>" +this.listaMatrices[i]+"</nombre>" +"\n\t\t\t<filas>"+this.listaTamanos[i][0]+"</filas>"+"\n\t\t\t<columnas>"+this.listaTamanos[i][1]+"</columnas>";
        format +="\n\t\t</matriz>";
      }
      format += "\n\t</matrices>";
      file += format;
			file += "\n</multi_matrices>";
			var blob  = new Blob([file],{type: "text/xml;charset=utf-8"});
			saveAs(blob, "MultiMatrices.xml");
    }else{
      alert("las matrices deben ser generadas");
    }		  
  }


  onFileSelected(event){
    var fileName: string = event.target.files[0].name;
    let lista = this.listaMatrices;
    let tamanos = this.listaTamanos;
    tamanos =  new Array();
    lista = new Array();
    this.matrixCounter = 0;
    if(fileName.split(".")[1] === "xml"){

      var fileURL = URL.createObjectURL(event.target.files[0]);
  		var req = new XMLHttpRequest();
  		req.open('GET', fileURL);
      req.onerror = function() {
  		    URL.revokeObjectURL(fileURL);
  		};
  		req.send();
  		req.onload = function(){
        
        URL.revokeObjectURL(fileURL);
        var xmlDoc = this.responseXML;
        var root = xmlDoc.getElementsByTagName("multi_matrices");
        const counter = document.getElementById("txtCounter") as HTMLInputElement;
        counter.value = String(root[0].children[0].childElementCount);
        sessionStorage.setItem('TableSize', String(root[0].children[0].childElementCount));
        
        for(var i =0; i< root[0].children[0].childElementCount;i++){
              lista.push(root[0].children[0].children[i].children[0].textContent);
              let temp:Array<number> = new Array();
              temp.push(Number(root[0].children[0].children[i].children[1].textContent));
              temp.push(Number(root[0].children[0].children[i].children[2].textContent));
              tamanos.push(temp);             
          }
          sessionStorage.setItem('listaTamanos', JSON.stringify(tamanos));



        }
      };
      this.listaMatrices = lista;
      this.listaTamanos = tamanos;
      this.llenarTxt();
    }

    llenarTxt(){
      this.condicion =1;/// aaaaaaaaaaaaaaaaaaaa
      this.matrixCounter = Number(sessionStorage.getItem('TableSize'));
      this.guardarTamano();
      this.listaTamanos= JSON.parse(sessionStorage.getItem('listaTamanos'));
    }
    convertir(a){
      return Number(a);
    }




/**
 * 
 */
condicion:number = 0;
  guardarTamano(){
    if(this.condicion == 1){
      this.matrixCounter = Number(sessionStorage.getItem('TableSize'));
      this.condicion =0;
    }
    
    if(this.matrixCounter > 1){
      this.matrizResultado = new Array();
      this.matrizP = new Array();
      this.listaMatrices = new Array();
      this.listaTamanos = new Array();
      for(var i = 0;i < this.matrixCounter; i++){
        this.listaMatrices.push("A"+ String(i));
        let temp:Array<any> = new Array();
        let tempP:Array<any> = new Array();
        let temp1:Array<number> = new Array();
        temp1.push(0);
        temp1.push(0);
        this.listaTamanos.push(temp1);
        for(var j = 0;j < this.matrixCounter; j++){
          temp.push(0);
          tempP.push(0);
        }
        this.matrizResultado.push(temp);
        this.matrizP.push(tempP);
      }

      this.visibleConfig = false;
      this.visibleCantidad = true;
    }
    else{
      alert("Ingrese una cantidad de matrices válida");
    }
  }
/**
 * 
 */
  volver(){
    this.visibleCantidad = false;
    this.visibleConfig = true
    this.matrixCounter = 0;
  }

  volverConfig(){
    this.visibleConfig = false;
    this.visibleResult = true;
    this.listaTamanos = new Array();
    this.dim = new Array();
  }
  

  /**
   * almacenar el tamano de las matrices
   */
  guardarTamanos(){
    this.listaTamanos = new Array();
    var colTemp:String;
    this.dim = new Array();
    var condi = 1;
    if(this.listaMatrices.length > 0){
    for (var i = 0; i < this.matrixCounter; i++){
      const filaM = document.getElementById("fila"+ this.listaMatrices[i]) as HTMLInputElement;
      const columnM = document.getElementById("columna"+ this.listaMatrices[i]) as HTMLInputElement;
      if(i == 0){
        colTemp = columnM.value;
        let temp:Array<number> = new Array();
        temp.push(Number(filaM.value));
        temp.push(Number(columnM.value));
        this.listaTamanos.push(temp);
        this.dim.push(Number(filaM.value));
      }
      else{
        if(filaM.value == colTemp){
          colTemp = columnM.value;
          let temp:Array<number> = new Array();
          temp.push(Number(filaM.value));
          temp.push(Number(columnM.value));
          this.listaTamanos.push(temp);
          if (i < this.matrixCounter - 1){
            this.dim.push(Number(filaM.value));
            
          }
          else{
            this.dim.push(Number(filaM.value));
            this.dim.push(Number(columnM.value));
          }
          
        }
        else{
          filaM.value = "";
          alert("El valor de la fila de la Matriz "+ (i) + " no coincide con el valor de la columna de la Matriz "+(i-1)+".");
          condi = 0;
          break;
        }
      }
    }
  }else{
    condi = 0;      
  }
  if(condi == 1){
    this.visibleConfig = true;
    this.visibleResult = false;
    this.calcularMatriz();
  }
    
  }

  dibujarMatrices(){
    const tableD = document.getElementById("tablaD") as HTMLTableElement;
    const tableP = document.getElementById("tablaP") as HTMLTableElement;
    var rowCountD = tableD.rows.length;
    if(rowCountD > 0){
      for(var i = 0;i <= this.matrixCounter; i++){
        tableD.deleteRow(0);
        tableP.deleteRow(0);
      }
    }
    for(var i = 0;i <= this.matrixCounter; i++){
      var trD = document.createElement('tr');
      var trP = document.createElement('tr');
      for(var j = 0;j <= this.matrixCounter; j++){
        var tdD = document.createElement('td');
        var tdP = document.createElement('td');
        tdD.setAttribute('contenteditable','false');
        if( i == 0 && j == 0){
          tdD.innerHTML = "";
          tdP.innerHTML = "";
        }
        else if(i == j){
          tdD.innerHTML = String(0);
          tdP.style.backgroundColor = "grey";
        }
        else if(i == 0){
          tdD.innerHTML = String(j);
          tdP.innerHTML = String(j);
        }
        else if(j == 0){
          tdD.innerHTML = String(i);
          tdP.innerHTML = String(i);
        }else{
          if(i<j){
            tdD.innerHTML = this.matrizResultado[i-1][j-1];
            tdP.innerHTML = this.matrizP[i-1][j-1];
          }
          else{
            tdD.innerHTML = "";
            tdP.innerHTML = "";
          }
        }
        trD.appendChild(tdD);   
        trP.appendChild(tdP)    
      }
      tableD.appendChild(trD);
      tableP.appendChild(trP);
    }
  }

  calcularMatriz(){
    var loop = 1;
    var line = 0;
    var column = 1;
    while(loop != this.matrixCounter){
      let temp:Array<number> = this.obtenerMin(line,column);
      const var1 = temp[0];
      const var2 = temp[1];
      this.matrizResultado[line][column] = var1;
      this.matrizP[line][column] = var2;
      if(column == this.matrixCounter - 1){
        loop+=1;
        column = loop;
        line = 0;
      }
      else{
        column+=1;
        line+=1;
      }

    }
    this.dibujarMatrices();
    this.optimalMatriz(0,this.matrixCounter - 1);
}

  obtenerMin(row:number,col:number){
  var current = -1;
  var matrixNumber = 0;
  for(var i = row;i<col;i++){
    var probs = 0;
    probs+= this.dim[row] * this.dim[i+1] * this.dim[col+1];
    probs+= this.matrizResultado[row][i];
    probs+= this.matrizResultado[i+1][col];
    if(current != -1){
      if(probs < current){
        current = probs;
        matrixNumber = i+1;
      }
    }
    else{
      current = probs;
      matrixNumber = i+1;
    }
  }
  let temp:Array<number> = new Array();
  temp = [current,matrixNumber]
  return temp;
  }

  optimalMatriz(i,j){
    if(i == j){
      this.optResult += String(this.listaMatrices[i]);
    }
    else{
      this.optResult += "(";
      this.optimalMatriz(i,this.matrizP[i][j]-1);
      this.optimalMatriz(this.matrizP[i][j],j);
      this.optResult += ")";
    }
  }

}


