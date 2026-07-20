import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def read(name):return json.loads((ROOT/'src/content'/name).read_text(encoding='utf-8'))
def test_default_city_exists():
    data=read('cities.json');assert data['defaultCity'] in data['cities']
def test_default_category_exists():
    data=read('categories.json');assert data['defaultTab'] in {x['key'] for x in data['definitions']}
def test_hazaragi_spelling():
    assert read('site.json')['terminology']['language']=='Hazaragi'
