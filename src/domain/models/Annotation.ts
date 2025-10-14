/**
 * Domain Model: Annotation
 *
 * Represents any type of annotation on a PDF document.
 * Uses discriminated union pattern for type safety.
 * Entity, will change often
 */
import type Konva from 'konva';

export type AnnotationType = 'draw' | 'text' | 'highlight';

export interface Point {
  readonly x: number; // 0-1, relative to page width
  readonly y: number; // 0-1, relative to page height
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

export type Annotation = DrawAnnotation;

// ============================================================================
// Type Guards
// ============================================================================

export function isDrawAnnotation(annotation: Annotation): annotation is DrawAnnotation {
  // FIXME: eslint error
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return annotation.type === 'draw';
}

// ============================================================================
// Factory Functions
// ============================================================================

export function createDrawAnnotation(
  params: Omit<DrawAnnotation, 'id' | 'createdAt' | 'updatedAt' | 'type'>
): DrawAnnotation {
  const now = new Date();
  return {
    ...params,
    type: 'draw',
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

function generateId(): string {
  return `${Date.now().toString()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function colorToRgba(color: Color): string {
  return `rgba(${color.r.toString()}, ${color.g.toString()}, ${color.b.toString()}, ${color.a.toString()})`;
}

export function normalizePoint(pos: Konva.Vector2d, width: number, height: number): Point {
  const clampedPosition: Point = {
    x: pos.x / width,
    y: pos.y / height,
  };
  return {
    x: Math.max(0, Math.min(1, clampedPosition.x)),
    y: Math.max(0, Math.min(1, clampedPosition.y)),
  };
}
