#!/usr/bin/env python3
"""Update Census values only when an approved official ABS JSON source changes."""
from __future__ import annotations
import argparse,json,ssl
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request,urlopen
ROOT=Path(__file__).resolve().parents[1]; CONTENT=ROOT/'src/content'
def read(path):return json.loads(path.read_text(encoding='utf-8'))
def valid_host(url,hosts):
    p=urlparse(url);return p.scheme=='https' and p.hostname in hosts
def fetch(url):
    req=Request(url,headers={'User-Agent':'Australian-Hazaras-Census-Updater/1.0'})
    with urlopen(req,timeout=30,context=ssl.create_default_context()) as r:return json.load(r)
def extract(payload):
    # Expected adapter contract for a future official endpoint.
    values=payload.get('national',payload)
    result={'hazaraAncestry':values.get('hazaraAncestry'),'hazaragiLanguage':values.get('hazaragiLanguage')}
    for key,value in result.items():
        if not isinstance(value,int) or value<0:raise ValueError(f'Invalid {key}')
    return result
def main():
    p=argparse.ArgumentParser();p.add_argument('--url');p.add_argument('--dry-run',action='store_true');a=p.parse_args()
    sources=read(CONTENT/'census-sources.json');url=a.url or sources.get('2026DataUrl')
    if not url:print('No official 2026 data URL configured; no content change.');return
    if not valid_host(url,set(sources.get('allowedHosts',[]))):raise SystemExit('Refusing unapproved or non-HTTPS source')
    incoming=extract(fetch(url));path=CONTENT/'census.json';data=read(path);current=data['national']['2026']
    changed=any(current.get(k)!=v for k,v in incoming.items())
    if not changed:print('Official figures are unchanged; no content change.');return
    data['national']['2026']={**incoming,'status':'official','source':url}
    if a.dry_run:print(json.dumps(data['national']['2026'],indent=2));return
    path.write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n',encoding='utf-8');print('Updated official 2026 Census figures.')
if __name__=='__main__':main()
