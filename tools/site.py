#!/usr/bin/env python3
from __future__ import annotations
import argparse,hashlib,http.server,json,os,shutil,socketserver,subprocess,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];DIST=ROOT/'dist'
def run(*args): subprocess.run([sys.executable,*map(str,args)],check=True,cwd=ROOT)
def build(): run(ROOT/'tools/build.py')
def validate():
    if not DIST.exists():build()
    run(ROOT/'tools/validate_site.py')
def test(): subprocess.run([sys.executable,'-m','pytest','-q'],check=True,cwd=ROOT)
def release():
    build();validate();test()
    lines=[]
    for p in sorted(x for x in DIST.rglob('*') if x.is_file()):lines.append(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.relative_to(DIST).as_posix()}')
    (DIST/'FILE-MANIFEST-SHA256.txt').write_text('\n'.join(lines)+'\n',encoding='utf-8')
    (DIST/'VALIDATION.json').write_text(json.dumps({'status':'passed','checks':['build','source validation','generated output validation','tests']},indent=2)+'\n',encoding='utf-8')
    print('Release completed.')
def serve(port):
    build();os.chdir(DIST)
    with socketserver.TCPServer(('',port),http.server.SimpleHTTPRequestHandler) as s:
        print(f'Serving http://localhost:{port}');s.serve_forever()
def main():
    p=argparse.ArgumentParser();sp=p.add_subparsers(dest='cmd',required=True)
    for c in ['build','validate','test','release','clean']:sp.add_parser(c)
    q=sp.add_parser('serve');q.add_argument('--port',type=int,default=8000)
    a=p.parse_args()
    if a.cmd=='build':build()
    elif a.cmd=='validate':validate()
    elif a.cmd=='test':test()
    elif a.cmd=='release':release()
    elif a.cmd=='clean':shutil.rmtree(DIST,ignore_errors=True)
    else:serve(a.port)
if __name__=='__main__':main()
