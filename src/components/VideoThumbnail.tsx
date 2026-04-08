interface Props {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  overlayStyle?: React.CSSProperties;
}

export default function VideoThumbnail({ src, className, style, overlayStyle }: Props) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
      <video
        src={src}
        muted
        preload="auto"
        playsInline
        className={className}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '1.5rem',
          background: 'rgba(0,0,0,0.3)',
          pointerEvents: 'none',
          ...overlayStyle,
        }}
      >
        ▶
      </span>
    </div>
  );
}
