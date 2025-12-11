import {
    Box,
    Flex,
    HStack,
    IconButton,
    Button,
    useDisclosure,
    Stack,
    Text,
  } from "@chakra-ui/react";
  import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
  import { Link } from "react-router-dom";
  
  const Links = [
    { name: "Home", to: "/" },
    { name: "Venues", to: "/venues" },
    { name: "Bookings", to: "/bookings" },
  ];
  
  function NavLink({ to, children }) {
    return (
      <Text
        px={3}
        py={2}
        rounded="md"
        _hover={{ bg: "blue.100", color: "blue.700" }}
      >
        <Link to={to}>{children}</Link>
      </Text>
    );
  }
  
  export default function Header() {
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    return (
      <Box bg="white" boxShadow="sm" position="sticky" top="0" zIndex="999">
        <Flex
          h={16}
          alignItems="center"
          justifyContent="space-between"
          maxW="1200px"
          mx="auto"
          px={4}
        >
          {/* LOGO */}
          <Text fontWeight="bold" fontSize="lg">
            VenueBook
          </Text>
  
          {/* Desktop Menu */}
          <HStack spacing={6} display={{ base: "none", md: "flex" }}>
            {Links.map((link) => (
              <NavLink key={link.name} to={link.to}>
                {link.name}
              </NavLink>
            ))}
          </HStack>
  
          {/* Auth Buttons */}
          <HStack spacing={4} display={{ base: "none", md: "flex" }}>
            <Link to="/login">
              <Button variant="outline" colorScheme="blue" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button colorScheme="blue" size="sm">
                Signup
              </Button>
            </Link>
          </HStack>
  
          {/* Mobile Menu Button */}
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
        </Flex>
  
        {/* Mobile Menu Items */}
        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack px={4} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.name} to={link.to}>
                  {link.name}
                </NavLink>
              ))}
  
              <Link to="/login">
                <Button colorScheme="blue" variant="outline" w="100%">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button colorScheme="blue" w="100%">
                  Signup
                </Button>
              </Link>
            </Stack>
          </Box>
        ) : null}
      </Box>
    );
  }
  