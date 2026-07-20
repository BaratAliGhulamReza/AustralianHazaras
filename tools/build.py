#!/usr/bin/env python3
from __future__ import annotations
import json, shutil, re
from pathlib import Path
from html import escape

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'src'; DIST=ROOT/'dist'

def read_json(path:Path): return json.loads(path.read_text(encoding='utf-8'))
def compact(obj): return json.dumps(obj,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
def render(template:str, values:dict[str,str]):
    for key,value in values.items(): template=template.replace('{{'+key+'}}',value)
    remaining=re.findall(r'{{[A-Z_]+}}',template)
    if remaining: raise ValueError(f'Unresolved template values: {remaining}')
    return template

def page_data(paths:list[str]): return {p:read_json(SRC/p) for p in paths}
def structured(title,description,url,image='assets/images/logo-280.webp'):
    data={'@context':'https://schema.org','@type':'WebPage','name':title,'description':description,'url':url,'isPartOf':{'@type':'WebSite','name':'Australian Hazaras','url':'https://baratalighulamreza.github.io/AustralianHazaras/'},'primaryImageOfPage':{'@type':'ImageObject','url':image}}
    return '<script type="application/ld+json">'+compact(data)+'</script>'

CSS_BUNDLES = {
    'home.min.css': [
        'core/tokens.css', 'core/base.css', 'layout/site-shell.css',
        'components/city-selector.css', 'components/city-content.css',
        'pages/home.css', 'layout/responsive.css',
    ],
    'census.min.css': [
        'core/tokens.css', 'core/base.css', 'layout/site-shell.css',
        'pages/census.css', 'layout/responsive.css',
    ],
    'article.min.css': [
        'core/tokens.css', 'core/base.css', 'layout/site-shell.css',
        'pages/article.css', 'layout/responsive.css',
    ],
}

def minify_css(text: str) -> str:
    text = re.sub(r'/\*.*?\*/', '', text, flags=re.S)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\s*([{}:;,>+~])\s*', r'\1', text)
    return text.replace(';}', '}').strip() + '\n'

def build_css_bundles() -> None:
    source_root = SRC / 'assets/css'
    output_root = DIST / 'assets/css/bundles'
    output_root.mkdir(parents=True, exist_ok=True)
    for output_name, source_names in CSS_BUNDLES.items():
        combined = '\n'.join((source_root / name).read_text(encoding='utf-8') for name in source_names)
        (output_root / output_name).write_text(minify_css(combined), encoding='utf-8')

def build():
    if DIST.exists(): shutil.rmtree(DIST)
    DIST.mkdir()
    shutil.copytree(SRC/'assets', DIST/'assets', ignore=shutil.ignore_patterns('bundles'))
    build_css_bundles()
    shutil.copytree(SRC/'content',DIST/'content')
    for static in ['robots.txt','census-night-2026.ics','.nojekyll']:
        shutil.copy2(SRC/static,DIST/static)
    # build article index
    articles=[read_json(p) for p in sorted((SRC/'content/articles').glob('*.json'))]
    (DIST/'content/articles.json').write_text(json.dumps({'articles':articles},indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    header=(SRC/'templates/partials/header.html').read_text(encoding='utf-8').strip()
    footer=(SRC/'templates/partials/footer.html').read_text(encoding='utf-8').strip()
    specs={
      'index.html':(['content/site.json','content/cities.json','content/categories.json','content/articles.json'],'Australian Hazaras','Hazara community information across Australia.'),
      'census.html':(['content/site.json','content/census.json'],'Census Data | Australian Hazaras','Official national figures for Hazara ancestry and the Hazaragi language in Australia.'),
      'article.html':(['content/site.json','content/categories.json','content/cities.json','content/articles.json'],'Community story | Australian Hazaras','Australian Hazara community story.'),
      '404.html':(['content/site.json'],'Page not found | Australian Hazaras','The requested page could not be found.'),
    }
    base='https://baratalighulamreza.github.io/AustralianHazaras/'
    for name,(paths,title,desc) in specs.items():
        template=(SRC/'templates/pages'/name).read_text(encoding='utf-8')
        pdata={}
        for p in paths:
            if p=='content/articles.json': pdata[p]={'articles':articles}
            else: pdata[p]=read_json(SRC/p)
        html=render(template,{'HEADER':header,'FOOTER':footer,'PAGE_DATA':compact(pdata),'STRUCTURED_DATA':structured(title,desc,base+name)})
        (DIST/name).write_text(html,encoding='utf-8')
    urls=['index.html','census.html']+[f'article.html?slug={a["slug"]}' for a in articles if a.get('status')=='published']
    sitemap=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for url in urls: sitemap.append(f'  <url><loc>{escape(base+url)}</loc></url>')
    sitemap.append('</urlset>')
    (DIST/'sitemap.xml').write_text('\n'.join(sitemap)+'\n',encoding='utf-8')
    print(f'Built {DIST} with {len(articles)} article(s).')
if __name__=='__main__': build()
