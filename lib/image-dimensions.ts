import { readFile } from "node:fs/promises";
import path from "node:path";

type ImageDimensions = {
  width: number;
  height: number;
};

const publicDir = path.join(process.cwd(), "public");

function readJpegDimensions(buffer: Buffer): ImageDimensions | null {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;

  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) return null;

    const marker = buffer[offset + 1];
    const blockLength = buffer.readUInt16BE(offset + 2);
    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);

    if (isStartOfFrame) {
      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5),
      };
    }

    offset += 2 + blockLength;
  }

  return null;
}

function readPngDimensions(buffer: Buffer): ImageDimensions | null {
  const pngSignature = "89504e470d0a1a0a";
  if (buffer.length < 24 || buffer.subarray(0, 8).toString("hex") !== pngSignature) return null;

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

export async function getPublicImageDimensions(imageUrl: string): Promise<ImageDimensions | null> {
  if (!imageUrl.startsWith("/")) return null;

  const imagePath = imageUrl.split("?")[0];
  const resolvedPath = path.resolve(publicDir, imagePath.slice(1));
  const resolvedPublicDir = path.resolve(publicDir);

  if (!resolvedPath.startsWith(resolvedPublicDir)) return null;

  try {
    const buffer = await readFile(resolvedPath);
    return readJpegDimensions(buffer) ?? readPngDimensions(buffer);
  } catch {
    return null;
  }
}
