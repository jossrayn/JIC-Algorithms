import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
declare var getTable: any; // just change here from arun answer.
@Component({
  selector: 'app-reemplazo',
  templateUrl: './reemplazo.component.html',
  styleUrls: ['./reemplazo.component.css']
})
export class ReemplazoComponent implements OnInit {
  deadline:number;
  equipLife:number;
  equipCost:number;
  gain:number;
  list: Array<Array<number>>;
  optPath: Array<number[]>;
  path: Array<Array<number>>;
  listResult:Array<String>;
  visible: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  /*
  metodo encargado de generar la tabla que recibe los datos iniciales del problema
  numero ano | costo mantenimiento | costo de reventa
  */ 
  createTableItems(){
    var valPlazo = document.getElementById('txtPlazo') as HTMLInputElement; // size de la tabla
    var valVida = document.getElementById('txtVidautil') as HTMLInputElement;
    var valCosto = document.getElementById('txtCosto') as HTMLInputElement;
    var valGanancia = document.getElementById("txtGanancia") as HTMLInputElement;

    if( Number(valPlazo.value) > 0 && Number(valVida.value) > 0  && Number(valCosto.value) > 0){
      this.deadline = Number(valPlazo.value);
      this.equipLife = Number(valVida.value);
      this.equipCost = Number(valCosto.value);
      if(Number(valGanancia.value) > 0){
        this.gain = Number(valGanancia.value);
      }
      else{
        this.gain = 0;
      }
      console.log(this.gain);
      sessionStorage.setItem('TableSize', String(this.equipLife));
      var table = document.getElementById('tablaDatos') as HTMLTableElement;
      var tableResultado = document.getElementById('tablaResultados') as HTMLTableElement;
      var tablePaths = document.getElementById('tablaRutas') as HTMLTableElement;
      this.list = new Array();
      var rowCount = table.rows.length;
      for (var i = 1; i < rowCount; i++) {
        table.deleteRow(1);
      }
      var rowCount = tableResultado.rows.length;
      for (var i = 1; i < rowCount; i++) {
        tableResultado.deleteRow(1);
      }
      var rowCount = tablePaths.rows.length;
      for (var i = 1; i < rowCount; i++) {
        tablePaths.deleteRow(1);
      }
      this.visible = false;
      for(var i = 0 ; i < this.equipLife; i++){
        let temp: Array<number> = new Array();
        temp.push(i+1); 
        var tr = document.createElement('tr');
        for(var j = 0 ; j < 3 ; j++){
          temp.push(0);
          var td = document.createElement('td');
          td.setAttribute('contenteditable','true');
          td.setAttribute('onkeypress',"javascript:return isNumber(event)");
          if(j == 0){
            td.innerHTML = String(i+1);
            td.setAttribute('contenteditable','false');
          }
          else{
            td.innerHTML = " ";
          }
          td.style.textAlign = "center;"
          td.style.border = "1 solid black;"
          tr.appendChild(td); 
        }
        this.list.push(temp);
        table.appendChild(tr);  
      }
      table.style.visibility = "visible";
    }
    else{
      alert('Por favor, no deje espacios en blanco.');
    }
  }

/**
 * funcion encargada de realizar el calculo del costo por ano
 * segun la vida util del equipo
 */
  calculateCost(){
    var valPlazo = document.getElementById('txtPlazo') as HTMLInputElement; // size de la tabla
    var valVida = document.getElementById('txtVidautil') as HTMLInputElement;
    var valCosto = document.getElementById('txtCosto') as HTMLInputElement;
    var valGanancia = document.getElementById("txtGanancia") as HTMLInputElement;

    if( Number(valPlazo.value) > 0 && Number(valVida.value) > 0  && Number(valCosto.value) > 0){
      this.deadline = Number(valPlazo.value);
      this.equipLife = Number(valVida.value);
      this.equipCost = Number(valCosto.value);
      if(Number(valGanancia.value) > 0){
        this.gain = Number(valGanancia.value);
      }
      else{
        this.gain = 0;
      }
      console.log(this.gain);
      sessionStorage.setItem('TableSize', String(this.equipLife));
    }


    let dataCost: Array<number> = new Array();
    var tableData = this.getTable('tablaDatos');
    var counter:number = 1;
    var cost:number = 0;
    for(var i = 0; i < counter; i++){
        if(i == this.equipLife){
          break;
        }
        else{

          var sale:number = tableData[i][1];
          var fixed:number = 0;
          for(var j = 0; j < counter; j++){
            fixed += tableData[j][0];
          }
          cost = this.equipCost + fixed - sale - this.gain;
        }
        console.log("Cost = " + cost);
        dataCost.push(cost);
        counter++;
    }
    this.getMinList(dataCost)
  }

