# Ověření verze 1.0.0 — 8. 10. 2026

## Prošlo

- 14 unit/invariant testů: rozsah úrovní, pořadí, viditelné možnosti, 12 příběhů, poměr semaforu, změny pravidla, všech 24 variant cest, manuální hodnocení rytmu, podmínky vyšší obtížnosti, čas a validace záloh.
- Kontrola všech osmi her, 110 WAV souborů, 12 ilustrovaných příběhů, manifestu, ikon, syntaktické kontroly JS a absence zdravotních podkladů v dist.
- 15 integračních kontrol v Edge/Chromium: nejvyšší implementovaná úroveň všech her, přerušení během animované cesty, návrat po reloadu bez nového času, zachování „nevím“, zablokování další dětské návštěvy stejný den, dvouminutový strop a nepřeskočitelná přestávka, rodičovská brána, šířka 390 px a offline načtení všech hlasů.
- Žádné nezachycené JavaScript chyby v těchto scénářích. Záznam prohlížeče a čas v `browser-results.json`.
- Vizuálně prohlédnuty hlavní obrazovka na tabletu i telefonu, rodičovský přehled, příběh a cesta. Zkontrolovány všechny tři ilustrátorské atlasy.
- Veřejný repozitář obsahuje nově vygenerovanou anonymizovanou specifikaci. Původní fotografie, identifikátory a individuální měření jsou vyloučeny.

## Zbývá ověřit v reálném použití

- Fyzický Android tablet: instalace z Chrome, zvuk na reproduktoru, uspání, tlačítko Zpět a nové otevření v režimu letadlo. Automatická simulace prohlížeče není test konkrétního zařízení.
- Porozumění konkrétního dítěte ikonám, hlasu a příběhům. Krátce zkusit s rodičem; při nepohodě skončit.
- Dopad na reálné fungování: tato aplikace nemá klinické ověření a z herních výsledků jej nelze vyvozovat.

Místní `npm` wrapper na tomto počítači odkazoval na chybějící npm-cli. Kontroly proto proběhly přímo přes `node`; aplikace nemá žádné závislosti vyžadující instalaci balíčků. Toto není chyba webové aplikace. CI používá čistou instalaci Node/npm v GitHub Actions.

## Veřejná verze a GitHub Pages

Anonymizovaná dokumentace prošla kontrolou textu, názvů souborů, všech XML částí Wordu a metadat PNG. Word byl nově vytvořen a všech 13 stran vizuálně zkontrolováno. Původní snímek nálezu a individuální měření nejsou ve veřejné kopii.

Celá sada prohlížečových scénářů byla znovu spuštěna v podadresáři /klidne-hrani/, včetně offline reloadu a všech 110 zvukových souborů. Herní mechanismy se při přechodu na veřejné hostování neměnily.

## Verze 1.0.1 — opakované hraní pro testování

Denní zámek je odstraněný z hlavní obrazovky i obsluhy spuštění. V prohlížeči byly dokončeny a znovu spuštěny tři návštěvy v jednom dni; opakované spuštění funguje i po reloadu a historie zůstává uložená. Prošlo 14 testů pravidel, kontrola veřejné dokumentace a všech 15 existujících integračních kontrol včetně offline provozu. Údaj o denním zámku výše popisuje původní verzi 1.0.0.

## Verze 1.1.0 — 12. 10. 2026

- 14 testů pravidel; veřejná anonymizace a syntaxe všech modulů.
- 15 regresních scénářů v Chrome 154: osm her, obnova historie, opakované hraní, odstranění otázek na pocity, pauzy, mobilní rozložení a offline načtení i dekódování všech 125 MP3.
- 15 scénářů nového ovládání: dotykové přetahování včetně 390 px, neplatné puštění, rušení pointeru, chybné přiřazení, prohození příběhu, poslech u všech osmi her bez ztráty odpovědi, reakční čas při poslechu a chyba instalační výzvy. Záznam `interaction-results.json`.
- Skutečné přehrání MP3 a událost dokončení v Chrome, ruční poslech při vypnutých automatických pokynech a přerušení pauzou: `audio-results.json`.
- Čistý běžný profil Chrome: nativní instalační nabídka, žádné chyby manifestu, správná jedinečná identita a skutečná desktopová instalace přes CDP. Testovací aplikace poté odinstalovaná. Záznam `install-results.json`.
- Scénář původního kořenového ID: se starou instalací se nabídka neobjevila; po odstranění staré testovací aplikace se nabídka i instalace obnovily. Záznam `install-upgrade-results.json`. Nepoužívá uživatelův běžný profil ani jeho data.
- Vizuální kontrola rozhraní příběhu, Pomocníka, domovské obrazovky a rodičovského přehledu.

Omezení: nebylo připojeno fyzické zařízení Android. Jeho systémová chyba „již nainstalováno, ale nelze otevřít“ proto není prohlášena za opravenou pouhým desktopovým testem. Web má opravené ID a postup pro bezpečné obnovení instalace. Nový zvuk je automaticky přehratelný a dekódovatelný; srozumitelnost pro konkrétní dítě na konkrétním reproduktoru musí ověřit rodič.
