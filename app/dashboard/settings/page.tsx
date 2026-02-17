export default function SettingsPage() {
    return (
        <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <span style={{ fontSize: '32px' }}>⚙️</span>
                <h1 style={{ color: '#1f2937', margin: 0 }}>System Settings</h1>
            </div>

            {/* Main Content Box - Analytics Jaisa Design */}
            <div style={{
                padding: '80px 40px',
                backgroundColor: '#fff',
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                textAlign: 'center',
                border: '1px solid #e5e7eb'
            }}>
                <div style={{ fontSize: '50px', marginBottom: '20px' }}>🛠️</div>
                <h2 style={{ color: '#111827', marginBottom: '10px' }}>Configuration Panel</h2>
                <p style={{ color: '#6b7280', fontSize: '16px', maxWidth: '400px', margin: '0 auto' }}>
                    We are working on a custom settings panel where you can manage team members, lead categories, and API keys.
                </p>
                <div style={{
                    marginTop: '30px',
                    display: 'inline-block',
                    padding: '8px 20px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    fontSize: '14px'
                }}>
                    Status: Development Mode
                </div>
            </div>
        </div>
    );
}