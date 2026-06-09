const C = 'currentColor';

export function HomeIcon({ size = 22, color = C }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  );
}

export function PawIcon({ size = 22, color = C }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <circle cx="6.5" cy="4.5" r="2"/>
      <circle cx="17.5" cy="4.5" r="2"/>
      <circle cx="3.2" cy="10.2" r="1.7"/>
      <circle cx="20.8" cy="10.2" r="1.7"/>
      <path d="M12 10.5c-3.5 0-8 2.5-8 6 0 2.2 2 3.5 5 3.5 1.3 0 2.2-.5 3-.5s1.7.5 3 .5c3 0 5-1.3 5-3.5 0-3.5-4.5-6-8-6z"/>
    </svg>
  );
}

export function PillIcon({ size = 22, color = C }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M4.22 11.29L11.29 4.22C12.07 3.44 13.07 3 14.14 3A3.14 3.14 0 0 1 17.28 6.14c0 1.07-.44 2.07-1.22 2.85L8.99 16.06c-.78.78-1.78 1.22-2.85 1.22A3.14 3.14 0 0 1 3 14.14c0-1.07.44-2.07 1.22-2.85M12 7l-5 5 3.5 3.5 5-5L12 7z"/>
    </svg>
  );
}

export function SyringeIcon({ size = 22, color = C }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M11 3l2 2-1.5 1.5 2 2L15 7l2 2-1.5 1.5 2 2L19 11l2 2-4 4-5-5-7 7-2-2 7-7-5-5 2-2 2 2 1.5-1.5L11 3z"/>
    </svg>
  );
}

export function MedicalCrossIcon({ size = 22, color = C }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M10 3h4v5h5v4h-5v9h-4v-9H5V8h5z"/>
    </svg>
  );
}

export function BellIcon({ size = 22, color = C }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M21 19v1H3v-1l2-2v-6c0-3.1 2.03-5.83 5-6.71V4a2 2 0 0 1 4 0v.29c2.97.88 5 3.61 5 6.71v6l2 2zm-7 2a2 2 0 0 1-4 0h4z"/>
    </svg>
  );
}

export function CalendarIcon({ size = 18, color = C }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M19 19H5V8h14M16 1v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1m-1 11h-5v5h5v-5z"/>
    </svg>
  );
}

export function WeightIcon({ size = 18, color = C }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 3a3 3 0 0 1 3 3v1h5v2H4V7h5V6a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v1h2V6a1 1 0 0 0-1-1zM6.2 11l1.6 11H16.2l1.6-11H6.2z"/>
    </svg>
  );
}

export function RulerIcon({ size = 18, color = C }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M13 6.99h3L12 3 8 6.99h3V17H8l4 4 4-4h-3V6.99z"/>
    </svg>
  );
}

export function PaletteIcon({ size = 18, color = C }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m-3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m-5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m-3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 1.5 1.5 0 0 0 1.5-1.5c0-.39-.15-.74-.39-1 .23-.27.39-.62.39-1A1.5 1.5 0 0 1 15 16h2a5 5 0 0 0 5-5c0-4.42-4.03-8-9-8z"/>
    </svg>
  );
}

export function NoteIcon({ size = 18, color = C }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8L14 2zm4 18H6V4h7v5h5v11z"/>
    </svg>
  );
}

export function EditIcon({ size = 18, color = C }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.84 1.83 3.75 3.75 1.84-1.83zM3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"/>
    </svg>
  );
}
