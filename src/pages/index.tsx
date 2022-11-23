import { GetServerSideProps } from "next";
import Image from "next/image";
import Stripe from "stripe";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { HomeContainer, Product } from "../styles/home";
import { stripe } from "../lib/stripe";

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

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      {products.length &&
        products.map(({ id, name, imageUrl, price }) => (
          <Product key={id} className="keen-slider__slide">
            <Image src={imageUrl} width={520} height={480} alt="Camiseta" />
            <footer>
              <strong>{name}</strong>
              <span>{price.unit_amount / 100}</span>
            </footer>
          </Product>
        ))}
    </HomeContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
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
  };
};
