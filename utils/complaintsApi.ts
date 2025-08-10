const API_BASE_URL = 'https://risecomplaint.mssonutech.workers.dev';

export interface ComplaintData {
  student_roll: string;
  student_name: string;
  category: string;
  subcategory?: string;
  description?: string;
  photos?: string[];
  room_number: string;
  hostel_name: string;
  status?: string;
  warden_id?: string;
}

export interface ComplaintResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
  };
}

export interface Complaint {
  id: number;
  student_roll: string;
  student_name: string;
  category: string;
  subcategory?: string;
  description?: string;
  photos?: string[];
  room_number: string;
  hostel_name: string;
  status: string;
  warden_id?: string;
  created_at: string;
  updated_at: string;
  in_progress_at?: string;
  resolved_at?: string;
  rejected_at?: string;
}

export interface ComplaintsListResponse {
  success: boolean;
  data: Complaint[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const complaintsApi = {
  // Create a new complaint
  async createComplaint(complaintData: ComplaintData): Promise<ComplaintResponse> {
    const response = await fetch(`${API_BASE_URL}/api/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(complaintData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create complaint');
    }

    return response.json();
  },

  // Get complaints by student roll number
  async getComplaintsByStudent(studentRoll: string): Promise<Complaint[]> {
    const response = await fetch(`${API_BASE_URL}/api/complaints/student?student_roll=${studentRoll}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch complaints');
    }

    const data = await response.json();
    return data.data;
  },

  // Get complaint by ID
  async getComplaintById(id: number): Promise<Complaint> {
    const response = await fetch(`${API_BASE_URL}/api/complaints/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch complaint');
    }

    const data = await response.json();
    return data.data;
  },

  // Update complaint status
  async updateComplaintStatus(id: number, status: string, wardenId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/complaints/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        warden_id: wardenId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update complaint status');
    }

    return response.json();
  },

  // Get complaint statistics
  async getComplaintStats(): Promise<{
    total_complaints: number;
    pending: number;
    in_progress: number;
    resolved: number;
    rejected: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch statistics');
    }

    const data = await response.json();
    return data.data;
  },
};
