export interface CreateBlogRequest {
    penName: string;
}

export interface CreateBlogResponse {
    blogId: string;
}

export interface AuthorInfo {
    authorId: string;
    penName: string;
    profileImageUrl: string;
}

export interface BlogProfile {
    profileImageUrl: string;
}