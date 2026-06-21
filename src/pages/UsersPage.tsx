import type { JSX } from "react";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { useTablePageState } from "@/hooks/useTablePageState";
import { SearchInput } from "@/components/shared/SearchInput";
import { UserTable } from "@/components/users/UserTable";
import { UserDetailPanel } from "@/components/users/UserDetailPanel";
import { UserFormModal } from "@/components/users/UserFormModal";
import { UserDeleteModal } from "@/components/users/UserDeleteModal";
import { UserResetPasswordModal } from "@/components/users/UserResetPasswordModal";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import type { UserListItem } from "@/types/user";
import { getUsers } from "@/service/userService";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; user: UserListItem }
  | { mode: "delete"; user: UserListItem }
  | { mode: "detail"; user: UserListItem }
  | { mode: "reset-password"; user: UserListItem }
  | null;

export default function UsersPage(): JSX.Element {
  const { t } = useLanguage();
  const pageTitleRef = useScrollAwareTitle();
  const { searchInput, debouncedSearch, page, setPage, limit, handleLimitChange, handleSearchChange } = useTablePageState();
  const [modal, setModal] = useState<ModalState>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["users", page, limit, debouncedSearch],
    queryFn: () => getUsers({ page, limit, search: debouncedSearch || undefined }),
    placeholderData: keepPreviousData,
  });

  const users = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  function closeModal(): void {
    setModal(null);
  }

  function handleSuccess(): void {
    const mode = modal?.mode;
    toast.success(
      <LiveToastMessage
        getMessage={(t) =>
          mode === "create" ? t.userCreateSuccess :
          mode === "edit"   ? t.userUpdateSuccess :
          t.userDeleteSuccess
        }
      />
    );
    closeModal();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2
          ref={pageTitleRef}
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          {t.navUsers}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {t.usersSubtitle}
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto border-b border-border">
          <div className="flex w-max min-w-full items-center gap-2 px-5 py-3">
            <SearchInput
              value={searchInput}
              onChange={handleSearchChange}
              placeholder={t.userSearchPlaceholder}
              isFetching={isFetching && !isLoading}
            />
            <Button
              onClick={() => setModal({ mode: "create" })}
              variant="success"
              className="shrink-0 gap-2 rounded-xl"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline-block sm:w-16 sm:text-center">
                {t.userAdd}
              </span>
            </Button>
          </div>
        </div>

        <UserTable
          users={users}
          isLoading={isLoading}
          search={debouncedSearch}
          t={t}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          onAdd={() => setModal({ mode: "create" })}
          onDetails={(u) => setModal({ mode: "detail", user: u })}
          onEdit={(u) => setModal({ mode: "edit", user: u })}
          onDelete={(u) => setModal({ mode: "delete", user: u })}
          onResetPassword={(u) => setModal({ mode: "reset-password", user: u })}
        />
      </Card>

      {modal?.mode === "detail" && (
        <UserDetailPanel
          user={modal.user}
          t={t}
          onClose={closeModal}
          onEdit={() => setModal({ mode: "edit", user: modal.user })}
          onDelete={() => setModal({ mode: "delete", user: modal.user })}
        />
      )}

      {(modal?.mode === "create" || modal?.mode === "edit") && (
        <UserFormModal
          mode={modal.mode}
          user={modal.mode === "edit" ? modal.user : undefined}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}

      {modal?.mode === "delete" && (
        <UserDeleteModal
          user={modal.user}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}

      {modal?.mode === "reset-password" && (
        <UserResetPasswordModal
          user={modal.user}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
