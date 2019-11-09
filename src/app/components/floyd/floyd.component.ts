import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-floyd',
  templateUrl: './floyd.component.html',
  styleUrls: ['./floyd.component.css']
})
export class FloydComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
/*
	Entradas:
	Salida:
	Descripcion:
	*/
	saveTable(){
		var tableSize:number = Number(sessionStorage.getItem('TableSize'));
		var table = document.getElementById('tablaD');
		var file = "<?xml version="+'"1.0"'+" encoding="+'"UTF-8"'+"?>";
		var size = "\n\t<size>"+tableSize+"</size>";
		if(table.childElementCount === 0){
			alert("Debe crear o cargar una tabla");
		}
		else{
			var name = this.getTableNames();
			var d0 = this.getTable('tablaD');
			var nodes = "\n\t<nodes>";
			for(var i = 0; i < tableSize; i++){
				var node = "\n\t\t<node>"+name[i+1]+"</node>";
				nodes += node;
			}
			nodes += "\n\t</nodes>";
			file += "\n<table>"+size+nodes;
			for(var i = 0; i < tableSize; i++)
			{
				var rows = "\n\t<tr>";
				for(var j = 0; j < tableSize; j++)
				{
					var cell = "\n\t\t<td>"+d0[i][j]+"</td>";
					rows += cell;
				}
				rows += "\n\t</tr>";
				file += rows;
			}
			file += "\n</table>";
			var blob  = new Blob([file],{type: "text/xml;charset=utf-8"})
			saveAs(blob, "d0.xml");
			console.log(file);
		  }
	}

	/*
	Entradas: ninguna
	Salida: nombre de los nodos de tabla D(0)
	Descripcion:obtiene nombre de los nodos de tabla D(0)
	*/
	getTableNames(){
	  var table = document.getElementById('tablaD') as HTMLTableElement;
	  var row = table.rows[0];
	  var cells = row.cells;
	  var data = [];
	  for (var c = 0; c < cells.length; c++){
		  var cell = cells[c];
		  var inputElem = cell.innerHTML;
		  data.push(inputElem);
	  }
	  return data;
	}

	/*
	Entradas:
	Salida:
	Descripcion:
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
					temp.push(Infinity);
				}
				else{
					temp.push(Number(inputElem));
				}
			}
			data.push(temp);
		}
		return data;
	}
 

}
