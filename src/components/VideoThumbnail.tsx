import { useEffect, useState } from 'react';

interface Props {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  overlayStyle?: React.CSSProperties;
}

export default function VideoThumbnail({ src, className, style, overlayStyle }: Props) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    video.muted = true;
    video.src = src;

    video.addEventListener('loadedmetadata', () => {
      video.currentTime = video.duration > 0.5 ? 0.5 : 0;
    }, { once: true });

    video.addEventListener('seeked', () => {
      if (cancelled) return;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      canvas.getContext('2d')!.drawImage(video, 0, 0, canvas.width, canvas.height);
      setThumbUrl(canvas.toDataURL('image/jpeg', 0.7));
    }, { once: true });

    return () => { cancelled = true; };
  }, [src]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
      {thumbUrl
        ? <img className={className} src={thumbUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : <div style={{ width: '100%', height: '100%', background: '#1e293b' }} />
      }
      <span style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: '1.5rem', background: 'rgba(0,0,0,0.3)',
        ...overlayStyle,
      }}>▶</span>
    </div>
  );
}
