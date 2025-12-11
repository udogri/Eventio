import { Box } from "@chakra-ui/react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <Box flex="1" as="main" px={4} py={6}>
        {children}
      </Box>

      {/* FOOTER */}
      <Footer />
    </Box>
  );
}
