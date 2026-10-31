export interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  dates: string;
  dateStart: string; // YYYY-MM-DD
  dateEnd: string;
  venue: string;
  campusLocation: string;
  category: 'Technical' | 'Cultural' | 'Sports' | 'Workshops';
  featured: boolean;
  status: 'Registration Open' | 'Live Today' | 'Upcoming' | 'Limited Passes';
  attendeeCount: number;
  description: string;
  organizer: {
    name: string;
    department: string;
    email: string;
    phone: string;
    deskLocation: string;
  };
  schedule: {
    day: string;
    date: string;
    dayNumber: number;
    sessions: {
      time: string;
      title: string;
      venue: string;
      type: string;
    }[];
  }[];
  announcements: {
    id: string;
    title: string;
    time: string;
    priority: 'high' | 'normal';
    content: string;
  }[];
}

export interface FoundItem {
  id: string;
  refCode: string;
  title: string;
  category: 'Electronics' | 'Bags' | 'Wallets' | 'ID Cards' | 'Clothing' | 'Books' | 'Accessories' | 'Other';
  description: string;
  foundLocation: string;
  foundDate: string; // YYYY-MM-DD
  foundTime: string;
  status: 'In Custody' | 'Verified Return' | 'Pending Verification';
  custodyLocation: string;
  custodianName: string;
  itemColor: string;
  hasPhoto: boolean;
  photoPlaceholderTheme: string;
  tags: string[];
}

export interface AnnouncementItem {
  id: string;
  title: string;
  source: string;
  category: 'Urgent' | 'Schedule' | 'Venue' | 'General';
  timestamp: string;
  date: string;
  content: string;
  isImportant?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'found_item' | 'event' | 'schedule' | 'announcement';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionRoute?: string;
  targetId?: string;
}

export const MAIN_FEATURED_EVENT: EventItem = {
  id: 'mavericks-2026',
  title: 'Mavericks Intercollege Fest 2026',
  subtitle: 'The Flagship Tri-State Collegiate Cultural & Tech Conclave',
  dates: '29 October – 31 October 2026',
  dateStart: '2026-10-29',
  dateEnd: '2026-10-31',
  venue: 'Grand Central Campus Arena & North Quad',
  campusLocation: 'Central Campus Grounds, Innovation District',
  category: 'Technical',
  featured: true,
  status: 'Registration Open',
  attendeeCount: 3850,
  description: 'Mavericks 2026 unites over 45 universities across three dynamic days of frontier technology exhibits, intercollegiate performing arts, competitive engineering hackathons, and national-level sports derbies. Designed to test ingenuity, foster collegiate camaraderie, and spotlight emergent student brilliance.',
  organizer: {
    name: 'Mavericks Central Fest Secretariat',
    department: 'Office of Student Affairs & Intercollegiate Council',
    email: 'secretariat@mavericksfest2026.edu',
    phone: '+1 (555) 438-2026',
    deskLocation: 'Central Helpdesk Pavilion Booth #4, North Quad',
  },
  schedule: [
    {
      day: 'Thursday',
      date: '2026-10-29',
      dayNumber: 1,
      sessions: [
        { time: '09:00 AM – 10:30 AM', title: 'Grand Opening Inauguration & Keynote', venue: 'Grand Central Arena', type: 'Ceremony' },
        { time: '11:00 AM – 02:00 PM', title: '36-Hour National Collegiate AI Hackathon Kickoff', venue: 'North Hall Innovation Wing', type: 'Technical' },
        { time: '02:30 PM – 05:00 PM', title: 'Intercollegiate Debate & Parliamentary Round 1', venue: 'Humanities Hall B', type: 'Cultural' },
        { time: '06:00 PM – 09:30 PM', title: 'Battle of the Bands: Preliminary Showdowns', venue: 'Amphitheatre Stage 1', type: 'Cultural' },
      ],
    },
    {
      day: 'Friday',
      date: '2026-10-30',
      dayNumber: 2,
      sessions: [
        { time: '09:30 AM – 12:30 PM', title: 'Autonomous Robotics & Drone Obstacle Derby', venue: 'Engineering Lawn Quad', type: 'Technical' },
        { time: '01:00 PM – 03:30 PM', title: 'National Student Design Sprint & Product Showcase', venue: 'Design Studio Lab 102', type: 'Workshops' },
        { time: '04:00 PM – 06:30 PM', title: 'Contemporary & Classical Dance Fusion Showcase', venue: 'Auditorium Main', type: 'Cultural' },
        { time: '07:30 PM – 10:00 PM', title: 'Mavericks Acoustic Night & Sunset Sessions', venue: 'Lakeside Amphitheatre', type: 'Cultural' },
      ],
    },
    {
      day: 'Saturday',
      date: '2026-10-31',
      dayNumber: 3,
      sessions: [
        { time: '10:00 AM – 01:00 PM', title: 'Startup Pitch Pit: Venture Capital Final Rounds', venue: 'Senate Hall Auditorium', type: 'Workshops' },
        { time: '01:30 PM – 04:30 PM', title: 'Intercollegiate Esports Grand Championship', venue: 'Digital Media Arena', type: 'Sports' },
        { time: '05:30 PM – 07:00 PM', title: 'Grand Valedictory & Awards Ceremony', venue: 'Grand Central Arena', type: 'Ceremony' },
        { time: '08:00 PM – 11:00 PM', title: 'Celebrity EDM Showcase & Fest Finale', venue: 'Festival Main Grounds', type: 'Cultural' },
      ],
    },
  ],
  announcements: [
    {
      id: 'ann-1',
      title: 'FindIt Physical Custody Desk Operational',
      time: '15 mins ago',
      priority: 'high',
      content: 'Any belongings recovered across grounds are securely cataloged at Central Helpdesk Booth #4. Open continuously from 8:00 AM to 10:00 PM daily.',
    },
    {
      id: 'ann-2',
      title: 'Robotics Arena Seating Update',
      time: '1 hour ago',
      priority: 'normal',
      content: 'Due to high turnout, Engineering Lawn Quad Bleachers will open 30 minutes before the 9:30 AM start.',
    },
    {
      id: 'ann-3',
      title: 'Shuttle Service Interval Increase',
      time: '3 hours ago',
      priority: 'normal',
      content: 'Campus eco-shuttles between South Transit Hub and North Arena now operating every 6 minutes.',
    },
  ],
};

