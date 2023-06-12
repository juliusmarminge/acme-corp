"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import type { Crop, PixelCrop } from "react-image-crop";
import ReactCrop from "react-image-crop";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Button } from "@acme/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";
import { Input } from "@acme/ui/input";
import { useToast } from "@acme/ui/use-toast";

export function OrganizationImage(props: {
  name: string;
  image: string;
  orgId: string;
}) {
  const [imgSrc, setImgSrc] = React.useState("");
  const [cropModalOpen, setCropModalOpen] = React.useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Image</CardTitle>
        <CardDescription>
          Change your organization&apos;s avatar image
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Avatar className="h-32 w-32">
          <AvatarImage src={props.image} />
          <AvatarFallback>{props.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
      </CardContent>

      <CardFooter>
        <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
          <Input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              setCropModalOpen(true);

              const reader = new FileReader();
              reader.addEventListener("load", () => {
                setImgSrc(reader.result?.toString() ?? "");
              });
              reader.readAsDataURL(file);
            }}
          />
          <CropImageDialog
            imgSrc={imgSrc}
            close={() => setCropModalOpen(false)}
          />
        </Dialog>
      </CardFooter>
    </Card>
  );
}

function CropImageDialog(props: { imgSrc: string; close: () => void }) {
  const [crop, setCrop] = React.useState<Crop>();
  const [storedCrop, setStoredCrop] = React.useState<PixelCrop>();
  const imageRef = React.useRef<HTMLImageElement>(null);

  const [isUploading, setIsUploading] = React.useState(false);
  const { organization } = useOrganization();
  const { toast } = useToast();
  const router = useRouter();

  async function saveImage() {
    if (!imageRef.current || !storedCrop) return;
    setIsUploading(true);
    const canvas = cropImage(imageRef.current, storedCrop);

    const blob = await new Promise<Blob>((res, rej) => {
      canvas.toBlob((blob) => {
        blob ? res(blob) : rej("No blob");
      });
    });

    await organization?.setLogo({ file: blob });
    toast({
      title: "Image updated",
      description: "Your organization image has been updated.",
    });

    setIsUploading(false);
    router.refresh();
    props.close();
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Image</DialogTitle>
        <DialogDescription>
          Select the area of the image you would like to use
        </DialogDescription>
      </DialogHeader>

      <ReactCrop
        aspect={1}
        crop={crop}
        onChange={(_, percent) => setCrop(percent)}
        onComplete={(c) => setStoredCrop(c)}
      >
        {props.imgSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img ref={imageRef} src={props.imgSrc} alt="Crop me" />
        )}
      </ReactCrop>

      <DialogFooter>
        <Button onClick={saveImage}>
          {isUploading && (
            <div className="mr-1" role="status">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-background border-r-transparent" />
            </div>
          )}
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function cropImage(image: HTMLImageElement, crop: PixelCrop) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  ctx.translate(-cropX, -cropY);
  ctx.translate(centerX, centerY);
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  );

  ctx.restore();

  return canvas;
}
