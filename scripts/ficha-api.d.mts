export interface FichaProp {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface FichaEmit {
  name: string;
  payload: string;
}

export interface FichaSpec {
  kebab: string;
  file: string;
  props: FichaProp[];
  emits: FichaEmit[];
  slots: string[];
  expose: string[];
}

export declare const ROOT: string;
export declare function fichaSpec(kebab: string): FichaSpec | null;
export declare function fichaProse(kebab: string): string;
