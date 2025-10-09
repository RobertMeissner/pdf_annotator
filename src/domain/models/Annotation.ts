/**
 * Domain Model: Annotation
 *
 * Represents any type of annotation on a PDF document.
 * Uses discriminated union pattern for type safety.
 * Entity, will change often
 */

export type AnnotationType = 'draw' | 'text' | 'highlight';

export interface Point {
  x: number; // 0-1, relative to page width
  y: number; // 0-1, relative to page height
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number; // 0-1 (alpha/opacity)
}

interface BaseAnnotation {
  id: string;
  documentId: string;
  pageNumber: number; // 1-indexed
  createdAt: Date;
  updatedAt: Date;
  userId?: string; // Optional: for when auth is implemented
}

// ============================================================================
// Annotation Variants
// ============================================================================

/**
 * Freehand drawing annotation (Priority 1)
 */
export interface DrawAnnotation extends BaseAnnotation {
  type: 'draw';
  points: Point[];
  color: Color;
  strokeWidth: number; // Normalized to page dimensions (0-1)
}

export type Annotation = DrawAnnotation

// ============================================================================
// Type Guards
// ============================================================================

export function isDrawAnnotation(annotation: Annotation): annotation is DrawAnnotation {
  return annotation.type === 'draw';
}
