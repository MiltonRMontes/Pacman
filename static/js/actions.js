var pixelx_del_pacman = 0;
var pixely_del_pacman = 0;
var pixelx_del_camino = 0;
var pixely_del_camino = 0;
var pixelx_borrar = 0;
var pixely_borrar = 0;
var x_galleta = 0;
var y_galleta = 0;
var x_pacman = 0;
var y_pacman = 0;
var algoritmo = "";
var mapa = "";
var iterador_movimientos = 0;
var tamano_cuadros = 15;
var movimientos = [];
var llego_a_la_galleta = false;
var refreshIntervalId;

/**
 * Está función maneja el ajax para que la página no se recargue cada vez que haya un cambio en la interfaz,
 * además de traer los valores de los campos del index.html para luegos mandarlos a la clase main.py.
 * Además muestra el costo del algoritmo utiliza y los nodos expandidos, luego llama a la función Dibujar y
 * le manda las acciones.
 */
function SendAjaxRequest(){
	x_galleta = $("#x_galleta").val();
	y_galleta = $("#y_galleta").val();
	x_pacman = $("#x_pacman").val();
	y_pacman = $("#y_pacman").val();
	algoritmo = $("#algoritmo").val();
	mapa = $("#mapa").val();
	clearInterval(refreshIntervalId);
	$.ajax({
		method: "POST",
		url: "/controller",
		type: "json",
		data: {x_pacman: x_pacman, y_pacman: y_pacman,x_galleta: x_galleta, y_galleta: y_galleta, algoritmo: algoritmo, mapa: mapa},
		success: function (response){
			document.getElementById('llegada').style.color = 'white';
			$("#llegada").html("No ha llegado a la galleta");
			$("#costo").html(response.actions[4][response.actions[4].length-1][0]);
			$("#nodos").html(response.actions[4][response.actions[4].length-1][1]);
			Dibujar(response.actions);
		},
			error: function(error){
				console.log(error);
			}
	});
}

/**
*Este método dibuja el tablero además de la galleta, lo hace utilizando el vector de actions.
*Dependiendo del caracter que encuentre pinta un muro o la galleta, si encuentra el pacman sólo
*guarda la posición donde está. Al final llama al método Pintar_Camino y el de Dibujar_Pacman, a este
*último lo mete en un setInterval
 */

function Dibujar (actions) {
	var canvas = document.getElementById("formas");
	contexto = canvas.getContext("2d");
	contexto.clearRect(0,0,500,500);
	var pixelx = 0;
	var pixely = 0;
	tamano_cuadros = 500/actions[5].length;
	movimientos = actions[4];
	for (var i = 0; i < actions[5].length; i++) {
		pixelx = 0;
		for (var j = 0; j < actions[5].length; j++) {
			if (actions[5][i][j] == "%") {
				contexto.fillStyle = ("rgba(34,54,205,0.5)");
				contexto.fillRect(pixelx,pixely,tamano_cuadros,tamano_cuadros);
			}
			else if (actions[5][i][j] == "P") {
				pixelx_del_pacman = pixelx;
				pixely_del_pacman = pixely;
				pixelx_borrar = pixelx_del_pacman;
				pixely_borrar = pixely_del_pacman;
				pixelx_del_camino = pixelx_del_pacman;
				pixely_del_camino = pixely_del_pacman;
			}
			else if (actions[5][i][j] == ".") {
				contexto.fillStyle = ("rgb(255,0,0)");
				contexto.beginPath();
				contexto.arc(pixelx+(tamano_cuadros/2),pixely+(tamano_cuadros/2),(tamano_cuadros/2)-4,Grados_a_Radianes(0),Grados_a_Radianes(360));
	      contexto.closePath();
	      contexto.fill();
			}
			pixelx += tamano_cuadros;
		}
		pixely += tamano_cuadros;
	}
	iterador_movimientos = 0;
	Pintar_Camino();
	refreshIntervalId = setInterval(Dibujar_Pacman,200);
}

/**
 * Esta función pinta el camino que recorrerá el
 * pacman para llegar a la galleta
*/
function Pintar_Camino () {
	var k= 0;
	for (k; k <= movimientos.length-1; k++) {
		contexto.fillStyle = ("rgba(255,0,0,0.2)");
		contexto.fillRect(pixelx_del_camino, pixely_del_camino, tamano_cuadros, tamano_cuadros);
	  if(movimientos[k] == "West"){
			pixelx_del_camino += -tamano_cuadros;
		}
		else if(movimientos[k] == "East"){
			pixelx_del_camino += tamano_cuadros;
		}
		else if(movimientos[k] == "North"){
			pixely_del_camino += -tamano_cuadros;
		}
		else if(movimientos[k] == "South"){
			pixely_del_camino += tamano_cuadros;
		}
	}
	contexto.fillStyle = ("rgb(255,0,0)");
	contexto.beginPath();
	contexto.arc(pixelx_del_camino+(tamano_cuadros/2),pixely_del_camino+(tamano_cuadros/2),(tamano_cuadros/2)-4,Grados_a_Radianes(0),Grados_a_Radianes(360));
  contexto.closePath();
  contexto.fill();
  contexto.fillStyle = ("rgba(34,54,205,0.5)");
}

/**
 * Esta función se ocupa de dibujar y mover el pacman hasta que llega al objetivo.
*/
function Dibujar_Pacman () {
	if (iterador_movimientos <= movimientos.length-1) {
		llego_a_la_galleta = false;
		contexto.clearRect(pixelx_borrar,pixely_borrar,tamano_cuadros,tamano_cuadros);
		contexto.fillStyle = ("rgba(255,0,0,0.2)");
		contexto.fillRect(pixelx_borrar,pixely_borrar,tamano_cuadros,tamano_cuadros);
		contexto.fillStyle = ("yellow");
		contexto.beginPath();
		contexto.arc(pixelx_del_pacman+(tamano_cuadros/2),pixely_del_pacman+(tamano_cuadros/2),(tamano_cuadros/2)-3,Grados_a_Radianes(0),Grados_a_Radianes(360));
	  contexto.closePath();
	  contexto.fill();
	  contexto.fillStyle = ("black");
	  contexto.beginPath();
		contexto.arc(pixelx_del_pacman+(tamano_cuadros/2),pixely_del_pacman+(tamano_cuadros/2),(tamano_cuadros/2)-3,Grados_a_Radianes(0),Grados_a_Radianes(360));
	  contexto.closePath();
	  contexto.stroke();
  	pixelx_borrar = pixelx_del_pacman;
  	pixely_borrar = pixely_del_pacman;
	  if(movimientos[iterador_movimientos] == "West"){
			pixelx_del_pacman += -tamano_cuadros;
		}
		else if(movimientos[iterador_movimientos] == "East"){
			pixelx_del_pacman += tamano_cuadros;
		}
		else if(movimientos[iterador_movimientos] == "North"){
			pixely_del_pacman += -tamano_cuadros;
		}
		else if(movimientos[iterador_movimientos] == "South"){
			pixely_del_pacman += tamano_cuadros;
		}
	  iterador_movimientos+=1;
	}
	else if(!llego_a_la_galleta){
		document.getElementById('llegada').style.color = 'red';
		$("#llegada").html("¡¡¡ LLEGÓ A LA GALLETA !!!");
		llego_a_la_galleta = true;
	}
}

/**
 * Esta función convierte los grados de Degradientes a grados en Radianes
*/
function Grados_a_Radianes (grado) {
	return ((grado*Math.PI)/180);
}