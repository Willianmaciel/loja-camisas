export interface Produto {
  id: number;
  nome: string;
  preco: number;
  imagemFrente: string;
  imagemVerso?: string;
  time: string;
  tamanho?: string[];
  personalizacao?: boolean;
}

export interface Produtos {
  produtos: Produto[];
}

export interface ProdutosState {
  produtos: Produto[];
}
