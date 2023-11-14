import { getAlchemy } from "@/lib/clients";
import useSWR from "swr";
import { Nft, OwnedNft } from "alchemy-sdk";

function getAlchemyImageSrc(token?: Nft | OwnedNft) {
  // mint count for selected tokens

  if (!token) {
    return "/no-img.jpg";
  }

  const src =
    token.media[0]?.gateway ||
    token.media[0]?.thumbnail ||
    token.contract?.openSea?.imageUrl ||
    "/no-img.jpg";

  return src;
}

interface FormatImageReturnParams {
  imageData?: string | string[];
  loading: boolean;
}

function formatImageReturn({ imageData, loading }: FormatImageReturnParams): string[] | null {
  if (loading) return null;

  if (!imageData) {
    return ["/no-img.jpg"];
  }

  return typeof imageData === "string" ? [imageData] : imageData;
}

type UseNFTParams = {
  tokenId: number;
  contractAddress: `0x${string}`;
  chainId: number;
};

export const useNft = ({
  tokenId,
  contractAddress,
  chainId,
}: UseNFTParams) => {
  const { data: nftMetadata, isLoading: nftMetadataLoading } = useSWR(
    `nftMetadata/${contractAddress}/${tokenId}`,
    (url: string) => {
      const [, contractAddress, tokenId] = url.split("/");
      const alchemy = getAlchemy(chainId);
      return alchemy.nft.getNftMetadataBatch([{ contractAddress, tokenId }]);
    }
  );

  const loading =  nftMetadataLoading;

  return {
    data: formatImageReturn({ imageData: getAlchemyImageSrc(nftMetadata?.[0]), loading }),
    nftMetadata: nftMetadata?.[0],
    loading,
  };
};
