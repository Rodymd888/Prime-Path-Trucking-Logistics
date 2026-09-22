"""Rebuild silent MP4 motion pieces from the three concept fleet photographs.
Requires ffmpeg on PATH. Run: python3 scripts/create-motion.py
"""
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parent.parent
MEDIA = ROOT / 'public' / 'media'

def run(args):
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-threads','2',*args],check=True)

run(['-i',str(MEDIA/'hero.webp'),'-vf',
     "scale=2304:-1,zoompan=z='1.035+0.025*sin(on*2*PI/359)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=360:s=1600x900:fps=30,format=yuv420p",
     '-t','12','-c:v','libx264','-threads','2','-preset','fast','-crf','25','-movflags','+faststart','-an','-y',str(MEDIA/'highway-loop.mp4')])
print('Hero loop created.',flush=True)
filters=[]
for i,expr in enumerate(['1.03+on/6000','1.08-on/6000','1.025+on/6000']):
    filters.append(f"[{i}:v]scale=2304:-1,zoompan=z='{expr}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=210:s=1600x900:fps=30,format=yuv420p,settb=AVTB[v{i}]")
filters += ["[v0][v1]xfade=transition=fade:duration=1:offset=6[v01]",
            "[v01][v2]xfade=transition=fade:duration=1:offset=12,fade=t=in:st=0:d=0.8,fade=t=out:st=18:d=1,format=yuv420p[out]"]
args=[]
for name in ['hero','operations','detail']:args+=['-i',str(MEDIA/f'{name}.webp')]
run([*args,'-filter_complex_threads','1','-filter_complex',';'.join(filters),'-map','[out]',
     '-t','19','-c:v','libx264','-threads','2','-preset','fast','-crf','23','-movflags','+faststart','-an','-y',str(MEDIA/'prime-path-film.mp4')])
print('19-second fleet film created.',flush=True)
