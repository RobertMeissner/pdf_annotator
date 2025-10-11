/**
 * Tests for Annotation Domain Model
 *
 * Testing pure business logic and domain functions.
 */

import { describe, it, expect } from 'vitest';
import {
  createDrawAnnotation,
  colorToRgba,
  isDrawAnnotation,
  type Color,
  type Point,
} from './Annotation';

describe('Annotation Domain Model', () => {
  describe('createDrawAnnotation', () => {
    it('should create a valid draw annotation with all required fields', () => {
      const points: Point[] = [
        { x: 0.1, y: 0.2 },
        { x: 0.3, y: 0.4 },
      ];
      const color: Color = { r: 255, g: 0, b: 0, a: 1 };

      const annotation = createDrawAnnotation({
        documentId: 'test-doc-123',
        pageNumber: 1,
        points,
        color,
        strokeWidth: 0.003,
      });

      expect(annotation.type).toBe('draw');
      expect(annotation.documentId).toBe('test-doc-123');
      expect(annotation.pageNumber).toBe(1);
      expect(annotation.points).toEqual(points);
      expect(annotation.color).toEqual(color);
      expect(annotation.strokeWidth).toBe(0.003);
      expect(annotation.id).toBeDefined();
      expect(annotation.createdAt).toBeInstanceOf(Date);
      expect(annotation.updatedAt).toBeInstanceOf(Date);
    });

    it('should generate unique IDs for different annotations', () => {
      const annotation = {
        documentId: 'doc-1',
        pageNumber: 1,
        points: [{ x: 0, y: 0 }],
        color: { r: 0, g: 0, b: 0, a: 1 },
        strokeWidth: 0.003,
      };
      const annotation1 = createDrawAnnotation(annotation);
      const annotation2 = createDrawAnnotation(annotation);

      expect(annotation1.id).not.toBe(annotation2.id);
    });

    it('should set createdAt and updatedAt to same time on creation', () => {
      const annotation = createDrawAnnotation({
        documentId: 'test-doc',
        pageNumber: 1,
        points: [{ x: 0.5, y: 0.5 }],
        color: { r: 100, g: 100, b: 100, a: 0.8 },
        strokeWidth: 0.005,
      });

      expect(annotation.createdAt.getTime()).toBe(annotation.updatedAt.getTime());
    });

    it('should accept optional userId', () => {
      const annotation = createDrawAnnotation({
        documentId: 'test-doc',
        pageNumber: 1,
        points: [{ x: 0.5, y: 0.5 }],
        color: { r: 100, g: 100, b: 100, a: 0.8 },
        strokeWidth: 0.005,
        userId: 'user-123',
      });

      expect(annotation.userId).toBe('user-123');
    });
  });

  describe('colorToRgba', () => {
    it('should convert color to rgba string with partial opacity', () => {
      const color: Color = { r: 0, g: 128, b: 255, a: 0.5 };
      const result = colorToRgba(color);

      expect(result).toBe('rgba(0, 128, 255, 0.5)');
    });
  });

  describe('isDrawAnnotation', () => {
    it('should return true for draw annotations', () => {
      const annotation = createDrawAnnotation({
        documentId: 'test-doc',
        pageNumber: 1,
        points: [{ x: 0.5, y: 0.5 }],
        color: { r: 100, g: 100, b: 100, a: 0.8 },
        strokeWidth: 0.005,
      });

      expect(isDrawAnnotation(annotation)).toBe(true);
    });
  });
});
