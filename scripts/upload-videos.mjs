// scripts/upload-videos.mjs
// Uploads public/videos/* to Supabase Storage bucket "media"
// Uses resumable TUS uploads for large files
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, statSync, createReadStream } from "fs";
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
const CHUNK_SIZE = 6 * 1024 * 1024; // 6 MB chunks

const MIME = {
  ".mp4": "video/mp4",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Update bucket to allow large files
async function updateBucketLimit() {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket/${BUCKET}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: BUCKET,
      name: BUCKET,
      public: true,
      file_size_limit: 524288000, // 500 MB
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.warn(`⚠ Could not update bucket limit: ${JSON.stringify(data)}`);
    return false;
  }
  console.log(`✅ Updated bucket file size limit to 500 MB`);
  return true;
}

async function uploadFile(localPath, storagePath) {
  const ext = extname(localPath).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";
  const fileBuffer = readFileSync(localPath);
  const sizeMB = (statSync(localPath).size / 1024 / 1024).toFixed(1);

  process.stdout.write(`⬆  Uploading ${storagePath} (${sizeMB} MB)...`);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true,
      cacheControl: "31536000",
    });

  if (error) {
    console.log(` ❌ ${error.message}`);
    return false;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  console.log(` ✅\n   → ${data.publicUrl}`);
  return true;
}

async function main() {
  console.log("🎬 Supabase Video Uploader\n");

  // Try to raise the bucket file size limit
  await updateBucketLimit();
  console.log();

  const files = readdirSync(VIDEOS_DIR).filter(
    (f) => statSync(join(VIDEOS_DIR, f)).isFile()
  );

  let uploaded = 0;
  let failed = 0;

  for (const file of files) {
    const localPath = join(VIDEOS_DIR, file);
    const storagePath = `videos/${file}`;
    const ok = await uploadFile(localPath, storagePath);
    ok ? uploaded++ : failed++;
  }

  console.log(`\n🏁 Done: ${uploaded} uploaded, ${failed} failed`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
