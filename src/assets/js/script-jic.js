
   /**
   * I: clase con la informacion de los objetos de mochila
   * E: nombre,valor,peso, cantidad
   * S: object
   */
class KnapsackItem {

  constructor({name, value, weight, itemsInStock = 1 }) {
    this.name = name;
    this.value = value;
    this.weight = weight;
    this.itemsInStock = itemsInStock;
    // La cantidad real de objetos que se agregaran en la mochila
    this.quantity = 1;
  }

  get totalValue() {
    return this.value * this.quantity;
  }

  get totalWeight() {
    return this.weight * this.quantity;
  }

  //Este coeficiente muestra el valor real de una unidad del objeto actual
  get valuePerWeightRatio() {
    return this.value / this.weight;
  }

  toString() {
    return `v${this.value} w${this.weight} x ${this.quantity}`;//retorna el valor del objeto en string
  }
}


class Comparator {
  constructor(compareFunction) {
    this.compare = compareFunction || Comparator.defaultCompareFunction;
  }
  //comparacion basica, asumiendo que a y b son numeros o strings
  static defaultCompareFunction(a, b) {
    if (a === b) {
      return 0;
    }

    return a < b ? -1 : 1;
  }

  /**
   * I: funcion para determinar si son iguales
   * E: a y b (String o numero)
   * S: booleano
   */
  equal(a, b) {
    return this.compare(a, b) === 0;
  }

  /**
   * I: funcion para determinar si a es menor a b
   * E: a y b (String o numero)
   * S: booleano
   */
  lessThan(a, b) {
    return this.compare(a, b) < 0;
  }

   /**
   * I: funcion para determinar si a es mayor a b
   * E: a y b (String o numero)
   * S: booleano
   */
  greaterThan(a, b) {
    return this.compare(a, b) > 0;
  }

   /**
   * I: funcion para determinar si a es menor o igual a b
   * E: a y b (String o numero)
   * S: booleano
   */
  lessThanOrEqual(a, b) {
    return this.lessThan(a, b) || this.equal(a, b);
  }

   /**
   * I: funcion para determinar si a es mayor o igual a b
   * E: a y b (String o numero)
   * S: booleano
   */
  greaterThanOrEqual(a, b) {
    return this.greaterThan(a, b) || this.equal(a, b);
  }

   /**
   * I: funcion para comparar b con a
   * E: a y b (String o numero)
   * S: compare b con a
   */
  reverse() {
    const compareOriginal = this.compare;
    this.compare = (a, b) => compareOriginal(b, a);
  }
}

   /**
   * I: Clase para funciones de ordenamiento
   * E: objeto de retorno de llamada SorterCallbacks
   * S: recursion donde fue llamado
   */

class Sort {
  constructor(originalCallbacks) {
    this.callbacks = Sort.initSortingCallbacks(originalCallbacks);
    this.comparator = new Comparator(this.callbacks.compareCallback);
  }

  static initSortingCallbacks(originalCallbacks) {
    const callbacks = originalCallbacks || {};
    const stubCallback = () => {};

    callbacks.compareCallback = callbacks.compareCallback || undefined;
    callbacks.visitingCallback = callbacks.visitingCallback || stubCallback;

    return callbacks;
  }

  sort() {
    throw new Error('sort method must be implemented');
  }
}

   /**
   * I: clase para combinar los objetos ingresados para su ordenamiento
   * E: arreglo
   * S: arreglo ordenado
   */

class MergeSort extends Sort {
  sort(originalArray) {
    // callback original
    this.callbacks.visitingCallback(null);

    // si el arreglo es vacio o con un elemento lo retorna
    if (originalArray.length <= 1) {
      return originalArray;
    }

    //divide el arreglo en dos partes
    const middleIndex = Math.floor(originalArray.length / 2);
    const leftArray = originalArray.slice(0, middleIndex);
    const rightArray = originalArray.slice(middleIndex, originalArray.length);

    // ordena las dos partes del arreglo separado
    const leftSortedArray = this.sort(leftArray);
    const rightSortedArray = this.sort(rightArray);

    //combina las dos mitades en un solo arreglo
    return this.mergeSortedArrays(leftSortedArray, rightSortedArray);
  }

