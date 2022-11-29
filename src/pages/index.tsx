import { GetStaticProps } from "next";
import Image from "next/image";
import Stripe from "stripe";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { HomeContainer, Product } from "../styles/home";
import { stripe } from "../lib/stripe";
import Link from "next/link";
import { formatCurrency } from "../helpers/formatCurrency";
import Head from "next/head";

type HomeProps = {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: {
      unit_amount: number;
    };
  }[];
};

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 2,
      spacing: 48,
    },
  });

  const productsFormatted = products.map((product) => ({
    ...product,
    price: formatCurrency(product.price.unit_amount / 100),
  }));

  return (
    <>
      <Head>
        <title>Ignite Shop</title>
      </Head>
      <HomeContainer ref={sliderRef} className="keen-slider">
        {productsFormatted.length &&
          productsFormatted.map(({ id, name, imageUrl, price }) => (
            <Link key={id} href={`/product/${id}`} prefetch={false}>
              <Product className="keen-slider__slide">
                <Image src={imageUrl} width={520} height={480} alt="Camiseta" />
                <footer>
                  <strong>{name}</strong>
                  <span>{price}</span>
                </footer>
              </Product>
            </Link>
          ))}
      </HomeContainer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ["data.default_price"],
  });

  const products = response.data.slice(0, 4).map((product) => {
    const price = product.default_price as Stripe.Price;

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: {
        ...price,
      },
    };
  });

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // 2 hours
  };
};