export const ALL_EVENTS: EventItem[] = [
  MAIN_FEATURED_EVENT,
  {
    id: 'nexus-robotics-2026',
    title: 'Nexus Autonomous Systems & AI Summit',
    subtitle: 'Competitive robotics combat, autonomous rovers, and computer vision workshops',
    dates: '29 October – 30 October 2026',
    dateStart: '2026-10-29',
    dateEnd: '2026-10-30',
    venue: 'Robotics Lab & Quad Turf',
    campusLocation: 'North Science Complex',
    category: 'Technical',
    featured: false,
    status: 'Live Today',
    attendeeCount: 1420,
    description: 'A dedicated arena for student engineers featuring obstacle racing, drone navigation, and industry panels with robotics leads.',
    organizer: {
      name: 'Department of Electrical & Robotic Systems',
      department: 'Robotics Guild',
      email: 'nexus@campushub.edu',
      phone: '+1 (555) 302-8800',
      deskLocation: 'Robotics Wing Foyer',
    },
    schedule: [
      {
        day: 'Thursday',
        date: '2026-10-29',
        dayNumber: 1,
        sessions: [
          { time: '10:00 AM – 01:00 PM', title: 'Robot Arena Weight Inspection & Calibration', venue: 'Lab 12', type: 'Technical' },
          { time: '02:00 PM – 06:00 PM', title: 'Autonomous Rover Time Trials', venue: 'Quad Turf', type: 'Technical' },
        ],
      },
      {
        day: 'Friday',
        date: '2026-10-30',
        dayNumber: 2,
        sessions: [
          { time: '11:00 AM – 03:00 PM', title: 'Grand Combat Battles & Elimination', venue: 'Robotics Arena', type: 'Technical' },
        ],
      },
    ],
    announcements: [
      {
        id: 'ann-rob-1',
        title: 'Safety Goggles Required in Pit Area',
        time: '2 hours ago',
        priority: 'high',
        content: 'All team participants must check in with approved PPE at Pit Gate A.',
      },
    ],
  },
  {
    id: 'kaleidoscope-arts-2026',
    title: 'Kaleidoscope Contemporary Arts & Theatre Gala',
    subtitle: 'Intercollege theatre productions, classical instrumental ensembles, and street performance',
    dates: '30 October – 31 October 2026',
    dateStart: '2026-10-30',
    dateEnd: '2026-10-31',
    venue: 'Performing Arts Center & Black Box Studio',
    campusLocation: 'West Arts Quadrangle',
    category: 'Cultural',
    featured: false,
    status: 'Upcoming',
    attendeeCount: 2150,
    description: 'An immersive two-day arts festival presenting twelve university theatre acts, acoustic open mics, and student sculpture installations.',
    organizer: {
      name: 'Intercollegiate Arts Society',
      department: 'Fine Arts College',
      email: 'arts@campushub.edu',
      phone: '+1 (555) 749-1122',
      deskLocation: 'Performing Arts Lobby',
    },
    schedule: [
      {
        day: 'Friday',
        date: '2026-10-30',
        dayNumber: 1,
        sessions: [
          { time: '03:00 PM – 05:30 PM', title: 'One-Act Play Competition', venue: 'Black Box', type: 'Cultural' },
          { time: '07:00 PM – 09:30 PM', title: 'Symphonic Fusion Night', venue: 'Concert Hall', type: 'Cultural' },
        ],
      },
      {
        day: 'Saturday',
        date: '2026-10-31',
        dayNumber: 2,
        sessions: [
          { time: '01:00 PM – 04:00 PM', title: 'Street Theatre & Improvisation Showcase', venue: 'Arts Plaza', type: 'Cultural' },
        ],
      },
    ],
    announcements: [],
  },
  {
    id: 'zenith-derby-2026',
    title: 'Zenith Intercollege Sports Championship',
    subtitle: 'Competitive basketball, badminton invitational, track relay, and esports arenas',
    dates: '29 October – 31 October 2026',
    dateStart: '2026-10-29',
    dateEnd: '2026-10-31',
    venue: 'University Sports Complex & Aquatics Pavilion',
    campusLocation: 'South Athletics Complex',
    category: 'Sports',
    featured: false,
    status: 'Live Today',
    attendeeCount: 1980,
    description: 'Collegiate athletes from 24 institutions contend in 5-on-5 basketball tournaments, table tennis championships, and sprint finals.',
    organizer: {
      name: 'Athletics Board of Control',
      department: 'Sports Secretariat',
      email: 'zenith@campushub.edu',
      phone: '+1 (555) 601-3344',
      deskLocation: 'Fieldhouse Main Desk',
    },
    schedule: [
      {
        day: 'Thursday',
        date: '2026-10-29',
        dayNumber: 1,
        sessions: [
          { time: '08:30 AM – 12:00 PM', title: 'Men & Women Basketball Round 1', venue: 'Court 1 & 2', type: 'Sports' },
        ],
      },
      {
        day: 'Friday',
        date: '2026-10-30',
        dayNumber: 2,
        sessions: [
          { time: '09:00 AM – 01:00 PM', title: 'Badminton Semi-Finals', venue: 'Indoor Arena', type: 'Sports' },
        ],
      },
      {
        day: 'Saturday',
        date: '2026-10-31',
        dayNumber: 3,
        sessions: [
          { time: '02:00 PM – 05:00 PM', title: 'Zenith Derby Championship Finals', venue: 'Main Field', type: 'Sports' },
        ],
      },
    ],
    announcements: [],
  },
  {
    id: 'venture-sprint-2026',
    title: 'Design Sprint & Venture Builder Workshop',
    subtitle: 'Hands-on product design, rapid user testing, and seed investor pitching masterclass',
    dates: '30 October 2026',
    dateStart: '2026-10-30',
    dateEnd: '2026-10-30',
    venue: 'Design Studio Lab 102 & Maker Space',
    campusLocation: 'Innovation District Building C',
    category: 'Workshops',
    featured: false,
    status: 'Limited Passes',
    attendeeCount: 320,
    description: 'An intensive 6-hour hands-on workshop led by industry designers from top tech labs, covering rapid wireframing and venture architecture.',
    organizer: {
      name: 'Center for Entrepreneurship & Innovation',
      department: 'E-Cell',
      email: 'sprint@campushub.edu',
      phone: '+1 (555) 912-7000',
      deskLocation: 'Maker Space Desk',
    },
    schedule: [
      {
        day: 'Friday',
        date: '2026-10-30',
        dayNumber: 1,
        sessions: [
          { time: '09:30 AM – 12:00 PM', title: 'Sprint Framework & Problem Scoping', venue: 'Studio A', type: 'Workshops' },
          { time: '01:00 PM – 04:00 PM', title: 'Prototyping & Pitch Deck Feedback', venue: 'Studio B', type: 'Workshops' },
        ],
      },
    ],
    announcements: [],
  },
];

