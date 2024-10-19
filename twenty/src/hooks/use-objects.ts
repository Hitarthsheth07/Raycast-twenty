import { useState, useCallback } from "react";
import { useFetch } from "@raycast/utils";
import { useAuthHeaders } from "./use-auth-headers";
import { Field, Object } from "../types";

export interface ObjectsResponse {
  data: {
    objects: Object[];
  };
  pageInfo: {
    hasNextPage: boolean;
    startCursor: string;
    endCursor: string;
  };
}

  interface UseGetObjectsOptions {
    limit?: number;
    orderBy?: string;
    initialCursor?: string;
  }

  export function useGetObjects({ limit = 20, orderBy = "name", initialCursor }: UseGetObjectsOptions = {}) {
    const [cursor, setCursor] = useState<string | undefined>(initialCursor);
    const [allObjects, setallObjects] = useState<Object[]>([]);
  
    const { data, isLoading, error, revalidate } = useFetch<ObjectsResponse>(
      `https://api.twenty.com/rest/objects?limit=${limit}&order_by=${orderBy}${cursor ? `&starting_after=${cursor}` : ""}`,
      {
        headers: useAuthHeaders(),
      },
    );
  
    const loadMore = useCallback(() => {
      if (data?.pageInfo.hasNextPage) {
        setCursor(data.pageInfo.endCursor);
        setallObjects((prev) => [...prev, ...data.data.objects]);
      }
    }, [data]);
  
    const objects = allObjects.length > 0 ? allObjects : (data?.data.objects ?? []);
  
    return {
      objects,
      isLoading,
      error,
      loadMore,
      hasMore: data?.pageInfo.hasNextPage ?? false,
      revalidate,
    };
  }