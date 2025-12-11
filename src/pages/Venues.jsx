import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import VenueCard from "../components/VenueCard";
import {
  SimpleGrid,
  Heading,
  Box,
  Text,
  Skeleton,
  SkeletonText,
  VStack,
} from "@chakra-ui/react";
import Layout from "../components/dashboardLayout/Index";

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "venues"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVenues(data);
      } catch (err) {
        setError("Failed to load venues. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  return (
    <Layout>
      <Box maxW="1200px" mx="auto" px={[4, 4, 0]} py={6}>
        <Heading mb={6} fontSize={["2xl", "3xl"]}>
          Event Venues
        </Heading>

        {/* Error Message */}
        {error && (
          <Text color="red.500" mb={4} fontWeight="medium">
            {error}
          </Text>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Box key={i} p={4} borderWidth="1px" rounded="lg">
                <Skeleton height="150px" mb={4} />
                <SkeletonText />
              </Box>
            ))}
          </SimpleGrid>
        )}

        {/* Empty State */}
        {!loading && venues.length === 0 && (
          <VStack mt={10} spacing={3} opacity={0.7}>
            <Text fontSize="xl" fontWeight="medium">
              No venues available yet.
            </Text>
            <Text fontSize="md">Please check back later.</Text>
          </VStack>
        )}

        {/* Venues Grid */}
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
  {venues.map((venue) => (
    <VenueCard key={venue.id} venue={venue} maxH="350px" />
  ))}
</SimpleGrid>

      </Box>
    </Layout>
  );
}
