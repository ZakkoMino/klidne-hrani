# Instalace a první hraní

1. Na Android tabletu otevřete [Klidné hraní](https://zakkomino.github.io/klidne-hrani/) v Chrome. Web je veřejný a nevyžaduje přihlášení.
2. Počkejte na **Připraveno i bez internetu**. První načtení stáhne obrázky a 125 českých MP3 nahrávek.
3. Nabídka Chrome **⋮ → Nainstalovat a vytvořit zástupce → Nainstalovat** (na některých verzích **Instalovat aplikaci** nebo **Přidat na plochu**). Potvrďte název. PWA se spouští vlastní ikonou a samostatným oknem.
4. Otevřete ikonu na ploše, zkuste zvuk a jednou obnovte aplikaci. Poté můžete vyzkoušet režim letadlo. První stažení a instalace vyžadují internet.
5. V části **Pro rodiče** podržte tlačítko dvě sekundy. Začněte úrovní 1 a dvěma dvouminutovými bloky. Výchozí domácí plán je třikrát týdně. Pro testování je od verze 1.0.1 denní limit spuštění vypnutý: po dokončení se vraťte na výběr her a můžete hned spustit další dvojici. Aplikace nevynucuje konkrétní dny v týdnu.

Na první hraní zvolte třeba **Pomocník se zvířátky** a **Co bylo potom?**. Rodič je přítomen; text nemusí dítě číst. Ve slovníkovém úvodu si ověřte, že dítě rozumí předmětům a zvířatům. Pokud slovům nerozumí, nejprve si je ukažte mimo hodnocení nebo zvolte jinou hru.

Otázka na pocity se od verze 1.1.0 nezobrazuje. Na pauzu ani konec není třeba vysvětlení. Přestávka mezi bloky trvá nejméně minutu; po ní pokračuje až rodič. Aplikace nemá automatický nekonečný trénink. Každý úkol má **Poslechnout zadání**. Pomocník, třídění a příběhy umožňují přetahování prstem; stále lze i klepat.

## Když instalace hlásí chybu

Otevírejte přímo adresu aplikace výše, nikoliv stránku repozitáře. Použijte běžné okno Chrome. Tlačítko **Přidat na tablet** otevře návod a při dostupné instalační nabídce umožní instalaci. Přesné znění chyby Chrome a verze Androidu pomohou odlišit problém webu od instalace balíčku v zařízení. Výsledky kvůli chybě nemažte.

Pokud Android hlásí **již nainstalováno, ale nelze otevřít**:

1. Na webu otevřete **Pro rodiče → Data, soukromí a záloha → Export JSON**, pokud chcete zachovat výsledky.
2. V Androidu jděte do **Nastavení → Aplikace → Zobrazit všechny aplikace → Klidné hraní**. Pokud je tam nefunkční stará instalace, odinstalujte pouze ji.
3. Zavřete staré záložky her, otevřete znovu web a použijte nabídku instalace Chrome.

Data Chrome ani ostatní aplikace nemažte. Pokud Klidné hraní v seznamu není nebo chyba přetrvá, zaznamenejte přesnou verzi Chrome a Androidu. [Postup Google pro správu webových aplikací na Androidu](https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&hl=cs).

Pro načtení verze 1.1.0 zavřete všechna okna i samostatnou aplikaci a otevřete ji znovu s internetem. V novější verzi lze připravenou aktualizaci načíst také v instalačním dialogu. Kvůli opravě identifikátoru může vzniknout nová ikona. Před odstraněním staré instalace si exportujte JSON zálohu.

## Data a změna zařízení

Data jsou uložena jen v prohlížeči konkrétního zařízení. V přehledu rodiče lze exportovat JSON a CSV. JSON slouží k obnově, CSV k prohlížení výsledků. Import nahrazuje místní historii až po potvrzení a nepřenáší rozehranou návštěvu. Nejdříve exportujte vlastní zálohu. Smazání dat Chrome, odinstalace, privátní okno nebo systémové čištění mohou data ztratit. Hraní ve více kartách současně není podporováno.

Místní data nejsou šifrovanou zdravotní dokumentací. Rodičovské podržení jen odděluje ovládání, nezabezpečuje zařízení před jinými dospělými. Výsledky nejsou odesílány na GitHub ani synchronizovány se serverem.

## Ověření na konkrétním tabletu

Automaticky je ověřen Chromium prohlížeč na Windows, mobilní rozložení a offline cache. Na vašem Android zařízení je třeba ověřit systémovou nabídku instalace, skutečné přehrávání hlasu, režim letadlo po ukončení aplikace, tlačítko Zpět a návrat po uspání. Tato hardwarová zkouška zatím neproběhla.

Aplikace je PWA. Balíček APK/AAB a publikace v Google Play nejsou součástí této verze.

Při přechodu z jiné domény se starší výsledky nepřenesou automaticky. Na původním webu nejprve exportujte JSON a na nové adrese jej importujte v rodičovském přehledu.
