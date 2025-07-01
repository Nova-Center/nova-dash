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
import FileUpload from "../file-upload";
import { FileUploadState, FileUploadActions } from "@/hooks/use-file-upload";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

const shopItemSchema = z.object({
  ownerId: z.number().min(1, "Le propriétaire est requis"),
  clientId: z.number().nullable(),
  name: z
    .string()
    .min(3, "Le nom doit faire au moins 3 caractères")
    .max(100, "Le nom est trop long"),
  description: z
    .string()
    .min(10, "La description doit faire au moins 10 caractères")
    .max(1000, "La description est trop longue"),
  price: z.number().min(0, "Le prix doit être positif"),
  image: z.string().optional(),
});

type ShopItemFormData = z.infer<typeof shopItemSchema>;

interface ShopItem extends ShopItemFormData {
  id?: number;
}

interface ShopItemFormProps {
  item?: ShopItem;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  fileUploadHook: [FileUploadState, FileUploadActions];
}

export function ShopItemForm({
  item,
  isOpen,
  onClose,
  onSubmit,
  fileUploadHook,
}: ShopItemFormProps) {
  const [typeForm, setTypeForm] = useState<"create" | "edit">(
    item ? "edit" : "create"
  );
  const { data: users } = useUsersNoPagination();
  const [{ files }, { removeFile }] = fileUploadHook;
  const [currentImage, setCurrentImage] = useState<string | null>(
    item?.image || null
  );

  const form = useForm<ShopItemFormData>({
    resolver: zodResolver(shopItemSchema),
    defaultValues: {
      ownerId: 0,
      clientId: null,
      name: "",
      description: "",
      price: 0,
      image: "",
    },
  });

  useEffect(() => {
    if (item) {
      setTypeForm("edit");
      form.reset({
        ownerId: item.ownerId,
        clientId: item.clientId,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image || "",
      });
      setCurrentImage(item.image || null);
    } else {
      form.reset({
        ownerId: 0,
        clientId: null,
        name: "",
        description: "",
        price: 0,
        image: "",
      });
      setCurrentImage(null);
    }
  }, [item, form]);

  const handleSubmit = (data: ShopItemFormData) => {
    if (!files[0]?.file && typeForm === "create") {
      form.setError("image", {
        type: "manual",
        message: "L'image est requise",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("ownerId", data.ownerId.toString());
    formDataToSend.append("name", data.name);
    formDataToSend.append("description", data.description);
    formDataToSend.append("price", data.price.toString());

    if (files[0]?.file instanceof File) {
      formDataToSend.append("image", files[0].file);
    }

    onSubmit(formDataToSend);
  };

  const handleImageRemove = () => {
    if (files[0]) {
      removeFile(files[0].id);
    }
    setCurrentImage(null);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        form.reset();
        setCurrentImage(null);
        onClose();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {typeForm === "create"
              ? "Ajouter un article"
              : "Modifier l'article"}
          </DialogTitle>
          <DialogDescription>
            {typeForm === "create"
              ? "Remplissez les informations de l'article ci-dessous."
              : "Modifiez les informations de l'article ci-dessous."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="owner" className="text-right">
                Propriétaire
              </Label>
              <Select
                value={form.watch("ownerId").toString()}
                onValueChange={(value) =>
                  form.setValue("ownerId", parseInt(value))
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
              {form.formState.errors.ownerId && (
                <p className="text-red-500 text-sm col-span-3 col-start-2">
                  {form.formState.errors.ownerId.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                {...form.register("name")}
                className="col-span-3"
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm col-span-3 col-start-2">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                {...form.register("description")}
                className="col-span-3"
              />
              {form.formState.errors.description && (
                <p className="text-red-500 text-sm col-span-3 col-start-2">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Prix
              </Label>
              <Input
                id="price"
                type="number"
                {...form.register("price", { valueAsNumber: true })}
                className="col-span-3"
              />
              {form.formState.errors.price && (
                <p className="text-red-500 text-sm col-span-3 col-start-2">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <FileUpload
                id="image"
                state={fileUploadHook[0]}
                actions={{
                  ...fileUploadHook[1],
                  removeFile: handleImageRemove,
                }}
                previewUrl={currentImage}
              />
              {form.formState.errors.image && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.image.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-500 cursor-pointer transition-colors hover:bg-blue-600"
            >
              {typeForm === "create" ? "Ajouter" : "Modifier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