  mergeSortedArrays(leftArray, rightArray) {
    let sortedArray = [];

    //si los arreglos entrantes no son del size 1
    while (leftArray.length && rightArray.length) {
      let minimumElement = null;

      //encuentra el valor minimo de los dos arreglos
      if (this.comparator.lessThanOrEqual(leftArray[0], rightArray[0])) {
        minimumElement = leftArray.shift();
      } else {
        minimumElement = rightArray.shift();
      }

      // callback de la llamada visitada
      this.callbacks.visitingCallback(minimumElement);

      // agrega el elemento minimo en el arreglo
      sortedArray.push(minimumElement);
    }

    //verifica si los arreglos aun tiene elementos y los concatena para la siguiente llamada
    if (leftArray.length) {
      sortedArray = sortedArray.concat(leftArray);
    }

    if (rightArray.length) {
      sortedArray = sortedArray.concat(rightArray);
    }

    return sortedArray;
  }
}


   /**
   * I: clase con las funciones de algoritmo de mochila
   * E: array de los objetos ingresados en la mochila
   * S: booleano
   */
class Knapsack {

  constructor(possibleItems, weightLimit) {
    this.selectedItems = [];
    this.weightLimit = weightLimit;
    this.possibleItems = possibleItems;
    this.matriz = [];
  }
  //funcion para ordenar los objetos segun su peso
  sortPossibleItemsByWeight() {
    this.possibleItems = new MergeSort({

      compareCallback: (itemA, itemB) => {
        if (itemA.weight === itemB.weight) {
          return 0;
        }

        return itemA.weight < itemB.weight ? -1 : 1;
      },
    }).sort(this.possibleItems);
  }
  //funcion para ordenar los objetos segun su valor
  sortPossibleItemsByValue() {
    this.possibleItems = new MergeSort({

      compareCallback: (itemA, itemB) => {
        if (itemA.value === itemB.value) {
          return 0;
        }

        return itemA.value > itemB.value ? -1 : 1;
      },
    }).sort(this.possibleItems);
  }

  //funcion para ordenar segun el rango de valor por peso
  sortPossibleItemsByValuePerWeightRatio() {
    this.possibleItems = new MergeSort({

      compareCallback: (itemA, itemB) => {
        if (itemA.valuePerWeightRatio === itemB.valuePerWeightRatio) {
          return 0;
        }

        return itemA.valuePerWeightRatio > itemB.valuePerWeightRatio ? -1 : 1;
      },
    }).sort(this.possibleItems);
  }

  //1/0 mochila,programacion dinamica
  solveZeroOneKnapsackProblem() {

    this.sortPossibleItemsByValue();
    this.sortPossibleItemsByWeight();

    this.selectedItems = [];


    const numberOfRows = this.possibleItems.length;
    const numberOfColumns = this.weightLimit;
    const knapsackMatrix = Array(numberOfRows).fill(null).map(() => {
      return Array(numberOfColumns + 1).fill(null);
    });


    for (let itemIndex = 0; itemIndex < this.possibleItems.length; itemIndex += 1) {
      knapsackMatrix[itemIndex][0] = 0;
    }


    for (let weightIndex = 1; weightIndex <= this.weightLimit; weightIndex += 1) {
      const itemIndex = 0;
      const itemWeight = this.possibleItems[itemIndex].weight;
      const itemValue = this.possibleItems[itemIndex].value;
      knapsackMatrix[itemIndex][weightIndex] = itemWeight <= weightIndex ? itemValue : 0;
    }

  
    for (let itemIndex = 1; itemIndex < this.possibleItems.length; itemIndex += 1) {
      for (let weightIndex = 1; weightIndex <= this.weightLimit; weightIndex += 1) {
        const currentItemWeight = this.possibleItems[itemIndex].weight;
        const currentItemValue = this.possibleItems[itemIndex].value;

        if (currentItemWeight > weightIndex) {
          knapsackMatrix[itemIndex][weightIndex] = knapsackMatrix[itemIndex - 1][weightIndex];
        } else {

          knapsackMatrix[itemIndex][weightIndex] = Math.max(
            currentItemValue + knapsackMatrix[itemIndex - 1][weightIndex - currentItemWeight],
            knapsackMatrix[itemIndex - 1][weightIndex],
          );
        }
      }
    }


    let itemIndex = this.possibleItems.length - 1;
    let weightIndex = this.weightLimit;

    while (itemIndex > 0) {
      const currentItem = this.possibleItems[itemIndex];
      const prevItem = this.possibleItems[itemIndex - 1];


      if (
        knapsackMatrix[itemIndex][weightIndex]
        && knapsackMatrix[itemIndex][weightIndex] === knapsackMatrix[itemIndex - 1][weightIndex]
      ) {

        const prevSumValue = knapsackMatrix[itemIndex - 1][weightIndex];
        const prevPrevSumValue = knapsackMatrix[itemIndex - 2][weightIndex];
        if (
          !prevSumValue
          || (prevSumValue && prevPrevSumValue !== prevSumValue)
        ) {
          this.selectedItems.push(prevItem);
        }
      } else if (knapsackMatrix[itemIndex - 1][weightIndex - currentItem.weight]) {
        this.selectedItems.push(prevItem);
        weightIndex -= currentItem.weight;
      }

      itemIndex -= 1;
    }
    this.matriz = knapsackMatrix;
  }


