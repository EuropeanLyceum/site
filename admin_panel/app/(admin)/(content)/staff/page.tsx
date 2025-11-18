'use client';

import StaffManager from "@/components/content-managers/StaffManager";

export default function StaffPage() {
  return (
    <StaffManager 
      apiEndpoint="/api/staff" 
      title="Педагогічний колектив" 
    />
  );
}


