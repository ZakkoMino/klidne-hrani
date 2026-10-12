"""Build offline Czech MP3 prompts; runtime has no speech service dependency.

Requires edge-tts==7.2.8. Only the public texts in audio-texts.json are sent.
System certificate authorities remain enabled and certificate checks stay on.
"""
import asyncio
import json
import pathlib
import sys
import edge_tts
import edge_tts.communicate

edge_tts.communicate._SSL_CTX.load_default_certs()
ROOT = pathlib.Path(__file__).resolve().parent.parent

async def main():
    (ROOT / 'qa').mkdir(exist_ok=True)
    texts = json.loads((ROOT / 'scripts/audio-texts.json').read_text(encoding='utf-8'))
    if '--sample' in sys.argv:
        await edge_tts.Communicate('Přetáhni míč k lišce. Můžeš si dát na čas.', 'cs-CZ-VlastaNeural', rate='-8%').save(str(ROOT / 'qa/voice-sample.mp3'))
        return
    for i, (key, text) in enumerate(texts.items(), 1):
        out = ROOT / 'dist/assets/audio' / (key + '.mp3')
        if '--resume' in sys.argv and out.exists() and out.stat().st_size > 1000:
            continue
        for attempt in range(3):
            try:
                temporary = ROOT / 'qa' / (key + '.mp3.tmp')
                await edge_tts.Communicate(text, 'cs-CZ-VlastaNeural', rate='-8%').save(str(temporary))
                temporary.replace(out)
                break
            except Exception as error:
                if attempt == 2:
                    raise RuntimeError(f'Voice service failed for {key}: {type(error).__name__}. Retry later with --resume.') from None
                await asyncio.sleep(30 * (attempt + 1))
        print(f'{i}/{len(texts)} {key}', flush=True)
        await asyncio.sleep(3)

asyncio.run(main())
