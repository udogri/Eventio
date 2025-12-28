import {
  Box,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  Button,
  HStack,
  Center,
  Image,
  VStack,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase/firebaseConfig";
import Layout from "../../components/dashboardLayout/Index";
import { uploadToImgBB } from "../../utils/uploadToImgBB";

export default function MyVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editingVenue, setEditingVenue] = useState(null);
  const [form, setForm] = useState({});
  const [images, setImages] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [amenityInput, setAmenityInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const auth = getAuth();
  const user = auth.currentUser;

  /* ================= FETCH ================= */
  const fetchMyVenues = async () => {
    try {
      const q = query(
        collection(db, "venues"),
        where("ownerId", "==", user.uid)
      );
      const snapshot = await getDocs(q);

      setVenues(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch {
      toast({ title: "Failed to fetch venues", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyVenues();
  }, [user]);

  /* ================= EDIT ================= */
  const openEditModal = (venue) => {
    setEditingVenue(venue);
    setForm({
      name: venue.name || "",
      location: venue.location || "",
      capacity: venue.capacity || "",
      price: venue.price || "",
      description: venue.description || "",
      contact: venue.contact || {
        instagram: "",
        whatsapp: "",
        website: "",
      },
    });
    setImages(venue.images || []);
    setAmenities(venue.amenities || []);
    onOpen();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("contact.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        contact: { ...prev.contact, [field]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddAmenity = () => {
    if (amenityInput && !amenities.includes(amenityInput)) {
      setAmenities([...amenities, amenityInput]);
      setAmenityInput("");
    }
  };

  const handleRemoveAmenity = (item) => {
    setAmenities(amenities.filter((a) => a !== item));
  };

  const handleImageUpload = async (e) => {
    setUploading(true);
    const files = Array.from(e.target.files);
    const uploaded = [];

    for (const file of files) {
      const url = await uploadToImgBB(file);
      if (url) uploaded.push(url);
    }

    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
  };

  const handleUpdate = async () => {
    if (!form.name || !form.location || !form.price || images.length === 0) {
      toast({
        title: "Missing fields",
        status: "error",
        position: "top",
      });
      return;
    }

    setSaving(true);

    try {
      await updateDoc(doc(db, "venues", editingVenue.id), {
        ...form,
        capacity: Number(form.capacity),
        price: Number(form.price),
        images,
        amenities,
        updatedAt: new Date(),
      });

      toast({ title: "Venue updated", status: "success" });

      fetchMyVenues();
      onClose();
    } catch {
      toast({ title: "Update failed", status: "error" });
    }

    setSaving(false);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this venue?")) return;

    await deleteDoc(doc(db, "venues", id));
    setVenues((prev) => prev.filter((v) => v.id !== id));
    toast({ title: "Venue deleted", status: "success" });
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Layout>
      <Box maxW="1000px" mx="auto" p={6}>
        <Heading mb={6}>My Venues</Heading>

        {venues.length === 0 ? (
          <Text color="gray.500">You haven’t added any venues yet.</Text>
        ) : (
          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {venues.map((venue) => (
              <Box key={venue.id} borderWidth="1px" rounded="lg">
                <Box
                  h="180px"
                  bgImage={`url(${venue.images?.[0]})`}
                  bgSize="cover"
                  bgPos="center"
                />
                <Box p={4}>
                  <Heading size="sm">{venue.name}</Heading>
                  <Text fontWeight="bold">
                    ₦{venue.price.toLocaleString()}
                  </Text>

                  <HStack mt={3}>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      w="full"
                      onClick={() => openEditModal(venue)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      w="full"
                      onClick={() => handleDelete(venue.id)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>

      {/* ================= EDIT MODAL ================= */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Venue</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              <Input name="name" value={form.name} onChange={handleChange} placeholder="Venue Name" />
              <Input name="location" value={form.location} onChange={handleChange} placeholder="Location" />
              <Input name="capacity" type="number" value={form.capacity} onChange={handleChange} placeholder="Capacity" />
              <Input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" />
              <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />

              <Input name="contact.instagram" value={form.contact?.instagram || ""} onChange={handleChange} placeholder="Instagram" />
              <Input name="contact.whatsapp" value={form.contact?.whatsapp || ""} onChange={handleChange} placeholder="WhatsApp" />
              <Input name="contact.website" value={form.contact?.website || ""} onChange={handleChange} placeholder="Website" />

              {/* Amenities */}
              <HStack w="full">
                <Input value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} />
                <IconButton icon={<AddIcon />} onClick={handleAddAmenity} />
              </HStack>

              <HStack wrap="wrap">
                {amenities.map((a, i) => (
                  <Button key={i} size="sm" rightIcon={<CloseIcon />} onClick={() => handleRemoveAmenity(a)}>
                    {a}
                  </Button>
                ))}
              </HStack>

              {/* Images */}
              <Input type="file" multiple onChange={handleImageUpload} />

              {images.length > 0 && (
                <SimpleGrid columns={3} spacing={2}>
                  {images.map((img, i) => (
                    <Image key={i} src={img} h="80px" objectFit="cover" />
                  ))}
                </SimpleGrid>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3}>Cancel</Button>
            <Button colorScheme="blue" onClick={handleUpdate} isLoading={saving}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
}

