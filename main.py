#!/usr/bin/env python
# -*- coding: UTF-8 -*-
# enable debugging

import flask, flask.views
import pacman as pacman
import searchAgents
import imprimirtablero as imprimirtablero
from searchAgents import SearchAgent
app = flask.Flask(__name__, static_url_path='/static')

class MainView(flask.views.MethodView):
	def get(self):
		return flask.render_template('index.html')

	def post(self):
		return self.get();

"""Este clase lo que hace es renderisarme la vista donde se pueden observar las instrucciones para utilizar
el Pacman"""
class MostrarOpciones(flask.views.MethodView):
	def get(self):
		return flask.render_template('opciones.html')

	def post(self):
		return self.get();

"""Este método recibe la información que se manda desde el actions.js y luego los manda en al método
processData que devuelve una lista, para que finalmente se los devuelva al actions.js"""
class AjaxController(flask.views.MethodView):
	def get(self):
		algorithm = flask.request.form['alg']
		word = flask.request.form['word']
		array = self.processData(algorithm, word)
		return flask.jsonify(actions = array)

	def post(self):
		x_pacman = flask.request.form['x_pacman']
		y_pacman = flask.request.form['y_pacman']
		x_galleta = flask.request.form['x_galleta']
		y_galleta = flask.request.form['y_galleta']
		algoritmo = flask.request.form['algoritmo']
		mapa = flask.request.form['mapa'];
		array = self.processData(x_pacman, y_pacman, x_galleta, y_galleta, algoritmo, mapa)
		return flask.jsonify(actions = array)

	"""Este método recibe los atributos que se van a utilizar para poder generar la ruta que
	va a realizar el Pacman, recibe las Coordenadas que va a tener el Pacman en el tablero,
	las coordenadas de la galleta(aunque no se va a implementar en esta ocasión), el nombre del
	algoritmo	que se quiere ejecutar y tablero (laberinto) que se va a solucionar. Dependiendo
	del algortimo que se quiera implementar se manda una lista de strings al pacman.py para que
	me retorne los datos en forma de lista, que en esta ocasión son: los movimientos del Pacman,
	la cantidad de nodos expandidos y el costo total del algortimo"""
	def processData(self, x_pacman, y_pacman, x_galleta, y_galleta, algoritmo, tablero):
		nulospacman = False;
		nulos = False
		if x_pacman=="" or y_pacman == "":
			x_pacman = 2;
			y_pacman = 1;
			nulospacman = True
		if x_galleta == "" or y_galleta == "":
			x_galleta = 2;
			y_galleta = 1;
			nulos = True
		x_pacman = int(x_pacman);
		y_pacman = int(y_pacman);
		x_galleta = int(x_galleta);
		y_galleta = int(y_galleta);
		lectura_de_archivo = imprimirtablero.leer_archivo();
		mapa = lectura_de_archivo.retornar(tablero)
		i = 0;
		if not nulospacman:
			for cadena in mapa:
				if cadena.find("P")>=0:
					cadena = cadena.replace("P", " ")
					mapa[i] = cadena;
				i = i + 1;
			mapa[y_pacman-1] = mapa[y_pacman-1][:x_pacman-1] + "P" + mapa[y_pacman-1][x_pacman:]
		i = 0;
		if not nulos:
			for cadena in mapa:
				if cadena.find(".") >= 0:
					cadena = cadena.replace(".", " ")
					mapa[i] = cadena
				i = i + 1;
			mapa[y_galleta-1] = mapa[y_galleta-1][:x_galleta-1] + "." + mapa[y_galleta-1][x_galleta:]
		lectura_de_archivo.escribir(mapa)
		if algoritmo == "astar":
			argv = ['-l', "laberinto", '-p', 'SearchAgent',"-a","fn=astar,heuristic=manhattanHeuristic"];
		elif algoritmo == "dfs":
			argv = ['-l', "laberinto", '-p', 'SearchAgent',"-a","fn=dfs"];
		elif algoritmo == "bfs":
			argv = ['-l', "laberinto", '-p', 'SearchAgent',"-a","fn=bfs"];
		elif algoritmo == "ucs":
			argv = ['-l', "laberinto", '-p', 'SearchAgent',"-a","fn=ucs"];
		elif algoritmo == "pem":
			argv = ['-l', "laberinto", '-p', 'SearchAgent',"-a","fn=pem,heuristic=first"];
		movimientos = pacman.Mandar_Informacion(argv)
		array = [x_pacman, y_pacman, x_galleta, y_galleta, movimientos, mapa]
		return array


app.add_url_rule("/", view_func=MainView.as_view('main'), methods=['GET', 'POST'])
app.add_url_rule("/controller", view_func=AjaxController.as_view('controller'), methods=['GET', 'POST'])
app.add_url_rule("/opciones", view_func=MostrarOpciones.as_view('mostraropciones'), methods=['GET', 'POST'])


app.debug = True
app.run()