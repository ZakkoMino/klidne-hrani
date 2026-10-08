# GitHub Pages

Veřejná aplikace: https://zakkomino.github.io/klidne-hrani/

Zdroj: https://github.com/ZakkoMino/klidne-hrani

Workflow `.github/workflows/pages.yml` se spouští po pushi do main nebo ručně. Nejdříve testuje herní pravidla, obsah, veřejnou dokumentaci a sestaví offline cache. Poté předá Pages výhradně složku `dist/`. Oprávnění pro nasazení jsou contents: read, pages: write a id-token: write; používá prostředí github-pages.

Zdroj publikování v Settings → Pages je GitHub Actions. Běhy a jejich výsledky jsou dostupné na kartě Actions. Odkaz aplikace se zobrazuje také v About repozitáře.

PWA používá relativní cesty, aby fungovala v podadresáři /klidne-hrani/. Aktualizovaná offline cache se aktivuje po uzavření starých oken. Výsledky hraní zůstávají lokální. Data ze starého hostingu se do jiné domény nepřenesou automaticky; rodič může použít JSON export a import.

Podklad: [GitHub — vlastní workflow pro Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
