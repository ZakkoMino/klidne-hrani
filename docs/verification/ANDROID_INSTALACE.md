# Android: nesprávné „již nainstalováno“ — 12. 10. 2026

## Závěr a hranice ověření

Veřejný web splňuje ověřené podmínky pro instalaci PWA. V kódu Chrome **155.0.8059.39** je nalezena kontrola nabídky instalace pouze podle originu (schéma + host + port). Tato kontrola vysvětluje nahlášený případ: jiná hra je instalována na stejném originu, Klidné hraní není v přehledu WebAPK, nabídka přesto hlásí instalaci a otevření selže.

To je závěr z konkrétního zdrojového kódu a poskytnutého výpisu. Vzdálené trasování procesu Chrome ani fyzický test Androidu neproběhly. Úspěch alternativní instalace přímo tlačítkem webu není zatím potvrzen na zařízení.

## Podklady

- Nahlášeno na Androidu 16 s Chrome 155.0.8059.39. Vytvoření webového zástupce funguje.
- Přehled `chrome://webapks` obsahuje Čtecí ZOO s URI, Scope, Manifest Start URL a Manifest Id `https://zakkomino.github.io/reading-zoo-poc/`. Tento rozsah nepokrývá `/klidne-hrani/`.
- Klidné hraní aktuálně deklaruje ID `/klidne-hrani/`, start URL `./`, scope `./`, display `standalone`. Relativní start a scope se z URL manifestu přeloží na `https://zakkomino.github.io/klidne-hrani/`.
- Manifest Čtecí ZOO a manifest Klidného hraní mají různé adresy. Dřívější kořenové ID Klidného hraní už veřejný manifest nepoužívá.

## Co dělá Chrome v dané verzi

1. [`AppInstallMenuHandler.doUniversalInstall`, řádky 100–126](https://github.com/chromium/chromium/blob/155.0.8059.39/chrome/android/java/src/org/chromium/chrome/browser/webapps/AppInstallMenuHandler.java#L100) získá příznak `webAppInstalled` voláním `isAppInstalledForUrl` a předá ho instalačnímu dialogu.
2. [`WebappRegistry.isAppInstalledForUrl`, řádky 445–459](https://github.com/chromium/chromium/blob/155.0.8059.39/chrome/android/java/src/org/chromium/chrome/browser/webapps/WebappRegistry.java#L445) převede URL na origin a volá `hasAtLeastOneWebApkForOrigin`. [Tato metoda](https://github.com/chromium/chromium/blob/155.0.8059.39/chrome/android/java/src/org/chromium/chrome/browser/webapps/WebappRegistry.java#L315) porovná originy a existenci balíčku; konkrétní cestu aplikace nezohlední.
3. [`doOpenWebApp`, řádky 192–233](https://github.com/chromium/chromium/blob/155.0.8059.39/chrome/android/java/src/org/chromium/chrome/browser/webapps/AppInstallMenuHandler.java#L192) při otevření hledá konkrétní Manifest ID, následně obsluhu aktuální URL. Záznam Čtecí ZOO pro jinou cestu tomuto požadavku nevyhoví. Proto může být nabídka „již nainstalováno“ současně s neúspěšným otevřením.

## Alternativní instalační cesta

Tlačítko webu používá uložený `beforeinstallprompt` a jeho `prompt()`. Není to nabídka `doUniversalInstall`.

[`WebappsClientAndroid.DoesNewWebAppConflictWithExistingInstallation`, řádky 79–102](https://github.com/chromium/chromium/blob/155.0.8059.39/chrome/browser/webapps/webapps_client_android.cc#L79) pro tuto cestu kontroluje rozpracovanou instalaci podle Manifest ID a instalovaný WebAPK podle celé startovací URL. To poskytuje odůvodněnou možnost obejít chybu nabídky, nikoliv záruku úspěchu na netestovaném Androidu.

Verze 1.1.1 proto upřednostňuje tlačítko **Přidat na tablet → Instalovat aplikaci**, přidává odkaz `?install=1` a upravuje instrukce pro chybné hlášení. Pokud Chrome událost nenabídne, tlačítko se nezobrazuje a aplikace netvrdí, že je instalována. Přijetí žádosti není vydáváno za dokončení. ID, start URL, scope a adresa manifestu zůstávají stabilní.

Také událost `appinstalled` na Androidu předchází vytvoření a instalaci WebAPK. Verze 1.1.1 proto i po této události žádá ověřit otevření ikonou; předchozí text „Aplikace je nainstalovaná“ byl příliš jednoznačný. [Dokumentace Google k události](https://web.dev/learn/pwa/detection#app_installation).

## Kontrola nasazení před úpravou návodu

- GitHub Pages nasazený commit `c90fa51dd266370e9059ae739732450a8569d85d`; publikace i Verify PWA dokončeny úspěšně.
- HTTPS vynuceno. HTML, manifest, worker, instalační modul a ikony vracejí HTTP 200, mají očekávané MIME typy a bajtově odpovídají checkoutu. Ikony jsou PNG 192 × 192 a 512 × 512. Strojový záznam: `deployment-before-install-help.json`.
- Čistý běžný profil desktopového Chrome 154 na veřejné URL: žádné chyby instalovatelnosti, událost `beforeinstallprompt`, skutečná instalace přes CDP, existence instalované aplikace. Testovací aplikace následně odinstalována. Záznam: `install-public-recheck.json`.

Desktopové kontroly ověřují web a nasazení, nikoli instalátor WebAPK na Androidu. Smazání dat prohlížeče, odinstalace Čtecí ZOO ani nové měnění identity aplikace nejsou řešením, které tento projekt doporučuje.
