import React, { useState, useMemo } from 'react';
import { 
  Play, 
  ExternalLink, 
  FileText, 
  Download, 
  Video, 
  HardDrive, 
  Maximize2,
  X,
  Presentation,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Tv,
  ListVideo
} from 'lucide-react';
import { parseMediaUrl } from '../utils/mediaUtils';
import { VideoItem } from '../types';

interface MediaEmbedViewerProps {
  videoUrl?: string;
  videoTitle?: string;
  videoList?: (VideoItem | string)[];
  pdfUrl?: string;
  pdfName?: string;
  googleDriveLink?: string;
  googleDriveTitle?: string;
  className?: string;
}

export const MediaEmbedViewer: React.FC<MediaEmbedViewerProps> = ({
  videoUrl,
  videoTitle,
  videoList,
  pdfUrl,
  pdfName,
  googleDriveLink,
  googleDriveTitle,
  className = '',
}) => {
  const [activeFullscreenType, setActiveFullscreenType] = useState<'video' | 'drive' | 'pdf' | null>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);

  // Normalize list of videos from videoList or legacy videoUrl
  const normalizedVideos: VideoItem[] = useMemo(() => {
    const list: VideoItem[] = [];

    if (videoList && Array.isArray(videoList)) {
      videoList.forEach((item, idx) => {
        if (typeof item === 'string' && item.trim()) {
          list.push({ url: item.trim(), title: `Video ${idx + 1}` });
        } else if (item && typeof item === 'object' && item.url && item.url.trim()) {
          list.push({
            id: item.id || `vid-${idx}`,
            url: item.url.trim(),
            title: item.title?.trim() || `Video ${idx + 1}`,
          });
        }
      });
    }

    // Fallback or combine if single videoUrl is provided and not already in list
    if (videoUrl && videoUrl.trim()) {
      const splitUrls = videoUrl.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
      splitUrls.forEach((u, idx) => {
        if (!list.some((existing) => existing.url === u)) {
          list.push({
            id: `legacy-${idx}`,
            url: u,
            title: (idx === 0 && videoTitle ? videoTitle : `Video ${list.length + 1}`),
          });
        }
      });
    }

    return list;
  }, [videoList, videoUrl, videoTitle]);

  const activeVideo = normalizedVideos[selectedVideoIndex] || normalizedVideos[0];
  const videoParsed = parseMediaUrl(activeVideo?.url);
  const pdfParsed = parseMediaUrl(pdfUrl);
  const driveParsed = parseMediaUrl(googleDriveLink);

  const hasVideo = normalizedVideos.length > 0 && Boolean(videoParsed);
  const hasDrive = Boolean(googleDriveLink && driveParsed);
  const hasPdf = Boolean(pdfUrl);

  const hasAnyMedia = hasDrive || hasVideo || hasPdf;

  // Active view toggle if multiple media types exist
  const [activeTab, setActiveTab] = useState<'drive' | 'video' | 'pdf'>(() => {
    if (hasDrive) return 'drive';
    if (hasVideo) return 'video';
    if (hasPdf) return 'pdf';
    return 'drive';
  });

  if (!hasAnyMedia) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-xs">
        <Video className="w-8 h-8 mx-auto text-slate-300 mb-2" />
        <p className="font-semibold text-slate-600">Belum ada link materi Google Drive atau Video YouTube yang disematkan.</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Guru dapat mengedit materi untuk mencantumkan tautan Google Drive / YouTube.</p>
      </div>
    );
  }

  // Count available tabs
  const mediaCount = [hasDrive, hasVideo, hasPdf].filter(Boolean).length;

  return (
    <div className={`space-y-4 ${className}`}>

      {/* Tabs Selector if multiple media types are present */}
      {mediaCount > 1 && (
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
          {hasDrive && (
            <button
              type="button"
              onClick={() => setActiveTab('drive')}
              className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'drive'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-white/80 hover:text-blue-700'
              }`}
            >
              <Presentation className="w-4 h-4" />
              <span>Materi Google Drive</span>
            </button>
          )}

          {hasVideo && (
            <button
              type="button"
              onClick={() => setActiveTab('video')}
              className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'video'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-white/80 hover:text-rose-700'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Video Pembelajaran ({normalizedVideos.length})</span>
            </button>
          )}

          {hasPdf && (
            <button
              type="button"
              onClick={() => setActiveTab('pdf')}
              className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'pdf'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'text-slate-600 hover:bg-white/80 hover:text-emerald-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Dokumen / E-Book PDF</span>
            </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. GOOGLE DRIVE DIRECT VIEWER (EMBEDDED IFRAME / PRESENTATION / DOCS) */}
      {/* ========================================================================= */}
      {hasDrive && (mediaCount === 1 || activeTab === 'drive') && (
        <div className="bg-white rounded-2xl border border-blue-200 overflow-hidden shadow-md">
          {/* Top Bar for Drive */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                <HardDrive className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block">
                  Materi Google Drive (Slide / Dokumen)
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                  {googleDriveTitle || 'Materi Pembelajaran PAI di Google Drive'}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveFullscreenType('drive')}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Buka Tampilan Layar Penuh"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Layar Penuh</span>
              </button>

              <a
                href={googleDriveLink}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                title="Buka langsung di Google Drive"
              >
                <span>Buka di Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Embedded Google Drive Iframe */}
          <div className="relative w-full bg-slate-900 h-[480px] sm:h-[560px] flex items-center justify-center">
            {driveParsed?.isEmbeddable && driveParsed.embedUrl ? (
              <iframe
                src={driveParsed.embedUrl}
                title={googleDriveTitle || 'Google Drive Resource Viewer'}
                className="w-full h-full border-0 bg-white"
                allow="autoplay"
                allowFullScreen
              />
            ) : (
              <div className="text-center p-8 space-y-3 text-white">
                <FolderOpen className="w-12 h-12 text-blue-400 mx-auto" />
                <h5 className="font-bold text-sm">Folder / Tautan Google Drive</h5>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Klik tombol di bawah ini untuk membuka materi presentasi atau folder tugas langsung di Google Drive.
                </p>
                <a
                  href={googleDriveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg transition-all"
                >
                  <span>Buka Google Drive Sekarang</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. YOUTUBE VIDEO DIRECT PLAYER (EMBEDDED IFRAME WITH MULTIPLE VIDEOS) */}
      {/* ========================================================================= */}
      {hasVideo && (mediaCount === 1 || activeTab === 'video') && (
        <div className="bg-slate-950 text-white rounded-2xl overflow-hidden shadow-lg border border-slate-800 space-y-0">
          
          {/* Header Bar */}
          <div className="p-3.5 bg-slate-900/95 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <Video className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                    Video Pembelajaran YouTube
                  </span>
                  {normalizedVideos.length > 1 && (
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white">
                      Video {selectedVideoIndex + 1} dari {normalizedVideos.length}
                    </span>
                  )}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                  {activeVideo?.title || 'Video Penjelasan Materi PAI'}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveFullscreenType('video')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Layar Penuh"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Layar Penuh</span>
              </button>

              {activeVideo?.url && (
                <a
                  href={activeVideo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-rose-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 flex items-center gap-1 transition-colors"
                  title="Buka di YouTube"
                >
                  <span>Buka YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Multiple Videos Playlist / Navigation Bar if > 1 video */}
          {normalizedVideos.length > 1 && (
            <div className="px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-slate-400 mr-1">
                <ListVideo className="w-4 h-4 text-rose-400" />
                <span className="text-[11px]">Daftar Video:</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-scrollbar flex-1">
                {normalizedVideos.map((vid, idx) => {
                  const isSelected = selectedVideoIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedVideoIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                        isSelected
                          ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400/50'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <Play className={`w-3 h-3 ${isSelected ? 'fill-current' : ''}`} />
                      <span>{idx + 1}. {vid.title || `Video ${idx + 1}`}</span>
                    </button>
                  );
                })}
              </div>

              {/* Prev / Next controls */}
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  type="button"
                  disabled={selectedVideoIndex === 0}
                  onClick={() => setSelectedVideoIndex((prev) => Math.max(0, prev - 1))}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Video Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={selectedVideoIndex >= normalizedVideos.length - 1}
                  onClick={() => setSelectedVideoIndex((prev) => Math.min(normalizedVideos.length - 1, prev + 1))}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Video Berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Video Player Display */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center">
            {videoParsed?.type === 'youtube' && videoParsed.embedUrl ? (
              <iframe
                key={activeVideo?.url}
                src={videoParsed.embedUrl}
                title={activeVideo?.title || 'Video Pembelajaran YouTube'}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : videoParsed?.type === 'direct_video' && videoParsed.embedUrl ? (
              <video
                key={activeVideo?.url}
                controls
                src={videoParsed.embedUrl}
                className="w-full h-full"
              >
                Browser Anda tidak mendukung pemutaran video langsung.
              </video>
            ) : videoParsed?.type === 'drive_doc' && videoParsed.embedUrl ? (
              <iframe
                key={activeVideo?.url}
                src={videoParsed.embedUrl}
                title={activeVideo?.title || 'Google Drive Video Preview'}
                className="w-full h-full border-0"
                allow="autoplay"
                allowFullScreen
              />
            ) : (
              <div className="text-center p-8 space-y-3">
                <Video className="w-12 h-12 text-rose-500 mx-auto" />
                <p className="text-xs text-slate-400">Putar video langsung di YouTube:</p>
                <a
                  href={activeVideo?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Tonton di YouTube</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PDF VIEWER (EMBEDDED IFRAME / MODAL) */}
      {/* ========================================================================= */}
      {hasPdf && (mediaCount === 1 || activeTab === 'pdf') && (
        <div className="bg-white rounded-2xl border border-emerald-200 overflow-hidden shadow-md">
          <div className="px-4 py-3 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
                  Dokumen / E-Book Modul PDF
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                  {pdfName || 'Bahan Ajar & Modul PDF'}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveFullscreenType('pdf')}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Layar Penuh"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Layar Penuh</span>
              </button>

              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                download={pdfName || 'Modul-PAI.pdf'}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Unduh PDF</span>
              </a>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-[480px] sm:h-[560px]">
            <iframe
              src={pdfParsed?.embedUrl || pdfUrl}
              title={pdfName || 'PDF Viewer'}
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: FULLSCREEN VIEWER */}
      {/* ========================================================================= */}
      {activeFullscreenType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5 truncate">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500 text-white uppercase">
                  Layar Penuh
                </span>
                <h3 className="text-sm font-bold text-white truncate max-w-md">
                  {activeFullscreenType === 'drive'
                    ? (googleDriveTitle || 'Google Drive Resource')
                    : activeFullscreenType === 'video'
                    ? (activeVideo?.title || 'Video Pembelajaran YouTube')
                    : (pdfName || 'Dokumen PDF')}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {activeFullscreenType === 'video' && normalizedVideos.length > 1 && (
                  <div className="flex items-center gap-1 mr-2">
                    <button
                      type="button"
                      disabled={selectedVideoIndex === 0}
                      onClick={() => setSelectedVideoIndex((prev) => Math.max(0, prev - 1))}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white disabled:opacity-30"
                    >
                      ◀ Video Sebelumnya
                    </button>
                    <span className="text-xs text-slate-400 font-bold px-1">
                      {selectedVideoIndex + 1} / {normalizedVideos.length}
                    </span>
                    <button
                      type="button"
                      disabled={selectedVideoIndex >= normalizedVideos.length - 1}
                      onClick={() => setSelectedVideoIndex((prev) => Math.min(normalizedVideos.length - 1, prev + 1))}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white disabled:opacity-30"
                    >
                      Video Berikutnya ▶
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setActiveFullscreenType(null)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-rose-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Iframe */}
            <div className="flex-1 bg-black relative">
              {activeFullscreenType === 'drive' && driveParsed?.embedUrl ? (
                <iframe
                  src={driveParsed.embedUrl}
                  title="Google Drive Fullscreen"
                  className="w-full h-full border-0 bg-white"
                  allow="autoplay"
                  allowFullScreen
                />
              ) : activeFullscreenType === 'video' && videoParsed?.embedUrl ? (
                <iframe
                  key={activeVideo?.url}
                  src={videoParsed.embedUrl}
                  title="Video Fullscreen"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : activeFullscreenType === 'pdf' && (pdfParsed?.embedUrl || pdfUrl) ? (
                <iframe
                  src={pdfParsed?.embedUrl || pdfUrl}
                  title="PDF Fullscreen"
                  className="w-full h-full border-0"
                />
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Tekan Esc atau klik tombol silang untuk keluar dari mode layar penuh.</span>
              <button
                onClick={() => setActiveFullscreenType(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold"
              >
                Tutup Layar Penuh
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
