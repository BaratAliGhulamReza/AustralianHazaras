#!/usr/bin/env python3
from __future__ import annotations
import argparse
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
WIDTHS=(640,1024,1600)
def generate(source:Path,name:str,quality:int=86):
    out=ROOT/'src/assets/images/banners'; out.mkdir(parents=True,exist_ok=True)
    with Image.open(source) as im:
        im=im.convert('RGB')
        if im.width<max(WIDTHS): raise SystemExit(f'Source must be at least {max(WIDTHS)}px wide')
        for width in WIDTHS:
            height=round(im.height*(width/im.width)); resized=im.resize((width,height),Image.Resampling.LANCZOS)
            target=out/f'{name}-{width}.webp'; resized.save(target,'WEBP',quality=quality,method=6); print(target.relative_to(ROOT))
def main():
    p=argparse.ArgumentParser();p.add_argument('source',type=Path);p.add_argument('name');p.add_argument('--quality',type=int,default=86);a=p.parse_args();generate(a.source,a.name,a.quality)
if __name__=='__main__':main()
