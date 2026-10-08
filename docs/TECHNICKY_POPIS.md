# Technické řešení 1.0.0

## Architektura

Statická PWA bez běhových závislostí: HTML, CSS a JavaScript ES moduly. Pro osm malých her není potřeba server ani framework. Od původního návrhu React/TypeScript se implementace liší jednodušším sestavením, menší závislostí na nástrojích a plně lokálním během. Stejné herní jádro testuje `node:test`.

- `dist/content.js`: osm her, známá slova, 12 příběhů, texty pro 110 zvuků, limity úrovní.
- `dist/logic.js`: generování, vyhodnocení, validace záloh, pravidlo nabídky vyšší úrovně, viditelný čas.
- `dist/app.js`: dotykové rozhraní a stavová logika návštěvy.
- `dist/storage.js`: IndexedDB a nouzový checkpoint v localStorage, oddělené od serveru.
- `scripts/build.mjs`: deterministická cache podle SHA obsahu všech nasazovaných souborů.
- `dist/sw.js`: cache aplikace, obrázků i hlasů; aktualizace převezme nová verze po uzavření starých oken.
- `manifest.webmanifest`: standalone PWA, ikony 192/512, relativní scope a start URL.

Nasazuje se **výhradně dist/** přes GitHub Pages. Repozitář a anonymizované zadání jsou veřejné; originální zdravotní podklady ani jejich historie nejsou součástí této kopie.

## Herní rozsah

| Hra | Dodané úrovně | Vyhodnocení |
|---|---|---|
| Zvířátka na návštěvě | 2, 3, 4 různé domečky; nácvik jeden | První úplná odpověď v pořadí |
| Pomocník se zvířátky | Jeden nebo dva známé pokyny | Správný předmět i příjemce a pořadí |
| Co bylo potom? | Dva obrázky; tři obrázky; tři obrázky + otázka | Pořadí automaticky, jazykový projev jen rodič |
| Klidný detektiv | 2, 4 nebo 6 různých velkých obrázků | Shoda se stále viditelnou předlohou |
| Semafor pro vláček | Jedna úroveň, 7 klepnutí a 3 čekání v deseti pokusech | Zelená/červená, tvar a symbol; stálá okna 3 s |
| Třídírna pokladů | Barva; tvar; výslovné střídání po pěti pokusech | Viditelné pravidlo, změna potvrzená rodičem |
| Cesta za pokladem | 2 kroky; 2 kroky s překážkou; 3 kroky s překážkou | Každá platná cesta; 8 otočených/zrcadlených variant na úroveň |
| Rytmický parťák | Dva nebo tři prvky | Rodič: samostatně / společně / nehodnotíme |

Všechny hry obsahují dva úvodní pokusy; u semaforu jeden zelený a jeden červený. Po třech po sobě jdoucích chybných dokončených pokusech aplikace nabídne pauzu místo pokračování. U semaforu se automaticky nezvyšuje rychlost. G2 prostorové předložky a jakékoliv cílené oční cvičení se do první verze nepřidávají bez konkrétního navazujícího zadání. Nejsou nabízeny prázdné/neodlišné úrovně.

Čas zahrnuje vysvětlování, nácvik a zpětnou vazbu při viditelném okně. Skrytí, změna velikosti během pokusu, Zpět a pauza přeruší rozpracovaný úkol. Neúplná odpověď se nehodnotí jako chybná. Reload obnoví stav jako pozastavený a neobnoví časový rozpočet. Minutová mezibloková pauza nemá tlačítko pro přeskočení. Rodič může kdykoliv skončit dříve.

Vyšší úroveň se pouze doporučí u vhodných her, pokud posledních 10 platných nenácvikových pokusů na stejné úrovni pochází alespoň ze dvou dnů, alespoň 8 je správných bez podpory a nanejvýš 1 s podporou. Změnu provádí rodič a během rozehrané návštěvy nelze nastavení měnit. Nejde o klinické skóre ani normu.

## Data

Schéma 1: settings, sessions, trials, observations, active. Rozlišujeme nácvik, dokončenost, první odpověď, druh podpory, rodičovské posouzení rytmu/jazyka a důvod zneplatnění. Volba dítěte a pozorování dospělého jsou oddělené. Neznámá pohoda se nepřevádí na souhlas. Poznámky se vykreslují escapované; CSV chrání začátky vzorců. Import kontroluje formát, podporované hry, úrovně, záznamy i stav návštěvy; limit souboru 10 MB. Historie není cloudová zdravotní dokumentace.

Aktuální omezení: používání jediné karty; generované ilustrace a syntetický hlas potřebují rodičovské posouzení s konkrétním dítětem; volný rodičovský zápis není standardizovaný dotazník; prokazatelný účinek na běžný život nebyl měřen.

## Vývoj a kontrola

Node.js 22+, bez instalace produkčních závislostí. Přímé příkazy fungují i při chybě místní npm instalace:

```sh
node --test tests/logic.test.mjs
node scripts/check.mjs
node scripts/build.mjs
node scripts/serve.mjs
```

Pro integrační zkoušku použijte Playwright a nainstalovaný Edge, server na 4173. `PLAYWRIGHT_MODULE` může ukazovat na modul mimo repo a `PLAYWRIGHT_CHANNEL` může zvolit jiný podporovaný prohlížeč; výchozí je msedge. Testové scénáře ukládají screenshoty a výsledky do ignorovaného `qa/`. Publikovatelný záznam se po ověření kopíruje do `docs/verification/`.

GitHub Actions ověřuje pravidla, obsah a deterministické sestavení offline cache při každém pushi/PR.
