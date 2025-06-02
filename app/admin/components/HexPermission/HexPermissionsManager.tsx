"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { HexPermissionsTable } from "./HexPermissionsTable";
import { HexPermissionDialog } from "./HexPermissionDialog";
import { HexPermission } from "@/types";
import { updateHexPermission } from "../../actions/updateHexPermission";
import { updateHexPermissionStatus } from "../../actions/updateHexPermissionStatus";
import { useRouter } from "next/navigation";

interface Props {
  hexPermissions: HexPermission[];
}

export default function HexPermissionsManager({ hexPermissions }: Props) {

  const router = useRouter()
  const [permissions, setPermissions] =
    useState<HexPermission[]>(hexPermissions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPermission, setEditingPermission] =
    useState<HexPermission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEdit = (permission: HexPermission) => {
    setEditingPermission(permission);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to delete this permission?")) {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setPermissions(permissions.filter((p) => p.id !== id));
        setIsLoading(false);

        toast({
          title: "Permission Deleted",
          description: "The hex permission has been successfully deleted.",
        });
      }, 500);
    }
  };

const handleToggleBan = async (id: string, is_banned: boolean) => {
  setIsLoading(true);

  try {
    const res = await updateHexPermissionStatus(id, is_banned);
    if (!res.success) throw res.error;
    setPermissions((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              is_banned,
              updated_at: new Date().toISOString(),
              ...(is_banned && {
                daily_limit: 0,
                ad_required: 0,
                ton_cost: 0,
              }),
            }
          : p
      )
    );

    toast({
      title: is_banned ? "User Banned" : "User Unbanned",
      description: `The user has been ${is_banned ? "banned" : "unbanned"} from hex boxes.`,
    });
  } catch (error) {
    console.error("Failed to toggle user status:", error);
    toast({
      title: "Error",
      description: "Could not update user status. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
  router.refresh();
};


  const handleSavePermission = async (permission: HexPermission) => {
    setIsLoading(true);

    try {
      const res = await updateHexPermission({
        id: permission.id,
        dailyLimit: permission.daily_limit,
        adRequired: permission.ad_required,
        tonCost: permission.ton_cost,
      });

      if (!res.success) throw res.error;

      setPermissions((prev) =>
        prev.map((p) =>
          p.id === permission.id
            ? { ...permission, updated_at: new Date().toISOString() }
            : p
        )
      );

      toast({
        title: "Permission Updated",
        description: `Hex permission for user ${permission.user_id} has been updated.`,
      });

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save hex permission:", error);
      toast({
        title: "Error",
        description: "Failed to save hex permission. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hexPermissions) {
      setPermissions(hexPermissions);
    }
  }, [hexPermissions]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-cosmic-text">
          Hex Chase Permissions
        </h2>

        {/* <Button
          onClick={handleCreateNew}
          className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-cosmic-text"
          disabled={isLoading}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Permission
        </Button> */}
      </div>

      <div className="rounded-md border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm overflow-hidden">
        <HexPermissionsTable
          permissions={permissions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleBan={handleToggleBan}
          isLoading={isLoading}
        />
      </div>

      <HexPermissionDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        permission={editingPermission}
        onSave={handleSavePermission}
        isLoading={isLoading}
      />
    </div>
  );
}
