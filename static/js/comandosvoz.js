var recognition;
var recognizing = false;
var ultimotarget;

/**
 * Esta funcion permite capturar el identificador
 * del ultimo campo seleccionado.
*/
function info () {
	ultimotarget = document.activeElement.id;
}
/**
 * Esta funcion nos dira si el navegador soporta el
 * api de reconocimiento de vos
*/
if (!('webkitSpeechRecognition' in window)) {
	alert("¡API no soportada!");
} else {
	recognition = new webkitSpeechRecognition();
	recognition.lang = "es-CO";
	recognition.continuous = true;
	recognition.interimResults = true;

	/**
	 * Esta función se ejecuta apenas comienza el reconocimiento
	 * de voz.
	*/
	recognition.onstart = function() {
		recognizing = true;
		console.log("empezando a escuchar");
	};

	/**
	*Esta función procesa el audio reconocido y lo compara con
	*los diferentes comandos que se usan para configurar la partida
	*/
	recognition.onresult = function(event) {

	 for (var i = event.resultIndex; i < event.results.length; i++) {
			if(event.results[i].isFinal){
				if (event.results[i][0].transcript.toUpperCase() == 'MAPA PEQUEÑO') {
					document.getElementById('x_pacman').setAttribute("max",7);
		    	document.getElementById('y_pacman').setAttribute("max",7);
		    	document.getElementById('x_galleta').setAttribute("max",7);
		    	document.getElementById('y_galleta').setAttribute("max",7);
		    	$('#maxxpac').html('7');
		      $('#maxypac').html('7');
		      $('#maxxgall').html('7');
		      $('#maxygall').html('7');
					document.getElementById("mapa").value = "tinyMaze";
				}
				else if (event.results[i][0].transcript.toUpperCase() == 'MAPA MEDIANO') {
					document.getElementById('x_pacman').setAttribute("max",18);
		    	document.getElementById('y_pacman').setAttribute("max",18);
		    	document.getElementById('x_galleta').setAttribute("max",18);
		    	document.getElementById('y_galleta').setAttribute("max",18);
		    	$('#maxxpac').html('18');
		      $('#maxypac').html('18');
		      $('#maxxgall').html('18');
		      $('#maxygall').html('18');
					document.getElementById("mapa").value = "mediumMaze";
				}
				else if (event.results[i][0].transcript.toUpperCase() == 'MAPA GRANDE') {
					document.getElementById('x_pacman').setAttribute("max",37);
		    	document.getElementById('y_pacman').setAttribute("max",37);
		    	document.getElementById('x_galleta').setAttribute("max",37);
		    	document.getElementById('y_galleta').setAttribute("max",37);
		    	$('#maxxpac').html('37');
		      $('#maxypac').html('37');
		      $('#maxxgall').html('37');
		      $('#maxygall').html('37');
					document.getElementById("mapa").value = "bigMaze";
				}
				else if (event.results[i][0].transcript.toUpperCase() == 'ESTRELLA') {
					document.getElementById("algoritmo").value = "astar";
				}
				else if (event.results[i][0].transcript.toUpperCase() == 'PROFUNDIDAD') {
					document.getElementById("algoritmo").value = "dfs";
				}
				else if (event.results[i][0].transcript.toUpperCase() == 'AMPLITUD') {
					document.getElementById("algoritmo").value = "bfs";
				}
				else if (event.results[i][0].transcript.toUpperCase() == 'COSTO') {
					document.getElementById("algoritmo").value = "ucs";
				}
				else if (event.results[i][0].transcript.toUpperCase() == 'PRIMERO') {
					document.getElementById("algoritmo").value = "pem";
				}
				else if (event.results[i][0].transcript.toUpperCase() == 'TABULAR') {
					if (ultimotarget == "x_pacman" ) {
						$("#y_pacman").focus();
					}
					else if (ultimotarget == "y_pacman" ) {
						$("#x_galleta").focus();
					}
					else if (ultimotarget == "x_galleta" ) {
						$("#y_galleta").focus();
					}
					else if (ultimotarget == "y_galleta" ) {
						$("#x_pacman").focus();
					}
					else{
						$("#x_pacman").focus();
					}
				}
				else if (event.results[i][0].transcript.toUpperCase() == "GENERAR BÚSQUEDA") {
					$("#Enviar").click();
				}
				else if (!(isNaN(event.results[i][0].transcript))) {
					document.getElementById(ultimotarget).value = event.results[i][0].transcript;
				}
			}
	  }
	};

	/**
	* Esta función se ejecuta si ocurre algun error en
	*el reconocimiento de voz
	*/
	recognition.onerror = function(event) {
		alert("No se reconoce el comando");
	};

	/**
	* Esta función se ejecuta cuando deja de recibir audio
	*/
	recognition.onend = function() {
		recognizing = false;
		document.getElementById("procesar").innerHTML = "Escuchar";
	};
}

	/**
	 * Esta función da inicio y fin a la recepción de audio
	*/
function procesar() {
	if (recognizing == false) {
		recognition.start();
		recognizing = true;
		document.getElementById("procesar").innerHTML = "Detener";
	} else {
		recognition.stop();
		recognizing = false;
		document.getElementById(ultimotarget).focus();
		document.getElementById("procesar").innerHTML = "Escuchar";
	}

	/**
	 * Esta función establece el botónn procesar como foco
	*/
	function primer_target () {
		$("#procesar").focus();
	}
}

/**
 * Esta función se ejecuta cuando cambia la selección
 * de mapa o laberinto, así se reacomodarán los límites de
 * las coordenadas "x" y "y"
*/
$(document).ready(function() {
	$('#mapa').change(function() {
    if ($(this).val()== 'tinyMaze') {
    	document.getElementById('x_pacman').setAttribute("max",7);
    	document.getElementById('y_pacman').setAttribute("max",7);
    	document.getElementById('x_galleta').setAttribute("max",7);
    	document.getElementById('y_galleta').setAttribute("max",7);
      $('#maxxpac').html('7');
      $('#maxypac').html('7');
      $('#maxxgall').html('7');
      $('#maxygall').html('7');
    } else if ($(this).val()== 'mediumMaze') {
      document.getElementById('x_pacman').setAttribute("max",18);
    	document.getElementById('y_pacman').setAttribute("max",18);
    	document.getElementById('x_galleta').setAttribute("max",18);
    	document.getElementById('y_galleta').setAttribute("max",18);
      $('#maxxpac').html('18');
      $('#maxypac').html('18');
      $('#maxxgall').html('18');
      $('#maxygall').html('18');
    } else if ($(this).val()== 'bigMaze') {
      document.getElementById('x_pacman').setAttribute("max",37);
    	document.getElementById('y_pacman').setAttribute("max",37);
    	document.getElementById('x_galleta').setAttribute("max",37);
    	document.getElementById('y_galleta').setAttribute("max",37);
      $('#maxxpac').html('37');
      $('#maxypac').html('37');
      $('#maxxgall').html('37');
      $('#maxygall').html('37');
    }
	});
});