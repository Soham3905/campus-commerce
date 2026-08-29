/**
 * CouponCode Component Schema (Interface)
 */
export const CouponCodeSchema = {
  type: 'CouponCode',
  displayName: 'Coupon Code Widget',
  category: 'Marketing',
  allowedChildren: [],
  defaultData: {
    title: 'CAMPUS20',
    description: 'Get 20% off on your first order with campus ID',
    copyLabel: 'Copy Code'
  },
  defaultStyle: {
    padding: '12px',
    backgroundColor: '#e8f5e9',
    borderRadius: '8px',
    border: '2px dashed #4caf50',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
};
