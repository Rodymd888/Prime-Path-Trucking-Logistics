"""Rebuild the included silent videos from Prime Path concept photographs.

Requires FFmpeg on PATH. Run: python3 scripts/create-motion.py
The MP4s are included; this script is optional for website installation.
"""
from pathlib import Path
import subprocess

MEDIA = Path(__file__).resolve().parent.parent / 'public' / 'media'


def run(args):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error',
                    '-threads', '2', *args], check=True)


run(['-i', str(MEDIA / 'fleet-hero.webp'), '-vf',
     "scale=2304:-1,zoompan=z='1.012+0.007*sin(on*2*PI/359)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=360:s=1600x800:fps=30,format=yuv420p",
     '-t', '12', '-c:v', 'libx264', '-threads', '2', '-preset', 'fast',
     '-crf', '25', '-movflags', '+faststart', '-an', '-y',
     str(MEDIA / 'fleet-loop.mp4')])
print('12-second fleet loop created.', flush=True)

filters = []
for index, zoom in enumerate(['1.012+on/15000', '1.025+on/15000',
                              '1.04-on/15000', '1.025+on/15000']):
    framing = ("scale=2304:1296:force_original_aspect_ratio=decrease,pad=2304:1296:(ow-iw)/2:(oh-ih)/2:color=0x071c2e"
               if index == 0 else "scale=2304:1296:force_original_aspect_ratio=increase,crop=2304:1296")
    filters.append(
        f"[{index}:v]{framing},zoompan=z='{zoom}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=150:s=1600x900:fps=30,format=yuv420p,settb=AVTB[v{index}]"
    )
filters += [
    '[v0][v1]xfade=transition=fade:duration=0.65:offset=4.35[v01]',
    '[v01][v2]xfade=transition=fade:duration=0.65:offset=8.7[v012]',
    '[v012][v3]xfade=transition=fade:duration=0.65:offset=13.05,fade=t=out:st=17.25:d=0.8,format=yuv420p[out]',
]
inputs = []
for name in ['fleet-hero', 'day-cab', 'box-truck', 'cargo-van']:
    inputs += ['-i', str(MEDIA / (name + '.webp'))]
run([*inputs, '-filter_complex_threads', '1', '-filter_complex',
     ';'.join(filters), '-map', '[out]', '-t', '18.05', '-c:v', 'libx264',
     '-threads', '2', '-preset', 'fast', '-crf', '23', '-movflags',
     '+faststart', '-an', '-y', str(MEDIA / 'fleet-film.mp4')])
print('18-second fleet film created.', flush=True)
