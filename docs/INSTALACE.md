# Instalace a první hraní

1. Na Android tabletu otevřete [Klidné hraní](https://zakkomino.github.io/klidne-hrani/) v Chrome. Web je veřejný a nevyžaduje přihlášení.
2. Počkejte na **Připraveno i bez internetu**. První načtení stáhne obrázky a 125 českých MP3 nahrávek.
3. Ve hře zvolte **Přidat na tablet → Instalovat aplikaci**, případně otevřete [přímo instalační okno](https://zakkomino.github.io/klidne-hrani/?install=1). Na tlačítko může být potřeba chvíli počkat. Potvrďte název v nabídce prohlížeče. PWA se spouští vlastní ikonou a samostatným oknem.
4. Otevřete ikonu na ploše, zkuste zvuk a jednou obnovte aplikaci. Poté můžete vyzkoušet režim letadlo. První stažení a instalace vyžadují internet.
5. V části **Pro rodiče** podržte tlačítko dvě sekundy. Začněte úrovní 1 a dvěma dvouminutovými bloky. Výchozí domácí plán je třikrát týdně. Pro testování je od verze 1.0.1 denní limit spuštění vypnutý: po dokončení se vraťte na výběr her a můžete hned spustit další dvojici. Aplikace nevynucuje konkrétní dny v týdnu.

Na první hraní zvolte třeba **Pomocník se zvířátky** a **Co bylo potom?**. Rodič je přítomen; text nemusí dítě číst. Ve slovníkovém úvodu si ověřte, že dítě rozumí předmětům a zvířatům. Pokud slovům nerozumí, nejprve si je ukažte mimo hodnocení nebo zvolte jinou hru.

Otázka na pocity se od verze 1.1.0 nezobrazuje. Na pauzu ani konec není třeba vysvětlení. Přestávka mezi bloky trvá nejméně minutu; po ní pokračuje až rodič. Aplikace nemá automatický nekonečný trénink. Každý úkol má **Poslechnout zadání**. Pomocník, třídění a příběhy umožňují přetahování prstem; stále lze i klepat.

## Když instalace hlásí chybu

Otevírejte přímo adresu aplikace výše, nikoliv stránku repozitáře. Použijte běžné okno Chrome. Tlačítko **Přidat na tablet** otevře návod a při dostupné instalační nabídce umožní instalaci. Přesné znění chyby Chrome a verze Androidu pomohou odlišit problém webu od instalace balíčku v zařízení. Výsledky kvůli chybě nemažte.

Pokud Android hlásí **již nainstalováno, ale nelze otevřít**, přestože Klidné hraní chybí v přehledu `chrome://webapks`:

1. Použijte instalační tlačítko **uvnitř hry**, dostupné přes **Přidat na tablet**. V Chrome 155.0.8059.39 systémová nabídka kontroluje instalaci podle společného původu webu, a proto může za instalované Klidné hraní považovat jinou hru na `zakkomino.github.io`. [Rozbor přesného kódu a ověření nasazení](verification/ANDROID_INSTALACE.md).
2. Pokud se tlačítko zatím nezobrazuje, chvíli počkejte nebo web znovu otevřete v běžném okně Chrome. Chybějící tlačítko samo o sobě neprokazuje instalaci. Úspěch této alternativní cesty musí potvrdit konkrétní zařízení.
3. Dočasně lze použít **⋮ → Nainstalovat a vytvořit zástupce → Vytvořit zkratku → Přidat**. Tato ikona otevírá hry v Chrome; jde o jiný způsob spouštění než instalace WebAPK. [Postup Google](https://support.google.com/chrome/answer/15085120?co=GENIE.Platform%3DAndroid&hl=cs).

Data Chrome ani ostatní aplikace nemažte. Pokud chyba přetrvá i při použití tlačítka ve hře, zaznamenejte její přesné znění, verzi Chrome a Androidu. Mazání dat ani odinstalace jiné hry není součástí tohoto postupu.

Verze 1.1.1 upřednostňuje instalaci přímo tlačítkem ve hře a opravuje návod pro uvedenou chybu Chrome. Nemění ID, startovací adresu, rozsah ani URL manifestu. Pro načtení nové verze zavřete všechna okna her a otevřete je znovu online; případně v části **Přidat na tablet** použijte **Načíst připravenou aktualizaci**, pokud se nabízí. Při rozehraných hrách nejprve použijte **Končíme**.

Pro načtení verze 1.1.0 zavřete všechna okna i samostatnou aplikaci a otevřete ji znovu s internetem. V novější verzi lze připravenou aktualizaci načíst také v instalačním dialogu. Kvůli opravě identifikátoru může vzniknout nová ikona. Před odstraněním staré instalace si exportujte JSON zálohu.

## Data a změna zařízení

Data jsou uložena jen v prohlížeči konkrétního zařízení. V přehledu rodiče lze exportovat JSON a CSV. JSON slouží k obnově, CSV k prohlížení výsledků. Import nahrazuje místní historii až po potvrzení a nepřenáší rozehranou návštěvu. Nejdříve exportujte vlastní zálohu. Smazání dat Chrome, odinstalace, privátní okno nebo systémové čištění mohou data ztratit. Hraní ve více kartách současně není podporováno.

Místní data nejsou šifrovanou zdravotní dokumentací. Rodičovské podržení jen odděluje ovládání, nezabezpečuje zařízení před jinými dospělými. Výsledky nejsou odesílány na GitHub ani synchronizovány se serverem.

## Ověření na konkrétním tabletu

Automaticky je ověřen Chromium prohlížeč na Windows, mobilní rozložení a offline cache. Na vašem Android zařízení je třeba ověřit systémovou nabídku instalace, skutečné přehrávání hlasu, režim letadlo po ukončení aplikace, tlačítko Zpět a návrat po uspání. Tato hardwarová zkouška zatím neproběhla.

Aplikace je PWA. Balíček APK/AAB a publikace v Google Play nejsou součástí této verze.

Při přechodu z jiné domény se starší výsledky nepřenesou automaticky. Na původním webu nejprve exportujte JSON a na nové adrese jej importujte v rodičovském přehledu.
