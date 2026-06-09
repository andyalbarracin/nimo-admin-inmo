// Stub until real types are generated. Run after SQL migrations:
//   pnpm dlx supabase gen types typescript --project-id ihfholzcrvukehezjfuf > src/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      agencies: {
        Row: {
          id: string
          name: string
          slug: string
          primary_color: string | null
          secondary_color: string | null
          logo_url: string | null
          plan: string
          plan_status: string
          plan_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['agencies']['Row']>
        Update: Partial<Database['public']['Tables']['agencies']['Row']>
        Relationships: []
      }
      agency_members: {
        Row: {
          id: string
          agency_id: string
          user_id: string
          role: Database['public']['Enums']['member_role']
          display_name: string | null
          is_active: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['agency_members']['Row']>
        Update: Partial<Database['public']['Tables']['agency_members']['Row']>
        Relationships: [
          {
            foreignKeyName: "agency_members_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          }
        ]
      }
      agency_theme: {
        Row: {
          id: string
          agency_id: string
          primary_color: string
          secondary_color: string | null
          accent_color: string | null
          font_family: string | null
          font_display: string | null
          logo_url: string | null
          favicon_url: string | null
          hero_image_url: string | null
          home_layout: string
          property_card_style: string
          show_featured_section: boolean
          show_recent_section: boolean
          show_neighborhoods_section: boolean
          custom_css: string | null
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['agency_theme']['Row']>
        Update: Partial<Database['public']['Tables']['agency_theme']['Row']>
        Relationships: [
          {
            foreignKeyName: "agency_theme_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: true
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          }
        ]
      }
      agency_settings: {
        Row: {
          id: string
          agency_id: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['agency_settings']['Row']>
        Update: Partial<Database['public']['Tables']['agency_settings']['Row']>
        Relationships: []
      }
      properties: {
        Row: {
          id: string
          agency_id: string
          title: string
          description: string | null
          operation: string
          operation_type: string
          type: string
          property_type: string
          price: number | null
          currency: string
          expenses: number | null
          expenses_currency: string | null
          address: string | null
          neighborhood: string | null
          city: string | null
          province: string | null
          latitude: number | null
          longitude: number | null
          show_exact_location: boolean
          bedrooms: number | null
          bathrooms: number | null
          rooms: number | null
          garages: number | null
          covered_area: number | null
          area_m2: number | null
          total_area: number | null
          status: string
          featured: boolean
          is_featured: boolean
          amenities: string[]
          video_url: string | null
          virtual_tour_url: string | null
          meta_title: string | null
          meta_description: string | null
          assigned_to: string | null
          internal_notes: string | null
          exclusive: boolean
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['properties']['Row']>
        Update: Partial<Database['public']['Tables']['properties']['Row']>
        Relationships: [
          {
            foreignKeyName: "properties_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          }
        ]
      }
      property_images: {
        Row: {
          id: string
          property_id: string
          url: string
          position: number
          is_cover: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['property_images']['Row']>
        Update: Partial<Database['public']['Tables']['property_images']['Row']>
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          }
        ]
      }
      leads: {
        Row: {
          id: string
          agency_id: string
          property_id: string | null
          assigned_to: string | null
          name: string
          email: string | null
          phone: string | null
          message: string | null
          stage: string
          status: string
          lead_type: string | null
          source: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['leads']['Row']>
        Update: Partial<Database['public']['Tables']['leads']['Row']>
        Relationships: [
          {
            foreignKeyName: "leads_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          }
        ]
      }
      lead_events: {
        Row: {
          id: string
          lead_id: string
          user_id: string | null
          event_type: string
          note: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['lead_events']['Row']>
        Update: Partial<Database['public']['Tables']['lead_events']['Row']>
        Relationships: []
      }
      platform_plans: {
        Row: {
          id: string
          name: string
          slug: string
          price_usd: number
          max_properties: number | null
          max_agents: number | null
          features: Json
          active: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['platform_plans']['Row']>
        Update: Partial<Database['public']['Tables']['platform_plans']['Row']>
        Relationships: []
      }
      platform_settings: {
        Row: {
          id: number
          maintenance_mode: boolean
          signup_enabled: boolean
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['platform_settings']['Row']>
        Update: Partial<Database['public']['Tables']['platform_settings']['Row']>
        Relationships: []
      }
      platform_usage: {
        Row: {
          id: string
          agency_id: string
          metric: string
          value: number
          recorded_at: string
        }
        Insert: Partial<Database['public']['Tables']['platform_usage']['Row']>
        Update: Partial<Database['public']['Tables']['platform_usage']['Row']>
        Relationships: []
      }
      qr_scans: {
        Row: {
          id: string
          property_id: string
          scanned_at: string
          user_agent: string | null
          ip_hash: string | null
        }
        Insert: Partial<Database['public']['Tables']['qr_scans']['Row']>
        Update: Partial<Database['public']['Tables']['qr_scans']['Row']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      is_member_of: {
        Args: { agency_id: string; min_role?: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      member_role: 'owner' | 'admin' | 'agent' | 'viewer'
    }
    CompositeTypes: Record<string, never>
  }
}
