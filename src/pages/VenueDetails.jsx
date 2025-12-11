// src/pages/VenueDetails.jsx
import {
    Box,
    Heading,
    Text,
    Image,
    Button,
    VStack,
    Spinner,
    SimpleGrid,
    Badge,
    HStack,
    Center,
    Tag
  } from "@chakra-ui/react";
  import { useParams } from "react-router-dom";
  import { db } from "../firebase/firebaseConfig";
  import { doc, getDoc } from "firebase/firestore";
  import { useEffect, useState } from "react";
import Layout from "../components/dashboardLayout/Index";
  
  export default function VenueDetails() {
    const { id } = useParams();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
  
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
  
    // Loading State
    if (loading) {
      return (
        <Center h="60vh">
          <Spinner size="xl" />
        </Center>
      );
    }
  
    // Error or Not Found
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
        {/* IMAGE GALLERY */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
          <Image
            src={venue.images?.[0]}
            alt={venue.name}
            borderRadius="lg"
            objectFit="cover"
            h="250px"
          />
  
          <VStack spacing={3}>
            {venue.images?.slice(1).map((img, index) => (
              <Image
                key={index}
                src={img}
                alt="Venue"
                borderRadius="lg"
                objectFit="cover"
                w="100%"
                h="115px"
              />
            ))}
          </VStack>
        </SimpleGrid>
  
        {/* VENUE DETAILS */}
        <Heading mb={2}>{venue.name}</Heading>
  
        <HStack spacing={3} mb={3}>
          <Badge colorScheme="blue" px={3} py={1}>
            Capacity: {venue.capacity}
          </Badge>
          <Badge colorScheme="green" px={3} py={1}>
            ₦{venue.price.toLocaleString()}
          </Badge>
        </HStack>
  
        <Text mb={6} color="gray.700" lineHeight="1.7">
          {venue.description}
        </Text>
<HStack spacing={2} mb={6}>
  {venue.amenities?.map((amenity, i) => (
    <Tag key={i} colorScheme="blue" variant="solid">
      {amenity}
    </Tag>
  ))}
</HStack>

  
        <Button colorScheme="blue" w="full" size="lg">
          Book Now
        </Button>
      </Box>
      </Layout>
    );
  }
  