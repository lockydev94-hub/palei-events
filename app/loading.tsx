export default function Loading() {
  return (
    <div
      aria-label="Loading"
      role="status"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f1522",
        /* no JS / no React needed — pure CSS animation */
      }}
    >
      {/* Spinning arc ring */}
      <div style={{ position: "relative", width: 64, height: 64 }}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          style={{
            width: 64,
            height: 64,
            animation: "ldSpin 1.1s linear infinite",
          }}
        >
          <circle cx="32" cy="32" r="28" stroke="rgba(200,155,60,0.12)" strokeWidth="2" />
          <path
            d="M32 4 A28 28 0 0 1 60 32"
            stroke="#c89b3c"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        {/* P lettermark */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 20,
            fontWeight: 700,
            color: "#e8d5a8",
            letterSpacing: "-0.04em",
          }}
        >
          P
        </span>
      </div>

      {/* Brand name */}
      <p
        style={{
          marginTop: 16,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(232,213,168,0.5)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Palei Events
      </p>

      {/* Dot row */}
      <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: "#c89b3c",
              animation: `ldDot 1.2s ease-in-out ${i * 200}ms infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes ldSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ldDot {
          0%, 80%, 100% { transform: scale(0.55); opacity: 0.3; }
          40%            { transform: scale(1);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
