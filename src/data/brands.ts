export type Brand = {
  id?: string;
  image: string;
  lighting?: string;
  name: string;
};

export const brandList: Brand[] = [
  {
    image: "/assets/logos/amazon.svg",
    name: "Amazon",
  },
  {
    image: "/assets/logos/benz.svg",
    name: "benz",
  },
  {
    image: "/assets/logos/hp.svg",
    name: "hp",
  },
  {
    image: "/assets/logos/lexus.svg",
    name: "lexus",
  },
  {
    image: "/assets/logos/meta.svg",
    name: "meta",
  },
  {
    image: "/assets/logos/oracle.svg",
    name: "oracle",
  },
];
