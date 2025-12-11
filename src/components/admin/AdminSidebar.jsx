import { VStack, Box, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <VStack
      w="250px"
      h="100vh"
      bg="gray.800"
      color="white"
      p={4}
      spacing={4}
      align="start"
    >
      <Text fontSize="xl" fontWeight="bold">Admin Panel</Text>

      <Box><Link to="/admin">Dashboard</Link></Box>
      <Box><Link to="/admin/venues">Manage Venues</Link></Box>
      <Box><Link to="/admin/add-venue">Add Venue</Link></Box>

      <Box><Link to="/admin/arenas">Manage Arenas</Link></Box>
      <Box><Link to="/admin/add-arena">Add Arena</Link></Box>

      <Box><Link to="/admin/rentals">Manage Rentals</Link></Box>
      <Box><Link to="/admin/add-rental">Add Rental</Link></Box>

      <Box><Link to="/admin/bookings">Bookings</Link></Box>
    </VStack>
  );
}
