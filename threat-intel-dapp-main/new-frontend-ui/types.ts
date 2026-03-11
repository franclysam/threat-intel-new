
export enum DashboardTab {
  REPORTS = 'reports',
  SCANNER = 'scanner',
  COMMUNITY = 'community',
  REWARDS = 'rewards',
  PROFILE = 'profile'
}

export interface ThreatReport {
  id: string;
  type: 'Malware' | 'Phishing' | 'Exploit' | 'Other';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  timestamp: string;
  reporter: string;
  status: 'Verified' | 'Pending' | 'Rejected';
}

export interface RewardTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'Submission' | 'Validation' | 'Withdrawal';
  status: 'Completed' | 'Processing';
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  time: string;
  isOfficial?: boolean;
}
