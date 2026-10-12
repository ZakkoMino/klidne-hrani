# Pokyny pro práci na projektu

- Toto je veřejný repozitář a veřejný web na GitHub Pages. Nevkládat identifikátory dětí, originální zdravotní dokumenty, skutečné exporty hráčů ani osobní cesty pracovního počítače.
- Veřejná specifikace je zobecněná v docs/specifikace. Původní historii neslučovat do této čisté veřejné historie. Nekopírovat žádné soubory ze starých soukromých checkoutů.
- Nasazovat výhradně dist/ přes .github/workflows/pages.yml. Jiné složky nejsou součástí webového balíčku.
- Kontroly: node --test tests/logic.test.mjs, node scripts/check.mjs, python scripts/check-public.py, node scripts/build.mjs. Změněný dist/sw.js commitnout. U změn herních mechanismů ověřit relevantní scénáře scripts/qa-browser.mjs.
- Relativní cesty musí fungovat i pod /klidne-hrani/. Pro lokální ověření použít BASE_PATH=/klidne-hrani v serveru a BASE_URL=http://127.0.0.1:4173/klidne-hrani/ v integračních testech.
- Neměnit „nevím“ na „v pořádku“, nedokončený pokus na chybu ani rodičovské pozorování na automatické skóre. Pauza a konec fungují i během zvuku a animace.
- Od verze 1.1.0 se otázka na pocity nezobrazuje; nové návštěvy ukládají notAsked. Zachovat historické záznamy. Denní počet návštěv je na žádost rodiče neomezený pro testování.
- Změny přetahování a poslechu ověřit také scripts/qa-interactions.mjs; skutečné HTML Audio scripts/qa-audio.mjs. Instalaci ověřuje scripts/qa-install.mjs v izolovaném desktopovém Chrome profilu.
- Obsah funguje offline a nevyžaduje dětské čtení či mikrofon. Hry nemají prokázaný klinický účinek; nevydávat je za léčbu.
- Skutečnou instalaci na Android nelze tvrdit jen podle testů desktopového prohlížeče.
