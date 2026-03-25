import { ProductDetailClient } from "./_components/ProductDetailClient";
import { use } from "react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <ProductDetailClient id={resolvedParams.id} />;
}
