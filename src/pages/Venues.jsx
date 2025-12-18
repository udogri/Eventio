import { SimpleGrid, Box, Input, VStack, Button, Flex } from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VenueCard from "../components/VenueCard";
import Layout from "../components/dashboardLayout/Index";

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [location, setLocation] = useState("");

  useEffect(() => {
    async function fetchVenues() {
      const snap = await getDocs(collection(db, "venues"));
      setVenues(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchVenues();
  }, []);

  const filtered = venues.filter(v =>
    location
      ? v.location?.toLowerCase().includes(location.toLowerCase())
      : true
  );

  return (
    <Layout>
      <Box maxW="1200px" mx="auto" p={6}>
        {/* Header */}
        <Flex mb={6} justify="space-between" align="center">
          <Input
            maxW="300px"
            placeholder="Search by location"
            onChange={e => setLocation(e.target.value)}
          />

          <Link to="/admin/add-venue">
            <Button colorScheme="blue">
              Add Venue
            </Button>
          </Link>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {filtered.map(v => (
            <VenueCard key={v.id} venue={v} />
          ))}
        </SimpleGrid>
      </Box>
    </Layout>
  );
}
