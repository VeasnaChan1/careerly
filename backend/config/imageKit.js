import ImageKit from "@imagekit/nodejs";
import "dotenv/config";
import fs from "fs";
import path from "path";

let imageKitClient = null;

if (process.env.IMAGEKIT_PRIVATE_KEY) {
  imageKitClient = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || ""
  });
} else {
  // Local fallback handler if ImageKit credentials are not yet set
  imageKitClient = {
    files: {
      upload: async ({ file, fileName }) => {
        const uploadDir = path.resolve("./public/uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const safeName = fileName || `avatar-${Date.now()}.jpg`;
        const destPath = path.join(uploadDir, safeName);

        if (typeof file === "string") {
          // Base64 string
          const buffer = Buffer.from(file, "base64");
          fs.writeFileSync(destPath, buffer);
        } else if (file && typeof file.pipe === "function") {
          // Stream
          const writeStream = fs.createWriteStream(destPath);
          await new Promise((resolve, reject) => {
            file.pipe(writeStream);
            file.on("end", resolve);
            file.on("error", reject);
          });
        }
        const port = process.env.PORT || 3000;
        return {
          url: `http://localhost:${port}/uploads/${safeName}`
        };
      }
    },
    assets: {
      list: async () => []
    },
    deleteFile: async () => {}
  };
}

export const imageKit = imageKitClient;
