import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUsersNoPagination } from "@/hooks/use-users-no-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import FileUpload from "../file-upload";
import { useFileUpload } from "@/hooks/use-file-upload";

interface ShopItem {
  id?: number;
  ownerId: number;
  clientId: number | null;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface ShopItemFormProps {
  item?: ShopItem;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

export function ShopItemForm({
  item,
  isOpen,
  onClose,
  onSubmit,
}: ShopItemFormProps) {
  const { data: users } = useUsersNoPagination();
  const [formData, setFormData] = useState<Omit<ShopItem, "id">>(
    item || {
      ownerId: 0,
      clientId: null,
      name: "",
      description: "",
      price: 0,
      image: "",
    }
  );

  const [{ files }, { handleFileChange }] = useFileUpload({
    accept: "image/*",
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    formDataToSend.append("ownerId", formData.ownerId.toString());
    if (formData.clientId) {
      formDataToSend.append("clientId", formData.clientId.toString());
    }
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price.toString());

    if (files[0]?.file instanceof File) {
      formDataToSend.append("image", files[0].file);
    } else if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    onSubmit(formDataToSend);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {item ? "Modifier l'article" : "Ajouter un article"}
          </DialogTitle>
          <DialogDescription>
            {item
              ? "Modifiez les informations de l'article ci-dessous."
              : "Remplissez les informations de l'article ci-dessous."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="owner" className="text-right">
                Propriétaire
              </Label>
              <Select
                value={formData.ownerId.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, ownerId: parseInt(value) })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un propriétaire" />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Prix
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="col-span-3"
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <FileUpload
                id="image"
                value={formData.image}
                onChange={handleFileChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{item ? "Modifier" : "Ajouter"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
