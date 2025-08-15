import { errorHandler, AppError } from './errorHandler';

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
    const response = await errorHandler.fetchWithErrorHandling(
      `${API_BASE_URL}/api/complaints`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complaintData),
      },
      'creating complaint'
    );

    const data = await response.json();
    
    if (!data.success) {
      throw new AppError(
        data.message || 'Failed to create complaint',
        false,
        true,
        'Complaint Submission Failed',
        'Unable to submit your complaint. Please try again.'
      );
    }

    return data;
  },

  // Get complaints by student roll number
  async getComplaintsByStudent(studentRoll: string): Promise<Complaint[]> {
    const response = await errorHandler.fetchWithErrorHandling(
      `${API_BASE_URL}/api/complaints/student?student_roll=${studentRoll}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      'fetching complaints'
    );

    const data = await response.json();
    
    if (!data.success) {
      throw new AppError(
        data.message || 'Failed to fetch complaints',
        false,
        true,
        'Failed to Load Complaints',
        'Unable to load your complaints. Please try again.'
      );
    }

    return data.data;
  },

  // Get complaint by ID
  async getComplaintById(id: number): Promise<Complaint> {
    const response = await errorHandler.fetchWithErrorHandling(
      `${API_BASE_URL}/api/complaints/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      'fetching complaint details'
    );

    const data = await response.json();
    
    if (!data.success) {
      throw new AppError(
        data.message || 'Failed to fetch complaint',
        false,
        true,
        'Failed to Load Complaint',
        'Unable to load complaint details. Please try again.'
      );
    }

    return data.data;
  },

  // Update complaint status
  async updateComplaintStatus(id: number, status: string, wardenId: string): Promise<{ success: boolean; message: string }> {
    const response = await errorHandler.fetchWithErrorHandling(
      `${API_BASE_URL}/api/complaints/${id}/status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          warden_id: wardenId,
        }),
      },
      'updating complaint status'
    );

    const data = await response.json();
    
    if (!data.success) {
      throw new AppError(
        data.message || 'Failed to update complaint status',
        false,
        true,
        'Update Failed',
        'Unable to update complaint status. Please try again.'
      );
    }

    return data;
  },

  // Get complaint statistics
  async getComplaintStats(): Promise<{
    total_complaints: number;
    pending: number;
    in_progress: number;
    resolved: number;
    rejected: number;
  }> {
    const response = await errorHandler.fetchWithErrorHandling(
      `${API_BASE_URL}/api/stats`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      'fetching complaint statistics'
    );

    const data = await response.json();
    
    if (!data.success) {
      throw new AppError(
        data.message || 'Failed to fetch statistics',
        false,
        true,
        'Failed to Load Statistics',
        'Unable to load complaint statistics. Please try again.'
      );
    }

    return data.data;
  },
};
