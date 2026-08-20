/**
 * Utility for parsing and embedding video links (YouTube, Google Drive video, MP4)
 * and Google Drive / PDF documents.
 */

export interface EmbedInfo {
  type: 'youtube' | 'drive_video' | 'drive_doc' | 'drive_slide' | 'drive_folder' | 'pdf' | 'direct_video' | 'web_link';
  embedUrl: string | null;
  originalUrl: string;
  isEmbeddable: boolean;
}

export function parseMediaUrl(url: string | undefined): EmbedInfo | null {
  if (!url || !url.trim()) return null;
  const cleanUrl = url.trim();

  // YouTube matchers: youtube.com/watch?v=xxx, youtu.be/xxx, youtube.com/embed/xxx, shorts
  const ytWatchMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i);
  if (ytWatchMatch && ytWatchMatch[1]) {
    const videoId = ytWatchMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0`,
      originalUrl: cleanUrl,
      isEmbeddable: true,
    };
  }

  // Google Slides presentation: docs.google.com/presentation/d/ID/...
  const slidesMatch = cleanUrl.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/i);
  if (slidesMatch && slidesMatch[1]) {
    const slideId = slidesMatch[1];
    return {
      type: 'drive_slide',
      embedUrl: `https://docs.google.com/presentation/d/${slideId}/embed?start=false&loop=false&delayms=3000`,
      originalUrl: cleanUrl,
      isEmbeddable: true,
    };
  }

  // Google Docs document: docs.google.com/document/d/ID/...
  const docMatch = cleanUrl.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/i);
  if (docMatch && docMatch[1]) {
    const docId = docMatch[1];
    return {
      type: 'drive_doc',
      embedUrl: `https://docs.google.com/document/d/${docId}/preview`,
      originalUrl: cleanUrl,
      isEmbeddable: true,
    };
  }

  // Google Sheets: docs.google.com/spreadsheets/d/ID/...
  const sheetMatch = cleanUrl.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/i);
  if (sheetMatch && sheetMatch[1]) {
    const sheetId = sheetMatch[1];
    return {
      type: 'drive_doc',
      embedUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/preview`,
      originalUrl: cleanUrl,
      isEmbeddable: true,
    };
  }

  // Google Drive folder: drive.google.com/drive/folders/ID
  const folderMatch = cleanUrl.match(/drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]+)/i);
  if (folderMatch && folderMatch[1]) {
    const folderId = folderMatch[1];
    return {
      type: 'drive_folder',
      embedUrl: `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`,
      originalUrl: cleanUrl,
      isEmbeddable: true,
    };
  }

  // Google Drive file: drive.google.com/file/d/ID/view, drive.google.com/open?id=ID
  const driveFileMatch = cleanUrl.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([^"&?\/\s]+)/i);
  if (driveFileMatch && driveFileMatch[1]) {
    const fileId = driveFileMatch[1];
    return {
      type: 'drive_doc',
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      originalUrl: cleanUrl,
      isEmbeddable: true,
    };
  }

  // PDF direct link or data URL
  if (cleanUrl.toLowerCase().endsWith('.pdf') || cleanUrl.startsWith('data:application/pdf')) {
    return {
      type: 'pdf',
      embedUrl: cleanUrl,
      originalUrl: cleanUrl,
      isEmbeddable: true,
    };
  }

  // Direct video file (mp4, webm, ogg)
  if (cleanUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
    return {
      type: 'direct_video',
      embedUrl: cleanUrl,
      originalUrl: cleanUrl,
      isEmbeddable: true,
    };
  }

  // Generic web link
  return {
    type: 'web_link',
    embedUrl: cleanUrl,
    originalUrl: cleanUrl,
    isEmbeddable: false,
  };
}

/**
 * Convert file to base64 Data URL for in-browser PDF upload
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