  getMinList(cost){
    let minList: Array<number> = new Array();
    let paths: Array<Array<number>> = new Array();
    for(var t = this.deadline;t >= 0;t--){
      if(t == this.deadline){
        minList.push(0);
        paths.push([0]);
      }
      else{
        var minValue:number = 0;
        var newValue:number = 0;
        let path: Array<number> = new Array();
        var temp:number = t + this.equipLife;
        if(temp > this.deadline){
          temp = this.deadline;
        }
        var tValue:number = t;
        while(tValue < temp){
          if(minValue == 0){
            minValue = cost[temp-tValue-1] + minList[this.deadline - temp];
            path = [temp];
          }
          else{
            newValue = cost[temp-tValue-1] + minList[this.deadline - temp];
            if(minValue > newValue){
              minValue = newValue;
              path = [temp];
            }
            else if(newValue == minValue){
              path.push(temp);
            }
          }
          temp--;
        }
        minList.push(minValue);
        paths.push(path);
      }

    }
    
    paths = this.fixedPaths(paths);
    minList = this.fixedMin(minList);
    this.createPlanTable(paths,minList);
    this.path = paths;
    this.optPath = new Array();
    this.Routes([0]);
    this.showPaths();
  }

  showPaths(){
    this.listResult = new Array();
    for(var j = 0; j < this.optPath.length;j++){
      var temp:String = "";
      for(var i = 0; i<this.optPath[j].length;i++){
        if( i == this.optPath[j].length - 1){
          temp += String(this.optPath[j][i]);
        }
        else{
          temp += String(this.optPath[j][i]) + "→";
        }
      }
      this.listResult.push(temp);
      
    }
    sessionStorage.setItem('TableSize', String(this.listResult.length));
    var table = document.getElementById('tablaRutas') as HTMLTableElement;
    for(var i = 0 ; i <= this.listResult.length - 1; i++){
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      td.setAttribute('contenteditable','false');
      td.innerHTML += String(this.listResult[i]);
      td.style.textAlign = "center;"
      td.style.border = "1 solid black;"
      tr.appendChild(td); 
      table.appendChild(tr);  
    }
    this.visible = true;
  }

  /**
   * metodo encargado de invertir la lista de las rutas para ser presentada en la tabla de resultado
   * @param paths 
   */
  fixedPaths(paths){
    var limit:number = this.deadline;
    var counter:number = 0;
    let result: Array<Array<number>> = new Array();
    while(counter <= limit){
      var temp:number = 0;
      let path: Array<number> = new Array();
      while(temp<paths[limit].length ){
        path.push(paths[limit][temp]);
        temp++;
      }
      limit--;
      result.push(path);
    }
    return result;
  }

  /**
   * metodo encargado de invertir la lista de valores minimos para que queden de forma que se puedan mostrar en la tabla
   * @param min 
   */
  fixedMin(min){
    var limit:number = this.deadline;
    var counter:number = 0;
    let result: Array<number> = new Array();
    while(counter <= limit){
        result.push(min[limit]);
        limit--;
      }
    return result;
  }

/**
 * metodo que muestra la tabla con el plan de reemplazo calculado
 * no determina los optimos
 * @param paths 
 * @param minList 
 */
  createPlanTable(paths,minList){
    sessionStorage.setItem('TableSize', String(this.deadline));
    var table = document.getElementById('tablaResultados') as HTMLTableElement;
    for(var i = 0 ; i <= this.deadline; i++){
      var tr = document.createElement('tr');
      for(var j = 0 ; j < 3 ; j++){
        var td = document.createElement('td');
        td.setAttribute('contenteditable','false');
        td.setAttribute('onkeypress',"javascript:return isNumber(event)");
        if(j == 0){
          td.style.background = "black";
          td.style.color = "white";
          td.innerHTML = String(i);
        }
        else if(j == 1){
          td.innerHTML = String(minList[i]);
        }
        else{
          if (i == this.deadline){
            td.innerHTML = "-";
          }
          else{
            td.innerHTML = String(paths[i]);
          }
        }
        td.style.textAlign = "center;"
        td.style.border = "1 solid black;"
        tr.appendChild(td); 
      }
      table.appendChild(tr);  
    }
    table.style.visibility = "visible ";
  }


  Routes(currentList:number[]){
    var current = currentList[currentList.length-1];
    if(current == this.deadline){
      this.optPath.push(currentList);
    }
    else{
      for(var i = 0;i<this.path[current].length;i++){
        var media = currentList;
        media = media.concat([this.path[current][i]]);
        this.Routes(media);
      }
    }
  }

  

