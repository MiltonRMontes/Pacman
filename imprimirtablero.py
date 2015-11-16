# -*- coding: UTF-8 -*-
class leer_archivo():

	"""Cuando se crea una instancia de esta clase se inicializa una ruta, que es la carpeta
	donde están guardados los layouts con los que trabaja el pacman"""
	def __init__(self):
		self.nombre = "";
		self.archivo = None;
		self.lineas = "";
		self.ruta = r"layouts\ ";
		self.ruta = self.ruta[:len(self.ruta)-1]
		self.ruta = str(self.ruta)

	"""Este método es el encargado de buscar el tablero seleccionado por el usuario y tratarlo
	para que al final me retorne una lista que contiene cada linea del tablero"""
	def retornar(self, nombre):
		self.nombre = str(nombre);
		self.nombre = self.ruta+self.nombre
		self.archivo = open(self.nombre+".lay", "r")
		self.lineas = ""
		for linea in self.archivo.readlines():
		    self.lineas = self.lineas + linea
		self.lista = self.lineas.split("\n")
		return self.lista

	"""Este método recibe la lista de cadenas desde el main.py y me crea un nuevo .lay llamado
	laberinto con la información de la lista"""
	def escribir(self, lista):
		self.nombre = self.ruta+"laberinto"
		self.archivo = open(self.nombre+".lay","w")
		for cadena in lista:
			self.archivo.write(cadena+"\n")
		self.archivo.close()