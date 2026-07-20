#!/usr/bin/env python3
from __future__ import annotations
import json,re,sys
from jsonschema import Draft202012Validator, FormatChecker
from pathlib import Path
from urllib.parse import urlsplit
ROOT=Path(__file__).resolve().parents[1]; SRC=ROOT/'src'; DIST=ROOT/'dist'

def load(p): return json.loads(p.read_text(encoding='utf-8'))
def require(errors,obj,fields,label):
    for f in fields:
        if obj.get(f) in (None,''): errors.append(f'{label}: missing {f}')
def validate_source():
    e=[]
    schema_map={'site.json':'site.schema.json','cities.json':'cities.schema.json','categories.json':'categories.schema.json','census.json':'census.schema.json'}
    required=['site.json','cities.json','categories.json','census.json','census-sources.json']
    for name in required:
        p=SRC/'content'/name
        if not p.exists(): e.append(f'missing src/content/{name}')
        else:
            try: load(p)
            except Exception as ex: e.append(f'{p}: {ex}')
    if e:return e
    for content_name, schema_name in schema_map.items():
        validator=Draft202012Validator(load(ROOT/'schemas'/schema_name), format_checker=FormatChecker())
        for error in validator.iter_errors(load(SRC/'content'/content_name)):
            location='.'.join(map(str,error.absolute_path)) or '<root>'
            e.append(f'{content_name}:{location}: {error.message}')
    article_schema=load(ROOT/'schemas/article.schema.json')
    article_validator=Draft202012Validator(article_schema, format_checker=FormatChecker())
    for article_path in (SRC/'content/articles').glob('*.json'):
        for error in article_validator.iter_errors(load(article_path)):
            location='.'.join(map(str,error.absolute_path)) or '<root>'
            e.append(f'{article_path.name}:{location}: {error.message}')
    site=load(SRC/'content/site.json'); cities=load(SRC/'content/cities.json'); cats=load(SRC/'content/categories.json'); census=load(SRC/'content/census.json')
    require(e,site.get('brand',{}),['name','logo'],'site.brand')
    city_map=cities.get('cities',{})
    if cities.get('defaultCity') not in city_map:e.append('cities.defaultCity is invalid')
    for key,item in city_map.items():
        if not re.fullmatch(r'[a-z0-9-]+',key):e.append(f'invalid city key {key}')
        require(e,item,['name','banner','icon','intro'],f'city {key}')
        for ref in [item.get('banner'),item.get('icon')]:
            if ref and not (SRC/ref).exists():e.append(f'city {key}: missing {ref}')
        m=re.match(r'^(.*)-1024(\.[A-Za-z0-9]+)$',item.get('banner',''))
        if m:
            for width in (640,1024,1600):
                ref=f'{m.group(1)}-{width}{m.group(2)}'
                if not (SRC/ref).exists():e.append(f'city {key}: missing {ref}')
    defs=cats.get('definitions',[]); keys=[x.get('key') for x in defs]
    if len(keys)!=len(set(keys)):e.append('duplicate category keys')
    if cats.get('defaultTab') not in keys:e.append('categories.defaultTab is invalid')
    article_slugs=set()
    for p in (SRC/'content/articles').glob('*.json'):
        try:a=load(p)
        except Exception as ex:e.append(f'{p}: {ex}');continue
        require(e,a,['id','slug','title','summary','body','city','category','publishedAt','author','status'],p.name)
        if a.get('slug') in article_slugs:e.append(f'duplicate article slug {a.get("slug")}')
        article_slugs.add(a.get('slug'))
        if a.get('city') not in city_map:e.append(f'{p.name}: invalid city')
        if a.get('category') not in keys:e.append(f'{p.name}: invalid category')
        if a.get('status') not in {'draft','published','archived'}:e.append(f'{p.name}: invalid status')
    for year in ['2021','2026']:
        for key in ['hazaraAncestry','hazaragiLanguage']:
            v=census.get('national',{}).get(year,{}).get(key)
            if v is not None and (not isinstance(v,int) or v<0):e.append(f'census {year}.{key} invalid')
    return e

def validate_dist():
    e=[]
    if not DIST.exists():return ['dist does not exist; run build first']
    refpat=re.compile(r'(?:href|src)="([^"]+)"')
    for page in DIST.glob('*.html'):
        text=page.read_text(encoding='utf-8')
        if '{{' in text:e.append(f'{page.name}: unresolved template token')
        for ref in refpat.findall(text):
            parsed=urlsplit(ref)
            if parsed.scheme or parsed.netloc or ref.startswith(('#','mailto:','tel:')):continue
            local=parsed.path
            if local and not (DIST/local).exists():e.append(f'{page.name}: missing {local}')
    for js in (DIST/'assets/js').rglob('*.js'):
        text=js.read_text(encoding='utf-8')
        for ref in re.findall(r'import .*? from ["\']([^"\']+)["\']',text):
            if ref.startswith('.') and not (js.parent/ref).resolve().exists():e.append(f'{js}: missing import {ref}')
    return e

def main():
    errors=validate_source()+validate_dist()
    if errors: raise SystemExit('Validation failed\n- '+'\n- '.join(errors))
    print('Validation passed: source content, relationships, generated pages and local references are consistent.')
if __name__=='__main__':main()
