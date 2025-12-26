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
    contact: {
      instagram: "",
      whatsapp: "",
      website: "",
    },
  });

  const [images, setImages] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [amenityInput, setAmenityInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const toast = useToast();

  // Handle text inputs (supports nested contact fields)
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("contact.")) {
      const field = name.split(".")[1];
      setForm({
        ...form,
        contact: {
          ...form.contact,
          [field]: value,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
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
        toast({
          title: "Image upload failed",
          status: "error",
        });
      }
    }

    setImages((prev) => [...prev, ...uploadedUrls]);
    setUploading(false);
  };

  // Submit Form
  const handleSubmit = async () => {
    const { name, location, price } = form;

    if (!name || !location || !price || images.length === 0) {
      toast({
        title: "Missing fields",
        description: "Fill required fields and upload at least one image.",
        status: "error",
      });
      return;
    }

    setSaving(true);

    try {
      await addDoc(collection(db, "venues"), {
        ...form,
        capacity: Number(form.capacity) || 0,
        price: Number(form.price),
        images,
        amenities,
        createdAt: new Date(),
      });

      toast({ title: "Venue added!", status: "success" });

      // Reset
      setForm({
        name: "",
        location: "",
        capacity: "",
        price: "",
        description: "",
        contact: {
          instagram: "",
          whatsapp: "",
          website: "",
        },
      });
      setImages([]);
      setAmenities([]);
      setAmenityInput("");

    } catch (err) {
      toast({
        title: "Error adding venue",
        status: "error",
      });
    }

    setSaving(false);
  };

  return (
    <Layout>
      <Box maxW="700px" mx="auto" py={6}>
        <Heading mb={6}>Add New Venue</Heading>

        <VStack spacing={5} align="stretch">

          <FormControl isRequired>
            <FormLabel>Venue Name</FormLabel>
            <Input name="name" value={form.name} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Location (City + Area)</FormLabel>
            <Input name="location" value={form.location} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Capacity</FormLabel>
            <Input name="capacity" type="number" value={form.capacity} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Price</FormLabel>
            <Input name="price" type="number" value={form.price} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea name="description" value={form.description} onChange={handleChange} />
          </FormControl>

          {/* Contact Details */}
          <FormControl>
            <FormLabel>Contact Details (optional)</FormLabel>
            <VStack spacing={3}>
              <Input
                name="contact.instagram"
                value={form.contact.instagram}
                onChange={handleChange}
                placeholder="Instagram link"
              />
              <Input
                name="contact.whatsapp"
                value={form.contact.whatsapp}
                onChange={handleChange}
                placeholder="WhatsApp number or wa.me link"
              />
              <Input
                name="contact.website"
                value={form.contact.website}
                onChange={handleChange}
                placeholder="Website URL"
              />
            </VStack>
          </FormControl>

          {/* Amenities */}
          <FormControl>
            <FormLabel>Amenities</FormLabel>
            <HStack mb={2}>
              <Input
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
              />
              <IconButton
                icon={<AddIcon />}
                onClick={handleAddAmenity}
                aria-label="Add amenity"
              />
            </HStack>

            <HStack wrap="wrap">
              {amenities.map((a, i) => (
                <Button
                  key={i}
                  size="sm"
                  rightIcon={<CloseIcon />}
                  onClick={() => handleRemoveAmenity(a)}
                >
                  {a}
                </Button>
              ))}
            </HStack>
          </FormControl>

          {/* Images */}
          <FormControl isRequired>
            <FormLabel>Upload Images</FormLabel>
            <Input type="file" multiple onChange={handleImageUpload} />
          </FormControl>

          {uploading && (
            <Box textAlign="center">
              <Spinner />
              <Text>Uploading...</Text>
            </Box>
          )}

          {images.length > 0 && (
            <SimpleGrid columns={[2, 3]} spacing={3}>
              {images.map((url, i) => (
                <Image key={i} src={url} h="100px" objectFit="cover" rounded="md" />
              ))}
            </SimpleGrid>
          )}

          <Button
            colorScheme="blue"
            size="lg"
            onClick={handleSubmit}
            isLoading={saving}
          >
            Add Venue
          </Button>

        </VStack>
      </Box>
    </Layout>
  );
}
