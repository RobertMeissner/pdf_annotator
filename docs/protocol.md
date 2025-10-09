# PDF Annotator

## use case description

Fullstack - Case Study
Titel: Interaktive PDF-Annotierungsplattform mit React & TypeScript
Ziel:
Entwicklung einer Webanwendung zur Anzeige und Annotation von PDF-Dokumenten
auf Basis moderner Webtechnologien.
Technologien:
Frontend: React, TypeScript
•
Optional: Authentifizierung z.B. via Firebase
Funktionsumfang:
1. PDF-Annotation:
   a. Darstellung und Bearbeitung von PDF-Dateien im Browser
   b. Fokus auf benutzerfreundliche UX beim Annotieren, insbesondere beim
   freien Hereinzeichnen.
   c. Bewusste Auswahl und Bewertung passender Libraries zur Umsetzung
2. [Optional] Authentifizierung:
   a. Integration eines Auth Providers zur Benutzerverwaltung
3. Upload-Endpunkt:
   a. PDF-Dateien sollen an einen geschützten End Point
   (https://pdf.challenge.taxbier.de -> Klick) hochgeladen werden
   Hinweis:
   Die Gestaltung, technische Breite der Umsetzung und Wahl der Libraries erfolgen
   eigenverantwortlich unter Berücksichtigung aktueller Best Practices.

## 20251009 Pre thoughts


typescript + react
- hosting auf Cloudflare
- template structure
    - [react router](https://developers.cloudflare.com/workers/framework-guides/web-apps/react-router/)
    - [react vite](https://developers.cloudflare.com/workers/framework-guides/web-apps/react/)
- PDF upload API: https://pdf.challenge.taxbier.de/docs#/


Unklar
- Persistierung ein Thema? -> in memory only for now, switch later to blob storage for pdf, relation/json for annotation later
- annotierte PDF an den Endpunkt hochladen oder PDF dort hochladen und dann bearbeiten?

## 20251009 Implementation

domain
- upload pdf document and display to user
  - value_object, will not change much
- allow annotations for the user
  - what kind of annotations? drawn? " insbesondere beim freien Hereinzeichnen"
    - hand drawn annotations, but not only -> discriminate union
    - text highlight
    - multiple colours? 
    - multi-highlight of the same text?
    - what about images, media, etc.?
  - entity, will change

Setting up Claude for help
- I am no React or typescript senior
  - want to learn, by solving and critiquing the solution
  - MCP Context7 for API doc

Structure
- hexagonal architecture, e.g. -> src/domain/models, not differentiated by entity and value object, yet
- commit message with semantic commit message

chore:
- added linter, formater, type check

test strategy
- business logic only
- not every conversion or type guard must be tested, here, I want to see how things fit together

pdf rendering
- requirements
  - display pdf
  - get page size and page number
    - need this for the annotations
  - free: I have no money
  - open source: maybe not right now a need, but later on GDPR could be a topic. What if this sends out telemetry?
  - I annotate, but not alter the pdf -> pdf stays immuted, annotation is a layer on top
- options
  - react-pdf? >1M downloads weekly, online demo looks simple enough, free, displays "like images" -> issue with annotation?
  - https://www.npmjs.com/package/@pdf-viewer/react: licensed, not open-source, not free, may be interesting for production use
  - https://www.nutrient.io/sdk/: looks very professional, costs
- decision:
  - react-pdf

tailwind for CSS
- atomic -> aligns with SOLID/CUPID, i.e. unix style
- v4 different than v3, minor issues

pdf viewer component
- hard coded file for now
- get technically through, have everything working, then file selector in pdf component