# Vergleicht zwei Screenshot-Läufe. Aufruf: python3 diff.py A B
import sys, json, glob, os
from PIL import Image, ImageChops
a, b = sys.argv[1], sys.argv[2]; out = []
for fa in sorted(glob.glob(f'shots/{a}/*.png')):
    n = os.path.basename(fa); fb = f'shots/{b}/{n}'
    if not os.path.exists(fb): out.append((n, 'FEHLT', 0)); continue
    ia, ib = Image.open(fa).convert('RGB'), Image.open(fb).convert('RGB')
    if ia.size != ib.size: out.append((n, f'GRÖSSE {ia.size} -> {ib.size}', 100.0)); continue
    d = ImageChops.difference(ia, ib).convert('L').point(lambda v: 255 if v > 24 else 0)
    pct = 100.0 * sum(d.histogram()[255:]) / (ia.size[0] * ia.size[1])
    out.append((n, 'ok', round(pct, 3)))
json.dump(out, open(f'results/diff-{a}-{b}.json', 'w'), indent=1)
for n, s, p in out: print(f'{n:28} {s:10} {p}%')
