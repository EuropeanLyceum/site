export interface SchoolHistoryItem {
  id: number;
  title?: string;
  content?: string;
  photoUrls: string[];
  createdAt: string;
}

export async function getSchoolHistoryData(): Promise<SchoolHistoryItem[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/school-history`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch school history data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching school history data:', error);
    return [];
  }
}
