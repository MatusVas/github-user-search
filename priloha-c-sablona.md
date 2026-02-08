# AI Workflow Dokumentácia

**Meno:** Matus Vas
**Dátum začiatku:** 07.02.2026
**Dátum dokončenia:** 07.02.2026
**Zadanie:** Frontend

---

## 1. Použité AI Nástroje

Vyplň približný čas strávený s každým nástrojom:

- **Claude Code:** 3 hodiny

**Celkový čas vývoja (priližne):** 4 hodiny (s dokumentáciou)

---

## 2. Zbierka Promptov

### Prompt #1

**Nástroj:** [ Claude Code ]
**Kontext:** [ Setup project - MCP Server ]

**Prompt:**
```
claude mcp add --scope project --transport http figma https://mcp.figma.com/mcp     
```

### Prompt #2

**Nástroj:** [ Claude Code ]
**Kontext:** [ Setup project - INIT ]

**Prompt:**
```
/init
```

### Prompt #3

**Nástroj:** [ Claude Code ]
**Kontext:** [ Setup project - Style Guide ]

**Prompt:**
```
@commands/style-guide.md
```

**Výsledok:**
⭐⭐⭐⭐ Dobré, potreboval malé úpravy

**Čo som musel upraviť / opraviť:**
```
1. Zlá farba pre "--color-red-500" 
2. Chýbajúci ".text-preset-2"
```

**Poznámky / Learnings:**
```
Style guide template môže mať problém s parsingom niektorých vlastností.

1. Vždy overiť všetky CSS variables hneď po generovaní
2. Skontrolovať či všetky ".text-preset-*" classy sú vytvorené
3. Možno použiť PRP workflow aj pre style setup, aby plán ukázal čo všetko má byť vytvorené
```

### Prompt #4

**Nástroj:** [ Claude Code ]
**Kontext:** [ Public search - Part 1 ]

**Prompt:**
```
/generate-prp INITIAL-public-search.md
```

**Výsledok:**
✅ Fungoval perfektne

**Poznámky / Learnings:**
```
/generate-prp vytvoril detailný implementačný plán:
- Component structure (search-bar, user-card, error states)
- Service architecture (github-api.service, theme.service)
- API integration strategy
- Responsive design considerations
- Testing approach
- Edge cases (no results, API errors, loading states)
```

### Prompt #5

**Nástroj:** [ Claude Code ]
**Kontext:** [ Public search - Part 2 ]

**Prompt:**
```
/execute-prp github-public-search.md
```

**Výsledok:**
⭐⭐⭐⭐ Dobré, potreboval malé úpravy

**Čo som musel upraviť / opraviť:**
```
1. Nezobrazoval error stav - "No results found" (user-card)
2. Design pre mobil nebol presne podľa Figmy (pozícia buttonu a user-card)
3. Farba v dark mode pre light ikonku bola biela - biela má byť iba pre hover/focus
```

**Poznámky / Learnings:**
```
Root cause: Figma MCP connection zlyhalo pre niektoré URL - vypísal error, že nevedel získať node ID. Claude Code implementoval funkcionalitu logicky (podľa seba).

Riešenie:
1. Dodatočne som poskytol Figma URL v termináli (druhý pokus uspel)
2. Fix pre Angular dark mode styling: ":host-context([data-theme='dark'])" namiesto "[data-theme='dark']"

Learnings:
- Vždy overiť Figma MCP connection (check logs)
- Ak zlyhá, hneď retry s Figma URL pred pokračovaním
- V Angular standalone komponentoch používať `:host-context()` pre parent selektory
- Visual testing je kritický po každom AI generate
```

### Prompt #6

**Nástroj:** [ Claude Code ]
**Kontext:** [ OAuth login - Part 1 ]

**Prompt:**
```
/generate-prp INITIAL-auth-login.md
```

**Výsledok:**
✅ Fungoval perfektne

