import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Review } from "@/lib/mockData";

type ReviewRow = Tables<"reviews">;

function mapRowToReview(row: ReviewRow): Review {
  const toArray = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  return {
    id: row.id,
    name: row.name ?? "",
    slug: row.slug,
    reviewText: row.review_text ?? "",
    city: row.city ?? "",
    foodTypes: toArray(row.food_types),
    visitDate: row.visit_date ?? "",
    images: toArray(row.images),
    videos: toArray(row.videos),
    googleMapsUrl: row.google_maps_url ?? undefined,
    instagramUrl: row.instagram_url ?? undefined,
    tiktokUrl: row.tiktok_url ?? undefined,
  };
}

export async function fetchReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("visit_date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRowToReview);
}

export async function fetchReviewBySlug(slug: string): Promise<Review | null> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRowToReview(data) : null;
}

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
  });
}

export function useReviewBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["review", slug],
    queryFn: () => fetchReviewBySlug(slug!),
    enabled: !!slug,
  });
}
