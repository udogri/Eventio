import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  Heading,
  useToast,
  SimpleGrid,
  Image,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { uploadToImgBB } from "../utils/uploadToImgBB";
import Layout from "../components/dashboardLayout/Index";

export default function AddVenue() {
  const [form, setForm] = useState({
    name: "",
    location: "",
    capacity: "",
    price: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [amenityInput, setAmenityInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const toast = useToast();

  // Handle text inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add Amenity
  const handleAddAmenity = () => {
    const value = amenityInput.trim();
    if (value && !amenities.includes(value)) {
      setAmenities([...amenities, value]);
      setAmenityInput("");
    }
  };

  // Remove Amenity
  const handleRemoveAmenity = (item) => {
    setAmenities(amenities.filter((a) => a !== item));
  };

  // Image Upload Handler
  const handleImageUpload = async (e) => {
    setUploading(true);
    const files = Array.from(e.target.files);
    const uploadedUrls = [];

    for (const file of files) {
      try {
        const url = await uploadToImgBB(file);
        if (url) uploadedUrls.push(url);
      } catch (err) {
        console.error("Error uploading image:", err);
        toast({
          title: "Image upload failed",
          description: err.message || "One or more images failed to upload.",
          status: "error",
        });
      }
    }

    setImages((prev) => [...prev, ...uploadedUrls]);
    if (uploadedUrls.length > 0)
      toast({ title: "Images uploaded!", status: "success" });

    setUploading(false);
  };

  // Form Submission
  const handleSubmit = async () => {
    const { name, location, price } = form;

    if (!name || !location || !price || images.length === 0) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields and upload at least one image.",
        status: "error",
      });
      return;
    }

    setSaving(true);

    try {
      console.log("Submitting venue with data:", { ...form, images, amenities });

      await addDoc(collection(db, "venues"), {
        ...form,
        capacity: Number(form.capacity) || 0,
        price: Number(form.price),
        images,
        amenities,
        createdAt: new Date(),
      });

      toast({ title: "Venue added!", status: "success" });

      // Reset form
      setForm({
        name: "",
        location: "",
        capacity: "",
        price: "",
        description: "",
      });
      setImages([]);
      setAmenities([]);
      setAmenityInput("");

    } catch (err) {
      console.error("Error adding venue:", err);
      toast({
        title: "Error adding venue",
        description: err.message || "Something went wrong.",
        status: "error",
      });
    }

    setSaving(false);
  };

  return (
    <Layout>
      <Box maxW="700px" mx="auto" px={[4, 0]} py={6}>
        <Heading mb={6}>Add New Venue</Heading>

        <VStack spacing={5} w="100%" align="stretch">

          {/* Venue Name */}
          <FormControl isRequired>
            <FormLabel>Venue Name</FormLabel>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Royal Banquet Hall"
            />
          </FormControl>

          {/* Location */}
          <FormControl isRequired>
            <FormLabel>Location</FormLabel>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Lekki Phase 1, Lagos"
            />
          </FormControl>

          {/* Capacity */}
          <FormControl>
            <FormLabel>Capacity</FormLabel>
            <Input
              name="capacity"
              type="number"
              value={form.capacity}
              onChange={handleChange}
              placeholder="e.g. 300"
            />
          </FormControl>

          {/* Price */}
          <FormControl isRequired>
            <FormLabel>Price</FormLabel>
            <Input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 150000"
            />
          </FormControl>

          {/* Description */}
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add venue details, features, etc."
              rows={4}
            />
          </FormControl>

          {/* Amenities */}
          <FormControl>
            <FormLabel>Amenities</FormLabel>
            <HStack mb={2}>
              <Input
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="e.g. Free WiFi"
              />
              <IconButton
                icon={<AddIcon />}
                colorScheme="green"
                onClick={handleAddAmenity}
                aria-label="Add Amenity"
              />
            </HStack>

            <HStack spacing={2} wrap="wrap">
              {amenities.map((a, i) => (
                <Button
                  key={i}
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  rightIcon={<CloseIcon />}
                  onClick={() => handleRemoveAmenity(a)}
                >
                  {a}
                </Button>
              ))}
            </HStack>
          </FormControl>

          {/* Image Upload */}
          <FormControl isRequired>
            <FormLabel>Upload Images</FormLabel>
            <Input type="file" multiple onChange={handleImageUpload} />
          </FormControl>

          {/* Uploading Spinner */}
          {uploading && (
            <Box textAlign="center">
              <Spinner size="lg" />
              <Text mt={1}>Uploading images...</Text>
            </Box>
          )}

          {/* Preview Images */}
          {images.length > 0 && (
            <SimpleGrid columns={[2, 3, 4]} spacing={3}>
              {images.map((url, i) =>
                url ? (
                  <Image
                    key={i}
                    src={url}
                    alt="Venue preview"
                    rounded="md"
                    objectFit="cover"
                    height="110px"
                  />
                ) : (
                  <Box key={i} bg="gray.200" height="110px" rounded="md" />
                )
              )}
            </SimpleGrid>
          )}

          {/* Submit Button */}
          <Button
            colorScheme="blue"
            size="lg"
            onClick={handleSubmit}
            isLoading={saving}
            loadingText="Saving..."
          >
            Add Venue
          </Button>
        </VStack>
      </Box>
    </Layout>
  );
}
