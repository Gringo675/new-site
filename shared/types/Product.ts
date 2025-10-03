export interface RelatedProduct {
  id: number;
  name: string;
  alias: string;
  price: number;
  label: number;
  image: string;
}

export interface ProductProp {
  name: string;
  val: string;
}

export interface Brand {
  shortName: string;
  fullName: string;
  image: string;
}

export interface DocRstr {
  number: string;
  name: string;
  type_si: string;
  brand: string;
  date: string;
  file_ot: string;
  file_mp: string;
  file_svid: string;
}

export interface DocStnd {
  number: string;
  name: string;
  file: string;
}

export interface ProductDocs {
  rstr: DocRstr[];
  stnd: DocStnd[];
}

export interface Product {
  id: number;
  name: string;
  alias: string;
  category_id: number;
  price: number;
  priceRegular?: number; // Поле опционально, т.к. его нет в примере
  images: string[];
  description: string;
  characteristics: string;
  label: number;
  subCatsId: number[];
  relatedProds: RelatedProduct[];
  props: ProductProp[];
  brand: Brand;
  docs: ProductDocs;
  quantity?: number; // Поле опционально, т.к. его нет в примере
}