import { Box, Heading, Text, Button, VStack, Container, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Flex, Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Layout from "../components/dashboardLayout/Index";
// import HeroImg from "../assets/HeroImg.jpg"; // No longer needed for dashboard
import { FaCalendarAlt, FaBuilding, FaClipboardList } from 'react-icons/fa';

export default function Home() {
  // Mock data for dashboard
  const stats = [
    { id: 1, label: "Total Venues", value: 120, icon: FaBuilding, trend: "increase", percentage: 5.3 },
    { id: 2, label: "Total Bookings", value: 450, icon: FaCalendarAlt, trend: "increase", percentage: 8.1 },
    { id: 3, label: "Pending Approvals", value: 15, icon: FaClipboardList, trend: "decrease", percentage: 2.1 },
  ];

  const recentActivities = [
    { id: 1, description: "Venue 'Grand Hall' added by Admin", date: "2026-01-04" },
    { id: 2, description: "Booking for 'Conference Room A' on 2026-02-10", date: "2026-01-03" },
    { id: 3, description: "User 'John Doe' registered", date: "2026-01-02" },
  ];

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <Heading as="h1" size="xl" mb={8}>Dashboard Overview</Heading>

        {/* Statistics Section */}
        <Box mb={10}>
          <Heading as="h2" size="lg" mb={4}>Key Statistics</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
            {stats.map((stat) => (
              <Stat p={5} shadow="md" borderWidth="1px" borderRadius="md" key={stat.id}>
                <Flex alignItems="center" mb={2}>
                  <Icon as={stat.icon} w={6} h={6} mr={3} color="blue.500" />
                  <StatLabel fontWeight="medium">{stat.label}</StatLabel>
                </Flex>
                <StatNumber fontSize="2xl">{stat.value}</StatNumber>
                <StatHelpText>
                  <StatArrow type={stat.trend === "increase" ? "increase" : "decrease"} />
                  {stat.percentage}% Last month
                </StatHelpText>
              </Stat>
            ))}
          </SimpleGrid>
        </Box>

        {/* Recent Activities Section */}
        <Box mb={10}>
          <Heading as="h2" size="lg" mb={4}>Recent Activities</Heading>
          <VStack spacing={4} align="stretch" p={5} shadow="md" borderWidth="1px" borderRadius="md">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <Box key={activity.id} p={3} bg="gray.50" borderRadius="md">
                  <Text fontSize="md" fontWeight="medium">{activity.description}</Text>
                  <Text fontSize="sm" color="gray.500">{activity.date}</Text>
                </Box>
              ))
            ) : (
              <Text>No recent activities.</Text>
            )}
          </VStack>
        </Box>

        {/* Quick Actions/Navigation Section */}
        <Box>
          <Heading as="h2" size="lg" mb={4}>Quick Actions</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
            <Link to="/venues">
              <Button w="full" colorScheme="teal" size="lg" leftIcon={<Icon as={FaBuilding} />}>
                Manage Venues
              </Button>
            </Link>
            <Link to="/admin/add-venue">
              <Button w="full" colorScheme="purple" size="lg" leftIcon={<Icon as={FaCalendarAlt} />}>
                Add New Venue
              </Button>
            </Link>
            {/* Add more links as needed, e.g., to bookings, reports */}
            <Button w="full" colorScheme="orange" size="lg" leftIcon={<Icon as={FaClipboardList} />}>
                View Reports
            </Button>
          </SimpleGrid>
        </Box>
      </Container>
    </Layout>
  );
}
