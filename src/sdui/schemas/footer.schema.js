/**
 * Footer Component Schema (Interface)
 */
export const FooterSchema = {
  type: 'Footer',
  displayName: 'Footer',
  category: 'Layout',
  allowedChildren: [],
  defaultData: {
    copyrightText: '© 2026 CampusCommerce. All rights reserved.',
    sections: [
      {
        title: 'Campus Store',
        links: [
          { label: 'About Us', url: '#' },
          { label: 'Student Deals', url: '#' },
          { label: 'Terms & Conditions', url: '#' }
        ]
      },
      {
        title: 'Support',
        links: [
          { label: 'Help Center', url: '#' },
          { label: 'Returns & Refunds', url: '#' },
          { label: 'Contact Us', url: '#' }
        ]
      }
    ]
  },
  defaultStyle: {
    padding: '24px 16px',
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
    width: '100%',
    boxSizing: 'border-box'
  }
};
