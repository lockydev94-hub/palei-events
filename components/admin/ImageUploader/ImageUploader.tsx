"use client"

/**
 * ImageUploader — reusable admin component for uploading images to Cloudinary.
 *
 * Features:
 *  • Drag-and-drop or click-to-browse file selection
 *  • Image crop & resize modal (uses native Canvas — no extra deps)
 *  • Cloudinary unsigned upload with progress indicator
 *  • Shows current image preview with remove/replace buttons
 *  • Returns the final Cloudinary URL to the parent via `onUpload`
 *
 * Usage:
 *   <ImageUploader
 *     value={form.heroImage}
 *     onUpload={(url) => updateField("heroImage", url)}
 *     label="Hero Image"
 *     folder="events/hero"
 *     aspectRatio={16 / 9}
 *     targetWidth={1920}
 *     targetHeight={1080}
 *   />
 */

import { useCallback, useRef, useState, useEffect } from "react"
import { uploadToCloudinary, canvasToFile } from "@/lib/cloudinary"
import { Upload, X, ImageIcon, Loader2, Crop, ZoomIn, ZoomOut, RotateCcw, Check } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

interface PixelCrop extends CropArea {}

export interface ImageUploaderProps {
  /** Current image URL (Cloudinary or any URL). Shown as preview. */
  value?: string
  /** Called when the upload completes with the new Cloudinary URL. */
  onUpload: (url: string, publicId?: string) => void
  /** Field label shown above the uploader. */
  label?: string
  /** Cloudinary folder path, e.g. "events/hero". Defaults to "palei-events". */
  folder?: string
  /**
   * Desired aspect ratio for the crop tool.
   * Pass 16/9 for landscape hero, 1 for avatar, 4/3 for gallery thumb, etc.
   * When undefined, free-form cropping is enabled.
   */
  aspectRatio?: number
  /** Output pixel width stored to Cloudinary. Default: 1920 */
  targetWidth?: number
  /** Output pixel height stored to Cloudinary. Default: calculated from aspectRatio */
  targetHeight?: number
  /** Max file size in MB. Default: 10 */
  maxSizeMB?: number
  /** Whether upload is disabled */
  disabled?: boolean
  /** Hint text shown below the dropzone */
  hint?: string
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ImageUploader({
  value,
  onUpload,
  label,
  folder = "palei-events",
  aspectRatio,
  targetWidth = 1920,
  targetHeight,
  maxSizeMB = 10,
  disabled = false,
  hint,
}: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cropModal, setCropModal] = useState<{
    file: File
    objectUrl: string
  } | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  // Computed target height from aspectRatio if not explicitly provided
  const effectiveTargetHeight = targetHeight ?? (aspectRatio ? Math.round(targetWidth / aspectRatio) : undefined)

  function openPicker() {
    if (disabled || uploading) return
    inputRef.current?.click()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (disabled || uploading) return
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    // Reset input so same file can be re-selected
    e.target.value = ""
  }

