import type { JSX, CSSProperties, RefObject } from "react";
import { useState, useRef, useMemo } from "react";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical, RotateCw, Archive, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { useLanguage } from "@/hooks/useLanguage";
import type { InventoryCabinetNode, CanvasPosition, CabinetRotation } from "@/types/inventory";

// ── Constants ─────────────────────────────────────────────────────────────────

export const CANVAS_HEIGHT = 420;
const ROTATIONS: CabinetRotation[] = [0, 90, 180, 270];

// Padding between cabinets and the canvas edge (drag clamping + auto-placement)
const CANVAS_PADDING = 12;
// Margin between cabinets in the placement scan
const PLACEMENT_MARGIN = CANVAS_PADDING;
// Snap step matches the dot-grid spacing
const SNAP_STEP = 20;
// Conservative canvas width used for the placement scan
const SCAN_CANVAS_W = 900;

// ── Text-based minimum size ───────────────────────────────────────────────────

export function computeMinDimensions(
  cabinet: InventoryCabinetNode,
  shelvesLabel: string
): { width: number; height: number } {
  const shelvesText = `${cabinet.shelves.length} ${shelvesLabel}`;

  let nameW = cabinet.name.length * 6.5;
  let codeW = cabinet.code.length * 5.5;
  let shelvesW = shelvesText.length * 5.5;

  try {
    const ctx = document.createElement("canvas").getContext("2d");
    if (ctx) {
      ctx.font = "600 11px ui-sans-serif,system-ui,sans-serif";
      nameW = ctx.measureText(cabinet.name).width;
      ctx.font = "9px ui-sans-serif,system-ui,sans-serif";
      codeW = ctx.measureText(cabinet.code).width;
      shelvesW = ctx.measureText(shelvesText).width;
    }
  } catch {
    // keep character-width fallback above
  }

  // 32 px horizontal padding + 12 px extra buffer; clamp ≥ 60 for buttons
  const minW = Math.max(60, Math.ceil(Math.max(nameW, codeW, shelvesW)) + 44);
  // Fixed height: icon + 3 text lines + top-button zone + bottom-handle zone + gaps
  const minH = 100;

  return { width: minW, height: minH };
}

// ── Placement helpers ─────────────────────────────────────────────────────────

function rectsOverlap(
  a: { posX: number; posY: number; width: number; height: number },
  b: { posX: number; posY: number; width: number; height: number },
  margin: number
): boolean {
  return (
    a.posX < b.posX + b.width + margin &&
    a.posX + a.width + margin > b.posX &&
    a.posY < b.posY + b.height + margin &&
    a.posY + a.height + margin > b.posY
  );
}

function findFreeSpot(
  width: number,
  height: number,
  occupied: Array<{ posX: number; posY: number; width: number; height: number }>
): { posX: number; posY: number } {
  for (let y = PLACEMENT_MARGIN; y + height <= CANVAS_HEIGHT - PLACEMENT_MARGIN; y += SNAP_STEP) {
    for (let x = PLACEMENT_MARGIN; x + width <= SCAN_CANVAS_W; x += SNAP_STEP) {
      const candidate = { posX: x, posY: y, width, height };
      if (!occupied.some((o) => rectsOverlap(candidate, o, PLACEMENT_MARGIN))) {
        return { posX: x, posY: y };
      }
    }
  }
  // Fallback: stack below everything placed so far
  const maxBottom = occupied.reduce((m, o) => Math.max(m, o.posY + o.height), 0);
  return { posX: PLACEMENT_MARGIN, posY: maxBottom + PLACEMENT_MARGIN };
}

// ── Rotation clamp ────────────────────────────────────────────────────────────

