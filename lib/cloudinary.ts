/**
 * Cloudinary upload utilities for the Palei Events admin dashboard.
 *
 * All uploads go through the unsigned "paleievents" preset so no API secret
 * is exposed to the browser. The cloud name is read from a public env var.
 *
 * Returned URLs use the Cloudinary CDN and can be passed directly to Next.js
 * <Image> (after adding res.cloudinary.com to next.config.mjs).
 */

export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "nn1rgvs7"

export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "paleievents"

/** Cloudinary upload-API endpoint (no secret needed for unsigned uploads). */
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

export interface CloudinaryUploadResult {
  /** Secure https CDN URL ready to store in Firestore */
  url: string
  /** Cloudinary public_id (useful for later transforms / deletions) */
  publicId: string
  width: number
  height: number
  format: string
  /** Original file name as shown in Cloudinary's media library */
  displayName: string
}

export interface UploadOptions {
  /** Optional folder path inside your Cloudinary account, e.g. "events/hero" */
  folder?: string
  /**
   * Target crop dimensions stored into the database.
   * When provided, the upload URL is transformed so Cloudinary delivers the
   * exact pixel size you requested (c_fill / ar transformation).
   */
  targetWidth?: number
  targetHeight?: number
}

/**
 * Upload a File (Blob) to Cloudinary using the unsigned preset.
 *
 * @param file  The File object to upload (from an <input type="file">).
 * @param opts  Optional folder path and target dimensions.
 * @returns     A resolved CloudinaryUploadResult on success.
 */
export async function uploadToCloudinary(
  file: File,
  opts: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  const { folder = "palei-events", targetWidth, targetHeight } = opts

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
  formData.append("folder", folder)
  // Note: use_filename / unique_filename are NOT allowed for unsigned uploads.
  // The "paleievents" preset has "use filename as display name: true" already set.

  const res = await fetch(UPLOAD_URL, { method: "POST", body: formData })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Cloudinary upload failed (${res.status}): ${body}`)
  }

  const data = await res.json()

  let url: string = data.secure_url as string

  // If the caller wants a specific output size, bake a Cloudinary
  // transformation into the URL so the stored URL always delivers the correct
  // dimensions (c_fill to avoid distortion).
  if (targetWidth && targetHeight) {
    // e.g. .../upload/c_fill,w_1920,h_1080/v.../file.jpg
    url = url.replace(
      "/upload/",
      `/upload/c_fill,w_${targetWidth},h_${targetHeight},q_auto,f_auto/`
    )
  } else {
    // Always add quality + format auto for best performance.
    url = url.replace("/upload/", "/upload/q_auto,f_auto/")
  }

  return {
    url,
    publicId: data.public_id as string,
    width: (data.width as number) ?? 0,
    height: (data.height as number) ?? 0,
    format: (data.format as string) ?? "",
    displayName: (data.display_name as string) ?? (data.original_filename as string) ?? "",
  }
}

/**
 * Convert a canvas-based crop result (blob URL or canvas) back to a File
 * so we can re-upload only the cropped region to Cloudinary.
 *
 * @param canvas  The HTMLCanvasElement produced by the crop modal.
 * @param fileName  Desired file name (without extension).
 */
export function canvasToFile(canvas: HTMLCanvasElement, fileName: string): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas toBlob returned null"))
        return
      }
      resolve(new File([blob], `${fileName}.jpg`, { type: "image/jpeg" }))
    }, "image/jpeg", 0.92)
  })
}
