import { Component, OnInit } from '@angular/core';
import { Series_Algoritmo } from 'src/assets/Models/Series_Algoritmo';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css']
})
export class SeriesComponent implements OnInit {
  model: Series_Algoritmo = new Series_Algoritmo(null,null,null,null,null);
  isCollapsed: boolean = false;
  constructor() {
  }

  ngOnInit() {
  }

  displayGamesButtons(){
    this.model.format = [];
    for(let i = 1; i <= this.model.games;i++){
      this.model.format.push({game:i, state:false});
    }
  }

  changeState(item){
    if(item.state === false){
      item.state = true;
    }
    else{
      item.state = false;
    }
  }

  onSubmit(){
    this.model.update();
    this.model.calculate();
    this.isCollapsed = true;
    this.displayTable();
  }

  displayTable(){
    var tbl = document.getElementById('seriesTable');
    tbl.innerHTML = "";
    var table = this.model.getTable();
    for(let i = 0; i < table.length; i++){
      var tr = document.createElement('tr');
      for(let j = 0; j < table.length; j++){
        var td = document.createElement('td');
        td.innerHTML = table[i][j].toString();
        tr.appendChild(td);
        if(i === j && i === table.length-1){
          td.style.cssText ='background-color: green;';
        }
      }
      tbl.appendChild(tr);
    }
  }

  onFileSelected(event){
    var fileName: string = event.target.files[0].name;
    console.log(fileName);
    if(fileName.split(".")[1] === "xml"){
      var model = this.model;
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
        var root = xmlDoc.getElementsByTagName("serie");
        model.teamA = root[0].children[0].textContent;
        model.teamB = root[0].children[1].textContent;
        model.ph = +root[0].children[2].textContent;
        model.pr = +root[0].children[3].textContent;
        model.games = +root[0].children[4].textContent;
        model.format = [];
        for(let i = 0; i < root[0].children[5].children.length; i++){
          const game = root[0].children[5].children[i].children[0].innerHTML;
          const state = (root[0].children[5].children[i].children[1].textContent=="true");
          model.format.push({game:game ,state: state});
        }
      };
    }
    else{
      alert('Tipo de archivo incorrecto, debe ser .xml');
    }
  }

  backevent(){
    this.isCollapsed = false;
    this.model.ph *= 100;
    this.model.pr *= 100;
  }

  saveData(){
		var tableSize:number = Number(sessionStorage.getItem('TableSize'));
		if(this.model.isEmpty()){
			alert("Debe llenar el formulario");
		}
		else{
      var file = "<?xml version="+'"1.0"'+" encoding="+'"UTF-8"'+"?>";
      file += "\n<serie>";
      var teamA = "\n\t<teamA>"+this.model.teamA+"</teamA>";
      var teamB = "\n\t<teamB>"+this.model.teamB+"</teamB>";
      var ph = "\n\t<ph>"+this.model.ph+"</ph>";
      var pr = "\n\t<pr>"+this.model.pr+"</pr>";
      var games = "\n\t<games>"+this.model.games+"</games>";
      var format = "\n\t<format>";
      for(var i = 0; i < this.model.format.length; i++){
        format += "\n\t\t<object>"+"\n\t\t\t<game>"+this.model.format[i].game+"</game>"+"\n\t\t\t<state>"+this.model.format[i].state+"</state>"+"\n\t\t</object>";
      }
      format += "\n\t</format>";
      file += teamA + teamB + ph + pr + games + format;
			file += "\n</serie>";
			var blob  = new Blob([file],{type: "text/xml;charset=utf-8"});
			saveAs(blob, "Series.xml");
		  }
	}

}
