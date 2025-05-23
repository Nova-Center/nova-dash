"use client";

import { useQuery } from "@tanstack/react-query";
import { usePointsStore } from "@/store/usePointsStore";
import { toast } from "sonner";
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
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Coins,
  AlertCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipDateTime } from "@/components/dashboard/tootlip-datetime";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

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

export default function PointsPage() {
  const {
    users,
    selectedUser,
    userHistory,
    error: pointsError,
    meta,
    stats,
    isHistoryLoading,
    setSelectedUser,
    fetchUsers,
    fetchUserHistory,
    resetUserHistory,
    fetchStats,
    addPoints,
    removePoints,
  } = usePointsStore();

  const { isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    retry: 1,
  });

  const { data: statsData } = useQuery({
    queryKey: ["points-stats"],
    queryFn: fetchStats,
    retry: 1,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [pointsModal, setPointsModal] = useState({
    isOpen: false,
    user: null as any,
    points: "",
    description: "",
    isAdding: true,
  });

  const [historyModal, setHistoryModal] = useState({
    isOpen: false,
    user: null as any,
  });

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePointsAction = async (isAdding: boolean, user: any) => {
    setPointsModal({
      isOpen: true,
      user,
      points: "",
      description: "",
      isAdding,
    });
  };

  const handleSubmitPoints = async () => {
    if (!pointsModal.user || !pointsModal.points || !pointsModal.description)
      return;

    const points = parseInt(pointsModal.points);
    if (isNaN(points) || points <= 0) {
      toast.error("Veuillez entrer un nombre de points valide");
      return;
    }

    try {
      if (pointsModal.isAdding) {
        await addPoints(pointsModal.user.id, points, pointsModal.description);
      } else {
        await removePoints(
          pointsModal.user.id,
          points,
          pointsModal.description
        );
      }
      setPointsModal({
        isOpen: false,
        user: null,
        points: "",
        description: "",
        isAdding: true,
      });
    } catch (error) {
      console.error("Erreur lors de la modification des points:", error);
    }
  };

  const handleViewHistory = async (user: any) => {
    setHistoryModal({
      isOpen: true,
      user,
    });
    await fetchUserHistory(user.id);
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
    <div className="container mx-auto h-full space-y-8">
      <div className="flex flex-col gap-2 my-4">
        <h1 className="text-2xl font-bold">Gestion des Nova Points</h1>
        <p className="text-sm text-gray-500">
          Gérez les points de vos utilisateurs
        </p>
      </div>
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total des Nova Points</CardTitle>
            <CardDescription>
              Somme totale des points distribués
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Coins className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {stats?.totalPoints.toLocaleString() || 0}
                </p>
                <p className="text-sm text-gray-500">Nova Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moyenne par Utilisateur</CardTitle>
            <CardDescription>Points moyens par portefeuille</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {stats?.averagePoints.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  }) || 0}
                </p>
                <p className="text-sm text-gray-500">Points moyens</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des Points</CardTitle>
            <CardDescription>
              Historique des points sur 30 jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats?.pointsHistory || []}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) =>
                      new Date(date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution des Points</CardTitle>
            <CardDescription>
              Répartition des points par tranche
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats?.pointsDistribution || []}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des Nova Points</CardTitle>
          <CardDescription>
            Gérez les points de vos utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                  <TableHead>Avatar</TableHead>
                  <TableHead>Nom d'utilisateur</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage
                            src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${user.username}`}
                            alt={user.username}
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
                        <div className="flex items-center gap-1">
                          {user.novaPoints}
                          <Coins className="w-4 h-4" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePointsAction(true, user)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePointsAction(false, user)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Minus className="w-4 h-4 mr-2" />
                            Retirer
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewHistory(user)}
                          >
                            Historique
                          </Button>
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
                  disabled={meta.currentPage === 1}
                  onClick={() => {
                    // Handle previous page
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm">
                  Page {meta.currentPage} sur {meta.lastPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.currentPage === meta.lastPage}
                  onClick={() => {
                    // Handle next page
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Points Modal */}
      <Dialog
        open={pointsModal.isOpen}
        onOpenChange={() =>
          setPointsModal({
            isOpen: false,
            user: null,
            points: "",
            description: "",
            isAdding: true,
          })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pointsModal.isAdding ? "Ajouter" : "Retirer"} des points à{" "}
              {pointsModal.user?.username}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre de points</label>
              <Input
                type="number"
                value={pointsModal.points}
                onChange={(e) =>
                  setPointsModal((prev) => ({
                    ...prev,
                    points: e.target.value,
                  }))
                }
                placeholder="Entrez le nombre de points"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={pointsModal.description}
                onChange={(e) =>
                  setPointsModal((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Raison de la modification"
              />
            </div>
            <Button
              onClick={handleSubmitPoints}
              disabled={!pointsModal.points || !pointsModal.description}
              className={`w-full ${
                pointsModal.isAdding
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {pointsModal.isAdding ? "Ajouter" : "Retirer"} les points
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* History Modal */}
      <Dialog
        open={historyModal.isOpen}
        onOpenChange={() => {
          setHistoryModal({
            isOpen: false,
            user: null,
          });
          resetUserHistory();
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Historique des points - {historyModal.user?.username}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {(() => {
              return isHistoryLoading ? (
                <div className="text-center py-4 text-gray-500">
                  Chargement de l'historique...
                </div>
              ) : !userHistory || userHistory.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Aucun historique disponible
                </div>
              ) : (
                userHistory.map((history) => (
                  <motion.div
                    key={history.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{history.action}</p>
                        <p className="text-sm text-gray-600">
                          {history.description}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          history.points > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {history.points > 0 ? "+" : ""}
                        {history.points}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      <TooltipDateTime date={history.createdAt} />
                    </p>
                  </motion.div>
                ))
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
