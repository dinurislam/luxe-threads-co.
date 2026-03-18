import productTshirt1 from "@/assets/product-tshirt-1.jpg";
import productTshirt2 from "@/assets/product-tshirt-2.jpg";
import productShirt1 from "@/assets/product-shirt-1.jpg";
import productShirt2 from "@/assets/product-shirt-2.jpg";
import productPants1 from "@/assets/product-pants-1.jpg";
import productPants2 from "@/assets/product-pants-2.jpg";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  sizes: string[];
  stockQuantity: number;
  categoryId: string;
  categoryName: string;
  isFeatured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export const categories: Category[] = [
  { id: "cat-shirts", name: "Shirts", slug: "shirts", image: "" },
  { id: "cat-tshirts", name: "T-Shirts", slug: "t-shirts", image: "" },
  { id: "cat-pants", name: "Pants", slug: "pants", image: "" },
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Structured Linen Shirt",
    slug: "structured-linen-shirt",
    description: "Cut from premium Italian linen. Mandarin collar with mother-of-pearl buttons. A refined take on warm-weather tailoring.",
    price: 4200,
    compareAtPrice: 5500,
    images: [productShirt2, productShirt1],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stockQuantity: 24,
    categoryId: "cat-shirts",
    categoryName: "Shirts",
    isFeatured: true,
  },
  {
    id: "p2",
    name: "Heavyweight Cotton Tee",
    slug: "heavyweight-cotton-tee",
    description: "Cut from 240gsm heavyweight cotton. Dropped shoulders. A structural take on the everyday staple.",
    price: 1800,
    compareAtPrice: 2400,
    images: [productTshirt1, productTshirt2],
    sizes: ["S", "M", "L", "XL"],
    stockQuantity: 56,
    categoryId: "cat-tshirts",
    categoryName: "T-Shirts",
    isFeatured: true,
  },
  {
    id: "p3",
    name: "Tailored Chino Trousers",
    slug: "tailored-chino-trousers",
    description: "Slim-fit chinos in brushed cotton twill. Clean hem with no break. The foundation of a considered wardrobe.",
    price: 3600,
    images: [productPants1, productPants2],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stockQuantity: 18,
    categoryId: "cat-pants",
    categoryName: "Pants",
    isFeatured: true,
  },
  {
    id: "p4",
    name: "Navy Poplin Shirt",
    slug: "navy-poplin-shirt",
    description: "Dense poplin weave in midnight navy. Point collar, single-needle stitching throughout. Precision at every seam.",
    price: 3800,
    images: [productShirt1, productShirt2],
    sizes: ["M", "L", "XL"],
    stockQuantity: 12,
    categoryId: "cat-shirts",
    categoryName: "Shirts",
    isFeatured: false,
  },
  {
    id: "p5",
    name: "Oversized Street Tee",
    slug: "oversized-street-tee",
    description: "Boxy silhouette in garment-dyed black cotton. Ribbed collar resists stretching. Built for daily wear.",
    price: 2200,
    compareAtPrice: 2800,
    images: [productTshirt2, productTshirt1],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stockQuantity: 40,
    categoryId: "cat-tshirts",
    categoryName: "T-Shirts",
    isFeatured: true,
  },
  {
    id: "p6",
    name: "Charcoal Tailored Trousers",
    slug: "charcoal-tailored-trousers",
    description: "Worsted wool blend in deep charcoal. Flat front with side adjusters. Sharp enough for the boardroom.",
    price: 5200,
    compareAtPrice: 6800,
    images: [productPants2, productPants1],
    sizes: ["M", "L", "XL"],
    stockQuantity: 8,
    categoryId: "cat-pants",
    categoryName: "Pants",
    isFeatured: true,
  },
];
