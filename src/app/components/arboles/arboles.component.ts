import { Component, OnInit } from '@angular/core';
import { Arboles_Algoritmo } from 'src/assets/Models/Arboles_Algoritmo';
import { FormsModule } from '@angular/forms';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-arboles',
  templateUrl: './arboles.component.html',
  styleUrls: ['./arboles.component.css']
})
export class ArbolesComponent implements OnInit {
  arbol:Arboles_Algoritmo = new Arboles_Algoritmo();
  displayTable:boolean = false;
  constructor() { }

  ngOnInit() {
    this.arbol.nodes = [{key:"Harrison", p:0.18},
      {key:"McCartney", p: 0.39},
      {key:"Starr", p:0.11},
      {key:"Lennon", p: 0.32}];
    this.arbol.size = 4;
  }

  autoTransform(p,index){
    if((p  % 1) == 0){
      p = p/100;
      this.arbol.nodes[index].p = p;
    }
  }

  onSubmit(){
    this.displayTable = true;
    console.log(this.arbol);
    this.arbol.calc();
    console.log(this.arbol.nodes);
    this.displayTables();
  }

  backevent(){
    this.displayTable = false;
  }

  displayTables(){
    var tblA = document.getElementById('TableA');
    var tblR = document.getElementById('TableR');
    tblA.innerHTML = "";
    tblR.innerHTML = "";
    var tableA = this.arbol.tableA;
    var tableR = this.arbol.tableR;
    for(let i = 0; i <= tableA.length; i++){
      var trA = document.createElement('tr');
      var trR = document.createElement('tr');
      for(let j = 0; j <= tableA.length; j++){
        var tdA = document.createElement('td');
        var tdR = document.createElement('td');
        if(i === 0 && j === 0){
          tdA.innerHTML = "";
          tdR.innerHTML = "";
        }
        else if(i === 0){
          tdA.innerHTML = ""+(j-1);
          tdR.innerHTML = ""+j;
        }
        else if(j === 0){
          tdA.innerHTML = ""+i;
          tdR.innerHTML = ""+i;
        }
        else{
          tdA.innerHTML = tableA[i-1][j-1].toString();
          tdR.innerHTML = tableR[i-1][j-1].toString();
        }
        trA.appendChild(tdA);
        trR.appendChild(tdR);
      }
      tblA.appendChild(trA);
      tblR.appendChild(trR);
    }
  }

  genNodes(event){
    var key = +event.key;
    this.arbol.nodes = [];
    if(!isNaN(key)){
      for(var i = 0; i < key; i++){
        this.arbol.nodes.push({key:"Key"+i, p:null});
      }
    }
    else{
    }
  }

  onFileSelected(event){
    var fileName: string = event.target.files[0].name;
    console.log(fileName);
    if(fileName.split(".")[1] === "xml"){
      var arbol = this.arbol;
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
        var root = xmlDoc.getElementsByTagName("Arbol");
        arbol.size = +root[0].children[0].textContent;
        arbol.nodes = [];
        for(let i = 0; i < root[0].children[1].children.length; i++){
          const key = root[0].children[1].children[i].children[0].innerHTML;
          const p = (root[0].children[1].children[i].children[1].innerHTML);
          arbol.nodes.push({key:key ,p: +p});
        }
      };
    }
    else{
      alert('Tipo de archivo incorrecto, debe ser .xml');
    }
  }

  saveData(){
		var tableSize:number = Number(sessionStorage.getItem('TableSize'));
		if(this.arbol.isEmpty()){
			alert("Debe llenar el formulario");
		}
		else{
      var file = "<?xml version="+'"1.0"'+" encoding="+'"UTF-8"'+"?>";
      file += "\n<Arbol>";
      var size = "\n\t<size>"+this.arbol.size+"</size>";
      var nodes = "\n\t<Nodes>";
      for(var i = 0; i < this.arbol.nodes.length; i++){
        nodes += "\n\t\t<Node>"+"\n\t\t\t<Key>"+this.arbol.nodes[i].key+"</Key>"+"\n\t\t\t<p>"+this.arbol.nodes[i].p+"</p>"+"\n\t\t</Node>";
      }
      nodes += "\n\t</Nodes>";
      file += size + nodes;
			file += "\n</Arbol>";
			var blob  = new Blob([file],{type: "text/xml;charset=utf-8"});
			saveAs(blob, "Arbol.xml");
		  }
	}

}
