import { client } from "@/shared/api/client";
import type {
    Collection,
    CollectionResponse,
    CreateCollectionRequest,
    UpdateCollectionRequest,
    CollectionQueryParams,
} from "../model";

/**
 * 내 컬렉션 목록 조회
 */
export const fetchCollections = async (
    params?: CollectionQueryParams
): Promise<Collection[]> => {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());

    const response = await client.get<CollectionResponse[]>(
        `/bookmarks/collections${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    );

    return response.data.map(convertCollectionResponseToCollection);
};

/**
 * 컬렉션 생성
 */
export const createCollection = async (
    request: CreateCollectionRequest
): Promise<Collection> => {
    const response = await client.post<CollectionResponse>(
        '/bookmarks/collections',
        request
    );

    return convertCollectionResponseToCollection(response.data);
};

/**
 * 컬렉션 정보 수정
 */
export const updateCollection = async (
    collectionId: string,
    request: UpdateCollectionRequest
): Promise<Collection> => {
    const response = await client.patch<CollectionResponse>(
        `/bookmarks/collections/${collectionId}`,
        request
    );

    return convertCollectionResponseToCollection(response.data);
};

/**
 * 컬렉션 공개/비공개 토글
 */
export const toggleCollectionPublic = async (
    collectionId: string
): Promise<Collection> => {
    const response = await client.patch<CollectionResponse>(
        `/bookmarks/collections/${collectionId}/toggle-public`
    );

    return convertCollectionResponseToCollection(response.data);
};

/**
 * 컬렉션 삭제
 */
export const deleteCollection = async (collectionId: string): Promise<void> => {
    await client.delete(`/bookmarks/collections/${collectionId}`);
};

/**
 * CollectionResponse를 Collection으로 변환
 */
const convertCollectionResponseToCollection = (response: CollectionResponse): Collection => {
    return {
        id: response.id,
        title: response.title,
        description: response.description,
        isPublic: response.isPublic,
        isDefault: response.isDefault,
        bookmarkCount: response.bookmarkCount,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
    };
};