**Poznámky / Learnings:**
```
PRP pre OAuth ukázal komplexnosť feature pred samotnou implementáciou:
- FE - OAuth authorization flow, callback handling, token storage
- BE - Express proxy server pre secure token exchange
- Security - Client secret protection, CORS config, token validation
- Routing - Auth guard, protected routes, redirect logic
- Testing - Mock localStorage, OAuth flow simulation, interceptor tests
- Environment - Dual .env files (FE + BE), secret management

Keby som išiel priamo do implementácie bez plánu, pravdepodobne by som:
1. Zabudol na BE proxy (security issue - client secret v browseri)
2. Neošetril edge cases (OAuth error, expired token, no code)
3. Neimplementoval proper session management
4. Mal problémy s testingom (mocky pre OAuth flow)

Learning: Čím komplexnejšia feature, tým väčšia hodnota PRP. 

OAuth plán ušetril hodiny debuggingu a security vulnerabilities.
```

### Prompt #7

**Nástroj:** [ Claude Code ]
**Kontext:** [ OAuth login - Part 2 ]

**Prompt:**
```
/execute-prp github-oauth-login.md
```

**Výsledok:**
⭐⭐⭐⭐ Dobré, potreboval malé úpravy

**Čo som musel upraviť / opraviť:**
```
1. Zistiť v kóde presné miesta kde doplniť GitHub Client ID a Client Secret
2. Vysvetliť setup proces:
   - Ako vytvoriť GitHub OAuth App (github.com/settings/developers)
   - Ako získať Client ID a Client Secret
   - Kde presne ich doplniť (environment.ts + .env)
```

**Poznámky / Learnings:**
```
Claude Code implementoval kompletný OAuth flow (authorization, token exchange, proxy server) funkčne SPRÁVNE, ale chýbala user-facing dokumentácia pre setup.

Čo Claude Code vedel:
- OAuth 2.0 flow implementation
- Express proxy server s CORS
- Secure token handling (client_secret na BE)
- Session management s localStorage
- Error handling pre OAuth errors

Čo potrebovalo vysvetlenie:
- GitHub OAuth app registration proces (nie technical, ale UI walkthrough)
- Kde nájsť Client ID/Secret v GitHube
- Deployment workflow (dva servery naraz)

Learning: AI vie implementovať komplexné technické features.

Bonus learning: Naučil som sa OAuth flow pre GitHub - authorization code exchange, state parameter security, proxy server pattern, token refresh strategies.
```

### Prompt #8

**Nástroj:** [ Claude Code ]
**Kontext:** [ Final steps - Unit tests ]

**Prompt:**
```
update, fix and run unit tests - ng test
```

**Výsledok:**
✅ Fungoval perfektne

**Poznámky / Learnings:**
```
Jeden prompt bol dostačujúci. 

Claude Code:
1. Analyzoval všetky test súbory (spec.ts files)
2. Identifikoval failing tests (localStorage/sessionStorage not defined)
3. Pridal mocky do test files
4. Fixol assertions (expected vs actual values)
5. Spustil `ng test` a overil že všetky testy prešli

Learning: Netreba špecifikovať "add localStorage mock to auth.service.spec.ts atď., AI vie troubleshootovať test failures samostatne.

Test coverage zahŕňal:
- Components (search, dashboard, callback)
- Services (auth, github-api, theme)
- Guards (auth.guard)
- Interceptors (auth.interceptor)

Všetko hotové a fixnuté za pár minút.
```

### Prompt #9

**Nástroj:** [ Claude Code ]
**Kontext:** [ Final steps - Update DOCS ]

**Prompt:**
```
update CLAUDE.md and all related files which need to be updated
```

**Výsledok:**
✅ Fungoval perfektne

