export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      complaint_actions: {
        Row: {
          action_details: string
          action_type: string
          complaint_id: string
          created_at: string
          id: string
          modified_by: string
        }
        Insert: {
          action_details: string
          action_type: string
          complaint_id: string
          created_at?: string
          id?: string
          modified_by: string
        }
        Update: {
          action_details?: string
          action_type?: string
          complaint_id?: string
          created_at?: string
          id?: string
          modified_by?: string
        }
        Relationships: []
      }
      customer_satisfaction: {
        Row: {
          category: string
          created_at: string | null
          displeased: number
          id: string
          neutral: number
          period_type: string
          pleased: number
          total_score: number
          updated_at: string | null
          very_displeased: number
          very_pleased: number
        }
        Insert: {
          category: string
          created_at?: string | null
          displeased?: number
          id?: string
          neutral?: number
          period_type: string
          pleased?: number
          total_score?: number
          updated_at?: string | null
          very_displeased?: number
          very_pleased?: number
        }
        Update: {
          category?: string
          created_at?: string | null
          displeased?: number
          id?: string
          neutral?: number
          period_type?: string
          pleased?: number
          total_score?: number
          updated_at?: string | null
          very_displeased?: number
          very_pleased?: number
        }
        Relationships: []
      }
      customer_service_metrics: {
        Row: {
          category: string
          created_at: string | null
          id: string
          metric_name: string
          period_type: string
          updated_at: string | null
          value: number
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          metric_name: string
          period_type: string
          updated_at?: string | null
          value?: number
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          metric_name?: string
          period_type?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          change: number | null
          created_at: string | null
          id: string
          is_positive: boolean | null
          metric_name: string
          period_type: string
          target: number
          target_achieved: boolean | null
          updated_at: string | null
          value: number
        }
        Insert: {
          change?: number | null
          created_at?: string | null
          id?: string
          is_positive?: boolean | null
          metric_name: string
          period_type: string
          target: number
          target_achieved?: boolean | null
          updated_at?: string | null
          value: number
        }
        Update: {
          change?: number | null
          created_at?: string | null
          id?: string
          is_positive?: boolean | null
          metric_name?: string
          period_type?: string
          target?: number
          target_achieved?: boolean | null
          updated_at?: string | null
          value?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
