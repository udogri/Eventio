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
  } from "@chakra-ui/react";
  import { useParams } from "react-router-dom";
  import { db } from "../firebase/firebaseConfig";
  import { doc, getDoc } from "firebase/firestore";
  import { useEffect, useState } from "react";
  import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
  import Layout from "../components/dashboardLayout/Index";
  
  export default function VenueDetails() {
    const { id } = useParams();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
  
    // Carousel
    const [currentImage, setCurrentImage] = useState(0);
  
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
        } catch (error) {
          console.error("Error fetching venue:", error);
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
              borderRadius="lg"
              transition="0.3s ease"
            />
  
            {/* Prev Button */}
            <IconButton
              icon={<ChevronLeftIcon />}
              position="absolute"
              top="50%"
              left="10px"
              transform="translateY(-50%)"
              onClick={prevImage}
              colorScheme="blackAlpha"
              rounded="full"
              size="lg"
            />
  
            {/* Next Button */}
            <IconButton
              icon={<ChevronRightIcon />}
              position="absolute"
              top="50%"
              right="10px"
              transform="translateY(-50%)"
              onClick={nextImage}
              colorScheme="blackAlpha"
              rounded="full"
              size="lg"
            />
          </Box>
  
          {/* DETAILS */}
          <Heading mb={2}>{venue.name}</Heading>
  
          <HStack spacing={3} mb={3}>
            <Tag colorScheme="blue" px={3} py={1}>
              Capacity: {venue.capacity}
            </Tag>
            <Tag colorScheme="green" px={3} py={1}>
              ₦{venue.price.toLocaleString()}
            </Tag>
          </HStack>
  
          <Text mb={6} color="gray.700" lineHeight="1.7">
            {venue.description}
          </Text>
  
          {/* AMENITIES */}
          <HStack spacing={3} wrap="wrap" mb={6}>
            {venue.amenities?.map((amenity, i) => (
              <Tag key={i} colorScheme="blue">
                {amenity}
              </Tag>
            ))}
          </HStack>
  
          {/* CONTACT BUTTON (WhatsApp Example) */}
          <Button
            colorScheme="green"
            w="full"
            size="lg"
            onClick={() =>
              window.open(
                `https://wa.me/2348012345678?text=Hello, I'm interested in booking the venue: ${venue.name}`,
                "_blank"
              )
            }
          >
            Contact
          </Button>
        </Box>
      </Layout>
    );
  }
  