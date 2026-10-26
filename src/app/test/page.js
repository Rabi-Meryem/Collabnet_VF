export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test Page</h1>
      <p>Si vous voyez cette page, le serveur fonctionne correctement.</p>
      <p>Timestamp: {new Date().toLocaleString()}</p>
    </div>
  );
} 