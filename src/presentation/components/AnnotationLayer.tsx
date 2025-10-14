/**
 * AnnotationLayer Component
 *
 * Overlays the PDF with a Konva canvas for drawing annotations.
 * Stores annotations with normalized coordinates (0-1 relative to page).
 */

import type { JSX } from 'react';
import { useRef, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import Konva from 'konva';
import {
  type DrawAnnotation,
  type Point,
  type Color,
  normalizePoint,
} from '@domain/models/Annotation';
import { createDrawAnnotation, colorToRgba } from '@domain/models/Annotation';

interface AnnotationLayerProps {
  width: number;
  height: number;
  documentId: string;
  pageNumber: number;
  annotations: DrawAnnotation[];
  mode: 'draw' | 'select';
  onAnnotationCreate?: (annotation: DrawAnnotation) => void;
  onAnnotationDelete?: (annotationId: string) => void;
}

export function AnnotationLayer({
  width,
  height,
  documentId,
  pageNumber,
  annotations,
  mode,
  onAnnotationCreate,
  onAnnotationDelete,
}: AnnotationLayerProps): JSX.Element {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);
  const stageRef = useRef<Konva.Stage>(null);

  const currentColor: Color = { r: 239, g: 68, b: 68, a: 1 }; // Red
  const currentStrokeWidth = 0.003; // Normalized stroke width

  function handleMouseDown(e: Konva.KonvaEventObject<MouseEvent | TouchEvent>): void {
    if (mode === 'select') {
      // In select mode, check if clicking on an annotation
      const clickedShape = e.target;
      if (clickedShape instanceof Konva.Line && clickedShape.id()) {
        // Delete the clicked annotation
        if (onAnnotationDelete) {
          onAnnotationDelete(clickedShape.id());
        }
      }
      return;
    }

    // Draw mode
    setIsDrawing(true);
    const stage = stageRef.current;
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    setCurrentLine([normalizePoint(pos, width, height)]);
  }

  function handleMouseMove(): void {
    if (!isDrawing) return;

    const stage = stageRef.current;
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    setCurrentLine((prev) => [...prev, normalizePoint(pos, width, height)]);
  }

  function handleMouseUp(): void {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentLine.length === 0) return;

    // Create annotation using domain model
    const annotation = createDrawAnnotation({
      documentId,
      pageNumber,
      points: currentLine,
      color: currentColor,
      strokeWidth: currentStrokeWidth,
    });

    setCurrentLine([]);

    // Notify parent component
    if (onAnnotationCreate) {
      onAnnotationCreate(annotation);
    }
  }

  // Convert normalized points back to canvas coordinates for rendering
  function denormalizePoints(points: Point[]): number[] {
    const result: number[] = [];
    for (const point of points) {
      result.push(point.x * width, point.y * height);
    }
    return result;
  }

  const cursorStyle = mode === 'draw' ? 'cursor-crosshair' : 'cursor-pointer';

  return (
    <div
      className={`absolute top-0 left-0 pointer-events-auto ${cursorStyle} border-2 border-blue-400 border-dashed border-opacity-30`}
      style={{ width, height }}
    >
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          {/* Render saved annotations */}
          {annotations.map((annotation) => (
            <Line
              key={annotation.id}
              id={annotation.id}
              points={denormalizePoints(annotation.points)}
              stroke={colorToRgba(annotation.color)}
              strokeWidth={annotation.strokeWidth * width}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation="source-over"
            />
          ))}

          {/* Render current drawing line */}
          {currentLine.length > 0 && (
            <Line
              points={denormalizePoints(currentLine)}
              stroke={colorToRgba(currentColor)}
              strokeWidth={currentStrokeWidth * width}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation="source-over"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
