'use client';

import { useCallback, useRef, useState } from 'react';
import { UploadCloud, FileArchive, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadToR2 } from '@/lib/upload-client';
import ProgressRing from '@/components/dashboard/ProgressRing';

interface UploadDropzoneProps {
  label: string;
  accept: string;
  kind: 'mod' | 'screenshot';
  onUploadComplete?: (key: string) => void;
}

export default function UploadDropzone({ label, accept, kind, onUploadComplete }: UploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const startUpload = useCallback(
    (f: File) => {
      setFile(f);
      setUploading(true);
      setProgress(0);
      setError(null);

      uploadToR2(f, kind, setProgress)
        .then(({ key }) => {
          setUploading(false);
          onUploadComplete?.(key);
        })
        .catch((err: Error) => {
          setUploading(false);
          setError(err.message);
        });
    },
    [kind, onUploadComplete]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) startUpload(dropped);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) startUpload(selected);
  }

  function clearFile() {
    setFile(null);
    setProgress(0);
    setUploading(false);
    setError(null);
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
          ) : error ? (
            <AlertCircle className="w-8 h-8 text-alert shrink-0" />
          ) : (
            <FileArchive className="w-8 h-8 text-signal shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{file.name}</p>
            <p className="font-mono text-xs text-fog-dim">
              {error ? error : uploading ? 'Uploading...' : 'Uploaded'} · {(file.size / (1024 * 1024)).toFixed(1)} MB
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
