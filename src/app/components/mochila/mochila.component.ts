import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-mochila',
  templateUrl: './mochila.component.html',
  styleUrls: ['./mochila.component.css']
})
export class MochilaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
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
			for (var c = 0; c < cells.length; c++){
				var cell = cells[c];
				var inputElem = cell.innerHTML;
					temp.push(inputElem);
			}
			data.push(temp);
		}
		return data;
	}

  /*
	Entradas:
	Salida:
	Descripcion:
	*/
	saveTable(){
    var di = document.getElementById('txtMochila') as HTMLInputElement;
		var tableSize:number = Number(di.value);
		var table = document.getElementById('tablaObjetos') as HTMLTableElement;
		var file = "<?xml version="+'"1.0"'+" encoding="+'"UTF-8"'+"?>";
		var size = "\n\t<maxweight>"+tableSize+"</maxweight>";
		if(table.childElementCount === 0){
			alert("Debe crear o cargar una tabla");
		}
		else{
			var d0 = this.getTable('tablaObjetos');
			file += "\n<table>"+size;
			for(var i = 0; i < d0.length; i++)
			{
				var rows = "\n\t<tr>";
				for(var j = 0; j < d0[0].length; j++)
				{
					var cell = "\n\t\t<td>"+d0[i][j]+"</td>";
					rows += cell;
				}
				rows += "\n\t</tr>";
				file += rows;
			}
			file += "\n</table>";
			var blob  = new Blob([file],{type: "text/xml;charset=utf-8"})
			saveAs(blob, "moch0.xml");
			console.log(file);
		  }
	}

}
