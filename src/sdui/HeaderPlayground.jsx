import { useState } from 'react';
import { headerThemes } from './themes/headerThemes';
import HeaderRenderer from './renderers/HeaderRenderer';
import HeaderButtonRenderer from './renderers/HeaderButtonRenderer';

export default function HeaderPlayground({ onBack }) {
  const [selectedThemeId, setSelectedThemeId] = useState('landing_schema');
  const [headerData, setHeaderData] = useState(
    JSON.parse(JSON.stringify(headerThemes.landing_schema.config))
  );
  const [copied, setCopied] = useState(false);

  // 1. Switch Theme
  const handleSelectTheme = (themeId) => {
    setSelectedThemeId(themeId);
    setHeaderData(JSON.parse(JSON.stringify(headerThemes[themeId].config)));
  };

  // 2. Simple handler to update child button's label
  const handleUpdateLabel = (index, newLabel) => {
    setHeaderData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (next.children && next.children[index]) {
        next.children[index].data.label = newLabel;
      }
      return next;
    });
  };

  // 3. Simple handler to update header background
  const handleUpdateBg = (newBg) => {
    setHeaderData((prev) => ({
      ...prev,
      containerStyle: {
        ...prev.containerStyle,
        background: newBg
      }
    }));
  };

  // 4. Copy JSON to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(headerData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#f1f5f9', padding: '24px', fontFamily: 'sans-serif' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', margin: 0, fontWeight: '700' }}>Header Component Playground</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>Live preview and SDUI JSON editor</p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            style={{ padding: '8px 16px', background: '#334155', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
          >
            ← Back
          </button>
        )}
      </div>

      {/* Theme Switcher Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>Choose Theme:</span>
        {Object.values(headerThemes).map((theme) => {
          const isSelected = selectedThemeId === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => handleSelectTheme(theme.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: isSelected ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.15)',
                backgroundColor: isSelected ? '#1e1b4b' : '#131b2e',
                color: isSelected ? '#a5b4fc' : '#ffffff',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: isSelected ? '700' : '500'
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: theme.previewColor,
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              />
              {theme.name}
            </button>
          );
        })}
      </div>

      {/* Live Preview Box */}
      <div style={{ backgroundColor: '#131b2e', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 style={{ fontSize: '14px', color: '#94a3b8', marginTop: 0, marginBottom: '14px' }}>Live Header Preview</h3>
        <div style={{ borderRadius: '8px', overflow: 'hidden' }}>
          <HeaderRenderer style={headerData.containerStyle}>
            {headerData.children?.map((child, idx) => (
              <HeaderButtonRenderer
                key={idx}
                data={child.data}
                style={child.containerStyle || child.style}
              />
            ))}
          </HeaderRenderer>
        </div>
      </div>

      {/* Grid: Editor & JSON */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Editor Controls */}
        <div style={{ backgroundColor: '#131b2e', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '15px', marginTop: 0, marginBottom: '16px' }}>Edit Properties</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Logo Label</label>
              <input
                type="text"
                value={headerData.children?.[0]?.data?.label || ''}
                onChange={(e) => handleUpdateLabel(0, e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: '#0b0f19', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Home Tab Label</label>
              <input
                type="text"
                value={headerData.children?.[1]?.data?.label || ''}
                onChange={(e) => handleUpdateLabel(1, e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: '#0b0f19', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Background Color / Gradient</label>
              <input
                type="text"
                value={headerData.containerStyle?.background || headerData.containerStyle?.backgroundColor || ''}
                onChange={(e) => handleUpdateBg(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: '#0b0f19', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>

        {/* Live SDUI JSON */}
        <div style={{ backgroundColor: '#131b2e', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', margin: 0 }}>Generated SDUI JSON</h3>
            <button
              onClick={handleCopy}
              style={{ padding: '6px 12px', background: copied ? '#10b981' : '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
            >
              {copied ? '✓ Copied' : 'Copy JSON'}
            </button>
          </div>
          <pre style={{ backgroundColor: '#0b0f19', padding: '14px', borderRadius: '8px', color: '#38bdf8', fontSize: '12px', maxHeight: '220px', overflowY: 'auto', margin: 0 }}>
            {JSON.stringify(headerData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
