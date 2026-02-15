export default function Footer() {
  return (
    <footer style={{
      marginTop: '48px',
      paddingTop: '32px',
      borderTop: '1px solid var(--border-color)'
    }}>
      <div style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <p style={{
          color: 'var(--text-primary)',
          fontWeight: 400,
          margin: 0,
          fontSize: '14px',
          fontFamily: "'AmericanCaptain', 'Bebas Neue', sans-serif",
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Fedgrid
        </p>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          margin: 0
        }}>
          Department of Electrical Engineering
        </p>
        <p style={{
          fontSize: '11px',
          color: 'var(--text-tertiary)',
          margin: 0
        }}>
          Zeroth Review Demonstration
        </p>
      </div>
    </footer>
  );
}
