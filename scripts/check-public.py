from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parents[1]
assert not (root / 'docs/private').exists(), 'Private documents must not be present'
assert not (root / '.openai').exists(), 'Internal hosting configuration must not be present'
files = [p for folder in ['dist', 'docs', 'scripts', 'tests'] for p in (root / folder).rglob('*') if p.is_file()]
for p in files:
    assert p.suffix.lower() not in ['.jpg', '.jpeg', '.pdf'], 'Unexpected source photograph or PDF'
    if p.suffix == '.docx':
        with ZipFile(p) as z:
            names=z.namelist()
            assert not any(n.startswith(('word/media/', 'word/embeddings/')) or 'comments' in n.lower() for n in names), 'Embedded content or comments'
            for n in names:
                if n.endswith('.xml'):
                    tree=ET.fromstring(z.read(n))
                    ns='{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
                    assert not any(tree.iter(ns+'del')) and not any(tree.iter(ns+'ins')), 'Tracked changes'
            core=ET.fromstring(z.read('docProps/core.xml'))
            assert core.find('{http://purl.org/dc/elements/1.1/}creator').text == 'Klidné hraní', 'Unexpected author metadata'
print('Public structure and DOCX metadata checked; no original report or hidden attachments.')
