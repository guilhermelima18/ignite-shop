import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Stripe from "stripe";
import { formatCurrency } from "../../helpers/formatCurrency";
import { stripe } from "../../lib/stripe";
import {
  ProductContainer,
  ImageContainer,
  ProductDetails,
} from "../../styles/product";

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: {
      unit_amount: number;
    };
    description: string;
  };
}

export default function Product({ product }: ProductProps) {
  if (!product) return null;

  const priceFormatted = formatCurrency(product.price.unit_amount / 100);

  return (
    <ProductContainer>
      <ImageContainer>
        <Image
          src="https://github.com/guilhermelima18.png"
          width={100}
          height={100}
          alt=""
        />
      </ImageContainer>

      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{priceFormatted}</span>

        <p>{product.description}</p>

        <button>Comprar agora</button>
      </ProductDetails>
    </ProductContainer>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
  params,
}) => {
  const productId = params!.id;

  const productStripe = await stripe.products.retrieve(productId, {
    expand: ["default_price"],
  });

  const price = productStripe.default_price as Stripe.Price;

  const product = {
    id: productStripe.id,
    name: productStripe.name,
    imageUrl: productStripe.images[0],
    price: {
      ...price,
    },
    description: productStripe.description,
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 1, // 1 hour
  };
};
