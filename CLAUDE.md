# PDF Annotation Platform - Claude Project Instructions

## Project Context
This is a fullstack case study project demonstrating senior-level React/TypeScript capabilities. The goal is to build an interactive PDF annotation platform with emphasis on excellent UX, clean architecture, and modern best practices.

**Timeline:** 72 hours
**Tech Stack:** Bun + Vite + React 18+ + TypeScript (strict)
**Architecture:** Hexagonal (Ports & Adapters) following CUPID/SOLID principles

---

## Core Requirements

### Must Have (Priority 1)
1. **PDF Rendering** - Display multi-page PDFs in browser
2. **Freehand Drawing** - Smooth annotation with <16ms latency
3. **File Upload** - Upload to `https://pdf.challenge.taxbier.de`

### Should Have (Priority 2)
4. Color picker and stroke width controls
5. Undo/redo functionality
6. Pan/zoom on PDF
7. Multiple pages support

### Could Have (Priority 3)
8. Authentication (Firebase)
9. Text annotations
10. Export annotated PDF

---

## Architecture Principles

### Hexagonal Architecture (Ports & Adapters)
```
domain/          → Pure business logic (no framework deps)
├── models/      → Entities (Annotation, PDFDocument)
├── ports/       → Interfaces (IAnnotationRepository, IPDFService)
└── services/    → Business logic

adapters/        → External implementations
├── repositories/→ InMemoryAnnotationRepository (PostgresAnnotationRepository later)
├── services/    → PDFJsService, UploadApiService
└── storage/     → Storage adapters

application/     → Use cases / orchestration
├── useCases/    → CreateAnnotation, LoadPDFDocument
└── dto/         → Data transfer objects

infrastructure/  → Framework config
├── di/          → Dependency injection container
└── config/      → App configuration

presentation/    → React UI layer
├── components/  → React components
├── hooks/       → Custom React hooks
└── contexts/    → React contexts
```

### SOLID Principles
- **S**ingle Responsibility: Each class/component has one reason to change
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Subtypes must be substitutable
- **I**nterface Segregation: Many specific interfaces over one general
- **D**ependency Inversion: Depend on abstractions (ports), not concretions

### CUPID Principles
- **C**omposable: Small, reusable pieces
- **U**nix Philosophy: Do one thing well
- **P**redictable: Consistent behavior
- **I**diomatic: Follow language conventions
- **D**omain-based: Model the business domain

---

## Technical Standards

### TypeScript
- **Strict mode enabled** - No `any` types
- All functions must have explicit return types
- Use discriminated unions for state
- Prefer `type` over `interface` for unions, `interface` for objects

### React Best Practices
- Functional components only (no classes)
- Custom hooks for complex logic
- Use `React.memo()` judiciously
- Proper error boundaries
- Loading/error states for async operations

### State Management
- Start with `useState`/`useReducer`
- Annotations state separate from UI state
- No prop drilling - use Context when needed
- Consider Zustand only if complexity demands it

### Performance Requirements
- Drawing must feel **<16ms latency (60fps)**
- Use `requestAnimationFrame` for canvas updates
- Lazy load PDF pages
- Debounce expensive operations

---

## Library Selection

### PDF Handling
**Choice: react-pdf (PDF.js wrapper)**
- ✅ Active maintenance
- ✅ Good TypeScript support
- ✅ Supports canvas overlays
- ✅ MIT licensed
- ⚠️ Large bundle size (~500KB)

*Alternatives considered:*
- PSPDFKit: Too expensive, overkill for this scope
- PDF.js directly: Too low-level, more work

### Drawing/Annotations
**Choice: Konva.js with react-konva**
- ✅ React-friendly
- ✅ Great performance
- ✅ Rich drawing APIs
- ✅ Good docs
- ⚠️ Learning curve

*Alternatives considered:*
- Fabric.js: More mature but not React-optimized
- Canvas API directly: Too much work for timeline

---

## Code Style Guidelines

### Naming Conventions
```typescript
// Components: PascalCase
export function PDFViewer() {}

// Hooks: camelCase with 'use' prefix
export function useAnnotations() {}

// Constants: SCREAMING_SNAKE_CASE
const MAX_FILE_SIZE = 10_000_000;

// Types/Interfaces: PascalCase
interface AnnotationData {}
type AnnotationType = 'draw' | 'text';

// Private methods: camelCase with underscore prefix
private _validateCoordinates() {}
```

### File Structure
```
Component.tsx       → Component + local types
Component.test.tsx  → Tests
Component.module.css → Styles (if not using Tailwind)
index.ts            → Barrel export
```

### Import Order
```typescript
// 1. External libraries
import React from 'react';
import { Stage, Layer } from 'react-konva';

// 2. Internal aliases (domain → adapters → application → presentation)
import { Annotation } from '@domain/models/Annotation';
import { InMemoryRepository } from '@adapters/repositories/InMemoryAnnotationRepository';

// 3. Relative imports
import { Button } from './Button';

// 4. Types
import type { AnnotationData } from '@domain/models/Annotation';

// 5. Styles
import './Component.css';
```

