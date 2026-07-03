/**
 * Initial sample leads data for Startup CRM Lite.
 * Conforms to the Lead schema type containing both status and stage properties.
 * 
 * @type {Array<Object>}
 */
export const sampleLeads = [
  {
    id: 'lead-s1',
    name: 'Amit Sharma',
    company: 'Tech Mahindra',
    email: 'amit.sharma@techmahindra.com',
    phone: '+91 98765 43210',
    value: 28000,
    status: 'New',
    stage: 'New',
    priority: 'Medium',
    temperature: 'Warm',
    owner: 'Alex Rivera',
    source: 'Website',
    createdAt: '2026-06-24T10:00:00Z',
    notes: 'Inbound inquiry from tech portal signup. Looking for platform integrations.',
    history: [
      { id: 'h-s1', type: 'create', text: 'Lead created via Website signup form', time: '2026-06-24T10:00:00Z' }
    ]
  },
  {
    id: 'lead-s2',
    name: 'Priya Patel',
    company: 'Infosys Ltd',
    email: 'priya.patel@infosys.com',
    phone: '+91 87654 32109',
    value: 45000,
    status: 'New',
    stage: 'New',
    priority: 'High',
    temperature: 'Hot',
    owner: 'Sarah Jenkins',
    source: 'LinkedIn',
    createdAt: '2026-06-25T08:30:00Z',
    notes: 'Exexpressed interest in enterprise seats. Emailed brochure documentation.',
    history: [
      { id: 'h-s2', type: 'create', text: 'Lead created via LinkedIn Outbound campaign', time: '2026-06-25T08:30:00Z' }
    ]
  },
  {
    id: 'lead-s3',
    name: 'Rohan Das',
    company: 'Zomato',
    email: 'rohan.das@zomato.com',
    phone: '+91 76543 21098',
    value: 65000,
    status: 'Contacted',
    stage: 'Contacted',
    priority: 'High',
    temperature: 'Hot',
    owner: 'Michael Chen',
    source: 'Referral',
    createdAt: '2026-06-22T14:15:00Z',
    notes: 'Introduced by regional advisor. Had preliminary phone brief discussion.',
    history: [
      { id: 'h-s3a', type: 'create', text: 'Lead created via referral', time: '2026-06-22T14:15:00Z' },
      { id: 'h-s3b', type: 'status', text: 'Stage updated to Contacted after introduction call', time: '2026-06-23T11:00:00Z' }
    ]
  },
  {
    id: 'lead-s4',
    name: 'Ananya Sen',
    company: 'Paytm',
    email: 'ananya.sen@paytm.com',
    phone: '+91 65432 10987',
    value: 38000,
    status: 'Meeting Scheduled',
    stage: 'Meeting Scheduled',
    priority: 'Medium',
    temperature: 'Warm',
    owner: 'Alex Rivera',
    source: 'Email Campaign',
    createdAt: '2026-06-23T09:00:00Z',
    notes: 'Scheduled platform demonstration session for next Thursday at 3 PM IST.',
    history: [
      { id: 'h-s4a', type: 'create', text: 'Lead created via email campaign', time: '2026-06-23T09:00:00Z' },
      { id: 'h-s4b', type: 'status', text: 'Stage updated to Meeting Scheduled', time: '2026-06-24T16:00:00Z' }
    ]
  },
  {
    id: 'lead-s5',
    name: 'Vikram Singh',
    company: 'Ola Cabs',
    email: 'vikram.singh@olacabs.com',
    phone: '+91 91234 56789',
    value: 95000,
    status: 'Won',
    stage: 'Won',
    priority: 'High',
    temperature: 'Hot',
    owner: 'Sarah Jenkins',
    source: 'Referral',
    createdAt: '2026-06-15T11:00:00Z',
    notes: 'Contract finalized and signed. Transferred account configuration details.',
    history: [
      { id: 'h-s5a', type: 'create', text: 'Lead created via referral', time: '2026-06-15T11:00:00Z' },
      { id: 'h-s5b', type: 'status', text: 'Stage updated to Won after signing deal', time: '2026-06-20T17:30:00Z' }
    ]
  },
  {
    id: 'lead-s6',
    name: 'Meera Nair',
    company: 'KreditBee',
    email: 'meera.nair@kreditbee.in',
    phone: '+91 81234 56789',
    value: 15000,
    status: 'Lost',
    stage: 'Lost',
    priority: 'Low',
    temperature: 'Cold',
    owner: 'Michael Chen',
    source: 'Cold Call',
    createdAt: '2026-06-12T13:00:00Z',
    notes: 'Decided to defer their tool qualification requirements until next calendar budget year.',
    history: [
      { id: 'h-s6a', type: 'create', text: 'Lead created via Cold Call', time: '2026-06-12T13:00:00Z' },
      { id: 'h-s6b', type: 'status', text: 'Stage updated to Lost due to budget deferral', time: '2026-06-16T10:00:00Z' }
    ]
  }
];