export const DEMO_FOUND_ITEMS: FoundItem[] = [
  {
    id: 'fnd-1',
    refCode: 'FND-8492',
    title: 'Space Grey MacBook Air M2 in Felt Sleeve',
    category: 'Electronics',
    description: '13-inch MacBook Air with a small silver NASA sticker on the top right lid. Stored inside a dark charcoal wool-felt zipper sleeve with a USB-C charger in the outer pocket.',
    foundLocation: 'North Hall Library — Media Study Bay 3B',
    foundDate: '2026-10-30',
    foundTime: '11:30 AM',
    status: 'In Custody',
    custodyLocation: 'Central Helpdesk Booth #4, North Quad',
    custodianName: 'Officer M. Henderson (Campus Security)',
    itemColor: 'Space Grey / Charcoal',
    hasPhoto: true,
    photoPlaceholderTheme: 'laptop',
    tags: ['Laptop', 'Apple', 'Charcoal Sleeve', 'Library'],
  },
  {
    id: 'fnd-2',
    refCode: 'FND-8493',
    title: 'AirPods Pro Gen 2 with Leather Carabiner Case',
    category: 'Electronics',
    description: 'White wireless charging case housed inside a saddle-brown genuine leather protective cover with an antiqued brass mini carabiner clip. Clean condition.',
    foundLocation: 'Amphitheatre Lower Seating — Row J, Seat 14',
    foundDate: '2026-10-30',
    foundTime: '02:15 PM',
    status: 'In Custody',
    custodyLocation: 'Central Helpdesk Booth #4, North Quad',
    custodianName: 'Vol. Priya Sharma (Student Council)',
    itemColor: 'Saddle Brown / White',
    hasPhoto: true,
    photoPlaceholderTheme: 'earbuds',
    tags: ['Earphones', 'Apple', 'Leather Case', 'Amphitheatre'],
  },
  {
    id: 'fnd-3',
    refCode: 'FND-8488',
    title: 'University Student Smart ID Card (Julian Drake)',
    category: 'ID Cards',
    description: 'Official University RFID smart card belonging to student Julian Drake (Computer Science Dept, Class of 2027). Attached to a green Mavericks Fest lanyard.',
    foundLocation: 'Main Food Court — Order Counter #2',
    foundDate: '2026-10-29',
    foundTime: '01:40 PM',
    status: 'In Custody',
    custodyLocation: 'Central Helpdesk Booth #4, North Quad',
    custodianName: 'Officer R. Chen (Student Helpdesk)',
    itemColor: 'White / Green Lanyard',
    hasPhoto: true,
    photoPlaceholderTheme: 'idcard',
    tags: ['Student ID', 'RFID', 'Food Court', 'Julian Drake'],
  },
  {
    id: 'fnd-4',
    refCode: 'FND-8495',
    title: 'Tan Minimalist Leather Bifold Wallet',
    category: 'Wallets',
    description: 'Vegetable-tanned full-grain leather wallet with initials "E.K." subtly debossed on the bottom corner. Contains student cards and locker pass (no cash details displayed).',
    foundLocation: 'Engineering Quad Turf — Near Stage B Soundboard',
    foundDate: '2026-10-30',
    foundTime: '04:00 PM',
    status: 'In Custody',
    custodyLocation: 'Central Helpdesk Booth #4, North Quad',
    custodianName: 'Vol. David K. (Event Staff)',
    itemColor: 'Tan / Warm Cognac',
    hasPhoto: true,
    photoPlaceholderTheme: 'wallet',
    tags: ['Wallet', 'Leather', 'Engineering Lawn', 'Stage B'],
  },
  {
    id: 'fnd-5',
    refCode: 'FND-8489',
    title: 'TI-84 Plus CE Color Graphing Calculator',
    category: 'Electronics',
    description: 'Black Texas Instruments graphing calculator with a blue slide-on protective cover. Has small holographic geometric tape on the rear battery plate.',
    foundLocation: 'Science Complex — Lecture Hall 204, Desk 12',
    foundDate: '2026-10-29',
    foundTime: '10:15 AM',
    status: 'In Custody',
    custodyLocation: 'Central Helpdesk Booth #4, North Quad',
    custodianName: 'Officer M. Henderson (Campus Security)',
    itemColor: 'Black / Blue Cover',
    hasPhoto: true,
    photoPlaceholderTheme: 'calculator',
    tags: ['Calculator', 'STEM', 'Room 204'],
  },
  {
    id: 'fnd-6',
    refCode: 'FND-8501',
    title: 'Navy Blue Collegiate Windbreaker (Size L)',
    category: 'Clothing',
    description: 'Water-resistant hooded jacket with embroidered white university crest on the chest. Kept neatly folded in safe storage.',
    foundLocation: 'South Athletics Fieldhouse — Bleachers Section 3',
    foundDate: '2026-10-31',
    foundTime: '03:30 PM',
    status: 'In Custody',
    custodyLocation: 'Central Helpdesk Booth #4, North Quad',
    custodianName: 'Officer T. Vance (Sports Desk)',
    itemColor: 'Deep Navy Blue',
    hasPhoto: true,
    photoPlaceholderTheme: 'jacket',
    tags: ['Jacket', 'Apparel', 'Fieldhouse', 'Athletics'],
  },
];

