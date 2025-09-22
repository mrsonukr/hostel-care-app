// utils/verificationApi.ts
export const resendVerificationEmail = async (roll_no: string) => {
  try {
    const response = await fetch('https://hostelapis.mssonutech.workers.dev/api/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roll_no: roll_no
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send verification email');
    }

    return {
      success: true,
      message: result.message || 'Verification email sent successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
};