function clampAfterRotate(
  posX: number,
  posY: number,
  width: number,
  height: number,
  rotation: CabinetRotation,
  canvasW: number,
  canvasH: number,
  pad: number = CANVAS_PADDING
): { posX: number; posY: number } {
  // transformOrigin:center — for 90/270 the visual W/H swap
  const isSwapped = rotation === 90 || rotation === 270;
  const visW = isSwapped ? height : width;
  const visH = isSwapped ? width : height;
  const cx = Math.max(visW / 2 + pad, Math.min(canvasW - visW / 2 - pad, posX + width / 2));
  const cy = Math.max(visH / 2 + pad, Math.min(canvasH - visH / 2 - pad, posY + height / 2));
  return { posX: Math.round(cx - width / 2), posY: Math.round(cy - height / 2) };
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface DraggableCabinetProps {
  cabinet: InventoryCabinetNode;
  position: CanvasPosition;
  isSelected: boolean;
  canvasRef: RefObject<HTMLDivElement>;
  onCabinetClick: (cabinet: InventoryCabinetNode) => void;
  onRotateRequest: (
    uuid: string,
    rotation: CabinetRotation,
    pos: { posX: number; posY: number }
  ) => void;
  onResizeEnd: (uuid: string, width: number, height: number) => void;
}

interface Props {
  cabinets: InventoryCabinetNode[];
  localPositions: Record<string, CanvasPosition>;
  selectedCabinetUuid: string | null;
  isLoading: boolean;
  onCabinetClick: (cabinet: InventoryCabinetNode) => void;
  onPositionChange: (uuid: string, pos: { posX: number; posY: number }) => void;
  onRotate: (
    uuid: string,
    rotation: CabinetRotation,
    pos: { posX: number; posY: number }
  ) => void;
  onSizeChange: (uuid: string, width: number, height: number) => void;
}

// ── Draggable cabinet card ────────────────────────────────────────────────────

function DraggableCabinet({
  cabinet,
  position,
  isSelected,
  canvasRef,
  onCabinetClick,
  onRotateRequest,
  onResizeEnd,
}: DraggableCabinetProps): JSX.Element {
  const { t } = useLanguage();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: cabinet.uuid,
  });

  // Compute per-cabinet minimum once; recompute only when text content changes
  const minDims = useMemo(
    () => computeMinDimensions(cabinet, t.inventoryShelvesLabel),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cabinet.name, cabinet.code, cabinet.shelves.length, t.inventoryShelvesLabel]
  );

  // Live resize delta — reset on pointer-up
  const [resizeDelta, setResizeDelta] = useState({ dw: 0, dh: 0 });
  const resizeStartRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  const effectiveW = Math.max(minDims.width, position.width + resizeDelta.dw);
  const effectiveH = Math.max(minDims.height, position.height + resizeDelta.dh);

  const dragTranslate = transform ? `translate3d(${transform.x}px,${transform.y}px,0)` : "";
  const rotateDeg = `rotate(${position.rotation}deg)`;

  const style: CSSProperties = {
    position: "absolute",
    left: position.posX,
    top: position.posY,
    width: effectiveW,
    height: effectiveH,
    transform: `${dragTranslate} ${rotateDeg}`.trim(),
    transformOrigin: "center",
    zIndex: isDragging ? 50 : "auto",
    touchAction: "none",
  };

  // ── Rotate ──────────────────────────────────────────────────────────────────
  function handleRotateClick(e: React.MouseEvent): void {
    e.stopPropagation();
    const nextRotation = ROTATIONS[(ROTATIONS.indexOf(position.rotation) + 1) % ROTATIONS.length];
    const canvas = canvasRef.current;
    if (canvas) {
      const { width: cW, height: cH } = canvas.getBoundingClientRect();
      const clamped = clampAfterRotate(
        position.posX, position.posY,
        effectiveW, effectiveH,
        nextRotation, cW, cH
      );
      onRotateRequest(cabinet.uuid, nextRotation, clamped);
    } else {
      onRotateRequest(cabinet.uuid, nextRotation, { posX: position.posX, posY: position.posY });
    }
  }

  // ── Resize ──────────────────────────────────────────────────────────────────
  function handleResizePointerDown(e: React.PointerEvent): void {
    e.stopPropagation();
    e.preventDefault();
    const canvas = canvasRef.current;
    const maxW = canvas ? canvas.clientWidth - position.posX : 99999;
    const maxH = canvas ? canvas.clientHeight - position.posY : 99999;
    resizeStartRef.current = { x: e.clientX, y: e.clientY, w: position.width, h: position.height };

    function onMove(ev: PointerEvent): void {
      if (!resizeStartRef.current) return;
      const rawDw = ev.clientX - resizeStartRef.current.x;
      const rawDh = ev.clientY - resizeStartRef.current.y;
      setResizeDelta({
        dw: Math.max(minDims.width - resizeStartRef.current.w, Math.min(maxW - resizeStartRef.current.w, rawDw)),
        dh: Math.max(minDims.height - resizeStartRef.current.h, Math.min(maxH - resizeStartRef.current.h, rawDh)),
      });
    }

    function onUp(ev: PointerEvent): void {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (!resizeStartRef.current) return;
      const finalW = Math.round(
        Math.max(minDims.width, Math.min(maxW, resizeStartRef.current.w + (ev.clientX - resizeStartRef.current.x)))
      );
      const finalH = Math.round(
        Math.max(minDims.height, Math.min(maxH, resizeStartRef.current.h + (ev.clientY - resizeStartRef.current.y)))
      );
      onResizeEnd(cabinet.uuid, finalW, finalH);
      setResizeDelta({ dw: 0, dh: 0 });
      resizeStartRef.current = null;
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onCabinetClick(cabinet)}
      className={cn(
        "rounded-lg border-2 flex flex-col items-center justify-center gap-0.5 select-none cursor-pointer transition-colors",
        "bg-card dark:bg-card/80",
        isSelected
          ? "border-primary ring-2 ring-primary/30 shadow-md"
          : "border-border hover:border-primary/50 hover:shadow-sm",
        isDragging && "opacity-80 shadow-xl",
        cabinet.status === "INACTIVE" && "opacity-50"
      )}
    >
      {/* Rotate — top left */}
      <button
        title={t.inventoryRotate}
        className="absolute top-1 left-1 p-0.5 rounded hover:bg-muted text-muted-foreground transition-colors"
        onClick={handleRotateClick}
      >
        <RotateCw size={11} />
      </button>

      {/* Drag handle — top right */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 right-1 cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-muted text-muted-foreground transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical size={11} />
      </div>

      {/* Content */}
      <Archive size={16} className="text-muted-foreground" />
      <span className="text-[11px] font-semibold text-center px-4 leading-tight mt-0.5 whitespace-nowrap">
        {cabinet.name}
      </span>
      <span className="text-[9px] text-muted-foreground whitespace-nowrap">{cabinet.code}</span>
      <span className="text-[9px] text-muted-foreground mt-0.5 whitespace-nowrap">
        {cabinet.shelves.length} {t.inventoryShelvesLabel}
      </span>

      {/* Resize handle — bottom right */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end pb-0.5 pr-0.5"
        onPointerDown={handleResizePointerDown}
        onClick={(e) => e.stopPropagation()}
      >
        <svg width="8" height="8" viewBox="0 0 8 8" className="text-muted-foreground/60">
          <path d="M0 8L8 0M4 8L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

// ── Canvas ────────────────────────────────────────────────────────────────────

export function InventoryCanvas({
  cabinets,
  localPositions,
  selectedCabinetUuid,
  isLoading,
  onCabinetClick,
  onPositionChange,
  onRotate,
  onSizeChange,
}: Props): JSX.Element {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLDivElement>(null);

  function handleDragEnd(event: DragEndEvent): void {
    const { active, delta } = event;
    const uuid = active.id as string;
    const prev = localPositions[uuid];
    if (!prev) return;
    const canvas = canvasRef.current;
    const canvasW = canvas ? canvas.clientWidth : 99999;
    const canvasH = canvas ? canvas.clientHeight : 99999;

    // When rotated 90/270° the visual W/H swap relative to CSS left/top.
    // The CSS top/left anchors the *unrotated* rect; transformOrigin:center means
    // the visual edges extend symmetrically around the center, so minimum valid
    // posY = visH/2 - height/2 (can be negative for tall-narrow rotated cabinets).
    const isSwapped = prev.rotation === 90 || prev.rotation === 270;
    const visW = isSwapped ? prev.height : prev.width;
    const visH = isSwapped ? prev.width : prev.height;
    const pad = CANVAS_PADDING;
    const minX = Math.round((visW - prev.width)  / 2) + pad;
    const minY = Math.round((visH - prev.height) / 2) + pad;
    const maxX = Math.round(canvasW - (prev.width  + visW) / 2) - pad;
    const maxY = Math.round(canvasH - (prev.height + visH) / 2) - pad;

    onPositionChange(uuid, {
      posX: Math.round(Math.max(minX, Math.min(maxX, prev.posX + delta.x))),
      posY: Math.round(Math.max(minY, Math.min(maxY, prev.posY + delta.y))),
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height: CANVAS_HEIGHT }}>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (cabinets.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-muted-foreground px-6 text-center"
        style={{ height: CANVAS_HEIGHT }}
      >
        {t.inventoryNoCabinets}
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToParentElement]}>
      <div
        ref={canvasRef}
        className="relative bg-muted/20 overflow-hidden"
        style={{ height: CANVAS_HEIGHT }}
      >
        {/* Dot-grid — inset by CANVAS_PADDING to show the padded border area */}
        <div
          className="absolute pointer-events-none opacity-30 dark:opacity-20"
          style={{
            inset: CANVAS_PADDING,
            backgroundImage: "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {cabinets.map((cabinet) => {
          const pos = localPositions[cabinet.uuid];
          if (!pos) return null;
          return (
            <DraggableCabinet
              key={cabinet.uuid}
              cabinet={cabinet}
              position={pos}
              isSelected={selectedCabinetUuid === cabinet.uuid}
              canvasRef={canvasRef}
              onCabinetClick={onCabinetClick}
              onRotateRequest={onRotate}
              onResizeEnd={onSizeChange}
            />
          );
        })}
      </div>
    </DndContext>
  );
}

// ── Default position builder ──────────────────────────────────────────────────
// Pass existingPositions to avoid overlap with already-placed cabinets.

export function buildDefaultPositions(
  cabinets: InventoryCabinetNode[],
  shelvesLabel: string = "shelves",
  existingPositions: Record<string, CanvasPosition> = {}
): Record<string, CanvasPosition> {
  const result: Record<string, CanvasPosition> = {};

  // Seed occupied list from already-placed cabinets
  const occupied: Array<{ posX: number; posY: number; width: number; height: number }> =
    Object.values(existingPositions).map(({ posX, posY, width, height }) => ({
      posX, posY, width, height,
    }));

  // First: cabinets with saved positions from the backend
  for (const cab of cabinets) {
    if (cab.posX === null || cab.posY === null) continue;
    const dims = computeMinDimensions(cab, shelvesLabel);
    const w = cab.width ?? dims.width;
    const h = cab.height ?? dims.height;
    result[cab.uuid] = {
      posX: cab.posX, posY: cab.posY,
      width: w, height: h,
      rotation: (cab.rotation ?? 0) as CabinetRotation,
    };
    occupied.push({ posX: cab.posX, posY: cab.posY, width: w, height: h });
  }

  // Second: cabinets with no saved position — find a free spot
  for (const cab of cabinets) {
    if (cab.posX !== null && cab.posY !== null) continue;
    const dims = computeMinDimensions(cab, shelvesLabel);
    const spot = findFreeSpot(dims.width, dims.height, occupied);
    result[cab.uuid] = { ...spot, width: dims.width, height: dims.height, rotation: 0 };
    occupied.push({ ...spot, width: dims.width, height: dims.height });
  }

  return result;
}
