import React, { useState, useRef } from "react";
import { useAuth } from "@/hooks/queries/useAuth";
import { useUploadAvatarMutation } from "@/hooks/mutations/useUser";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Camera, Loader2, CalendarDays } from "lucide-react";

export default function Profile() {
  const { data: user, isLoading } = useAuth();
  const fileInputRef = useRef(null);

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const uploadAvatarMutation = useUploadAvatarMutation();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = () => {
    if (selectedFile) {
      uploadAvatarMutation.mutate(
        { userId: user.id, file: selectedFile },
        {
          onSuccess: () => {
            setSelectedFile(null);
            setAvatarPreview(null);
          },
        },
      );
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  const displayAvatar = avatarPreview || user?.avatar;

  return (
    <div className="flex flex-col gap-6 p-6">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-border/50">
                  <AvatarImage src={displayAvatar} className="object-cover" />
                  <AvatarFallback className="text-2xl">
                    {getInitials(user?.username)}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors hover:bg-accent"
                >
                  <Camera className="h-4 w-4 text-muted-foreground" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{user?.username}</h2>
                  <Badge variant="secondary" className="font-normal">
                    {user?.role?.name || "Member"}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {user?.role?.description || "No description provided."}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {user?.status === "active" && (
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      Active Account
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    Joined {new Date(user?.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {selectedFile ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      setAvatarPreview(null);
                    }}
                    disabled={uploadAvatarMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveAvatar}
                    disabled={uploadAvatarMutation.isPending}
                  >
                    {uploadAvatarMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Avatar
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Edit Profile Picture
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="permission" className="w-full">
        <TabsList>
          <TabsTrigger value="permission">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="permission" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Permissions</CardTitle>
              <CardDescription>
                View the permissions granted to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user?.permissions?.length > 0 ? (
                  user.permissions.map((perm) => (
                    <Badge key={perm} variant="outline" className="bg-muted/50">
                      {perm}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No specific permissions assigned.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
