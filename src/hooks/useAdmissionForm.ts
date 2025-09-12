import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdmissionFormData {
  applicantName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  courseType: string;
  previousQualification: string;
  marksPercentage: number;
  departmentId?: string;
  documents: File[];
}

export const useAdmissionForm = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submitApplication = async (formData: AdmissionFormData) => {
    setLoading(true);
    try {
      // Upload documents to storage (if implemented)
      const documentUrls: string[] = [];
      
      // Submit application to database
      const { data, error } = await supabase
        .from('admissions')
        .insert({
          applicant_name: formData.applicantName,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth,
          address: formData.address,
          course_type: formData.courseType,
          previous_qualification: formData.previousQualification,
          marks_percentage: formData.marksPercentage,
          department_id: formData.departmentId,
          documents: documentUrls,
          application_status: 'pending',
          submitted_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Application Submitted Successfully!",
        description: "Your admission application has been received. You will be contacted soon.",
      });

      return { success: true, data };
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { submitApplication, loading };
};