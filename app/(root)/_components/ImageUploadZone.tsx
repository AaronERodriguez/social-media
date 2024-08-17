import { useMutation } from "convex/react";
import { UploadButton, UploadFileResponse } from "@xixixao/uploadstuff/react";
import "@xixixao/uploadstuff/react/styles.css";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

type Props = {
    filetype: string;
}

export function ImageUploadZone({filetype}: Props) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveStorageId = useMutation(api.files.saveStorageId);
    const saveAfterUpload = async (uploaded: UploadFileResponse[]) => {
        await saveStorageId({
            storageId: (uploaded[0].response as any).storageId,
            type: filetype
        });
        toast.success("Uploaded image successfully")
    };

  return (
    <div className="flex justify-center items-center">
        <UploadButton 
            uploadUrl={generateUploadUrl}
            fileTypes={filetype === 'videos' ? (["video/*"]) : (["image/*"])}
            onUploadComplete={saveAfterUpload}
            onUploadError={(error: unknown) => {
                console.error(error);
            }}
        />
    </div>
  );
}