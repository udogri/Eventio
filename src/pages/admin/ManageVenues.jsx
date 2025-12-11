// src/pages/ManageVenues.jsx
import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import VenueCard from "../../components/VenueCard";


export default function ManageVenues() {
return (
<Box p={8}>
<Heading size="lg" mb={6}>Manage Venues</Heading>
<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
<VenueCard />
<VenueCard />
<VenueCard />
</SimpleGrid>
</Box>
);
}