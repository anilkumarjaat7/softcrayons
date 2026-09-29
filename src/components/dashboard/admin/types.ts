export interface DashboardData {
  kpi: {
    totalStudents: number;
    studentGrowth: string;
    pendingEnquiries: number;
    totalRevenue: number;
    totalPlacements: number;
    totalEnquiries: number;
    enrolledEnquiries: number;
  };
  crm: {
    enquiryFunnel: { stage: string; value: number }[];
    unassignedLeads: {
      id: number;
      name: string;
      email: string;
      phone: string;
      course: string;
      createdAt: string;
    }[];
    topAgents: {
      agent: { name: string; email: string; image?: string | null };
      enrollments: number;
    }[];
    leadSource: {
      student: number;
      enterprise: number;
    };
  };
  coursePerformance: {
    popularCourses: { course: string; enquiries: number }[];
    revenueByCategory: { category: string; revenue: number }[];
    courseDifficulty: { difficulty: string; count: number }[];
  };
  hr: {
    hiringPipeline: { stage: string; value: number }[];
    topFaculty: {
      id: number;
      name: string;
      designation: string | null;
      domain: string | null;
      ratings: number | null;
      studentsMentored: string | null;
      avatar: string | null;
    }[];
  };
  content: {
    blogActivity: { date: string; count: number }[];
    pendingReviews: number;
    totalBlogs: number;
    totalTestimonials: number;
  };
  system: {
    activeSessions: number;
    userRegistrationTrend: { date: string; registrations: number }[];
    usersByRole: { role: string; count: number }[];
  };
}