---

## Anti-Patterns to AVOID

❌ **Don't:**
- Use class components
- Use `any` type
- Store large data in localStorage
- Implement custom PDF renderer
- Add unnecessary dependencies
- Skip TypeScript types ("I'll add them later")
- Use inline styles (use Tailwind)
- Fetch inside components (use hooks)
- Hardcode repository (use DI container)

✅ **Do:**
- Functional components with hooks
- Proper TypeScript types everywhere
- In-memory storage (swappable via port)
- Use proven PDF library
- Minimal dependencies
- Type everything from the start
- Tailwind for styling
- Separate data fetching logic
- Inject dependencies via container

---

## Development Workflow

### Phase 1: Foundation (Day 1, Hours 1-8)
- [x] Project setup with Bun
- [ ] Install core dependencies
- [ ] Configure Tailwind, TypeScript paths
- [ ] Set up hexagonal structure
- [ ] Create domain models (Annotation)
- [ ] Create ports (IAnnotationRepository)
- [ ] Create adapter (InMemoryAnnotationRepository)
- [ ] Set up DI container

### Phase 2: Core Features (Day 1-2, Hours 9-32)
- [ ] PDF rendering with react-pdf
- [ ] Canvas overlay with Konva
- [ ] Drawing tool implementation
- [ ] Color picker component
- [ ] Stroke width control
- [ ] Save annotations to repository
- [ ] Load annotations from repository

### Phase 3: Upload & Polish (Day 2-3, Hours 33-56)
- [ ] File upload component
- [ ] Upload to API endpoint
- [ ] Error handling & validation
- [ ] Loading states
- [ ] Undo/redo implementation
- [ ] Pan/zoom functionality

### Phase 4: Final Polish (Day 3, Hours 57-72)
- [ ] Responsive design
- [ ] Edge case handling
- [ ] Performance optimization
- [ ] Documentation
- [ ] Demo preparation

---

## Testing Strategy

### Priority Testing
1. **Unit tests** - Domain models and services (critical)
2. **Integration tests** - Repository implementations (important)
3. **Manual testing** - Drawing UX (essential - automated canvas testing is complex)

### Test Files Location
```
src/domain/models/Annotation.test.ts
src/adapters/repositories/InMemoryAnnotationRepository.test.ts
```

---

## Questions to Ask Me

Before implementing features, please confirm:

1. **Scope clarification** - "Should I implement text annotations now or focus on drawing first?"
2. **Architecture decisions** - "For this use case, should we use Context or prop drilling?"
3. **Library choices** - "I'm considering X vs Y for feature Z, which aligns better with our goals?"
4. **Performance trade-offs** - "This approach is simpler but 20% slower, is that acceptable?"

---

## When Helping Me

### Always Provide
- Complete, working code (not snippets)
- Explanation of WHY, not just WHAT
- Edge cases to consider
- TypeScript types
- Performance implications

### Code Format
```typescript
// ✅ Good - Complete with types and error handling
export function useAnnotations(documentId: string) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadAnnotations = async () => {
      try {
        setLoading(true);
        const repo = getContainer().getAnnotationRepository();
        const result = await repo.findByDocument(documentId);
        setAnnotations(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadAnnotations();
  }, [documentId]);

  return { annotations, loading, error };
}
```

---

## Success Criteria

### Code Quality
- ✅ All code strictly typed (no `any`)
- ✅ SOLID/CUPID principles followed
- ✅ Clean separation of concerns
- ✅ Proper error handling

### Functionality
- ✅ PDF renders smoothly
- ✅ Drawing feels responsive (<16ms)
- ✅ Annotations persist in memory
- ✅ Upload works reliably

### Architecture
- ✅ Can swap InMemory → Postgres by changing one line in DI container
- ✅ Domain logic has zero React imports
- ✅ Components are small and focused

---

## Current Status

**Last Updated:** [Date]

**Completed:**
- [x] Project initialized with Bun
- [ ] Dependencies installed
- [ ] ...

**In Progress:**
- [ ] ...

**Blocked:**
- [ ] ...

**Next Steps:**
- [ ] ...

---

## Useful Commands

```bash
# Development
bun run dev

# Build
bun run build

# Preview production build
bun run preview

# Type check
bun run tsc --noEmit

# Add dependency
bun add <package>

# Add dev dependency
bun add -d <package>
```

---

## Notes & Decisions

### Decision Log
| Date | Decision | Rationale | Trade-offs |
|------|----------|-----------|------------|
| 2025-10-09 | Use Bun instead of npm | Faster installs, modern tooling | Less mature ecosystem |
| 2025-10-09 | Hexagonal architecture | Easy to swap implementations | More initial setup |
| 2025-10-09 | In-memory storage first | Fast to implement, meets timeline | No persistence between sessions |

---