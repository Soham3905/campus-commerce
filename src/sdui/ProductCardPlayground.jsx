import { useState } from 'react';
import { productCardThemes } from './themes/productCardThemes';
import ProductCardRenderer from './renderers/ProductCardRenderer';

export default function ProductCardPlayground({ onBack }) {
  const [selectedThemeId, setSelectedThemeId] = useState('landing_schema');
  const [productData, setProductData] = useState(
    JSON.parse(JSON.stringify(productCardThemes.landing_schema.config))
  );
  const [copied, setCopied] = useState(false);

  // 1. Switch Theme
  const handleSelectTheme = (themeId) => {
    setSelectedThemeId(themeId);
    setProductData(JSON.parse(JSON.stringify(productCardThemes[themeId].config)));
  };

  // 2. Update a specific child node's data field
  const handleUpdateChildData = (type, key, value) => {
    setProductData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const child = next.children?.find((c) => c.type === type);
      if (child) {
        child.data = { ...child.data, [key]: value };
      }
      return next;
    });
  };

  // 3. Toggle a sub-field on / off
  const handleToggleChild = (type) => {
    setProductData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const exists = next.children?.some((c) => c.type === type);
      if (exists) {
        // Remove child
        next.children = next.children.filter((c) => c.type !== type);
      } else {
        // Re-add from original theme template
        const originalChild = productCardThemes[selectedThemeId].config.children?.find(
          (c) => c.type === type
        );
        if (originalChild) {
          next.children.push(JSON.parse(JSON.stringify(originalChild)));
        }
      }
      return next;
    });
  };

  // 4. Copy JSON
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(productData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render SDUI child items
  const renderChild = (child, idx) => {
    const style = child.containerStyle || child.style || {};
    switch (child.type) {
      case 'Image':
        return (
          <img
            key={idx}
            src={child.data?.imageUrl}
            alt={child.data?.altText}
            style={{ width: '100%', height: '176px', objectFit: 'contain', ...style }}
          />
        );
      case 'Badge':
        return (
          <span key={idx} style={{ display: 'inline-block', ...style }}>
            {child.data?.text}
          </span>
        );
      case 'Title':
        return (
          <h4 key={idx} style={{ margin: 0, ...style }}>
            {child.data?.text}
          </h4>
        );
      case 'Description':
        return (
          <p key={idx} style={{ margin: 0, ...style }}>
            {child.data?.text}
          </p>
        );
      case 'Rating':
        return (
          <div key={idx} style={{ ...style }}>
            <span style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 'bold' }}>
              ★ {child.children?.[0]?.data?.text || '4.5'}
            </span>
            <span style={{ color: '#64748b', fontSize: '12px', marginLeft: '6px' }}>
              ({child.children?.[1]?.data?.text || '100'} reviews)
            </span>
          </div>
        );
      case 'PriceBlock':
        return (
          <div key={idx} style={{ ...style }}>
            <span style={{ fontSize: '18px', fontWeight: '800' }}>
              {child.data?.sellingPrice}
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '6px' }}>
              {child.data?.mrp}
            </span>
            <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700', marginLeft: '6px' }}>
              {child.data?.discount} OFF
            </span>
          </div>
        );
      case 'OfferText':
        return (
          <p key={idx} style={{ margin: 0, ...style }}>
            🏷️ {child.data?.text}
          </p>
        );
      case 'DeliveryInfo':
        return (
          <p key={idx} style={{ margin: 0, ...style }}>
            🚚 {child.data?.prefix}
          </p>
        );
      case 'Button':
        return (
          <button key={idx} style={{ ...style }}>
            {child.data?.label}
          </button>
        );
      case 'ShareButton':
        return (
          <button key={idx} style={{ ...style }}>
            {child.data?.icon || '↗'} {child.data?.label}
          </button>
        );
      case 'Label':
        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', ...style }}>
            {child.children?.map((subChild, sIdx) => renderChild(subChild, sIdx))}
          </div>
        );
      case 'Sponsored':
        return (
          <span key={idx} style={{ ...style }}>
            {child.data?.text || 'Sponsored'}
          </span>
        );
      default:
        return null;
    }
  };

  const titleNode = productData.children?.find((c) => c.type === 'Title');
  const priceNode = productData.children?.find((c) => c.type === 'PriceBlock');
  const badgeNode = productData.children?.find((c) => c.type === 'Badge');
  const buttonNode = productData.children?.find((c) => c.type === 'Button');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#f1f5f9', padding: '24px', fontFamily: 'sans-serif' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', margin: 0, fontWeight: '700' }}>ProductCard Component Playground</h1>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>Choose Theme:</span>
        {Object.values(productCardThemes).map((theme) => {
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

      {/* Main 3-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* Column 1: Live Card Preview */}
        <div style={{ backgroundColor: '#131b2e', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '14px', color: '#94a3b8', marginTop: 0, marginBottom: '16px' }}>Live Card Preview</h3>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
            <ProductCardRenderer style={productData.containerStyle}>
              {productData.children?.map((child, idx) => renderChild(child, idx))}
            </ProductCardRenderer>
          </div>
        </div>

        {/* Column 2: Edit Properties & Sub-Field Toggles */}
        <div style={{ backgroundColor: '#131b2e', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '15px', marginTop: 0, marginBottom: '16px' }}>Edit Sub-Fields</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {titleNode && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Brand / Title</label>
                <input
                  type="text"
                  value={titleNode.data?.text || ''}
                  onChange={(e) => handleUpdateChildData('Title', 'text', e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: '#0b0f19', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            )}

            {priceNode && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Selling Price</label>
                  <input
                    type="text"
                    value={priceNode.data?.sellingPrice || ''}
                    onChange={(e) => handleUpdateChildData('PriceBlock', 'sellingPrice', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', background: '#0b0f19', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>MRP Price</label>
                  <input
                    type="text"
                    value={priceNode.data?.mrp || ''}
                    onChange={(e) => handleUpdateChildData('PriceBlock', 'mrp', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', background: '#0b0f19', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            )}

            {badgeNode && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Badge Text</label>
                <input
                  type="text"
                  value={badgeNode.data?.text || ''}
                  onChange={(e) => handleUpdateChildData('Badge', 'text', e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: '#0b0f19', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            )}

            {buttonNode && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Button Text</label>
                <input
                  type="text"
                  value={buttonNode.data?.label || ''}
                  onChange={(e) => handleUpdateChildData('Button', 'label', e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: '#0b0f19', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            )}

            {/* Field Toggles */}
            <div style={{ marginTop: '10px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Toggle Sub-Fields:</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Badge', 'Rating', 'OfferText', 'DeliveryInfo', 'ShareButton'].map((field) => {
                  const isActive = productData.children?.some((c) => c.type === field);
                  return (
                    <button
                      key={field}
                      onClick={() => handleToggleChild(field)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: isActive ? '#10b981' : '#334155',
                        color: '#ffffff'
                      }}
                    >
                      {isActive ? `✓ ${field}` : `+ ${field}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Live SDUI JSON */}
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
          <pre style={{ backgroundColor: '#0b0f19', padding: '14px', borderRadius: '8px', color: '#38bdf8', fontSize: '11px', maxHeight: '380px', overflowY: 'auto', margin: 0 }}>
            {JSON.stringify(productData, null, 2)}
          </pre>
        </div>

      </div>
    </div>
  );
}
