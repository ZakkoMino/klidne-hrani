# Zvuk a ilustrace

110 českých WAV klipů bylo 8. 10. 2026 vytvořeno lokálním Windows hlasem **Microsoft Jakub, cs-CZ** přes Windows.Media.SpeechSynthesis. Nejde o nahrávku konkrétní osoby. Texty: `dist/content.js` a `scripts/audio-texts.json`. Regenerace: `node scripts/audio-manifest.mjs`, potom ve Windows PowerShell 5.1 `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/generate-audio.ps1`. Nutný nainstalovaný český hlas Windows.

Soubory se přehrávají přímo přes HTML Audio, jsou v offline cache a nic neposílají službě řečové syntézy. Vypnutí zvuku je v rodičovském přehledu. Prohlížeč může zvuk blokovat, pokud ještě neproběhlo klepnutí; vstup do hry je uživatelská akce. Při technickém výpadku zvuku zůstává text pro rodiče; dítě nemusí číst. Před prvním hraním rodič ověří hlasitost a srozumitelnost na tabletu.

Ilustrace: tři obrazové atlasy, celkem 12 tříobrázkových příběhů vytvořených generátorem pro tento projekt. Zadání a souřadnice výřezů jsou v `docs/story-prompts.json` a `docs/story-atlases.json`. Atlas se ořezává CSS, pořadí se mění logikou hry. Postavy jsou ilustrativní a nepocházejí z fotografie dítěte. Vizuálně zkontrolováno všech 12 posloupností. Ojedinělé detaily (například druhý plátek chleba při jídle nebo volná holínka) neposkytují úplný obraz skutečnosti; rodič může přijmout rozumné alternativní vyprávění a označit jazykový projev bez penalizace.

Ikony předmětů a zvířat jsou Unicode emoji dodané operačním systémem. Na Androidu mohou vypadat jinak než ve Windows. Zveřejněny jsou vygenerované zvukové pokyny, nikoliv hlasový engine Windows. Případná licence pro další distribuci či komerční vydání se posuzuje samostatně.
