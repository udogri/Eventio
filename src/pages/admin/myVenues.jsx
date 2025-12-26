import {
    Box,
    Heading,
    SimpleGrid,
    Spinner,
    Text,
    Button,
    HStack,
    useToast,
    Center,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
  import { getAuth } from "firebase/auth";
  import { db } from "../../firebase/firebaseConfig";
  import { Link } from "react-router-dom";
  import Layout from "../../components/dashboardLayout/Index";
  
  export default function MyVenues() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
  
    const auth = getAuth();
    const user = auth.currentUser;
  
    const fetchMyVenues = async () => {
      try {
        const q = query(
          collection(db, "venues"),
          where("ownerId", "==", user.uid)
        );
  
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setVenues(data);
      } catch (err) {
        console.error(err);
        toast({
          title: "Failed to fetch venues",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };
  
    const handleDelete = async (id) => {
      const confirm = window.confirm("Are you sure you want to delete this venue?");
      if (!confirm) return;
  
      try {
        await deleteDoc(doc(db, "venues", id));
        setVenues((prev) => prev.filter((v) => v.id !== id));
  
        toast({
          title: "Venue deleted",
          status: "success",
        });
      } catch (err) {
        toast({
          title: "Delete failed",
          description: err.message,
          status: "error",
        });
      }
    };
  
    useEffect(() => {
      if (user) fetchMyVenues();
    }, [user]);
  
    if (loading) {
      return (
        <Center h="60vh">
          <Spinner size="xl" />
        </Center>
      );
    }
  
    return (
      <Layout>
        <Box maxW="1000px" mx="auto" p={6}>
          <Heading mb={6}>My Venues</Heading>
  
          {venues.length === 0 ? (
            <Text color="gray.500">You haven’t added any venues yet.</Text>
          ) : (
            <SimpleGrid columns={[1, 2, 3]} spacing={6}>
              {venues.map((venue) => (
                <Box
                  key={venue.id}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                >
                  <Box
                    h="180px"
                    bgImage={`url(${venue.images?.[0]})`}
                    bgSize="cover"
                    bgPos="center"
                  />
  
                  <Box p={4}>
                    <Heading size="sm" mb={2}>
                      {venue.name}
                    </Heading>
  
                    <Text fontWeight="bold" mb={3}>
                      ₦{venue.price.toLocaleString()}
                    </Text>
  
                    <HStack spacing={3}>
                      <Button
                        as={Link}
                        to={`/edit-venue/${venue.id}`}
                        size="sm"
                        colorScheme="blue"
                        w="full"
                      >
                        Edit
                      </Button>
  
                      <Button
                        size="sm"
                        colorScheme="red"
                        w="full"
                        onClick={() => handleDelete(venue.id)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Layout>
    );
  }
  