**Poznámky / Learnings:**
```
Claude Code:
1. Identifikoval ktoré dokumenty potrebujú update na základe zmien v kóde
2. Aktualizoval CLAUDE.md:
   - Architecture section (pridané OAuth, auth service)
   - Environment configuration
   - GitHub OAuth setup instructions
   - API integration (authenticated endpoints)
   - Security considerations
   - Troubleshooting (OAuth issues)
3. Aktualizoval README.md:
   - Features section (OAuth login)
   - Development commands (dual server setup)
   - Environment setup
4. Vytvoril OAUTH_SETUP.md:
   - Step-by-step GitHub OAuth app registration
   - Environment variables explanation
   - Common errors + troubleshooting

Claude Code mal context celého projektu (čo bolo implementované, aké sú dependencies, aká dokumentácia existuje) a vedel presne čo treba updatnuť.

Learning: Po implementácii dáva zmysel spustiť prompt "update all docs"

AI má kontext všetkých zmien a vie synchronizovať dokumentáciu s kódom.
Manuálne by som zabudol updatnuť niektoré DOCS alebo by boli nekonzistentné.
```

---

## 3. Problémy a Riešenia

### Problém #1

**Čo sa stalo:**
```
Figma MCP nevedel získať node ID a design kontext. Pri execute-prp pre public search vznikli designové chyby - chýbal error stav (No results found card), pozícia buttonu na mobile nebola podľa Figmy, a farba light ikonky v dark mode bola nesprávna.
```

**Prečo to vzniklo:**
```
Figma MCP mal problémy s pripojením na špecifický node. Claude Code nevedel načítať presné design špecifikácie, takže implementoval funkcionalitu podľa vlastného predpokladu namiesto presného dizajnu z Figmy.
```

**Ako som to vyriešil:**
```
1. Znovu som poskytol odkaz na Figma node
2. Po druhom pokuse Claude Code už správne načítal design
3. Dodatočnými promptami som popísal chýbajúce stavy a design problémy
4. Claude Code fixol všetky designové nezrovnalosti
```

**Čo som sa naučil:**
```
Keď Figma MCP zlyháva, oplatí sa skúsiť poslať odkaz znova. Ak AI nemá prístup k designu, implementuje funkcionalitu logicky, ale môže minúť presné UI detaily. Vždy treba overiť visual output proti Figme.
```

### Problém #2

**Čo sa stalo:**
```
Dark mode styling nefungoval správne. Claude Code najprv definoval selektor "[data-theme='dark']" ale v Angular standalone komponentoch to nefungovalo.
```

**Prečo to vzniklo:**
```
V Angular komponentoch s encapsulated styles je potrebné použiť ":host-context()" pseudo-class pre prístup k atribútom na nadradených elementoch. Bežný atribútový selektor nemá prístup k `<html>` elementu mimo komponentu.
```

**Ako som to vyriešil:**
```
Prompt na zmenu "[data-theme='dark']" selektorov na ":host-context([data-theme='dark'])" v komponentoch. Claude Code po upozornení správne aplikoval túto zmenu.
```

**Čo som sa naučil:**
```
V Angular standalone komponentoch vždy používať ":host-context()" pre selektory nadradeného DOM. Toto je Angular-špecifická best practice, ktorú treba explicitne špecifikovať v prompte alebo CLAUDE.md.
```

### Problém #3

**Čo sa stalo:**
```
Po implementácii OAuth funkcionality padali unit testy. Testy nevedeli pracovať s localStorage a sessionStorage.
```

**Prečo to vzniklo:**
```
Vitest test environment nemá defaultne implementované Web Storage API (localStorage, sessionStorage). Nové komponenty a services používali storage, ale testy nemali správne mocky.
```

**Ako som to vyriešil:**
```
1. Prompt "update, fix and run unit tests"
2. Claude Code pridal localStorage a sessionStorage mocky do všetkých test súborov
3. Použil `vi.stubGlobal()` pre globálne mocknutie storage API
4. Všetky testy prešli
```

**Čo som sa naučil:**
```
Pri použití Vitest vždy explicitne mocknuť browser API (localStorage, sessionStorage, window objekty). Claude Code vie toto spraviť automaticky ak dostane správny prompt.
```

---

## 4. Kľúčové Poznatky

### 4.1 Čo fungovalo výborne

**1. /init workflow**
```
Inicializácia projektu pomocou /init fungovala perfektne na prvý pokus.
```

