"""python scripts/preparar_base.py caminho/arquivo.xlsx
Extrai somente os campos autorizados para publicação. Biblioteca padrão Python.
"""
import csv
import datetime
import json
import pathlib
import sys
import xml.etree.ElementTree as ET
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
FIELDS = {'B': 'data', 'C': 'modelo', 'D': 'anoModelo', 'E': 'preco',
          'F': 'pagamento', 'G': 'cidade', 'H': 'estado', 'I': 'status',
          'J': 'familia', 'K': 'grupoStatus'}

def prepare(path):
    with zipfile.ZipFile(path) as z:
        strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            strings = [''.join(x.itertext()) for x in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si', NS)]
        root = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
        rows = []
        for row in root.findall('.//m:sheetData/m:row', NS)[1:]:
            record = {}
            for cell in row.findall('m:c', NS):
                col = ''.join(x for x in cell.attrib['r'] if x.isalpha())
                if col not in FIELDS:
                    continue
                value = cell.find('m:v', NS)
                value = value.text if value is not None else None
                if cell.attrib.get('t') == 's' and value is not None:
                    value = strings[int(value)]
                elif cell.attrib.get('t') == 'inlineStr':
                    value = ''.join(cell.find('m:is', NS).itertext())
                key = FIELDS[col]
                if value in (None, '', 'INVALID'):
                    value = None
                elif key == 'anoModelo':
                    value = int(value)
                elif key == 'preco':
                    value = float(value)
                elif key == 'data':
                    try:
                        datetime.date.fromisoformat(value)
                    except ValueError:
                        value = None
                record[key] = value
            if record:
                rows.append(record)
    assert len(rows) == 100, 'A base deste desafio deve conter 100 registros'
    assert all(r['preco'] is not None and r['preco'] > 0 for r in rows)
    (ROOT / 'dados').mkdir(exist_ok=True)
    (ROOT / 'dados/vendas.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding='utf-8')
    with (ROOT / 'dados/vendas.csv').open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS.values())
        writer.writeheader()
        writer.writerows(rows)
    # Atualiza o mesmo bloco de dados no HTML, sem arquivos externos em tempo de execução.
    html_path = ROOT / 'index.html'
    if html_path.exists():
        html = html_path.read_text(encoding='utf-8')
        start = html.index('<script id="dataset" type="application/json">') + len('<script id="dataset" type="application/json">')
        end = html.index('</script>', start)
        safe_json = json.dumps(rows, ensure_ascii=False).replace('<', '\\u003c')
        html_path.write_text(html[:start] + safe_json + html[end:], encoding='utf-8')
    print(json.dumps({'registros': len(rows), 'valor_total_usd': round(sum(x['preco'] for x in rows), 2),
                      'datas_invalidas': sum(x['data'] is None for x in rows),
                      'cancelados': sum(x['status'] == 'Cancelled' for x in rows)}, ensure_ascii=False))

if __name__ == '__main__':
    prepare(sys.argv[1])
