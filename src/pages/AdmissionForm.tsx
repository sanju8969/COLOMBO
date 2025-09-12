import React from 'react';
import AdmissionForm from '@/components/forms/AdmissionForm';

const AdmissionFormPage = () => {
  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Apply for Admission</h1>
          <p className="text-xl text-muted-foreground">
            Fill out the form below to apply for admission to St. Columba's College
          </p>
        </div>
        <AdmissionForm />
      </div>
    </div>
  );
};

export default AdmissionFormPage;