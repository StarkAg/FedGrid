export default function Footer() {
  return (
    <footer
      style={{
        marginTop: '44px',
        paddingTop: '28px',
        borderTop: '1px solid var(--border-color)',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <p className="font-display" style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.95rem' }}>
          FedGrid
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
          Department of Electrical Engineering
        </p>
        <p className="font-mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: 0 }}>
          Review Console Build • March 2026
        </p>
      </div>
    </footer>
  );
}