export const DEMO_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'anc-1',
    title: 'FindIt Custody Center Verified Protocols',
    source: 'Campus Security & Student Council',
    category: 'Urgent',
    timestamp: 'Today, 10:30 AM',
    date: '30 October 2026',
    content: 'All recovered articles during Mavericks Fest are securely cataloged at North Quad Helpdesk #4. If you spot a lost item, report it on CampusHub or hand it to any staff wearing green Mavericks bands.',
    isImportant: true,
  },
  {
    id: 'anc-2',
    title: 'Autonomous Robotics Derby Moved to 9:30 AM',
    source: 'Technical Committee',
    category: 'Schedule',
    timestamp: 'Today, 08:45 AM',
    date: '30 October 2026',
    content: 'Due to morning outdoor light calibration for camera sensors, the autonomous drone obstacle trials will commence at 9:30 AM sharp on Engineering Lawn.',
    isImportant: false,
  },
  {
    id: 'anc-3',
    title: 'Central Arena WiFi Frequency Band Optimization',
    source: 'Campus IT Infrastructure',
    category: 'General',
    timestamp: 'Yesterday, 04:15 PM',
    date: '29 October 2026',
    content: 'Attendees can connect to "Mavericks-5G-Guest" throughout the arena without registration tokens. Low-latency bands are prioritized for the Hackathon zones.',
    isImportant: false,
  },
  {
    id: 'anc-4',
    title: 'Design Sprint Workshop Passes Final Call',
    source: 'Center for Entrepreneurship',
    category: 'Venue',
    timestamp: 'Yesterday, 02:00 PM',
    date: '29 October 2026',
    content: 'Only 18 observer passes remaining for Friday afternoon pitch clinic in Maker Studio Lab 102. Check in at the entrance 15 minutes before session kickoff.',
    isImportant: false,
  },
];

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'found_item',
    title: 'New Found Item Logged: AirPods Pro',
    description: 'A set of AirPods Pro in a leather case was turned in from Amphitheatre Row J. Does this belong to you?',
    timestamp: '25m ago',
    read: false,
    actionRoute: 'item-details',
    targetId: 'fnd-2',
  },
  {
    id: 'notif-2',
    type: 'announcement',
    title: 'Robotics Derby Kickoff in 45 Minutes',
    description: 'Autonomous Systems & Drone Obstacle trials are starting soon at the Engineering Lawn Quad.',
    timestamp: '45m ago',
    read: false,
    actionRoute: 'event-details',
    targetId: 'nexus-robotics-2026',
  },
  {
    id: 'notif-3',
    type: 'found_item',
    title: 'MacBook Air Cataloged at Helpdesk #4',
    description: 'Found at North Hall Library Media Lab. Securely stored under reference #FND-8492.',
    timestamp: '2h ago',
    read: true,
    actionRoute: 'item-details',
    targetId: 'fnd-1',
  },
  {
    id: 'notif-4',
    type: 'schedule',
    title: 'Day 2 Sessions Live at Mavericks Fest',
    description: 'Explore the full Friday program across 4 main campus venues.',
    timestamp: '4h ago',
    read: true,
    actionRoute: 'calendar',
  },
];

export const USER_PROFILE = {
  name: 'Alex Rivera',
  role: 'Student Coordinator',
  college: 'School of Computing & Design',
  studentId: 'CH-2026-7841',
  email: 'alex.rivera@campushub.edu',
  phone: '+1 (555) 728-3940',
  registeredEventsCount: 3,
  reportedItemsCount: 1,
  claimedItemsCount: 0,
  preferences: {
    pushNotifications: true,
    lostItemAlerts: true,
    scheduleChanges: true,
    dailyDigest: false,
  },
};
