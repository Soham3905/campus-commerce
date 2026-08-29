/**
 * CountDownTimer Component Schema (Interface)
 */
export const CountDownTimerSchema = {
  type: 'CountDownTimer',
  displayName: 'Countdown Timer',
  category: 'Marketing',
  allowedChildren: [],
  defaultData: {
    targetDate: '2026-12-31T23:59:59',
    label: 'Limited Time Deal Ends In:',
    showDays: 'false',
    expiredText: 'Offer Expired!'
  },
  defaultStyle: {
    padding: '10px',
    backgroundColor: '#fff3cd',
    borderRadius: '12px',
    border: '1px solid #ffeeba',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center'
  }
};
