import { Box, Heading, SimpleGrid, Button } from '@chakra-ui/react';


export default function Dashboard() {
return (
<Box p={6}>
<Heading size="lg" mb={6}>Admin Dashboard</Heading>
<SimpleGrid columns={[1,2,3]} spacing={6}>
<Button colorScheme="teal">Manage Venues</Button>
<Button colorScheme="teal">Bookings</Button>
<Button colorScheme="teal">Users</Button>
</SimpleGrid>
</Box>
);
}