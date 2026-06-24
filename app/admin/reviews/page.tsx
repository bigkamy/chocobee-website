import { ReviewsManager } from "./ReviewsManager";
import { listLocalReviews } from "@/lib/local-cms";

export default async function AdminReviewsPage() {
  const reviews = await listLocalReviews();

  return <ReviewsManager initialReviews={reviews} />;
}
