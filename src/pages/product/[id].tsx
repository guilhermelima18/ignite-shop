import { useCallback, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import axios from "axios";
import Stripe from "stripe";
import { formatCurrency } from "../../helpers/formatCurrency";
import { stripe } from "../../lib/stripe";
import {
  ProductContainer,
  ImageContainer,
  ProductDetails,
} from "../../styles/product";
import Head from "next/head";

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: {
      unit_amount: number;
    };
    description: string;
    defaultPriceId: string;
  };
}

export default function Product({ product }: ProductProps) {
  const [loading, setLoading] = useState(false);

  const handleBuyProduct = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.post("/api/checkout", {
        priceId: product.defaultPriceId,
      });

      if (response.status === 201) {
        const { checkoutUrl } = response.data;
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      alert("Falha ao redirecionar ao checkout");
    } finally {
      setLoading(false);
    }
  }, []);

  const priceFormatted = formatCurrency(product.price.unit_amount / 100);

  return (
    <>
      <Head>
        <title>{product.name} - Ignite Shop</title>
      </Head>
      <ProductContainer>
        <ImageContainer>
          <Image src={product.imageUrl} width={500} height={500} alt="" />
        </ImageContainer>

        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{priceFormatted}</span>

          <p>{product.description}</p>

          <button onClick={handleBuyProduct} disabled={loading}>
            Comprar agora
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
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
    defaultPriceId: price.id,
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 1, // 1 hour
  };
};
