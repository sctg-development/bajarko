import { zodResolver } from '@hookform/resolvers/zod';
import { StoreUpsertProductReviewsDTO } from '@lambdacurry/medusa-plugins-sdk';
import { baseMedusaConfig } from '@libs/util/server/client.server';
import { reviewsFileUploadHandler, upsertProductReviews } from '@libs/util/server/data/product-reviews.server';
import { parseFormData } from '@mjackson/form-data-parser';
import { data } from 'react-router';
import { getValidatedFormData } from 'remix-hook-form';
import { z } from 'zod';

const schema = z.object({
  id: z.string().optional(),
  order_id: z.string().min(1, 'Order is required'),
  order_line_item_id: z.string().min(1, 'Line item is required'),
  rating: z.number().min(1, 'Rating is required'),
  content: z.string().optional().default(''),
  existing_images: z.string().optional(),
  review_request_id: z.string().optional(),
});

const uploadImages = async (_images: File | File[] | null | undefined): Promise<string[]> => {
  if (!_images) return [];
  if (_images && !Array.isArray(_images)) _images = [_images];
  if (!Array.isArray(_images)) return [];
  if (!_images?.length) return [];
  const images = _images.filter((image) => image.size > 0);
  if (!images.length) return [];

  const formData = new FormData();

  for (const image of images) {
    const fileBuffer = await image.arrayBuffer();
    const blob = new Blob([fileBuffer], { type: image.type || 'application/octet-stream' });
    formData.append('files', blob, image.name);
  }

  const url = new URL('/store/product-reviews/uploads', baseMedusaConfig.baseUrl);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    headers: {
      'x-publishable-api-key': baseMedusaConfig.publishableKey ?? '',
    },
  });

  if (!response.ok) {
    console.error('Upload failed with status:', response.status);
    const errorText = await response.text();
    console.error('Error details:', errorText);
    return [];
  }

  const data = (await response.json()) as { files: { id: string; url: string }[] };

  return data.files.map((i) => i.url);
};

export async function action({ request }: { request: Request }) {
  const formData = await parseFormData(request, reviewsFileUploadHandler);

  const uploads = formData.getAll('images') as File[];

  // Remove images from formData before validation
  const restFormData = new FormData();
  for (const [key, value] of formData.entries()) {
    if (key !== 'images') {
      restFormData.append(key, value);
    }
  }

  const { errors, data: parsedFormData } = await getValidatedFormData(restFormData, zodResolver(schema));

  if (errors) {
    return data({ errors }, { status: 400 });
  }

  try {
    const { existing_images, ...upsertPayload } = parsedFormData;

    const newImageUrls = await uploadImages(uploads);

    const existingImageUrls = existing_images?.split(',').map((url: string) => url.trim()) || [];

    const allImageUrls = [...newImageUrls, ...existingImageUrls];

    const { product_reviews } = await upsertProductReviews(request, {
      reviews: [
        {
          ...upsertPayload,
          images: allImageUrls.map((url: string) => ({ url })),
        },
      ] as StoreUpsertProductReviewsDTO['reviews'],
    });

    return data({ product_reviews, success: true });
  } catch (error: any) {
    console.error('product reviews error', error);
    return data(
      { errors: { root: { message: 'Something went wrong when creating or updating your product reviews.' } } },
      { status: 500 },
    );
  }
}
