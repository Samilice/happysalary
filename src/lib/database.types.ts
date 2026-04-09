export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "client" | "admin";
          onboarding_completed: boolean;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "client" | "admin";
          onboarding_completed?: boolean;
          stripe_customer_id?: string | null;
        };
        Update: {
          full_name?: string | null;
          role?: "client" | "admin";
          onboarding_completed?: boolean;
          stripe_customer_id?: string | null;
        };
      };
      employers: {
        Row: {
          id: string;
          user_id: string;
          company_name: string | null;
          first_name: string;
          last_name: string;
          address_street: string;
          address_city: string;
          address_postal_code: string;
          address_canton: string;
          phone: string | null;
          avs_number: string | null;
          date_of_birth: string | null;
          nationality: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          company_name?: string | null;
          first_name: string;
          last_name: string;
          address_street: string;
          address_city: string;
          address_postal_code: string;
          address_canton: string;
          phone?: string | null;
          avs_number?: string | null;
          date_of_birth?: string | null;
          nationality?: string | null;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["employers"]["Insert"], "user_id">>;
      };
      employees: {
        Row: {
          id: string;
          employer_id: string;
          first_name: string;
          last_name: string;
          address_street: string;
          address_city: string;
          address_postal_code: string;
          date_of_birth: string;
          nationality: string;
          avs_number: string;
          permit_type: string | null;
          job_title: string;
          employment_type: "cleaning" | "nanny" | "au_pair" | "elderly_care" | "gardener" | "other";
          start_date: string;
          end_date: string | null;
          monthly_hours: number;
          hourly_rate: number;
          monthly_salary: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          employer_id: string;
          first_name: string;
          last_name: string;
          address_street: string;
          address_city: string;
          address_postal_code: string;
          date_of_birth: string;
          nationality: string;
          avs_number: string;
          permit_type?: string | null;
          job_title: string;
          employment_type: "cleaning" | "nanny" | "au_pair" | "elderly_care" | "gardener" | "other";
          start_date: string;
          end_date?: string | null;
          monthly_hours: number;
          hourly_rate: number;
          monthly_salary: number;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["employees"]["Insert"]>;
      };
      documents: {
        Row: {
          id: string;
          employee_id: string;
          type: "salary_sheet" | "employment_contract" | "annual_statement" | "other";
          title: string;
          period_month: number | null;
          period_year: number | null;
          status: "pending" | "generating" | "ready" | "sent";
          file_url: string | null;
          generated_at: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          employee_id: string;
          type: "salary_sheet" | "employment_contract" | "annual_statement" | "other";
          title: string;
          period_month?: number | null;
          period_year?: number | null;
          status?: "pending" | "generating" | "ready" | "sent";
          file_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["documents"]["Insert"]>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string | null;
          stripe_customer_id: string | null;
          plan: "basic" | "comfort" | "premium";
          status: "active" | "past_due" | "canceled" | "trialing";
          current_period_start: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          plan: "basic" | "comfort" | "premium";
          status?: "active" | "past_due" | "canceled" | "trialing";
          current_period_start?: string | null;
          current_period_end?: string | null;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["subscriptions"]["Insert"], "user_id">>;
      };
      checklist_progress: {
        Row: {
          id: string;
          employee_id: string;
          step_key: string;
          completed: boolean;
          completed_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          employee_id: string;
          step_key: string;
          completed?: boolean;
          completed_at?: string | null;
          notes?: string | null;
        };
        Update: {
          completed?: boolean;
          completed_at?: string | null;
          notes?: string | null;
        };
      };
    };
    Views: {
      admin_client_overview: {
        Row: {
          user_id: string;
          email: string;
          full_name: string | null;
          onboarding_completed: boolean;
          registered_at: string;
          employer_first_name: string | null;
          employer_last_name: string | null;
          address_canton: string | null;
          phone: string | null;
          employee_count: number;
          active_employee_count: number;
          subscription_plan: string | null;
          subscription_status: string | null;
        };
      };
    };
  };
};