  // mochila unbounded , greedy, no genera matriz
  solveUnboundedKnapsackProblem() {
    this.sortPossibleItemsByValue();
    this.sortPossibleItemsByValuePerWeightRatio();

    for (let itemIndex = 0; itemIndex < this.possibleItems.length; itemIndex += 1) {
      if (this.totalWeight < this.weightLimit) {
        const currentItem = this.possibleItems[itemIndex];


        const availableWeight = this.weightLimit - this.totalWeight;
        const maxPossibleItemsCount = Math.floor(availableWeight / currentItem.weight);

        if (maxPossibleItemsCount > currentItem.itemsInStock) {

          currentItem.quantity = currentItem.itemsInStock;
        } else if (maxPossibleItemsCount) {

          currentItem.quantity = maxPossibleItemsCount;
        }

        this.selectedItems.push(currentItem);
      }
    }
  }
  //valor total
  get totalValue() {
    return this.selectedItems.reduce((accumulator, item) => {
      return accumulator + item.totalValue;
    }, 0);
  }
  //peso total
  get totalWeight() {
    return this.selectedItems.reduce((accumulator, item) => {
      return accumulator + item.totalWeight;
    }, 0);
  }
}

/*
Entradas: celda de la tabla editable D(0)
Salida: cambio del valor de la columna con el mismo nombre
Descripcion: funcion para cambiar la fila y columna del mismo valor de nodo
*/

function changeRowCol(evt){
    var valor = document.getElementsByClassName(evt.target.className+"")[0].textContent;
    document.getElementsByClassName(evt.target.className+"")[1].textContent = valor;
}

/*
Entradas:celda editable de la tabla D(0)
Salida: booleano indicando si el string ingresado es un numero
Descripcion: funcion para identificar si el valor ingresado es numero
*/
function isNumber(evt) {
	var iKeyCode = (evt.which) ? evt.which : evt.keyCode
    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
        return false;
    return true;
}
/*
Entradas: ninguna
Salida: genera la tabla D(0) 
Descripcion:genera la tabla D(0)  con los valores predeterminados
*/
function createTable(){
	  var val = document.getElementById('textCantidad').value; // size de la tabla
    sessionStorage.setItem('TableSize', val);
    var tableHeaderRowCount = 0;
    var tbl = document.getElementById('tablaD');
    var rowCount = tbl.rows.length;
    var alphabet = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); // nombres de fila y columna predeterminados
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        tbl.deleteRow(tableHeaderRowCount);
    }
    for(var i = 0;i <= val; i++){
      var tr = document.createElement('tr');
      for(var j = 0;j <= val; j++){
        var td = document.createElement('td');
        td.setAttribute('contenteditable','true');
        if(i == 0){
          td.innerHTML = alphabet[j];
          td.setAttribute('class','td'+j+i);
          td.setAttribute('onkeyup','changeRowCol(event)');
        }
        else if(i == j){
          td.innerHTML = 0;
          td.setAttribute('contenteditable','false');
        }
        else if(j == 0){
          td.innerHTML = alphabet[i];
          td.setAttribute('class','td'+i+j);
          td.setAttribute('contenteditable','false');
        }
        else{
          td.setAttribute('onkeypress','javascript:return isNumber(event)');
        }
        tr.appendChild(td);       
      }
      tbl.appendChild(tr);

    }
    
  }
