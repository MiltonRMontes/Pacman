#!/usr/bin/env python
# -*- coding: UTF-8 -*-

# enable debugging
import flask, flask.views
app = flask.Flask(__name__,static_url_path='/static')

class MainView(flask.views.MethodView):
	def get(self):
		return 'Hola Mundo desde la web python!'
		
app.add_url_rule("/", view_func=MainView.as_view('main'))


app.debug = True
app.run()