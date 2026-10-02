import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, message: "يرجى تقديم رابط صالح" },
        { status: 400 }
      );
    }

    const cleanInput = url.trim();
    const images: string[] = [];

    // 1. Check if input contains one or multiple direct Google Drive file links
    // e.g., https://drive.google.com/file/d/FILE_ID/view or open?id=FILE_ID
    const fileIdRegex = /(?:\/file\/d\/|id=)([a-zA-Z0-9_-]{25,50})/g;
    let match;
    const directFileIds = new Set<string>();

    while ((match = fileIdRegex.exec(cleanInput)) !== null) {
      if (match[1]) {
        directFileIds.add(match[1]);
      }
    }

    // 2. Check if it's a Google Drive Folder URL
    const folderMatch = cleanInput.match(/\/folders\/([a-zA-Z0-9_-]{25,50})/);
    const folderId = folderMatch ? folderMatch[1] : null;

    if (folderId) {
      // If GOOGLE_DRIVE_API_KEY is configured in env, use official API v3
      const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

      if (apiKey) {
        try {
          const driveApiRes = await fetch(
            `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false&fields=files(id,name,mimeType)&key=${apiKey}`,
            { headers: { Accept: "application/json" } }
          );

          if (driveApiRes.ok) {
            const data = await driveApiRes.json();
            if (data.files && Array.isArray(data.files)) {
              for (const file of data.files) {
                if (file.mimeType && file.mimeType.startsWith("image/")) {
                  directFileIds.add(file.id);
                }
              }
            }
          }
        } catch (apiErr) {
          console.error("Google Drive API fetch error:", apiErr);
        }
      }

      // If no API key or API didn't return files, attempt public folder HTML parsing
      if (directFileIds.size === 0) {
        try {
          const publicFolderRes = await fetch(
            `https://drive.google.com/drive/folders/${folderId}`,
            {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              },
            }
          );

          if (publicFolderRes.ok) {
            const html = await publicFolderRes.text();
            // Google Drive public folder pages embed IDs in JSON structures
            // e.g. ["ID",["image/jpeg",...]] or [\"ID\",\"image
            const embeddedFileRegex = /\[\\?"([a-zA-Z0-9_-]{28,45})\\?",\[\\?"image\//g;
            let embMatch;
            while ((embMatch = embeddedFileRegex.exec(html)) !== null) {
              if (embMatch[1] && embMatch[1] !== folderId) {
                directFileIds.add(embMatch[1]);
              }
            }

            // Fallback pattern if MIME type structure differs
            if (directFileIds.size === 0) {
              const generalFileIdRegex = /"([a-zA-Z0-9_-]{33})"/g;
              let genMatch;
              while ((genMatch = generalFileIdRegex.exec(html)) !== null) {
                if (genMatch[1] && genMatch[1] !== folderId) {
                  directFileIds.add(genMatch[1]);
                }
              }
            }
          }
        } catch (fetchErr) {
          console.error("Public folder HTML parse error:", fetchErr);
        }
      }
    }

    // Convert file IDs to Google high-speed direct CDN URLs
    for (const id of Array.from(directFileIds)) {
      images.push(`https://lh3.googleusercontent.com/d/${id}`);
    }

    // If input was a regular image URL (not Drive), include it
    if (
      images.length === 0 &&
      (cleanInput.startsWith("http://") || cleanInput.startsWith("https://")) &&
      !cleanInput.includes("drive.google.com")
    ) {
      images.push(cleanInput);
    }

    if (images.length === 0) {
      return NextResponse.json({
        success: false,
        message:
          "تعذر استخراج الصور. تأكد أن الفولدر أو الملف مضبوط على مشاركة عامة: (Anyone with the link can view / أي شخص لديه الرابط يمكنه العرض).",
      });
    }

    return NextResponse.json({
      success: true,
      images,
      count: images.length,
      message: `تم استخراج ${images.length} صورة بنجاح!`,
    });
  } catch (error: any) {
    console.error("Error extracting Drive images:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء معالجة الرابط." },
      { status: 500 }
    );
  }
}
