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

commited

next step
- Annotator, requirements
  - need to draw upon the pdf viewer component
  - simple to integrate with react (i.e., switching e.g. to VueJS or angular would have trailing costs)
  - free
  - vector drawing -> store traces, this is not Paint
- options
  - https://www.npmjs.com/package/react-konva: >500k+ downloads weekly, react integrated, Konva.js, however, works e.g. with VueJS
  - fabric.js: more stars, single canvas (enough here), not react native, see e.g. https://www.npmjs.com/package/fabricjs-react
  - native canvas api: probably more freedom, less dependencies, more work needed
- chose react-konva

Added options to delete and select
- however: now navbar is needed, context of PDFViewer and Annotator are mixed
- refactoring needed -> lunch break

How to handle state well?
- Zustand or Jotai? Redux?
  - redux too much boilerplate
- I want to keep it simple and add complexity where suitable
  - useState in App.tsx

refactored without Claude and commited

UX not ideal, e.g., 
- if cursor leaves PDF, it "forgets" whether mouse is still clicked, one can draw indefinitely
- drawing space unclear
- "Select" confuses

decision for technical puncture first
- step 3, pdf upload
- token is not stored, will always be pulled
  - could be cached/persisted for 30min

----

break, continued on 20251011
- "upload-pdf" not semantic. Better, e.g. "upload/pdf", i.e., verb/uri
- API: response schema not defined. Unclear whether file_id or fileId or ? is being returned -> bad practice
- refactored pdf loading into single file handling
- added di container for composing the use case service

good UX requires transpacency and user-readable responses and notifications
- react-toastify: simple, free, react native
- sonner: slightly less popular, seems more modern, typescript first

upload is working, notifications are appearing
- mostly happy case

refactoring UI

commited

added tests, test driven in PoC development often difficult, as tests do change rapidly
- only happy case and obvious bad cases
- no edge cases
  - e.g. bad pdf file
  - what if values are outside their range, e.g., point coordinates?

monitoring, logging
- often cost-intensive solutions
- event streaming for replayability, debugging needed
- sentry as a first option, free tier rather generous

observability
- +1 for event bus

first github action
- run tests and linters
- currently, trunk-based only development

documentation
- README.me updates

Open points
- [ ] firebase authentication: It is now three hours to deadly. I could crunch something together, but auth has many pitfalls and I would want to understand this.
- [ ] see "Questions to discuss" below
- [ ] text annotation
- [ ] YAGNI, but what else would the user desire? PDF editing to include annotations? Comments? Shared usage?

Time spent
- initial reading of the use case, a few questions pondered
- about eights hours in total development time
- two deep dive working periods separated by 1,5 days


---

## Questions to discuss
- PO focus
  - upload annotated or raw pdf's? Store annotations separately?
  - Do customers want to resume annotating? Does it have to be reproducible, e.g. for audit trails?
    - this could require an event messaging system, i.e., event store from which annotations are redone
  - Undo/Redo functionality?
  - local running or on cloud?
- Tech focus
  - API endpoint unclear -> intentionally bad? 
  - API "upload-pdf" endpoint not semantic, what if we also want to upload jpg (aka Fax scans)

## 20251028 Preparing interview

Coverage
- App.tsx not covered at all -> integration test?