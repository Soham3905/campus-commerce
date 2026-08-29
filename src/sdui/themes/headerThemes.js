export const headerThemes = {
  // 1. DEFAULT: Landing Page Theme (Teal)
  landing_schema: {
    id: 'landing_schema',
    name: 'Default Teal',
    previewColor: '#0D3540',
    config: {
      type: 'Header',
      containerStyle: {
        background: 'linear-gradient(180deg, #103E4B 0%, #0D3540 100%)',
        backgroundColor: '#0D3540',
        height: '48px',
        padding: '0 max(16px, calc((100% - 1180px) / 2))',
        boxSizing: 'border-box',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      },
      children: [
        {
          type: 'HeaderButton',
          containerStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            background: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: '700',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer'
          },
          data: { id: 'logo', label: 'SDUI·Commerce', icon: '♥' }
        },
        {
          type: 'HeaderButton',
          containerStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer',
            boxShadow: 'inset 0 -2px 0 #C4185F'
          },
          data: { id: 'home', label: 'Home', icon: '' }
        },
        {
          type: 'HeaderButton',
          containerStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.72)',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer'
          },
          data: { id: 'categories', label: 'Categories', icon: '' }
        },
        {
          type: 'HeaderButton',
          containerStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.72)',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer'
          },
          data: { id: 'deals', label: 'Deals', icon: '' }
        },
        {
          type: 'HeaderButton',
          containerStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.72)',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer'
          },
          data: { id: 'orders', label: 'Orders', icon: '' }
        },
        {
          type: 'HeaderButton',
          containerStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.28)',
            borderRadius: '6px',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '600',
            padding: '4px 12px',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer'
          },
          data: { id: 'login', label: 'Log in', icon: '' }
        },
        {
          type: 'HeaderButton',
          containerStyle: {
            background: 'linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)',
            backgroundColor: '#C4185F',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            border: '1px solid #C4185F',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '600',
            padding: '4px 14px',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer'
          },
          data: { id: 'signup', label: 'Sign up', icon: '' }
        }
      ]
    }
  },

  // 2. WHITE THEME: Clean White Store
  clean_white: {
    id: 'clean_white',
    name: 'Clean White',
    previewColor: '#FFFFFF',
    config: {
      type: 'Header',
      containerStyle: {
        background: '#FFFFFF',
        backgroundColor: '#FFFFFF',
        height: '48px',
        padding: '0 max(16px, calc((100% - 1180px) / 2))',
        boxSizing: 'border-box',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      },
      children: [
        {
          type: 'HeaderButton',
          containerStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            background: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#0F172A',
            fontSize: '16px',
            fontWeight: '700',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer'
          },
          data: { id: 'logo', label: 'SDUI·Commerce', icon: '♥' }
        },
        {
          type: 'HeaderButton',
          containerStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#0F172A',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer',
            boxShadow: 'inset 0 -2px 0 #0F172A'
          },
          data: { id: 'home', label: 'Home', icon: '' }
        },
        {
          type: 'HeaderButton',
          containerStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#64748B',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer'
          },
          data: { id: 'categories', label: 'Categories', icon: '' }
        },
        {
          type: 'HeaderButton',
          containerStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#64748B',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer'
          },
          data: { id: 'deals', label: 'Deals', icon: '' }
        },
        {
          type: 'HeaderButton',
          containerStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#64748B',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer'
          },
          data: { id: 'orders', label: 'Orders', icon: '' }
        },
        {
          type: 'HeaderButton',
          containerStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F8FAFC',
            border: '1px solid #CBD5E1',
            borderRadius: '6px',
            color: '#0F172A',
            fontSize: '13px',
            fontWeight: '600',
            padding: '4px 12px',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer'
          },
          data: { id: 'login', label: 'Log in', icon: '' }
        },
        {
          type: 'HeaderButton',
          containerStyle: {
            background: '#0F172A',
            backgroundColor: '#0F172A',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            border: '1px solid #0F172A',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '600',
            padding: '4px 14px',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer'
          },
          data: { id: 'signup', label: 'Sign up', icon: '' }
        }
      ]
    }
  },

  // 3. BLACK THEME: Minimal Dark / Black
  black_minimal: {
    id: 'black_minimal',
    name: 'Minimal Black',
    previewColor: '#000000',
    config: {
      type: 'Header',
      containerStyle: {
        background: '#000000',
        backgroundColor: '#000000',
        height: '48px',
        padding: '0 max(16px, calc((100% - 1180px) / 2))',
        boxSizing: 'border-box',
        borderBottom: '1px solid #262626',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.4)',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      },
      children: [
        {
          type: 'HeaderButton',
          containerStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            background: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: '700',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer'
          },
          data: { id: 'logo', label: 'SDUI·Commerce', icon: '♥' }
        },
        {
          type: 'HeaderButton',
          containerStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer',
            boxShadow: 'inset 0 -2px 0 #FFFFFF'
          },
          data: { id: 'home', label: 'Home', icon: '' }
        },
        {
          type: 'HeaderButton',
          containerStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#A3A3A3',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer'
          },
          data: { id: 'categories', label: 'Categories', icon: '' }
        },
        {
          type: 'HeaderButton',
          containerStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#A3A3A3',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer'
          },
          data: { id: 'deals', label: 'Deals', icon: '' }
        },
        {
          type: 'HeaderButton',
          containerStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#A3A3A3',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer'
          },
          data: { id: 'orders', label: 'Orders', icon: '' }
        },
        {
          type: 'HeaderButton',
          containerStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#171717',
            border: '1px solid #333333',
            borderRadius: '6px',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '600',
            padding: '4px 12px',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer'
          },
          data: { id: 'login', label: 'Log in', icon: '' }
        },
        {
          type: 'HeaderButton',
          containerStyle: {
            background: '#FFFFFF',
            backgroundColor: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            border: '1px solid #FFFFFF',
            color: '#000000',
            fontSize: '13px',
            fontWeight: '700',
            padding: '4px 14px',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'pointer'
          },
          data: { id: 'signup', label: 'Sign up', icon: '' }
        }
      ]
    }
  }
};
