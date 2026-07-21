import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg viewBox="0 0 100 100" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Primary shape */}
          <rect x="15" y="15" width="45" height="45" rx="12" fill="#2563eb" />
          {/* Emerald shape */}
          <rect x="40" y="40" width="45" height="45" rx="12" fill="#10b981" style={{ mixBlendMode: 'multiply' }} />
          {/* Inner detailing */}
          <circle cx="37.5" cy="37.5" r="6" fill="white" />
          <circle cx="62.5" cy="62.5" r="6" fill="white" />
          <path d="M43.5 37.5 L62.5 56.5" stroke="white" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
