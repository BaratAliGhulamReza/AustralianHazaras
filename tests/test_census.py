import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def test_census_values():
    data=json.loads((ROOT/'src/content/census.json').read_text(encoding='utf-8'))
    for year in ('2021','2026'):
        for key in ('hazaraAncestry','hazaragiLanguage'):
            value=data['national'][year][key]
            assert value is None or isinstance(value,int) and value>=0