  function processFile(file: File) {
    setError(null)
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WebP, GIF, etc.)")
      return
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB} MB.`)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setCropModal({ file, objectUrl })
  }

  async function handleCropComplete(croppedCanvas: HTMLCanvasElement) {
    if (!cropModal) return
    setCropModal(null)
    setUploading(true)
    setError(null)
    try {
      const croppedFile = await canvasToFile(croppedCanvas, cropModal.file.name.replace(/\.[^.]+$/, ""))
      const result = await uploadToCloudinary(croppedFile, {
        folder,
        targetWidth,
        targetHeight: effectiveTargetHeight,
      })
      onUpload(result.url, result.publicId)
    } catch (err: any) {
      setError(err.message ?? "Upload failed")
    } finally {
      setUploading(false)
      URL.revokeObjectURL(cropModal.objectUrl)
    }
  }

  function handleCropCancel() {
    if (cropModal) URL.revokeObjectURL(cropModal.objectUrl)
    setCropModal(null)
  }

  function handleRemove() {
    onUpload("")
    setError(null)
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-gold-light/60 text-xs font-medium">{label}</label>
      )}

      {/* Current image preview */}
      {value && !uploading && (
        <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-navy-dark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded"
            className="w-full max-h-56 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={openPicker}
              className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-light text-navy-dark rounded-md px-3 py-1.5 text-xs font-semibold"
            >
              <Upload className="h-3.5 w-3.5" />
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-md px-3 py-1.5 text-xs font-semibold"
            >
              <X className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Drop zone — hidden when we have a preview */}
      {(!value || uploading) && (
        <div
          onClick={openPicker}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors cursor-pointer min-h-[120px] px-4 py-6
            ${dragOver ? "border-gold/60 bg-gold/5" : "border-white/10 hover:border-gold/30 hover:bg-white/[0.02]"}
            ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
              <p className="text-xs text-gold-light/60">Uploading to Cloudinary…</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-gold" />
              </div>
              <div className="text-center">
                <p className="text-sm text-gold-light/70">
                  <span className="text-gold font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gold-light/40 mt-0.5">
                  {hint ?? `JPG, PNG, WebP, GIF up to ${maxSizeMB} MB`}
                </p>
                {(aspectRatio || (targetWidth && effectiveTargetHeight)) && (
                  <p className="text-[10px] text-gold-light/30 mt-1">
                    Will be cropped to{" "}
                    {targetWidth}×{effectiveTargetHeight ?? "auto"}px
                    {aspectRatio ? ` (${aspectRatio.toFixed(2)}:1 ratio)` : ""}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <X className="h-3 w-3" />
          {error}
        </p>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || uploading}
      />

      {/* Crop modal */}
      {cropModal && (
        <CropModal
          src={cropModal.objectUrl}
          aspectRatio={aspectRatio}
          targetWidth={targetWidth}
          targetHeight={effectiveTargetHeight}
          onComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  )
}

// ─── Crop Modal ───────────────────────────────────────────────────────────────

interface CropModalProps {
  src: string
  aspectRatio?: number
  targetWidth: number
  targetHeight?: number
  onComplete: (canvas: HTMLCanvasElement) => void
  onCancel: () => void
}

function CropModal({
  src,
  aspectRatio,
  targetWidth,
  targetHeight,
  onComplete,
  onCancel,
}: CropModalProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imgLoaded, setImgLoaded] = useState(false)
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 })
  const [containerSize, setContainerSize] = useState({ w: 600, h: 400 })

  // Effective crop box size (in container/display pixels)
  const cropBoxW = containerSize.w
  const cropBoxH = aspectRatio ? Math.round(containerSize.w / aspectRatio) : containerSize.h

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setContainerSize({ w: el.clientWidth, h: el.clientHeight })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  function onImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
    setImgLoaded(true)
    // Start fully centered
    setOffset({ x: 0, y: 0 })
    setZoom(1)
  }

  // The rendered image dimensions at current zoom.
  // Guard against naturalSize being 0 before the image loads (would produce NaN).
  const scale =
    naturalSize.w > 0 && naturalSize.h > 0
      ? Math.max(cropBoxW / naturalSize.w, cropBoxH / naturalSize.h)
      : 1
  const renderedW = naturalSize.w > 0 ? naturalSize.w * scale * zoom : cropBoxW
  const renderedH = naturalSize.h > 0 ? naturalSize.h * scale * zoom : cropBoxH

  // Clamp offset so the crop box is always covered by the image
  function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max)
  }
  const clampedX = clamp(offset.x, -(renderedW - cropBoxW) / 2, (renderedW - cropBoxW) / 2)
  const clampedY = clamp(offset.y, -(renderedH - cropBoxH) / 2, (renderedH - cropBoxH) / 2)

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging) return
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }

  function onMouseUp() {
    if (isDragging) {
      setIsDragging(false)
      setOffset({ x: clampedX, y: clampedY })
    }
  }

  function onWheel(e: React.WheelEvent) {
    e.preventDefault()
    setZoom((z) => clamp(z - e.deltaY * 0.001, 0.5, 4))
  }

  function reset() {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  function apply() {
    if (!imgRef.current || !imgLoaded) return
    const outW = targetWidth
    const outH = targetHeight ?? Math.round(targetWidth / (aspectRatio ?? (naturalSize.w / naturalSize.h)))

    const canvas = document.createElement("canvas")
    canvas.width = outW
    canvas.height = outH
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Map from container crop coords back to natural image coords
    // Center of crop box in rendered image space:
    const centerInRenderedX = renderedW / 2 - clampedX
    const centerInRenderedY = renderedH / 2 - clampedY

    // Half-dimensions of crop box in rendered pixels
    const halfCropW = cropBoxW / 2
    const halfCropH = cropBoxH / 2

    // Convert to natural image pixels
    const naturalPxPerRendered = naturalSize.w / renderedW
    const srcX = (centerInRenderedX - halfCropW) * naturalPxPerRendered
    const srcY = (centerInRenderedY - halfCropH) * naturalPxPerRendered
    const srcW = cropBoxW * naturalPxPerRendered
    const srcH = cropBoxH * naturalPxPerRendered

    ctx.drawImage(
      imgRef.current,
      Math.max(0, srcX),
      Math.max(0, srcY),
      Math.min(srcW, naturalSize.w - Math.max(0, srcX)),
      Math.min(srcH, naturalSize.h - Math.max(0, srcY)),
      0,
      0,
      outW,
      outH
    )

    onComplete(canvas)
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <div className="bg-navy-dark border border-white/10 rounded-2xl overflow-hidden w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Crop className="h-4 w-4 text-gold" />
            <h3 className="text-sm font-semibold text-gold-light">Crop & Resize Image</h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-gold-light/50">
            {aspectRatio && (
              <span className="bg-gold/10 text-gold px-2 py-0.5 rounded-full text-[10px] font-semibold">
                {aspectRatio === 16 / 9 ? "16:9"
                  : aspectRatio === 4 / 3 ? "4:3"
                  : aspectRatio === 1 ? "1:1"
                  : aspectRatio === 3 / 2 ? "3:2"
                  : `${aspectRatio.toFixed(2)}:1`}
              </span>
            )}
            <span>→ {targetWidth}×{targetHeight ?? "auto"}px</span>
          </div>
        </div>

        {/* Crop area */}
        <div
          ref={containerRef}
          className="relative overflow-hidden bg-black/60 select-none"
          style={{ height: Math.min(aspectRatio ? Math.round(600 / aspectRatio) : 400, 400) }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onWheel={onWheel}
        >
          {/* Crop guide overlay */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Rule of thirds grid */}
            <div className="absolute inset-0 border border-gold/20">
              <div className="absolute left-1/3 top-0 bottom-0 border-l border-white/10" />
              <div className="absolute left-2/3 top-0 bottom-0 border-l border-white/10" />
              <div className="absolute top-1/3 left-0 right-0 border-t border-white/10" />
              <div className="absolute top-2/3 left-0 right-0 border-t border-white/10" />
            </div>
          </div>

          {/* The image — hidden until onLoad fires so width/height are never NaN */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={src}
            alt="Crop preview"
            onLoad={onImgLoad}
            draggable={false}
            className="absolute"
            style={
              imgLoaded
                ? {
                    width: renderedW,
                    height: renderedH,
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${clampedX}px), calc(-50% + ${clampedY}px))`,
                    cursor: isDragging ? "grabbing" : "grab",
                    userSelect: "none",
                  }
                : {
                    // Invisible while loading — avoids NaN width/height in the DOM
                    visibility: "hidden",
                    position: "absolute",
                    width: 0,
                    height: 0,
                  }
            }
          />

          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="px-5 py-3 border-t border-white/5 flex items-center gap-4">
          {/* Zoom controls */}
          <div className="flex items-center gap-2 flex-1">
            <button
              type="button"
              onClick={() => setZoom((z) => clamp(z - 0.1, 0.5, 4))}
              className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-gold-light/70 hover:text-gold-light transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <input
              type="range"
              min={50}
              max={400}
              value={Math.round(zoom * 100)}
              onChange={(e) => setZoom(Number(e.target.value) / 100)}
              className="flex-1 accent-gold h-1 cursor-pointer"
              aria-label="Zoom"
            />
            <button
              type="button"
              onClick={() => setZoom((z) => clamp(z + 0.1, 0.5, 4))}
              className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-gold-light/70 hover:text-gold-light transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <span className="text-xs text-gold-light/40 w-10 text-right tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={reset}
              className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-gold-light/70 hover:text-gold-light transition-colors ml-1"
              title="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gold-light/60 hover:text-gold-light transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={apply}
              disabled={!imgLoaded}
              className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-light text-navy-dark font-semibold rounded-lg px-4 py-2 text-sm transition-colors disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              Apply & Upload
            </button>
          </div>
        </div>

        {/* Tip */}
        <p className="px-5 pb-3 text-[10px] text-gold-light/30">
          Drag to reposition • Scroll or use slider to zoom • Image will be saved at {targetWidth}×{targetHeight ?? "auto"}px
        </p>
      </div>
    </div>
  )
}
