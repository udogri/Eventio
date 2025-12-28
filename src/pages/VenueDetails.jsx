import {
  Box,
  Heading,
  Text,
  Image,
  Button,
  VStack,
  Spinner,
  HStack,
  Center,
  Tag,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";
import Layout from "../components/dashboardLayout/Index";

export default function VenueDetails() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === venue.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? venue.images.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const docRef = doc(db, "venues", id);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          setVenue(snapshot.data());
        } else {
          setVenue("not_found");
        }
      } catch {
        setVenue("error");
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  if (loading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (venue === "not_found" || venue === "error") {
    return (
      <Center h="60vh" flexDir="column" gap={3}>
        <Heading size="md">Venue Not Found</Heading>
        <Text color="gray.500">This venue may have been removed.</Text>
      </Center>
    );
  }

  return (
    <Layout>
      <Box maxW="900px" mx="auto" p={6}>
        {/* IMAGE CAROUSEL */}
        <Box
          position="relative"
          w="100%"
          h="350px"
          mb={6}
          overflow="hidden"
          borderRadius="lg"
        >
          <Image
            src={venue.images[currentImage]}
            alt={venue.name}
            w="100%"
            h="100%"
            objectFit="cover"
          />

          <IconButton
            icon={<ChevronLeftIcon />}
            position="absolute"
            top="50%"
            left="10px"
            transform="translateY(-50%)"
            onClick={prevImage}
            rounded="full"
            colorScheme="blackAlpha"
          />

          <IconButton
            icon={<ChevronRightIcon />}
            position="absolute"
            top="50%"
            right="10px"
            transform="translateY(-50%)"
            onClick={nextImage}
            rounded="full"
            colorScheme="blackAlpha"
          />
        </Box>

        {/* DETAILS */}
        <Heading mb={2}>{venue.name}</Heading>

        <HStack spacing={3} mb={4}>
          <Tag colorScheme="blue">{venue.location}</Tag>
          {venue.capacity && (
            <Tag colorScheme="purple">Capacity: {venue.capacity}</Tag>
          )}
          {venue.venueType && (
            <Tag colorScheme="orange">{venue.venueType}</Tag>
          )}
        </HStack>

        <Text mb={6} color="gray.700" lineHeight="1.7">
          {venue.description}
        </Text>

        {/* AMENITIES */}
        {venue.amenities?.length > 0 && (
          <HStack spacing={2} wrap="wrap" mb={6}>
            {venue.amenities.map((item, i) => (
              <Tag key={i} colorScheme="blue">
                {item}
              </Tag>
            ))}
          </HStack>
        )}

        {/* CONTACT BUTTON */}
        <Button colorScheme="green" size="lg" w="full" onClick={onOpen}>
          Contact Venue
        </Button>

        {/* CONTACT MODAL */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Contact Venue</ModalHeader>
            <ModalCloseButton />

            <ModalBody pb={6}>
              <VStack spacing={4}>
                {/* WHATSAPP */}
                {venue.contact?.whatsapp && (
                  <Button
                    leftIcon={<FaWhatsapp />}
                    colorScheme="green"
                    w="full"
                    onClick={() =>
                      window.open(
                        venue.contact.whatsapp.startsWith("http")
                          ? venue.contact.whatsapp
                          : `https://wa.me/${venue.contact.whatsapp.replace(
                              /\D/g,
                              ""
                            )}?text=Hello, I'm interested in ${venue.name}`,
                        "_blank"
                      )
                    }
                  >
                    WhatsApp
                  </Button>
                )}

                {/* INSTAGRAM */}
                {venue.contact?.instagram && (
                  <Button
                    leftIcon={<FaInstagram />}
                    colorScheme="pink"
                    w="full"
                    onClick={() =>
                      window.open(venue.contact.instagram, "_blank")
                    }
                  >
                    Instagram
                  </Button>
                )}

                {/* EMAIL */}
                {venue.contact?.email && (
  <Button
    leftIcon={<FaEnvelope />}
    colorScheme="blue"
    w="full"
    onClick={() =>
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
          venue.contact.email
        )}&su=${encodeURIComponent(
          `Enquiry about ${venue.name}`
        )}&body=${encodeURIComponent(
          `Hello,\n\nI am interested in ${venue.name}. Please share more details.\n\nThank you.`
        )}`,
        "_blank"
      )
    }
  >
    Email
  </Button>
)}


                {/* FALLBACK */}
                {!venue.contact?.whatsapp &&
                  !venue.contact?.instagram &&
                  !venue.contact?.email && (
                    <Text color="gray.500" textAlign="center">
                      No contact information available.
                    </Text>
                  )}
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Layout>
  );
}
