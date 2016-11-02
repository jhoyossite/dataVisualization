# -*- coding: utf-8 -*-
#!/usr/bin/python
 
import SimpleHTTPServer
import SocketServer
import os
 
DIR_TO_SERVE = "." # Directorio a servir
PORT = 8080 # Puerto de escucha
 
try:
    os.chdir(DIR_TO_SERVE)
except OSError:
    print 'Directorio inválido. Sirviendo directorio actual.'
 
try:
    Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
    server = SocketServer.TCPServer(("", PORT), Handler)
    print 'Iniciado el servidor en el puerto ' , PORT
 
    # Espera a nuevas peticiones http
    server.serve_forever()
 
except KeyboardInterrupt:
    print '^C received, shutting down the web server'
    server.socket.close()
