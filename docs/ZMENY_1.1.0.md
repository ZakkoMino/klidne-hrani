# Verze 1.1.0 — 12. 10. 2026

## Ovládání her

- **Pomocník:** přetáhnout předmět ke zvířeti. U dvou kroků záleží i na jejich pořadí. Předané předměty jsou vidět u příjemce. Pustit mimo zvíře znamená vrátit předmět, nikoliv chybu.
- **Třídírna:** přetáhnout tvar do krabičky podle zobrazeného pravidla.
- **Příběhy:** přetáhnout obrázky do očíslovaných okének. Obsazená okénka lze prohodit. Výsledek se vyhodnotí až tlačítkem Hotovo.
- Ve všech třech hrách funguje také klepnutí nebo klávesnice. Přetahování používá Pointer Events včetně dotyku a pera.
- Ostatní hry zachovávají ovládání odpovídající úkolu: pořadí domečků, hledání, signál, šipky a rytmus mimo tablet.

## Poslech a průběh

Každý úkol má viditelné tlačítko **Poslechnout zadání**. Přečte aktuální pokyn: konkrétní předměty a příjemce, hledaný obrázek, pravidlo třídění nebo požadovaný počet kroků. U příběhu neprozradí správné pořadí. Rozpracované odpovědi se zachovají. Samostatné **Zopakovat ukázku** znovu předvede paměťovou cestu nebo rytmus; začíná aktuální pokus od začátku. U semaforu se během poslechu nehodnotí reakce a potom začne nové reakční okno.

125 MP3 nahrávek používá syntetický český hlas **Microsoft Vlasta**, tempo snížené o 8 %. Nahrávky se stáhnou pro offline použití. Přehraje se vždy jeden hlas. Rytmus používá krátký perkusivní zvuk tlesknutí a tlumený úder místo vysokých elektronických tónů. Ruční poslech funguje i při vypnutých automatických pokynech. Pauza a konec ruší čekající hlas i pokračování animace.

Otázka „Jak ti teď je?“ a její odpovědi jsou na žádost rodiče odstraněné. Hraní začíná přímo úvodem hry a končí souhrnem. Pauza, konec a rodičovské pozorování zůstávají. Nové záznamy mají v kompatibilních polích `comfortBefore/After.childChoice` hodnotu `notAsked`; neznámý stav se nepřepisuje na „je mi dobře“. Starší historie a zálohy se zachovávají. Původní Word specifikace je výchozí návrh; tento dokument upřesňuje aktuální implementaci.

## Instalace

V původním manifestu `id: "./"` Chrome počítal identitu jako kořen `https://zakkomino.github.io/`. Verze 1.1.0 používá jednoznačné `id: "/klidne-hrani/"`. To předchází kolizi s dalšími aplikacemi na témže původu. Na Androidu bylo nahlášeno „již nainstalovaná, ale nelze otevřít“. Kolize nebo nefunkční stará instalace je možná příčina, nikoliv potvrzená diagnóza konkrétního zařízení. [Význam identity podle dokumentace Chrome](https://developer.chrome.com/docs/capabilities/pwa-manifest-id).

Původní veřejná verze v čistém běžném profilu Chrome splnila instalační podmínky a vyvolala nabídku. Nové instalační okno zobrazuje stav, správnou adresu a návod; ošetřuje odmítnutí nebo chybu instalační nabídky a maže použitou událost, aby ji nevyvolávalo znovu. Dokončení potvrzuje až událost `appinstalled`, nikoliv samotné přijetí žádosti. Manifest se načítá nejdřív ze sítě s offline zálohou. Připravenou aktualizaci lze načíst v instalačním okně po ukončení rozehraných her.

Změna ID může u již instalované staré verze vytvořit samostatnou novou ikonu. Před případným odstraněním staré instalace doporučujeme export JSON; nemažte data prohlížeče jako instalační krok.

V doplňujícím desktopovém testu stará instalace skutečně potlačila nabídku i s novým ID. Po odinstalování pouze staré testovací aplikace se nabídka obnovila a nová instalace proběhla. To nelze automaticky přenést na Android WebAPK. Instalační dialog obsahuje postup pro zálohu a odstranění pouze nefunkčního Klidného hraní v Nastavení Androidu → Aplikace. [Oficiální postup pro instalaci a odinstalaci na Androidu](https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&hl=cs). Odkaz na manifest má parametr verze, aby si prohlížeč vyžádal nové údaje.

## Ověření

- Testy logiky, obsah balíčku a veřejná anonymizace.
- Regresní scénáře všech osmi her, ukládání a opakování ve stejný den.
- Dotykové přetahování v Chromu, neplatný drop, přerušení, prohození příběhových okének a zachování odpovědi při poslechu.
- Manifest, instalační nabídka a skutečná instalace v izolovaném desktopovém Chromu; testovací aplikace byla následně odinstalována.
- Offline dostupnost a dekódování všech MP3.

Strojové záznamy jsou v `docs/verification/`. Fyzický Android tablet a jeho systémová instalace WebAPK zatím ověřené nejsou. Desktopový test ani emulovaný dotyk tuto zkoušku nenahrazují.