/*
Entradas: nombre de la tabla
Salida: genera la tabla D(0) en un 2d array
Descripcion:genera la tabla D(0) en un 2d array
*/
function getTable(tableId){
    var table = document.getElementById(tableId);
    var data = [];
    for (r = 1; r < table.rows.length; r++){
        var row = table.rows[r];
        var cells = row.cells;
        var temp = [];
        for (c = 1; c < cells.length; c++){
            var cell = cells[c];
            var inputElem = cell.innerHTML;
            if(r != c && inputElem === "0" || inputElem === "" || inputElem == "∞"){
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
/*
Entradas: ninguna
Salida: nombre de los nodos de tabla D(0)
Descripcion:obtiene nombre de los nodos de tabla D(0)
*/
function getTableNames(){
  var table = document.getElementById('tablaD');
  var row = table.rows[0];
  var cells = row.cells;
  var data = [];
  for (c = 0; c < cells.length; c++){
      var cell = cells[c];
      var inputElem = cell.innerHTML;
      data.push(inputElem);
  }
  return data;
}
/*
Entradas: size de la tabla D(0)
Salida: nombre de los nodos de tabla D(0)
Descripcion:obtiene nombre de los nodos de tabla D(0)
*/
function genTable0(m){
	var table = [];
	for(var i = 0; i < m; i++){
		var row = [];
		for(var j = 0; j < m; j++){
			row.push(0);
		}
		table.push(row);
	}
	return table;
}
/*
Entradas: dos numeros enteros positivos
Salida: numero menor
Descripcion:funcion para determinar cuales el numero menor de las dos entradas
*/
function min(num1, num2){
	if(num2 < num1){
		return num2;
	}
	else{
		return num1;
	}
}
/*
Entradas: size de la tabla
Salida: generacion de 2d array
Descripcion:funcion para generar tabla para luego ingresar los datos
*/
function copyTable0(m){
	var table = [];
	for(var i = 0; i < m; i++){
		var row = [];
		for(var j = 0; j < m; j++){
			row.push(0);
		}
		table.push(row);
	}
	return table;
}

/*
Entradas: tabla a copiar
Salida: una copia 2d array de la tabla ingresada
Descripcion: funcion para copiar los 2d array de una tabla
*/
function copyTable(table){
	var copy = [];
	for(var i = 0; i < table.length; i++){
		var row = [];
		for(var j = 0; j < table.length; j++){
			row.push(table[i][j]);
		}
		copy.push(row);
	}
	return copy;
}

/*
Entradas: dos numeros enteros
Salida: el numero menor
Descripcion:retorna el numero menor ingresado
*/
function hasChanged(num1, num2){
	return num2 < num1;
}

//variable global para el contador de tablas
var cont = 0;


var tablaPP;
/*
Entradas: tabla D(0), size de la tabla,tabla P(0)
Salida: generacion de tablas D y P con su respectivos cambios
Descripcion:aplica el algoritmo floyd y genera las tablas correspondientes
*/
function Floyd(tables, m, p){
	for(var k = 0; k < m; k++){
		var table = genTable0(m);
		const tableP = copyTable(p[k]);
		for(var i = 0; i < m; i++){
			table[i][k] = tables[k][i][k];
			for(var j = 0; j < m; j++){
				if(i===k){
					table[k][j] = tables[k][k][j];
				}
				else if (j != k){
					var num1 = tables[k][i][j];
					var num2 = tables[k][i][k] + tables[k][k][j];
					table[i][j] = min(num1,num2);
					if(hasChanged(num1,num2)){
						tableP[i][j] = k+1;
					}
				}
			}
		}
		p.push(tableP);
		tables.push(table);
	}
  tablaPP = p;
  var button1 = document.getElementById('btnRes');
  button1.addEventListener ("click", function() {
    if(cont <= m){
    var tableHeaderRowCount = 0;
    var tbl = document.getElementById('tablaRes');
    var tbl1 = document.getElementById('tablaResP');
    var rowCount = tbl.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        tbl.deleteRow(tableHeaderRowCount);
        tbl1.deleteRow(tableHeaderRowCount);
    }  

    var tablaNames = getTableNames();
    var tr = document.createElement('tr');
    var tr1 = document.createElement('tr');
    
    for(var k = 0;k <= m; k++){
      var td = document.createElement('td');
      var td1 = document.createElement('td');
      if(tablaNames[k] == ' '){
        td.style.cssText ='font-size: 10px;';
        td1.style.cssText ='font-size: 10px;';
        td.innerHTML = 'D('+cont+')';
        td1.innerHTML = 'P('+cont+')';
      }
      else{
        td.innerHTML = tablaNames[k];
        td1.innerHTML = tablaNames[k];
        }
      tr.appendChild(td);
      tr1.appendChild(td1);       
    }
    tbl.appendChild(tr);
    tbl1.appendChild(tr1); 

    for(var i = 0;i < m; i++){
      tr = document.createElement('tr');
      var td = document.createElement('td');
      td.innerHTML = tablaNames[i+1];
      tr.appendChild(td);      

      tr1 = document.createElement('tr');
      var td1 = document.createElement('td');
      td1.innerHTML = tablaNames[i+1];
      tr1.appendChild(td1);
    
    for(var j = 0;j < m; j++){
      var td = document.createElement('td');
      if(tables[cont][i][j] == Infinity){
        td.innerHTML = '∞';
      }else{
        td.innerHTML = tables[cont][i][j]; 
        
      } 
      tr.appendChild(td);
    }
    tbl.appendChild(tr);
    for(var j = 0;j < m; j++){
      var td1 = document.createElement('td');
      td1.innerHTML = p[cont][i][j]; 
      tr1.appendChild(td1);
    }

    tbl1.appendChild(tr1);
  }
    this.value = cont;
    cont = cont + 1;
}else{
  var contai = document.getElementById('textA');
  var contai1 = document.getElementById('textB');
  var btn = document.getElementById('btnOptimo');
  contai.style.cssText = 'visibility: visible;';
  contai1.style.cssText = 'visibility: visible;';
  btn.style.cssText = 'visibility: visible;';
  }
  });
}

/*
Entradas: identificador de la tabla
Salida: generacion para el algoritmo de floyd
Descripcion:funcion listener del boton calcular para la generacion de las tablas
*/
function runFloyd(tableId){
  cont = 0;
  var tableHeaderRowCount = 0;
  var tbl = document.getElementById('tablaRes');
  var tbl1 = document.getElementById('tablaResP');
  var rowCount = tbl.rows.length;
  for (var i = tableHeaderRowCount; i < rowCount; i++) {
      tbl.deleteRow(tableHeaderRowCount);
      tbl1.deleteRow(tableHeaderRowCount);
  } 
	var tableSize = sessionStorage.getItem('TableSize');
	var tableP = genTable0(tableSize);
  var d0 = getTable(tableId);
  Floyd([d0],tableSize,[tableP]);
  var button1 = document.getElementById('btnRes'); 
  button1.style.cssText = 'visibility: visible;';
  button1.value = 'Mostrar';
}

/*
Entradas: Nodo A,Nodo B y la tabla P
Salida: retorna la ruta optima
Descripcion: funcion para determinar la ruta optima de cada par de nodos
*/
/*
Entradas: Nodo A,Nodo B y la tabla P
Salida: retorna la ruta optima
Descripcion: funcion para determinar la ruta optima de cada par de nodos
*/
function rutaOptima(start, end, table){
	var ruta = [];
  ruta.push(start);
  var count = 0;
  do{
    var newIndex = ruta[count];
    if(newIndex != -1){
      var newValue = (table[newIndex][end])-1;
      ruta.push(newValue);
      count++;
    }
    else{
      alert("no hay camino a ese par de nodos");
      break;
    
    }
  }while(table[count][end] != 0)
  ruta.push(end);
  return ruta;
}

/*
Entradas: 
Salida: muestra la ruta optima en la interfaz
Descripcion: funcion para determinar la ruta optima de cada par de nodos
*/
function getOptimo(){
  var nodoA = document.getElementById('textA').value;
  var nodoB = document.getElementById('textB').value;
  if(!evalNodeName(nodoA)){
    alert("Ese nombre no existe en la tabla.");
    document.getElementById('textA').value= "";
  }
  if(!evalNodeName(nodoB)){
    alert("Ese nombre no existe en la tabla.");
    document.getElementById('textB').value= "";
  }
  else{
    var nombres = getTableNames();
    var posA;
    var posB;
    for(var i = 1;i< nombres.length; i++){
      if(nombres[i] == nodoA)
        posA = i -1;
      if(nombres[i] == nodoB)
        posB = i -1;
    }
    var ruta = rutaOptima(posA, posB, tablaPP[cont-1]);
    var rutaFinal = []; // esta el ruta a mostrar
    for(var i = 0; i < ruta.length; i++){
      var indice = ruta[i]+1;
      rutaFinal.push(nombres[indice]);
    }
    var pathFinal = "";
    for(var i = 0; i < rutaFinal.length; i++){
        if(i == rutaFinal.length -1)
          pathFinal = pathFinal + rutaFinal[i];
        else
          pathFinal = pathFinal + rutaFinal[i]+"->"

    }
    var lbl = document.getElementById('lblOptimo');
    var cam = document.getElementById('caminoOptimo');
    lbl.innerHTML = pathFinal;
    cam.innerHTML = 'Resultado';
  }
}

function evalNodeName(name){
  var nombres = getTableNames();
  for(var i = 1;i< nombres.length; i++){
    if(nombres[i] == name){
      return true;
    }
  }
  return false;
}
/*
Entradas: input con la informacion del archivo seleccionado
Salida: datos del xml para la generacion de la tabla por archivo
Descripcion: funcion para generacion de la tabla por archivo
*/
function onFileSelected(event){
  	const search = document.getElementById("inputFileLabel");
  	if(event.files[0].name.split(".")[1] === "xml"){
  		search.innerHTML = event.files[0].name;
  		var fileURL = URL.createObjectURL(event.files[0]);
  		var req = new XMLHttpRequest();
  		req.open('GET', fileURL);
  		req.onload = function() {
		    URL.revokeObjectURL(fileURL);
		    populateData(this.responseXML);
		};
		req.onerror = function() {
		    URL.revokeObjectURL(fileURL);
		    console.log('Error loading XML file.');
		};
		req.send();
  	}
  	else{
  		console.log('Tipo de archivo incorrecto');
  	}
}

/*
Entradas: documento xml
Salida: llenado de la tabla D(0)
Descripcion: funcion para analizar el archivo xml y llenar la tabla D(0)
*/
function populateData(xmlDoc) {

	var root = xmlDoc.getElementsByTagName("table");
	var size = 0;
	if(xmlDoc.firstChild.nodeName === "table"){
		var node = xmlDoc.firstChild.firstElementChild;
		if(node.nodeName === "size"){
			size = Number(node.innerHTML);
		}
		else{
			alert('Error: Formato de matris in compatible');
			return;
		}
	}
	if(xmlDoc.firstChild.children.length === size+2 ){
		var nodes = xmlDoc.firstChild.children[1];
		var names = [];
		if(nodes.children.length === size){
			for(var i = 0; i < size; i++){
				names.push(nodes.children[i].innerHTML);
			}
		}
		else{
			alert('Error: Incongruencias con el Tamaño de la matriz');
		}
		
		if(xmlDoc.firstChild.children.length-2 === size){
			for(var i = 0; i < size; i++){
				var row = xmlDoc.firstChild.children[i+2].children;
				if(row.length === size){
					for(var j = 0; j < size; j++){
						if (isNaN(Number(row[j].innerHTML))){
							alert('Error: Los elementos de la Matriz deben ser numeros o Infinity');
							return;
						}
					}
				}
				else{
					alert('Error: Incongruencias con el Tamaño de la matriz');
					return;
				}
			}
			var table = getXmlTable(xmlDoc.firstChild, size);
			fillTable(names,table,size);
		}
		else{
			alert('Error: Incongruencias con el Tamaño de la matriz');
			return;
		}
	}
}

/*
Entradas: input con la informacion del archivo seleccionado
Salida: datos del xml para la generacion de la tabla por archivo
Descripcion: funcion para generacion de la tabla por archivo
*/
function onFileSelected1(event){
  const search = document.getElementById("inputFileLabel");
  if(event.files[0].name.split(".")[1] === "xml"){
    search.innerHTML = event.files[0].name;
    var fileURL = URL.createObjectURL(event.files[0]);
    var req = new XMLHttpRequest();
    req.open('GET', fileURL);
    req.onload = function() {
      URL.revokeObjectURL(fileURL);
      populateData1(this.responseXML);
  };
  req.onerror = function() {
      URL.revokeObjectURL(fileURL);
      console.log('Error loading XML file.');
  };
  req.send();
  }
  else{
    console.log('Tipo de archivo incorrecto');
  }
}

/*
Entradas: documento xml
Salida: llenado de la tabla D(0)
Descripcion: funcion para analizar el archivo xml y llenar la tabla D(0)
*/
function populateData1(xmlDoc) {

	if(xmlDoc.firstChild.nodeName === "table"){
		var node = xmlDoc.firstChild.firstElementChild;
		if(node.nodeName === "maxweight"){
			size = Number(node.innerHTML);
		}
		else{
			alert('Error: Formato de matriz in compatible');
			return;
    }
    var lista = getXmlTable1(xmlDoc.firstChild,xmlDoc.firstChild.childElementCount);
    console.log(lista);
    var strtable = document.getElementById('txtMochila');
    var table = document.getElementById('tablaObjetos');
    strtable.value = xmlDoc.firstChild.children[0].innerHTML;
    for(var i = 0; i < lista.length;i++){
      var tr = document.createElement('tr');
      for(var j = 0; j < lista[i].length;j++){
        var td = document.createElement('td');
        td.setAttribute('contenteditable','true');
        if(j > 0)
          td.setAttribute('onkeypress',"javascript:return isNumber(event)");
        td.innerHTML = lista[i][j];
        tr.appendChild(td);
      }
      table.appendChild(tr);     
    }
    table.style.cssText = "visibility : visible";

	}
}
/*
Entradas: tabla , size de tabla
Salida: 2d array con valores de la tabla
Descripcion: funcion para generar tabla de los datos recolectados del xml
*/
function getXmlTable1(table, size){
	var t = [];
	for(var i = 1; i < size; i++){
		var row = table.children[i];
		var r = [];
		for(var j = 0; j < row.childElementCount; j++){
			r.push(row.children[j].innerHTML);
		}
		t.push(r);
	}
	return t;
}


/*
Entradas: tabla , size de tabla
Salida: 2d array con valores de la tabla
Descripcion: funcion para generar tabla de los datos recolectados del xml
*/
function getXmlTable(table, size){
	var t = [];
	for(var i = 0; i < size; i++){
		var row = table.children[i+2].children;
		var r = [];
		for(var j = 0; j < size; j++){
			r.push(Number(row[j].innerHTML));
		}
		t.push(r);
	}
	return t;
}
/*
Entradas: nombres de los nodos,tabla D(0),size de la tabla
Salida: llenado de la tabla D(0)
Descripcion: funcion para mostrar los datos del xml en la tabla
*/
function fillTable(names, table, size){
	document.getElementById('textCantidad').value = size;
	sessionStorage.setItem('TableSize', size);
	var tbl = document.getElementById('tablaD');
	cleanTable();
	for(var i = 0;i <= size; i++){
		var tr = document.createElement('tr');
		for(var j = 0;j <= size; j++){
			var td = document.createElement('td');
        	td.setAttribute('contenteditable','true');
        	if(i === 0 && j === 0){
	        	td.innerHTML = ' ';
	        }
	        else if(i == 0){
	          	td.innerHTML = names[j-1];
	          	td.setAttribute('class','td'+j+i);
	          	td.setAttribute('onkeyup','changeRowCol(event)');
	        }
	        else if(j == 0){
	          	td.innerHTML = names[i-1];
	          	td.setAttribute('class','td'+i+j);
	          	td.setAttribute('contenteditable','false');
	        }
	        else{
            if(table[i-1][j-1] == Infinity){
              td.innerHTML = '∞';
            }
	        	else
              td.innerHTML = table[i-1][j-1];
	          td.setAttribute('onkeypress','javascript:return isNumber(event)');

	        }
	        tr.appendChild(td);
		}
		tbl.appendChild(tr);
	}
}
/*
Entradas: ninguna
Salida: limpieza de la tabla D(0)
Descripcion: funcion para la limpieza de la tabla D(0)
*/
function cleanTable(){
	var tableHeaderRowCount = 0;
    var tbl = document.getElementById('tablaD');
    var rowCount = tbl.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        tbl.deleteRow(tableHeaderRowCount);
    }
}

//lista donde se guardan los objetos para realizar el algoritmo
var listaObjetos = [];






/*
Entradas: ninguno
Salida: tabla con los datos del objeto ingresado
Descripcion: funcion para generacion de la tabla de objetos y agregar sus valores
*/

function getDatosObjeto(){
  var tabla =document.getElementById('tablaObjetos');
  tabla.style.cssText = "visibility : visible";
  var objeto = document.getElementById('txtObjeto').value;
  var valor = document.getElementById('txtValor').value;
  var peso = document.getElementById('txtPeso').value;
  var cantidad = document.getElementById('txtCantidad').value;
  var lista = [];
  lista.push(objeto);
  lista.push(Number(valor));
  lista.push(Number(peso));
  if(cantidad == "0"){
    lista.push(Infinity);
  }
  if(cantidad == ""){
    lista.push(1);
  }else{
    lista.push(Number(cantidad));
  }
  listaObjetos.push(lista);
  var tr = document.createElement('tr');
  var td1 = document.createElement('td');
  td1.setAttribute('contenteditable','true');
  td1.innerHTML = lista[0];
  var td2 = document.createElement('td');
  td2.setAttribute('contenteditable','true');
  td2.setAttribute('onkeypress',"javascript:return isNumber(event)");
  td2.innerHTML = lista[1];
  var td3 = document.createElement('td');
  td3.setAttribute('contenteditable','true');
  td3.setAttribute('onkeypress',"javascript:return isNumber(event)");
  td3.innerHTML = lista[2];
  var td4 = document.createElement('td');
  td4.setAttribute('contenteditable','true');
  td4.setAttribute('onkeypress',"javascript:return isNumber(event)");
  td4.innerHTML = lista[3];
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  tabla.appendChild(tr);
}


/*
Entradas: ninguna
Salida: matriz de solucion de mochila
Descripcion: funcion para generacion de la matriz solucion del problema
*/

function Mochila(){
var possibleKnapsackItems = [];

  var table = document.getElementById('tablaObjetos');
  for (var r = 1; r < table.rows.length; r++){
    var row = table.rows[r];
    var cells = row.cells;
    var temp = new KnapsackItem({name:cells[0].innerHTML, value:Number(cells[1].innerHTML), weight:Number(cells[2].innerHTML),itemsInStock : Number(cells[3].innerHTML)});
    possibleKnapsackItems.push(temp);
  }

const maxKnapsackWeight = Number(document.getElementById('txtMochila').value);;

const knapsack = new Knapsack(possibleKnapsackItems, maxKnapsackWeight);

knapsack.solveZeroOneKnapsackProblem();

var matrizFinal = knapsack.matriz;
var lista = [];
lista.push(" ");
for(var i = 0; i <= maxKnapsackWeight; i++){
  lista.push(i);
}

for(var i = 0;i < matrizFinal.length; i++ ){
  matrizFinal[i].unshift(possibleKnapsackItems[i].name);
}
matrizFinal.unshift(lista);

var table = document.getElementById('tablaRes');
var res = document.getElementById('hRes');
for(var i = 0; i < matrizFinal.length;i++){
  var tr = document.createElement('tr');
  for(var j = 0; j < matrizFinal[i].length;j++){
    var td = document.createElement('td');
    td.innerHTML = matrizFinal[i][j];
    tr.appendChild(td);
  }
  table.appendChild(tr);     
}
table.style.cssText = "visibility : visible";
res.style.cssText = "visibility : visible";


knapsack.solveUnboundedKnapsackProblem();

console.log(knapsack.selectedItems);

}









