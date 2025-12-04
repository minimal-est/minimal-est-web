import { useState } from 'react';
import {
    useCreateCollection,
    useUpdateCollection,
    useDeleteCollection,
    type Collection,
    type CreateCollectionRequest,
    type UpdateCollectionRequest,
} from '@/entities/bookmark';

interface UseCollectionManagingProps {
    onSuccess?: () => void;
}

export const useCollectionManaging = ({ onSuccess }: UseCollectionManagingProps = {}) => {
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletingCollection, setDeletingCollection] = useState<Collection | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const createMutation = useCreateCollection();
    const updateMutation = useUpdateCollection(editingCollection?.id || '');
    const deleteMutation = useDeleteCollection(deletingCollection?.id || '');

    const handleOpenCreateModal = () => {
        setEditingCollection(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (collection: Collection) => {
        setEditingCollection(collection);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingCollection(null);
        setIsModalOpen(false);
    };

    const handleOpenDeleteModal = (collection: Collection) => {
        setDeletingCollection(collection);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setDeletingCollection(null);
        setIsDeleteModalOpen(false);
    };

    const handleCreate = async (data: CreateCollectionRequest) => {
        await createMutation.mutateAsync(data);
        handleCloseModal();
        onSuccess?.();
    };

    const handleUpdate = async (data: UpdateCollectionRequest) => {
        if (!editingCollection) return;
        await updateMutation.mutateAsync(data);
        handleCloseModal();
        onSuccess?.();
    };

    const handleDelete = async () => {
        if (!deletingCollection) return;
        await deleteMutation.mutateAsync();
        handleCloseDeleteModal();
        onSuccess?.();
    };

    return {
        editingCollection,
        isModalOpen,
        deletingCollection,
        isDeleteModalOpen,
        isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
        error: createMutation.error || updateMutation.error || deleteMutation.error,
        openCreateModal: handleOpenCreateModal,
        openEditModal: handleOpenEditModal,
        closeModal: handleCloseModal,
        openDeleteModal: handleOpenDeleteModal,
        closeDeleteModal: handleCloseDeleteModal,
        createCollection: handleCreate,
        updateCollection: handleUpdate,
        deleteCollection: handleDelete,
    };
};