**2. PRP (Plan-Review-Program) workflow**
```
Kombinácia /generate-prp a /execute-prp bola extrémne efektívna. Claude Code najprv vytvoril detailný plán (public search, OAuth login), dal mi ho skontrolovať, a potom ho implementoval. Tento two-step proces minimalizoval potrebu opráv.
```

**3. Automatické testovanie**
```
Prompt "update, fix and run unit tests" fungoval perfektne. Claude Code samostatne identifikoval všetky chýbajúce mocky, opravil testy a overil, že všetko prechádza. Žiadna manuálna práce na testoch.
```

**4. Dokumentácia update**
```
Príkaz "update CLAUDE.md and all related files" automaticky aktualizoval všetku dokumentáciu vrátane README, OAUTH_SETUP.md a project instructions. Claude Code mal kontext celého projektu a vedel čo treba updatnuť.
```

---

### 4.2 Čo bolo náročné

**1. Figma MCP nestabilita**
```
Figma MCP občas zlyháva pri získavaní node ID a design kontextu. Keď to zlyhalo, Claude Code generoval UI z predpokladu, nie z presného designu.
```

**2. Angular-špecifické styling**
```
Dark mode styling s ":host-context([data-theme='dark'])" nie je intuitívny.

Claude Code použil bežný "[data-theme='dark']" selektor, ktorý v Angular standalone komponentoch nefunguje kvôli style encapsulation.
```

**3. Style Guide partial implementation**
```
Pri prvom pokuse s @commands/style-guide.md Claude Code nesprávne priradil farbu k --color-red-500 a úplne ignoroval .text-preset-2 styling. Musel som to manuálne opraviť. Dôvod neznámy - možno problém v style guide template.
```

---

### 4.3 Best Practices ktoré som objavil

**1. Vždy používaj PRP workflow pre features**
```
/generate-prp -> skontrolovať plán -> /execute-prp je oveľa efektívnejšie ako priame promptovanie. Plán umožňuje odchytiť problémy pred implementáciou a dáva lepší overview celej feature.
```

**2. Angular-špecifické patterns v CLAUDE.md**
```
Je kritické mať v CLAUDE.md Angular best practices - standalone components, signals, :host-context() styling, Vitest mocky. 

Claude Code tieto patterns dodržiava, ak ich má explicitne zdokumentované.
```

**3. Environment template files**
```
Vždy vytvoriť .example súbory pre environment konfiguráciu a vysvetliť v CLAUDE.md kde doplniť secrets. Claude Code potom vie správne inštruovať o setup procese.
```

**4. Ak Figma zlyhá, skús znova**
```
Keď Figma MCP nedokáže získať design, neznamená to že je problém s dizajnom.
Druhý pokus často funguje. Nie je potrebné meniť prompt, len retry.
```

---

### 4.4 Moje Top 3 Tipy Pre Ostatných

**Tip #1: Investuj čas do CLAUDE.md**
```
Dobre napísaný CLAUDE.md je game changer. Claude Code dodržiava všetky conventions, používa správne patterns a vie troubleshootovať problémy.
```

**Tip #2: Používaj PRP workflow aj pre menšie features**
```
Aj keď feature vypadá jednoducho, /generate-prp ti ukáže edge cases a dependencies, ktoré by si inak prehliadol. 
Public search vypadal jednoducho, ale plán ukázal: error states, loading states, responsive design, dark mode - všetko čo treba pokryť.
```

**Tip #3: Nech Claude Code fixuje vlastné chyby**
```
Keď niečo nefunguje, nepíš fix sám. Popíš Claudovi čo je zlé a nech to fixne on. 
Pri dark mode, unit testoch a Figma issues som dal feedback a Claude Code to fixol.
```

---

## 6. Reflexia a Závery

### 6.1 Efektivita AI nástrojov

**Ktorý nástroj bol najužitočnejší?** Claude Code

**Prečo?**
```
Claude Code s PRP workflow (/generate-prp + /execute-prp) bol absolútne kľúčový pre celý projekt.
- Kompletný Angular projekt s responsive design
- Public search s error/loading/empty states
- OAuth login s BE proxy serverom
- Unit testy pre všetky komponenty a services
- Light/dark mode toggle
- Kompletná dokumentácia

Bez AI by to bolo niekoľko dní práce. 
PRP workflow zabezpečil, že implementácia bola štrukturovaná, testovaná a zdokumentovaná od začiatku až po koniec.
```

