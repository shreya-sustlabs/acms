"use client";
import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error('Failed to fetch');
      const jsonData = await res.json();
      // Sort keys just in case
      const sortedData = Object.keys(jsonData).sort().reduce((acc, key) => {
        acc[key] = jsonData[key];
        return acc;
      }, {});
      setData(sortedData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showStatus('Failed to load data', 'error');
      setLoading(false);
    }
  };

  const showStatus = (msg, type = 'success') => {
    setStatus({ msg, type });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleSave = async () => {
    try {
      // showStatus('Saving...', 'success');
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to save');
      showStatus('Changes saved successfully!', 'success');
    } catch (err) {
      console.error(err);
      showStatus('Failed to save changes', 'error');
    }
  };

  const handleChange = (fcKey, id, field, value) => {
    setData(prev => ({
      ...prev,
      [fcKey]: prev[fcKey].map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleAdd = (fcKey) => {
    const newId = `${fcKey.toLowerCase()}-${Date.now()}`;
    setData(prev => ({
      ...prev,
      [fcKey]: [...prev[fcKey], { id: newId, name: 'NEW VAR', value: '' }]
    }));
  };

  const handleRemove = (fcKey, id) => {
    setData(prev => ({
      ...prev,
      [fcKey]: prev[fcKey].filter(item => item.id !== id)
    }));
  };

  if (loading) return (
    <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
      <div>Loading...</div>
    </div>
  );

  if (!data) return <div className="dashboard-container">No data found</div>;

  return (
    <main className="dashboard-container">
      <div className="actions-bar">
        <button className="btn btn-secondary" onClick={fetchData}>Discard Changes</button>
        <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
      </div>

      <div className="grid-layout">
        {Object.entries(data).map(([fcKey, items]) => (
          <div key={fcKey} className="fc-card">
            <div className="card-header">
              <div className="card-title">{fcKey}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {items.length} Variable{items.length !== 1 && 's'}
              </div>
            </div>
            <div className="var-list">
              {items.map((item) => (
                <div key={item.id} className="var-item">
                  <input
                    value={item.name}
                    onChange={(e) => handleChange(fcKey, item.id, 'name', e.target.value)}
                    placeholder="Name"
                    aria-label="Variable Name"
                  />
                  <input
                    value={item.value}
                    onChange={(e) => handleChange(fcKey, item.id, 'value', e.target.value)}
                    placeholder="Value"
                    aria-label="Variable Value"
                  />
                  <button
                    className="btn btn-icon-only"
                    onClick={() => handleRemove(fcKey, item.id)}
                    title="Remove Variable"
                    aria-label="Remove Variable"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button className="btn btn-add" onClick={() => handleAdd(fcKey)}>
              + Add Variable
            </button>
          </div>
        ))}
      </div>

      {status && (
        <div className={`status-msg ${status.type === 'error' ? 'status-error' : 'status-success'}`}>
          {status.msg}
        </div>
      )}
    </main>
  );
}
