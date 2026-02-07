# AI Workflow Dokumentácia

**Meno:** Matus Vas

**Dátum začiatku:** 07.02.2026

**Dátum dokončenia:** 

**Zadanie:** Frontend

---

## 1. Použité AI Nástroje

Vyplň približný čas strávený s každým nástrojom:

- **Claude Code:** 2 hodín

**Celkový čas vývoja (priližne):** 2 hodín

---

## 2. Zbierka Promptov

### Prompt #1

**Nástroj:** [ Claude Code ]  
**Kontext:** [ Setup project ]

**Prompt:**
```
/init
```

**Výsledok:**
✅ Fungoval perfektne 

### Prompt #2

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
Z nejakeho dovodu priradil zle farbu k "--color-red-500" a nevytvoril ".text-preset-2" (uplne odignoroval styling)
```

**Poznámky / Learnings:**
```
[Prečo fungoval / nefungoval? Čo by si urobil inak?]
```

### Prompt #3

**Nástroj:** [ Claude Code ]  
**Kontext:** [ Public search - Part 1 ]

**Prompt:**
```
/generate-prp INITIAL-public-search.md
```

**Výsledok:**
✅ Fungoval perfektne

### Prompt #4

**Nástroj:** [ Claude Code ]  
**Kontext:** [ Public search - Part 2 ]

**Prompt:**
```
/execute-prp github-public-search.md
```

**Výsledok:**
⭐⭐⭐⭐ Dobré, potreboval malé úpravy  

[ ] ✅ Fungoval perfektne (first try)  
[ ] ⭐⭐⭐⭐ Dobré, potreboval malé úpravy  
[ ] ⭐⭐⭐ OK, potreboval viac úprav  
[ ] ⭐⭐ Slabé, musel som veľa prepísať  
[ ] ❌ Nefungoval, musel som celé prepísať

**Čo som musel upraviť / opraviť:**
```
Nezobrazoval error stav - No results found (card).
Design pre mobil nebol presne podla figmy. (pozicia buttonu)
Taktiez farba v dark mode pre light ikonku bola biela - biela ma byt iba pre hover/focus.
Unit testy vsetky neboli dobre fixnute - niektore padli.
```

**Poznámky / Learnings:**
```
ked sa napajal na figma - tak vypisal nejaky error, ze nevedel ziskat node id atd..., cize predpokladam, ze aj z tohoto dovodu nastali tieto mensie designove chyby, este raz som mu pastol odkaz na tu figmu kde sa nevedel napojit a uz to fixol vsetko spravne

taktiez bol potrebny fix pre dark mode - `:host-context([data-theme='dark'])` predtym bolo iba `[data-theme='dark']`
dodatocny promptami na fixnutie som to vyriesil 
```

### Prompt #5

**Nástroj:** [ Claude Code ]  
**Kontext:** [ OAuth login - Part 1 ]

**Prompt:**
```
/generate-prp INITIAL-auth-login.md
```

**Výsledok:**
✅ Fungoval perfektne

### Prompt #6

**Nástroj:** [ Claude Code ]  
**Kontext:** [ OAuth login - Part 2 ]

**Prompt:**
```
/execute-prp github-oauth-login.md
```

**Výsledok:**
✅ Fungoval perfektne

**Čo som musel upraviť / opraviť:**
```
potreboval som iba vysvetlit ako presne spustit server a generovanie developer setting pre github oauth - client ID a client secrets ...
```

**Poznámky / Learnings:**
```

```

### Prompt #7

**Nástroj:** [ Claude Code ]  
**Kontext:** [ Final steps - Unit tests ]

**Prompt:**
```

```

**Výsledok:**
✅ Fungoval perfektne

---

## 3. Problémy a Riešenia 

### Problém #1

**Čo sa stalo:**
```
[Detailný popis problému - čo nefungovalo? Aká bola chyba?]
```

**Prečo to vzniklo:**
```
[Tvoja analýza - prečo AI toto vygeneroval? Čo bolo v prompte zlé?]
```

**Ako som to vyriešil:**
```
[Krok za krokom - čo si urobil? Upravil prompt? Prepísal kód? Použil iný nástroj?]
```

**Čo som sa naučil:**
```
[Konkrétny learning pre budúcnosť - čo budeš robiť inak?]
```

**Screenshot / Kód:** [ ] Priložený

---

## 4. Kľúčové Poznatky

### 4.1 Čo fungovalo výborne

**1.** 
```
[Príklad: Claude Code pre OAuth - fungoval first try, zero problémov]
```

---

### 4.2 Čo bolo náročné

**1.** 
```
[Príklad: Figma MCP spacing - často o 4-8px vedľa, musel som manuálne opravovať]
```

---

### 4.3 Best Practices ktoré som objavil

**1.** 
```
[Príklad: Vždy špecifikuj verziu knižnice v prompte - "NextAuth.js v5"]
```

---

### 4.4 Moje Top 3 Tipy Pre Ostatných

**Tip #1:**
```
[Konkrétny, actionable tip]
```

---

## 6. Reflexia a Závery

### 6.1 Efektivita AI nástrojov

**Ktorý nástroj bol najužitočnejší?** _________________________________

**Prečo?**
```
```

**Ktorý nástroj bol najmenej užitočný?** _________________________________

**Prečo?**
```
```

---

### 6.2 Najväčšie prekvapenie
```
[Čo ťa najviac prekvapilo pri práci s AI?]
```

---

### 6.3 Najväčšia frustrácia
```
[Čo bolo najfrustrujúcejšie?]
```

---

### 6.4 Najväčší "AHA!" moment
```
[Kedy ti došlo niečo dôležité o AI alebo o developmente?]
```

---

### 6.5 Čo by som urobil inak
```
[Keby si začínal znova, čo by si zmenil?]
```

### 6.6 Hlavný odkaz pre ostatných
```
[Keby si mal povedať jednu vec kolegom o AI development, čo by to bylo?]
```
