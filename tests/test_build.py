from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
def test_generated_pages_exist():
    for name in ('index.html','census.html','article.html','404.html','sitemap.xml'):
        assert (ROOT/'dist'/name).exists()
def test_no_template_tokens():
    for page in (ROOT/'dist').glob('*.html'):
        assert '{{' not in page.read_text(encoding='utf-8')
def test_article_index():
    data=json.loads((ROOT/'dist/content/articles.json').read_text(encoding='utf-8'))
    assert data['articles']
    assert all(item['slug'] for item in data['articles'])

def test_css_bundles_are_generated_only():
    assert not (ROOT/'src/assets/css/bundles').exists()
    for name in ('home.min.css','census.min.css','article.min.css'):
        assert (ROOT/'dist/assets/css/bundles'/name).exists()
