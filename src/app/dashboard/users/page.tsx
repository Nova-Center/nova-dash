"use client";

import { useQuery } from "@tanstack/react-query";
import { useUsersStore } from "@/store/use-users-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Ban,
  UserCog,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Coins,
  FileCheck,
  Trash,
  Users,
  Shield,
  User as UserIcon,
  ShieldUser,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { User } from "@/types/user";
import AvatarInput from "@/components/dashboard/users/avatar-input";
import BadgeRole from "@/components/dashboard/badge-role";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipDateTime } from "@/components/dashboard/tootlip-datetime";
import CalendarBirthdate from "@/components/dashboard/calendar-birthdate";
import { useRouter } from "next/navigation";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function UsersPage() {
  const router = useRouter();
  const {
    error: usersError,
    users,
    meta,
    selectedUser,
    searchQuery,
    setSearchQuery,
    setSelectedUser,
    fetchUsers,
    fetchUserStats,
    banUser,
    unbanUser,
    updateUser,
    deleteUser,
    stats,
  } = useUsersStore();

  const extractPageFromUrl = (url: string | null): number | null => {
    if (!url) return null;
    const match = url.match(/[?&]page=(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };

  const { isLoading, error } = useQuery({
    queryKey: ["users", meta?.currentPage || 1],
    queryFn: () => fetchUsers(meta?.currentPage || 1),
    retry: 1,
  });

  useQuery({
    queryKey: ["userStats"],
    queryFn: fetchUserStats,
    retry: 1,
  });

  const [ban, setBan] = useState({
    isOpen: false,
    user: null as User | null,
    reason: "",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    user: null as User | null,
  });
  const [updatedUser, setUpdatedUser] = useState<Partial<User>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (selectedUser) {
      setUpdatedUser({
        username: selectedUser.username,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        novaPoints: selectedUser.novaPoints,
        birthDate: selectedUser.birthDate,
      });
    }
  }, [selectedUser]);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleBanUser = async (userId: number, reason: string) => {
    try {
      await banUser(userId, reason);
      setBan({
        isOpen: false,
        user: null,
        reason: "",
      });
      await fetchUsers();
      toast.success("Utilisateur banni avec succès");
    } catch (error) {
      toast.error(
        `Erreur lors du bannissement : ${
          usersError ? usersError : "Une erreur est survenue"
        }`
      );
    }
  };

  const handleUnbanUser = async (userId: number) => {
    try {
      await unbanUser(userId);
      await fetchUsers();
      toast.success("Utilisateur débanni avec succès");
    } catch (error) {
      toast.error("Erreur lors du débannissement");
    }
  };

  const handleAvatarChange = (avatar: string | File) => {
    if (avatar instanceof File) {
      setAvatarFile(avatar);
      setUpdatedUser((prev) => ({
        ...prev,
        avatar: URL.createObjectURL(avatar),
      }));
    } else {
      setAvatarFile(null);
      setUpdatedUser((prev) => ({
        ...prev,
        avatar,
      }));
    }
  };

  const handleUpdateUser = async (
    userId: number,
    data: Partial<User> | null
  ) => {
    if (!data) return;

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "avatar" && avatarFile) {
        formData.append("avatar", avatarFile);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    try {
      await updateUser(userId, formData as Partial<User>);
      setSelectedUser(null);
      setUpdatedUser({});
      await fetchUsers();
      toast.success("Utilisateur mis à jour avec succès");
    } catch (error) {
      toast.error(
        `Erreur lors de la mise à jour : ${
          usersError ? usersError : "Une erreur est survenue"
        }`
      );
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      await fetchUsers();
      toast.success("Utilisateur supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-500">Erreur</h2>
          <p className="text-gray-600">
            {error instanceof Error ? error.message : "Une erreur est survenue"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto h-full">
      <div className="flex flex-col gap-2 my-4">
        <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
        <p className="text-sm text-gray-500">
          Gérez les utilisateurs de votre plateforme
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Statistiques des Utilisateurs</CardTitle>
          <CardDescription>
            Statistiques des utilisateurs de votre plateforme, en fonction des
            rôles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              custom={0}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="bg-gradient-to-br bg-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Utilisateurs
                  </CardTitle>
                  <Users className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.totalUsers || 0}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              custom={1}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="bg-gradient-to-br bg-nova-secondary text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Superadmins
                  </CardTitle>
                  <ShieldUser className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.usersByRole?.superadmin || 0}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              custom={2}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="bg-gradient-to-br bg-yellow-500 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Admins</CardTitle>
                  <Shield className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.usersByRole?.admin || 0}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              custom={3}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="bg-gradient-to-br bg-gray-500 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Utilisateurs
                  </CardTitle>
                  <UserIcon className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.usersByRole?.user || 0}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Nom d'utilisateur</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Nom complet</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>NovaPoints</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Date de modification</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>
                        <Avatar>
                          <AvatarImage
                            src={
                              user.avatar ||
                              `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${user.username}`
                            }
                            alt={user.username}
                            className="border border-gray-200 rounded-full"
                          />
                          <AvatarFallback>
                            {user.username.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.username}
                      </TableCell>
                      <TableCell>
                        {user.isOnline ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            En ligne
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            Deconnecté
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <BadgeRole role={user.role} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {user.novaPoints}
                          <Coins className="w-4 h-4" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <TooltipDateTime date={user.createdAt} />
                      </TableCell>
                      <TableCell>
                        <TooltipDateTime date={user.updatedAt} />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                            className="cursor-pointer"
                          >
                            <UserCog className="w-4 h-4" />
                            Éditer
                          </Button>
                          {!user.isBanned && user.role !== "superadmin" ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setBan({
                                  isOpen: true,
                                  user: user,
                                  reason: "",
                                });
                              }}
                              className="bg-red-500 hover:bg-red-600 cursor-pointer"
                            >
                              <Ban className="w-4 h-4" />
                              Bannir
                            </Button>
                          ) : user.isBanned ? (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleUnbanUser(user.id)}
                              className="bg-green-500 hover:bg-green-600 cursor-pointer"
                            >
                              <FileCheck className="w-4 h-4" />
                              Débannir
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {meta && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Total: {meta.total} utilisateurs
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!meta.previousPageUrl}
                  onClick={() => {
                    const page = extractPageFromUrl(meta.previousPageUrl);
                    if (page) {
                      fetchUsers(page);
                    }
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm">
                  Page {meta.currentPage || 1} sur {meta.lastPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!meta.nextPageUrl}
                  onClick={() => {
                    const page = extractPageFromUrl(meta.nextPageUrl);
                    if (page) {
                      fetchUsers(page);
                    }
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={!!selectedUser}
        onOpenChange={() => {
          setSelectedUser(null);
          setUpdatedUser({});
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Éditer l'utilisateur {selectedUser?.username} &nbsp;
              <BadgeRole role={selectedUser?.role} />
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              {selectedUser.isBanned && (
                <motion.div
                  variants={itemVariants}
                  className="flex items-center flex-row justify-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm"
                >
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p>
                    Cet utilisateur est banni pour le motif suivant :{" "}
                    <span className="font-bold">{selectedUser.banReason}</span>
                  </p>
                </motion.div>
              )}
              <div className="flex items-center flex-col justify-center gap-2">
                <label className="text-sm font-medium">Avatar</label>
                <AvatarInput
                  avatar={
                    selectedUser.avatar ||
                    `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${selectedUser.username}`
                  }
                  onAvatarChange={handleAvatarChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nom d'utilisateur</label>
                <Input
                  defaultValue={selectedUser.username}
                  onChange={(e) =>
                    setUpdatedUser((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Prénom</label>
                <Input
                  defaultValue={selectedUser.firstName}
                  onChange={(e) =>
                    setUpdatedUser((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nom</label>
                <Input
                  defaultValue={selectedUser.lastName}
                  onChange={(e) =>
                    setUpdatedUser((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  defaultValue={selectedUser.email}
                  onChange={(e) =>
                    setUpdatedUser((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Points Nova</label>
                <Button
                  onClick={() => router.push(`/dashboard/points`)}
                  variant="outline"
                  className="cursor-pointer w-full justify-start"
                >
                  {selectedUser.novaPoints}
                  <Coins className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <CalendarBirthdate
                  label="Date de naissance"
                  value={
                    updatedUser.birthDate
                      ? new Date(updatedUser.birthDate)
                      : undefined
                  }
                  setValue={(date) =>
                    setUpdatedUser((prev) => ({
                      ...prev,
                      birthDate: date
                        ? new Date(
                            date.getTime() - date.getTimezoneOffset() * 60000
                          )
                            .toISOString()
                            .split("T")[0]
                        : "",
                    }))
                  }
                />
              </div>
              <div>
                <Button
                  variant="destructive"
                  onClick={() =>
                    setDeleteDialog({
                      isOpen: true,
                      user: selectedUser,
                    })
                  }
                  className="bg-red-500 hover:bg-red-600 cursor-pointer w-full"
                >
                  <Trash className="w-4 h-4" />
                  Supprimer l'utilisateur
                </Button>
              </div>
              <div className="flex w-full justify-center space-x-2 mt-12">
                <Button
                  variant="outline"
                  className="cursor-pointer w-1/2"
                  onClick={() => setSelectedUser(null)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={() => handleUpdateUser(selectedUser.id, updatedUser)}
                  className="bg-blue-500 hover:bg-blue-600 cursor-pointer w-1/2"
                  disabled={Object.keys(updatedUser).length === 0}
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Ban Dialog */}
      <Dialog
        open={ban.isOpen}
        onOpenChange={() =>
          setBan({
            ...ban,
            isOpen: false,
          })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bannir l'utilisateur {ban.user?.username}</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Motif de bannissement"
            value={ban.reason}
            onChange={(e) => setBan({ ...ban, reason: e.target.value })}
          />
          <Button
            onClick={() => handleBanUser(ban.user?.id!, ban.reason)}
            disabled={ban.reason.length === 0}
            className="w-full mt-4 bg-red-500 hover:bg-red-600 cursor-pointer"
          >
            <Ban className="w-4 h-4 mr-2" />
            Bannir
          </Button>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.isOpen}
        onOpenChange={() =>
          setDeleteDialog({
            isOpen: false,
            user: null,
          })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Supprimer l'utilisateur {deleteDialog.user?.username}
            </DialogTitle>
          </DialogHeader>
          <p>
            Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
            {deleteDialog.user?.username} ?
          </p>
          <div className="flex items-center flex-col justify-center gap-2">
            <Button
              variant="destructive"
              onClick={() => handleDeleteUser(deleteDialog.user?.id!)}
              className="bg-red-500 hover:bg-red-600 cursor-pointer justify-center mt-4"
            >
              <Trash className="w-4 h-4" />
              Oui, je souhaite supprimer l'utilisateur
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
