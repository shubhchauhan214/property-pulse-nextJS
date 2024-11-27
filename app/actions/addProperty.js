"use server";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/config/cloudinary";

async function addProperty(formData) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }

  const { userId } = sessionUser;

  // Access all values from amenities and images
  const amenities = formData.getAll("amenities");
  const images = formData.getAll("images").filter(
    (image) => image.name !== '');

  if (images.length === 0) {
    throw new Error("No valid images were provided.");
  }

  const propertyData = {
    owner: userId,
    type: formData.get("type"),
    name: formData.get("name"),
    description: formData.get("description"),
    location: {
      street: formData.get("location.street"),
      city: formData.get("location.city"),
      state: formData.get("location.state"),
      zipcode: formData.get("location.zipcode"),
    },
    beds: formData.get("beds"),
    baths: formData.get("baths"),
    square_feet: formData.get("square_feet"),
    amenities,
    rates: {
      weekly: formData.get("rates.weekly"),
      monthly: formData.get("rates.monthly"),
      nightly: formData.get("rates.nightly"),
    },
    seller_info: {
      name: formData.get("seller_info.name"),
      email: formData.get("seller_info.email"),
      phone: formData.get("seller_info.phone"),
    },
  };

  const imageUrls = [];
  const failedUploads = [];

  for (const imageFile of images) {
    try {
      const imageBuffer = await imageFile.arrayBuffer();
      const imageArray = new Uint8Array(imageBuffer);
      const imageData = Buffer.from(imageArray);

      // Detect MIME type dynamically
      const mimeType = imageFile.type;
      const base64Image = `data:${mimeType};base64,${imageData.toString("base64")}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "propertypulse",
      });

      imageUrls.push(result.secure_url);
    } catch (error) {
      console.error("Error uploading image:", imageFile.name, error);
      failedUploads.push(imageFile.name);
    }
  }

  if (failedUploads.length > 0) {
    console.warn("Some images failed to upload:", failedUploads);
  }

  propertyData.images = imageUrls;

  const newProperty = new Property(propertyData);
  await newProperty.save();

  // Revalidate the necessary path
  revalidatePath("/");

  // Redirect to the new property page
  redirect(`/properties/${newProperty._id}`);
}

export default addProperty;
