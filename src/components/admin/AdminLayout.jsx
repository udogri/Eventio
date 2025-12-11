import { Flex, Box } from "@chakra-ui/react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <Flex>
      <AdminSidebar />
      <Box flex="1" p={6} bg="gray.50" minH="100vh">
        {children}
      </Box>
    </Flex>
  );
}