  /*
  funcion encargada de obtener los datos de la tabla
  y almacenarlos en un arreglo
  */ 
  getTable(tableId){
		var table = document.getElementById(tableId) as HTMLTableElement;
		var data = [];
		for (var r = 1; r < table.rows.length; r++){
			var row = table.rows[r];
			var cells = row.cells;
			var temp = [];
			for (var c = 1; c < cells.length; c++){
				var cell = cells[c];
				var inputElem = cell.innerHTML;
				if(r != c && inputElem === "0" || inputElem === "" || inputElem === "∞"){
					temp.push(0);
				}
				else{
					temp.push(Number(inputElem));
				}
			}
			data.push(temp);
		}
		return data;
  }
  
  saveData(){
    var table = document.getElementById('tablaDatos') as HTMLTableElement;
    var data =  this.getTable('tablaDatos');
    var rowCount = table.rows.length;
		if(rowCount < 1){
			alert("No tiene datos que almacenar");
		}
		else{
      var file = "<?xml version="+'"1.0"'+" encoding="+'"UTF-8"'+"?>";
      file += "\n<reemplazo>";
      var plazo = "\n\t<plazo>"+this.deadline+"</plazo>"
      var vidaUtil = "\n\t<vida_util>"+this.equipLife+"</vida_util>";
      var costo = "\n\t<costo_compra>"+this.equipCost+"</costo_compra>";
      var ganancia = "\n\t<ganancia>"+this.gain+"</ganancia>";
      var format = "\n\t<modelo>";
      for(var i = 0; i < data.length; i++){
        format += "\n\t\t<periodo>"+"\n\t\t\t<año>" +i+"</año>" +"\n\t\t\t<mantenimiento>"+data[i][0]+"</mantenimiento>"+"\n\t\t\t<reventa>"+data[i][1]+"</reventa>"+"\n\t\t</periodo>";
      }
      format += "\n\t</modelo>";
      file += plazo + vidaUtil + costo + ganancia + format;
			file += "\n</reemplazo>";
			var blob  = new Blob([file],{type: "text/xml;charset=utf-8"});
			saveAs(blob, "Reemplazo.xml");
		  }
  }

  onFileSelected(event){
    var fileName: string = event.target.files[0].name;
    console.log(fileName);
    let dead = this.deadline;
    let equip =this.equipLife;
    let cost1 =this.equipCost;
    let gan = this.gain;
      sessionStorage.setItem('TableSize', String(this.equipLife));
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
        console.log(xmlDoc);
        var root = xmlDoc.getElementsByTagName("reemplazo");
        var deadline = +root[0].children[0].textContent;
        var equipLife = +root[0].children[2].textContent;
        var equipCost = +root[0].children[1].textContent;
        var gain = +root[0].children[3].textContent;
        var table = document.getElementById('tablaDatos') as HTMLTableElement;
        var plazo = document.getElementById('txtPlazo') as HTMLInputElement;
        var vida = document.getElementById('txtCosto') as HTMLInputElement;
        var costo = document.getElementById('txtVidautil') as HTMLInputElement;
        var ganancia = document.getElementById('txtGanancia') as HTMLInputElement;
        plazo.value = String(deadline);
        vida.value = String(equipLife);
        costo.value = String(equipCost);
        ganancia.value = String(gain);
        equip =equipLife;
        if( Number(plazo.value) > 0 && Number(vida.value) > 0  && Number(costo.value) > 0){
          dead = Number(plazo.value);
          equip = Number(vida.value);
          cost1 = Number(costo.value);
          if(Number(ganancia.value) > 0){
            gan = Number(ganancia.value);
          }
          else{
            gan = 0;
          }
        }
        for(var i =0; i< root[0].children[4].childElementCount;i++){
              let temp: Array<number> = new Array();
             // temp.push(i+1); 
              var tr = document.createElement('tr');
             // temp.push(0);

              var td = document.createElement('td');
              td.innerHTML = String(root[0].children[4].children[i].children[0].textContent);
              td.setAttribute('contenteditable','false');
              td.style.textAlign = "center;";
              td.style.border = "1 solid black;";
              tr.appendChild(td);               
              
              var td1 = document.createElement('td');
              td1.innerHTML = String(root[0].children[4].children[i].children[1].textContent);
              td1.setAttribute('contenteditable','true');
              td1.setAttribute('onkeypress',"javascript:return isNumber(event)");
              td1.style.textAlign = "center;";
              td1.style.border = "1 solid black;";
              tr.appendChild(td1); 

              var td2 = document.createElement('td');
              td2.innerHTML = String(root[0].children[4].children[i].children[2].textContent);
              td2.setAttribute('contenteditable','true');
              td2.setAttribute('onkeypress',"javascript:return isNumber(event)");
              td2.style.textAlign = "center;";
              td2.style.border = "1 solid black;";
              tr.appendChild(td2); 

              //list.push(temp);
              table.appendChild(tr); 
          }
          table.style.visibility = "visible ";
          sessionStorage.setItem('TableSize', String(equip));
        }
      };
    }
 
}

  