**Ktorý nástroj bol najmenej užitočný?** Figma MCP (keď zlyhal)

**Prečo?**
```
Figma MCP je skvelý keď funguje, ale keď zlyhá pri získavaní design kontextu, Claude Code musí hádať design. 
To viedlo k drobným design issues, ktoré som musel dodatočne fixovať. 
Nestabilita MCP spojení je problém.
```

---

### 6.2 Najväčšie prekvapenie
```
Claude Code napísal OAuth flow s BE proxy serverom na prvý pokus a všetko fungovalo. Čakal som komplikácie s:
- GitHub OAuth API integráciou
- Token exchange cez proxy
- CORS nastavením
- Session management

Ale prompt "execute github-oauth-login.md" vygeneroval working solution s Express serverom, security best practices (client secret na BE), error handling a kompletnou dokumentáciou. 

Jediné čo bolo treba: vysvetliť ako nastaviť GitHub OAuth app a kde doplniť client ID/secret.

Druhé prekvapenie: Unit testy. 
Prompt "update, fix and run unit tests" automaticky pridal localStorage/sessionStorage mocky do VŠETKÝCH testov, fixol assertions a overil že testy prešli. Zero manuálnej práce.
```

---

### 6.3 Najväčšia frustrácia
```
Figma MCP connection errors. Keď som prvýkrát spustil /execute-prp pre public search, Figma MCP nedokázal získať node ID. Claude Code implementoval funkcionalitu ale bez presných design specs.
```

---

### 6.4 Najväčší "AHA!" moment
```
AHA moment bol keď som zistil "power of CLAUDE.md"

Po style guide problémoch som rozšíril CLAUDE.md o Angular-specific patterns (:host-context styling, standalone components, Vitest mocky).

Od tej chvíle Claude Code:
- Automaticky používal správne patterns
- Fixol dark mode styling
- Pridal storage mocky do testov
- Dodržiaval project conventions

CLAUDE.md nie je len dokumentácia pre ľudí - je to INSTRUCTION SET pre AI.
Investícia pár minút do CLAUDE.md mi ušetrila hodiny debuggingu.
```

---

### 6.5 Čo by som urobil inak
```
Keby som začínal znova:

1. **Napísať kompletný CLAUDE.md PRED prvým promptom**
   - Angular patterns, styling conventions, security notes
   - Ušetrilo by to style guide a dark mode fixes

2. **Overiť Figma MCP pripojenie hneď na začiatku**
   - Skúsiť test prompt s Figma linkom
   - Ak zlyhá, riešiť to PRED /execute-prp

3. **Používať PRP workflow aj pre style guide**
   - /generate-prp pre setup tasks, nie len features
   - Plán by ukázal že niektoré styles chýbajú

4. **Promptovať na OAuth dokumentáciu explicitne**
   - "Vytvor OAUTH_SETUP.md s troubleshooting"
   - Claude to spravil až keď som to explicitne požiadal
```

### 6.6 Hlavný odkaz pre ostatných
```
AI development je INÝ skill ako tradičný development.

Nestačí byť dobrý programátor. Musíš vedieť:
- Napísať dobrý CLAUDE.md (instruction set pre AI)
- Používať PRP workflow (plan before implement)
- Dávať kontext, nie micro-manage steps
- Nechať AI fixovať vlastné chyby
- Overiť output proti specs (Figma, tests, docs)

Najväčšia chyba: promptovať ako keby AI bol junior developer.
AI nie je junior - je expert vo všetkých technológiách, ale potrebuje
KONTEXT a FREEDOM.

Investuj čas do setup (CLAUDE.md, examples, conventions) a AI bude
deliverovať 10x rýchlejšie a presnejšie.

4 hodiny na production-ready app s OAuth, tests a docs nie je magia.
Je to výsledok: CLAUDE.md + PRP workflow + správne prompty.
```
