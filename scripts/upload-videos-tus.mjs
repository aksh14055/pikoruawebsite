// scripts/upload-videos-tus.mjs
// Uses TUS resumable uploads — supports files > 50 MB on Supabase free tier
import * as tus from "tus-js-client";
import { createReadStream, statSync, readdirSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const SUPABASE_URL = "https://rwtueiruyktjzvsgdcoh.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3dHVlaXJ1eWt0anp2c2dkY29oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk5NTM0NCwiZXhwIjoyMDk2NTcxMzQ0fQ.ZuN2vLHvLL4_aoyBpfvMP_KN2AZmDdos726Uh0z8x_Y";

const BUCKET = "media";
const VIDEOS_DIR = join(ROOT, "public", "videos");

const MIME = {
  ".mp4": "video/mp4",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

// Skip files that already uploaded successfully
const ALREADY_DONE = new Set(["bg.mp4", "hero-poster.jpg"]);

function uploadTUS(localPath, storagePath) {
  return new Promise((resolve, reject) => {
    const fileSize = statSync(localPath).size;
    const ext = extname(localPath).toLowerCase();
    const contentType = MIME[ext] ?? "application/octet-stream";
    const stream = createReadStream(localPath);

    let lastPercent = -1;

    const upload = new tus.Upload(stream, {
      endpoint: `${SUPABASE_URL}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000],
      headers: {
        authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "x-upsert": "true",
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: {
        bucketName: BUCKET,
        objectName: storagePath,
        contentType,
        cacheControl: "31536000",
      },
      chunkSize: 6 * 1024 * 1024, // 6 MB chunks
      uploadSize: fileSize,
      onError(error) {
        reject(error);
      },
      onProgress(bytesUploaded, bytesTotal) {
        const pct = Math.floor((bytesUploaded / bytesTotal) * 100);
        if (pct !== lastPercent && pct % 10 === 0) {
          process.stdout.write(`\r  ${pct}% (${(bytesUploaded / 1024 / 1024).toFixed(1)} / ${(bytesTotal / 1024 / 1024).toFixed(1)} MB)`);
          lastPercent = pct;
        }
      },
      onSuccess() {
        process.stdout.write("\r");
        resolve(upload.url);
      },
    });

    upload.start();
  });
}

async function main() {
  console.log("🎬 Supabase TUS Video Uploader (resumable, supports > 50 MB)\n");

  const files = readdirSync(VIDEOS_DIR).filter(
    (f) => statSync(join(VIDEOS_DIR, f)).isFile() && !ALREADY_DONE.has(f)
  );

  let uploaded = 0;
  let failed = 0;

  for (const file of files) {
    const localPath = join(VIDEOS_DIR, file);
    const storagePath = `videos/${file}`;
    const sizeMB = (statSync(localPath).size / 1024 / 1024).toFixed(1);

    console.log(`⬆  Uploading ${file} (${sizeMB} MB)...`);
    try {
      await uploadTUS(localPath, storagePath);
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
      console.log(`   ✅ → ${publicUrl}`);
      uploaded++;
    } catch (err) {
      console.log(`   ❌ ${err.message ?? err}`);
      failed++;
    }
  }

  console.log(`\n🏁 Done: ${uploaded} uploaded, ${failed} failed`);

  if (failed === 0) {
    const BASE = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;
    console.log("\n✅ All done! Your media.ts is already correct:");
    console.log(`  bg:         \${BASE}/videos/bg.mp4`);
    console.log(`  bg1:        \${BASE}/videos/bg_1.mp4`);
    console.log(`  hero:       \${BASE}/videos/hero.mp4`);
    console.log(`  hero2:      \${BASE}/videos/hero2.mp4`);
    console.log(`  heroPoster: \${BASE}/videos/hero-poster.jpg`);
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
