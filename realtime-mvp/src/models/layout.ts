export type PosLayoutModel = {
  posLayout: {
    id: number;
    label: string;
    brandId: number;
    pageTiles: pageTileModel[];
  };
  __typename: string;
};

export type pageTileModel = {
  id: number;
  label: string;
  color: string;
  coordinates: { h: number; w: number; x: number; y: number };
  type: string;
  targetId: number | null;
  parentType: string;
  parentId: number;
  __typename: string;
  subTiles: subTileModel[];
};

export type subTileModel = {
  id: number;
  label: string;
  color: string;
  coordinates: { h: number; w: number; x: number; y: number };
  type: string;
  targetId: number | null;
  parentType: string;
  parentId: number;
  value: string;
  __typename: string;
  subTiles: subTileModel[] | [];
};
