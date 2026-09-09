import apiClient, { ApiError } from "./apiClient";
import type { Review } from "../types";

interface ReviewCreatePayload {
  name: string;
  productId: string;
  storeId: string;
  rating: number;
  comment: string;
  orderId: string;
}

interface ReviewResponse {
  data: Review;
}

interface ProductReviewsResponse {
  data: {
    productId: string;
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
  };
}

export async function createReview(
  payload: ReviewCreatePayload,
): Promise<Review> {
  try {
    const { data } = await apiClient.post<ReviewResponse>(
      "/order/customer-review",
      payload,
    );
    return data.data;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("Gagal mengirim ulasan. Coba lagi.", 0);
  }
}

export async function fetchProductReviews(
  productId: string,
  storeId: string,
): Promise<{ reviews: Review[]; averageRating: number; totalReviews: number }> {
  try {
    const { data } = await apiClient.get<ProductReviewsResponse>(
      "/order/customer-reviews",
      {
        params: { productId, store: storeId },
      },
    );
    return {
      reviews: data.data.reviews || [],
      averageRating: data.data.averageRating || 0,
      totalReviews: data.data.totalReviews || 0,
    };
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("Gagal memuat ulasan. Coba lagi.", 0);
  }
}