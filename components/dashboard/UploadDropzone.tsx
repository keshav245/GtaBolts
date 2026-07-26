'use client';

import { useCallback, useRef, useState } from 'react';
import { UploadCloud, FileArchive, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProgressRing from '@/components/dashboard/ProgressRing';

interface UploadDropzoneProps {
  label: string;
  accept: string;
  onFileSelected?: (file: File) => void;
}

export default function UploadDropzone({ label, accept, onFileSelected }: UploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = useCallback((f: File) => {
    setFile(f);
    setUploading(true);
    setProgress(0);
    onFileSelected?.(f);

    // TODO: replace this simulated progress with real upload progress from your
    // R2 PUT request (e.g. via XMLHttpRequest's `upload.onprogress`, since fetch
    // doesn't expose upload progress natively).
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  }, [onFileSelected]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) simulateUpload(dropped);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) simulateUpload(selected);
  }

  function clearFile() {
    setFile(null);
    setProgress(0);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-wider text-fog-dim mb-1.5">{label}</p>

      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'glass rounded-lg border-2 border-dashed p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all',
            dragActive ? 'border-violet-bright bg-violet/5 shadow-glow-sm' : 'border-white/15 hover:border-white/30'
          )}
        >
          <UploadCloud className="w-8 h-8 text-violet-bright" />
          <p className="text-sm text-fog">Drag & drop, or click to browse</p>
          <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
        </div>
      ) : (
        <div className="glass rounded-lg p-4 flex items-center gap-4">
          {uploading ? (
            <div className="relative shrink-0 flex items-center justify-center">
              <ProgressRing progress={progress} />
              <span className="absolute font-mono text-[10px] text-cyan">{progress}%</span>
            </div>
          ) : (
            <FileArchive className="w-8 h-8 text-signal shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{file.name}</p>
            <p className="font-mono text-xs text-fog-dim">
              {uploading ? 'Uploading...' : 'Ready'} · {(file.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
          <button onClick={clearFile} className="p-1.5 text-fog-dim hover:text-alert transition-colors" aria-label="Remove file">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
