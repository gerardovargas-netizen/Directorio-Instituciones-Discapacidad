#!/usr/bin/env python3
import csv
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler

CSV_FILE = 'dir_inst_apoyo.csv'
CSV_HEADERS = [
    'nombreInst',
    'numTel',
    'dirCompleta',
    'sitioWeb',
    'mail',
    'enlaceContacto',
    'nombreServicio',
    'objetivoServicio',
    'poblacionMeta',
    'reglasOperServicio',
    'procesoSolicApoyo',
    'etiquetas',
]


class DirectorioHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

        if self.path.split('?', 1)[0] == '/dir_inst_apoyo.csv':
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')

        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"ok":true}')
            return

        super().do_GET()

    def do_POST(self):
        if self.path != '/api/entries':
            self.send_error(404)
            return

        try:
            length = int(self.headers.get('Content-Length', 0))
            payload = json.loads(self.rfile.read(length).decode('utf-8'))

            row = [payload.get(header, '') for header in CSV_HEADERS]

            with open(CSV_FILE, 'rb+') as csv_file:
                csv_file.seek(0, 2)
                if csv_file.tell() > 0:
                    csv_file.seek(-1, 2)
                    if csv_file.read(1) != b'\n':
                        csv_file.write(b'\n')

            with open(CSV_FILE, 'a', newline='', encoding='utf-8') as csv_file:
                writer = csv.writer(csv_file, quoting=csv.QUOTE_MINIMAL)
                writer.writerow(row)
        except Exception as error:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(error)}).encode('utf-8'))
            return

        self.send_response(201)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(b'{"ok":true}')


if __name__ == '__main__':
    server = HTTPServer(('', 8000), DirectorioHandler)
    print('Serving at http://localhost:8000')
    server.serve_forever()
