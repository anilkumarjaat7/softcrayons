import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      totalStudents,
      studentsLastMonth,
      pendingEnquiries,
      totalPlacements,
      enrolledEnquiries,
      totalEnquiries,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT', banned: false } }),
      prisma.user.count({
        where: {
          role: 'STUDENT',
          banned: false,
          createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        },
      }),
      prisma.enquiry.count({ where: { status: 'NEW' } }),
      prisma.placement.count(),
      prisma.enquiry.count({ where: { status: 'ENROLLED' } }),
      prisma.enquiry.count(),
    ]);

    const enrolledWithFees = await prisma.enquiry.findMany({
      where: { status: 'ENROLLED' },
      select: { course: { select: { fees: true, discount: true } } },
    });
    const totalRevenue = enrolledWithFees.reduce((sum, e) => {
      if (e.course?.fees) {
        const discount = e.course.discount || 0;
        return sum + (e.course.fees - discount);
      }
      return sum;
    }, 0);

    const studentGrowth = studentsLastMonth > 0
      ? (((totalStudents - studentsLastMonth) / studentsLastMonth) * 100).toFixed(1)
      : '0';

    const [newCount, contactedCount, enrolledCount, deadCount, archivedCount] = await Promise.all([
      prisma.enquiry.count({ where: { status: 'NEW' } }),
      prisma.enquiry.count({ where: { status: 'CONTACTED' } }),
      prisma.enquiry.count({ where: { status: 'ENROLLED' } }),
      prisma.enquiry.count({ where: { status: 'DEAD' } }),
      prisma.enquiry.count({ where: { status: 'ARCHIVED' } }),
    ]);

    const enquiryFunnel = [
      { stage: 'New', value: newCount },
      { stage: 'Contacted', value: contactedCount },
      { stage: 'Enrolled', value: enrolledCount },
      { stage: 'Dead', value: deadCount },
      { stage: 'Archived', value: archivedCount },
    ];

    const unassignedLeads = await prisma.enquiry.findMany({
      where: { assignedToId: null, status: 'NEW' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { course: { select: { title: true } } },
    });

    const agentPerformanceRaw = await prisma.enquiry.groupBy({
      by: ['agentId'],
      where: { status: 'ENROLLED', agentId: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    const agentIds = agentPerformanceRaw
      .map((a) => a.agentId)
      .filter((id): id is string => id !== null);
    const agents = agentIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: agentIds } },
          select: { id: true, name: true, email: true, image: true },
        })
      : [];
    const agentMap = new Map(agents.map((a) => [a.id, a]));

    const topAgents = agentPerformanceRaw.map((a) => ({
      agent: agentMap.get(a.agentId!) || { name: 'Unknown', email: '' },
      enrollments: a._count.id,
    }));

    const [studentLeads, enterpriseLeads] = await Promise.all([
      prisma.enquiry.count(),
      prisma.enterpriseEnquiry.count(),
    ]);

    const popularCoursesRaw = await prisma.enquiry.groupBy({
      by: ['courseId'],
      where: { courseId: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 6,
    });

    const courseIds = popularCoursesRaw
      .map((c) => c.courseId)
      .filter((id): id is number => id !== null);
    const courses = courseIds.length > 0
      ? await prisma.course.findMany({
          where: { id: { in: courseIds } },
          select: { id: true, title: true, fees: true, categoryId: true, category: { select: { title: true } } },
        })
      : [];
    const courseMap = new Map(courses.map((c) => [c.id, c]));

    const popularCourses = popularCoursesRaw.map((c) => ({
      course: courseMap.get(c.courseId!)?.title || 'Unknown',
      enquiries: c._count.id,
    }));

    const enrolledWithCategory = await prisma.enquiry.findMany({
      where: { status: 'ENROLLED', courseId: { not: null } },
      select: {
        course: {
          select: {
            fees: true,
            discount: true,
            category: { select: { title: true } },
          },
        },
      },
    });
    const revByCatMap = new Map<string, number>();
    for (const e of enrolledWithCategory) {
      if (e.course) {
        const cat = e.course.category.title;
        const fee = (e.course.fees || 0) - (e.course.discount || 0);
        revByCatMap.set(cat, (revByCatMap.get(cat) || 0) + fee);
      }
    }
    const revenueByCategory = Array.from(revByCatMap.entries()).map(([category, revenue]) => ({
      category,
      revenue,
    }));

    const difficultyDist = await prisma.course.groupBy({
      by: ['difficulty'],
      _count: { id: true },
    });
    const courseDifficulty = difficultyDist.map((d) => ({
      difficulty: d.difficulty,
      count: d._count.id,
    }));

    const [fNew, fContacted, fHired, fClosed, fArchived] = await Promise.all([
      prisma.facultyEnquiry.count({ where: { status: 'NEW' } }),
      prisma.facultyEnquiry.count({ where: { status: 'CONTACTED' } }),
      prisma.facultyEnquiry.count({ where: { status: 'HIRED' } }),
      prisma.facultyEnquiry.count({ where: { status: 'CLOSED' } }),
      prisma.facultyEnquiry.count({ where: { status: 'ARCHIVED' } }),
    ]);

    const hiringPipeline = [
      { stage: 'New', value: fNew },
      { stage: 'Contacted', value: fContacted },
      { stage: 'Hired', value: fHired },
      { stage: 'Closed', value: fClosed },
      { stage: 'Archived', value: fArchived },
    ];

    const topFaculty = await prisma.faculty.findMany({
      orderBy: { ratings: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        designation: true,
        domain: true,
        ratings: true,
        studentsMentored: true,
        avatar: true,
      },
    });

    const recentBlogs = await prisma.blog.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const blogActivityMap = new Map<string, number>();
    for (const b of recentBlogs) {
      const dateKey = b.createdAt.toISOString().split('T')[0];
      blogActivityMap.set(dateKey, (blogActivityMap.get(dateKey) || 0) + 1);
    }
    const blogActivity: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split('T')[0];
      blogActivity.push({ date: key, count: blogActivityMap.get(key) || 0 });
    }

    const pendingReviews = await prisma.testimonial.count({ where: { isPublic: false } });

    const [totalBlogs, totalTestimonials] = await Promise.all([
      prisma.blog.count(),
      prisma.testimonial.count(),
    ]);

    const activeSessions = await prisma.session.count({
      where: { expiresAt: { gt: now } },
    });

    const recentUsers = await prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const userTrendMap = new Map<string, number>();
    for (const u of recentUsers) {
      const dateKey = u.createdAt.toISOString().split('T')[0];
      userTrendMap.set(dateKey, (userTrendMap.get(dateKey) || 0) + 1);
    }
    const userRegistrationTrend: { date: string; registrations: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split('T')[0];
      userRegistrationTrend.push({ date: key, registrations: userTrendMap.get(key) || 0 });
    }

    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: { id: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        kpi: {
          totalStudents,
          studentGrowth: `${studentGrowth}%`,
          pendingEnquiries,
          totalRevenue,
          totalPlacements,
          totalEnquiries,
          enrolledEnquiries,
        },
        crm: {
          enquiryFunnel,
          unassignedLeads: unassignedLeads.map((l) => ({
            id: l.id,
            name: l.name,
            email: l.email,
            phone: l.phone,
            course: l.course?.title || 'N/A',
            createdAt: l.createdAt,
          })),
          topAgents,
          leadSource: {
            student: studentLeads,
            enterprise: enterpriseLeads,
          },
        },
        coursePerformance: {
          popularCourses,
          revenueByCategory,
          courseDifficulty,
        },
        hr: {
          hiringPipeline,
          topFaculty,
        },
        content: {
          blogActivity,
          pendingReviews,
          totalBlogs,
          totalTestimonials,
        },
        system: {
          activeSessions,
          userRegistrationTrend,
          usersByRole: usersByRole.map((r) => ({
            role: r.role,
            count: r._count.id,
          })),
        },
      },
    });
  } catch (error: any) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
