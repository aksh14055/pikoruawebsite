import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

function getContentType(ext: string) {
  switch (ext.toLowerCase()) {
    case ".png": return "image/png";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    case ".webp": return "image/webp";
    case ".avif": return "image/avif";
    default: return "application/octet-stream";
  }
}

async function startSync() {
  const dirs = [
    { dir: path.join(process.cwd(), "public/properties"), prefix: "properties" },
    { dir: path.join(process.cwd(), "public/images"), prefix: "images" },
    { dir: path.join(process.cwd(), "public/partners"), prefix: "partners" },
  ];

  const allFiles: { filePath: string; storagePath: string }[] = [];

  function walkDir(dir: string, baseDir: string, prefix: string) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkDir(fullPath, baseDir, prefix);
      } else {
        const relativePath = path.relative(baseDir, fullPath);
        const storagePath = `${prefix}/${relativePath.replace(/\\/g, "/")}`;
        allFiles.push({ filePath: fullPath, storagePath });
      }
    }
  }

  for (const item of dirs) {
    walkDir(item.dir, item.dir, item.prefix);
  }

  console.log(`Starting sync of ${allFiles.length} files to Supabase storage...`);

  for (const file of allFiles) {
    const fileBuffer = fs.readFileSync(file.filePath);
    const ext = path.extname(file.filePath);
    const contentType = getContentType(ext);

    const { error } = await supabase.storage
      .from("media")
      .upload(file.storagePath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error(`❌ Failed to upload ${file.storagePath}:`, error.message);
    } else {
      console.log(`✓ Uploaded ${file.storagePath}`);
    }
  }

  console.log("All uploads finished!");
}

startSync().catch(err => {
  console.error("Unhandled execution error:", err);
});
